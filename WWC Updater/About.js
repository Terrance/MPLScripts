var NAME = "WWC Updater";
var VERSION = "1.0";
var SHELL = new ActiveXObject("WScript.Shell");

// This script has been written by Whiz @ WhizWeb Community.  You can find the website here: http://www.ww-c.co.nr.
// You're welcome to use parts of this script in your own, as long as you give me some credit for the originals. :)

SHELL.RegWrite("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version", VERSION);
