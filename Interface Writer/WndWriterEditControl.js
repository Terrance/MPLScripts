/*
File: WndWriterEditControl.js
Events for processing control modification functions.
*/

function OnWndWriterEditControlEvent_Build()
{
	Debugging.Call("WndWriterEditControl / Build", {});
	CloseWnd(Close.Ctrl);
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	var CtrlId = Writer.CtrlId[Writer.CtrlSel[0]];
	var Control = Window.Control[CtrlId];
	Writer.CtrlSel[1] = Writer.CtrlSel[0];
	WndWriterEditControl = OpenWnd("Controls", "Writer", "EditControl");
	WndWriterEditControl.SetControlText("EdtId", CtrlId);
	for (var X in EnumControlType)
	{
		WndWriterEditControl.Combo_AddItem("CmbType", EnumControlType[X]);
	}
	WndWriterEditControl.Combo_SetCurSel("CmbType", Control.Type);
	WndWriterEditControl.SetControlText("EdtLeft", Control.Left);
	WndWriterEditControl.SetControlText("EdtTop", Control.Top);
	WndWriterEditControl.SetControlText("EdtWidth", Control.Width);
	WndWriterEditControl.SetControlText("EdtHeight", Control.Height);
	for (var X in EnumControlElementAnchorH)
	{
		WndWriterEditControl.Combo_AddItem("CmbAnchorH", EnumControlElementAnchorH[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditControl.Combo_SetCurSel("CmbAnchorH", Control.AnchorH);
	for (var X in EnumControlElementAnchorV)
	{
		WndWriterEditControl.Combo_AddItem("CmbAnchorV", EnumControlElementAnchorV[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditControl.Combo_SetCurSel("CmbAnchorV", Control.AnchorV);
	WndWriterEditControl.SetControlText("EdtCaption", Control.Caption);
	WndWriterEditControl.SetControlText("EdtHelp", Control.Help);
	for (var X in EnumControlLocation)
	{
		WndWriterEditControl.Combo_AddItem("CmbLocation", EnumControlLocation[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditControl.Combo_SetCurSel("CmbLocation", Window.BottomBar === 0 ? 0 : Control.Location);
	Enable(WndWriterEditControl, "EdtLeft", Window.BottomBar === 0 || Control.Location === 0);
	Enable(WndWriterEditControl, "EdtTop", Window.BottomBar === 0 || Control.Location === 0);
	Enable(WndWriterEditControl, "CmbLocation", Window.BottomBar !== 0);
	WndWriterEditControl.SetControlText("EdtComment", Control.Comment);
	WndWriterEditControl.Button_SetCheckState("ChkEnabled", Control.Enabled);
	WndWriterEditControl.Button_SetCheckState("ChkVisible", Control.Visible);
	Writer.Extra = Control.Extra;
}

function OnWndWriterEditControlEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditControl / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		var CtrlId = Writer.CtrlId[Writer.CtrlSel[0]];
		var NewCtrlId = WndWriterEditControl.GetControlText("EdtId");
		var Control = Window.Control[CtrlId];
		switch (ControlId)
		{
			case "BtnLeft":
				var Number = WndWriterEditControl.GetControlText("EdtLeft");
				WndWriterEditControl.SetControlText("EdtLeft", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnTop":
				var Number = WndWriterEditControl.GetControlText("EdtTop");
				WndWriterEditControl.SetControlText("EdtTop", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnEdit":
				Debugging.Trace("<-- Start control edit. -->");
				Debugging.Trace("--> Collecting information for updated control \"" + CtrlId + "\" in window \"" + WndId + "\"...");
				if (CtrlId === NewCtrlId) // no change in ID?
				{
					NewCtrlId = undefined;
				}
				else
				{
					Debugging.Trace("--> | New control ID: \"" + NewCtrlId + "\"");
				}
				var Type = WndWriterEditControl.Combo_GetCurSel("CmbType");
				var Left = WndWriterEditControl.GetControlText("EdtLeft");
				var Top = WndWriterEditControl.GetControlText("EdtTop");
				var Width = WndWriterEditControl.GetControlText("EdtWidth");
				var Height = WndWriterEditControl.GetControlText("EdtHeight");
				var AnchorH = WndWriterEditControl.Combo_GetCurSel("CmbAnchorH");
				var AnchorV = WndWriterEditControl.Combo_GetCurSel("CmbAnchorV");
				var Caption = WndWriterEditControl.GetControlText("EdtCaption");
				var Help = WndWriterEditControl.GetControlText("EdtHelp");
				var Location = Window.BottomBar === 0 ? Control.Location : WndWriterEditControl.Combo_GetCurSel("CmbLocation");
				var Comment = WndWriterEditControl.GetControlText("EdtComment");
				var Enabled = WndWriterEditControl.Button_IsChecked("ChkEnabled");
				var Visible = WndWriterEditControl.Button_IsChecked("ChkVisible");
				var Extra = Writer.Extra;
				var Window = Interface.Window[WndId];
				Debugging.Trace("--> | Type: " + EnumControlType[Type]);
				Debugging.Trace("--> | Size: " + Width + " x " + (Height === "" ? "(none)" : Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
				Debugging.Trace("--> | Anchors: " + EnumControlElementAnchorH[AnchorH] + ", " + EnumControlElementAnchorV[AnchorV]);
				Debugging.Trace("--> | Caption: " + (Caption === "" ? "(none)" : Caption));
				Debugging.Trace("--> | Help: " + (Help === "" ? "(none)" : Help));
				if (Location === 0)
				{
					Debugging.Trace("--> | Positioning: " + Left + ", " + Top + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
				}
				else
				{
					Debugging.Trace("--> | Location: " + EnumControlLocation[Location]);
				}
				Debugging.Trace("--> | Comment: " + (Comment === "" ? "(none)" : Comment));
				Debugging.Trace("--> | Enabled: " + Enabled);
				Debugging.Trace("--> | Visible: " + Visible);
				Debugging.Trace("--> | Extra: " + (Extra !== ""));
				Debugging.Trace("--> Editing control object in window object in the interface array...");
				if (Writer.EditCtrl(WndId, CtrlId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Caption, Help, Location, Comment, Enabled, Visible, Extra, NewCtrlId)) // yay!
				{
					Debugging.Trace("--> | Control edit successful.");
					ProcessAutoSave();
					OnWndWriterManageControlsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" " + (NewCtrlId === undefined ? "" : "renamed to \"" + NewCtrlId + "\" and ") + "edited in window \"" + WndId + "\" in interface.");
					CloseWnd(WndWriterEditControl);
				}
				else
				{
					Debugging.Trace("--> | Control edit error.");
					Dialog.Show("Edit a control...", "An error occured whilst editing the control \"" + CtrlId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEditControl);
				}
				Debugging.Trace("<-- End control edit. -->");
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

function OnWndWriterEditControlEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditControl / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		if (WndWriterEditControl.GetControlText("EdtId").match(/[^A-Za-z0-9_]/g) || WndWriterEditControl.GetControlText("EdtId") === "" || WndWriterEditControl.Combo_GetCurSel("CmbType") === 0 || isNaN(WndWriterEditControl.GetControlText("EdtLeft")) || isNaN(WndWriterEditControl.GetControlText("EdtTop")) || ((WndWriterEditControl.GetControlText("EdtLeft") === "" || WndWriterEditControl.GetControlText("EdtTop") === "") && WndWriterEditControl.Combo_GetCurSel("CmbLocation") === 0) || WndWriterEditControl.GetControlText("EdtWidth") === "") // old processing method (since it still loops through controls)
		{
			Enable(WndWriterEditControl, "BtnEdit", 0);
		}
		else
		{
			Enable(WndWriterEditControl, "BtnEdit", 1);
			for (var CtrlId in Interface.Window[WndId].Control)
			{
				if (WndWriterEditControl.GetControlText("EdtId").toLowerCase() === CtrlId.toLowerCase() && WndWriterEditControl.GetControlText("EdtId") !== Writer.CtrlId[Writer.CtrlSel[0]])
				{
					Enable(WndWriterEditControl, "BtnEdit", 0);
					break;
				}
				else
				{
					Enable(WndWriterEditControl, "BtnEdit", 1);
				}
			}
		}
		var Bottom = WndWriterEditControl.Combo_GetCurSel("CmbLocation") === 0;
		Enable(WndWriterEditControl, "EdtLeft", Bottom);
		Enable(WndWriterEditControl, "BtnLeft", Bottom);
		Enable(WndWriterEditControl, "TxtComma", Bottom);
		Enable(WndWriterEditControl, "EdtTop", Bottom);
		Enable(WndWriterEditControl, "BtnTop", Bottom);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditControlEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditControl / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterEditControlEvent_EditTextChanged(WndWriterEditControl, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditControlEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterEditControl / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
