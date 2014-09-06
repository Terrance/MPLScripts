var VERSION = "1.0";

function OnEvent_SigninReady(Email)
{
	new ActiveXObject("WScript.Shell").RegWrite(VERSION);
}

// ------------------------------------------------------

var Counting = false;
var Paused = false;

var CountWindow;
var CountWndOpen = false;

var AdjustWindow;
var AdjustWndOpen = false;

var Hours = 0;
var Minutes = 0;
var Seconds = 0;
var Deciseconds = 0;
var TotalTime = 0;

var Add0S;
var Add0M;
var Add0H;

function OnGetScriptMenu(nLocation)
{
	var Menu = '<ScriptMenu>';
	
	if (Counting)
	{
		Menu += '<MenuEntry Id=\"Stop\">Stop the Plus! Counter...</MenuEntry>';
		
		if (Paused)
		{
			Menu += '<MenuEntry Id=\"Resume\">Resume the Plus! Counter...</MenuEntry>';
		}
		else
		{
			Menu += '<MenuEntry Id=\"Pause\">Pause the Plus! Counter...</MenuEntry>';
		}
		
		Menu += '<Separator/>';
		
		if (CountWndOpen)
		{
			Menu += '<MenuEntry Id=\"Hide\">Hide the counter window...</MenuEntry>';
		}
		else
		{
			Menu += '<MenuEntry Id=\"Show\">Show the counter window...</MenuEntry>';
		}
	}
	else
	{
		Menu += '<MenuEntry Id=\"Start\">Start a Plus! Counter...</MenuEntry>';
	}
	
	Menu += '<Separator/>';
	
	Menu += '<MenuEntry Id=\"About\">About Plus! Counter...</MenuEntry>';
	
	Menu += '</ScriptMenu>';
 
	return Menu;
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId == "Start")
	{
		StartCounter();
	}
	if (sMenuId == "Stop")
	{
		StopCounter();
	}
	if (sMenuId == "Pause")
	{
		PauseCounter();
	}
	if (sMenuId == "Resume")
	{
		ResumeCounter();
	}
	if (sMenuId == "Show")
	{
		ShowCounter();
	}
	if (sMenuId == "Hide")
	{
		HideCounter();
	}
	if (sMenuId == "About")
	{
		MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
	}
}

function OnAboutEvent_CtrlClicked(objWnd, strControlId)
{
	if (strControlId == "Ok")
	{
		objWnd.Close(0);
	}
}

function OnGetScriptCommands()
{
	var Commands = '<ScriptCommands>';
	
	if (Counting)
	{
		Commands += '<Command>';
		Commands += '<Name>count.stop</Name>';
		Commands += '<Description>Stop the Plus! Counter...</Description>';
		Commands += '</Command>';
		
		if (Paused)
		{
			Commands += '<Command>';
			Commands += '<Name>count.resume</Name>';
			Commands += '<Description>Resume the Plus! Counter...</Description>';
			Commands += '</Command>';
		}
		else
		{
			Commands += '<Command>';
			Commands += '<Name>count.pause</Name>';
			Commands += '<Description>Pause the Plus! Counter...</Description>';
			Commands += '</Command>';
		}
	}
	else
	{
		Commands += '<Command>';
		Commands += '<Name>count.start</Name>';
		Commands += '<Description>Start a Plus! Counter...</Description>';
		Commands += '</Command>';
	}
	
	Commands += '</ScriptCommands>';

	return Commands;
}

function OnEvent_ChatWndSendMessage(ChatWnd, Message)
{
	if (Message == "/count.start" && !Counting)
	{
		StartCounter();
	}
	if (Message == "/count.stop" && Counting)
	{
		StopCounter();
	}
	if (Message == "/count.pause" && Counting && !Paused)
	{
		PauseCounter();
	}
	if (Message == "/count.resume" && Counting && Paused)
	{
		ResumeCounter();
	}
}

function StartCounter()
{
	Debug.Trace("Function called: StartCounter");
	Counting = true;
	if (CountWndOpen)
	{
		HideCounter();
	}
	if (AdjustWndOpen)
	{
		HideAdjust();
	}
	ShowCounter();
	Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Pause"), 1);
	Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Resume"), 0);
	MsgPlus.AddTimer("RefreshTime", 100);
}

function StopCounter()
{
	Debug.Trace("Function called: StopCounter");
	Counting = false;
	if (CountWndOpen)
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Pause"), 0);
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Resume"), 0);
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Stop"), 0);
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Adjust"), 0);
	}
	if (AdjustWndOpen)
	{
		Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("HoursAdd"), 0);
		Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("HoursSubtract"), 0);
		Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("MinutesAdd"), 0);
		Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("MinutesSubtract"), 0);
		Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("SecondsAdd"), 0);
		Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("SecondsSubtract"), 0);
	}
	MsgPlus.CancelTimer("RefreshTime");
	Deciseconds = 0;
	Seconds = 0;
	Minutes = 0;
	Hours = 0;
	TotalTime = 0;
}

function PauseCounter()
{
	Debug.Trace("Function called: PauseCounter");
	Paused = true;
	if (CountWndOpen)
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Pause"), 0);
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Resume"), 1);
	}
	MsgPlus.CancelTimer("RefreshTime");
}

function ResumeCounter()
{
	Debug.Trace("Function called: ResumeCounter");
	Paused = false;
	if (CountWndOpen)
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Pause"), 1);
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Resume"), 0);
	}
	MsgPlus.AddTimer("RefreshTime", 100);
}

