function LoadProfiles_Menu(ID)
{
	if (ExistsRegistry("Profiles", ID + "\\EdtDescription"))
	{
		if (SysProfileNo == ID)
		{
			TmpMenu += "	<MenuEntry Id=\"Profile " + ID + "\" Enabled=\"false\">" + ID + ") " + ReadRegistry("Profiles", ID + "\\EdtDescription") + "</MenuEntry>";
		}
		else
		{
			TmpMenu += "	<MenuEntry Id=\"Profile " + ID + "\">" + ID + ") " + ReadRegistry("Profiles", ID + "\\EdtDescription") + "</MenuEntry>";
		}
		return LoadProfiles_Menu(ID + 1);
	}
	else if (ID == 1)
	{
		return "	<MenuEntry Id=\"null\" Enabled=\"False\">(no presets)</MenuEntry>";
	}
	else
	{
		return TmpMenu;
	}
}

function LoadProfiles_Manager(ID)
{
	if (ExistsRegistry("Profiles", ID + "\\EdtDescription"))
	{
		WndManager.LstView_AddItem("LstProfiles", ID);
		WndManager.LstView_SetItemText("LstProfiles", ID - 1, 1, ReadRegistry("Profiles", ID + "\\EdtDescription"));
		if (ReadRegistry("Profiles", ID + "\\RdoName") == 1)
		{
			WndManager.LstView_SetItemText("LstProfiles", ID - 1, 2, ReadRegistry("Profiles", ID + "\\EdtName1"));
		}
		else
		{
			WndManager.LstView_SetItemText("LstProfiles", ID - 1, 2, ReadRegistry("Profiles", ID + "\\EdtName2a") + " <current> " + ReadRegistry("Profiles", ID + "\\EdtName2b"));
		}
		if (ReadRegistry("Profiles", ID + "\\RdoPSM") == 1)
		{
			WndManager.LstView_SetItemText("LstProfiles", ID - 1, 3, ReadRegistry("Profiles", ID + "\\EdtPSM1"));
		}
		else
		{
			WndManager.LstView_SetItemText("LstProfiles", ID - 1, 3, ReadRegistry("Profiles", ID + "\\EdtPSM2a") + " <current> " + ReadRegistry("Profiles", ID + "\\EdtPSM2b"));
		}
		if (ReadRegistry("Profiles", ID + "\\ChkDP") == true)
		{
			WndManager.LstView_SetItemText("LstProfiles", ID - 1, 4, "<Internal> " + ReadRegistry("Profiles", ID + "\\EdtDP"));
		}
		else
		{
			WndManager.LstView_SetItemText("LstProfiles", ID - 1, 4, ReadRegistry("Profiles", ID + "\\EdtDP"));
		}
		WndManager.LstView_SetItemText("LstProfiles", ID - 1, 5, CmbStatus[ReadRegistry("Profiles", ID + "\\CmbStatus")]);
		WndManager.LstView_SetItemText("LstProfiles", ID - 1, 6, ReadRegistry("Profiles", ID + "\\EdtAutoMessage"));
		WndManager.LstView_SetItemText("LstProfiles", ID - 1, 7, ReadRegistry("Profiles", ID + "\\EdtColour"));
		LoadProfiles_Manager(ID + 1);
	}
}

function LoadProfiles_Floater(ID)
{
	if (ExistsRegistry("Profiles", ID + "\\EdtDescription"))
	{
		WndFloater.Combo_AddItem("CmbProfiles", ID + ") " + ReadRegistry("Profiles", ID + "\\EdtDescription"));
		LoadProfiles_Floater(ID + 1);
	}
}

