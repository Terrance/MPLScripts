/*
File: WndWriterManageControls.js
Events for processing menu and list actions within the control manager.
*/

function OnWndWriterManageControlsEvent_Build()
{
	Debugging.Call("WndWriterManageControls / Build", {});
	CloseWnd(Close.Wnd);
	Writer.WndSel[1] = Writer.WndSel[0];
	var WndId = Writer.WndId[Writer.WndSel[1]];
	Writer.CtrlSel[1] = Writer.CtrlSel[0];
	WndWriterManageControls = OpenWnd("Controls", "Writer", "ManageControls");
	WndWriterManageControls.RegisterMessageNotification(78);
	Interop.Call("user32", "SetWindowTextW", WndWriterManageControls.Handle, NAME + " | Controls: " + WndId + " @ " + (FilePath === "" ? "(no file selected)" : FilePath));
	Enable(WndWriterManageControls, "BtnSave", FilePath !== "");
	OnWndWriterManageControlsEvent_Populate();
	OnWndWriterManageWindowsEvent_Status("Control manager for window \"" + WndId + "\" opened.");
}

function OnWndWriterManageControlsEvent_Populate()
{
	Debugging.Call("WndWriterManageControls / Populate", {});
	var Count = WndWriterManageControls.LstView_GetCount("LstControls");
	while (Count > 0)
	{
		WndWriterManageControls.LstView_RemoveItem("LstControls", Count - 1);
		Count--;
	}
	Writer.CtrlId = []; // reset selection
	Writer.CtrlSel[0] = -1;
	Enable(WndWriterManageControls, "BtnSelection", 0);
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	for (var CtrlId in Interface.Window[WndId].Control) // populate the grid
	{
		var Control = Window.Control[CtrlId];
		Writer.CtrlId[Count] = CtrlId;
		WndWriterManageControls.LstView_AddItem("LstControls", CtrlId);
		WndWriterManageControls.LstView_SetItemIcon("LstControls", Count, "Control", true);
		WndWriterManageControls.LstView_SetItemText("LstControls", Count, 1, EnumControlType[Control.Type]);
		WndWriterManageControls.LstView_SetItemText("LstControls", Count, 2, Window.BottomBar === 0 ? Control.Left : "(n/a)");
		WndWriterManageControls.LstView_SetItemText("LstControls", Count, 3, Window.BottomBar === 0 ? Control.Top : "(n/a)");
		WndWriterManageControls.LstView_SetItemText("LstControls", Count, 4, Control.Width);
		WndWriterManageControls.LstView_SetItemText("LstControls", Count, 5, Control.Height === "" ? "(none)" : Control.Height);
		WndWriterManageControls.LstView_SetItemText("LstControls", Count, 6, Control.Caption === "" ? "(none)" : Control.Caption);
		WndWriterManageControls.LstView_SetItemText("LstControls", Count, 7, Control.Help === "" ? "(none)" : Control.Help);
		Count++;
	}
	Enable(WndWriterManageControls, "BtnMulti", (Count > 0)); // any controls in the grid?
	Enable(WndWriterManageControls, "BtnClipboard", (Clipboard.Control !== undefined)); // any clipboard data?
}

function OnWndWriterManageControlsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterManageControls / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		var CtrlId = Writer.CtrlId[Writer.CtrlSel[0]];
		if (ControlId === "LnkHelp")
		{
			OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, ControlId);
		}
		if (HelpGuide) // post descriptions to the status bar, instead of running the actions
		{
			switch (ControlId)
			{
				case "BtnSave":
					OnWndWriterManageWindowsEvent_Status("Save: save the current file (available only if working with a file).");
					break;
				case "BtnReturn":
					OnWndWriterManageWindowsEvent_Status("Return: close the control manager and return to the window manager.");
					break;
				case "BtnMulti":
					OnWndWriterManageWindowsEvent_Status("Multiple: select one or more controls to perform various actions to.");
					break;
				case "MnuAdd":
					OnWndWriterManageWindowsEvent_Status("Add Control: create a new control for your interface file (shortcut: double-click an empty area of the grid).");
					break;
				case "MnuBuild":
					OnWndWriterManageWindowsEvent_Status("Build Control: visually build a control (currently NOT available).");
					break;
				case "MnuEdit":
					OnWndWriterManageWindowsEvent_Status("Edit Control: edit the currently selected control (shortcut: double-click a control in the grid).");
					break;
				case "MnuRename":
					OnWndWriterManageWindowsEvent_Status("Rename Control: change the ID of the currently selected control (shortcut: click the ID of a selected item).");
					break;
				case "MnuDelete":
					OnWndWriterManageWindowsEvent_Status("Delete Control: delete the currently selected control (deleted controls cannot be recovered).");
					break;
				case "MnuCut":
					OnWndWriterManageWindowsEvent_Status("Cut Control: move the selected control from the interface to clipboard.");
					break;
				case "MnuCopy":
					OnWndWriterManageWindowsEvent_Status("Copy Control: copy the selected control from the interface to clipboard.");
					break;
				case "MnuPaste":
					OnWndWriterManageWindowsEvent_Status("Paste Control: add the current clipboard content to the window (controls with a matching ID will be overwritten).");
					break;
				case "MnuData":
					OnWndWriterManageWindowsEvent_Status("Clipboard Data: view the current content stored on the clipboard.");
					break;
				case "MnuClear":
					OnWndWriterManageWindowsEvent_Status("Clear Clipboard: empty the control clipboard (deleted control cannot be recovered).");
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
				case "BtnReturn":
					CloseWnd(WndWriterManageControls);
					break;
				case "BtnMulti":
					OnWndWriterSelectControlsEvent_Build();
					break;
				case "MnuAdd":
					OnWndWriterAddControlEvent_Build();
					break;
				case "MnuBuild": // still need help with this; can anyone help?
					Dialog.Show("Build a control...", "Unfortunately, this feature is not yet available.\n(if you can help with this, follow the link in the about window)\n\nThis will be implemented in future releases.", Dialog.Icon.Info, Dialog.Buttons.OK, WndWriterManageControls);
					break;
				case "MnuEdit":
					OnWndWriterEditControlEvent_Build();
					break;
				case "MnuRename": // open rename text box
					Interop.Call("user32", "SetFocus", WndWriterManageControls.GetControlHandle("LstControls"));
					Interop.Call("user32", "SendMessageW", WndWriterManageControls.GetControlHandle("LstControls"), 4214, Writer.CtrlSel[0], 0);
					break;
				case "MnuDelete":
					CloseWnd(Close.Ctrl); // just in case of sharing violations, etc.
					if (Dialog.Show("Delete a control...", "Are you sure you want to delete the control \"" + CtrlId +  "\" from the window \"" + WndId +  "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterManageControls) === Dialog.Result.Yes)
					{
						Debugging.Trace("<-- Start control delete. -->");
						Debugging.Trace("--> Checking information for control \"" + CtrlId + "\"...");
						Debugging.Trace("--> | In window: \"" + WndId + "\"");
						Debugging.Trace("--> Deleting control object from window object in interface array...");
						if (Writer.DeleteCtrl(WndId, CtrlId))
						{
							Debugging.Trace("--> | Control delete successful.");
							ProcessAutoSave();
							OnWndWriterManageControlsEvent_Populate();
							OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" deleted from window \"" + WndId + "\" in interface.");
						}
						else
						{
							Debugging.Trace("--> | Control delete error.");
							Dialog.Show("Delete a control...", "An error occured whilst deleting control \"" + CtrlId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterManageControls);
						}
						Debugging.Trace("<-- End control delete. -->");
					}
					break;
				case "MnuCut":
					Clipboard.Control = Interface.Window[WndId].Control[CtrlId];
					Clipboard.CtrlId = CtrlId;
					if (Writer.DeleteCtrl(WndId, CtrlId))
					{
						ProcessAutoSave();
						OnWndWriterManageControlsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" in window \"" + WndId + "\" moved to the clipboard.");
					}
					else // unlikely to happen
					{
						Enable(WndWriterManageControls, "BtnClipboard", (Clipboard.Control !== undefined)); // did it work or not?
						OnWndWriterManageWindowsEvent_Status("Failed to move control \"" + CtrlId + "\" in window \"" + WndId + "\" to the clipboard.");
					}
					break;
				case "MnuCopy":
					Clipboard.Control = Interface.Window[WndId].Control[CtrlId];
					Clipboard.CtrlId = CtrlId;
					Enable(WndWriterManageControls, "BtnClipboard", 1);
					OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" in window \"" + WndId + "\" copied to the clipboard.");
					break;
				case "MnuPaste":
					var Ok = false;
					if (Interface.Window[WndId].Control[Clipboard.CtrlId] === undefined)
					{
						Ok = true;
					}
					else if (Dialog.Show("Paste a control...", "Do you want to replace the existing control \"" + Clipboard.CtrlId + "\" in window \"" + WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterManageControls) === Dialog.Result.Yes)
					{
						Ok = true;
					}
					if (Ok)
					{
						Interface.Window[WndId].Control[Clipboard.CtrlId] = Clipboard.Control;
						ProcessAutoSave();
						OnWndWriterManageControlsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Control \"" + Clipboard.CtrlId + "\" copied from the clipboard to window \"" + WndId + "\".");
					}
					break;
				case "MnuData":
					var Control = Clipboard.Control;
					var Message = "Identification: " + Clipboard.CtrlId + "\nType: " + EnumControlType[Control.Type] + "\n\nPositioning: " + Control.Left + ", " + Control.Top + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")\nSize: " + Control.Width + " x " + (Control.Height === "" ? "(none)" : Control.Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")\n\n";
					Message += "Anchors: " + EnumControlElementAnchorH[Control.AnchorH] + ", " + EnumControlElementAnchorV[Control.AnchorV] + "\n\nCaption: " + (Control.Caption === "" ? "(none)" : Control.Caption) + "\nHelp: " + (Control.Help === "" ? "(none)" : Control.Help);
					Dialog.Show("Data on the clipboard...", Message, Dialog.Icon.Info, Dialog.Buttons.OK, WndWriterManageControls);
					break;
				case "MnuClear":
					if (Dialog.Show("Clear the clipboard...", "Remove the control \"" + Clipboard.CtrlId + "\" from the clipboard?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterManageControls) === Dialog.Result.Yes)
					{
						var CtrlId = Clipboard.CtrlId;
						delete Clipboard.Control;
						delete Clipboard.CtrlId;
						Enable(WndWriterManageControls, "BtnClipboard", 0);
						OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" removed from the clipboard.");
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

function OnWndWriterManageControlsEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterManageControls / LstViewClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		switch (ControlId)
		{
			case "LstControls":
				Writer.CtrlSel[0] = ItemIdx;
				Enable(WndWriterManageControls, "BtnSelection", Writer.CtrlSel[0] !== -1); // was an item selected?
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageControlsEvent_LstViewDblClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterManageControls / LstViewDblClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		switch (ControlId)
		{
			case "LstControls":
				if (Writer.CtrlSel[0] === -1)
				{
					OnWndWriterAddControlEvent_Build();
				}
				else
				{
					OnWndWriterEditControlEvent_Build();
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageControlsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterManageControls / LstViewRClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		OnWndWriterManageControlsEvent_LstViewClicked(WndWriterManageControls, ControlId, ItemIdx);
		var SelMade = (ItemIdx >= 0);
		var Menu = Interop.Call("user32", "CreatePopupMenu"); // nice context menu
		var SubMenu = Interop.Call("user32", "CreatePopupMenu");
		var Option = new Array("", "MnuInfo", "MnuEdit", "MnuRename", "MnuDelete", "MnuCut", "MnuCopy", "MnuAdd", "MnuBuild", "MnuData", "MnuPaste", "MnuClear");
		if (SelMade) // is a control selected?
		{
			var Window = Interface.Window[WndId];
			var CtrlId = Writer.CtrlId[ItemIdx];
			var Control = Window.Control[CtrlId];
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Identification: " + CtrlId);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Type: " + EnumControlType[Control.Type]);
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Positioning: " + Control.Left + ", " + Control.Top + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Size: " + Control.Width + " x " + (Control.Height === "" ? "(none)" : Control.Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Anchors: " + EnumControlElementAnchorH[Control.AnchorH] + ", " + EnumControlElementAnchorV[Control.AnchorV]);
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Caption: " + (Control.Caption === "" ? "(none)" : (Control.Caption.length > 25 ? Control.Caption.substr(0, 20) + "..." : Control.Caption)));
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Help: " + (Control.Help === "" ? "(none)" : (Control.Help.length > 25 ? Control.Help.substr(0, 20) + "..." : Control.Help)));
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 0, 1, "&Additional information...");
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "Control &Info");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 2, "&Edit Control...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 3, "&Rename Control");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 4, "&Delete Control");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 5, "&Cut Control");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 6, "Co&py Control");
		}
		else
		{
			Interop.Call("user32", "AppendMenuW", Menu, 0, 7, "&Add Control...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 8, "&Build Control...");
		}
		if (Clipboard.Control !== undefined) // any clipboard data?
		{
			SubMenu = Interop.Call("user32", "CreatePopupMenu");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			var CtrlId = Clipboard.CtrlId;
			var Control = Clipboard.Control;
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Identification: " + CtrlId);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Type: " + EnumControlType[Control.Type]);
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Positioning: " + Control.Left + ", " + Control.Top);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Size: " + Control.Width + " x " + (Control.Height === "" ? "(none)" : Control.Height));
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Anchors: " + EnumControlElementAnchorH[Control.AnchorH] + ", " + EnumControlElementAnchorV[Control.AnchorV]);
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Caption: " + (Control.Caption === "" ? "(none)" : (Control.Caption.length > 25 ? Control.Caption.substr(0, 20) + "..." : Control.Caption)));
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Help: " + (Control.Help === "" ? "(none)" : (Control.Help.length > 25 ? Control.Help.substr(0, 20) + "..." : Control.Help)));
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 0, 9, "&Additional information...");
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "Clipboard &Data");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 10, "&Paste Control");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 11, "&Clear Clipboard");
		}
		var Cursor = Interop.Allocate(8);
		Interop.Call("user32", "GetCursorPos", Cursor);
		var Result = Interop.Call("user32", "TrackPopupMenu", Menu, 0 | 256 | 8192, Cursor.ReadDWORD(0), Cursor.ReadDWORD(4), 0, WndWriterManageControls.Handle, 0);
		OnWndWriterManageControlsEvent_CtrlClicked(WndWriterManageControls, Option[Result]);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageControlsEvent_MessageNotification(PlusWnd, Message, wParam, lParam)
{
	try
	{
		Debugging.Call("WndWriterManageControls / MessageNotification", {"PlusWnd" : PlusWnd.Handle, "Message" : Message, "wParam" : wParam, "lParam" : lParam});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		if (Message === 78)
		{
			var NMHDR = Interop.Allocate(52);
			Interop.Call("kernel32", "RtlMoveMemory", NMHDR.DataPtr, lParam, 52);
			if (NMHDR.ReadDWORD(8) === -176)
			{
				var ListHandle = WndWriterManageControls.SendControlMessage("LstControls", 4120, 0, 0);
				var EditLength = Interop.Call("user32", "SendMessageW", ListHandle, 14, 0, 0) + 1;
				var Buffer = Interop.Allocate((EditLength + 1) * 2);
				var Result = Interop.Call("user32", "SendMessageW", ListHandle, 13, EditLength, Buffer.DataPtr);
				Result = Buffer.readSTRING(0);
				var CtrlId = Writer.CtrlId[Writer.CtrlSel[0]];
				var Control = Interface.Window[WndId].Control[CtrlId];
				var AllowEdit = (Result !== "" && !Result.match(/[^A-Za-z0-9_]/g) && Result !== CtrlId);
				for (var CurrentId in Interface.Window[WndId].Control)
				{
					if (Result.toLowerCase() === CurrentId.toLowerCase())
					{
						AllowEdit = false;
						break;
					}
				}
				if (AllowEdit) // not in use, let's go!
				{
					Writer.EditCtrl(WndId, CtrlId, Control.Type, Control.Left, Control.Top, Control.Width, Control.Height, Control.AnchorH, Control.AnchorV, Control.Caption, Control.Help, Control.Location, Control.Comment, Control.Enabled, Control.Visible, Control.Extra, Result);
					ProcessAutoSave();
					OnWndWriterManageControlsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" renamed to \"" + Result + "\" in window \"" + WndId + "\" in interface.");
				}
				else if (Result === CtrlId) // no change
				{
					OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" in window \"" + WndId + "\" was not renamed.");
				}
				else
				{
					if (Result === "")
					{
						OnWndWriterManageWindowsEvent_Status("A new control ID was not specified.");
					}
					else if (Result.match(/[^A-Za-z0-9_]/g))
					{
						OnWndWriterManageWindowsEvent_Status("The control ID \"" + Result + "\" contains invalid characters.");
					}
					else
					{
						OnWndWriterManageWindowsEvent_Status("The control ID \"" + Result + "\" is already in use.");
					}
					OnWndWriterManageControlsEvent_CtrlClicked(WndWriterManageControls, "MnuRename");
				}
			}
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageControlsEvent_Cancel(PlusWnd)
{
	try
	{
		Debugging.Call("WndWriterManageControls / Cancel", {"PlusWnd" : PlusWnd.Handle});
		if (HelpGuide)
		{
			OnWndWriterManageWindowsEvent_CtrlClicked(WndWriterManageWindows, "LnkHelp"); // disable help guide
			return true;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageControlsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterManageControls / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterAddControl);
		CloseWnd(WndWriterEditControl);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
