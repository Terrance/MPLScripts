var VERSION = "1.0";

function OnEvent_SigninReady(Email)
{
	new ActiveXObject("WScript.Shell").RegWrite(VERSION);
}

// ------------------------------------------------------

var SysEnabled = false;
var SysProfileNo = 0;

var TmpMenu = "";
var TmpId = 0;
var TmpEdit = 0;

var WndManager = null;
var WndAddEditProfile = null;
var WndFloater = null;

var OldName = "";
var OldPSM = "";
var OldDP = "";
var OldStatus = "";

var CmbStatus = new Array("", "Appear Offline", "Online", "Busy", "Be Right Back", "Away", "In a Call", "Out to Lunch");
