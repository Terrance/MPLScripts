/*
File: WndWriterAddControl.js
Events for processing control addition functions.
*/

function OnWndWriterAddControlEvent_Build()
{
	Debugging.Call("WndWriterAddControl / Build", {});
	CloseWnd(Close.Ctrl);
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	WndWriterAddControl = OpenWnd("Controls", "Writer", "AddControl"); // yay, lots of drop-down population
	for (var X in EnumControlType)
	{
		WndWriterAddControl.Combo_AddItem("CmbType", EnumControlType[X]);
	}
	WndWriterAddControl.Combo_SetCurSel("CmbType", 0);
	for (var X in EnumControlElementAnchorH)
	{
		WndWriterAddControl.Combo_AddItem("CmbAnchorH", EnumControlElementAnchorH[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterAddControl.Combo_SetCurSel("CmbAnchorH", 0);
	for (var X in EnumControlElementAnchorV)
	{
		WndWriterAddControl.Combo_AddItem("CmbAnchorV", EnumControlElementAnchorV[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterAddControl.Combo_SetCurSel("CmbAnchorV", 0);
	for (var X in EnumControlLocation)
	{
		WndWriterAddControl.Combo_AddItem("CmbLocation", EnumControlLocation[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterAddControl.Combo_SetCurSel("CmbLocation", 0);
	Enable(WndWriterAddControl, "CmbLocation", Window.BottomBar !== 0);
	WndWriterAddControl.Button_SetCheckState("ChkEnabled", 1);
	WndWriterAddControl.Button_SetCheckState("ChkVisible", 1);
}

function OnWndWriterAddControlEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddControl / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		switch (ControlId)
		{
			case "BtnLeft": // negative button, since "numbers-only" text boxes don't allow dashes
				var Number = WndWriterAddControl.GetControlText("EdtLeft");
				WndWriterAddControl.SetControlText("EdtLeft", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnTop": // negative button, since "numbers-only" text boxes don't allow dashes
				var Number = WndWriterAddControl.GetControlText("EdtTop");
				WndWriterAddControl.SetControlText("EdtTop", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnAdd":
				var CtrlId = WndWriterAddControl.GetControlText("EdtId");
				Debugging.Trace("<-- Start control add. -->");
				Debugging.Trace("--> Checking existance of control \"" + CtrlId + "\" in window \"" + WndId + "\"...");
				var Ok = true;
				for (var AllCtrlsId in Interface.Window[WndId].Control) // loop through controls
				{
					if (CtrlId.toLowerCase() === AllCtrlsId.toLowerCase())
					{
						Debugging.Trace("--> | Control already exists.");
						Debugging.Trace("--> | | Asking to overwrite...");
						Ok = Dialog.Show("Add a control...", "Do you want to replace the existing control \"" + AllCtrlsId + "\" in window \"" + WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterAddControl) === Dialog.Result.Yes;
						if (Ok)
						{
							if (!Writer.DeleteCtrl(WndId, AllCtrlsId))
							{
								Debugging.Trace("--> | | Failed to overwrite.");
								Dialog.Show("Add a control...", "An error occured whilst overwriting the control \"" + AllCtrlsId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterAddControl);
								break;
							}
						}
						break;
					}
				}
				if (Ok)
				{
					Debugging.Trace("--> | Control does not exist (or can be overwritten).");
					Debugging.Trace("--> Collecting information for new control \"" + CtrlId + "\" in window \"" + WndId + "\"..."); // might as well dump it in the debug
					var Type = WndWriterAddControl.Combo_GetCurSel("CmbType");
					var Left = WndWriterAddControl.GetControlText("EdtLeft");
					var Top = WndWriterAddControl.GetControlText("EdtTop");
					var Width = WndWriterAddControl.GetControlText("EdtWidth");
					var Height = WndWriterAddControl.GetControlText("EdtHeight");
					var AnchorH = WndWriterAddControl.Combo_GetCurSel("CmbAnchorH");
					var AnchorV = WndWriterAddControl.Combo_GetCurSel("CmbAnchorV");
					var Caption = WndWriterAddControl.GetControlText("EdtCaption");
					var Help = WndWriterAddControl.GetControlText("EdtHelp");
					var Location = WndWriterAddControl.Combo_GetCurSel("CmbLocation");
					var Comment = WndWriterAddControl.GetControlText("EdtComment");
					var Enabled = WndWriterAddControl.Button_IsChecked("ChkEnabled");
					var Visible = WndWriterAddControl.Button_IsChecked("ChkVisible");
					var Extra = Writer.Extra;
					var Window = Interface.Window[WndId];
					Debugging.Trace("--> | Type: " + EnumControlType[Type]);
					Debugging.Trace("--> | Size: " + Width + " x " + (Height === "" ? "(none)" : Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Anchors: " + EnumControlElementAnchorH[AnchorH] + ", " + EnumControlElementAnchorV[AnchorV]);
					Debugging.Trace("--> | Caption: " + (Caption === "" ? "(none)" : Caption));
					Debugging.Trace("--> | Help: " + (Help === "" ? "(none)" : Help));
					if (Location === 0) // not in the bottom bar
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
					Debugging.Trace("--> Adding control object to window object in the interface array...");
					if (Writer.AddCtrl(WndId, CtrlId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Caption, Help, Location, Comment, Enabled, Visible, Extra)) // yay!
					{
						Debugging.Trace("--> | Control add successful.");
						ProcessAutoSave();
						OnWndWriterManageControlsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlId + "\" added to window \"" + WndId + "\" in interface.");
						CloseWnd(WndWriterAddControl);
					}
					else // this shouldn't happen, but just in case...
					{
						Debugging.Trace("--> | Control add error.");
						Dialog.Show("Add a new control...", "An error occured whilst adding the control \"" + CtrlId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterAddControl);
					}
				}
				else
				{
					Debugging.Trace("--> | Control cannot be overwritten.");
				}
				Debugging.Trace("<-- End control add. -->");
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

function OnWndWriterAddControlEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddControl / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		Enable(WndWriterAddControl, "BtnAdd", !WndWriterAddControl.GetControlText("EdtId").match(/[^A-Za-z0-9_]/g) && WndWriterAddControl.GetControlText("EdtId") !== "" && WndWriterAddControl.Combo_GetCurSel("CmbType") !== 0 && !isNaN(WndWriterAddControl.GetControlText("EdtLeft")) && !isNaN(WndWriterAddControl.GetControlText("EdtTop")) && !((WndWriterAddControl.GetControlText("EdtLeft") === "" || WndWriterAddControl.GetControlText("EdtTop") === "") && WndWriterAddControl.Combo_GetCurSel("CmbLocation") === 0) && WndWriterAddControl.GetControlText("EdtWidth") !== ""); // ID has valid characters and is not blank, type is not blank, left and top are valid (and not blank if location is not in bottom bar), and width is not blank
		var Bottom = WndWriterAddControl.Combo_GetCurSel("CmbLocation") === 0;
		Enable(WndWriterAddControl, "EdtLeft", Bottom);
		Enable(WndWriterAddControl, "BtnLeft", Bottom);
		Enable(WndWriterAddControl, "TxtComma", Bottom);
		Enable(WndWriterAddControl, "EdtTop", Bottom);
		Enable(WndWriterAddControl, "BtnTop", Bottom);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterAddControlEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddControl / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterAddControlEvent_EditTextChanged(WndWriterAddControl, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterAddControlEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterAddControl / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
