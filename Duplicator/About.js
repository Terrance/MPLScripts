// ----------------------------------------------------------------------------------------------------------------------------------------------------

var NAME = "Duplicator";
var VERSION = "1.2";

// This script has been written by Whiz @ WhizWeb Community.  You can find the website here: http://www.portal-wwc.org.uk -----------------------------

// You are welcome to use parts of this script in your own, as long as you give me some credit for making the original. :) ----------------------------

new ActiveXObject("WScript.Shell").RegWrite("HKCU\\SOFTWARE\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\" + NAME + "\\Version", VERSION);

// ----------------------------------------------------------------------------------------------------------------------------------------------------
