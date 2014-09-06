var VERSION = "1.0";
new ActiveXObject("WScript.Shell").RegWrite(MsgPlus.ScriptRegPath + "\\Version", VERSION);

var CD = false;

var RA = false;
var RC = false;

var PO = false;

var TR = "";
var MR = "";

var DP = "";

var PW;

function OnGetScriptMenu (nLocation)
{
	var M = '<ScriptMenu>';
	
	if (CD)
	{
		M += '<MenuEntry Id=\"Stop\">Stop the DP countdown...</MenuEntry>';
	}
	else if (PO == true)
	{
		M += '<MenuEntry Id=\" \" Enabled=\"false\">(close the progress window)</MenuEntry>';
	}
	else
	{
		M += '<MenuEntry Id=\"Start\">Start a DP countdown...</MenuEntry>';
	}
	M += '<Separator/>';
	M += '<MenuEntry Id=\"Change\">Change the images...</MenuEntry>';
	if (RA)
	{
		M += '<MenuEntry Id=\"Remote\">Disable remote access...</MenuEntry>';
	}
	else
	{
		M += '<MenuEntry Id=\"Remote\">Enable remote access...</MenuEntry>';
	}
	M += '<Separator/>';
	M += '<MenuEntry Id=\"About\">About CountdownDP...</MenuEntry>';
	M += '</ScriptMenu>';
 
	return M;
}

function OnEvent_MenuClicked (sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId == "Start")
	{
		Wnd("Time");
	}
	if (sMenuId == "Stop")
	{
		StopCDP(true);
	}
	if (sMenuId == "Change")
	{
		var Shell = new ActiveXObject("Shell.Application");
		Shell.ShellExecute(MsgPlus.ScriptFilesPath + "\\Images");
	}
	if (sMenuId == "Remote")
	{
		if (RA)
		{
			RA = false;
		}
		else
		{
			RA = true;
		}
	}
	if (sMenuId == "About")
	{
		Wnd("About");
	}
}

function OnAboutEvent_CtrlClicked(objWnd, strControlId)
{
	if (strControlId == "BtnOk")
	{
		objWnd.Close(2);
	}
}

function OnTimeEvent_CtrlClicked(objWnd, strControlId)
{
	if (strControlId == "BtnOk")
	{
		var TC = objWnd.GetControlText("ETime");
		var MC = objWnd.GetControlText("EMsg");
		if (TC == undefined || TC == "")
		{
			MsgPlus.DisplayToast("CountdownDP","Error: timer not specified!");
		}
		else if (typeof parseInt(TC) === 'number' ? parseInt(TC) : 0)
		{
			if (TC > 60)
			{
				MsgPlus.DisplayToast("CountdownDP","Error: timer over 60 minutes!");
			}
			else if (TC < 1)
			{
				MsgPlus.DisplayToast("CountdownDP","Error: timer under 1 minute!");
			}
			else if (TC.indexOf(".") != -1)
			{
				MsgPlus.DisplayToast("CountdownDP","Error: timer is not an integer!");
				Wnd("Time");
			}
			else
			{
				if (MC == undefined || MC == "")
				{
					StartCDP(TC);
				}
				else
				{
					StartCDP(TC,MC);
				}
				objWnd.Close(1);
			}
		}
		else
		{
			MsgPlus.DisplayToast("CountdownDP","Error: timer has invalid characters!");
		}
	}
}

