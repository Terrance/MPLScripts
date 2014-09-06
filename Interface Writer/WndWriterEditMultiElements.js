/*
File: WndWriterEditMultiElements.js
Events for processing multiple element modifications.
*/

function OnWndWriterEditMultiElementsEvent_Build(Count, ID)
{
	Debugging.Call("WndWriterEditMultiElements / Build", {"Count" : Count, "ID" : ID});
	CloseWnd(Close.Elmt);
	var WndId = Writer.WndId[Writer.WndSel[1]];
	var Window = Interface.Window[WndId];
	var ElmtId = Writer.ElmtId[Writer.ElmtSel[0]];
	var Element = Window.Element[ElmtId];
	Writer.ElmtSel[1] = Writer.ElmtSel[0];
	WndWriterEditMultiElements = OpenWnd("Elements", "Writer", "EditMultiElements");
	WndWriterEditMultiElements.SetControlText("EdtElmts", ID.join(", ")); // hidden field, easier to process than combo
	WndWriterEditMultiElements.Combo_AddItem("CmbElmts", "Total: " + ID.length + " elements..."); // nice way for user to see which elements
	for (var X in ID)
	{
		WndWriterEditMultiElements.Combo_AddItem("CmbElmts", ID[X]);
	}
	WndWriterEditMultiElements.Combo_SetCurSel("CmbElmts", 0);
	for (var X in EnumElementType)
	{
		WndWriterEditMultiElements.Combo_AddItem("CmbType", EnumElementType[X]);
	}
	WndWriterEditMultiElements.Combo_SetCurSel("CmbType", 0);
	for (var X in EnumControlElementAnchorH)
	{
		WndWriterEditMultiElements.Combo_AddItem("CmbAnchorH", EnumControlElementAnchorH[X] + (X == 0  " (default)" : ""));
	}
	WndWriterEditMultiElements.Combo_SetCurSel("CmbAnchorH", 0);
	for (var X in EnumControlElementAnchorV)
	{
		WndWriterEditMultiElements.Combo_AddItem("CmbAnchorV", EnumControlElementAnchorV[X] + (X == 0  " (default)" : ""));
	}
	WndWriterEditMultiElements.Combo_SetCurSel("CmbAnchorV", 0);
}

function OnWndWriterEditMultiElementsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiElements / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		OnWndWriterEditMultiElementsEvent_EditTextChanged(WndWriterEditMultiElements, ControlId);
		var ElmtIdList = WndWriterEditMultiElements.GetControlText("EdtElmts").split(", ");
		switch (ControlId)
		{
			case "BtnLeft":
				var Number = WndWriterEditMultiElements.GetControlText("EdtLeft");
				WndWriterEditMultiElements.SetControlText("EdtLeft", Number.indexOf("-") === -1  "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnTop":
				var Number = WndWriterEditMultiElements.GetControlText("EdtTop");
				WndWriterEditMultiElements.SetControlText("EdtTop", Number.indexOf("-") === -1  "-" + Number : Number.substr(1, Number.length));
				break;
			case "BtnEdit": // it looks very complicated, but it isn't really: if an option is set, then it uses it, otherwise it's set to undefined for later
				var AllType = (WndWriterEditMultiElements.Button_IsChecked("ChkType")  WndWriterEditMultiElements.Combo_GetCurSel("CmbType") : undefined);
				var AllLeft = (WndWriterEditMultiElements.Button_IsChecked("ChkPosition")  (WndWriterEditMultiElements.GetControlText("EdtLeft") === ""  undefined : WndWriterEditMultiElements.GetControlText("EdtLeft")) : undefined);
				var AllTop = (WndWriterEditMultiElements.Button_IsChecked("ChkPosition")  (WndWriterEditMultiElements.GetControlText("EdtTop") === ""  undefined : WndWriterEditMultiElements.GetControlText("EdtTop")) : undefined);
				var AllWidth = (WndWriterEditMultiElements.Button_IsChecked("ChkSize")  (WndWriterEditMultiElements.GetControlText("EdtWidth") === ""  undefined : WndWriterEditMultiElements.GetControlText("EdtWidth")) : undefined);
				var AllHeight = (WndWriterEditMultiElements.Button_IsChecked("ChkSize")  (WndWriterEditMultiElements.GetControlText("EdtHeight") === ""  undefined : WndWriterEditMultiElements.GetControlText("EdtHeight")) : undefined);
				var AllAnchorH = (WndWriterEditMultiElements.Button_IsChecked("ChkAnchorH")  WndWriterEditMultiElements.Combo_GetCurSel("CmbAnchorH") : undefined);
				var AllAnchorV = (WndWriterEditMultiElements.Button_IsChecked("ChkAnchorV")  WndWriterEditMultiElements.Combo_GetCurSel("CmbAnchorV") : undefined);
				var AllComment = (WndWriterEditMultiElements.Button_IsChecked("ChkComment")  WndWriterEditMultiElements.GetControlText("EdtComment") : undefined);
				var AllExtra = (WndWriterEditMultiElements.Button_IsChecked("ChkCode")  Writer.Extra : undefined);
				var Count = 0;
				for (var X in ElmtIdList) // if an item is undefined, we use the value for the individual element (i.e. no change)
				{
					Debugging.Trace("<-- Start element edit. -->");
					Debugging.Trace("--> Collecting information for updated element \"" + ElmtIdList[X] + "\" in window \"" + WndId + "\"...");
					var Element = Window.Element[ElmtIdList[X]];
					var Type = (AllType === undefined  Element.Type : AllType);
					var Left = (AllLeft === undefined  Element.Left : AllLeft);
					var Top = (AllTop === undefined  Element.Top : AllTop);
					var Width = (AllWidth === undefined  Element.Width : AllWidth);
					var Height = (AllHeight === undefined  Element.Height : AllHeight);
					var AnchorH = (AllAnchorH === undefined  Element.AnchorH : AllAnchorH);
					var AnchorV = (AllAnchorV === undefined  Element.AnchorV : AllAnchorV);
					var Comment = (AllComment === undefined  Element.Comment : AllComment);
					var Extra = (AllExtra === undefined  Element.Extra : AllExtra);
					Debugging.Trace("--> | Type: " + EnumElementType[Type]);
					Debugging.Trace("--> | Positioning: " + Left + ", " + Top + " (" + (Window.IsAbsolute  "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Size: " + (Width === ""  "(none)" : Width) + " x " + (Height === ""  "(none)" : Height) + " (" + (Window.IsAbsolute  "pixels" : "dialog units") + ")");
					Debugging.Trace("--> | Anchors: " + EnumControlElementAnchorH[AnchorH] + ", " + EnumControlElementAnchorV[AnchorV]);
					Debugging.Trace("--> | Extra: " + (Extra !== ""));
					Debugging.Trace("--> Editing element object in window object in the interface array...");
					if (Writer.EditElmt(WndId, ElmtIdList[X], Type, Left, Top, Width, Height, AnchorH, AnchorV, Comment, Extra)) // yay!
					{
						Debugging.Trace("--> | Element edit successful.");
						ProcessAutoSave();
						OnWndWriterManageElementsEvent_Populate();
						OnWndWriterManageWindowsEvent_Status("Element \"" + ElmtIdList[X] + "\" edited in window \"" + WndId + "\" in interface.");
						CloseWnd(WndWriterEditMultiElements);
					}
					else
					{
						Debugging.Trace("--> | Element edit error.");
						Dialog.Show("Edit an element...", "An error occured whilst creating the element \"" + ElmtIdlist[X] + "\" in window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEditMultiElements);
					}
					Debugging.Trace("<-- End element edit. -->");
					Count++; // next element, please
				}
				ProcessAutoSave(); // this bit isn't done until all windows are processed
				OnWndWriterManageElementsEvent_Populate();
				OnWndWriterManageWindowsEvent_Status(Count + " elements edited in window \"" + WndId + "\" interface.");
				CloseWnd(WndWriterEditMultiElements);
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

function OnWndWriterEditMultiElementsEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiElements / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var WndId = Writer.WndId[Writer.WndSel[1]];
		var Window = Interface.Window[WndId];
		Enable(WndWriterEditMultiElements, "CmbType", WndWriterEditMultiElements.Button_IsChecked("ChkType"));
		Enable(WndWriterEditMultiElements, "EdtLeft", WndWriterEditMultiElements.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiElements, "BtnLeft", WndWriterEditMultiElements.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiElements, "TxtComma", WndWriterEditMultiElements.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiElements, "EdtTop", WndWriterEditMultiElements.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiElements, "BtnTop", WndWriterEditMultiElements.Button_IsChecked("ChkPosition"));
		Enable(WndWriterEditMultiElements, "EdtWidth", WndWriterEditMultiElements.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiElements, "TxtXBy", WndWriterEditMultiElements.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiElements, "EdtHeight", WndWriterEditMultiElements.Button_IsChecked("ChkSize"));
		Enable(WndWriterEditMultiElements, "CmbAnchorH", WndWriterEditMultiElements.Button_IsChecked("ChkAnchorH"));
		Enable(WndWriterEditMultiElements, "CmbAnchorV", WndWriterEditMultiElements.Button_IsChecked("ChkAnchorV"));
		Enable(WndWriterEditMultiElements, "TxtTagOpen", WndWriterEditMultiElements.Button_IsChecked("ChkComment"));
		Enable(WndWriterEditMultiElements, "EdtComment", WndWriterEditMultiElements.Button_IsChecked("ChkComment"));
		Enable(WndWriterEditMultiElements, "TxtTagClose", WndWriterEditMultiElements.Button_IsChecked("ChkComment"));
		Enable(WndWriterEditMultiElements, "BtnCode", WndWriterEditMultiElements.Button_IsChecked("ChkCode"));
		if (!WndWriterEditMultiElements.Button_IsChecked("ChkCode"))
		{
			CloseWnd(WndWriterExtraCode);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditMultiElementsEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEditMultiElements / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (ControlId === "CmbElmts")
		{
			WndWriterEditMultiElements.Combo_SetCurSel("CmbElmts", 0);
		}
		OnWndWriterEditMultiElementsEvent_EditTextChanged(WndWriterEditMultiElements, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterEditMultiElementsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterEditMultiElements / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
