function LoadWindow_Manager()
{
	try
	{
		WndManager.Close(0);
		try
		{
			WndAddEditProfile.Close(0);
		}
		catch (error)
		{
		}
	}
	catch (error)
	{
	}
	Debug.Trace("| Loading manager...");
	WndManager = MsgPlus.CreateWnd("Windows.xml", "WndManager", 0);
	LoadProfiles_Manager(1);
	Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnEdit"), 0);
	Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnDelete"), 0);
}

function OnWndManagerEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	TmpId = ItemIdx;
	if (TmpId == -1)
	{
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnEdit"), 0);
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnDelete"), 0);
	}
	else
	{
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnEdit"), 1);
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnDelete"), 1);
	}
}

function OnWndManagerEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	TmpId = ItemIdx;
	if (TmpId == -1)
	{
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnEdit"), 0);
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnDelete"), 0);
	}
	else
	{
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnEdit"), 1);
		Interop.Call("user32","EnableWindow", WndManager.GetControlHandle("BtnDelete"), 1);
	}
}

function OnWndManagerEvent_LstViewDblClicked(PlusWnd, ControlId, ItemIdx)
{
	TmpId = ItemIdx;
	LoadWindow_AddEditProfile(TmpId + 1);
}

function OnWndManagerEvent_CtrlClicked(PlusWnd, ControlId)
{
	switch (ControlId)
	{
		case "BtnAdd":
			LoadWindow_AddEditProfile(0);
			break;
		case "BtnEdit":
			LoadWindow_AddEditProfile(TmpId + 1);
			break;
		case "BtnDelete":
			RemoveProfile(TmpId + 1);
			break;
	}
}

function LoadWindow_AddEditProfile(ID)
{
	TmpEdit = ID;
	try
	{
		WndAddEditProfile.Close(0);
	}
	catch (error)
	{
	}
	Debug.Trace("| Loading profile editor...");
	WndAddEditProfile = MsgPlus.CreateWnd("Windows.xml", "WndAddEditProfile", 0);
	Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("BtnSave"), 0);
	WndAddEditProfile.Button_SetCheckState("RdoName1", true);
	Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2a"), 0);
	Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2b"), 0);
	WndAddEditProfile.Button_SetCheckState("RdoPSM1", true);
	Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2a"), 0);
	Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2b"), 0);
	Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("ChkDP"), 0);
	for (var X in CmbStatus)
	{
		WndAddEditProfile.Combo_AddItem("CmbStatus", CmbStatus[X]);
	}
	WndAddEditProfile.Combo_SetCurSel("CmbStatus", 0);
	if (TmpEdit > 0)
	{
		LoadProfile(TmpEdit);
	}
}

function OnWndAddEditProfileEvent_EditTextChanged(PlusWnd, ControlId)
{
	if (WndAddEditProfile.GetControlText("EdtDP") == "")
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("ChkDP"), 0);
	}
	else
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("ChkDP"), 1);
	}
	if (WndAddEditProfile.GetControlText("EdtDescription") == "")
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("BtnSave"), 0);
	}
	else
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("BtnSave"), 1);
	}
}

function OnWndAddEditProfileEvent_CtrlClicked(PlusWnd, ControlId)
{
	if (WndAddEditProfile.Button_IsChecked("RdoName1"))
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName1"), 1);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2a"), 0);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2b"), 0);
	}
	else if (WndAddEditProfile.Button_IsChecked("RdoName2"))
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName1"), 0);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2a"), 1);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2b"), 1);
	}
	if (WndAddEditProfile.Button_IsChecked("RdoPSM1"))
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM1"), 1);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2a"), 0);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2b"), 0);
	}
	else if (WndAddEditProfile.Button_IsChecked("RdoPSM2"))
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM1"), 0);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2a"), 1);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2b"), 1);
	}
	if (ControlId == "BtnSave")
	{
		if (TmpEdit == 0)
		{
			SaveProfile(1);
		}
		else
		{
			SaveProfile(TmpEdit, true);
		}
	}
}

function LoadWindow_Floater()
{	
	try
	{
		WndFloater.Close(0);
	}
	catch (error)
	{
	}
	Debug.Trace("| Loading floater...");
	WndFloater = MsgPlus.CreateWnd("Windows.xml", "WndFloater", 0);
	var Msg;
	var nMsg = Interop.Allocate(4);
	Msg = Interop.Call('user32', 'GetWindowLongW', WndFloater.Handle, (-20));
	nMsg.WriteDWORD(0, (Msg | 0x80000));
	Interop.Call('user32', 'SetWindowLongW', WndFloater.Handle, (-20), nMsg.ReadDWORD(0));
	Interop.Call('user32', 'SetLayeredWindowAttributes', WndFloater.Handle, 0, 110, 0x2);
	WndFloater.Combo_AddItem("CmbProfiles", "(no profile)");
	LoadProfiles_Floater(1);
	WndFloater.Combo_SetCurSel("CmbProfiles", SysProfileNo);
}

function OnWndFloaterEvent_ComboSelChanged(PlusWnd, ControlId)
{
	EnableProfile(WndFloater.Combo_GetCurSel(ControlId));
}