function OnGetScriptCommands()
{
	var C = '<ScriptCommands>';
	
	if (CD)
	{
		C += '<Command>';
		C += '<Name>cdp.stop</Name>';
		C += '<Description>Stop the DP countdown...</Description>';
		C += '</Command>';
	}
	else if (PO)
	{
	}
	else
	{
		C += '<Command>';
		C += '<Name>cdp.start</Name>';
		C += '<Description>Start a DP countdown...</Description>';
		C += '<Parameters>\<timer length (1 to 60 minutes)\></Parameters>';
		C += '</Command>';
	}
	
	C += '<Command>';
	C += '<Name>cdp.images</Name>';
	C += '<Description>Change the images...</Description>';
	C += '</Command>';
	
	if (RA)
	{
		C += '<Command>';
		C += '<Name>cdp.remote</Name>';
		C += '<Description>Disable remote access...</Description>';
		C += '</Command>';
	}
	else
	{
		C += '<Command>';
		C += '<Name>cdp.remote</Name>';
		C += '<Description>Enable remote access...</Description>';
		C += '</Command>';
	}
	
	C += '</ScriptCommands>';

	return C;
}

function OnEvent_ChatWndSendMessage(ChatWnd,Message)
{
	var C;
	var M;
	var P = new Array();
	var S;
	var A = new Array();
	A = Message.split(" ");
	M = "";	
	for (S in A)
	{
		switch(S) 				
		{
			case "0":	
				C = A[S].toLowerCase();
			break;
			default:
				P[S] = A[S].toLowerCase();
				M += " " + A[S];
			break;
		}
	}
	if (C == "/cdp.start")
	{
		if (P[1] == undefined || P[1] == "")
		{
			Wnd("Time");
		}
		else if (typeof parseInt(P[1]) === 'number' ? parseInt(P[1]) : 0)
		{
			if (P[1] > 60)
			{
				MsgPlus.DisplayToast("CountdownDP","Error: timer over 60 minutes!");
				Wnd("Time");
			}
			else if (P[1] < 1)
			{
				MsgPlus.DisplayToast("CountdownDP","Error: timer under 1 minute!");
				Wnd("Time");
			}
			else if (P[1].substr(2,2) == "." || P[1].substr(3,3) == ".")
			{
				MsgPlus.DisplayToast("CountdownDP","Error: timer is not an integer!");
				Wnd("Time");
			}
			else
			{
				Debug.Trace("Storing current DP...");
				DP = Messenger.MyDisplayPicture;
				if (P[2] == undefined || P[2] == "")
				{
					StartCDP(P[1]);
				}
				else
				{
					StartCDP(P[1],P[2]);
				}
			}
		}
		else
		{
			MsgPlus.DisplayToast("CountdownDP","Error: timer has invalid characters!");
			Wnd("Time");
		}
	}
	else if (C == "/cdp.stop")
	{
		StopCDP(true);
	}
	else if (C == "/cdp.images")
	{
		var Shell = new ActiveXObject("Shell.Application");
		Shell.ShellExecute(MsgPlus.ScriptFilesPath + "\\Images");
	}
	else if (C == "/cdp.remote")
	{
		if (RA)
		{
			RA = false;
		}
		else
		{
			RA = true;
		}
	}
}

function OnEvent_ChatWndReceiveMessage(ChatWnd,Origin,Message,MsgKind)
{
	var C;
	var M;
	var P = new Array();
	var S;
	var A = new Array();
	A = Message.split(" ");
	M = "";	
	for (S in A)
	{
		switch(S) 				
		{
			case "0":	
				C = A[S].toLowerCase();
			break;
			default:
				P[S] = A[S].toLowerCase();
				M += " " + A[S];
			break;
		}
	}
	if (C == "!cdp")
	{
		if (RA)
		{
			if (P[1] == undefined || P[1] == "")
			{
				ChatWnd.SendMessage("CountdownDP | Error: timer not specified!");
			}
			else if (typeof parseInt(P[1]) === 'number' ? parseInt(P[1]) : 0)
			{
				if (P[1] > 60)
				{
					ChatWnd.SendMessage("CountdownDP | Error: timer over 60 minutes!");
				}
				else if (P[1] < 1)
				{
					ChatWnd.SendMessage("CountdownDP | Error: timer under 1 minute!");
				}
				else
				{
					Debug.Trace("Storing current DP...");
					DP = Messenger.MyDisplayPicture;
					RC = true;
					if (P[2] == undefined || P[2] == "")
					{
						StartCDP(P[1]);
					}
					else
					{
						StartCDP(P[1],P[2]);
					}
				}
			}
			else
			{
				ChatWnd.SendMessage("CountdownDP | Error: timer has invalid characters!");
			}
		}
		else
		{
			ChatWnd.SendMessage("CountdownDP | Error: remote access disabled!");
		}
	}
}

