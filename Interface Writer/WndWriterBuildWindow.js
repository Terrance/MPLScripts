/*
File: WndWriterBuildWindow.js
Events for processing builder actions, including window resizing.
*/

function OnWndWriterBuildWindowEvent_Build()
{
	Debugging.Call("WndWriterBuildWindow / Build", {});
	CloseWnd(Close.Wnd);
	WndWriterBuildWindowI = OpenWnd("Windows", "Writer", "BuildWindowI"); // interface ("canvas")
	WndWriterBuildWindowM = OpenWnd("Windows", "Writer", "BuildWindowM"); // manager ("control")
	WndWriterBuildWindowI.RegisterMessageNotification(0x5, true); // size change
	WndWriterBuildWindowI.Button_SetCheckState("ChkIcon", true);
	WndWriterBuildWindowI.Button_SetCheckState("ChkMinimize", true);
	WndWriterBuildWindowI.Button_SetCheckState("ChkClose", true);
	WndWriterBuildWindowI.SetControlText("EdtWidth", 400);
	WndWriterBuildWindowI.SetControlText("EdtHeight", 300);
	WndWriterBuildWindowI.Button_SetCheckState("ChkIsAbsolute", true);
	for (var X in EnumWindowTemplate)
	{
		WndWriterBuildWindowM.Combo_AddItem("CmbTemplate", EnumWindowTemplate[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterBuildWindowM.Combo_SetCurSel("CmbTemplate", 0);
	for (var X in EnumWindowBottomBar)
	{
		WndWriterBuildWindowM.Combo_AddItem("CmbBottomBar", EnumWindowBottomBar[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterBuildWindowM.Combo_SetCurSel("CmbBottomBar", 0);
	Enable(WndWriterBuildWindowM, "CmbBottomBar", 1);
	for (var X in EnumWindowInitialPos)
	{
		WndWriterBuildWindowM.Combo_AddItem("CmbInitialPos", EnumWindowInitialPos[X] + (X == 1 ? " (default)" : ""));
	}
	WndWriterBuildWindowM.Combo_SetCurSel("CmbInitialPos", 1);
}

function OnWndWriterBuildWindowIEvent_MessageNotification(PlusWnd, Message, wParam, lParam)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowI / MessageNotification", {"PlusWnd" : PlusWnd.Handle, "Message" : Message, "wParam" : wParam, "lParam" : lParam});
		if (Message === 0x5) // thanks to Spunky for the low/high word order stuff
		{
			WndWriterBuildWindowI.SetControlText("EdtWidth", (lParam & 0xFFFF));
			WndWriterBuildWindowI.SetControlText("EdtHeight", (lParam >> 16));
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterBuildWindowIEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowI / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (ControlId === "BtnSize")
		{
			var TmpWidth = parseInt(WndWriterBuildWindowI.GetControlText("EdtWidth")) + 6; // left/right edges 3px each
			var TmpHeight = parseInt(WndWriterBuildWindowI.GetControlText("EdtHeight")) + 32; // top/bottom edges 3px each + 26px title bar
			if (TmpWidth < 238 || WndWriterBuildWindowI.GetControlText("EdtWidth") === "") // minimum width
			{
				TmpWidth = 238;
			}
			if (TmpHeight < 95 || WndWriterBuildWindowI.GetControlText("EdtHeight") === "") // width height
			{
				TmpHeight = 95;
			}
			Interop.Call("user32.dll", "SetWindowPos", WndWriterBuildWindowI.Handle, null, 0, 0, TmpWidth, TmpHeight, 0x2 | 0x4);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterBuildWindowIEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowI / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterBuildWindowMEvent_EditTextChanged(WndWriterBuildWindowM, ControlId)
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterBuildWindowIEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowI / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterBuildWindowM);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterBuildWindowMEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowM / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnAdd":
				var WndId = WndWriterBuildWindowM.GetControlText("EdtId");
				Debugging.Trace("<-- Start window add. -->");
				Debugging.Trace("--> Checking existance of window \"" + WndId + "\"...");
				var Ok = true;
				for (var AllWndsId in Interface.Window)
				{
					if (WndId.toLowerCase() === AllWndsId.toLowerCase())
					{
						Debugging.Trace("--> | Window already exists.");
						Debugging.Trace("--> | | Asking to overwrite...");
						Ok = Dialog.Show("Add a new window...", "Do you want to replace the existing window \"" + AllWndsId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterBuildWindowM) === Dialog.Result.Yes;
						if (Ok)
						{
							if (!Writer.DeleteWnd(AllWndsId))
							{
								Debugging.Trace("--> | | Failed to overwrite.");
								Dialog.Show("Add a new window...", "An error occured whilst overwriting the window \"" + AllWndsId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterBuildWindowM);
								break;
							}
						}
						break;
					}
				}
				if (Ok)
				{
					Debugging.Trace("--> Collecting information for new window \"" + WndId + "\"..."); // might as well dump it in the debug
					var Icon = WndWriterBuildWindowI.Button_IsChecked("ChkIcon");
					var Title = WndWriterBuildWindowI.GetControlText("EdtTitle");
					var Template = WndWriterBuildWindowM.Combo_GetCurSel("CmbTemplate");
					var BottomBar = WndWriterBuildWindowM.Combo_GetCurSel("CmbBottomBar");
					var Width = WndWriterBuildWindowI.GetControlText("EdtWidth");
					var Height = WndWriterBuildWindowI.GetControlText("EdtHeight");
					var InitialPos = WndWriterBuildWindowM.Combo_GetCurSel("CmbInitialPos");
					var Resizeable = WndWriterBuildWindowI.Button_IsChecked("ChkResizeable");
					var IsAbsolute = WndWriterBuildWindowI.Button_IsChecked("ChkIsAbsolute");
					var Minimize = WndWriterBuildWindowI.Button_IsChecked("ChkMinimize");
					var Maximize = WndWriterBuildWindowI.Button_IsChecked("ChkMaximize");
					var Close = WndWriterBuildWindowI.Button_IsChecked("ChkClose");
					var Extra = Writer.Extra;
					Debugging.Trace("--> | Title: " + (Icon ? "[icon] " : "") + (Title === "" ? "(none)" : Title));
					Debugging.Trace("--> | Allow: " + (Minimize || Maximize || Close ? (Minimize ? "minimize, " : "") + (Maximize ? "maximize, " : "") + (Close ? "close" : "") : "(none)"));
					Debugging.Trace("--> | Template: " + EnumWindowTemplate[Template]);
					Debugging.Trace("--> | Positioning: " + EnumWindowInitialPos[InitialPos]);
					Debugging.Trace("--> | Size: " + Width + " x " + Height + " (" + (IsAbsolute ? "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Extra: " + (Extra !== ""));
					Debugging.Trace("--> Adding window object to the interface array...");
					if (Writer.AddWnd(WndId, Icon, Title, Template, BottomBar, Width, Height, InitialPos, Resizeable, IsAbsolute, Minimize, Maximize, Close, Extra)) // yay!
					{
						Debugging.Trace("--> | Window add successful.");
						ProcessAutoSave();
						OnWndWriterManageWindowsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" built and added to interface.");
						CloseWnd(WndWriterBuildWindowI);
					}
					else // this shouldn't happen, but just in case...
					{
						Debugging.Trace("--> | Window add error.");
						Dialog.Show("Build a new window...", "An error occured whilst building the window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterBuildWindow);
					}
				}
				else
				{
					Debugging.Trace("--> | Window cannot be overwritten.");
				}
				Debugging.Trace("<-- End window add. -->");
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

function OnWndWriterBuildWindowMEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowM / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		Enable(WndWriterBuildWindowM, "BtnAdd", !WndWriterBuildWindowM.GetControlText("EdtId").match(/[^A-Za-z0-9_]/g) && WndWriterBuildWindowM.GetControlText("EdtId") !== "" && WndWriterBuildWindowI.GetControlText("EdtWidth") !== "" && WndWriterBuildWindowI.GetControlText("EdtHeight") !== ""); // ID has valid characters and is not blank, and width and height are not blank
		if (WndWriterBuildWindowM.Combo_GetCurSel("CmbTemplate") === 2) // child window?
		{
			Enable(WndWriterBuildWindowI, "ChkIcon", 0);
			Enable(WndWriterBuildWindowI, "EdtTitle", 0);
			Enable(WndWriterBuildWindowM, "CmbBottomBar", 0);
			Enable(WndWriterBuildWindowM, "CmbInitialPos", 0);
			Enable(WndWriterBuildWindowI, "ChkResizeable", 0);
			Enable(WndWriterBuildWindowI, "ChkMinimize", 0);
			Enable(WndWriterBuildWindowI, "ChkMaximize", 0);
			Enable(WndWriterBuildWindowI, "ChkClose", 0);
		}
		else
		{
			Enable(WndWriterBuildWindowI, "ChkIcon", 1);
			Enable(WndWriterBuildWindowI, "EdtTitle", 1);
			Enable(WndWriterBuildWindowM, "CmbBottomBar", WndWriterBuildWindowM.Combo_GetCurSel("CmbTemplate") === 0); // only if a dialog
			Enable(WndWriterBuildWindowM, "CmbInitialPos", 1);
			Enable(WndWriterBuildWindowI, "ChkResizeable", 1);
			Enable(WndWriterBuildWindowI, "ChkMinimize", 1);
			Enable(WndWriterBuildWindowI, "ChkMaximize", 1);
			Enable(WndWriterBuildWindowI, "ChkClose", 1);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterBuildWindowMEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowM / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterBuildWindowMEvent_EditTextChanged(WndWriterBuildWindowM, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterBuildWindowMEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterBuildWindowM / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterBuildWindowI);
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