function LoadProfile(ID)
{
	WndAddEditProfile.SetControlText("EdtDescription", ReadRegistry("Profiles", ID + "\\EdtDescription"));
	WndAddEditProfile.SetControlText("EdtName1", ReadRegistry("Profiles", ID + "\\EdtName1"));
	WndAddEditProfile.SetControlText("EdtName2a", ReadRegistry("Profiles", ID + "\\EdtName2a"));
	WndAddEditProfile.SetControlText("EdtName2b", ReadRegistry("Profiles", ID + "\\EdtName2b"));
	if (ReadRegistry("Profiles", ID + "\\RdoName") == 2)
	{
		WndAddEditProfile.Button_SetCheckState("RdoName1", false);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName1"), 0);
		WndAddEditProfile.Button_SetCheckState("RdoName2", true);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2a"), 1);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtName2b"), 1);
	}
	WndAddEditProfile.SetControlText("EdtPSM1", ReadRegistry("Profiles", ID + "\\EdtPSM1"));
	WndAddEditProfile.SetControlText("EdtPSM2a", ReadRegistry("Profiles", ID + "\\EdtPSM2a"));
	WndAddEditProfile.SetControlText("EdtPSM2b", ReadRegistry("Profiles", ID + "\\EdtPSM2b"));
	if (ReadRegistry("Profiles", ID + "\\RdoPSM") == 2)
	{
		WndAddEditProfile.Button_SetCheckState("RdoPSM1", false);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM1"), 0);
		WndAddEditProfile.Button_SetCheckState("RdoPSM2", true);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2a"), 1);
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("EdtPSM2b"), 1);
	}
	WndAddEditProfile.SetControlText("EdtDP", ReadRegistry("Profiles", ID + "\\EdtDP"));
	WndAddEditProfile.Button_SetCheckState("ChkDP", ReadRegistry("Profiles", ID + "\\ChkDP"));
	if (WndAddEditProfile.GetControlText("EdtDP") != "")
	{
		Interop.Call("user32","EnableWindow", WndAddEditProfile.GetControlHandle("ChkDP"), 1);
	}
	WndAddEditProfile.Combo_SetCurSel("CmbStatus", ReadRegistry("Profiles", ID + "\\CmbStatus"));
	WndAddEditProfile.SetControlText("EdtAutoMessage", ReadRegistry("Profiles", ID + "\\EdtAutoMessage"));
	WndAddEditProfile.SetControlText("EdtColour", ReadRegistry("Profiles", ID + "\\EdtColour"));
}

function SaveProfile(ID, Save)
{
	if (Save)
	{
		WriteRegistry("Profiles", ID + "\\EdtDescription", WndAddEditProfile.GetControlText("EdtDescription"), true);
		if (WndAddEditProfile.Button_IsChecked("RdoName1"))
		{
			WriteRegistry("Profiles", ID + "\\RdoName", 1, true);
		}
		else
		{
			WriteRegistry("Profiles", ID + "\\RdoName", 2, true);
		}
		WriteRegistry("Profiles", ID + "\\EdtName1", WndAddEditProfile.GetControlText("EdtName1"), true);
		WriteRegistry("Profiles", ID + "\\EdtName2a", WndAddEditProfile.GetControlText("EdtName2a"), true);
		WriteRegistry("Profiles", ID + "\\EdtName2b", WndAddEditProfile.GetControlText("EdtName2b"), true);
		if (WndAddEditProfile.Button_IsChecked("RdoPSM1"))
		{
			WriteRegistry("Profiles", ID + "\\RdoPSM", 1, true);
		}
		else
		{
			WriteRegistry("Profiles", ID + "\\RdoPSM", 2, true);
		}
		WriteRegistry("Profiles", ID + "\\EdtPSM1", WndAddEditProfile.GetControlText("EdtPSM1"), true);
		WriteRegistry("Profiles", ID + "\\EdtPSM2a", WndAddEditProfile.GetControlText("EdtPSM2a"), true);
		WriteRegistry("Profiles", ID + "\\EdtPSM2b", WndAddEditProfile.GetControlText("EdtPSM2b"), true);
		WriteRegistry("Profiles", ID + "\\ChkDP", WndAddEditProfile.Button_IsChecked("ChkDP"), true);
		WriteRegistry("Profiles", ID + "\\EdtDP", WndAddEditProfile.GetControlText("EdtDP"), true);
		WriteRegistry("Profiles", ID + "\\CmbStatus", WndAddEditProfile.Combo_GetCurSel("CmbStatus"), true);
		WriteRegistry("Profiles", ID + "\\EdtAutoMessage", WndAddEditProfile.GetControlText("EdtAutoMessage"), true);
		WriteRegistry("Profiles", ID + "\\EdtColour", WndAddEditProfile.GetControlText("EdtColour"), true);
		LoadWindow_Manager(ID);
	}
	else
	{
		if (ExistsRegistry("Profiles", ID + "\\EdtDescription"))
		{
			SaveProfile(ID + 1);
		}
		else
		{
			SaveProfile(ID, true);
		}
	}
}

