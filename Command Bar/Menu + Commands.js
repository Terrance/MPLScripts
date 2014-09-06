function OnGetScriptMenu(nLocation)
{
	Menu = "<ScriptMenu>";
	
	if (IntCurrentChild == -1)
	{
		Menu += "<MenuEntry Id=\"Show\">Show the Bar...</MenuEntry>";
	}
	else
	{
		Menu += "<MenuEntry Id=\"Hide\">Hide the Bar...</MenuEntry>";
	}
	Menu += "<MenuEntry Id=\"Help\">View the Help Guide...</MenuEntry>";
	Menu += "<Separator/>";
	Menu += "<MenuEntry Id=\"About\">About " + NAME + "...</MenuEntry>";
	
	Menu += "</ScriptMenu>";
 	 	
	return Menu;
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	switch (sMenuId)
	{
		case "Show":
			WriteRegistry("ShowState", true);
			OnEvent_Initialize();
			break;
		case "Hide":
			OnEvent_Uninitialize();
			break;
		case "Help":
			try
			{
				StrStoredCmd = WndCommandBar_CMain.GetControlText("EdtCmd");
				WndCommandBar_CMain.SetControlText("EdtCmd", "");
			}
			catch (error)
			{
			} 
			Help();
			StrStoredCmd = "";
			break;
		case "About":
			try
			{
				StrStoredCmd = WndCommandBar_CMain.GetControlText("EdtCmd");
				WndCommandBar_CMain.SetControlText("EdtCmd", "");
			}
			catch (error)
			{
			} 
			Alert(NAME + " (Version " + VERSION + ")\nBy Whiz @ WhizWeb Community\n(http://www.ww-c.co.nr)");
			StrStoredCmd = "";
			break;
	}
}
