var Enabled = true;

var WMessage, WCreate;
var SMessage, SOrigin, TMessage, TOrigin;

var ChatWnd;

var AlertOpen = false;
var CreateOpen = false;
var AlCrLinked = false;

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MsgKind)
{
	if (/^\!([^\s\!]+)\s*([\s\S]*)$/.exec(Message) !== null)
	{
		var Command = RegExp.$1.toLowerCase();
		var Parameter = RegExp.$2;
		switch (Command)
		{
			case 'alert':
				if (Enabled)
				{
					if (Origin != Messenger.MyName)
					{
						if (AlertOpen)
						{
							TMessage = Parameter;
							TOrigin = Origin;
							MsgPlus.DisplayToast("Remote Alert", "Unable to display more than one remote alert!  Click to close the currently open alert window...", "", "OnClAlToastEvent_Clicked", 42);
						}
						else
						{
							SMessage = Parameter;
							SOrigin = Origin;
							AlertOpen = true;
							WMessage = MsgPlus.CreateWnd("Windows.xml", "WndMessage", 0);
					 		WMessage.SetControlText("EdtMessage", SMessage);
						 	WMessage.SetControlText("EdtEmail", SOrigin);
						}
					}
				}
		}
	}
}

function OnWndMessageEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "LnkNew":
			if (CreateOpen)
			{
				MsgPlus.DisplayToast("Remote Alert", "Unable to display more than one creation window!  Click to close the currently open creation window...", "", "OnClCrNToastEvent_Clicked", 42);
			}
			else
			{
				CreateOpen = true;
				WCreate = MsgPlus.CreateWnd("Windows.xml", "WndCreate", 0);
				Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkNew"), 0);
				Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkForward"), 0);
			}
			break;
		case "LnkForward":
			if (CreateOpen)
			{
				MsgPlus.DisplayToast("Remote Alert", "Unable to display more than one creation window!  Click to close the currently open creation window...", "", "OnClCrFToastEvent_Clicked", 42);
			}
			else
			{
				CreateOpen = true;
				WCreate = MsgPlus.CreateWnd("Windows.xml", "WndCreate", 0);
				WCreate.SetControlText("EdtMessage", "--> Original message from " + SOrigin + ":\n" + SMessage);
				Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkNew"), 0);
				Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkForward"), 0);
			}
			break;
		case "LnkDelete":
			WMessage.Close(0);
			break;
		case "LnkDisable":
			Enabled = false;
			Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkDisable"), 0);
			break;
	}
}

function OnWndMessageEvent_Destroyed(objWnd, ExitCode)
{
	AlertOpen = false;
	try
	{
		WCreate.Close(0);
	}
	catch(error)
	{
	}
}

function OnWndCreateEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "LnkSend":
			ChatWnd = Messenger.OpenChat(WCreate.GetControlText("EdtEmail"));
			ChatWnd.SendMessage("!alert " + WCreate.GetControlText("EdtMessage"));
			WCreate.Close(0);
			break;
		case "LnkCancel":
			WCreate.Close(0);
			break;
		case "LnkOpen":
			ChatWnd = Messenger.OpenChat(WCreate.GetControlText("EdtEmail"));
			break;
	}
}

function OnWndCreateEvent_Destroyed(objWnd, ExitCode)
{
	CreateOpen = false;
	try
	{
		Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkNew"), 1);
		Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkForward"), 1);
	}
	catch(error)
	{
	}
}

function OnClAlToastEvent_Clicked()
{
	try
	{
		WMessage.Close(0);
	}
	catch(error)
	{
	}
	try
	{
		WCreate.Close(0);
	}
	catch(error)
	{
	}
	SMessage = TMessage;
	SOrigin = SOrigin;
	WMessage = MsgPlus.CreateWnd("Windows.xml", "WndMessage", 0);
 	WMessage.SetControlText("EdtMessage", SMessage);
 	WMessage.SetControlText("EdtEmail", SOrigin);
}

function OnClCrNToastEvent_Clicked()
{
	try
	{
		WCreate.Close(0);
	}
	catch(error)
	{
	}
	WMessage = MsgPlus.CreateWnd("Windows.xml", "WndCreate", 0);
 	Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkNew"), 0);
	Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkForward"), 0);
}

function OnClCrFToastEvent_Clicked()
{
	try
	{
		WCreate.Close(0);
	}
	catch(error)
	{
	}
	WMessage = MsgPlus.CreateWnd("Windows.xml", "WndCreate", 0);
	WCreate.SetControlText("EdtMessage", "--> Original message from " + SOrigin + ":\n" + SMessage);
 	Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkNew"), 0);
	Interop.Call("user32","EnableWindow", WMessage.GetControlHandle("LnkForward"), 0);
}

function OnWndAboutEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "BtnOk":
			objWnd.Close(0);
			break;
	}
}
