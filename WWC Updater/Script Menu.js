var WndOptions = null;

function OnGetScriptMenu(Location)
{
	var Menu = "<ScriptMenu>\n";
	if (NowLoading === 0)
	{
		Menu += "	<MenuEntry Id=\"Updates\">Check for script updates</MenuEntry>\n";
		Menu += "	<MenuEntry Id=\"Others\">Find some other scripts</MenuEntry>\n";
		Menu += "	<Separator/>\n";
		Menu += "	<MenuEntry Id=\"All\">Show all available scripts</MenuEntry>\n";
	}
	else
	{
		Menu += "	<MenuEntry Id=\"Loading\" Enabled=\"false\">Downloading files...</MenuEntry>\n";
	}
	Menu += "	<Separator/>\n";
	Menu += "	<MenuEntry Id=\"Options\">" + NAME + " options...</MenuEntry>\n";
	Menu += "	<Separator/>\n";
	Menu += "	<MenuEntry Id=\"About\">About " + NAME + " " + VERSION + "</MenuEntry>\n";
	return Menu += "</ScriptMenu>";
}

function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	switch (MenuItemId)
	{
		case "Updates":
			NowLoading = 1;
			DownloadList(NowLoading);
			break;
		case "Others":
			NowLoading = 2;
			DownloadList(NowLoading);
			break;
		case "All":
			NowLoading = 3;
			DownloadList(NowLoading);
			break;
		case "Options":
			WndOptions = MsgPlus.CreateWnd("Windows.xml", "WndOptions", 0);
			WndOptions.Button_SetCheckState("ChkStartupUpdates", Registry.Read(NAME + "\\Options\\ChkStartupUpdates"));
			WndOptions.Button_SetCheckState("ChkStartupOthers", Registry.Read(NAME + "\\Options\\ChkStartupOthers"));
			WndOptions.Button_SetCheckState("ChkMinsUpdates", Registry.Read(NAME + "\\Options\\ChkMinsUpdates"));
			WndOptions.Button_SetCheckState("ChkMinsOthers", Registry.Read(NAME + "\\Options\\ChkMinsOthers"));
			WndOptions.Button_SetCheckState("ChkProgressList", Registry.Read(NAME + "\\Options\\ChkProgressList"));
			WndOptions.Button_SetCheckState("ChkProgressScripts", Registry.Read(NAME + "\\Options\\ChkProgressScripts"));
			break;
		case "About":
			Dialog.Show(NAME + " (Version " + VERSION + ")\nBy Whiz @ WhizWeb Community\n(http://www.ww-c.co.nr)", Dialog.Icon.Info, Dialog.Buttons.OK);
			break;
	}
}
