var FlSysObj = new ActiveXObject("Scripting.FileSystemObject");

function OnEvent_Initialize(MessengerStart)
{
	if (!ExistsRegistry("", "Enabled"))
	{
		Interop.Call('user32', 'MessageBoxW', null, 'As this is the first time you have run Idle Manager, click OK to be taken to the Setup window.  To access this window again, go to the Script Menu > "Idle Manager" > "Setup action delays...".', 'Idle Manager', 64);
		WndSetup_Open();
		WriteRegistry("", "Enabled", true, true);
	}
}

function OnGetScriptMenu(nLocation)
{
	menu='<ScriptMenu>';
	
	menu+='<MenuEntry Id=\"Setup\">Setup action delays...</MenuEntry>';
	menu+='<Separator/>';
	menu+='<MenuEntry Id=\"About\">About Idle Manager...</MenuEntry>';
	
	menu+='</ScriptMenu>';
 	 	
	return menu;
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId == "Setup")
	{
		WndSetup_Open();
	}
    	if (sMenuId == "About")
	{
		MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
	}
}

function OnWndAboutEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "BtnOk":
			objWnd.Close(0);
			break;
	}
}
