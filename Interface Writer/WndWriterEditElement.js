/*
File: WndWriterEditElement.js
Events for processing element modification functions.
*/

function OnWndWriterEditElementEvent_Build()
{
	Debugging.Call("WndWriterEditElement / Build", {});
	CloseWnd(Close.Elmt);
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	var ElmtId = Writer.ElmtId[Writer.ElmtSel[0]];
	var Element = Window.Element[ElmtId];
	Writer.ElmtSel[1] = Writer.ElmtSel[0];
	WndWriterEditElement = OpenWnd("Elements", "Writer", "EditElement");
	WndWriterEditElement.SetControlText("EdtId", ElmtId);
	for (var X in EnumElementType)
	{
		WndWriterEditElement.Combo_AddItem("CmbType", EnumElementType[X]);
	}
	WndWriterEditElement.Combo_SetCurSel("CmbType", Element.Type);
	WndWriterEditElement.SetControlText("EdtLeft", Element.Left);
	WndWriterEditElement.SetControlText("EdtTop", Element.Top);
	WndWriterEditElement.SetControlText("EdtWidth", Element.Width);
	WndWriterEditElement.SetControlText("EdtHeight", Element.Height);
	for (var X in EnumControlElementAnchorH)
	{
		WndWriterEditElement.Combo_AddItem("CmbAnchorH", EnumControlElementAnchorH[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditElement.Combo_SetCurSel("CmbAnchorH", Element.AnchorH);
	for (var X in EnumControlElementAnchorV)
	{
		WndWriterEditElement.Combo_AddItem("CmbAnchorV", EnumControlElementAnchorV[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterEditElement.Combo_SetCurSel("CmbAnchorV", Element.AnchorV);
	WndWriterEditElement.SetControlText("EdtComment", Element.Comment);
	Writer.Extra = Element.Extra;
}

function OnWndWriterEditElementEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditElement / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		var ElmtId = Writer.ElmtId[Writer.ElmtSel[0]];
		var NewElmtId = WndWriterEditElement.GetControlText("EdtId");
		var Element = Window.Element[ElmtId];
		switch (ControlId)
		{
			case "BtnLeft":
				var Number = WndWriterEditElement.GetControlText("EdtLeft");
				WndWriterEditElement.SetControlText("EdtLeft", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnTop":
				var Number = WndWriterEditElement.GetControlText("EdtTop");
				WndWriterEditElement.SetControlText("EdtTop", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnEdit":
				Debugging.Trace("<-- Start element edit. -->");
				Debugging.Trace("--> Collecting information for updated element \"" + ElmtId + "\" in window \"" + WndId + "\"...");
				if (ElmtId === NewElmtId) // no change in ID?
				{
					NewElmtId = undefined;
				}
				else
				{
					Debugging.Trace("--> | New element ID: \"" + NewElmtId + "\"");
				}
				var Type = WndWriterEditElement.Combo_GetCurSel("CmbType");
				var Left = WndWriterEditElement.GetControlText("EdtLeft");
				var Top = WndWriterEditElement.GetControlText("EdtTop");
				var Width = WndWriterEditElement.GetControlText("EdtWidth");
				var Height = WndWriterEditElement.GetControlText("EdtHeight");
				var AnchorH = WndWriterEditElement.Combo_GetCurSel("CmbAnchorH");
				var AnchorV = WndWriterEditElement.Combo_GetCurSel("CmbAnchorV");
				var Comment = WndWriterEditElement.GetControlText("EdtComment");
				var Extra = Writer.Extra;
				var Window = Interface.Window[WndId];
				Debugging.Trace("--> | Type: " + EnumElementType[Type]);
				Debugging.Trace("--> | Positioning: " + Left + ", " + Top + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
				Debugging.Trace("--> | Size: " + (Width === "" ? "(none)" : Width) + " x " + (Height === "" ? "(none)" : Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
				Debugging.Trace("--> | Anchors: " + EnumControlElementAnchorH[AnchorH] + ", " + EnumControlElementAnchorV[AnchorV]);
				Debugging.Trace("--> | Comment: " + (Comment === "" ? "(none)" : Comment));
				Debugging.Trace("--> | Extra: " + (Extra !== ""));
				Debugging.Trace("--> Editing element object in window object in the interface array...");
				if (Writer.EditElmt(WndId, ElmtId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Comment, Extra, NewElmtId)) // yay!
				{
					Debugging.Trace("--> | Element edit successful.");
					ProcessAutoSave();
					OnWndWriterManageElementsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" " + (NewElmtId === undefined ? "" : "renamed to \"" + NewElmtId + "\" and ") + "edited in window \"" + WndId + "\" in interface.");
					CloseWnd(WndWriterEditElement);
				}
				else
				{
					Debugging.Trace("--> | Element edit error.");
					Dialog.Show("Edit an element...", "An error occured whilst creating the element \"" + ElmtId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEditElement);
				}
				Debugging.Trace("<-- End element edit. -->");
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

function OnWndWriterEditElementEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditElement / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		if (WndWriterEditElement.GetControlText("EdtId").match(/[^A-Za-z0-9_]/g) || WndWriterEditElement.GetControlText("EdtId") === "" || WndWriterEditElement.Combo_GetCurSel("CmbType") === 0 || isNaN(WndWriterEditElement.GetControlText("EdtLeft")) || isNaN(WndWriterEditElement.GetControlText("EdtTop")) || WndWriterEditElement.GetControlText("EdtLeft") === "" || WndWriterEditElement.GetControlText("EdtTop") === "") // old processing method (since it still loops through elements)
		{
			Enable(WndWriterEditElement, "BtnEdit", 0);
		}
		else
		{
			Enable(WndWriterEditElement, "BtnEdit", 1);
			for (var ElmtId in Interface.Window[WndId].Element)
			{
				if (WndWriterEditElement.GetControlText("EdtId").toLowerCase() === ElmtId.toLowerCase() && WndWriterEditElement.GetControlText("EdtId") !== Writer.ElmtId[Writer.ElmtSel[0]])
				{
					Enable(WndWriterEditElement, "BtnEdit", 0);
					break;
				}
			}
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditElementEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditElement / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterEditElementEvent_EditTextChanged(WndWriterEditElement, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditElementEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterEditElement / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
