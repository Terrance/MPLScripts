/*
File: WndWriterManageElements.js
Events for processing menu and list actions within the element manager.
*/

function OnWndWriterManageElementsEvent_Build()
{
	Debugging.Call("WndWriterManageElements / Build", {});
	CloseWnd(Close.Wnd);
	Writer.WndSel[1] = Writer.WndSel[0];
	var WndId = Writer.WndId[Writer.WndSel[1]];
	Writer.ElmtSel[1] = Writer.ElmtSel[0];
	WndWriterManageElements = OpenWnd("Elements", "Writer", "ManageElements");
	WndWriterManageElements.RegisterMessageNotification(78);
	Interop.Call("user32", "SetWindowTextW", WndWriterManageElements.Handle, NAME + " | Elements: " + WndId + " @ " + (FilePath === "" ? "(no file selected)" : FilePath));
	Enable(WndWriterManageElements, "BtnSave", FilePath !== "");
	OnWndWriterManageElementsEvent_Populate();
	OnWndWriterManageWindowsEvent_Status("Element manager for window \"" + WndId + "\" opened.");
}

function OnWndWriterManageElementsEvent_Populate()
{
	try
	{
		Debugging.Call("WndWriterManageElements / Populate", {});
		var Count = WndWriterManageElements.LstView_GetCount("LstElements");
		while (Count > 0)
		{
			WndWriterManageElements.LstView_RemoveItem("LstElements", Count - 1);
			Count--;
		}
		Writer.ElmtId = []; // reset selection
		Writer.ElmtSel[0] = -1;
		Enable(WndWriterManageElements, "BtnSelection", 0);
		var WndId = Writer.WndId[Writer.WndSel[1]];
		for (var ElmtId in Interface.Window[WndId].Element) // populate the grid
		{
			Writer.ElmtId[Count] = ElmtId;
			var Element = Interface.Window[WndId].Element[ElmtId];
			WndWriterManageElements.LstView_AddItem("LstElements", ElmtId);
			WndWriterManageElements.LstView_SetItemIcon("LstElements", Count, "Element", true);
			WndWriterManageElements.LstView_SetItemText("LstElements", Count, 1, EnumElementType[Element.Type]);
			WndWriterManageElements.LstView_SetItemText("LstElements", Count, 2, Element.Left);
			WndWriterManageElements.LstView_SetItemText("LstElements", Count, 3, Element.Top);
			WndWriterManageElements.LstView_SetItemText("LstElements", Count, 4, (Element.Width === "" ? "(none)" : Element.Width));
			WndWriterManageElements.LstView_SetItemText("LstElements", Count, 5, (Element.Height === "" ? "(none)" : Element.Height));
			WndWriterManageElements.LstView_SetItemText("LstElements", Count, 6, Element.Caption);
			WndWriterManageElements.LstView_SetItemText("LstElements", Count, 7, Element.Help);
			Count++;
		}
		Enable(WndWriterManageElements, "BtnMulti", (Count > 0)); // any elements in the grid?
		Enable(WndWriterManageElements, "BtnClipboard", (Clipboard.Element !== undefined)); // any clipboard data?
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageElementsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterManageElements / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		var ElmtId = Writer.ElmtId[Writer.ElmtSel[0]];
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
					OnWndWriterManageWindowsEvent_Status("Return: close the element manager and return to the window manager.");
					break;
				case "BtnMulti":
					OnWndWriterManageWindowsEvent_Status("Multiple: select one or more elements to perform various actions to.");
					break;
				case "MnuAdd":
					OnWndWriterManageWindowsEvent_Status("Add Element: create a new element for your interface file (shortcut: double-click an empty area of the grid).");
					break;
				case "MnuBuild":
					OnWndWriterManageWindowsEvent_Status("Build Element: visually build a element (currently NOT available).");
					break;
				case "MnuEdit":
					OnWndWriterManageWindowsEvent_Status("Edit Element: edit the currently selected element (shortcut: double-click a element in the grid).");
					break;
				case "MnuRename":
					OnWndWriterManageWindowsEvent_Status("Rename Element: change the ID of the currently selected element (shortcut: click the ID of a selected item).");
					break;
				case "MnuDelete":
					OnWndWriterManageWindowsEvent_Status("Delete Element: delete the currently selected element (deleted elements cannot be recovered).");
					break;
				case "MnuCut":
					OnWndWriterManageWindowsEvent_Status("Cut Element: move the selected element from the interface to clipboard.");
					break;
				case "MnuCopy":
					OnWndWriterManageWindowsEvent_Status("Copy Element: copy the selected element from the interface to clipboard.");
					break;
				case "MnuPaste":
					OnWndWriterManageWindowsEvent_Status("Paste Element: add the current clipboard content to the window (elements with a matching ID will be overwritten).");
					break;
				case "MnuData":
					OnWndWriterManageWindowsEvent_Status("Clipboard Data: view the current content stored on the clipboard.");
					break;
				case "MnuClear":
					OnWndWriterManageWindowsEvent_Status("Clear Clipboard: empty the element clipboard (deleted element cannot be recovered).");
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
					CloseWnd(WndWriterManageElements);
					break;
				case "BtnMulti":
					OnWndWriterSelectElementsEvent_Build();
					break;
				case "MnuAdd":
					OnWndWriterAddElementEvent_Build();
					break;
				case "MnuBuild": // still need help with this; can anyone help?
					Dialog.Show("Build an element...", "Unfortunately, this feature is not yet available.\n(if you can help with this, follow the link in the about window)\n\nThis will be implemented in future releases.", Dialog.Icon.Info, Dialog.Buttons.OK, WndWriterManageElements);
					break;
				case "MnuEdit":
					OnWndWriterEditElementEvent_Build();
					break;
				case "MnuRename": // open rename text box
					Interop.Call("user32", "SetFocus", WndWriterManageElements.GetControlHandle("LstElements"));
					Interop.Call("user32", "SendMessageW", WndWriterManageElements.GetControlHandle("LstElements"), 4214, Writer.ElmtSel[0], 0);
					break;
				case "MnuDelete":
					CloseWnd(Close.Elmt); // just in case of sharing violations, etc.
					if (Dialog.Show("Delete an element...", "Are you sure you want to delete the element \"" + ElmtId +  "\" from the window \"" + WndId +  "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterManageElements) === Dialog.Result.Yes);
					{
						Debugging.Trace("<-- Start element deletion. -->");
						Debugging.Trace("--> Checking information for element \"" + ElmtId + "\"...");
						Debugging.Trace("--> | In window: \"" + WndId + "\"");
						Debugging.Trace("--> Deleting element object from window object in interface array...");
						if (Writer.DeleteElmt(WndId, ElmtId))
						{
							Debugging.Trace("--> | Element delete successful.");
							ProcessAutoSave();
							OnWndWriterManageElementsEvent_Populate();
							OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" deleted from window \"" + WndId + "\" in interface.");
						}
						else // unlikely to happen
						{
							Debugging.Trace("> Element delete error.");
							Dialog.Show("Delete an element...", "An error occured whilst deleting element \"" + ElmtId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterManageElements)
						}
						Debugging.Trace("<-- End element delete. -->");
					}
					break;
				case "MnuCut":
					Clipboard.Element = Interface.Window[WndId].Element[ElmtId];
					Clipboard.ElmtId = ElmtId;
					if (Writer.DeleteElmt(WndId, ElmtId))
					{
						ProcessAutoSave();
						OnWndWriterManageElementsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" in window \"" + WndId + "\" moved to the clipboard.");
					}
					else // unlikely to happen
					{
						Enable(WndWriterManageElements, "BtnClipboard", (Clipboard.Element !== undefined)); // did it work or not?
						OnWndWriterManageWindowsEvent_Status("Failed to move element \"" + ElmtId + "\" in window \"" + WndId + "\" to the clipboard.");
					}
					break;
				case "MnuCopy":
					Clipboard.Element = Interface.Window[WndId].Element[ElmtId];
					Clipboard.ElmtId = ElmtId;
					Enable(WndWriterManageElements, "BtnClipboard", 1);
					OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" in window \"" + WndId + "\" copied to the clipboard.");
					break;
				case "MnuPaste":
					var Ok = false;
					if (Interface.Window[WndId].Element[Clipboard.ElmtId] === undefined)
					{
						Ok = true;
					}
					else if (Dialog.Show("Paste an element...", "Do you want to replace the existing element \"" + Clipboard.ElmtId + "\" in window \"" + WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterManageElements) === Dialog.Result.Yes)
					{
						Ok = true;
					}
					if (Ok)
					{
						Interface.Window[WndId].Element[Clipboard.ElmtId] = Clipboard.Element;
						ProcessAutoSave();
						OnWndWriterManageElementsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Element \"" + Clipboard.ElmtId + "\" copied from the clipboard to window \"" + WndId + "\".");
					}
					break;
				case "MnuData":
					var Element = Clipboard.Element;
					var Message = "Identification: " + Clipboard.ElmtId + "\nType: " + EnumElementType[Element.Type] + "\n\nPositioning: " + Element.Left + ", " + Element.Top + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")\nSize: " + (Element.Width === "" ? "(none)" : Element.Width) + " x " + (Element.Height === "" ? "(none)" : Element.Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")\n\n";
					Message += "Anchors: " + EnumControlElementAnchorH[Element.AnchorH] + ", " + EnumControlElementAnchorV[Element.AnchorV];
					Dialog.Show("Data on the clipboard...", Message, Dialog.Icon.Info, Dialog.Buttons.OK, WndWriterManageElements)
					break;
				case "MnuClear":
					if (Dialog.Show("Clear the clipboard...", "Remove the element \"" + Clipboard.ElmtId + "\" from the clipboard?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterManageElements) === Dialog.Result.Yes)
					{
						var ElmtId = Clipboard.ElmtId;
						delete Clipboard.Element;
						delete Clipboard.ElmtId;
						Enable(WndWriterManageControls, "BtnClipboard", 0);
						OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" removed from the clipboard.");
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

function OnWndWriterManageElementsEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterManageElements / LstViewClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		switch (ControlId)
		{
			case "LstElements":
				Writer.ElmtSel[0] = ItemIdx;
				Enable(WndWriterManageElements, "BtnSelection", Writer.ElmtSel[0] !== -1); // was an item selected?
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageElementsEvent_LstViewDblClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterManageElements / LstViewDblClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		switch (ControlId)
		{
			case "LstElements":
				if (Writer.ElmtSel[0] === -1)
				{
					OnWndWriterAddElementEvent_Build();
				}
				else
				{
					OnWndWriterEditElementEvent_Build();
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageElementsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterManageElements / LstViewRClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		OnWndWriterManageElementsEvent_LstViewClicked(WndWriterManageElements, ControlId, ItemIdx);
		var SelMade = (ItemIdx >= 0);
		var Menu = Interop.Call("user32", "CreatePopupMenu"); // nice context menu
		var SubMenu = Interop.Call("user32", "CreatePopupMenu");
		if (SelMade) // is an element selected?
		{
			var Window = Interface.Window[WndId];
			var ElmtId = Writer.ElmtId[ItemIdx];
			var Element = Window.Element[ElmtId];
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Identification: " + ElmtId);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Type: " + EnumElementType[Element.Type]);
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Positioning: " + Element.Left + ", " + Element.Top + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Size: " + (Element.Width === "" ? "(none)" : Element.Width) + " x " + (Element.Height === "" ? "(none)" : Element.Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
			Interop.Call("user32", "AppendMenuW", SubMenu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", SubMenu, 1, 0, "Anchors: " + EnumControlElementAnchorH[Element.AnchorH] + ", " + EnumControlElementAnchorV[Element.AnchorV]);
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "Element &Info");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 1, "&Edit Element...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 2, "&Rename Element");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 3, "&Delete Element");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 4, "&Cut Element");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 5, "Co&py Element");
		}
		else
		{
			Interop.Call("user32", "AppendMenuW", Menu, 0, 6, "&Add Element...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 7, "&Build Element...");
		}
		if (Clipboard.Element !== undefined) // any clipboard data?
		{
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 8, "&Paste Element");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 9, "Clipboard &Data...");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 10, "&Clear Clipboard");
		}
		var Cursor = Interop.Allocate(8);
		Interop.Call("user32", "GetCursorPos", Cursor);
		var Option = new Array("", "MnuEdit", "MnuRename", "MnuDelete", "MnuCut", "MnuCopy", "MnuAdd", "MnuBuild", "MnuPaste", "MnuData", "MnuClear");
		var Result = Interop.Call("user32", "TrackPopupMenu", Menu, 0 | 256 | 8192, Cursor.ReadDWORD(0), Cursor.ReadDWORD(4), 0, WndWriterManageElements.Handle, 0);
		OnWndWriterManageElementsEvent_CtrlClicked(WndWriterManageElements, Option[Result]);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterManageElementsEvent_MessageNotification(PlusWnd, Message, wParam, lParam)
{
	try
	{
		Debugging.Call("WndWriterManageElements / MessageNotification", {"PlusWnd" : PlusWnd.Handle, "Message" : Message, "wParam" : wParam, "lParam" : lParam});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		if (Message === 78)
		{
			var NMHDR = Interop.Allocate(52);
			Interop.Call("kernel32", "RtlMoveMemory", NMHDR.DataPtr, lParam, 52);
			if (NMHDR.ReadDWORD(8) === -176)
			{
				var ListHandle = WndWriterManageElements.SendControlMessage("LstElements", 4120, 0, 0);
				var EditLength = Interop.Call("user32", "SendMessageW", ListHandle, 14, 0, 0) + 1;
				var Buffer = Interop.Allocate((EditLength + 1) * 2);
				var Result = Interop.Call("user32", "SendMessageW", ListHandle, 13, EditLength, Buffer.DataPtr);
				Result = Buffer.readSTRING(0);
				var ElmtId = Writer.ElmtId[Writer.ElmtSel[0]];
				var Element = Interface.Window[WndId].Element[ElmtId];
				var AllowEdit = (Result !== "" && !Result.match(/[^A-Za-z0-9_]/g) && Result !== ElmtId);
				for (var CurrentId in Interface.Window[WndId].Element)
				{
					if (Result.toLowerCase() === CurrentId.toLowerCase())
					{
						AllowEdit = false;
						break;
					}
				}
				if (AllowEdit) // not in use, let's go!
				{
					Writer.EditElmt(WndId, ElmtId, Element.Type, Element.Left, Element.Top, Element.Width, Element.Height, Element.AnchorH, Element.AnchorV, Element.Comment, Element.Extra, Result);
					ProcessAutoSave();
					OnWndWriterManageElementsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" renamed to \"" + Result + "\" in window \"" + WndId + "\" in interface.");
				}
				else if (Result === ElmtId) // no change
				{
					OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" in window \"" + WndId + "\" was not renamed.");
				}
				else
				{
					if (Result === "")
					{
						OnWndWriterManageWindowsEvent_Status("A new element ID was not specified.");
					}
					else if (Result.match(/[^A-Za-z0-9_]/g))
					{
						OnWndWriterManageWindowsEvent_Status("The element ID \"" + Result + "\" contains invalid characters.");
					}
					else
					{
						OnWndWriterManageWindowsEvent_Status("The element ID \"" + Result + "\" is already in use.");
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

function OnWndWriterManageElementsEvent_Cancel(PlusWnd)
{
	try
	{
		Debugging.Call("WndWriterManageElements / Cancel", {"PlusWnd" : PlusWnd.Handle});
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

function OnWndWriterManageElementsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterManageElements / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterAddElement);
		CloseWnd(WndWriterEditElement);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
