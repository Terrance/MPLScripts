function OnGetScriptMenu()
{
	var ScriptMenu = "<ScriptMenu>";
	ScriptMenu += "<MenuEntry Id=\"All\">" + (Blink.Name || Blink.PSM || Blink.DP || Blink.Status ? "Dis" : "En") + "able mega-blinking</MenuEntry>";
	ScriptMenu += "<Separator/>";
	ScriptMenu += "<MenuEntry Id=\"Name\">" + (Blink.Name ? "Dis" : "En") + "able name blinking</MenuEntry>";
	ScriptMenu += "<MenuEntry Id=\"PSM\">" + (Blink.PSM ? "Dis" : "En") + "able PSM blinking</MenuEntry>";
	ScriptMenu += "<MenuEntry Id=\"DP\">" + (Blink.DP ? "Dis" : "En") + "able DP blinking</MenuEntry>";
	ScriptMenu += "<MenuEntry Id=\"Status\">" + (Blink.Status ? "Dis" : "En") + "able status blinking</MenuEntry>";
	ScriptMenu += "<Separator/>";
	ScriptMenu += "<MenuEntry Id=\"About\">About " + NAME + " " + VERSION + "...</MenuEntry>";
	return ScriptMenu + "</ScriptMenu>";
}

function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	switch (MenuItemId)
	{
		case "All":
			if (Blink.Name || Blink.PSM || Blink.DP || Blink.Status)
			{
				Blink.Name = Blink.PSM = Blink.DP = Blink.Status = false;
				Messenger.MyName = Store.Name.Old;
				Messenger.MyPersonalMessage = Store.PSM.Old;
				Messenger.MyDisplayPicture = Store.DP.Old;
				Messenger.MyStatus = Store.Status.Old;
			}
			else
			{
				Blink.Name = Blink.PSM = Blink.DP = Blink.Status = true;
				Store.Name.Old = Messenger.MyName;
				Store.PSM.Old = Messenger.MyPersonalMessage;
				Store.DP.Old = Messenger.MyDisplayPicture;
				Store.Status.Old = Messenger.MyStatus;
			}
			MsgPlus.DisplayToast(NAME, "Mega-blinking has been " + (Blink.Name ? "en" : "dis") + "abled.");
			break;
		case "Name":
			Blink.Name = !Blink.Name;
			MsgPlus.DisplayToast(NAME, "Name blinking has been " + (Blink.Name ? "en" : "dis") + "abled.");
			if (Blink.Name)
			{
				Store.Name.Old = Messenger.MyName;
			}
			else
			{
				Messenger.MyName = Store.Name.Old;
			}
			break;
		case "PSM":
			Blink.PSM = !Blink.PSM;
			MsgPlus.DisplayToast(NAME, "PSM blinking has been " + (Blink.PSM ? "en" : "dis") + "abled.");
			if (Blink.PSM)
			{
				Store.PSM.Old = Messenger.MyPersonalMessage;
			}
			else
			{
				Messenger.MyPersonalMessage = Store.PSM.Old;
			}
			break;
		case "DP":
			Blink.DP = !Blink.DP;
			MsgPlus.DisplayToast(NAME, "DP blinking has been " + (Blink.DP ? "en" : "dis") + "abled.");
			if (Blink.DP)
			{
				Store.DP.Old = Messenger.MyDisplayPicture;
			}
			else
			{
				Messenger.MyDisplayPicture = Store.DP.Old;
			}
			break;
		case "Status":
			Blink.Status = !Blink.Status;
			MsgPlus.DisplayToast(NAME, "Status blinking has been " + (Blink.Status ? "en" : "dis") + "abled.");
			if (Blink.Status)
			{
				Store.Status.Old = Messenger.MyStatus;
			}
			else
			{
				Messenger.MyStatus = Store.Status.Old;
			}
			break;
		case "About":
			MsgPlus.DisplayToast(NAME, NAME + " (Version " + VERSION + ")\nBy Whiz @ WhizWeb Community\n(http://www.portal-wwc.org.uk)");
			break;
	}
	Debug.Trace("| Settings changed, reloading timer...");
	OnEvent_Timer();
}
