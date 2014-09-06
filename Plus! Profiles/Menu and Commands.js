function OnGetScriptMenu(nLocation)
{
	Menu = "<ScriptMenu>";
	
	Menu += "<MenuEntry Id=\"Manager\">Open Manager</MenuEntry>";
	Menu += "<MenuEntry Id=\"Floater\">Show Floater</MenuEntry>";
	
	Menu += "<Separator/>";
	
	Menu += "<SubMenu Label=\"My Profiles\">";
	if (SysProfileNo == 0)
	{
		Menu += "	<MenuEntry Id=\"Profile 0\" Enabled=\"false\">(no profile)</MenuEntry>";
	}
	else
	{
		Menu += "	<MenuEntry Id=\"Profile 0\">(no profile)</MenuEntry>";
	}
	Menu += "	<Separator/>";
	Menu += LoadProfiles_Menu(1);
	Menu += "</SubMenu>";
	
	Menu += "<Separator/>";
	
	Menu += "<MenuEntry Id=\"About\">About " + NAME + " " + VERSION + "...</MenuEntry>";
	
	Menu += "</ScriptMenu>";
	
	TmpMenu = "";
 	 	
	return Menu;
}

function OnGetScriptCommands()
{
	var ScriptCommands = "<ScriptCommands>";
	
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>pp.manager</Name>";
	ScriptCommands    +=         "<Description>Plus! Profiles\nOpen the manager.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>pp.enable</Name>";
	ScriptCommands    +=         "<Description>Plus! Profiles\nEnables a profile.\nParameter: ID</Description>";
	ScriptCommands    +=         "<Parameters>[ID #]</Parameters>";
	ScriptCommands    +=     "</Command>";
	if (SysProfileNo > 0)
	{
		ScriptCommands    +=     "<Command>";
		ScriptCommands    +=         "<Name>pp.disable</Name>";
		ScriptCommands    +=         "<Description>Plus! Profiles\nDisables the current profile.</Description>";
		ScriptCommands    +=     "</Command>";
	}
	
	ScriptCommands    += "</ScriptCommands>";
	
	return ScriptCommands;
}
