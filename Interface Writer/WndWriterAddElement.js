/*
File: WndWriterAddElement.js
Events for processing element addition functions.
*/

function OnWndWriterAddElementEvent_Build()
{
	Debugging.Call("WndWriterAddElement / Build", {});
	CloseWnd(Close.Elmt);
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	WndWriterAddElement = OpenWnd("Elements", "Writer", "AddElement"); // yay, lots of drop-down population
	for (var X in EnumElementType)
	{
		WndWriterAddElement.Combo_AddItem("CmbType", EnumElementType[X]);
	}
	WndWriterAddElement.Combo_SetCurSel("CmbType", 0);
	for (var X in EnumControlElementAnchorH)
	{
		WndWriterAddElement.Combo_AddItem("CmbAnchorH", EnumControlElementAnchorH[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterAddElement.Combo_SetCurSel("CmbAnchorH", 0);
	for (var X in EnumControlElementAnchorV)
	{
		WndWriterAddElement.Combo_AddItem("CmbAnchorV", EnumControlElementAnchorV[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterAddElement.Combo_SetCurSel("CmbAnchorV", 0);
	Enable(WndWriterAddElement, "BtnAdd", 0);
}

function OnWndWriterAddElementEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddElement / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		switch (ControlId)
		{
			case "BtnLeft": // negative button, since "numbers-only" text boxes don't allow dashes
				var Number = WndWriterAddElement.GetControlText("EdtLeft");
				WndWriterAddElement.SetControlText("EdtLeft", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnTop": // negative button, since "numbers-only" text boxes don't allow dashes
				var Number = WndWriterAddElement.GetControlText("EdtTop");
				WndWriterAddElement.SetControlText("EdtTop", Number.indexOf("-") === -1 ? "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnAdd":
				var ElmtId = WndWriterAddElement.GetControlText("EdtId");
				Debugging.Trace("<-- Start element add. -->");
				Debugging.Trace("--> Checking existance of element \"" + ElmtId + "\" in window \"" + WndId + "\"...");
				var Ok = true;
				for (var AllElmtsId in Interface.Window[WndId].Element) // loop through elements
				{
					if (ElmtId.toLowerCase() === AllElmtsId.toLowerCase())
					{
						Debugging.Trace("--> | Element already exists.");
						Debugging.Trace("--> | | Asking to overwrite...");
						Ok = Dialog.Show("Add an element...", "Do you want to replace the existing element \"" + AllElmtsId + "\" in window \"" + WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterAddElement) === Dialog.Result.Yes;
						if (Ok)
						{
							if (!Writer.DeleteElmt(WndId, AllElmtsId))
							{
								Debugging.Trace("--> | | Failed to overwrite.");
								Dialog.Show("Add an element...", "An error occured whilst overwriting the element \"" + AllElmtsId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterAddElement);
								break;
							}
						}
						break;
					}
				}
				if (Ok)
				{
					Debugging.Trace("--> | Element does not exist (or can be overwritten).");
					Debugging.Trace("--> Collecting information for new element \"" + ElmtId + "\" in window \"" + WndId + "\"..."); // might as well dump it in the debug
					var Type = WndWriterAddElement.Combo_GetCurSel("CmbType");
					var Left = WndWriterAddElement.GetControlText("EdtLeft");
					var Top = WndWriterAddElement.GetControlText("EdtTop");
					var Width = WndWriterAddElement.GetControlText("EdtWidth");
					var Height = WndWriterAddElement.GetControlText("EdtHeight");
					var AnchorH = WndWriterAddElement.Combo_GetCurSel("CmbAnchorH");
					var AnchorV = WndWriterAddElement.Combo_GetCurSel("CmbAnchorV");
					var Comment = WndWriterAddElement.GetControlText("EdtComment");
					var Extra = Writer.Extra;
					var Window = Interface.Window[WndId];
					Debugging.Trace("--> | Type: " + EnumElementType[Type]);
					Debugging.Trace("--> | Positioning: " + Left + ", " + Top + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Size: " + Width + " x " + (Height === "" ? "(none)" : Height) + " (" + (Window.IsAbsolute ? "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Anchors: " + EnumControlElementAnchorH[AnchorH] + ", " + EnumControlElementAnchorV[AnchorV]);
					Debugging.Trace("--> | Comment: " + (Comment === "" ? "(none)" : Comment));
					Debugging.Trace("--> | Extra: " + (Extra !== ""));
					Debugging.Trace("--> Adding element object to window object in the interface array...");
					if (Writer.AddElmt(WndId, ElmtId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Comment, Extra)) // yay!
					{
						Debugging.Trace("--> | Element add successful.");
						ProcessAutoSave();
						OnWndWriterManageElementsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtId + "\" added to window \"" + WndId + "\" in interface.");
						CloseWnd(WndWriterAddElement);
					}
					else // this shouldn't happen, but just in case...
					{
						Debugging.Trace("--> | Element addition error.");
						Dialog.Show("Add a new element...", "An error occured whilst adding the element \"" + ElmtId + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterAddElement);
					}
				}
				else
				{
					Debugging.Trace("--> | Element cannot be overwritten.");
				}
				Debugging.Trace("<-- End element add. -->");
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

function OnWndWriterAddElementEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddElement / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		Enable(WndWriterAddElement, "BtnAdd", !WndWriterAddElement.GetControlText("EdtId").match(/[^A-Za-z0-9_]/g) && WndWriterAddElement.GetControlText("EdtId") !== "" && WndWriterAddElement.Combo_GetCurSel("CmbType") !== 0 && !isNaN(WndWriterAddElement.GetControlText("EdtLeft")) && WndWriterAddElement.GetControlText("EdtLeft") !== "" && !isNaN(WndWriterAddElement.GetControlText("EdtTop")) && WndWriterAddElement.GetControlText("EdtTop") !== ""); // ID has valid characters and is not blank, type is not blank, and left and top are valid
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterAddElementEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddElement / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterAddElementEvent_EditTextChanged(WndWriterAddElement, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterAddElementEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterAddElement / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
