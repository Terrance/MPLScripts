function OnGetScriptMenu(nLocation)
{
	menu='<ScriptMenu>';
	
	if (Enabled)
	{
		menu+='<MenuEntry Id=\"Disable\">Disable remote alerts...</MenuEntry>';
	}
	else
	{
		menu+='<MenuEntry Id=\"Enable\">Enable remote alerts...</MenuEntry>';
	}
	
	menu+='<MenuEntry Id=\"Create\">Create a new alert...</MenuEntry>';
	menu+='<Separator/>';
	menu+='<MenuEntry Id=\"About\">About Remote Alert...</MenuEntry>';
	
	menu+='</ScriptMenu>';
 	 	
	return menu;
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId == "Enable")
	{
		Enabled = true;
	}
	if (sMenuId == "Disable")
	{
		Enabled = false;
	}
	if (sMenuId == "Create")
	{
		if (CreateOpen)
		{
			MsgPlus.DisplayToast("Remote Alert", "Unable to display more than one creation window!  Click to close the currently open creation window...", "", "OnClCrNToastEvent_Clicked", 42);
		}
		else
		{
			CreateOpen = true;
			WCreate = MsgPlus.CreateWnd("Windows.xml", "WndCreate", 0);
			if (AlertOpen)
			{
				Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkNew"), 0);
				Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkForward"), 0);
			}
		}
	}
    if (sMenuId == "About")
	{
		MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
	}
}