function RemoveProfile(ID)
{
	DeleteRegistry("Profiles", ID + "\\EdtDescription");
	DeleteRegistry("Profiles", ID + "\\RdoName");
	DeleteRegistry("Profiles", ID + "\\EdtName1");
	DeleteRegistry("Profiles", ID + "\\EdtName2a");
	DeleteRegistry("Profiles", ID + "\\EdtName2b");
	DeleteRegistry("Profiles", ID + "\\RdoPSM");
	DeleteRegistry("Profiles", ID + "\\EdtPSM1");
	DeleteRegistry("Profiles", ID + "\\EdtPSM2a");
	DeleteRegistry("Profiles", ID + "\\EdtPSM2b");
	DeleteRegistry("Profiles", ID + "\\ChkDP");
	DeleteRegistry("Profiles", ID + "\\EdtDP");
	DeleteRegistry("Profiles", ID + "\\CmbStatus");
	DeleteRegistry("Profiles", ID + "\\EdtAutoMessage");
	DeleteRegistry("Profiles", ID + "\\EdtColour");
	NumberProfiles(ID);
}

function NumberProfiles(ID)
{
	if (ExistsRegistry("Profiles", (ID + 1) + "\\EdtDescription"))
	{
		WriteRegistry("Profiles", ID + "\\EdtDescription", ReadRegistry("Profiles", (ID + 1) + "\\EdtDescription"), true);
		WriteRegistry("Profiles", ID + "\\RdoName", ReadRegistry("Profiles", (ID + 1) + "\\RdoName"), true);
		WriteRegistry("Profiles", ID + "\\EdtName1", ReadRegistry("Profiles", (ID + 1) + "\\EdtName1"), true);
		WriteRegistry("Profiles", ID + "\\EdtName2a", ReadRegistry("Profiles", (ID + 1) + "\\EdtName2a"), true);
		WriteRegistry("Profiles", ID + "\\EdtName2b", ReadRegistry("Profiles", (ID + 1) + "\\EdtName2b"), true);
		WriteRegistry("Profiles", ID + "\\RdoPSM", ReadRegistry("Profiles", (ID + 1) + "\\RdoPSM"), true);
		WriteRegistry("Profiles", ID + "\\EdtPSM1", ReadRegistry("Profiles", (ID + 1) + "\\EdtPSM1"), true);
		WriteRegistry("Profiles", ID + "\\EdtPSM2a", ReadRegistry("Profiles", (ID + 1) + "\\EdtPSM2a"), true);
		WriteRegistry("Profiles", ID + "\\EdtPSM2b", ReadRegistry("Profiles", (ID + 1) + "\\EdtPSM2b"), true);
		WriteRegistry("Profiles", ID + "\\ChkDP", ReadRegistry("Profiles", (ID + 1) + "\\ChkDP"), true);
		WriteRegistry("Profiles", ID + "\\EdtDP", ReadRegistry("Profiles", (ID + 1) + "\\EdtDP"), true);
		WriteRegistry("Profiles", ID + "\\CmbStatus", ReadRegistry("Profiles", (ID + 1) + "\\CmbStatus"), true);
		WriteRegistry("Profiles", ID + "\\EdtAutoMessage", ReadRegistry("Profiles", (ID + 1) + "\\EdtAutoMessage"), true);
		WriteRegistry("Profiles", ID + "\\EdtColour", ReadRegistry("Profiles", (ID + 1) + "\\EdtColour"), true);
		NumberProfiles(ID + 1);
	}
	else if (ExistsRegistry("Profiles", ID + "\\EdtDescription"))
	{
		DeleteRegistry("Profiles", ID + "\\EdtDescription");
		DeleteRegistry("Profiles", ID + "\\RdoName");
		DeleteRegistry("Profiles", ID + "\\EdtName1");
		DeleteRegistry("Profiles", ID + "\\EdtName2a");
		DeleteRegistry("Profiles", ID + "\\EdtName2b");
		DeleteRegistry("Profiles", ID + "\\RdoPSM");
		DeleteRegistry("Profiles", ID + "\\EdtPSM1");
		DeleteRegistry("Profiles", ID + "\\EdtPSM2a");
		DeleteRegistry("Profiles", ID + "\\EdtPSM2b");
		DeleteRegistry("Profiles", ID + "\\ChkDP");
		DeleteRegistry("Profiles", ID + "\\EdtDP");
		DeleteRegistry("Profiles", ID + "\\CmbStatus");
		DeleteRegistry("Profiles", ID + "\\EdtAutoMessage");
		DeleteRegistry("Profiles", ID + "\\EdtColour");
		LoadWindow_Manager();
	}
	else
	{
		LoadWindow_Manager();
	}
}

