/*
File: WndWriterPresetWindows.js
Events for processing actions for displaying custom user preset windows.
*/

function OnWndWriterPresetWindowsEvent_Build()
{
	Debugging.Call("WndWriterPresetWindows / Build", {});
	CloseWnd(Close.Wnd);
	WndWriterPresetWindows = OpenWnd("Windows", "Writer", "PresetWindows");
	OnWndWriterPresetWindowsEvent_Populate();
}

function OnWndWriterPresetWindowsEvent_Populate()
{
	var Count = WndWriterPresetWindows.LstView_GetCount("LstWindows");
	while (Count > 0)
	{
		WndWriterPresetWindows.LstView_RemoveItem("LstWindows", Count - 1);
		Count--;
	}
	Enable(WndWriterPresetWindows, "BtnAction", 0);
	for (var WndId in Presets)
	{
		Writer.WndId[Count] = WndId;
		var Window = Presets[WndId];
		WndWriterPresetWindows.LstView_AddItem("LstWindows", WndId);
		WndWriterPresetWindows.LstView_SetItemIcon("LstWindows", Count, "Window", true);
		Count++;
	}
}

function OnWndWriterPresetWindowsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterPresetWindows / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = WndWriterPresetWindows.LstView_GetItemText("LstWindows", Writer.PrsSel, 0);
		Enable(WndWriterPresetWindows, "BtnAction", (Writer.PrsSel !== -1));
		switch (ControlId)
		{
			case "MnuInsert":
				var Ok = false;
				if (Interface.Window[WndId] === undefined)
				{
					Ok = true;
				}
				else if (Dialog.Show("Insert a preset window...", "Do you want to replace the existing window \"" + WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterPresetWindows) === Dialog.Result.Yes)
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
				break;
			case "MnuDelete":
				if (Dialog.Show("Delete a window...", "Are you sure you want to delete the preset window \"" + WndId +  "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndWriterPresetWindows) === Dialog.Result.Yes)
				{
					delete Presets[WndId];
					OnWndWriterPresetWindowsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" deleted from presets.");
				}
				break;
			case "BtnNew":
				OnWndWriterAddWindowEvent_Build();
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterPresetWindowsEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterPresetWindows / LstViewClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		switch (ControlId)
		{
			case "LstWindows":
				Writer.PrsSel = ItemIdx;
				Enable(WndWriterPresetWindows, "BtnAction", Writer.PrsSel !== -1); // was an item selected?
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterPresetWindowsEvent_LstViewDblClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterPresetWindows / LstViewDblClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (Writer.PrsSel !== -1)
		{
			OnWndWriterPresetWindowsEvent_CtrlClicked(WndWriterPresetWindows, "MnuInsert");
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterPresetWindowsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	try
	{
		Debugging.Call("WndWriterPresetWindows / LstViewRClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId, "ItemIdx" : ItemIdx});
		OnWndWriterPresetWindowsEvent_LstViewClicked(WndWriterPresetWindows, ControlId, ItemIdx);
		var Menu = Interop.Call("user32", "CreatePopupMenu"); // nice context menu
		if (Writer.PrsSel !== -1) // is there a window selected?
		{
			var SubMenu = Interop.Call("user32", "CreatePopupMenu");
			var WndId = WndWriterPresetWindows.LstView_GetItemText("LstWindows", Writer.PrsSel, 0);
			var Window = Presets[WndId];
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
			Interop.Call("user32", "AppendMenuW", Menu, 16, SubMenu, "Preset &Info");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
			Interop.Call("user32", "AppendMenuW", Menu, 0, 1, "&Insert Preset...");
			Interop.Call("user32", "AppendMenuW", Menu, 0, 2, "&Delete Preset");
			Interop.Call("user32", "AppendMenuW", Menu, 2048, 0, 0);
		}
		Interop.Call("user32", "AppendMenuW", Menu, 0, 3, "&New Preset...");
		var Cursor = Interop.Allocate(8);
		Interop.Call("user32", "GetCursorPos", Cursor);
		var Option = ["", "MnuInsert", "MnuDelete", "BtnNew"];
		var Result = Interop.Call("user32", "TrackPopupMenu", Menu, 0 | 256 | 8192, Cursor.ReadDWORD(0), Cursor.ReadDWORD(4), 0, WndWriterPresetWindows.Handle, 0);
		OnWndWriterPresetWindowsEvent_CtrlClicked(WndWriterPresetWindows, Option[Result]);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
