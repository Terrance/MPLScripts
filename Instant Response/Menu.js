function OnGetScriptMenu(nLocation)
{
	menu='<ScriptMenu>';
	
	menu+='<MenuEntry Id=\"Control\">Instant Response Control Centre...</MenuEntry>';
	menu+='<Separator/>';
	menu+='<MenuEntry Id=\"About\">About Instant Response 2.0...</MenuEntry>';
	
	menu+='</ScriptMenu>';
 	 	
	return menu;
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId=="Control")
	{
		BuildWnd("Control");
	}
    	if (sMenuId=="About")
	{
		BuildWnd("About");
	}
}

function BuildWnd(WndId)
{
	switch (WndId)
	{
		case "Control":
			var setbuildWnd = MsgPlus.CreateWnd("Windows.xml", "WndControl", 0);
			setbuildWnd.SetControlText("EditMessage", settingMessage);
			setbuildWnd.SetControlText("EditTimer", settingTimer);
			setbuildWnd.Button_SetCheckState("ChkPlusAMStyle", setMsgPlusAM);
			setbuildWnd.Button_SetCheckState("ChkSignInAlert", setSignInAlert);
			break;
		case "About":
			var setbuildWnd = MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
	}
}
