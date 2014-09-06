/*
File: FnLoadCode.js
Parses XML interface files and transfers data to Interface variable.
*/

function LoadFile(Path)
{
	Debugging.Trace("<-- Start file load. -->");
	if (NowEditing === 0)
	{
		FilePath = Path;
	}
	var Directory = Path.split("\\");
	Debugging.Trace("--> File to load: " + Directory[Directory.length - 1]);
	delete Directory[Directory.length - 1]; // remove the file name, leaving the directory's path
	Directory = Directory.join("\\");
	Directory = Directory.substr(0, Directory.length - 1);
	Debugging.Trace("--> | In directory: " + Directory);
	Debugging.Trace("--> Checking existance of file and directories...");
	var ErrorMessage = "";
	if (FSO.FolderExists(Directory)) // does the chosen directory exist?
	{
		Debugging.Trace("--> | Directory exists.");
		if (FSO.FileExists(Path)) // does the chosen file exist?
		{
			Debugging.Trace("--> | File exists.");
			if (!Registry.Exists("Options\\ChkUnlockIntDir") && Directory.indexOf(MsgPlus.ScriptFilesPath) !== -1 && Path !== PresetFile) // opening files in the script's directory isn't allowed (unless it's the preset file)
			{
				Debugging.Trace("--> | File is in a directory of restricted access.");
				ErrorMessage = "Interfaces in this folder are not allowed to be accessed.";
			}
			else
			{
				Debugging.Trace("--> | File is in accessible directory.");
				var Errors = new Array();
				var Fatal = false;
				Debugging.Trace("--> Testing for valid XML...");
				if (XMLO.load(Path)) // is it an XML file?
				{
					Debugging.Trace("--> | XML is valid.");
					if (XMLO.selectSingleNode("//Interfaces") === null) // is it an interface file?
					{
						Debugging.Trace("--> | Root <Interfaces> node not found.");
						Errors.push("! | The interface file must contain a root <Interfaces> tag.\n--> Line number: 1 (position 1)");
						Fatal = true;
					}
					else
					{
						Debugging.Trace("--> | Root <Interfaces> node found.");
						Debugging.Trace("--> Enumerating windows...");
						var WindowEnum = new Enumerator(XMLO.selectNodes("//Interfaces/Window"));
						var Count = 0;
						var Total = WindowEnum.count();
						for (; !WindowEnum.atEnd(); WindowEnum.moveNext()) // loop through each window in the file
						{
							Count++;
							Debugging.Trace("--> | Processing window " + Count + " of " + Total + " (" + ((Count / Total) * 100) + "%)...");
							var WindowNode = WindowEnum.item();
							var WindowId = WindowNode.getAttribute("Id");
							if (WindowId === null) // no ID?
							{
								Debug.Trace("--> | | Window has no ID defined.");
								Errors.push("No ID attribute defined for unknown window.\n--> This window will be ignored.");
							}
							else if (WindowId in Interface.Window) // that ID's already used
							{
								Debug.Trace("--> | | Window ID already in use.");
								Errors.push("A window with the ID \"" + WindowId + "\" already exists.\n--> Consequent occurences of this window will be ignored.");
							}
							else
							{
								Debugging.Trace("--> | | Processing window \"" + WindowId + "\"...");
								var WindowXMLPath = "//Interfaces/Window[@Id=\"" + WindowId + "\"]/";
								// built tag has been deprecated (now ignored)
								if (XMLO.selectSingleNode(WindowXMLPath + "DialogTmpl") !== null)
								{
									var WindowTemplate = 0;
								}
								else if (XMLO.selectSingleNode(WindowXMLPath + "WindowTmpl") !== null)
								{
									var WindowTemplate = 1;
								}
								else if (XMLO.selectSingleNode(WindowXMLPath + "ChildTmpl") !== null)
								{
									var WindowTemplate = 2;
								}
								else // no template found
								{
									Debugging.Trace("--> | | No template tag (default: 0).");
									Errors.push("No template tag found for window \"" + WindowId + "\".\n--> A default of \"DialogTmpl\" will be used.");
									var WindowTemplate = 0;
								}
								if (WindowTemplate !== 2) // not a child window
								{
									if (WindowTemplate === 0) // dialog window
									{
										try
										{
											var WindowBottomBar = XMLO.selectSingleNode(WindowXMLPath + "DialogTmpl/BottomBar").getAttribute("Style");
											for (var X in EnumWindowBottomBar) // loop through enumerations
											{
												if (WindowBottomBar === EnumWindowBottomBar[X])
												{
													WindowBottomBar = X;
													break;
												}
											}
										}
										catch (error)
										{
											var WindowBottomBar = 0; // no bottom bar
										}
									}
									else
									{
										var WindowBottomBar = 0; // no bottom bar (default when not available)
									}
									try
									{
										var Icon = XMLO.selectSingleNode(WindowXMLPath + "TitleBar/Title/Prefix").text;
										var WindowIcon = (Icon === "Image" || Icon === "Full");
									}
									catch (error)
									{
										var WindowIcon = false;
									}
									try
									{
										var WindowTitle = XMLO.selectSingleNode(WindowXMLPath + "TitleBar/Title/Text").text;
									}
									catch (error)
									{
										var WindowTitle = "";
									}
								}
								else
								{
									var WindowIcon = false;
									var WindowTitle = "";
								}
								var WindowPosNode = XMLO.selectSingleNode(WindowXMLPath + "Position");
								try
								{
									var WindowWidth = WindowPosNode.getAttribute("Width").toString();
								}
								catch (error) // if no width tag, try client attribute
								{
									try
									{
										var WindowWidth = WindowPosNode.getAttribute("ClientWidth").toString();
									}
									catch (error)
									{
										Errors.push("No width tag found for window \"" + WindowId + "\".\n--> A default of 600 will be used.");
										var WindowWidth = "600";
									}
								}
								try
								{
									var WindowHeight = WindowPosNode.getAttribute("Height").toString();
								}
								catch (error) // if no height tag, try client attribute
								{
									try
									{
										var WindowHeight = WindowPosNode.getAttribute("ClientHeight").toString();
									}
									catch (error)
									{
										Errors.push("No height tag found for window \"" + WindowId + "\".\n--> A default of 450 will be used.");
										var WindowHeight = "450";
									}
								}
								if (WindowTemplate !== 2) // not a child window
								{
									var WindowInitialPos = WindowPosNode.getAttribute("InitialPos");
									if (WindowInitialPos === null)
									{
										var WindowInitialPos = 1;
									}
									else
									{
										for (var X in EnumWindowInitialPos) // loop through enumerations
										{
											if (WindowInitialPos === EnumWindowInitialPos[X])
											{
												WindowInitialPos = X;
												break;
											}
										}
									}
									try // will accept just horizontal or vertical, but choice not available in the editor
									{
										var WindowPosResizeNode = XMLO.selectSingleNode(WindowXMLPath + "Position/Resizeable");
										var WindowResizeable = (WindowPosResizeNode.getAttribute("Allowed") !== "NotResizeable");
									}
									catch (error)
									{
										var WindowResizeable = false;
									}
									try
									{
										var WindowPosAbsoluteNode = XMLO.selectSingleNode(WindowXMLPath + "Position/IsAbsolute");
										var WindowIsAbsolute = (WindowPosAbsoluteNode.text.toLowerCase() === "true");
									}
									catch (error)
									{
										var WindowIsAbsolute = false;
									}
									try
									{
										var WindowMinimize = XMLO.selectSingleNode(WindowXMLPath + "TitleBar/AllowMinimize").text;
										if (WindowMinimize === "false")
										{
											WindowMinimize = false;
										}
										else
										{
											WindowMinimize = true;
										}
									}
									catch (error)
									{
										var WindowMinimize = true;
									}
									try
									{
										var WindowMaximize = XMLO.selectSingleNode(WindowXMLPath + "TitleBar/AllowMaximize").text;
										if (WindowMaximize === "true")
										{
											WindowMaximize = true;
										}
										else
										{
											WindowMaximize = false;
										}
									}
									catch (error)
									{
										var WindowMaximize = false;
									}
									try
									{
										var WindowClose = XMLO.selectSingleNode(WindowXMLPath + "TitleBar/AllowClose").text;
										if (WindowClose === "false")
										{
											WindowClose = false;
										}
										else
										{
											WindowClose = true;
										}
									}
									catch (error)
									{
										var WindowClose = true;
									}
								}
								else // defaults
								{
									var WindowInitialPos = 1;
									var WindowResizeable = false;
									var WindowAlwaysOnTop = false;
									var WindowMinimize = false;
									var WindowMaximize = false;
									var WindowClose = false;
								}
								var WindowExtra = ""; // take the entire window code, filter out known nodes/attributes
								var WindowExtraProcess = WindowNode.xml; // everything else goes into the extra code
								WindowExtraProcess = WindowExtraProcess.replace(/<\/?Window.*>/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<WriterInfo>[^ ]*?<\/WriterInfo>/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<TitleBar>[^ ]*?<\/TitleBar>/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<Position[^ ]*?(\/>|>[^ ]*?<\/Position>)/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<DialogTmpl[^ ]*?(\/>|>[^ ]*?<\/DialogTmpl>)/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<WindowTmpl[^ ]*?(\/>|>[^ ]*?<\/WindowTmpl>)/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<ChildTmpl\/>/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<Controls>[^ ]*?<\/Controls>/g, "");
								WindowExtraProcess = WindowExtraProcess.replace(/<Elements>[^ ]*?<\/Elements>/g, "");
								WindowExtraProcess = WindowExtraProcess.split("\r\n");
								WindowExtraFilter = new Array();
								for (var X in WindowExtraProcess)
								{
									if (WindowExtraProcess[X].replace(/\s/g, "") !== "") // filter out blank lines
									{
										WindowExtraFilter.push(WindowExtraProcess[X].replace(/\t/, ""));
									}
								}
								WindowExtra = WindowExtraFilter.join("\r\n");
								Writer.AddWnd(WindowId, WindowIcon, WindowTitle, WindowTemplate, WindowBottomBar, WindowWidth, WindowHeight, WindowInitialPos, WindowResizeable, WindowIsAbsolute, WindowMinimize, WindowMaximize, WindowClose, WindowExtra); // add to interface
								var ControlsNode = XMLO.selectSingleNode(WindowXMLPath + "Controls");
								ControlComment = "";
								if (ControlsNode !== null)
								{
									var ControlEnum = new Enumerator(ControlsNode.childNodes);
									for (; !ControlEnum.atEnd(); ControlEnum.moveNext()) // loop through each control in the window
									{
										var ControlNode = ControlEnum.item();
										if (ControlNode.nodeName === "#comment")
										{
											ControlComment = ControlNode.nodeValue;
											ControlComment = ControlComment.substr(1, ControlComment.length - 2);
										}
										else if (ControlNode.nodeName === "Control")
										{
											var ControlId = ControlNode.getAttribute("Id");
											if (ControlId === null)
											{
												Errors.push("No ID attribute defined for unknown control in window \"" + WindowId + "\".\n--> This control will be ignored.");
											}
											else if (ControlId in Interface.Window[WindowId].Control)
											{
												Errors.push("A control with the ID \"" + ControlId + "\" in window \"" + WindowId + "\" already exists.\n--> Consequent occurences of this control will be ignored.");
											}
											else
											{
												Debugging.Trace("--> | | | Processing control \"" + ControlId + "\" in window \"" + WindowId + "\"...");
												var ControlType = ControlNode.getAttribute("xsi:type");
												var ControlXMLPath = WindowXMLPath + "Controls/Control[@Id=\"" + ControlId + "\"]/";
												for (var X in EnumControlType) // loop through enumerations
												{
													if (ControlType.toLowerCase() === EnumControlType[X].toLowerCase())
													{
														ControlType = X;
														break;
													}
												}
												if (ControlType === null)
												{
													Errors.push("No type attribute defined for control " + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
												}
												else if (isNaN(ControlType))
												{
													Errors.push("Invalid control type \"" + ControlType + "\" for control " + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
												}
												else
												{
													var ControlPosNode = XMLO.selectSingleNode(ControlXMLPath + "Position");
													try
													{
														try
														{
															var ControlLeft = ControlPosNode.getAttribute("Left").toString();
														}
														catch (error)
														{
															Errors.push("No left tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> A default of 0 will be used.");
															var ControlLeft = "0";
														}
														try
														{
															var ControlTop = ControlPosNode.getAttribute("Top").toString();
														}
														catch (error)
														{
															Errors.push("No top tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> A default of 0 will be used.");
															var ControlTop = "0";
														}
														try
														{
															var ControlWidth = ControlPosNode.getAttribute("Width").toString();
														}
														catch (error)
														{
															Errors.push("No width tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> A default of 50 will be used.");
															var ControlWidth = "50";
														}
														try
														{
															var ControlHeight = ControlPosNode.getAttribute("Height").toString();
														}
														catch (error)
														{
															var ControlHeight = "";
														}
														var ControlPosAnchorNode = XMLO.selectSingleNode(ControlXMLPath + "Position/Anchor");
														try
														{
															var ControlAnchorH = ControlPosAnchorNode.getAttribute("Horizontal").toString();
															for (var X in EnumControlElementAnchorH) // loop through enumerations
															{
																if (ControlAnchorH == EnumControlElementAnchorH[X])
																{
																	ControlAnchorH = X;
																	break;
																}
															}
														}
														catch (error)
														{
															var ControlAnchorH = 0;
														}
														try
														{
															var ControlAnchorV = ControlPosAnchorNode.getAttribute("Vertical").toString();
															for (var X in EnumControlElementAnchorV) // loop through enumerations
															{
																if (ControlAnchorV == EnumControlElementAnchorV[X])
																{
																	ControlAnchorV = X;
																	break;
																}
															}
														}
														catch (error)
														{
															var ControlAnchorV = 0;
														}
														try
														{
															var ControlCaption = XMLO.selectSingleNode(ControlXMLPath + "Caption").text.replace(/&amp;/g, "&");
														}
														catch (error)
														{
															var ControlCaption = "";
														}
														try
														{
															var ControlHelp = XMLO.selectSingleNode(ControlXMLPath + "Help").text.replace(/&amp;/g, "&");
														}
														catch (error)
														{
															var ControlHelp = "";
														}
														var ControlLocation = 0;
														try
														{
															var ControlEnabled = ControlNode.getAttribute("Enabled").toLowerCase() === "true";
														}
														catch (error)
														{
															var ControlEnabled = true;
														}
														try
														{
															var ControlVisible = ControlNode.getAttribute("Visible").toLowerCase() === "true";
														}
														catch (error)
														{
															var ControlVisible = true;
														}
														var ControlExtra = ""; // same as window extra code filtering
														var ControlExtraProcess = ControlNode.xml;
														ControlExtraProcess = ControlExtraProcess.replace(/<\/?Control.*>/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Position[^ ]*?(\/>|>[^ ]*?<\/Position>)/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Caption>[^ ]*?<\/Caption>/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Help>[^ ]*?<\/Help>/g, "");
														ControlExtraProcess = ControlExtraProcess.split("\r\n");
														ControlExtraFilter = new Array();
														for (var X in ControlExtraProcess)
														{
															if (ControlExtraProcess[X].replace(/\s/g, "") !== "")
															{
																ControlExtraFilter.push(ControlExtraProcess[X].replace(/\t/, ""));
															}
														}
														ControlExtraFilter = ControlExtraFilter.join("\r\n");
														if (ControlExtraFilter !== "")
														{
															ControlExtra = ControlExtraFilter;
														}
														Writer.AddCtrl(WindowId, ControlId, ControlType, ControlLeft, ControlTop, ControlWidth, ControlHeight, ControlAnchorH, ControlAnchorV, ControlCaption, ControlHelp, ControlLocation, ControlComment, ControlEnabled, ControlVisible, ControlExtra); // add to interface
														ControlComment = "";
													}
													catch (error)
													{
														Errors.push("No position tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
													}
												}
											}
										}
										else
										{
											Errors.push("Unknown control node \"" + ControlNode.nodeName + "\" in window \"" + WindowId + "\".\n--> This node will be ignored.");
										}
									}
								}
								var ControlsNode = XMLO.selectSingleNode(WindowXMLPath + "DialogTmpl/BottomBar/LeftControls");
								if (ControlsNode !== null)
								{
									var ControlEnum = new Enumerator(ControlsNode.childNodes);
									for (; !ControlEnum.atEnd(); ControlEnum.moveNext()) // loop through each control in the window (left bottom bar)
									{
										var ControlNode = ControlEnum.item();
										if (ControlNode.nodeName === "#comment")
										{
											ControlComment = ControlNode.nodeValue;
											ControlComment = ControlComment.substr(1, ControlComment.length - 2);
										}
										else if (ControlNode.nodeName === "Control")
										{
											var ControlId = ControlNode.getAttribute("Id");
											if (ControlId === null)
											{
												Errors.push("No ID attribute defined for unknown control in window \"" + WindowId + "\".\n--> This control will be ignored.");
											}
											else if (ControlId in Interface.Window[WindowId].Control)
											{
												Errors.push("A control with the ID \"" + ControlId + "\" in window \"" + WindowId + "\" already exists.\n--> Consequent occurences of this control will be ignored.");
											}
											else
											{
												Debugging.Trace("--> | | | Processing control \"" + ControlId + "\" in window \"" + WindowId + "\"...");
												var ControlType = ControlNode.getAttribute("xsi:type");
												var ControlXMLPath = WindowXMLPath + "DialogTmpl/BottomBar/LeftControls/Control[@Id=\"" + ControlId + "\"]/";
												for (var X in EnumControlType) // loop through enumerations
												{
													if (ControlType.toLowerCase() === EnumControlType[X].toLowerCase())
													{
														ControlType = X;
														break;
													}
												}
												if (ControlType === null)
												{
													Errors.push("No type attribute defined for control " + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
												}
												else if (isNaN(ControlType))
												{
													Errors.push("Invalid control type \"" + ControlType + "\" for control " + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
												}
												else
												{
													var ControlPosNode = XMLO.selectSingleNode(ControlXMLPath + "Position");
													var ControlLeft = "";
													var ControlTop = "";
													try
													{
														try
														{
															var ControlWidth = ControlPosNode.getAttribute("Width").toString();
														}
														catch (error)
														{
															Errors.push("No width tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> A default of 50 will be used.");
															var ControlWidth = "50";
														}
														try
														{
															var ControlHeight = ControlPosNode.getAttribute("Height").toString();
														}
														catch (error)
														{
															var ControlHeight = "";
														}
														var ControlPosAnchorNode = XMLO.selectSingleNode(ControlXMLPath + "Position/Anchor");
														try
														{
															var ControlAnchorH = ControlPosAnchorNode.getAttribute("Horizontal").toString();
															for (var X in EnumControlElementAnchorH) // loop through enumerations
															{
																if (ControlAnchorH == EnumControlElementAnchorH[X])
																{
																	ControlAnchorH = X;
																	break;
																}
															}
														}
														catch (error)
														{
															var ControlAnchorH = 0;
														}
														try
														{
															var ControlAnchorV = ControlPosAnchorNode.getAttribute("Vertical").toString();
															for (var X in EnumControlElementAnchorV) // loop through enumerations
															{
																if (ControlAnchorV == EnumControlElementAnchorV[X])
																{
																	ControlAnchorV = X;
																	break;
																}
															}
														}
														catch (error)
														{
															var ControlAnchorV = 0;
														}
														try
														{
															var ControlCaption = XMLO.selectSingleNode(ControlXMLPath + "Caption").text.replace(/&amp;/g, "&");
														}
														catch (error)
														{
															var ControlCaption = "";
														}
														try
														{
															var ControlHelp = XMLO.selectSingleNode(ControlXMLPath + "Help").text.replace(/&amp;/g, "&");
														}
														catch (error)
														{
															var ControlHelp = "";
														}
														var ControlLocation = 1;
														try
														{
															var ControlEnabled = ControlNode.getAttribute("Enabled").toLowerCase() === "true";
														}
														catch (error)
														{
															var ControlEnabled = true;
														}
														try
														{
															var ControlVisible = ControlNode.getAttribute("Visible").toLowerCase() === "true";
														}
														catch (error)
														{
															var ControlVisible = true;
														}
														var ControlExtra = ""; // same as window extra code filtering
														var ControlExtraProcess = ControlNode.xml;
														ControlExtraProcess = ControlExtraProcess.replace(/<\/?Control.*>/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Position[^ ]*?(\/>|>[^ ]*?<\/Position>)/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Caption>[^ ]*?<\/Caption>/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Help>[^ ]*?<\/Help>/g, "");
														ControlExtraProcess = ControlExtraProcess.split("\r\n");
														ControlExtraFilter = new Array();
														for (var X in ControlExtraProcess)
														{
															if (ControlExtraProcess[X].replace(/\s/g, "") !== "")
															{
																ControlExtraFilter.push(ControlExtraProcess[X].replace(/\t/, ""));
															}
														}
														ControlExtraFilter = ControlExtraFilter.join("\r\n");
														if (ControlExtraFilter !== "")
														{
															ControlExtra = ControlExtraFilter;
														}
														Writer.AddCtrl(WindowId, ControlId, ControlType, ControlLeft, ControlTop, ControlWidth, ControlHeight, ControlAnchorH, ControlAnchorV, ControlCaption, ControlHelp, ControlLocation, ControlComment, ControlEnabled, ControlVisible, ControlExtra); // add to interface
														ControlComment = "";
													}
													catch (error)
													{
														Errors.push("No position tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
													}
												}
											}
										}
										else
										{
											Errors.push("Unknown control node \"" + ControlNode.nodeName + "\" in window \"" + WindowId + "\".\n--> This node will be ignored.");
										}
									}
								}
								var ControlsNode = XMLO.selectSingleNode(WindowXMLPath + "DialogTmpl/BottomBar/RightControls");
								if (ControlsNode !== null)
								{
									var ControlEnum = new Enumerator(ControlsNode.childNodes);
									ControlComment = "";
									for (; !ControlEnum.atEnd(); ControlEnum.moveNext()) // loop through each control in the window (right bottom bar)
									{
										var ControlNode = ControlEnum.item();
										if (ControlNode.nodeName === "#comment")
										{
											ControlComment = ControlNode.nodeValue;
											ControlComment = ControlComment.substr(1, ControlComment.length - 2);
										}
										else if (ControlNode.nodeName === "Control")
										{
											var ControlId = ControlNode.getAttribute("Id");
											if (ControlId === null)
											{
												Errors.push("No ID attribute defined for unknown control in window \"" + WindowId + "\".\n--> This control will be ignored.");
											}
											else if (ControlId in Interface.Window[WindowId].Control)
											{
												Errors.push("A control with the ID \"" + ControlId + "\" in window \"" + WindowId + "\" already exists.\n--> Consequent occurences of this control will be ignored.");
											}
											else
											{
												Debugging.Trace("--> | | | Processing control \"" + ControlId + "\" in window \"" + WindowId + "\"...");
												var ControlType = ControlNode.getAttribute("xsi:type");
												var ControlXMLPath = WindowXMLPath + "DialogTmpl/BottomBar/RightControls/Control[@Id=\"" + ControlId + "\"]/";
												for (var X in EnumControlType) // loop through enumerations
												{
													if (ControlType.toLowerCase() === EnumControlType[X].toLowerCase())
													{
														ControlType = X;
														break;
													}
												}
												if (ControlType === null)
												{
													Errors.push("No type attribute defined for control " + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
												}
												else if (isNaN(ControlType))
												{
													Errors.push("Invalid control type \"" + ControlType + "\" for control " + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
												}
												else
												{
													var ControlPosNode = XMLO.selectSingleNode(ControlXMLPath + "Position");
													var ControlLeft = "";
													var ControlTop = "";
													try
													{
														try
														{
															var ControlWidth = ControlPosNode.getAttribute("Width").toString();
														}
														catch (error)
														{
															Errors.push("No width tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> A default of 50 will be used.");
															var ControlWidth = "50";
														}
														try
														{
															var ControlHeight = ControlPosNode.getAttribute("Height").toString();
														}
														catch (error)
														{
															var ControlHeight = "";
														}
														var ControlPosAnchorNode = XMLO.selectSingleNode(ControlXMLPath + "Position/Anchor");
														try
														{
															var ControlAnchorH = ControlPosAnchorNode.getAttribute("Horizontal").toString();
															for (var X in EnumControlElementAnchorH) // loop through enumerations
															{
																if (ControlAnchorH == EnumControlElementAnchorH[X])
																{
																	ControlAnchorH = X;
																	break;
																}
															}
														}
														catch (error)
														{
															var ControlAnchorH = 0;
														}
														try
														{
															var ControlAnchorV = ControlPosAnchorNode.getAttribute("Vertical").toString();
															for (var X in EnumControlElementAnchorV) // loop through enumerations
															{
																if (ControlAnchorV == EnumControlElementAnchorV[X])
																{
																	ControlAnchorV = X;
																	break;
																}
															}
														}
														catch (error)
														{
															var ControlAnchorV = 0;
														}
														try
														{
															var ControlCaption = XMLO.selectSingleNode(ControlXMLPath + "Caption").text.replace(/&amp;/g, "&");
														}
														catch (error)
														{
															var ControlCaption = "";
														}
														try
														{
															var ControlHelp = XMLO.selectSingleNode(ControlXMLPath + "Help").text.replace(/&amp;/g, "&");
														}
														catch (error)
														{
															var ControlHelp = "";
														}
														var ControlLocation = 2;
														try
														{
															var ControlEnabled = ControlNode.getAttribute("Enabled").toLowerCase() === "true";
														}
														catch (error)
														{
															var ControlEnabled = true;
														}
														try
														{
															var ControlVisible = ControlNode.getAttribute("Visible").toLowerCase() === "true";
														}
														catch (error)
														{
															var ControlVisible = true;
														}
														var ControlExtra = ""; // same as window extra code filtering
														var ControlExtraProcess = ControlNode.xml;
														ControlExtraProcess = ControlExtraProcess.replace(/<\/?Control.*>/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Position[^ ]*?(\/>|>[^ ]*?<\/Position>)/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Caption>[^ ]*?<\/Caption>/g, "");
														ControlExtraProcess = ControlExtraProcess.replace(/<Help>[^ ]*?<\/Help>/g, "");
														ControlExtraProcess = ControlExtraProcess.split("\r\n");
														ControlExtraFilter = new Array();
														for (var X in ControlExtraProcess)
														{
															if (ControlExtraProcess[X].replace(/\s/g, "") !== "")
															{
																ControlExtraFilter.push(ControlExtraProcess[X].replace(/\t/, ""));
															}
														}
														ControlExtraFilter = ControlExtraFilter.join("\r\n");
														if (ControlExtraFilter !== "")
														{
															ControlExtra = ControlExtraFilter;
														}
														Writer.AddCtrl(WindowId, ControlId, ControlType, ControlLeft, ControlTop, ControlWidth, ControlHeight, ControlAnchorH, ControlAnchorV, ControlCaption, ControlHelp, ControlLocation, ControlComment, ControlEnabled, ControlVisible, ControlExtra); // add to interface
														ControlComment = "";
													}
													catch (error)
													{
														Errors.push("No position tag found for control \"" + ControlId + "\" in window \"" + WindowId + "\".\n--> This control will be ignored.");
													}
												}
											}
										}
										else
										{
											Errors.push("Unknown control node \"" + ControlNode.nodeName + "\" in window \"" + WindowId + "\".\n--> This node will be ignored.");
										}
									}
								}
								var ElementsNode = XMLO.selectSingleNode(WindowXMLPath + "Elements");
								var ElementComment = "";
								if (ElementsNode !== null)
								{
									var ElementEnum = new Enumerator(ElementsNode.childNodes);
									for (; !ElementEnum.atEnd(); ElementEnum.moveNext()) // loop through each element in the window
									{
										var ElementNode = ElementEnum.item();
										if (ElementNode.nodeName === "#comment")
										{
											ElementComment = ElementNode.nodeValue;
											ElementComment = ElementComment.substr(1, ElementComment.length - 2);
										}
										else if (ElementNode.nodeName === "Element")
										{
											var ElementId = ElementNode.getAttribute("Id");
											if (ElementId === null)
											{
												Errors.push("No ID attribute defined for unknown element in window \"" + WindowId + "\".\n--> This element will be ignored.");
											}
											else if (ElementId in Interface.Window[WindowId].Element)
											{
												Errors.push("An element with the ID \"" + ElementId + "\" in window \"" + WindowId + "\" already exists.\n--> Consequent occurences of this element will be ignored.");
											}
											else
											{
												Debugging.Trace("--> | | | Processing element \"" + ElementId + "\" in window \"" + WindowId + "\"...");
												var ElementType = ElementNode.getAttribute("xsi:type");
												var ElementXMLPath = WindowXMLPath + "Elements/Element[@Id=\"" + ElementId + "\"]/";
												for (var X in EnumElementType) // loop through enumerations
												{
													if (ElementType.toLowerCase() === EnumElementType[X].toLowerCase())
													{
														ElementType = X;
														break;
													}
												}
												if (ElementType === null)
												{
													Errors.push("No type attribute defined for element " + ElementId + "\" in window \"" + WindowId + "\".\n--> This element will be ignored.");
												}
												else if (isNaN(ElementType))
												{
													if (ElementType === "Image") // just in case
													{
														ElementType = 3;
													}
													else
													{
														Errors.push("Invalid element type \"" + ElementType + "\" for element " + ElementId + "\" in window \"" + WindowId + "\".\n--> This element will be ignored.");
													}
												}
												else
												{
													if (ElementId in Interface.Window[WindowId].Element)
													{
														Errors.push("Two (or more) elements share the name \"" + ElementId + "\" in window \"" + WindowId + "\".\n--> The second occurrence of this element name will be ignored.");
													}
													else
													{
														var ElementPosNode = XMLO.selectSingleNode(ElementXMLPath + "Position");
														try
														{
															try
															{
																var ElementLeft = ElementPosNode.getAttribute("Left").toString();
															}
															catch (error)
															{
																Errors.push("No left tag found for element \"" + ElementId + "\" in window \"" + WindowId + "\".\n--> A default of 0 will be used.");
																var ElementLeft = "0";
															}
															try
															{
																var ElementTop = ElementPosNode.getAttribute("Top").toString();
															}
															catch (error)
															{
																Errors.push("No top tag found for element \"" + ElementId + "\" in window \"" + WindowId + "\".\n--> A default of 0 will be used.");
																var ElementTop = "0";
															}
															try
															{
																var ElementWidth = ElementPosNode.getAttribute("Width").toString();
															}
															catch (error)
															{
																var ElementWidth = "";
															}
															try
															{
																var ElementHeight = ElementPosNode.getAttribute("Height").toString();
															}
															catch (error)
															{
																var ElementHeight = "";
															}
															var ElementPosAnchorNode = XMLO.selectSingleNode(ElementXMLPath + "Position/Anchor");
															try
															{
																var ElementAnchorH = ElementPosAnchorNode.getAttribute("Horizontal").toString();
																for (var X in EnumControlElementAnchorH) // loop through enumerations
																{
																	if (ElementAnchorH == EnumControlElementAnchorH[X])
																	{
																		ElementAnchorH = X;
																		break;
																	}
																}
															}
															catch (error)
															{
																var ElementAnchorH = 0;
															}
															try
															{
																var ElementAnchorV = ElementPosAnchorNode.getAttribute("Vertical").toString();
																for (var X in EnumControlElementAnchorV) // loop through enumerations
																{
																	if (ElementAnchorV == EnumControlElementAnchorV[X])
																	{
																		ElementAnchorV = X;
																		break;
																	}
																}
															}
															catch (error)
															{
																var ElementAnchorV = 0;
															}
															var ElementExtra = ""; // same as window extra code filtering
															var ElementExtraProcess = ElementNode.xml;
															ElementExtraProcess = ElementExtraProcess.replace(/<\/?Element.*>/g, "");
															ElementExtraProcess = ElementExtraProcess.replace(/<Position[^ ]*?(\/>|>[^ ]*?<\/Position>)/g, "");
															ElementExtraProcess = ElementExtraProcess.split("\r\n");
															ElementExtraFilter = new Array();
															for (var X in ElementExtraProcess)
															{
																if (ElementExtraProcess[X].replace(/\s/g, "") !== "")
																{
																	ElementExtraFilter.push(ElementExtraProcess[X].replace(/\t/, ""));
																}
															}
															ElementExtraFilter = ElementExtraFilter.join("\r\n");
															if (ElementExtraFilter !== "")
															{
																ElementExtra = ElementExtraFilter;
															}
															Writer.AddElmt(WindowId, ElementId, ElementType, ElementLeft, ElementTop, ElementWidth, ElementHeight, ElementAnchorH, ElementAnchorV, ElementComment, ElementExtra); // add to interface
														}
														catch (error)
														{
															Errors.push("No position tag found for element \"" + ElementId + "\" in window \"" + WindowId + "\".\n--> This element will be ignored.");
														}
													}
												}
											}
										}
										else
										{
											Errors.push("Unknown element node \"" + ElementNode.nodeName + "\" in window \"" + WindowId + "\".\n--> This node will be ignored.");
										}
									}
								}
							}
						}
					}
				}
				else // a terrible error in the file, is it really XML?
				{
					var ParseError = XMLO.parseError.reason;
					ParseError = ParseError.substr(0, ParseError.length - 2);
					Debugging.Trace("--> | XML is not valid.  " + ParseError);
					Errors.push("! | " + ParseError + "\n--> Line number: " + XMLO.parseError.line + " (position " + XMLO.parseError.linepos + ").");
					Fatal = true;
				}
				Debugging.Trace("<-- End file loading. -->");
				if (Errors.length === 0) // yay, no errors, off it goes
				{
					return true;
				}
				else // oops, show the error window
				{
					return new Array(1, Errors.join("\n"), Fatal);
				}
			}
		}
		else
		{
			Debugging.Trace("--> | File does not exist.");
			ErrorMessage = "The specified path points to a file that does not exist.";
		}
	}
	else
	{
		Debugging.Trace("--> | Directory does not exist.");
		ErrorMessage = "The specified path points to a directory that does not exist.";
	}
	Debugging.Trace("--> Cancelling file load...");
	if (NowEditing === 0)
	{
		FilePath = "";
	}
	Debugging.Trace("<-- End file load. -->");
	return new Array(2, ErrorMessage);
}