function ShowCounter()
{
	Debug.Trace("Function called: ShowCounter");
	CountWndOpen = true;
	CountWindow = MsgPlus.CreateWnd("Windows.xml", "WndCounter", 0);
	if (Paused)
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Pause"), 0);
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Resume"), 1);
	}
	else
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Pause"), 1);
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Resume"), 0);
	}
	Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Stop"), 1);
	if (AdjustWndOpen)
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Adjust"), 0);
	}
	else
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Adjust"), 1);
	}
}

function HideCounter()
{
	Debug.Trace("Function called: HideCounter");
	CountWndOpen = false;
	CountWindow.Close(0);
}

function ShowAdjust()
{
	Debug.Trace("Function called: ShowAdjust");
	AdjustWindow = MsgPlus.CreateWnd("Windows.xml", "WndAdjust", 0);
	AdjustWndOpen = true;
	Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Adjust"), 0);
}

function HideAdjust()
{
	Debug.Trace("Function called: HideAdjust");
	AdjustWindow.Close(0);
	AdjustWndOpen = false;
}

function OnWndCounterEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "Pause":
			PauseCounter();
			break;
		case "Resume":
			ResumeCounter();
			break;
		case "Stop":
			StopCounter();
			break;
		case "Adjust":
			ShowAdjust();
			break;
	}
}

function OnWndAdjustEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "HoursAdd":
			Hours = Hours + 1;
			break;
		case "HoursSubtract":
			Hours = Hours - 1;
			if (Hours < 0)
			{
				Hours = 0;
				Minutes = 0;
				Seconds = 0;
				Deciseconds = 0;
			}
			break;
		case "MinutesAdd":
			Minutes = Minutes + 1;
			if (Minutes > 59)
			{
				Minutes = 0;
				Hours = Hours + 1;
			}
			break;
		case "MinutesSubtract":
			Minutes = Minutes - 1;
			if (Minutes < 0)
			{
				Minutes = 59;
				if (Hours == 0)
				{
					Minutes = 0;
				}
				else
				{
					Hours = Hours - 1;
				}
				Seconds = 0;
				Deciseconds = 0;
			}
			break;
		case "SecondsAdd":
			Seconds = Seconds + 1;
			if (Seconds > 59)
			{
				Seconds = 0;
				Minutes = Minutes + 1;
			}
			break;
		case "SecondsSubtract":
			Seconds = Seconds - 1;
			if (Seconds < 0)
			{
				Seconds = 59;
				if (Minutes == 0)
				{
					Seconds = 0;
				}
				else
				{
					Minutes = Minutes - 1;
				}
				Deciseconds = 0;
			}
			break;
	}
	Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("HoursAdd"), 0);
	Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("HoursSubtract"), 0);
	Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("MintuesAdd"), 0);
	Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("MinutesSubtract"), 0);
	Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("SecondsAdd"), 0);
	Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("SecondsSubtract"), 0);
}

function OnWndCounterEvent_Destroyed(objWnd, ExitCode)
{
	if (CountWndOpen)
	{
		CountWndOpen = false;
	}
}

function OnWndAdjustEvent_Destroyed(objWnd, ExitCode)
{
	if (AdjustWndOpen)
	{
		AdjustWndOpen = false;
	}
	try
	{
		Interop.Call("User32", "EnableWindow", CountWindow.GetControlHandle("Adjust"), 1);
	}
	catch (error)
	{
	}
}

function OnEvent_Timer(TimerId)
{
	if (TimerId = "RefreshTime")
	{
		Deciseconds = Deciseconds + 1;
		if (Deciseconds == 10)
		{
			Deciseconds = 0;
			Seconds = Seconds + 1;
			if (Seconds == 60)
			{
				Seconds = 0;
				Minutes = Minutes + 1;
				if (Minutes == 60)
				{
					Minutes = 0;
					Hours = Hours + 1;
				}
			}
		}
		TotalTime = TotalTime + 1;
		if (Seconds < 10)
		{
			Add0S = "0";
		}
		else
		{
			Add0S = "";
		}
		if (Minutes < 10)
		{
			Add0M = "0";
		}
		else
		{
			Add0M = "";
		}
		if (Hours < 10)
		{
			Add0H = "0";
		}
		else
		{
			Add0H = "";
		}
		if (CountWndOpen)
		{
			CountWindow.SetControlText("TimeElapsed", "Time elapsed: " + Add0H + Hours + ":" + Add0M + Minutes + ":" + Add0S + Seconds + "." + Deciseconds + " (" + TotalTime + "ds)");
		}
		if (AdjustWndOpen)
		{
			AdjustWindow.SetControlText("Hours", Add0H + Hours);
			AdjustWindow.SetControlText("Minutes", Add0M + Minutes);
			AdjustWindow.SetControlText("Seconds", Add0S + Seconds);
			AdjustWindow.SetControlText("NewTime", "New time: " + Add0H + Hours + ":" + Add0M + Minutes + ":" + Add0S + Seconds + "." + Deciseconds + " (" + TotalTime + "ds)");
			try
			{
				Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("HoursAdd"), 1);
				Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("HoursSubtract"), 1);
				Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("MinutesAdd"), 1);
				Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("MinutesSubtract"), 1);
				Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("SecondsAdd"), 1);
				Interop.Call("User32", "EnableWindow", AdjustWindow.GetControlHandle("SecondsSubtract"), 1);
			}
			catch (error)
			{
			}
		}
		MsgPlus.AddTimer("RefreshTime", 100);
	}
}

function OnEvent_Signout(Email)
{
	if (Counting)
	{
		StopCounter();
	}
}

function OnEvent_Uninitialize(MessengerExit)
{
	if (MessengerExit == false)
	{
		if (Counting)
		{
			StopCounter();
		}
	}
}
