var NAME = "QuickKey";
var VERSION = "2.2";
var SHELL = new ActiveXObject("WScript.Shell");

// This script has been written by Whiz @ WhizWeb Community.  You can find the website here: http://www.portal-wwc.org.uk.

// You are welcome to use parts of this script in your own, as long as you give me some credit for making the original. :)

try
{
	if (SHELL.RegRead("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version") < VERSION)
	{
		var Message = "Thanks for upgrading " + NAME + "!  If you have upgraded from version 1.2, then some of your settings may not match the new options (this can easily be corrected with a few clicks of the mouse).\n\nThe default shortcuts remain the same:\n\n";
		Message += "Ctrl + Alt + C = Messenger Conversations\nCtrl + Alt + I = Messenger Information\nCtrl + Alt + L = Messenger Contact List\nCtrl + Alt + M = QuickKey Hotkey Manager\nCtrl + Alt + Q = QuickKey Options\nCtrl + Alt + S = Messenger Status\n\nThese can be changed through Options > Manage QuickKey shortcuts...";
		Interop.Call("user32", "MessageBoxW", null, Message, NAME, 48);
	}
}
catch (error)
{
	Interop.Call("user32", "MessageBoxW", null, "Welcome to QuickKey!  The default shortcuts are as follows:\n\nCtrl + Alt + C = Messenger Conversations\nCtrl + Alt + I = Messenger Information\nCtrl + Alt + L = Messenger Contact List\nCtrl + Alt + M = QuickKey Hotkey Manager\nCtrl + Alt + Q = QuickKey Options\nCtrl + Alt + S = Messenger Status\n\nThese can be changed through Options > Manage QuickKey shortcuts...", NAME, 48);
}

SHELL.RegWrite("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version", VERSION);
