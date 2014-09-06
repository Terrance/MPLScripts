/*
File: About.js
Checks for previous versions and displays alerts accordingly.
*/

var NAME = "DevTools";
var VERSION = "1.0";

// This script has been written by Whiz @ WhizWeb Community.  You can find the website here: http://www.ww-c.co.nr.
// You're welcome to use parts of this script in your own, as long as you give me some credit for the originals. :)

Debug.ClearDebuggingWindow();

Debug.Trace("+----------+-----+");
Debug.Trace("| " + NAME + " | " + VERSION + " |");
Debug.Trace("+----------+-----+");

function VersionCheck()
{
	Debugging.Trace("<-- Start version check. -->");
	Debugging.Trace("--> Checking for version registry key...");
	var Return = true;
	try
	{
		Debugging.Trace("--> | Current version: " + VERSION);
		var VER_OLD = ActiveX["WSS"].RegRead("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version");
		Debugging.Trace("--> | Previous version: " + VER_OLD);
		if (VERSION > VER_OLD) // current version is newer than last loaded
		{
			Debugging.Trace("--> | | Older version loaded at previous startup.");
			Debugging.Trace("--> | | Displaying upgrade toast...");
			Toast("Update successful!", NAME + " has now been updated from version " + VER_OLD + " to version " + VERSION + ".");
		}
		else if (VERSION < VER_OLD) // current version is older than last loaded
		{
			Debugging.Trace("--> | | Newer version loaded at previous startup.");
			Debugging.Trace("--> | | Displaying downgrade toast...");
			Toast("Downgrade detected...", NAME + " has been downgraded from version " + VER_OLD + " to version " + VERSION + ".");
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
		Debugging.Trace("--> | | Displaying first run toast...");
		Toast("Welcome to DevTools!", "Click here to read about the basics of using " + NAME + " for scripting.", "WndBrowser_Build");
		Return = false;
	}
	Debugging.Trace("--> Saving version registry key...");
	ActiveX["WSS"].RegWrite("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version", VERSION);
	Debugging.Trace("--> | Key saved.  Value: " + ActiveX["WSS"].RegRead("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version"));
	Debugging.Trace("<-- End version check. -->");
	return Return;
}
