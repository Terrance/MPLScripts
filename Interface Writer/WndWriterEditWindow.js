/*
File: WndWriterEditWindow.js
Events for processing window modification functions.
*/

function OnWndWriterEditWindowEvent_Build()
{
	Debugging.Call("WndWriterEditWindow / Build", {});
	CloseWnd(Close.Wnd);
	Writer.WndSel[1] = Writer.WndSel[0];
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	WndWriterEditWindow = OpenWnd("Windows", "Writer", "EditWindow");
	WndWriterEditWindow.SetControlText("EdtId", WndId);
	WndWriterEditWindow.Button_SetCheckState("ChkIcon", Window.Icon);
	WndWriterEditWindow.SetControlText("EdtTitle", Window.Title);
	for (var X in EnumWindowTemplate)
	{
		WndWriterEditWindow.Combo_AddItem("CmbTemplate", EnumWindowTemplate[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditWindow.Combo_SetCurSel("CmbTemplate", Window.Template);
	for (var X in EnumWindowBottomBar)
	{
		WndWriterEditWindow.Combo_AddItem("CmbBottomBar", EnumWindowBottomBar[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditWindow.Combo_SetCurSel("CmbBottomBar", Window.BottomBar);
	WndWriterEditWindow.SetControlText("EdtWidth", Window.Width);
	WndWriterEditWindow.SetControlText("EdtHeight", Window.Height);
	for (var X in EnumWindowInitialPos)
	{
		WndWriterEditWindow.Combo_AddItem("CmbInitialPos", EnumWindowInitialPos[X] + (X == 1 ? " (default)" : ""));
	}
	WndWriterEditWindow.Combo_SetCurSel("CmbInitialPos", Window.InitialPos);
	WndWriterEditWindow.Button_SetCheckState("ChkResizeable", Window.Resizeable);
	WndWriterEditWindow.Button_SetCheckState("ChkIsAbsolute", Window.IsAbsolute);
	Enable(WndWriterEditWindow, "ChkIsAbsolute", !Window.Built);
	WndWriterEditWindow.Button_SetCheckState("ChkMinimize", Window.Minimize);
	WndWriterEditWindow.Button_SetCheckState("ChkMaximize", Window.Maximize);
	WndWriterEditWindow.Button_SetCheckState("ChkClose", Window.Close);
	Writer.Extra = Window.Extra;
	if (Window.Template === 2)
	{
		Enable(WndWriterEditWindow, "ChkIcon", 0);
		Enable(WndWriterEditWindow, "EdtTitle", 0);
		Enable(WndWriterEditWindow, "CmbInitialPos", 0);
		Enable(WndWriterEditWindow, "ChkResizeable", 0);
		Enable(WndWriterEditWindow, "ChkMinimize", 0);
		Enable(WndWriterEditWindow, "ChkMaximize", 0);
		Enable(WndWriterEditWindow, "ChkClose", 0);
	}
}

function OnWndWriterEditWindowEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditWindow / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var NewWndId = WndWriterEditWindow.GetControlText("EdtId");
		switch (ControlId)
		{
			case "BtnEdit":
				Debugging.Trace("<-- Start window edit. -->");
				Debugging.Trace("--> Collecting information for updated window \"" + WndId + "\"...");
				if (WndId === NewWndId) // no change in ID?
				{
					NewWndId = undefined;
				}
				else
				{
					Debugging.Trace("--> | New window ID: \"" + NewWndId + "\"");
				}
				var Icon = WndWriterEditWindow.Button_IsChecked("ChkIcon");
				var Title = WndWriterEditWindow.GetControlText("EdtTitle");
				var Template = WndWriterEditWindow.Combo_GetCurSel("CmbTemplate");
				var BottomBar = WndWriterEditWindow.Combo_GetCurSel("CmbBottomBar");
				var Width = WndWriterEditWindow.GetControlText("EdtWidth");
				var Height = WndWriterEditWindow.GetControlText("EdtHeight");
				var InitialPos = WndWriterEditWindow.Combo_GetCurSel("CmbInitialPos");
				var Resizeable = WndWriterEditWindow.Button_IsChecked("ChkResizeable");
				var IsAbsolute = WndWriterEditWindow.Button_IsChecked("ChkIsAbsolute");
				var Minimize = WndWriterEditWindow.Button_IsChecked("ChkMinimize");
				var Maximize = WndWriterEditWindow.Button_IsChecked("ChkMaximize");
				var Close = WndWriterEditWindow.Button_IsChecked("ChkClose");
				var Extra = Writer.Extra;
				var Window = Interface.Window[WndId];
				Debugging.Trace("--> | Title: " + (Icon ? "[icon] " : "") + (Title === "" ? "(none)" : Title));
				Debugging.Trace("--> | Allow: " + (Minimize || Maximize || Close ? (Minimize ? "minimize, " : "") + (Maximize ? "maximize, " : "") + (Close ? "close" : "") : "(none)"));
				Debugging.Trace("--> | Template: " + EnumWindowTemplate[Template] + (Template === 0 ? " (Bottom Bar: " + EnumWindowBottomBar[BottomBar] + ")" : ""));
				Debugging.Trace("--> | Positioning: " + EnumWindowInitialPos[InitialPos]);
				Debugging.Trace("--> | Size: " + Width + " x " + Height + " (" + (IsAbsolute ? "pixels" : "dialog units") + ")");
				Debugging.Trace("--> | Extra: " + (Extra !== ""));
				Debugging.Trace("--> Editing window object in the interface array...");
				if (Writer.EditWnd(WndId, Icon, Title, Template, BottomBar, Width, Height, InitialPos, Resizeable, IsAbsolute, Minimize, Maximize, Close, Extra, NewWndId)) // yay!
				{
					Debugging.Trace("--> | Window edit successful.");
					ProcessAutoSave();
					OnWndWriterManageWindowsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" " + (NewWndId === undefined ? "" : "renamed to \"" + NewWndId + "\" and ") + "edited in interface.");
					CloseWnd(WndWriterEditWindow);
				}
				else
				{
					Debugging.Trace("--> | Window edit error.");
					Dialog.Show("Edit a window...", "An error occured whilst editing the window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEditWindow);
				}
				Debugging.Trace("<-- End window edit. -->");
				break;
			case "BtnTitle":
				var TmpExtra = "<Attributes>\r\n\t<Caption>" + WndWriterEditWindow.GetControlText("EdtTitle") + "</Caption>\r\n</Attributes>";
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

function OnWndWriterEditWindowEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditWindow / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (WndWriterEditWindow.GetControlText("EdtId") === "" || WndWriterEditWindow.GetControlText("EdtWidth") === "" || WndWriterEditWindow.GetControlText("EdtHeight") === "") // old processing method (since it still loops through windows)
		{
			Enable(WndWriterEditWindow, "BtnEdit", 0);
		}
		else
		{
			Enable(WndWriterEditWindow, "BtnEdit", 1);
			for (var WndId in Interface.Window)
			{
				if (WndWriterEditWindow.GetControlText("EdtId").toLowerCase() === WndId.toLowerCase() && WndWriterEditWindow.GetControlText("EdtId") !== Writer.WndId[Writer.WndSel[1]])
				{
					Enable(WndWriterEditWindow, "BtnEdit", 0);
					break;
				}
				else
				{
					Enable(WndWriterEditWindow, "BtnEdit", 1);
				}
			}
		}
		if (WndWriterEditWindow.Combo_GetCurSel("CmbTemplate") === 2) // child window?
		{
			Enable(WndWriterEditWindow, "ChkIcon", 0);
			Enable(WndWriterEditWindow, "EdtTitle", 0);
			Enable(WndWriterEditWindow, "BtnTitle", 0);
			Enable(WndWriterEditWindow, "CmbBottomBar", 0);
			Enable(WndWriterEditWindow, "CmbInitialPos", 0);
			Enable(WndWriterEditWindow, "ChkResizeable", 0);
			Enable(WndWriterEditWindow, "ChkMinimize", 0);
			Enable(WndWriterEditWindow, "ChkMaximize", 0);
			Enable(WndWriterEditWindow, "ChkClose", 0);
		}
		else
		{
			Enable(WndWriterEditWindow, "ChkIcon", 1);
			Enable(WndWriterEditWindow, "EdtTitle", 1);
			Enable(WndWriterEditWindow, "BtnTitle", 1);
			Enable(WndWriterEditWindow, "CmbBottomBar", WndWriterEditWindow.Combo_GetCurSel("CmbTemplate") === 0); // only if a dialog
			Enable(WndWriterEditWindow, "CmbInitialPos", 1);
			Enable(WndWriterEditWindow, "ChkResizeable", 1);
			Enable(WndWriterEditWindow, "ChkMinimize", 1);
			Enable(WndWriterEditWindow, "ChkMaximize", 1);
			Enable(WndWriterEditWindow, "ChkClose", 1);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditWindowEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditWindow / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterEditWindowEvent_EditTextChanged(WndWriterEditWindow, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditWindowEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterEditWindow / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
