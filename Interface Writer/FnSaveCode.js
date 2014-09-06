/*
File: FnSaveCode.js
Generates interface XML code and saves files.
*/

function ProcessAutoSave()
{
	if (Registry.Read("Options\\ChkSaveAction") && FilePath !== "") // save after actions?
	{
		SaveFile();
	}
	if (Registry.Read("Options\\ChkBackup")) // backup fules?
	{
		SaveFilePath(BackupFile);
	}
}

function SaveFilePath(Path, Code, OneWnd, Prefix)
{
	var OldPath = FilePath;
	FilePath = Path;
	SaveFile(Code, OneWnd, Prefix); // calls save file function using a different file path
	FilePath = OldPath;
}

function SaveFile(Code, OneWnd, Prefix)
{
	Debugging.Trace("<-- Start file save. -->");
	var WorkPath = FilePath.split("\\");
	Debugging.Trace("--> File to save: " + WorkPath[WorkPath.length - 1]);
	delete WorkPath[WorkPath.length - 1];
	WorkPath = WorkPath.join("\\");
	WorkPath = WorkPath.substr(0, WorkPath.length - 1);
	Debugging.Trace("--> | Opening text file...");
	var TextFile = FSO.OpenTextFile(FilePath, 2, 1, -1);
	Debugging.Trace("--> Creating source code...");
	if (Code === undefined)
	{
		Code = SourceCode(OneWnd, Prefix).split("\n"); // fetch code
	}
	Debugging.Trace("--> | Writing lines...");
	for (var X in Code)
	{
		TextFile.WriteLine(Code[X]);
	}
	Debugging.Trace("--> File save successful.");
	TextFile.Close();
	Debugging.Trace("<-- End file save. -->");
}

