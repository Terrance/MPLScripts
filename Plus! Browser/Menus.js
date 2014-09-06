function OnGetScriptMenu(nLocation)
{
	var Menu = "<ScriptMenu>";
	Menu += "<MenuEntry Id=\"Start\">Open a new window...</MenuEntry>";
	Menu += "<Separator/>";
	Menu += "<MenuEntry Id=\"About\">About " + NAME + " " + VERSION + "...</MenuEntry>";
	return Menu += "</ScriptMenu>";
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	switch (sMenuId)
	{
		case "Start":
			Browser();
			break;
		case "About":
			Alert(NAME + " (Version " + VERSION + ")\nBy Whiz @ WhizWeb Community\n(http://www.ww-c.co.nr)", "About");
			break;
	}
}
