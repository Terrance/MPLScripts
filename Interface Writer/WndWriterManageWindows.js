/*
File: WndWriterManageWindows.js
Events for processing menu and list actions within the window manager.
*/

function OnWndWriterManageWindowsEvent_Build()
{
	Debugging.Call("WndWriterManageWindows / Build", {});
	CloseWnd(Close.Wnd);
	CloseWnd(WndWriterManageWindows, 1);
	Writer.WndSel[1] = Writer.WndSel[0];
	WndWriterManageWindows = OpenWnd("Windows", "Writer", "ManageWindows");
	WndWriterManageWindows.RegisterMessageNotification(78);
	Interop.Call("user32", "SetWindowTextW", WndWriterManageWindows.Handle, NAME + " | Windows: " + (FilePath === "" ? "(no file selected)" : FilePath));
	if (FilePath !== "")
	{
		Enable(WndWriterManageWindows, "BtnSave", 1);
		var Recent = Registry.Read("Miscellaneous\\Recent").split("|");
		for (var X in Recent)
		{
			if (Recent[X] === FilePath)
			{
				delete Recent[X];
				break;
			}
		}
		if (Recent.length > 4)
		{
			delete Recent[0];
		}
		Recent.push(FilePath);
		Recent = Recent.join("|");
		while (Recent.charAt(0) === "|")
		{
			Recent = Recent.substr(1, Recent.length)
		}
		Registry.Write("Miscellaneous\\Recent", Recent);
	}
	OnWndWriterManageWindowsEvent_Populate();
}

function OnWndWriterManageWindowsEvent_Populate()
{
	try
	{
		Debugging.Call("WndWriterManageWindows / Populate", {});
		var Count = WndWriterManageWindows.LstView_GetCount("LstWindows");
		while (Count > 0)
		{
			WndWriterManageWindows.LstView_RemoveItem("LstWindows", Count - 1);
			Count--;
		}
		Writer.WndId = []; // reset selection
		Writer.WndSel[0] = -1;
		Enable(WndWriterManageWindows, "BtnSelection", 0);
		for (var WndId in Interface.Window) // populate the grid
		{
			Writer.WndId.push(WndId);
			var Window = Interface.Window[WndId];
			WndWriterManageWindows.LstView_AddItem("LstWindows", WndId);
			WndWriterManageWindows.LstView_SetItemIcon("LstWindows", Count, "Window", true);
			if (Window.Template === 2)
			{
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 1, "(none)");
			}
			else
			{
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 1, (Window.Title === "" ? "(none)" : Window.Title));
			}
			WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 2, EnumWindowTemplate[Window.Template]);
			WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 3, Window.Width);
			WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 4, Window.Height);
			if (Window.Template === 2)
			{
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 5, "(n/a)");
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 6, "(n/a)");
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 7, "(n/a)");
			}
			else
			{
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 5, Window.Minimize);
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 6, Window.Maximize);
				WndWriterManageWindows.LstView_SetItemText("LstWindows", Count, 7, Window.Close);
			}
			Writer.CtrlId = new Array();
			for (var CtrlId in Interface.Window[WndId].Control)
			{
				Writer.CtrlId.push(CtrlId);
			}
			Writer.ElmtId = new Array();
			for (var ElmtId in Interface.Window[WndId].Element)
			{
				Writer.ElmtId.push(ElmtId);
			}
			Count++;
		}
		Enable(WndWriterManageWindows, "BtnMulti", (Count > 0)); // any windows in the grid?
		Enable(WndWriterManageWindows, "BtnClipboard", (Clipboard.Window !== undefined)); // any clipboard data
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageWindowsEvent_Status(Message, Time)
{
	if (NowEditing === 1)
	{
		Time = Time === undefined ? 5 : Time;
		WndWriterManageWindows.SetControlText("TxtStatusBar", Message + (Time === 0 ? "" : " [" + Time + "]"));
		try
		{
			WndWriterManageControls.SetControlText("TxtStatusBar", Message + (Time === 0 ? "" : " [" + Time + "]"));
		}
		catch (error)
		{
		}
		try
		{
			WndWriterManageElements.SetControlText("TxtStatusBar", Message + (Time === 0 ? "" : " [" + Time + "]"));
		}
		catch (error)
		{
		}
		if (Time > 0)
		{
			MsgPlus.AddTimer("ResetStatus", 1000);
		}
	}
}

function OnWndWriterManageWindowsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterManageWindows / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[0]];
		var WndId2 = Writer.WndId[Writer.WndSel[1]];
		if (ControlId === "LnkHelp") // toggle help guide
		{
			HelpGuide = !HelpGuide;
			Interop.Call("user32", "SetWindowTextW", WndWriterManageWindows.Handle, (HelpGuide ? "[help guide] " : "") + NAME + " | Windows: " + (FilePath === "" ? "(no file selected)" : FilePath));
			WndWriterManageWindows.SetControlText("LnkHelp", "&Help guide: " + (HelpGuide ? "en" : "dis") + "abled");
			Enable(WndWriterManageWindows, "LstWindows", !HelpGuide);
			if (HelpGuide) // enable everything
			{
				Enable(WndWriterManageWindows, "BtnSave", 1);
				Enable(WndWriterManageWindows, "BtnMulti", 1);
				Enable(WndWriterManageWindows, "BtnSelection", 1);
				Enable(WndWriterManageWindows, "BtnClipboard", 1);
				CloseWnd(WndWriterAddWindow);
				CloseWnd(WndWriterBuildWindowM);
				CloseWnd(WndWriterEditWindow);
				CloseWnd(WndWriterSourceCode);
			}
			else // reset to actual statuses
			{
				Enable(WndWriterManageWindows, "BtnSave", (FilePath !== ""));
				Enable(WndWriterManageWindows, "BtnMulti", (WndWriterManageWindows.LstView_GetCount("LstWindows") > 0));
				Enable(WndWriterManageWindows, "BtnSelection", (Writer.WndSel[0] !== -1));
				Enable(WndWriterManageWindows, "BtnClipboard", (Clipboard.Window !== undefined));
			}
			try // if the control manager is open
			{
				Interop.Call("user32", "SetWindowTextW", WndWriterManageControls.Handle, (HelpGuide ? "[help guide] " : "") + NAME + " | Controls: " + WndId2 + " @ " + (FilePath === "" ? "(no file selected)" : FilePath));
				WndWriterManageControls.SetControlText("LnkHelp", "&Help guide: " + (HelpGuide ? "en" : "dis") + "abled");
				Enable(WndWriterManageControls, "LstControls", !HelpGuide);
				if (HelpGuide)
				{
					Enable(WndWriterManageControls, "BtnSave", 1);
					Enable(WndWriterManageControls, "BtnMulti", 1);
					Enable(WndWriterManageControls, "BtnSelection", 1);
					Enable(WndWriterManageControls, "BtnClipboard", 1);
					CloseWnd(WndWriterAddControl);
					CloseWnd(WndWriterEditControl);
				}
				else
				{
					Enable(WndWriterManageControls, "BtnSave", (FilePath !== ""));
					Enable(WndWriterManageControls, "BtnMulti", (WndWriterManageControls.LstView_GetCount("LstControls") > 0));
					Enable(WndWriterManageControls, "BtnSelection", (Writer.CtrlSel[0] !== -1));
					Enable(WndWriterManageControls, "BtnClipboard", (Clipboard.Control !== undefined));
				}
			}
			catch (error)
			{
			}
			try // if the element manager is open
			{
				Interop.Call("user32", "SetWindowTextW", WndWriterManageElements.Handle, (HelpGuide ? "[help guide] " : "") + NAME + " | Elements: " + WndId2 + " @ " + (FilePath === "" ? "(no file selected)" : FilePath));
				WndWriterManageElements.SetControlText("LnkHelp", "&Help guide: " + (HelpGuide ? "en" : "dis") + "abled");
				Enable(WndWriterManageElements, "LstElements", !HelpGuide);
				if (HelpGuide)
				{
					Enable(WndWriterManageElements, "BtnSave", 1);
					Enable(WndWriterManageElements, "BtnMulti", 1);
					Enable(WndWriterManageElements, "BtnSelection", 1);
					Enable(WndWriterManageElements, "BtnClipboard", 1);
					CloseWnd(WndWriterAddElement);
					CloseWnd(WndWriterEditElement);
				}
				else
				{
					Enable(WndWriterManageElements, "BtnSave", (FilePath !== ""));
					Enable(WndWriterManageElements, "BtnMulti", (WndWriterManageElements.LstView_GetCount("LstElements") > 0));
					Enable(WndWriterManageElements, "BtnSelection", (Writer.CtrlSel[0] !== -1));
					Enable(WndWriterManageElements, "BtnClipboard", (Clipboard.Control !== undefined));
				}
			}
			catch (error)
			{
			}
			OnWndWriterManageWindowsEvent_Status("Help guide mode " + (HelpGuide ? "en" : "dis") + "abled.");
		}
		if (HelpGuide) // post descriptions to the status bar, instead of running the actions
		{
			switch (ControlId)
			{
				case "BtnSave":
					OnWndWriterManageWindowsEvent_Status("Save: save the current file (available only if working with a file).");
					break;
				case "MnuSaveAs":
					OnWndWriterManageWindowsEvent_Status("Save As: save the current file under a new name, and then switch to it.");
					break;
				case "MnuSaveCopy":
					OnWndWriterManageWindowsEvent_Status("Save Copy: save the current file under a new name, without switching to it.");
					break;
				case "MnuImport":
					OnWndWriterManageWindowsEvent_Status("Import File: load an additional interface file into the current file.");
					break;
				case "MnuSource":
					OnWndWriterManageWindowsEvent_Status("Source Code: view the interface XML code that has been created, and edit it.");
					break;
				case "MnuReload":
					OnWndWriterManageWindowsEvent_Status("Reload File: revert to the last saved version (all changes since the last save will be lost).");
					break;
				case "MnuOptions":
					OnWndWriterManageWindowsEvent_Status("Options: open the Options window, where you can change various personal settings.");
					break;
				case "MnuAbout":
					OnWndWriterManageWindowsEvent_Status("About: open the About window.");
					break;
				case "MnuExit":
					OnWndWriterManageWindowsEvent_Status("Exit Editor: exit Interface Writer (you will be prompted to save, shortcut: Close button or <Esc> key).");
					break;
				case "BtnMulti":
					OnWndWriterManageWindowsEvent_Status("Multiple: select one or more windows to perform various actions to.");
					break;
				case "MnuAdd":
					OnWndWriterManageWindowsEvent_Status("Add Window: create a new window for your interface file (shortcut: double-click an empty area of the grid).");
					break;
				case "MnuBuild":
					OnWndWriterManageWindowsEvent_Status("Build Window: visually build a window, using the on-screen frame.");
					break;
				case "MnuPreset":
					OnWndWriterManageWindowsEvent_Status("Insert Preset: select a preset window to include in the interface file.");
					break;
				case "MnuEdit":
					OnWndWriterManageWindowsEvent_Status("Edit Window: edit the currently selected window (shortcut: double-click a window in the grid).");
					break;
				case "MnuRename":
					OnWndWriterManageWindowsEvent_Status("Rename Window: change the ID of the currently selected window (shortcut: click the ID of a selected item).");
					break;
				case "MnuDelete":
					OnWndWriterManageWindowsEvent_Status("Delete Window: delete the currently selected window (deleted windows cannot be recovered).");
					break;
				case "MnuPreviewViewer":
					OnWndWriterManageWindowsEvent_Status("Preview Window > Interface Viewer (script): open the window through Interface Writer.");
					break;
				case "MnuPreviewTester":
					OnWndWriterManageWindowsEvent_Status("Preview Window > Interface Tester (external): open the window using the Interface Tester application.");
					break;
				case "MnuCut":
					OnWndWriterManageWindowsEvent_Status("Cut Window: move the selected window from the interface to clipboard.");
					break;
				case "MnuCopy":
					OnWndWriterManageWindowsEvent_Status("Copy Window: copy the selected window from the interface to clipboard.");
					break;
				case "MnuControl":
					OnWndWriterManageWindowsEvent_Status("Control Manager: open the Control Manager window, where you can organize controls.");
					break;
				case "MnuElement":
					OnWndWriterManageWindowsEvent_Status("Element Manager: open the Element Manager window, where you can organize elements.");
					break;
				case "MnuPaste":
					OnWndWriterManageWindowsEvent_Status("Paste Window: add the current clipboard content to the interface (windows with a matching ID will be overwritten).");
					break;
				case "MnuData":
					OnWndWriterManageWindowsEvent_Status("Clipboard Data: view the current content stored on the clipboard.");
					break;
				case "MnuClear":
					OnWndWriterManageWindowsEvent_Status("Clear Clipboard: empty the window clipboard (deleted windows cannot be recovered).");
					break;
			}
		}
		else
		{
			switch (ControlId)
			{
				case "BtnSave":
					SaveFile();
					OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" saved successfully.");
					break;
				case "MnuSaveAs":
					var NewPath = BrowseForFile("Save interface as...", ScriptDir, true, "", "", WndWriterManageWindows.Handle);
					if (NewPath !== false)
					{
						FilePath = NewPath;
						SaveFile();
						Enable(WndWriterManageWindows, "BtnSave", 1);
						Interop.Call("user32", "SetWindowTextW", WndWriterManageWindows.Handle, "Interface Writer | Windows: " + FilePath);
						OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" saved successfully.");
					}
					break;
				case "MnuSaveCopy":
					var NewPath = BrowseForFile("Save interface copy...", ScriptDir, true, "", "", WndWriterManageWindows.Handle);
					if (NewPath !== false)
					{
						SaveFilePath(NewPath);
						OnWndWriterManageWindowsEvent_Status("File \"" + NewPath + "\" saved successfully.");
					}
					break;
				case "MnuImport":
					var WorkingPath = BrowseForFile("Import a file...", ScriptDir, false, "", "", WndWriterManageWindows.Handle);
					if (WorkingPath !== false)
					{
						var Result = LoadFile(WorkingPath);
						if (Result === true)
						{
							NowEditing = 1;
							OnWndWriterManageWindowsEvent_Populate();
							if (Registry.Read("Options\\ChkSaveAction") && FilePath !== "")
							{
								SaveFile();
							}
							OnWndWriterManageWindowsEvent_Status("File \"" + WorkingPath + "\" imported successfully.");
							break;
						}
						else
						{
							switch (Result[0])
							{
								case 1:
									FileLoadImport = true;
									OnWndWriterErrorsEvent_Build(Result[1], Result[2]);
									break;
								case 2:
									Dialog.Show("Import a file...", Result[1], Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterManageWindows);
									OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, ControlId);
									break;
							}
						}
					}
					break;
				case "MnuSource":
					OnWndWriterSourceCodeEvent_Build();
					break;
				case "MnuReload":
					if (FilePath === "")
					{
						if (Dialog.Show("Reload from disk...", "This file currenty isn't saved.  However, you can use the reload function to save a temporary file and reload it.  This can be useful if Interface Writer is not functioning correctly.\n\nAre you sure you wish to reload this file?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterManageWindows) === Dialog.Result.Yes)
						{
							SaveFilePath(TempFile + "2");
							VarCleanup(true);
							MsgPlus.AddTimer("WaitLoad|" + TempFile + "2|Tmp", 100);
						}
					}
					else if (Dialog.Show("Reload from disk...", "By reloading the interface file from the disk, the file will be closed and loaded from the file again.  Any changes since the previous save will be lost.\n\nAre you sure you wish to return to the previously saved version?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterManageWindows) === Dialog.Result.Yes)
					{
						var WorkingPath = FilePath;
						VarCleanup();
						MsgPlus.AddTimer("WaitLoad|" + WorkingPath, 100);
					}
					break;
				case "MnuOptions":
					OnWndOptionsMenuEvent_Build();
					break;
				case "MnuAbout":
					OnWndAboutEvent_Build();
					break;
				case "MnuExit":
					if (!OnWndWriterManageWindowsEvent_Cancel(WndWriterManageWindows))
					{
						CloseWnd(WndWriterManageWindows);
					}
					break;
				case "BtnMulti":
					OnWndWriterSelectWindowsEvent_Build();
					break;
				case "MnuAdd":
					OnWndWriterAddWindowEvent_Build();
					break;
				case "MnuBuild":
					OnWndWriterBuildWindowEvent_Build();
					break;
				case "MnuPreset":
					OnWndWriterPresetWindowsEvent_Build();
					break;
				case "MnuInfo":
					var Window = Interface.Window[WndId];
					var Message = "Identification: " + WndId + "\nTitle: " + (Window.Icon ? "[icon] " : "") + (Window.Title === "" ? "(none)" : Window.Title) + "\nAllow: " + (Window.Minimize || Window.Maximize || Window.Close ? (Window.Minimize ? "minimize, " : "") + (Window.Maximize ? "maximize, " : "") + (Window.Close ? "close" : "") : "(none)") + "\n\nTemplate: " + EnumWindowTemplate[Window.Template] + "\n";
					if (Window.Template !== 2)
					{
						Message += "Positioning: " + EnumWindowInitialPos[Window.InitialPos] + "\n";
					}
					Message += "Size: " + Window.Width + " x " + Window.Height + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")";
					Dialog.Show("Selected window information...", Message, Dialog.Icon.Info, Dialog.Buttons.OK, WndWriterManageWindows)
					break;
				case "MnuEdit":
					OnWndWriterEditWindowEvent_Build();
					break;
				case "MnuRename": // open rename text box
					Interop.Call("user32", "SetFocus", WndWriterManageWindows.GetControlHandle("LstWindows"));
					Interop.Call("user32", "SendMessageW", WndWriterManageWindows.GetControlHandle("LstWindows"), 4214, Writer.WndSel[0], 0);
					break;
				case "MnuDelete":
					CloseWnd(Close.Wnd); // just in case of sharing violations, etc.
					if (Dialog.Show("Delete a window...", "Are you sure you want to delete the window \"" + WndId +  "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterManageWindows) === Dialog.Result.Yes)
					{
						Debugging.Trace("<-- Start window delete. -->");
						Debugging.Trace("--> Deleting window object from the interface array...");
						if (Writer.DeleteWnd(WndId))
						{
							Debugging.Trace("--> | Window delete complete.");
							ProcessAutoSave();
							OnWndWriterManageWindowsEvent_Populate();
							OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" deleted from interface.");
						}
						else
						{
							Debugging.Trace("--> | Window delete error.");
							Dialog.Show("Delete a window...", "An error occured whilst deleting window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterManageWindows);
						}
						Debugging.Trace("<-- End window delete. -->");
					}
					break;
				case "MnuPreviewViewer":
					if (Interface.Window[WndId].Template === 2)
					{
						Dialog.Show("Preview a window...", "Child windows cannot be previewed through Interface Viewer.", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterManageWindows);

					}
					else
					{
						CloseWnd(WndWriterPreviewWindow);
						SaveFilePath(MsgPlus.ScriptFilesPath + "\\Temp.xml", undefined, WndId, true);
						WndWriterPreviewWindow = MsgPlus.CreateWnd("Temp.xml", "IW_TMP_" + WndId, 0);
						OnWndWriterManageWindowsEvent_Status("Preview of window \"" + WndId + "\" opened successfully.");
					}
					break;
				case "MnuPreviewTester":
					if (Registry.Exists("Miscellaneous\\Tester"))
					{
						if (FSO.FileExists(Registry.Read("Miscellaneous\\Tester")))
						{
							var OldPath = FilePath;
							FilePath = MsgPlus.ScriptFilesPath + "\\Temp.xml";
							SaveFile(undefined, WndId, true);
							SHELL.run("\"" + Registry.Read("Miscellaneous\\Tester") + "\" /InterfaceFile=\"" + FilePath + "\" /WindowId=IW_TMP_" + WndId);
							FilePath = OldPath;
							OnWndWriterManageWindowsEvent_Status("Preview of window \"" + WndId + "\" now loading.");
						}
						else
						{
							Dialog.Show("Interface Tester...", "The specified path points to a file that does not exist.", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterManageWindows);
							OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, "HidPreviewFind");
						}
					}
					else
					{
						if (Dialog.Show("Interface Tester...", "You need to locate the Interface Tester application before you can use this option.\nThe Interface Tester application can be downloaded from http://www.msgpluslive.net.", Dialog.Icon.Question, Dialog.Buttons.OK_Cancel, WndWriterManageWindows) === 1)
						{
							OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, "HidPreviewFind");
						}
					}
					break;
				case "HidPreviewFind":
					var Path = BrowseForFile("Interface Tester...", ScriptDir, false, "", "MPInterfaceTester.exe", WndWriterManageWindows.Handle, "Executible applications (*.exe)|*.exe||");
					if (Path !== false)
					{
						if (FSO.FileExists(Path))
						{
							Registry.Write("Miscellaneous\\Tester", Path);
							OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, "MnuPreviewTester");
						}
						else
						{
							Dialog.Show("Interface Tester...", "The specified path points to a file that does not exist.", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterManageWindows);
							OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, "HidPreviewFind");
						}
					}
					break;
				case "MnuCut":
					Clipboard.Window = Interface.Window[WndId];
					Clipboard.WndId = WndId;
					if (Writer.DeleteWnd(WndId))
					{
						ProcessAutoSave();
						OnWndWriterManageWindowsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" moved to the clipboard.");
					}
					else // unlikely to happen
					{
						Enable(WndWriterManageWindows, "BtnClipboard", (Clipboard.Window !== undefined)); // did it work or not?
						OnWndWriterManageWindowsEvent_Status("Failed to move window \"" + WndId + "\" to the clipboard.");
					}
					break;
				case "MnuCopy":
					Clipboard.Window = Interface.Window[WndId];
					Clipboard.WndId = WndId;
					Enable(WndWriterManageWindows, "BtnClipboard", 1);
					OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" copied to the clipboard.");
					break;
				case "MnuControl":
					OnWndWriterManageControlsEvent_Build();
					break;
				case "MnuElement":
					OnWndWriterManageElementsEvent_Build();
					break;
				case "MnuData":
					var Window = Clipboard.Window;
					var Message = "Identification: " + Clipboard.WndId + "\nTitle: " + (Window.Icon ? "[icon] " : "") + (Window.Title === "" ? "(none)" : Window.Title) + "\nAllow: " + (Window.Minimize || Window.Maximize || Window.Close ? (Window.Minimize ? "minimize, " : "") + (Window.Maximize ? "maximize, " : "") + (Window.Close ? "close" : "") : "(none)") + "\n\nTemplate: " + EnumWindowTemplate[Window.Template] + "\n";
					if (Window.Template !== 2)
					{
						Message += "Positioning: " + EnumWindowInitialPos[Window.InitialPos] + "\n";
					}
					Message += "Size: " + Window.Width + " x " + Window.Height + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")";
					Dialog.Show("Data on the clipboard...", Message, Dialog.Icon.Info, Dialog.Buttons.OK, WndWriterManageWindows)
					break;
				case "MnuPaste":
					var Ok = 0;
					if (Interface.Window[Clipboard.WndId] === undefined)
					{
						Ok = 1;
					}
					else if (Dialog.Show("Paste a window...", "Do you want to replace the existing window \"" + Clipboard.WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterManageWindows) === Dialog.Result.Yes)
					{
						Ok = 2;
					}
					if (Ok > 0)
					{
						if (Ok === 1)
						{
							Writer.AddWnd(Clipboard.WndId, Clipboard.Window.Icon, Clipboard.Window.Title, Clipboard.Window.Template, Clipboard.Window.BottomBar, Clipboard.Window.Width, Clipboard.Window.Height, Clipboard.Window.InitialPos, Clipboard.Window.Resizeable, Clipboard.Window.IsAbsolute, Clipboard.Window.Minimize, Clipboard.Window.Maximize, Clipboard.Window.Close, Clipboard.Window.Extra);
						}
						else if (Ok === 2)
						{
							Writer.EditWnd(Clipboard.WndId, Clipboard.Window.Icon, Clipboard.Window.Title, Clipboard.Window.Template, Clipboard.Window.BottomBar, Clipboard.Window.Width, Clipboard.Window.Height, Clipboard.Window.InitialPos, Clipboard.Window.Resizeable, Clipboard.Window.IsAbsolute, Clipboard.Window.Minimize, Clipboard.Window.Maximize, Clipboard.Window.Close, Clipboard.Window.Extra);
						}
						Interface.Window[Clipboard.WndId].Control = Clipboard.Window.Control;
						Interface.Window[Clipboard.WndId].Element = Clipboard.Window.Element;
						ProcessAutoSave();
						OnWndWriterManageWindowsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Window \"" + Clipboard.WndId + "\" pasted from the clipboard.");
					}
					break;
				case "MnuClear":
					if (Dialog.Show("Clear the clipboard...", "Remove the window \"" + Clipboard.WndId + "\" from the clipboard?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterManageWindows) === Dialog.Result.Yes)
					{
						var WndId = Clipboard.WndId;
						delete Clipboard.Window;
						delete Clipboard.WndId;
						Enable(WndWriterManageWindows, "BtnClipboard", 0);
						OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" removed from the clipboard.");
					}
					break;
			}
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageWindowsEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterManageWindows / LstViewClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		switch (ControlId)
		{
			case "LstWindows":
				Writer.WndSel[0] = ItemIdx;
				Enable(WndWriterManageWindows, "BtnSelection", Writer.WndSel[0] !== -1); // was an item selected?
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageWindowsEvent_LstViewDblClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterManageWindows / LstViewDblClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "LstWindows":
				if (Writer.WndSel[0] === -1)
				{
					OnWndWriterAddWindowEvent_Build();
				}
				else switch (Registry.Read("Options\\CmbDouble"))
				{
					case 0:
						OnWndWriterEditWindowEvent_Build();
						break;
					case 1:
						OnWndWriterManageWindowsEvent_CtrlClicked(PlusWnd, "MnuPreviewViewer");
						break;
					case 2:
						OnWndWriterManageControlsEvent_Build();
						break;
					case 3:
						OnWndWriterManageElementsEvent_Build();
						break;
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageWindowsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterManageWindows / LstViewRClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterManageWindowsEvent_LstViewClicked(WndWriterManageWindows, ControlId, ItemIdx);
		var SelMade = (ItemIdx >= 0);
		var Menu = Interop.Call("user32", "CreatePopupMenu"); // nice context menu
		var SubMenu = Interop.Call("user32", "CreatePopupMenu");
		var Option = new Array("", "MnuInfo", "MnuEdit", "MnuRename", "MnuDelete", "MnuPreviewViewer", "MnuPreviewTester", "MnuCut", "MnuCopy", "MnuControl", "MnuElement", "MnuAdd", "MnuBuild", "MnuPreset", "MnuData", "MnuPaste", "MnuClear");
		if (SelMade) // is a window selected?
		{
			var WndId = Writer.WndId[ItemIdx];
			var Window = Interface.Window[WndId];
			Writer.CtrlId = [];
			var Count = 0;
			for (var CtrlId in Window.Control)
			{
				Writer.CtrlId[Count++] = CtrlId;
			}
			Writer.ElmtId = [];
			var Count = 0;
			for (var ElmtId in Window.Element)
			{
				Writer.ElmtId[Count++] = ElmtId;
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Identification: " + WndId);
			if (Window.Template !== 2)
			{
				Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Title: " + (Window.Icon ? "[icon] " : "") + (Window.Title === "" ? "(none)" : Window.Title));
				Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Allow: " + (Window.Minimize || Window.Maximize || Window.Close ? (Window.Minimize ? "minimize, " : "") + (Window.Maximize ? "maximize, " : "") + (Window.Close ? "close" : "") : "(none)"));
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Template: " + EnumWindowTemplate[Window.Template]);
			if (Window.Template !== 2)
			{
				Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Positioning: " + EnumWindowInitialPos[Window.InitialPos]);
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Size: " + Window.Width + " x " + Window.Height + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			if (Writer.CtrlId.length > 4)
			{
				var CtrlList = [Writer.CtrlId[0], Writer.CtrlId[1], Writer.CtrlId[2], Writer.CtrlId[3]];
				CtrlList = CtrlList.join(", ") + "...";
			}
			else
			{
				var CtrlList = Writer.CtrlId.join(", ");
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Controls: " + (Writer.CtrlId.length === 0 ? "(none)" : CtrlList + " (" + Writer.CtrlId.length + " total)"));
			if (Writer.ElmtId.length > 4)
			{
				var ElmtList = [Writer.ElmtId[0], Writer.ElmtId[1], Writer.ElmtId[2], Writer.ElmtId[3]];
				ElmtList = ElmtList.join(", ") + "...";
			}
			else
			{
				var ElmtList = Writer.ElmtId.join(", ");
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Elements: " + (Writer.ElmtId.length === 0 ? "(none)" : ElmtList + " (" + Writer.ElmtId.length + " total)"));
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 0, 1, "&Additional information...");
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "Window &Info");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 2, "&Edit Window...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 3, "&Rename Window");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 4, "&Delete Window");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			SubMenu = Interop.Call("user32", "CreatePopupMenu");
			Interop.Call("user32", "AppendMenuW", SubMenu, 0, 5, "Interface &Viewer (script)...");
			Interop.Call("user32", "AppendMenuW", SubMenu, 0, 6, "Interface &Tester (external)...");
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "&Preview Window");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 7, "&Cut Window");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 8, "Co&py Window");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 9, "Con&trol Manager...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 10, "&Element Manager...");
		}
		else
		{
			Interop.Call("user32", "AppendMenuW", Menu, 0, 11, "&Add Window...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 12, "&Build Window...");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			var Count = 1;
			for (var WndId in Presets)
			{
				if (Count < 10)
				{
					Interop.Call("user32", "AppendMenuW", SubMenu, 0, Count + 16, "&" + Count + ") " + WndId);
					Option.push(WndId);
					Count++;
				}
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 0, 13, "Complete list...");
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "Insert &Preset");
		}
		if (Clipboard.Window !== undefined)
		{
			SubMenu = Interop.Call("user32", "CreatePopupMenu");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			var WndId = Clipboard.WndId;
			var Window = Clipboard.Window;
			Writer.CtrlId = [];
			var Count = 0;
			for (var CtrlId in Window.Control)
			{
				Writer.CtrlId[Count++] = CtrlId;
			}
			Writer.ElmtId = [];
			var Count = 0;
			for (var ElmtId in Window.Element)
			{
				Writer.ElmtId[Count++] = ElmtId;
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Identification: " + WndId);
			if (Window.Template !== 2)
			{
				Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Title: " + (Window.Icon ? "[icon] " : "") + (Window.Title === "" ? "(none)" : Window.Title));
				Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Allow: " + (Window.Minimize || Window.Maximize || Window.Close ? (Window.Minimize ? "minimize, " : "") + (Window.Maximize ? "maximize, " : "") + (Window.Close ? "close" : "") : "(none)"));
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Template: " + EnumWindowTemplate[Window.Template]);
			if (Window.Template !== 2)
			{
				Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Positioning: " + EnumWindowInitialPos[Window.InitialPos]);
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Size: " + Window.Width + " x " + Window.Height + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			if (Writer.CtrlId.length > 4)
			{
				var CtrlList = [Writer.CtrlId[0], Writer.CtrlId[1], Writer.CtrlId[2], Writer.CtrlId[3]];
				CtrlList = CtrlList.join(", ") + "...";
			}
			else
			{
				var CtrlList = Writer.CtrlId.join(", ");
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Controls: " + (Writer.CtrlId.length === 0 ? "(none)" : CtrlList + " (" + Writer.CtrlId.length + " total)"));
			if (Writer.ElmtId.length > 4)
			{
				var ElmtList = [Writer.ElmtId[0], Writer.ElmtId[1], Writer.ElmtId[2], Writer.ElmtId[3]];
				ElmtList = ElmtList.join(", ") + "...";
			}
			else
			{
				var ElmtList = Writer.ElmtId.join(", ");
			}
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Elements: " + (Writer.ElmtId.length === 0 ? "(none)" : ElmtList + " (" + Writer.ElmtId.length + " total)"));
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 0, 14, "&Additional information...");
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "Clipboard &Data");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 15, "&Paste Window");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 16, "Clear Clip&board");
		}
		var Cursor = Interop.Allocate(8);
		Interop.Call("user32", "GetCursorPos", Cursor);
		var Result = Interop.Call("user32", "TrackPopupMenu", Menu, 0 | 256 | 8192, Cursor.ReadDWORD(0), Cursor.ReadDWORD(4), 0, WndWriterManageWindows.Handle, 0);
		if (Result > 16)
		{
			var Ok = false;
			var WndId = Option[Result];
			if (Interface.Window[WndId] === undefined)
			{
				Ok = true;
			}
			else if (Dialog.Show("Insert a preset window...", "Do you want to replace the existing window \"" + WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterManageWindows) === Dialog.Result.Yes)
			{
				Ok = true;
			}
			if (Ok)
			{
				Interface.Window[WndId] = Presets[WndId];
				ProcessAutoSave();
				OnWndWriterManageWindowsEvent_Populate();
				OnWndWriterManageWindowsEvent_Status("Preset window \"" + WndId + "\" added to interface.");
			}
		}
		else
		{
			OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, Option[Result]);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageWindowsEvent_MessageNotification(PlusWnd, Message, wParam, lParam)
{
	try
	{
		Debugging.Call("WndWriterManageWindows / MessageNotification", {"PlusWnd" : PlusWnd.Handle, "Message" : Message, "wParam" : wParam, "lParam" : lParam});
		if (Message === 78)
		{
			var NMHDR = Interop.Allocate(52);
			Interop.Call("kernel32", "RtlMoveMemory", NMHDR.DataPtr, lParam, 52);
			if (NMHDR.ReadDWORD(8) === -176)
			{
				var ListHandle = WndWriterManageWindows.SendControlMessage("LstWindows", 4120, 0, 0);
				var EditLength = Interop.Call("user32", "SendMessageW", ListHandle, 14, 0, 0) + 1;
				var Buffer = Interop.Allocate((EditLength + 1) * 2);
				var Result = Interop.Call("user32", "SendMessageW", ListHandle, 13, EditLength, Buffer.DataPtr);
				Result = Buffer.readSTRING(0);
				var WndId = Writer.WndId[Writer.WndSel[0]];
				var Window = Interface.Window[WndId];
				var AllowEdit = (Result !== "" && !Result.match(/[^A-Za-z0-9_]/g) && Result !== WndId);
				for (var CurrentId in Interface.Window)
				{
					if (Result.toLowerCase() === CurrentId.toLowerCase())
					{
						AllowEdit = false;
						break;
					}
				}
				if (AllowEdit) // not in use, let's go!
				{
					Writer.EditWnd(WndId, Window.Icon, Window.Title, Window.Template, Window.BottomBar, Window.Width, Window.Height, Window.InitialPos, Window.Resizeable, Window.IsAbsolute, Window.Minimize, Window.Maximize, Window.Close, Window.Extra, Result);
					ProcessAutoSave();
					OnWndWriterManageWindowsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" renamed to \"" + Result + "\" in interface.");
				}
				else if (Result === WndId) // no change
				{
					OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" was not renamed.");
				}
				else
				{
					if (Result === "")
					{
						OnWndWriterManageWindowsEvent_Status("A new window ID was not specified.");
					}
					else if (Result.match(/[^A-Za-z0-9_]/g))
					{
						OnWndWriterManageWindowsEvent_Status("The window ID \"" + Result + "\" contains invalid characters.");
					}
					else
					{
						OnWndWriterManageWindowsEvent_Status("The window ID \"" + Result + "\" is already in use.");
					}
					OnWndWriterManageElementsEvent_CtrlClicked(WndWriterManageElements, "MnuRename");
				}
			}
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageWindowsEvent_Cancel(PlusWnd)
{
	try
	{
		Debugging.Call("WndWriterManageWindows / Cancel", {"PlusWnd" : PlusWnd.Handle});
		if (HelpGuide)
		{
			OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, "LnkHelp"); // disable help guide
			return true;
		}
		else
		{
			switch (Dialog.Show("Exit the editor...", "Do you want to save the changes before closing?", Dialog.Icon.Question, Dialog.Buttons.Yes_No_Cancel, WndWriterManageWindows))
			{
				case Dialog.Result.Cancel: // don't do anything
					return true;
				case Dialog.Result.Yes: // save first
					if (FilePath === "") // pick a file
					{
						var WorkPath = BrowseForFile("Save interface...", ScriptDir, true, "", "", WndWriterManageWindows.Handle);
						if (WorkPath === false)
						{
							return true;
						}
						else
						{
							FilePath = WorkPath;
							SaveFile();
						}
					}
					else
					{
						SaveFile();
					}
					return false;
				case Dialog.Result.No: // meh, close it
					return false;
			}
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageWindowsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterManageWindows / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		VarCleanup();
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
