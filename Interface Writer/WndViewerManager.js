/*
File: WndViewerManager.js
Events for processing core actions with the viewer.
*/

function OnWndViewerManagerEvent_Build()
{
	Debugging.Call("WndViewerManager / Build", {});
	CloseWnd(WndViewerErrors);
	CloseWnd(WndViewerManager, 1);
	WndViewerManager = OpenWnd("Viewer", "Viewer", "Manager");
	WndViewerManager.SetControlText("EdtPath", ScriptDir + "\\Windows.xml");
	if (FilePath === "")
	{
		Enable(WndViewerManager, "CmbWindows", 0); // no file selected yet
		WndViewerManager.Combo_AddItem("CmbWindows", "(please select an interface file above)", 0, "Cross");
	}
	else
	{
		WndViewerManager.Combo_AddItem("CmbWindows", "(none)", 0, "Cross");
	}
	WndViewerManager.Combo_SetCurSel("CmbWindows", 0);
}

function OnWndViewerManagerEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndViewerManager / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnBrowse":
				var Path = BrowseForFile("Load an interface...", ScriptDir, false, "", "", WndViewerManager.Handle);
				if (Path !== false)
				{
					WndViewerManager.SetControlText("EdtPath", Path);
				}
				break;
			case "BtnLoad":
				var WorkingPath = WndViewerManager.GetControlText("EdtPath");
				var Directory = WorkingPath.split("\\");
				Debugging.Trace("<-- Start file loading. -->");
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
					if (FSO.FileExists(WorkingPath)) // does the chosen file exist?
					{
						Debugging.Trace("--> | File exists.");
						if (!Registry.Exists("Options\\ChkUnlockIntDir") && Directory.indexOf(MsgPlus.ScriptFilesPath) !== -1) // opening files in the script's directory isn't allowed
						{
							Debugging.Trace("--> | File is in a directory of restricted access.");
							ErrorMessage = "Interfaces in this folder are not allowed to be accessed.";
						}
						else
						{
							Debugging.Trace("--> | File is in accessible directory.");
							CloseWnd(WndViewerManager, 1);
							VarCleanup();
							FilePath = WorkingPath;
							var Errors = new Array();
							var Fatal = false;
							Debugging.Trace("--> Testing for valid XML...");
							if (XMLO.load(FilePath)) // is it an XML file?
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
									for (; !WindowEnum.atEnd(); WindowEnum.moveNext()) // loop through each window in the file
									{
										var WindowNode = WindowEnum.item();
										var WindowId = WindowNode.getAttribute("Id");
										if (WindowId === null)
										{
											Errors.push("A window does not have an ID.  This window will be ignored.");
										}
										else
										{
											Debugging.Trace("--> | Adding window \"" + WindowId + "\" to list...");
											Writer.WndId.push(WindowId);
											Interface.Window[WindowId] = XMLO.selectSingleNode("//Interfaces/Window[@Id=\"" + WindowId + "\"]/ChildTmpl") === null; // child windows cannot be previewed
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
								NowEditing = 2;
								OnWndViewerManagerEvent_Build();
								WndViewerManager.SetControlText("EdtPath", FilePath);
								for (var WndId in Interface.Window)
								{
									WndViewerManager.Combo_AddItem("CmbWindows", WndId, Interface.Window[WndId] ? 1 : 0, Interface.Window[WndId] ? "Window" : "Child");
								}
							}
							else // oops, show the error window
							{
								OnWndViewerErrorsEvent_Build(Errors.join("\n"), Fatal);
							}
							break;
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
				if (ErrorMessage !== "")
				{
					Dialog.Show("View an interface file...", ErrorMessage, Dialog.Icon.Error, Dialog.Buttons.OK, WndViewerManager);
				}
				WorkingPath = "";
				if (NowEditing === 0)
				{
					FilePath = "";
				}
				Debugging.Trace("<-- End file loading. -->");
				break;
			case "BtnView":
				if (WndViewerManager.GetControlText("BtnView") === "View")
				{
					WndViewerPreview = MsgPlus.CreateWnd("\\" + FilePath, Writer.WndId[WndViewerManager.Combo_GetCurSel("CmbWindows") - 1], 0);
					WndViewerManager.SetControlText("BtnView", "Close");
				}
				else
				{
					CloseWnd(WndViewerPreview);
					WndViewerManager.SetControlText("BtnView", "View");
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndViewerManagerEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndViewerManager / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		Enable(WndViewerManager, "BtnLoad", (WndViewerManager.GetControlText(ControlId) !== ""));
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndViewerManagerEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndViewerManager / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		CloseWnd(WndViewerPreview);
		WndViewerManager.SetControlText("BtnView", "View");
		Enable(WndViewerManager, "BtnView", WndViewerManager.Combo_GetCurSel("CmbWindows") !== 0 && WndViewerManager.Combo_GetItemData("CmbWindows", WndViewerManager.Combo_GetCurSel("CmbWindows"))); // selected a non-child window?
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndViewerManagerEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndViewerManager / Destroyed", {"PlusWnd" : PlusWnd, "ExitCode" : ExitCode});
		if (ExitCode !== 1)
		{
			VarCleanup();
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
