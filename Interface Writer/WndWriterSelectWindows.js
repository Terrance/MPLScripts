/*
File: WndWriterSelectWindows.js
Events for processing the selections of multiple windows.
*/

function OnWndWriterSelectWindowsEvent_Build()
{
	Debugging.Call("WndWriterSelectWindows / Build", {});
	CloseWnd(Close.Wnd);
	WndWriterSelectWindows = OpenWnd("Windows", "Writer", "SelectWindows");
	var Count = 0;
	for (var WndId in Interface.Window)
	{
		Writer.WndId[Count] = WndId;
		var Window = Interface.Window[WndId];
		WndWriterSelectWindows.LstView_AddItem("LstWindows", WndId);
		WndWriterSelectWindows.LstView_SetItemIcon("LstWindows", Count, "Window", true);
		Count++;
	}
}

function OnWndWriterSelectWindowsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSelectWindows / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var TmpSelID = new Array();
		var TmpSelCount = new Array();
		for (var X in Writer.WndId)
		{
			if (WndWriterSelectWindows.LstView_GetSelectedState("LstWindows", X))
			{
				TmpSelID.push(Writer.WndId[X]);
				TmpSelCount.push(X);
			}
		}
		Enable(WndWriterSelectWindows, "BtnAction", (TmpSelCount.length > 0));
		switch (ControlId)
		{
			case "MnuEdit":
				CloseWnd(WndWriterSelectWindows);
				if (TmpSelID.length === 1)
				{
					Writer.WndSel[0] = TmpSelCount[0];
					OnWndWriterEditWindowEvent_Build();
				}
				else
				{
					OnWndWriterEditMultiWindowsEvent_Build(TmpSelCount, TmpSelID);
				}
				break;
			case "MnuDelete":
				if (TmpSelID.length === 1)
				{
					if (Dialog.Show("Delete a window...", "Are you sure you want to delete the window \"" + TmpSelID[0] +  "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterSelectWindows) === Dialog.Result.Yes)
					{
						Debugging.Trace("<-- Start window delete. -->");
						Debugging.Trace("--> Deleting window object from the interface array...");
						if (Writer.DeleteWnd(TmpSelID[0]))
						{
							Debugging.Trace("--> | Window delete complete.");
							ProcessAutoSave();
							OnWndWriterManageWindowsEvent_Populate();
							OnWndWriterManageWindowsEvent_Status("Window \"" + TmpSelID[0] + "\" deleted from interface.");
							CloseWnd(WndWriterSelectWindows);
						}
						else
						{
							Debugging.Trace("--> | Window delete error.");
							Dialog.Show("Delete a window...", "An error occured whilst deleting the window \"" + TmpSelID[0] + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterSelectWindows)
						}
						Debugging.Trace("<-- End window delete. -->");
					}
				}
				else
				{
					if (Dialog.Show("Delete some windows...", "Are you sure you want to delete all of the following windows?\n\"" + TmpSelID.join("\", \"") + "\"", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterSelectWindows) === Dialog.Result.Yes)
					{
						var Count = 0;
						for (var X in TmpSelID)
						{
							Debugging.Trace("<-- Start window delete. -->");
							Debugging.Trace("--> Deleting window object from the interface array...");
							if (Writer.DeleteWnd(TmpSelID[X]))
							{
								Debugging.Trace("--> | Window delete complete.");
							}
							else
							{
								Debugging.Trace("--> | Window delete error.");
								Dialog.Show("Delete some windows...", "An error occured whilst deleting the window \"" + TmpSelID[X] + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterSelectWindows)
							}
							Debugging.Trace("<-- End window delete. -->");
							Count++;
						}
						ProcessAutoSave();
						OnWndWriterManageWindowsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status(Count + " windows deleted from interface.");
						CloseWnd(WndWriterSelectWindows);
					}
				}
				break;
			case "MnuAll":
				for (var X in Writer.WndId)
				{
					WndWriterSelectWindows.LstView_SetSelectedState("LstWindows", X, true);
				}
				Enable(WndWriterSelectWindows, "BtnAction", 1);
				break;
			case "MnuNone":
				for (var X in Writer.WndId)
				{
					WndWriterSelectWindows.LstView_SetSelectedState("LstWindows", X, false);
				}
				Enable(WndWriterSelectWindows, "BtnAction", 0);
				break;
			case "MnuInvert":
				for (var X in Writer.WndId)
				{
					WndWriterSelectWindows.LstView_SetSelectedState("LstWindows", X, !WndWriterSelectWindows.LstView_GetSelectedState("LstWindows", X));
					OnWndWriterSelectWindowsEvent_CtrlClicked(WndWriterSelectWindows, "");
				}
				break;
			case "BtnSort":
				if (Dialog.Show("Sort all windows...", "This feature will sort the windows in your interface alphabetically.\nYou might want to save the file before you do this.  Sort the windows now?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterSelectWindows) === Dialog.Result.Yes)
				{
					Interface.Window = KeySort(Interface.Window); // sort by key (window ID)
					CloseWnd(WndWriterSelectWindows);
					OnWndWriterManageWindowsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("All windows in the interface have been sorted alphabetically.");
					OnWndWriterSelectWindowsEvent_Build();
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectWindowsEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterSelectWindows / LstViewClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterSelectWindowsEvent_CtrlClicked(WndWriterSelectWindows, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectWindowsEvent_LstViewDblClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSelectWindows / LstViewDblClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterSelectWindowsEvent_CtrlClicked(WndWriterSelectWindows, "MnuEdit");
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectWindowsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterSelectWindows / LstViewRClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterSelectWindowsEvent_CtrlClicked(WndWriterSelectWindows, ControlId);
		var SelAll = true;
		var SelNone = true;
		var SelCount = 0;
		for (var X in Writer.WndId)
		{
			if (WndWriterSelectWindows.LstView_GetSelectedState("LstWindows", X))
			{
				SelNone = false;
				SelCount++;
			}
			else
			{
				SelAll = false;
			}
		}
		var TmpMenu = Interop.Call("user32", "CreatePopupMenu"); // nice context menu
		if (!SelNone) // are there windows selected?
		{
			Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 1, "&Edit Window" + (SelCount === 1 ? "" : "s") + "...");
			Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 2, "&Delete Window" + (SelCount === 1 ? "" : "s"));
			Interop.Call("user32", "AppendMenuW", TmpMenu, 2048, 0, 0);
		}
		Interop.Call("user32", "AppendMenuW", TmpMenu, SelAll, 3, "Select &All");
		Interop.Call("user32", "AppendMenuW", TmpMenu, SelNone, 4, "Select &None");
		Interop.Call("user32", "AppendMenuW", TmpMenu, 2048, 0, 0);
		Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 5, "&Invert Selection");
		var TmpCursor = Interop.Allocate(8);
		Interop.Call("user32", "GetCursorPos", TmpCursor);
		var TmpOption = new Array("", "MnuEdit", "MnuDelete", "MnuAll", "MnuNone", "MnuInvert");
		var TmpResult = Interop.Call("user32", "TrackPopupMenu", TmpMenu, 0 | 256 | 8192, TmpCursor.ReadDWORD(0), TmpCursor.ReadDWORD(4), 0, WndWriterSelectWindows.Handle, 0);
		OnWndWriterSelectWindowsEvent_CtrlClicked(WndWriterSelectWindows, TmpOption[TmpResult]);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
