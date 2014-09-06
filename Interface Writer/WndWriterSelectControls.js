/*
File: WndWriterSelectControls.js
Events for processing the selections of multiple controls.
*/

function OnWndWriterSelectControlsEvent_Build()
{
	Debugging.Call("WndWriterSelectControls / Build", {});
	CloseWnd(Close.Ctrl);
	WndWriterSelectControls = OpenWnd("Controls", "Writer", "SelectControls");
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Count = 0;
	for (var CtrlId in Interface.Window[WndId].Control)
	{
		Writer.CtrlId[Count] = CtrlId;
		var Control = Interface.Window[WndId].Control[CtrlId];
		WndWriterSelectControls.LstView_AddItem("LstControls", CtrlId);
		WndWriterSelectControls.LstView_SetItemIcon("LstControls", Count, "Control", true);
		Count++;
	}
}

function OnWndWriterSelectControlsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSelectControls / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var TmpSelID = new Array();
		var TmpSelCount = new Array();
		for (var X in Writer.CtrlId)
		{
			if (WndWriterSelectControls.LstView_GetSelectedState("LstControls", X))
			{
				TmpSelID.push(Writer.CtrlId[X]);
				TmpSelCount.push(X);
			}
		}
		Enable(WndWriterSelectControls, "BtnAction", (TmpSelCount.length > 0));
		switch (ControlId)
		{
			case "MnuEdit":
				if (TmpSelID.length === 1)
				{
					CloseWnd(WndWriterSelectControls);
					Writer.CtrlSel[0] = TmpSelCount[0];
					OnWndWriterEditControlEvent_Build();
				}
				else
				{
					OnWndWriterEditMultiControlsEvent_Build(TmpSelCount, TmpSelID);
				}
				break;
			case "MnuDelete":
				if (TmpSelID.length === 1)
				{
					if (Dialog.Show("Delete a control...", "Are you sure you want to delete the control \"" + TmpSelID[0] +  "\" in window \"" + WndId + "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterSelectControls) === Dialog.Result.Yes)
					{
						Debugging.Trace("<-- Start control delete. -->");
						Debugging.Trace("--> Deleting control object from the interface array...");
						if (Writer.DeleteCtrl(WndId, TmpSelID[0]))
						{
							Debugging.Trace("--> | Control delete complete.");
							ProcessAutoSave();
							OnWndWriterManageControlsEvent_Populate();
							OnWndWriterManageWindowsEvent_Status("Control \"" + TmpSelID[0] + "\" deleted from window \"" + WndId + "\" in interface.");
							CloseWnd(WndWriterSelectControls);
						}
						else
						{
							Debugging.Trace("--> | Control delete error.");
							Dialog.Show("Delete a control...", "An error occured whilst deleting the control \"" + TmpSelID[0] + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterSelectControls)
						}
						Debugging.Trace("<-- End control delete. -->");
					}
				}
				else
				{
					if (Dialog.Show("Delete some controls...", "Are you sure you want to delete all of the following controls from window \"" + WndId + "\"?\n\"" + TmpSelID.join("\", \"") + "\"", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterSelectControls) === Dialog.Result.Yes)
					{
						var Count = 0;
						for (var X in TmpSelID)
						{
							Debugging.Trace("<-- Start control delete. -->");
							Debugging.Trace("--> Checking information for control \"" + TmpSelID[X] + "\"...");
							Debugging.Trace("--> | In window: \"" + WndId + "\"");
							Debugging.Trace("--> Deleting control object from window object in interface array...");
							if (Writer.DeleteCtrl(WndId, TmpSelID[X]))
							{
								Debugging.Trace("--> | Control delete complete.");
							}
							else
							{
								Debugging.Trace("--> | Control delete error.");
								Dialog.Show("Delete some controls...", "An error occured whilst deleting the control \"" + TmpSelID[X] + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterSelectControls)
							}
							Debugging.Trace("<-- End control delete. -->");
							Count++;
						}
						ProcessAutoSave();
						OnWndWriterManageControlsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status(Count + " controls deleted from window \"" + WndId + "\" in interface.");
						CloseWnd(WndWriterSelectControls);
					}
				}
				break;
			case "MnuAll":
				for (var X in Writer.CtrlId)
				{
					WndWriterSelectControls.LstView_SetSelectedState("LstControls", X, true);
				}
				Enable(WndWriterSelectControls, "BtnAction", 1);
				break;
			case "MnuNone":
				for (var X in Writer.CtrlId)
				{
					WndWriterSelectControls.LstView_SetSelectedState("LstControls", X, false);
				}
				Enable(WndWriterSelectControls, "BtnAction", 0);
				break;
			case "MnuInvert":
				for (var X in Writer.CtrlId)
				{
					WndWriterSelectControls.LstView_SetSelectedState("LstControls", X, !WndWriterSelectControls.LstView_GetSelectedState("LstControls", X));
					OnWndWriterSelectControlsEvent_CtrlClicked(WndWriterSelectControls, "");
				}
				break;
			case "BtnSort":
				if (Dialog.Show("Sort all controls...", "This feature will sort the controls in the window \"" + WndId + "\" alphabetically.\nYou might want to save the file before you do this.  Sort the controls now?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterSelectControls) === Dialog.Result.Yes)
				{
					Interface.Window[WndId].Control = KeySort(Interface.Window[WndId].Control); // sort by key (window ID)
					CloseWnd(WndWriterSelectControls);
					OnWndWriterManageControlsEvent_Populate();
					OnWndWriterSelectControlsEvent_Build();
					OnWndWriterManageWindowsEvent_Status("All controls in the window \"" + WndId + "\" have been sorted alphabetically.");
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectControlsEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterSelectControls / LstViewClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterSelectControlsEvent_CtrlClicked(WndWriterSelectControls, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectControlsEvent_LstViewDblClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSelectControls / LstViewDblClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterSelectControlsEvent_CtrlClicked(WndWriterSelectControls, "MnuEdit");
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectControlsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterSelectControls / LstViewRClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterSelectControlsEvent_CtrlClicked(WndWriterSelectControls, ControlId);
		var SelAll = true;
		var SelNone = true;
		var SelCount = 0;
		for (var X in Writer.CtrlId)
		{
			if (WndWriterSelectControls.LstView_GetSelectedState("LstControls", X))
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
		if (!SelNone) // are there controls selected?
		{
			Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 1, "&Edit Control" + (SelCount === 1 ? "" : "s") + "...");
			Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 2, "&Delete Control" + (SelCount === 1 ? "" : "s"));
			Interop.Call("user32", "AppendMenuW", TmpMenu, 2048, 0, 0);
		}
		Interop.Call("user32", "AppendMenuW", TmpMenu, SelAll, 3, "Select &All");
		Interop.Call("user32", "AppendMenuW", TmpMenu, SelNone, 4, "Select &None");
		Interop.Call("user32", "AppendMenuW", TmpMenu, 2048, 0, 0);
		Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 5, "&Invert Selection");
		var TmpCursor = Interop.Allocate(8);
		Interop.Call("user32", "GetCursorPos", TmpCursor);
		var TmpOption = new Array("", "MnuEdit", "MnuDelete", "MnuAll", "MnuNone", "MnuInvert");
		var TmpResult = Interop.Call("user32", "TrackPopupMenu", TmpMenu, 0 | 256 | 8192, TmpCursor.ReadDWORD(0), TmpCursor.ReadDWORD(4), 0, WndWriterSelectControls.Handle, 0);
		OnWndWriterSelectControlsEvent_CtrlClicked(WndWriterSelectControls, TmpOption[TmpResult]);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
