var VERSION = "1.0";

function OnEvent_SigninReady(Email)
{
	new ActiveXObject("WScript.Shell").RegWrite(VERSION);
}

// ------------------------------------------------------

var Idle = false;
var IdleStat = false;
var IdleTime = 0;
var IdleWnd;

var Name, PSM;

function ActIdle_On()
{
	Idle = true;
	IdleStat = true;
	IdleTime = 0;
	Name = Messenger.MyName;
	PSM = Messenger.MyPersonalMessage;
	MsgPlus.DisplayToast("Idle Manager", "Your status has been changed to Idle.  If you are unable to exit this status (like if you used the Status option), use the Disable button.");
	IdleWnd = MsgPlus.CreateWnd("Windows.xml", "WndIdle", 0);
	MsgPlus.AddTimer("IdleRefresh", 60000);
}

function ActIdle_Off()
{
	Idle = false;
	IdleStat = false;
	IdleTime = -1;
	Messenger.MyName = Name;
	Messenger.MyPersonalMessage = PSM;
	Messenger.MyStatus = 3;
	MsgPlus.DisplayToast("Idle Manager", "Your status is no longer Idle.  Your name, PSM and status (if set to change) have now been reset.");
	try { IdleWnd.Close(0); } catch (error) {}
	try { MsgPlus.CancelTimer("IdleRefresh"); } catch (error) {}
}

function OnEvent_MyStatusChange(NewStatus)
{
	WriteRegistry("", "Enabled", true, true);
	if (ReadRegistry("", "Enabled"))
	{
		if (NewStatus == 6)
		{
			ActIdle_On();
		}
		else if (Idle && IdleStat)
		{
			ActIdle_Off();
		}
	}
}

function OnWndIdleEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "BtnIdle":
			objWnd.Close(0);
			break;
	}
}

function OnWndIdleEvent_Destroyed(objWnd, ExitCode)
{
	ActIdle_Off();
}

function OnEvent_Timer(TimerId)
{
	Debug.Trace("Function called: OnEvent_Timer");
	switch (TimerId)
	{
		case "IdleRefresh":
			IdleTime = IdleTime + 1;
			IdleWnd.SetControlText("TxtCount", "Idle status count: " + IdleTime + " minute(s)");
			if (ReadRegistry("Status", "Chk") == "-1" && IdleTime == ReadRegistry("Status", "Min"))
			{
				IdleStat = false;
				switch (ReadRegistry("Status", "Cmb"))
				{
					case "0":
						Messenger.MyStatus = 3;
						MsgPlus.DisplayToast("Idle Manager", "Your status has been changed:\n" + Messenger.MyStatus + " (Online)");
						break;
					case "1":
						Messenger.MyStatus = 4;
						MsgPlus.DisplayToast("Idle Manager", "Your status has been changed:\n" + Messenger.MyStatus + " (Busy)");
						break;
					case "2":
						Messenger.MyStatus = 5;
						MsgPlus.DisplayToast("Idle Manager", "Your status has been changed:\n" + Messenger.MyStatus + " (Be Right Back)");
						break;
					case "3":
						Messenger.MyStatus = 6;
						MsgPlus.DisplayToast("Idle Manager", "Your status has been changed:\n" + Messenger.MyStatus + " (Away)");
						break;
					case "4":
						Messenger.MyStatus = 8;
						MsgPlus.DisplayToast("Idle Manager", "Your status has been changed:\n" + Messenger.MyStatus + " (In a Call)");
						break;
					case "5":
						Messenger.MyStatus = 9;
						MsgPlus.DisplayToast("Idle Manager", "Your status has been changed:\n" + Messenger.MyStatus + " (Out to Lunch)");
						break;
					case "6":
						Messenger.MyStatus = 2;
						MsgPlus.DisplayToast("Idle Manager", "Your status has been changed:\n" + Messenger.MyStatus + " (Appear Offline)");
						break;
				}
				MsgPlus.DisplayToast("Idle Manager", "You can no longer come out of the Idle status by mouse movement or keystrokes.  Click on the floating button to disable the Idle status.");
			}
			if (ReadRegistry("Name", "Chk") == "-1" && IdleTime == ReadRegistry("Name", "Min"))
			{
				Messenger.MyName = ReadRegistry("Name", "Edt");
				MsgPlus.DisplayToast("Idle Manager", "Your name has been changed:\n" + Messenger.MyName);
			}
			if (ReadRegistry("PSM", "Chk") == "-1" && IdleTime == ReadRegistry("PSM", "Min"))
			{
				Messenger.MyPersonalMessage = ReadRegistry("PSM", "Edt");
				MsgPlus.DisplayToast("Idle Manager", "Your PSM has been changed:\n" + Messenger.MyPersonalMessage);
			}
			if (ReadRegistry("Signout", "Chk") == "-1" && IdleTime == ReadRegistry("Signout", "Min"))
			{
				Messenger.Signout();
				MsgPlus.DisplayToast("Idle Manager", "You have been signed out of Messenger.  Your settings can no longer be read from the registry.");
			}
			if (ReadRegistry("Launch", "Chk") == "-1" && IdleTime == ReadRegistry("Launch", "Min"))
			{
				FlSysObj.Run(ReadRegistry("Launch", "Edt"));
				MsgPlus.DisplayToast("Idle Manager", "A file has been opened:\n" + ReadRegistry("Launch", "Edt"));
			}
			if (ReadRegistry("Shutdown", "Chk") == "-1" && IdleTime == ReadRegistry("Shutdown", "Min"))
			{
				switch (ReadRegistry("Shutdown", "Cmb"))
				{
					case 0:
						FlSysObj.Run("C:\\WINDOWS\\shutdown.exe -l");
						MsgPlus.DisplayToast("Idle Manager", "Shutdown has been activiated:\nLogging off...");
						break;
					case 1:
						FlSysObj.Run("C:\\WINDOWS\\shutdown.exe");
						MsgPlus.DisplayToast("Idle Manager", "Shutdown has been activiated:\nTurning off...");
						break;
				}
			}
			MsgPlus.AddTimer("IdleRefresh", 60000);
			break;
	}
}
