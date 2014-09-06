var WndCommandBar_Shell = null;
var WndCommandBar_CMain = null;
var WndCommandBar_CList = null;

var ArrCommands = new Array("Block/block", "Information/info", "Message/msg", "Name/name", "PSM/psm", "Status/status", "Lock/lock", "Sign-out/out", "Shortcut/cut", "Help/help");
for (var TmpCmdE in ArrCommands)
{
	ArrCommands[TmpCmdE] = ArrCommands[TmpCmdE].split("/");
}
var ArrContacts = new Array();

var StrStoredCmd = "";
var IntCurrentChild = -1;

function OnEvent_Initialize()
{
	if (Messenger.MyStatus > 1  && ReadRegistry("ShowState", true) == "-1")
	{
		WndCommandBar_Shell = MsgPlus.CreateWnd("Windows.xml", "WndCommandBar_Shell", 0);
		WndCommandBar_CMain = MsgPlus.CreateChildWnd(WndCommandBar_Shell, "Windows.xml", "WndCommandBar_CMain", 12, 2);
		Interop.Call("user32.dll", "SetFocus", WndCommandBar_CMain.GetControlHandle("EdtCmd"));
		WndCommandBar_Shell.RegisterMessageNotification(0x5, true);
		WndCommandBar_CMain.RegisterMessageNotification(0x100, true);
		IntCurrentChild = 0;
		OnWndCommandBar_ShellEvent_MessageNotification(WndCommandBar_Shell, 0x5);
	}
}

function OnEvent_SigninReady(Email)
{
	Debug.Trace("Function called: OnEvent_Initialize");
	OnEvent_Initialize();
}

function OnEvent_Signout(Email)
{
	Debug.Trace("Function called: OnEvent_Uninitialize");
	OnEvent_Uninitialize();
}

function OnEvent_Uninitialize()
{
	if (Messenger.MyStatus > 1)
	{
		if (IntCurrentChild > -1)
		{
			if (IntCurrentChild == 0)
			{
				WndCommandBar_CMain.Close(0);
			}
			else
			{
				WndCommandBar_CList.Close(0);
			}
			WndCommandBar_Shell.Close(0);
		}
		WriteRegistry("ShowState", IntCurrentChild > -1);
	}
}

function Alert(Message)
{
	Enable(false);
	Interop.Call("user32", "MessageBoxW", null, Message, NAME, 48);
	Enable(true);
	try
	{
		WndCommandBar_CMain.SetControlText("EdtCmd", "Processing...");
	}
	catch (error)
	{
	}
}

function Error(Message)
{
	Enable(false);
	Interop.Call("user32", "MessageBoxW", null, Message, NAME, 16);
	Enable(true);
	try
	{
		WndCommandBar_CMain.SetControlText("EdtCmd", "Processing...");
	}
	catch (error)
	{
	}
}

function Enable(Value)
{
	if (IntCurrentChild > -1)
	{
		Interop.Call("user32", "EnableWindow", WndCommandBar_Shell.GetControlHandle("BtnOk"), Value);
		if (IntCurrentChild == 0)
		{
			Interop.Call("user32", "EnableWindow", WndCommandBar_CMain.GetControlHandle("BtnCommands"), Value);
			Interop.Call("user32", "EnableWindow", WndCommandBar_CMain.GetControlHandle("BtnContacts"), Value);
			Interop.Call("user32", "EnableWindow", WndCommandBar_CMain.GetControlHandle("EdtCmd"), Value);
		}
		else
		{
			Interop.Call("user32", "EnableWindow", WndCommandBar_CList.GetControlHandle("CmbList"), Value);
		}
	}
}

function Unduplicate(Items)
{
	var TmpResult = new Array();
	var TmpLast = "";
	for (var TmpCount = 0; TmpCount < Items.length; TmpCount++)
	{
 		var TmpCurrent = Items[TmpCount];
 		if (TmpCurrent != TmpLast)
 		{
 			TmpResult[TmpResult.length] = TmpCurrent;
 		}
 		TmpLast = TmpCurrent;
	}
	return TmpResult;
}
