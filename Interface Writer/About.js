/*
File: About.js
Checks for previous versions and displays alerts accordingly.
*/

var NAME = "Interface Writer";
var VERSION = "3.0";
var SHELL = new ActiveXObject("WScript.Shell");

// This script has been written by Whiz @ WhizWeb Community.  You can find the website here: http://www.ww-c.co.nr.
// You're welcome to use parts of this script in your own, as long as you give me some credit for the originals. :)

Debug.ClearDebuggingWindow();

Debug.Trace("+------------------+-----+");
Debug.Trace("| " + NAME + " | " + VERSION + " |");
Debug.Trace("+------------------+-----+");

function VersionCheck()
{
	Debugging.Trace("<-- Start version check. -->");
	Debugging.Trace("--> Checking for version registry key...");
	var OkToWrite = true;
	try
	{
		Debugging.Trace("--> | Current version: " + VERSION);
		var VER_OLD = SHELL.RegRead("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version");
		Debugging.Trace("--> | Previous version: " + VER_OLD);
		if (VERSION > VER_OLD) // current version is newer than last loaded
		{
			Debugging.Trace("--> | | Older version loaded at previous startup.");
			Debugging.Trace("--> | | Displaying upgrade dialog...");
			var TmpMessage = "Thanks for upgrading Interface Writer!  This version supports multiple control/element editing, window bottom bars, enhanced right-click menus, Interface Tester and more...\n\n";
			TmpMessage += "To get started, go to the Script Menu > \"" + NAME + "\" > \"Create...\".\nTo load an existing file, go to the Script Menu > \"" + NAME + "\" > \"Load...\".\n\nTo view windows without editing, go to the Script Menu > \"" + NAME + "\" > \"View...\".\n\n";
			TmpMessage += "In this version, any obsolete files will be removed after you click OK.  Any files which do not come with this version will be permanently deleted.  If you have saved any files in the script folder, it is recommended that you copy them to an alternative location before continuing.";
			Interop.Call("user32", "MessageBoxW", null, TmpMessage, NAME + " | Welcome...", 48);
		}
		else if (VERSION < VER_OLD) // current version is older than last loaded
		{
			Debugging.Trace("--> | | Newer version loaded at previous startup.");
			Debugging.Trace("--> | | Displaying downgrade dialog...");
			var TmpMessage = "You appear to have installed and ran an older version of Interface Writer than the one used at the last launch of Messenger.  It is highly recommended that you download the latest version.";
			Interop.Call("user32", "MessageBoxW", null, TmpMessage, NAME + " | Welcome...", 48);
			OkToWrite = false;
		}
		else // same as last load
		{
			Debugging.Trace("--> | | Versions match.");
		}
	}
	catch (error)
	{
		// no previous load - new install
		Debugging.Trace("--> | Unable to retrieve previous version.");
		Debugging.Trace("--> | | Displaying first run dialog...");
		var TmpMessage = "Welcome to " + NAME + "!  Using this script, you can write interfaces for your own scripts.\n\nTo get started, go to the Script Menu > \"" + NAME + "\" > \"Create...\".\nTo load an existing file, go to the Script Menu > \"" + NAME + "\" > \"Load...\".\n\nTo view windows without editing, go to the Script Menu > \"" + NAME + "\" > \"View...\".";
		Interop.Call("user32", "MessageBoxW", null, TmpMessage, NAME + " | Welcome...", 48);
	}
	if (OkToWrite)
	{
		// save registry version key
		Debugging.Trace("--> Saving version registry key...");
		SHELL.RegWrite("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version", VERSION);
		Debugging.Trace("--> | Key saved.  Value: " + SHELL.RegRead("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version"));
	}
	Debugging.Trace("<-- End version check. -->");
}