function StartCDP(T,M)
{
	CD = true;
	Debug.Trace("== Started new countdown... ==");
	Debug.Trace("Remote countdown: " + RC);
	Debug.Trace("Countdown length: " + T);
	Debug.Trace("Optional message: " + M);
	Debug.Trace("== Now running countdown... ==");
	TR = T;
	MR = M;
	PW = Wnd("Progress");
	PW.SetControlText("ITxt1","Time remaining: " + T + " minute(s)...");
	MsgPlus.AddTimer("RefreshTR",60000);
}

function StopCDP(X)
{
	CD = false;
	switch(X)
	{
		case true:
			Debug.Trace("Cancelled, reverting DP...");
			MsgPlus.CancelTimer("RefreshTR");
			Wnd("Cancelled");
			break;
		case false:
			if (MR == "")
			{
				Debug.Trace("Time up, reverting DP...");
			}
			else
			{
				Debug.Trace("Time up, reverting DP and sending message...");
				for (var oContact = new Enumerator(Messenger.MyContacts); !oContact.atEnd(); oContact.moveNext())
				{
					if (oContact.item().Status > STATUS_OFFLINE && oContact.item().Blocked === false)
					{
						try
						{
							Messenger.OpenChat(oContact.item()).SendMessage(MR);
						}
						catch(error)
						{
						}
					}
				}
			}
			try
			{
				PW.Close(0);
			}
			catch(error)
			{
			}
			Wnd("Completed");
			break;	
	}
	PO = true;
	try
	{
		Messenger.MyDisplayPicture = DP;
	}
	catch(error)
	{
		Messenger.MyDisplayPicture = "";
	}
	Debug.Trace("Resetting all variables...");
	TR = "";
	MR = "";
	DP = "";
	RC = false;
	switch(X)
	{
		case true:
			Debug.Trace("== Countdown has cancelled! ==");
			break;
		case false:
			Debug.Trace("== Countdown has completed! ==");
			break;
	}
}

function Wnd(W)
{
	return MsgPlus.CreateWnd("Windows.xml",W,0);
}

function OnEvent_Timer(TimerId)
{
	if (TimerId = "RefreshTR")
	{
		Debug.Trace("Current time: " + TR + " minutes");
		if (TR == 0)
		{
			StopCDP(false);
		}
		else
		{
			Debug.Trace("Changing DP to: " + TR + ".PNG");
			Messenger.MyDisplayPicture = MsgPlus.ScriptFilesPath + "/Images/" + TR + ".PNG";
			try
			{
				PW.SetControlText("ITxt1","Time remaining: " + TR + " minute(s)...");
			}
			catch(error)
			{
			}
			TR = TR - 1;
			MsgPlus.AddTimer("RefreshTR",1000);
		}
	}
}

function OnProgressEvent_Destroyed(PlusWnd, ExitCode)
{
	if (CD)
	{
		StopCDP(true);
	}
}

function OnCompletedEvent_Destroyed(PlusWnd, ExitCode)
{
	PO = false;
}

function OnCancelledEvent_Destroyed(PlusWnd, ExitCode)
{
	PO = false;
}

function OnEvent_Signout(Email)
{
	if (CD)
	{
		StopCDP(true);
	}
}

function OnEvent_Uninitialize(MessengerExit)
{
	if (MessengerExit == false)
	{
		if (CD)
		{
			StopCDP(true);
		}
	}
}
