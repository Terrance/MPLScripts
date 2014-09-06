function OnWndCommandBar_CMainEvent_CtrlClicked(PlusWnd, ControlId)
{
	StrStoredCmd = WndCommandBar_CMain.GetControlText("EdtCmd");
	switch (ControlId)
	{
		case "BtnCommands":
			WndCommandBar_CMain.Close(0);
			WndCommandBar_CList = MsgPlus.CreateChildWnd(WndCommandBar_Shell, "Windows.xml", "WndCommandBar_CList", 12, 2);
			IntCurrentChild = 1;
			OnWndCommandBar_ShellEvent_MessageNotification(WndCommandBar_Shell, 0x5);
			for (var X in ArrCommands)
			{
				WndCommandBar_CList.Combo_AddItem("CmbList", ArrCommands[X][0] + " <" + ArrCommands[X][1] + ">", null, ArrCommands[X][0]);
			}
			break;
		case "BtnContacts":
			WndCommandBar_CMain.Close(0);
			WndCommandBar_CList = MsgPlus.CreateChildWnd(WndCommandBar_Shell, "Windows.xml", "WndCommandBar_CList", 12, 2);
			IntCurrentChild = 2;
			OnWndCommandBar_ShellEvent_MessageNotification(WndCommandBar_Shell, 0x5);
			ArrContacts = new Array();
			var TmpContacts = Messenger.MyContacts;
			var TmpContactE = new Enumerator(TmpContacts);
			for(; !TmpContactE.atEnd(); TmpContactE.moveNext())
			{
				var TmpContactO = TmpContactE.item();
				ArrContacts.push(TmpContactO);
				var TmpContactI = "Online";
				if (TmpContactO.Blocked)
				{
					if (TmpContactO.Status > 2)
					{
						TmpContactI = "OnBlocked";
					}
					else
					{
						TmpContactI = "OffBlocked";
					}
				}
				else
				{
					switch (TmpContactO.Status)
					{
						case 1:
							TmpContactI = "Offline";
							break;
						case 4: case 8:
							TmpContactI = "Busy";
							break;
						case 5: case 6: case 7: case 9:
							TmpContactI = "Away";
							break;
					}
				}
				WndCommandBar_CList.Combo_AddItem("CmbList", MsgPlus.RemoveFormatCodes(TmpContactO.Name) + " <" + TmpContactO.Email + ">", 0, TmpContactI);
			}
			break;
	}
}
