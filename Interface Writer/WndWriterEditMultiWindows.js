/*
File: WndWriterEditMultiWindows.js
Events for processing multiple window modifications.
*/

function OnWndWriterEditMultiWindowsEvent_Build(Count, ID)
{
	Debugging.Call("WndWriterEditMultiWindows / Build", {"Count" : Count, "ID" : ID});
	CloseWnd(Close.Wnd);
	Writer.WndSel[1] = Writer.WndSel[0];
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	WndWriterEditMultiWindows = OpenWnd("Windows", "Writer", "EditMultiWindows");
	WndWriterEditMultiWindows.SetControlText("EdtWnds", ID.join(", ")); // hidden field, easier to process than combo
	WndWriterEditMultiWindows.Combo_AddItem("CmbWnds", "Total: " + ID.length + " windows..."); // nice way for user to see which windows
	for (var X in ID)
	{
		WndWriterEditMultiWindows.Combo_AddItem("CmbWnds", ID[X]);
	}
	WndWriterEditMultiWindows.Combo_SetCurSel("CmbWnds", 0);
	for (var X in EnumWindowTemplate)
	{
		WndWriterEditMultiWindows.Combo_AddItem("CmbTemplate", EnumWindowTemplate[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditMultiWindows.Combo_SetCurSel("CmbTemplate", 0);
	for (var X in EnumWindowBottomBar)
	{
		WndWriterEditMultiWindows.Combo_AddItem("CmbBottomBar", EnumWindowBottomBar[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditMultiWindows.Combo_SetCurSel("CmbBottomBar", 0);
	for (var X in EnumWindowInitialPos)
	{
		WndWriterEditMultiWindows.Combo_AddItem("CmbInitialPos", EnumWindowInitialPos[X] + (X == 1 ? " (default)" : ""));
	}
	WndWriterEditMultiWindows.Combo_SetCurSel("CmbInitialPos", 1);
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkIcon"), 241, 241, 0); // 241 = checkbox "third" state (block)
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkResizeable"), 241, 241, 0);
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkIsAbsolute"), 241, 241, 0);
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkMinimize"), 241, 241, 0);
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkMaximize"), 241, 241, 0);
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkClose"), 241, 241, 0);
}

function OnWndWriterEditMultiWindowsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiWindows / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterEditMultiWindowsEvent_EditTextChanged(WndWriterEditMultiWindows, ControlId);
		var WndIdList = WndWriterEditMultiWindows.GetControlText("EdtWnds").split(", ");
		switch (ControlId)
		{
			case "BtnEdit": // it looks very complicated, but it isn't really: if an option is set, then it uses it, otherwise it's set to undefined for later
				var AllIcon = (WndWriterEditMultiWindows.Button_IsChecked("ChkTitle") ? (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkIcon"), 240, 2, 0) === 0 ? false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkIcon"), 240, 2, 0) === 1 ? true : undefined)) : undefined);
				var AllTitle = (WndWriterEditMultiWindows.Button_IsChecked("ChkTitle") ? WndWriterEditMultiWindows.GetControlText("EdtTitle") : undefined);
				var AllTemplate = (WndWriterEditMultiWindows.Button_IsChecked("ChkTemplate") ? WndWriterEditMultiWindows.Combo_GetCurSel("CmbTemplate") : undefined);
				var AllBottomBar = (WndWriterEditMultiWindows.Button_IsChecked("ChkBottomBar") ? WndWriterEditMultiWindows.Combo_GetCurSel("CmbBottomBar") : undefined);
				var AllWidth = (WndWriterEditMultiWindows.Button_IsChecked("ChkSize") ? (WndWriterEditMultiWindows.GetControlText("EdtWidth") === "" ? undefined : WndWriterEditMultiWindows.GetControlText("EdtWidth")) : undefined);
				var AllHeight = (WndWriterEditMultiWindows.Button_IsChecked("ChkSize") ? (WndWriterEditMultiWindows.GetControlText("EdtHeight") === "" ? undefined : WndWriterEditMultiWindows.GetControlText("EdtHeight")) : undefined);
				var AllInitialPos = (WndWriterEditMultiWindows.Button_IsChecked("ChkInitialPos") ? WndWriterEditMultiWindows.Combo_GetCurSel("CmbInitialPos") : undefined);
				var AllResizeable = (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkResizeable"), 240, 2, 0) === 0 ? false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkResizeable"), 240, 2, 0) === 1 ? true : undefined));
				var AllIsAbsolute = (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkIsAbsolute"), 240, 2, 0) === 0 ? false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkIsAbsolute"), 240, 2, 0) === 1 ? true : undefined));
				var AllMinimize = (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkMinimize"), 240, 2, 0) === 0 ? false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkMinimize"), 240, 2, 0) === 1 ? true : undefined));
				var AllMaximize = (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkMaximize"), 240, 2, 0) === 0 ? false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkMaximize"), 240, 2, 0) === 1 ? true : undefined));
				var AllClose = (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkClose"), 240, 2, 0) === 0 ? false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiWindows.GetControlHandle("ChkClose"), 240, 2, 0) === 1 ? true : undefined));
				var AllExtra = (WndWriterEditMultiWindows.Button_IsChecked("ChkCode") ? Writer.Extra : undefined);
				var Count = 0;
				for (var X in WndIdList) // if an item is undefined, we use the value for the individual window (i.e. no change)
				{
					Debugging.Trace("<-- Start window edit. -->");
					Debugging.Trace("--> Collecting information for updated window \"" + WndIdList[X] + "\"...");
					var Window = Interface.Window[WndIdList[X]];
					var Icon = (AllIcon === undefined ? Window.Icon : AllIcon);
					var Title = (AllTitle === undefined ? Window.Title : AllTitle);
					var Template = (AllTemplate === undefined ? Window.Template : AllTemplate);
					var BottomBar = (AllBottomBar === undefined ? Window.BottomBar : AllBottomBar);
					var Width = (AllWidth === undefined ? Window.Width : AllWidth);
					var Height = (AllHeight === undefined ? Window.Height : AllHeight);
					var InitialPos = (AllInitialPos === undefined ? Window.InitialPos : AllInitialPos);
					var Resizeable = (AllResizeable === undefined ? Window.Resizeable : AllResizeable);
					var IsAbsolute = (AllIsAbsolute === undefined ? Window.IsAbsolute : AllIsAbsolute);
					var Minimize = (AllMinimize === undefined ? Window.Minimize : AllMinimize);
					var Maximize = (AllMaximize === undefined ? Window.Maximize : AllMaximize);
					var Close = (AllClose === undefined ? Window.Close : AllClose);
					var Extra = (AllExtra === undefined ? Window.Extra : AllExtra);
					Debugging.Trace("--> | Title: " + (Icon ? "[icon] " : "") + (Title === "" ? "(none)" : Title));
					Debugging.Trace("--> | Allow: " + (Minimize || Maximize || Close ? (Minimize ? "minimize, " : "") + (Maximize ? "maximize, " : "") + (Close ? "close" : "") : "(none)"));
					Debugging.Trace("--> | Template: " + EnumWindowTemplate[Template] + (Template === 0 ? " (Bottom Bar: " + EnumWindowBottomBar[BottomBar] + ")" : ""));
					Debugging.Trace("--> | Positioning: " + EnumWindowInitialPos[InitialPos]);
					Debugging.Trace("--> | Size: " + Width + " x " + Height + " (" + (IsAbsolute ? "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Extra: " + (Extra !== ""));
					Debugging.Trace("--> Editing window object in the interface array...");
					if (Writer.EditWnd(WndIdList[X], Icon, Title, Template, BottomBar, Width, Height, InitialPos, Resizeable, IsAbsolute, Minimize, Maximize, Close, Extra)) // yay!
					{
						Debugging.Trace("--> | Window edit successful.");
					}
					else
					{
						Debugging.Trace("--> | Window edit error.");
						Dialog.Show("Edit some windows...", "An error occured whilst editing the window \"" + WndIdList[X] + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEditMultiWindows);
					}
					Debugging.Trace("<-- End window edit. -->");
					Count++; // next window, please
				}
				ProcessAutoSave(); // this bit isn't done until all windows are processed
				OnWndWriterManageWindowsEvent_Populate();
				OnWndWriterManageWindowsEvent_Status(Count + " windows edited in interface.");
				CloseWnd(WndWriterEditMultiWindows);
				break;
			case "BtnTitle":
				var TmpExtra = "<Attributes>\r\n";
				TmpExtra += "	<Caption>" + WndWriterEditMultiWindows.GetControlText("EdtTitle") + "</Caption>\r\n";
				TmpExtra += "</Attributes>";
				Writer.Extra = TmpExtra + (Writer.Extra === "" ? "" : "\r\n" + Writer.Extra);
				OnWndWriterExtraCodeEvent_Build();
				break;
			case "BtnCode":
				OnWndWriterExtraCodeEvent_Build();
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditMultiWindowsEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiWindows / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var ChildTmplCond = (WndWriterEditMultiWindows.Combo_GetCurSel("CmbTemplate") === 2 && WndWriterEditMultiWindows.Button_IsChecked("ChkTemplate")); // are we setting a child window?
		Enable(WndWriterEditMultiWindows, "ChkIcon", WndWriterEditMultiWindows.Button_IsChecked("ChkTitle") && !ChildTmplCond);
		Enable(WndWriterEditMultiWindows, "EdtTitle", WndWriterEditMultiWindows.Button_IsChecked("ChkTitle") && !ChildTmplCond);
		Enable(WndWriterEditMultiWindows, "BtnTitle", WndWriterEditMultiWindows.Button_IsChecked("ChkTitle") && WndWriterEditMultiWindows.Button_IsChecked("ChkCode") && !ChildTmplCond);
		Enable(WndWriterEditMultiWindows, "CmbTemplate", WndWriterEditMultiWindows.Button_IsChecked("ChkTemplate"));
		Enable(WndWriterEditMultiWindows, "CmbBottomBar", WndWriterEditMultiWindows.Button_IsChecked("ChkBottomBar") && (WndWriterEditMultiWindows.Combo_GetCurSel("CmbTemplate") === 0 || !WndWriterEditMultiWindows.Button_IsChecked("ChkTemplate")));
		Enable(WndWriterEditMultiWindows, "EdtWidth", WndWriterEditMultiWindows.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiWindows, "TxtXBy", WndWriterEditMultiWindows.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiWindows, "EdtHeight", WndWriterEditMultiWindows.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiWindows, "CmbInitialPos", WndWriterEditMultiWindows.Button_IsChecked("ChkInitialPos") && !ChildTmplCond);
		Enable(WndWriterEditMultiWindows, "BtnCode", WndWriterEditMultiWindows.Button_IsChecked("ChkCode"));
		Enable(WndWriterEditMultiWindows, "ChkResizeable", !ChildTmplCond);
		Enable(WndWriterEditMultiWindows, "ChkMinimize", !ChildTmplCond);
		Enable(WndWriterEditMultiWindows, "ChkMaximize", !ChildTmplCond);
		Enable(WndWriterEditMultiWindows, "ChkClose", !ChildTmplCond);
		if (!WndWriterEditMultiWindows.Button_IsChecked("ChkCode"))
		{
			CloseWnd(WndWriterExtraCode);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditMultiWindowsEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiWindows / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (ControlId === "CmbWnds")
		{
			WndWriterEditMultiWindows.Combo_SetCurSel("CmbWnds", 0);
		}
		OnWndWriterEditMultiWindowsEvent_EditTextChanged(WndWriterEditMultiWindows, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditMultiWindowsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterEditMultiWindows / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
