function OnWndCommandBar_CListEvent_CtrlClicked(PlusWnd, ControlId)
{
	switch (ControlId)
	{
		case "BtnOk":
			var TmpSelection = WndCommandBar_CList.Combo_GetCurSel("CmbList");
			if (TmpSelection > -1)
			{
				switch (IntCurrentChild)
				{
					case 1:
						TmpSelection = ArrCommands[WndCommandBar_CList.Combo_GetCurSel("CmbList")][1] + "()";
						break;
					case 2:
						TmpSelection = ArrContacts[WndCommandBar_CList.Combo_GetCurSel("CmbList")].Email;
						break;
				}
			}
			else
			{
				TmpSelection = "";
			}
			WndCommandBar_CList.Close(0);
			WndCommandBar_CMain = MsgPlus.CreateChildWnd(WndCommandBar_Shell, "Windows.xml", "WndCommandBar_CMain", 12, 2);
			IntCurrentChild = 0;
			OnWndCommandBar_ShellEvent_MessageNotification(WndCommandBar_Shell, 0x5);
			if (StrStoredCmd.charAt(StrStoredCmd.length - 1) != " " && TmpSelection != "" && StrStoredCmd != "")
			{
				StrStoredCmd += " ";
			}
			WndCommandBar_CMain.SetControlText("EdtCmd", StrStoredCmd + TmpSelection);
			break;
	}
}