function SourceCode(OneWnd, Prefix)
{
	var Source = "";
	Source += "<Interfaces xmlns=\"urn:msgplus:interface\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n";
	Source += " xsi:schemaLocation=\"urn:msgplus:interface PlusInterface.xsd\">\n";
	Source += "\n";
	Source += "<!-- Written using " + NAME + " " + VERSION + " by Whiz @ WhizWeb Community -->\n";
	Source += "\n";
	if (OneWnd === undefined)
	{
		for (var WndId in Interface.Window) // loop through windows
		{
			var Window = Interface.Window[WndId];
			Source += "<Window Id=\"" + WndId + "\" Version=\"1\">\n";
			Source += "\n";
			if (Window.Extra !== "") // any extra code?
			{
				var ExtraSplit = Window.Extra.split("\r\n");
				for (var X in ExtraSplit)
				{
					Source += "	" + ExtraSplit[X] + "\n"; // add the code in
				}
				Source += "\n";
			}
			if (Window.Template !== 2 && (Window.Icon || Window.Title !== "")) // not a child window, with a title bar
			{
				Source += "	<TitleBar>\n"; // following values only needed if not default
				if (!Window.Minimize)
				{
					Source += "		<AllowMinimize>" + Window.Minimize + "</AllowMinimize>\n";
				}
				if (Window.Maximize)
				{
					Source += "		<AllowMaximize>" + Window.Maximize + "</AllowMaximize>\n";
				}
				if (!Window.Close)
				{
					Source += "		<AllowClose>" + Window.Close + "</AllowClose>\n";
				}
				Source += "		<Title>\n";
				Source += "			<Prefix>" + (Window.Icon ? "Image" : "None") + "</Prefix>\n";
				if (Window.Title !== "")
				{
					Source += "			<Text>" + Window.Title + "</Text>\n";
				}
				Source += "		</Title>\n";
				Source += "	</TitleBar>\n";
				Source += "\n";
			}
			Source += "	<Position Width=\"" + Window.Width + "\" Height=\"" + Window.Height + "\"";
			if (Window.InitialPos !== 1) // default
			{
				Source += " InitialPos=\"" + EnumWindowInitialPos[Window.InitialPos] + "\"";
			}
			if (Window.IsAbsolute || (Window.Resizeable && Window.Template !== 2))
			{
				Source += ">\n";
				if (Window.IsAbsolute)
				{
					Source += "		<IsAbsolute>true</IsAbsolute>\n";
				}
				if (Window.Resizeable && Window.Template !== 2)
				{
					Source += "		<Resizeable Allowed=\"BothSides\">\n"; // idea - customizable minimums?
					Source += "			<MinWidth>" + Window.Width + "</MinWidth>\n";
					Source += "			<MinHeight>" + Window.Height + "</MinHeight>\n";
					Source += "		</Resizeable>\n";
				}
				Source += "	</Position>\n";
			}
			else
			{
				Source += "/>\n";
			}
			Source += "\n";
			Source += "	<" + EnumWindowTemplate[Window.Template] + (Window.BottomBar === 0 || Window.Template !== 0 ? "/" : "") + ">\n";
			if (Window.BottomBar !== 0 && Window.Template === 0) // bottom bar controls?
			{
				var CtrlLeftCount = 0;
				var CtrlRightCount = 0;
				for (var CtrlId in Window.Control)
				{
					if (Window.Control[CtrlId].Location === 1)
					{
						CtrlLeftCount++;
					}
					else if (Window.Control[CtrlId].Location === 2)
					{
						CtrlRightCount++;
					}
				}
				Source += "		<BottomBar Style=\"" + EnumWindowBottomBar[Window.BottomBar] + "\"" + (CtrlLeftCount > 0 || CtrlRightCount > 0 ? "" : "/") + ">\n";
				if (CtrlLeftCount > 0)
				{
					Source += "			<LeftControls>\n";
					for (var CtrlId in Window.Control)
					{
						var Control = Window.Control[CtrlId];
						if (Control.Location === 1)
						{
							if (Control.Comment !== "")
							{
								Source += "				<!-- " + Control.Comment + " -->\n";
							}
							Source += "				<Control xsi:type=\"" + EnumControlType[Control.Type] + "\" Id=\"" + CtrlId + "\"" + (Control.Enabled ? "" : " Enabled=\"False\"") + (Control.Visible ? "" : " Visible=\"False\"") + ">\n";
							Source += "					<Position Left=\"0\" Top=\"0\" Width=\"" + Control.Width + "\"" + (Control.Height === "" ? "" : " Height=\"" + Control.Height + "\""); // position not required
							if (Window.IsAbsolute) // anchors not required
							{
								Source += ">\n";
								if (Window.IsAbsolute)
								{
									Source += "						<Units>AllPixels</Units>\n";
								}
								Source += "					</Position>\n";
							}
							else
							{
								Source += "/>\n";
							}
							if (Control.Extra !== "")
							{
								var ExtraSplit = Control.Extra.replace(/&amp;/g, "&").split("\r\n"); // unescape (will be escaped at end)
								for (var X in ExtraSplit)
								{
									Source += "					" + ExtraSplit[X] + "\n";
								}
							}
							if (Control.Caption != "")
							{
								Source += "					<Caption>" + Control.Caption + "</Caption>\n";
							}
							if (Control.Help != "")
							{
								Source += "					<Help>" + Control.Help + "</Help>\n";
							}
							Source += "				</Control>\n";
						}
					}
					Source += "			</LeftControls>\n";
				}
				if (CtrlRightCount > 0)
				{
					Source += "			<RightControls>\n";
					for (var CtrlId in Window.Control)
					{
						var Control = Window.Control[CtrlId];
						if (Control.Location === 2)
						{
							if (Control.Comment !== "")
							{
								Source += "				<!-- " + Control.Comment + " -->\n";
							}
							Source += "				<Control xsi:type=\"" + EnumControlType[Control.Type] + "\" Id=\"" + CtrlId + "\"" + (Control.Enabled ? "" : " Enabled=\"False\"") + (Control.Visible ? "" : " Visible=\"False\"") + ">\n";
							Source += "					<Position Left=\"0\" Top=\"0\" Width=\"" + Control.Width + "\"" + (Control.Height === "" ? "" : " Height=\"" + Control.Height + "\""); // position not required
							if (Window.IsAbsolute) // anchors not required
							{
								Source += ">\n";
								if (Window.IsAbsolute)
								{
									Source += "						<Units>AllPixels</Units>\n";
								}
								Source += "					</Position>\n";
							}
							else
							{
								Source += "/>\n";
							}
							if (Control.Extra !== "")
							{
								var ExtraSplit = Control.Extra.replace(/&amp;/g, "&").split("\r\n"); // unescape (will be escaped at end)
								for (var X in ExtraSplit)
								{
									Source += "					" + ExtraSplit[X] + "\n";
								}
							}
							if (Control.Caption != "")
							{
								Source += "					<Caption>" + Control.Caption + "</Caption>\n";
							}
							if (Control.Help != "")
							{
								Source += "					<Help>" + Control.Help + "</Help>\n";
							}
							Source += "				</Control>\n";
						}
					}
					Source += "			</RightControls>\n";
				}
				Source += CtrlLeftCount > 0 || CtrlRightCount > 0 ? "		</BottomBar>\n" : "";
				Source += "	</" + EnumWindowTemplate[Window.Template] + ">\n";
			}
			Source += "\n";
			var CtrlCount = 0;
			for (var CtrlId in Window.Control)
			{
				if (Window.Control[CtrlId].Location === 0 || Window.BottomBar === 0)
				{
					CtrlCount++;
				}
			}
			if (CtrlCount > 0)
			{
				Source += "	<Controls>\n";
				for (var CtrlId in Window.Control)
				{
					var Control = Window.Control[CtrlId];
					if (Control.Location === 0 || Window.BottomBar === 0)
					{
						if (Control.Comment !== "")
						{
							Source += "		<!-- " + Control.Comment + " -->\n";
						}
						Source += "		<Control xsi:type=\"" + EnumControlType[Control.Type] + "\" Id=\"" + CtrlId + "\"" + (Control.Enabled ? "" : " Enabled=\"False\"") + (Control.Visible ? "" : " Visible=\"False\"") + ">\n";
						Source += "			<Position Left=\"" + Control.Left + "\" Top=\"" + Control.Top + "\" Width=\"" + Control.Width + "\"" + (Control.Height === "" ? "" : " Height=\"" + Control.Height + "\"");
						if (Window.IsAbsolute || Control.AnchorH !== 0 || Control.AnchorV !== 0)
						{
							Source += ">\n";
							if (Window.IsAbsolute)
							{
								Source += "				<Units>AllPixels</Units>\n";
							}
							if (Control.AnchorH !== 0 || Control.AnchorV !== 0)
							{
								Source += "				<Anchor";
								if (Control.AnchorH !== 0)
								{
									Source += " Horizontal=\"" + EnumControlElementAnchorH[Control.AnchorH] + "\"";
								}
								if (Control.AnchorV !== 0)
								{
									Source += " Vertical=\"" + EnumControlElementAnchorV[Control.AnchorV] + "\"";
								}
								Source += "/>\n";
							}
							Source += "			</Position>\n";
						}
						else
						{
							Source += "/>\n";
						}
						if (Control.Extra !== "")
						{
							var ExtraSplit = Control.Extra.replace(/&amp;/g, "&").split("\r\n"); // unescape (will be escaped at end)
							for (var X in ExtraSplit)
							{
								Source += "			" + ExtraSplit[X] + "\n";
							}
						}
						if (Control.Caption != "")
						{
							Source += "			<Caption>" + Control.Caption + "</Caption>\n";
						}
						if (Control.Help != "")
						{
							Source += "			<Help>" + Control.Help + "</Help>\n";
						}
						Source += "		</Control>\n";
					}
				}
				Source += "	</Controls>\n";
				Source += "\n";
			}
			var ElmtCount = 0;
			for (var ElmtId in Window.Element)
			{
				ElmtCount++;
			}
			if (ElmtCount > 0)
			{
				Source += "	<Elements>\n";
				for (var ElmtId in Window.Element)
				{
					var Element = Window.Element[ElmtId];
					if (Element.Comment !== "")
					{
						Source += "		<!-- " + Element.Comment + " -->\n";
					}
					Source += "		<Element xsi:type=\"" + EnumElementType[Element.Type] + "\" Id=\"" + ElmtId + "\">\n";
					Source += "			<Position Left=\"" + Element.Left + "\" Top=\"" + Element.Top + "\"";
					if (Element.Width !== "")
					{
						Source += " Width=\"" + Element.Width + "\"";
					}
					if (Element.Height !== "")
					{
						Source += " Height=\"" + Element.Height + "\"";
					}
					if (Window.IsAbsolute || Element.AnchorH !== 0 || Element.AnchorV !== 0)
					{
						Source += ">\n";
						if (Window.IsAbsolute)
						{
							Source += "				<Units>AllPixels</Units>\n";
						}
						if (Element.AnchorH !== 0 || Element.AnchorV !== 0)
						{
							Source += "				<Anchor";
							if (Element.AnchorH !== 0)
							{
								Source += " Horizontal=\"" + EnumControlElementAnchorH[Element.AnchorH] + "\"";
							}
							if (Element.AnchorV !== 0)
							{
								Source += " Vertical=\"" + EnumControlElementAnchorV[Element.AnchorV] + "\"";
							}
							Source += "/>\n";
						}
						Source += "			</Position>\n";
					}
					else
					{
						Source += "/>\n";
					}
					if (Element.Extra !== "")
					{
						var ExtraSplit = Element.Extra.replace(/&amp;/g, "&").split("\r\n"); // unescape (will be escaped at end)
						for (var X in ExtraSplit)
						{
							Source += "			" + ExtraSplit[X] + "\n";
						}
					}
					Source += "		</Element>\n";
				}
				Source += "	</Elements>\n";
				Source += "\n";
			}
			Source += "</Window>\n";
			Source += "\n";
		}
	}
	else // same as before, but just a single window (for source code window)
	{
		var Window = Interface.Window[OneWnd];
		Source += "<Window Id=\"" + (Prefix ? "IW_TMP_" : "") + OneWnd + "\" Version=\"1\">\n";
		Source += "\n";
		if (Window.Extra !== "")
		{
			var ExtraSplit = Window.Extra.split("\r\n");
			for (var X in ExtraSplit)
			{
				Source += "	" + ExtraSplit[X] + "\n";
			}
			Source += "\n";
		}
		if (Window.Template !== 2 && (Window.Icon || Window.Title !== ""))
		{
			Source += "	<TitleBar>\n";
			if (!Window.Minimize)
			{
				Source += "		<AllowMinimize>" + Window.Minimize + "</AllowMinimize>\n";
			}
			if (Window.Maximize)
			{
				Source += "		<AllowMaximize>" + Window.Maximize + "</AllowMaximize>\n";
			}
			if (!Window.Close)
			{
				Source += "		<AllowClose>" + Window.Close + "</AllowClose>\n";
			}
			Source += "		<Title>\n";
			Source += "			<Prefix>" + (Window.Icon ? "Image" : "None") + "</Prefix>\n";
			if (Window.Title !== "")
			{
				Source += "			<Text>" + Window.Title + "</Text>\n";
			}
			Source += "		</Title>\n";
			Source += "	</TitleBar>\n";
			Source += "\n";
		}
		Source += "	<Position Width=\"" + Window.Width + "\" Height=\"" + Window.Height + "\"";
		if (Window.InitialPos !== 1)
		{
			Source += " InitialPos=\"" + EnumWindowInitialPos[Window.InitialPos] + "\"";
		}
		if (Window.IsAbsolute || (Window.Resizeable && Window.Template !== 2))
		{
			Source += ">\n";
			if (Window.IsAbsolute)
			{
				Source += "		<IsAbsolute>true</IsAbsolute>\n";
			}
			if (Window.Resizeable && Window.Template !== 2)
			{
				Source += "		<Resizeable Allowed=\"BothSides\">\n";
				Source += "			<MinWidth>" + Window.Width + "</MinWidth>\n";
				Source += "			<MinHeight>" + Window.Height + "</MinHeight>\n";
				Source += "		</Resizeable>\n";
			}
			Source += "	</Position>\n";
		}
		else
		{
			Source += "/>\n";
		}
		Source += "\n";
		Source += "	<" + EnumWindowTemplate[Window.Template] + (Window.BottomBar === 0 ? "/" : "") + ">\n";
		if (Window.BottomBar !== 0)
		{
			var CtrlLeftCount = 0;
			var CtrlRightCount = 0;
			for (var CtrlId in Window.Control)
			{
				if (Window.Control[CtrlId].Location === 1)
				{
					CtrlLeftCount++;
				}
				else if (Window.Control[CtrlId].Location === 2)
				{
					CtrlRightCount++;
				}
			}
			Source += "		<BottomBar Style=\"" + EnumWindowBottomBar[Window.BottomBar] + "\"" + (CtrlLeftCount > 0 || CtrlRightCount > 0 ? "" : "/") + ">\n";
			if (CtrlLeftCount > 0)
			{
				Source += "			<LeftControls>\n";
				for (var CtrlId in Window.Control)
				{
					var Control = Window.Control[CtrlId];
					if (Control.Location === 1)
					{
						if (Control.Comment !== "")
						{
							Source += "				<!-- " + Control.Comment + " -->\n";
						}
						Source += "				<Control xsi:type=\"" + EnumControlType[Control.Type] + "\" Id=\"" + CtrlId + "\"" + (Control.Enabled ? "" : " Enabled=\"False\"") + (Control.Visible ? "" : " Visible=\"False\"") + ">\n";
						Source += "					<Position Left=\"0\" Top=\"0\" Width=\"" + Control.Width + "\"" + (Control.Height === "" ? "" : " Height=\"" + Control.Height + "\"");
						if (Window.IsAbsolute || Control.AnchorH !== 0 || Control.AnchorV !== 0)
						{
							Source += ">\n";
							if (Window.IsAbsolute)
							{
								Source += "						<Units>AllPixels</Units>\n";
							}
							if (Control.AnchorH !== 0 || Control.AnchorV !== 0)
							{
								Source += "						<Anchor";
								if (Control.AnchorH !== 0)
								{
									Source += " Horizontal=\"" + EnumControlElementAnchorH[Control.AnchorH] + "\"";
								}
								if (Control.AnchorV !== 0)
								{
									Source += " Vertical=\"" + EnumControlElementAnchorV[Control.AnchorV] + "\"";
								}
								Source += "/>\n";
							}
							Source += "					</Position>\n";
						}
						else
						{
							Source += "/>\n";
						}
						if (Control.Extra !== "")
						{
							var ExtraSplit = Control.Extra.replace(/&amp;/g, "&").split("\r\n");
							for (var X in ExtraSplit)
							{
								Source += "					" + ExtraSplit[X] + "\n";
							}
						}
						if (Control.Caption != "")
						{
							Source += "					<Caption>" + Control.Caption + "</Caption>\n";
						}
						if (Control.Help != "")
						{
							Source += "					<Help>" + Control.Help + "</Help>\n";
						}
						Source += "				</Control>\n";
					}
				}
				Source += "			</LeftControls>\n";
			}
			if (CtrlRightCount > 0)
			{
				Source += "			<RightControls>\n";
				for (var CtrlId in Window.Control)
				{
					var Control = Window.Control[CtrlId];
					if (Control.Location === 2)
					{
						if (Control.Comment !== "")
						{
							Source += "				<!-- " + Control.Comment + " -->\n";
						}
						Source += "				<Control xsi:type=\"" + EnumControlType[Control.Type] + "\" Id=\"" + CtrlId + "\"" + (Control.Enabled ? "" : " Enabled=\"False\"") + (Control.Visible ? "" : " Visible=\"False\"") + ">\n";
						Source += "					<Position Left=\"0\" Top=\"0\" Width=\"" + Control.Width + "\"" + (Control.Height === "" ? "" : " Height=\"" + Control.Height + "\"");
						if (Window.IsAbsolute || Control.AnchorH !== 0 || Control.AnchorV !== 0)
						{
							Source += ">\n";
							if (Window.IsAbsolute)
							{
								Source += "						<Units>AllPixels</Units>\n";
							}
							if (Control.AnchorH !== 0 || Control.AnchorV !== 0)
							{
								Source += "						<Anchor";
								if (Control.AnchorH !== 0)
								{
									Source += " Horizontal=\"" + EnumControlElementAnchorH[Control.AnchorH] + "\"";
								}
								if (Control.AnchorV !== 0)
								{
									Source += " Vertical=\"" + EnumControlElementAnchorV[Control.AnchorV] + "\"";
								}
								Source += "/>\n";
							}
							Source += "					</Position>\n";
						}
						else
						{
							Source += "/>\n";
						}
						if (Control.Extra !== "")
						{
							var ExtraSplit = Control.Extra.replace(/&amp;/g, "&").split("\r\n");
							for (var X in ExtraSplit)
							{
								Source += "					" + ExtraSplit[X] + "\n";
							}
						}
						if (Control.Caption != "")
						{
							Source += "					<Caption>" + Control.Caption + "</Caption>\n";
						}
						if (Control.Help != "")
						{
							Source += "					<Help>" + Control.Help + "</Help>\n";
						}
						Source += "				</Control>\n";
					}
				}
				Source += "			</RightControls>\n";
			}
			Source += CtrlLeftCount > 0 || CtrlRightCount > 0 ? "		</BottomBar>\n" : "";
			Source += "	</" + EnumWindowTemplate[Window.Template] + ">\n";
		}
		Source += "\n";
		var CtrlCount = 0;
		for (var CtrlId in Window.Control)
		{
			if (Window.Control[CtrlId].Location === 0 || Window.BottomBar === 0)
			{
				CtrlCount++;
			}
		}
		if (CtrlCount > 0)
		{
			Source += "	<Controls>\n";
			for (var CtrlId in Window.Control)
			{
				var Control = Window.Control[CtrlId];
				if (Control.Location === 0 || Window.BottomBar === 0)
				{
					if (Control.Comment !== "")
					{
						Source += "		<!-- " + Control.Comment + " -->\n";
					}
					Source += "		<Control xsi:type=\"" + EnumControlType[Control.Type] + "\" Id=\"" + CtrlId + "\"" + (Control.Enabled ? "" : " Enabled=\"False\"") + (Control.Visible ? "" : " Visible=\"False\"") + ">\n";
					Source += "			<Position Left=\"" + Control.Left + "\" Top=\"" + Control.Top + "\" Width=\"" + Control.Width + "\"" + (Control.Height === "" ? "" : " Height=\"" + Control.Height + "\"");
					if (Window.IsAbsolute || Control.AnchorH !== 0 || Control.AnchorV !== 0)
					{
						Source += ">\n";
						if (Window.IsAbsolute)
						{
							Source += "				<Units>AllPixels</Units>\n";
						}
						if (Control.AnchorH !== 0 || Control.AnchorV !== 0)
						{
							Source += "				<Anchor";
							if (Control.AnchorH !== 0)
							{
								Source += " Horizontal=\"" + EnumControlElementAnchorH[Control.AnchorH] + "\"";
							}
							if (Control.AnchorV !== 0)
							{
								Source += " Vertical=\"" + EnumControlElementAnchorV[Control.AnchorV] + "\"";
							}
							Source += "/>\n";
						}
						Source += "			</Position>\n";
					}
					else
					{
						Source += "/>\n";
					}
					if (Control.Extra !== "")
					{
						var ExtraSplit = Control.Extra.replace(/&amp;/g, "&").split("\r\n");
						for (var X in ExtraSplit)
						{
							Source += "			" + ExtraSplit[X] + "\n";
						}
					}
					if (Control.Caption != "")
					{
						Source += "			<Caption>" + Control.Caption + "</Caption>\n";
					}
					if (Control.Help != "")
					{
						Source += "			<Help>" + Control.Help + "</Help>\n";
					}
					Source += "		</Control>\n";
				}
			}
			Source += "	</Controls>\n";
			Source += "\n";
		}
		var ElmtCount = 0;
		for (var ElmtId in Interface.Window[OneWnd].Element)
		{
			ElmtCount++;
		}
		if (ElmtCount > 0)
		{
			Source += "	<Elements>\n";
			for (var ElmtId in Window.Element)
			{
				var Element = Window.Element[ElmtId];
				if (Element.Comment !== "")
				{
					Source += "		<!-- " + Element.Comment + " -->\n";
				}
				Source += "		<Element xsi:type=\"" + EnumElementType[Element.Type] + "\" Id=\"" + ElmtId + "\">\n";
				Source += "			<Position Left=\"" + Element.Left + "\" Top=\"" + Element.Top + "\"";
				if (Element.Width !== "")
				{
					Source += " Width=\"" + Element.Width + "\"";
				}
				if (Element.Height !== "")
				{
					Source += " Height=\"" + Element.Height + "\"";
				}
				if (Window.IsAbsolute || Element.AnchorH !== 0 || Element.AnchorV !== 0)
				{
					Source += ">\n";
					if (Window.IsAbsolute)
					{
						Source += "				<Units>AllPixels</Units>\n";
					}
					if (Element.AnchorH !== 0 || Element.AnchorV !== 0)
					{
						Source += "				<Anchor";
						if (Element.AnchorH !== 0)
						{
							Source += " Horizontal=\"" + EnumControlElementAnchorH[Element.AnchorH] + "\"";
						}
						if (Element.AnchorV !== 0)
						{
							Source += " Vertical=\"" + EnumControlElementAnchorV[Element.AnchorV] + "\"";
						}
						Source += "/>\n";
					}
					Source += "			</Position>\n";
				}
				else
				{
					Source += "/>\n";
				}
				if (Element.Extra !== "")
				{
					var ExtraSplit = Element.Extra.replace(/&amp;/g, "&").split("\r\n");
					for (var X in ExtraSplit)
					{
						Source += "			" + ExtraSplit[X] + "\n";
					}
				}
				Source += "		</Element>\n";
			}
			Source += "	</Elements>\n";
			Source += "\n";
		}
		Source += "</Window>\n";
		Source += "\n";
	}
	Source += "</Interfaces>";
	if (!Registry.Read("Options\\ChkTabs")) // indents turned off?
	{
		Source = Source.replace(/\t/g, "");
	}
	return Source.replace(/&/g, "&amp;"); // escape and return
}
