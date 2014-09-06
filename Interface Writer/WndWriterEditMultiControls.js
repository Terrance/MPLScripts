/*
File: WndWriterEditMultiControls.js
Events for processing multiple control modifications.
*/

function OnWndWriterEditMultiControlsEvent_Build(Count, ID)
{
	Debugging.Call("WndWriterEditMultiControls / Build", {"Count" : Count, "ID" : ID});
	CloseWnd(Close.Ctrl);
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	var CtrlId = Writer.CtrlId[Writer.CtrlSel[0]];
	var Control = Window.Control[CtrlId];
	Writer.CtrlSel[1] = Writer.CtrlSel[0];
	WndWriterEditMultiControls = OpenWnd("Controls", "Writer", "EditMultiControls");
	WndWriterEditMultiControls.SetControlText("EdtCtrls", ID.join(", ")); // hidden field, easier to process than combo
	WndWriterEditMultiControls.Combo_AddItem("CmbCtrls", "Total: " + ID.length + " controls..."); // nice way for user to see which controls
	for (var X in ID)
	{
		WndWriterEditMultiControls.Combo_AddItem("CmbCtrls", ID[X]);
	}
	WndWriterEditMultiControls.Combo_SetCurSel("CmbCtrls", 0);
	for (var X in EnumControlType)
	{
		WndWriterEditMultiControls.Combo_AddItem("CmbType", EnumControlType[X]);
	}
	WndWriterEditMultiControls.Combo_SetCurSel("CmbType", 0);
	for (var X in EnumControlElementAnchorH)
	{
		WndWriterEditMultiControls.Combo_AddItem("CmbAnchorH", EnumControlElementAnchorH[X] + (X == 0  " (default)" : ""));
	}
	WndWriterEditMultiControls.Combo_SetCurSel("CmbAnchorH", 0);
	for (var X in EnumControlElementAnchorV)
	{
		WndWriterEditMultiControls.Combo_AddItem("CmbAnchorV", EnumControlElementAnchorV[X] + (X == 0  " (default)" : ""));
	}
	WndWriterEditMultiControls.Combo_SetCurSel("CmbAnchorV", 0);
	for (var X in EnumControlLocation)
	{
		WndWriterEditMultiControls.Combo_AddItem("CmbLocation", EnumControlLocation[X] + (X == 0  " (default)" : ""));
	}
	WndWriterEditMultiControls.Combo_SetCurSel("CmbLocation", 0);
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiControls.GetControlHandle("ChkEnabled"), 241, 241, 0); // 241 = checkbox "third" state (block)
	Interop.Call("user32", "SendMessageW", WndWriterEditMultiControls.GetControlHandle("ChkVisible"), 241, 241, 0);
}

function OnWndWriterEditMultiControlsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiControls / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		OnWndWriterEditMultiControlsEvent_EditTextChanged(WndWriterEditMultiControls, ControlId);
		var CtrlIdList = WndWriterEditMultiControls.GetControlText("EdtCtrls").split(", ");
		switch (ControlId)
		{
			case "BtnLeft":
				var Number = WndWriterEditMultiControls.GetControlText("EdtLeft");
				WndWriterEditMultiControls.SetControlText("EdtLeft", Number.indexOf("-") === -1  "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnTop":
				var Number = WndWriterEditMultiControls.GetControlText("EdtTop");
				WndWriterEditMultiControls.SetControlText("EdtTop", Number.indexOf("-") === -1  "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnEdit": // it looks very complicated, but it isn't really: if an option is set, then it uses it, otherwise it's set to undefined for later
				var AllType = (WndWriterEditMultiControls.Button_IsChecked("ChkType")  WndWriterEditMultiControls.Combo_GetCurSel("CmbType") : undefined);
				var AllLeft = (WndWriterEditMultiControls.Button_IsChecked("ChkPosition")  (WndWriterEditMultiControls.GetControlText("EdtLeft") === ""  undefined : WndWriterEditMultiControls.GetControlText("EdtLeft")) : undefined);
				var AllTop = (WndWriterEditMultiControls.Button_IsChecked("ChkPosition")  (WndWriterEditMultiControls.GetControlText("EdtTop") === ""  undefined : WndWriterEditMultiControls.GetControlText("EdtTop")) : undefined);
				var AllWidth = (WndWriterEditMultiControls.Button_IsChecked("ChkSize")  (WndWriterEditMultiControls.GetControlText("EdtWidth") === ""  undefined : WndWriterEditMultiControls.GetControlText("EdtWidth")) : undefined);
				var AllHeight = (WndWriterEditMultiControls.Button_IsChecked("ChkSize")  (WndWriterEditMultiControls.GetControlText("EdtHeight") === ""  undefined : WndWriterEditMultiControls.GetControlText("EdtHeight")) : undefined);
				var AllAnchorH = (WndWriterEditMultiControls.Button_IsChecked("ChkAnchorH")  WndWriterEditMultiControls.Combo_GetCurSel("CmbAnchorH") : undefined);
				var AllAnchorV = (WndWriterEditMultiControls.Button_IsChecked("ChkAnchorV")  WndWriterEditMultiControls.Combo_GetCurSel("CmbAnchorV") : undefined);
				var AllCaption = (WndWriterEditMultiControls.Button_IsChecked("ChkCaption")  WndWriterEditMultiControls.GetControlText("CmbCaption") : undefined);
				var AllHelp = (WndWriterEditMultiControls.Button_IsChecked("ChkHelp")  WndWriterEditMultiControls.GetControlText("CmbHelp") : undefined);
				var AllLocation = (WndWriterEditMultiControls.Button_IsChecked("ChkLocation") || Window.BottomBar === 0  WndWriterEditMultiControls.Combo_GetCurSel("CmbLocation") : undefined);
				var AllComment = (WndWriterEditMultiControls.Button_IsChecked("ChkComment")  WndWriterEditMultiControls.GetControlText("EdtComment") : undefined);
				var AllEnabled = (Interop.Call("user32", "SendMessageW", WndWriterEditMultiControls.GetControlHandle("ChkEnabled"), 240, 2, 0) === 0  false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiControls.GetControlHandle("ChkEnabled"), 240, 2, 0) === 1  true : undefined));
				var AllVisible = (Interop.Call("user32", "SendMessageW", WndWriterEditMultiControls.GetControlHandle("ChkVisible"), 240, 2, 0) === 0  false : (Interop.Call("user32", "SendMessageW", WndWriterEditMultiControls.GetControlHandle("ChkVisible"), 240, 2, 0) === 1  true : undefined));
				var AllExtra = (WndWriterEditMultiControls.Button_IsChecked("ChkCode")  Writer.Extra : undefined);
				var Count = 0;
				for (var X in CtrlIdList) // if an item is undefined, we use the value for the individual control (i.e. no change)
				{
					Debugging.Trace("<-- Start control edit. -->");
					Debugging.Trace("--> Collecting information for updated control \"" + CtrlIdList[X] + "\" in window \"" + WndId + "\"...");
					var Control = Window.Control[CtrlIdList[X]];
					var Type = (AllType === undefined  Control.Type : AllType);
					var Left = (AllLeft === undefined  Control.Left : AllLeft);
					var Top = (AllTop === undefined  Control.Top : AllTop);
					var Width = (AllWidth === undefined  Control.Width : AllWidth);
					var Height = (AllHeight === undefined  Control.Height : AllHeight);
					var AnchorH = (AllAnchorH === undefined  Control.AnchorH : AllAnchorH);
					var AnchorV = (AllAnchorV === undefined  Control.AnchorV : AllAnchorV);
					var Caption = (AllCaption === undefined  Control.Caption : AllCaption);
					var Help = (AllHelp === undefined  Control.Help : AllHelp);
					var Location = (AllLocation === undefined  Control.Location : AllLocation);
					var Comment = (AllComment === undefined  Control.Comment : AllComment);
					var Enabled = (AllEnabled === undefined  Control.Enabled : AllEnabled);
					var Visible = (AllVisible === undefined  Control.Visible : AllVisible);
					var Extra = (AllExtra === undefined  Control.Extra : AllExtra);
					Debugging.Trace("--> | Type: " + EnumControlType[Type]);
					Debugging.Trace("--> | Size: " + Width + " x " + (Height === ""  "(none)" : Height) + " (" + (Window.IsAbsolute  "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Anchors: " + EnumControlElementAnchorH[AnchorH] + ", " + EnumControlElementAnchorV[AnchorV]);
					Debugging.Trace("--> | Caption: " + (Caption === ""  "(none)" : Caption));
					Debugging.Trace("--> | Help: " + (Help === ""  "(none)" : Help));
					if (Location === 0)
					{
						Debugging.Trace("--> | Positioning: " + Left + ", " + Top + " (" + (Window.IsAbsolute  "pixels" : "dialog units") + ")");
					}
					else
					{
						Debugging.Trace("--> | Location: " + EnumControlLocation[Location]);
					}
					Debugging.Trace("--> | Comment: " + (Comment === ""  "(none)" : Comment));
					Debugging.Trace("--> | Enabled: " + Enabled);
					Debugging.Trace("--> | Visible: " + Visible);
					Debugging.Trace("--> | Extra: " + (Extra !== ""));
					Debugging.Trace("--> Editing control object in window object in the interface array...");
					if (Writer.EditCtrl(WndId, CtrlIdList[X], Type, Left, Top, Width, Height, AnchorH, AnchorV, Caption, Help, Location, Comment, Enabled, Visible, Extra)) // yay!
					{
						Debugging.Trace("--> | Control edit successful.");
						ProcessAutoSave();
						OnWndWriterManageControlsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Control \"" + CtrlIdList[X] + "\" edited in window \"" + WndId + "\" in interface.");
						CloseWnd(WndWriterEditMultiControls);
					}
					else
					{
						Debugging.Trace("--> | Control edit error.");
						Dialog.Show("Edit an control...", "An error occured whilst creating the control \"" + CtrlIdlist[X] + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEditMultiControls);
					}
					Debugging.Trace("<-- End control edit. -->");
					Count++; // next control, please
				}
				ProcessAutoSave(); // this bit isn't done until all windows are processed
				OnWndWriterManageControlsEvent_Populate();
				OnWndWriterManageWindowsEvent_Status(Count + " controls edited in window \"" + WndId + "\" interface.");
				CloseWnd(WndWriterEditMultiControls);
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

function OnWndWriterEditMultiControlsEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiControls / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		Enable(WndWriterEditMultiControls, "CmbType", WndWriterEditMultiControls.Button_IsChecked("ChkType"));
		Enable(WndWriterEditMultiControls, "EdtLeft", WndWriterEditMultiControls.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiControls, "BtnLeft", WndWriterEditMultiControls.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiControls, "TxtComma", WndWriterEditMultiControls.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiControls, "EdtTop", WndWriterEditMultiControls.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiControls, "BtnTop", WndWriterEditMultiControls.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiControls, "EdtWidth", WndWriterEditMultiControls.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiControls, "TxtXBy", WndWriterEditMultiControls.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiControls, "EdtHeight", WndWriterEditMultiControls.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiControls, "CmbAnchorH", WndWriterEditMultiControls.Button_IsChecked("ChkAnchorH"));
		Enable(WndWriterEditMultiControls, "CmbAnchorV", WndWriterEditMultiControls.Button_IsChecked("ChkAnchorV"));
		Enable(WndWriterEditMultiControls, "EdtCaption", WndWriterEditMultiControls.Button_IsChecked("ChkCaption"));
		Enable(WndWriterEditMultiControls, "EdtHelp", WndWriterEditMultiControls.Button_IsChecked("ChkHelp"));
		Enable(WndWriterEditMultiControls, "ChkLocation", Window.BottomBar !== 0);
		Enable(WndWriterEditMultiControls, "CmbLocation", WndWriterEditMultiControls.Button_IsChecked("ChkLocation") && Window.BottomBar !== 0);
		Enable(WndWriterEditMultiControls, "TxtTagOpen", WndWriterEditMultiControls.Button_IsChecked("ChkComment"));
		Enable(WndWriterEditMultiControls, "EdtComment", WndWriterEditMultiControls.Button_IsChecked("ChkComment"));
		Enable(WndWriterEditMultiControls, "TxtTagClose", WndWriterEditMultiControls.Button_IsChecked("ChkComment"));
		Enable(WndWriterEditMultiControls, "BtnCode", WndWriterEditMultiControls.Button_IsChecked("ChkCode"));
		if (!WndWriterEditMultiControls.Button_IsChecked("ChkCode"))
		{
			CloseWnd(WndWriterExtraCode);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditMultiControlsEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiControls / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (ControlId === "CmbCtrls")
		{
			WndWriterEditMultiControls.Combo_SetCurSel("CmbCtrls", 0);
		}
		OnWndWriterEditMultiControlsEvent_EditTextChanged(WndWriterEditMultiControls, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditMultiControlsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterEditMultiControls / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