function EnableProfile(ID)
{
	if (ID == 0)
	{
		Messenger.MyName = OldName;
		Messenger.MyPersonalMessage = OldPSM;
		Messenger.MyDisplayPicture = OldDP;
		Messenger.MyStatus = OldStatus;
		MsgPlus.DisplayToast("Plus! Profiles", "Your profile has been disabled.");
	}
	else
	{
		if (SysProfileNo == 0)
		{
			OldName = Messenger.MyName;
			OldPSM = Messenger.MyPersonalMessage;
			OldDP = Messenger.MyDisplayPicture;
			OldStatus = Messenger.MyStatus;
		}
		if (ReadRegistry("Profiles", ID + "\\RdoName") == 1)
		{
			if (ReadRegistry("Profiles", ID + "\\EdtName1") != "")
			{
				Messenger.MyName = ReadRegistry("Profiles", ID + "\\EdtName1");
			}
		}
		else
		{
			if (ReadRegistry("Profiles", ID + "\\EdtName2a") != "" || ReadRegistry("Profiles", ID + "\\EdtName2b"))
			{
				Messenger.MyName = ReadRegistry("Profiles", ID + "\\EdtName2a") + " " + OldName + " " + ReadRegistry("Profiles", ID + "\\EdtName2b");
			}
		}
		if (ReadRegistry("Profiles", ID + "\\RdoPSM") == 1)
		{
			if (ReadRegistry("Profiles", ID + "\\EdtPSM1") != "")
			{
				Messenger.MyPersonalMessage = ReadRegistry("Profiles", ID + "\\EdtPSM1");
			}
		}
		else
		{
			if (ReadRegistry("Profiles", ID + "\\EdtPSM2a") != "" || ReadRegistry("Profiles", ID + "\\EdtPSM2b"))
			{
				Messenger.MyPersonalMessage = ReadRegistry("Profiles", ID + "\\EdtPSM2a") + " " + OldPSM + " " + ReadRegistry("Profiles", ID + "\\EdtPSM2b");
			}
		}
		if (ReadRegistry("Profiles", ID + "\\EdtDP") != "")
		{
			if (ReadRegistry("Profiles", ID + "\\ChkDP"))
			{
				Messenger.MyDisplayPicture = MsgPlus.ScriptFilesPath + "\\" + ReadRegistry("Profiles", ID + "\\EdtDP");
			}
			else
			{
				Messenger.MyDisplayPicture = ReadRegistry("Profiles", ID + "\\EdtDP");
			}
		}
		switch (parseInt(ReadRegistry("Profiles", ID + "\\CmbStatus")))
		{
			case 1:
				Messenger.MyStatus = 2;
				break;
			case 2:
				Messenger.MyStatus = 3;
				break;
			case 3:
				Messenger.MyStatus = 4;
				break;
			case 4:
				Messenger.MyStatus = 5;
				break;
			case 5:
				Messenger.MyStatus = 7;
				break;
			case 6:
				Messenger.MyStatus = 8;
				break;
			case 7:
				Messenger.MyStatus = 9;
				break;
		}
		MsgPlus.DisplayToast("Plus! Profiles", "Profile " + ID + " (" + ReadRegistry("Profiles", ID + "\\EdtDescription") + ") is now enabled.");
	}
	try
	{
		WndFloater.Combo_SetCurSel("CmbProfiles", ID);
	}
	catch (error)
	{
	}
	SysProfileNo = ID;
}
