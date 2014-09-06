/*
File: WndWriterSelectElements.js
Events for processing the selections of multiple elements.
*/

function OnWndWriterSelectElementsEvent_Build()
{
	Debugging.Call("WndWriterSelectElements / Build", {});
	CloseWnd(Close.Elmt);
	WndWriterSelectElements = OpenWnd("Elements", "Writer", "SelectElements");
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Count = 0;
	for (var ElmtId in Interface.Window[WndId].Element)
	{
		Writer.ElmtId[Count] = ElmtId;
		var Element = Interface.Window[WndId].Element[ElmtId];
		WndWriterSelectElements.LstView_AddItem("LstElements", ElmtId);
		WndWriterSelectElements.LstView_SetItemIcon("LstElements", Count, "Element", true);
		Count++;
	}
}

function OnWndWriterSelectElementsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSelectElements / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var TmpSelID = new Array();
		var TmpSelCount = new Array();
		for (var X in Writer.ElmtId)
		{
			if (WndWriterSelectElements.LstView_GetSelectedState("LstElements", X))
			{
				TmpSelID.push(Writer.ElmtId[X]);
				TmpSelCount.push(X);
			}
		}
		Enable(WndWriterSelectElements, "BtnAction", (TmpSelCount.length > 0));
		switch (ControlId)
		{
			case "MnuEdit":
				if (TmpSelID.length === 1)
				{
					CloseWnd(WndWriterSelectElements);
					Writer.ElmtSel[0] = TmpSelCount[0];
					OnWndWriterEditElementEvent_Build();
				}
				else
				{
					OnWndWriterEditMultiElementsEvent_Build(TmpSelCount, TmpSelID);
				}
				break;
			case "MnuDelete":
				if (TmpSelID.length === 1)
				{
					if (Dialog.Show("Delete a element...", "Are you sure you want to delete the element \"" + TmpSelID[0] +  "\" in window \"" + WndId + "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterSelectElements) === Dialog.Result.Yes)
					{
						Debugging.Trace("<-- Start element delete. -->");
						Debugging.Trace("--> Deleting element object from the interface array...");
						if (Writer.DeleteElmt(WndId, TmpSelID[0]))
						{
							Debugging.Trace("--> | Element delete complete.");
							ProcessAutoSave();
							OnWndWriterManageElementsEvent_Populate();
							OnWndWriterManageWindowsEvent_Status("Element \"" + TmpSelID[0] + "\" deleted from window \"" + WndId + "\" in interface.");
							CloseWnd(WndWriterSelectElements);
						}
						else
						{
							Debugging.Trace("--> | Element delete error.");
							Dialog.Show("Delete a element...", "An error occured whilst deleting the element \"" + TmpSelID[0] + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterSelectElements)
						}
						Debugging.Trace("<-- End element delete. -->");
					}
				}
				else
				{
					if (Dialog.Show("Delete some elements...", "Are you sure you want to delete all of the following elements from window \"" + WndId + "\"?\n\"" + TmpSelID.join("\", \"") + "\"", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterSelectElements) === Dialog.Result.Yes)
					{
						var Count = 0;
						for (var X in TmpSelID)
						{
							Debugging.Trace("<-- Start element delete. -->");
							Debugging.Trace("--> Checking information for element \"" + TmpSelID[X] + "\"...");
							Debugging.Trace("--> | In window: \"" + WndId + "\"");
							Debugging.Trace("--> Deleting element object from window object in interface array...");
							if (Writer.DeleteElmt(WndId, TmpSelID[X]))
							{
								Debugging.Trace("--> | Element delete complete.");
							}
							else
							{
								Debugging.Trace("--> | Element delete error.");
								Dialog.Show("Delete some elements...", "An error occured whilst deleting the element \"" + TmpSelID[X] + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterSelectElements)
							}
							Debugging.Trace("<-- End element delete. -->");
							Count++;
						}
						ProcessAutoSave();
						OnWndWriterManageElementsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status(Count + " elements deleted from window \"" + WndId + "\" in interface.");
						CloseWnd(WndWriterSelectElements);
					}
				}
				break;
			case "MnuAll":
				for (var X in Writer.ElmtId)
				{
					WndWriterSelectElements.LstView_SetSelectedState("LstElements", X, true);
				}
				Enable(WndWriterSelectElements, "BtnAction", 1);
				break;
			case "MnuNone":
				for (var X in Writer.ElmtId)
				{
					WndWriterSelectElements.LstView_SetSelectedState("LstElements", X, false);
				}
				Enable(WndWriterSelectElements, "BtnAction", 0);
				break;
			case "MnuInvert":
				for (var X in Writer.ElmtId)
				{
					WndWriterSelectElements.LstView_SetSelectedState("LstElements", X, !WndWriterSelectElements.LstView_GetSelectedState("LstElements", X));
					OnWndWriterSelectElementsEvent_CtrlClicked(WndWriterSelectElements, "");
				}
				break;
			case "BtnSort":
				if (Dialog.Show("Sort all elements...", "This feature will sort the elements in the window \"" + WndId + "\" alphabetically.\nYou might want to save the file before you do this.  Sort the elements now?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterSelectElements) === Dialog.Result.Yes)
				{
					Interface.Window[WndId].Element = KeySort(Interface.Window[WndId].Element); // sort by key (window ID)
					CloseWnd(WndWriterSelectElements);
					OnWndWriterManageElementsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("All elements in the window \"" + WndId + "\" have been sorted alphabetically.");
					OnWndWriterSelectElementsEvent_Build();
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectElementsEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterSelectElements / LstViewClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterSelectElementsEvent_CtrlClicked(WndWriterSelectElements, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectElementsEvent_LstViewDblClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSelectElements / LstViewDblClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterSelectElementsEvent_CtrlClicked(WndWriterSelectElements, "MnuEdit");
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSelectElementsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterSelectElements / LstViewRClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterSelectElementsEvent_CtrlClicked(WndWriterSelectElements, ControlId);
		var SelAll = true;
		var SelNone = true;
		var SelCount = 0;
		for (var X in Writer.ElmtId)
		{
			if (WndWriterSelectElements.LstView_GetSelectedState("LstElements", X))
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
		if (!SelNone) // are there elements selected?
		{
			Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 1, "&Edit Element" + (SelCount === 1 ? "" : "s") + "...");
			Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 2, "&Delete Element" + (SelCount === 1 ? "" : "s"));
			Interop.Call("user32", "AppendMenuW", TmpMenu, 2048, 0, 0);
		}
		Interop.Call("user32", "AppendMenuW", TmpMenu, SelAll, 3, "Select &All");
		Interop.Call("user32", "AppendMenuW", TmpMenu, SelNone, 4, "Select &None");
		Interop.Call("user32", "AppendMenuW", TmpMenu, 2048, 0, 0);
		Interop.Call("user32", "AppendMenuW", TmpMenu, 0, 5, "&Invert Selection");
		var TmpCursor = Interop.Allocate(8);
		Interop.Call("user32", "GetCursorPos", TmpCursor);
		var TmpOption = new Array("", "MnuEdit", "MnuDelete", "MnuAll", "MnuNone", "MnuInvert");
		var TmpResult = Interop.Call("user32", "TrackPopupMenu", TmpMenu, 0 | 256 | 8192, TmpCursor.ReadDWORD(0), TmpCursor.ReadDWORD(4), 0, WndWriterSelectElements.Handle, 0);
		OnWndWriterSelectElementsEvent_CtrlClicked(WndWriterSelectElements, TmpOption[TmpResult]);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
