/*
File: Menu.js
Manages the script menu and menu click events.
*/

function OnGetScriptMenu(Location)
{
	try
	{
		Debugging.Call("ScriptMenu", {"Location" : Location});
		var Menu = "<ScriptMenu>\n";
		Menu += "	<MenuEntry Id=\"Launch\">Launch " + NAME +  " " + VERSION + "</MenuEntry>\n";
		Menu += "	<MenuEntry Id=\"Manage\">Manage Installed Tools</MenuEntry>\n";
		Menu += "	<Separator />\n";
		Menu += "	<MenuEntry Id=\"Reload\">Reload / Tool Scan</MenuEntry>\n";
		Menu += "	<MenuEntry Id=\"Package\">Install Tool Package...</MenuEntry>\n";
		Menu += "	<Separator />\n";
		Menu += "	<MenuEntry Id=\"Browser\">" + NAME + " Browser...</MenuEntry>\n";
		Menu += "	<Separator />\n";
		Menu += "	<MenuEntry Id=\"Debug\">" + (Registry.Read("Debug") ? "Dis" : "En") + "able Debugging</MenuEntry>\n";
		return Menu += "</ScriptMenu>";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	try
	{
		Debugging.Call("MenuClicked", {"MenuItemId" : MenuItemId, "Location" : Location, "OriginWnd" : typeof(OriginWnd) === "object" ? OriginWnd.Handle : (OriginWnd === undefined ? "undefined (recursive call)" : Messenger.ContactListWndHandle)});
		switch (MenuItemId)
		{
			case "Launch":
				WndTools_Build();
				break;
			case "Manage":
				WndManage_Build();
				break;
			case "Reload":
				if (Dialog.Show("Reload", "In order to reload or find tools, any open windows will be closed.", Dialog.Icon.Alert, Dialog.Buttons.OK_Cancel, Location === 1 ? Messenger.ContactListWndHandle : OriginWnd.Handle) === Dialog.Result.OK)
				{
					Window.CloseAll();
					OnEvent_SigninReady(Messenger.MyEmail);
				}
				break;
			case "Package":
				var Path = BrowseForFile("Package", "%homepath%\\My Documents", false, "", "", (Location === 1 ? Messenger.ContactListWndHandle : OriginWnd.Handle));
				if (Path) // did we select a file?
				{
					if (MsgPlus.ExtractFromZIP(Path, MsgPlus.ScriptFilesPath + "\\Tools", "*")) // extract successful?
					{
						OnEvent_MenuClicked("Reload", Location, OriginWnd); // refresh
					}
					else // failed to extract
					{
						Toast("Package install failed...", "The specified tool package may be invalid, corrupt or empty.");
					}
				}
				break;
			case "Browser":
				WndBrowser_Build();
				break;
			case "Debug":
				Registry.Write("Debug", Number(!Registry.Read("Debug")), "REG_DWORD"); // invert value
				Toast("Debug options " + (Registry.Read("Debug") ? "en" : "dis") + "abled...", "Debugging options have now been " + (Registry.Read("Debug") ? "en" : "dis") + "abled for this Messenger user.");
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
