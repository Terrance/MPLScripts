function OnEvent_Initialize(MessengerStart)
{
	if (!MessengerStart)
	{
		OnEvent_Signin();
	}
}

function OnEvent_Signin(Email)
{
	if (ReadRegistry(null, "System\\FloaterOnLogin", false) == true)
	{
		LoadWindow_Floater();
	}
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	switch (sMenuId)
	{
		case "Manager":
			LoadWindow_Manager();
			break;
		case "Floater":
			LoadWindow_Floater();
			break;
	    	case "About":
			MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
			break;
		default:
			EnableProfile(parseInt(sMenuId.substr(8, sMenuId.length)));
			break;
	}
}

function OnEvent_ChatWndSendMessage(ChatWnd, Message)
{
	if (/^\/([^\s\/]+)\s*([\s\S]*)$/.exec(Message) !== null)
	{
		var Command = RegExp.$1.toLowerCase();
		var Parameter = RegExp.$2;
		switch (Command)
		{
			case "pp.manager":
			 	LoadWindow_Manager();
				return "";
			case "pp.enable":
				EnableProfile(parseInt(Parameter));
				return "";
			case "pp.disable":
				EnableProfile(0);
				return "";
		}
	}
	else if (SysProfileNo > 0)
	{
		if (ReadRegistry("Profiles", SysProfileNo + "\\EdtColour") != "")
		{
			return "[c=" + ReadRegistry("Profiles", SysProfileNo + "\\EdtColour") + "]" + Message + "[/c]";
		}
	}
}

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MsgKind)
{
	if (SysProfileNo > 0 && Origin != Messenger.MyName)
	{
		if (ReadRegistry("Profiles", SysProfileNo + "\\EdtAutoMessage") != "")
		{
			ChatWnd.SendMessage("AutoMessage: " + ReadRegistry("Profiles", SysProfileNo + "\\EdtAutoMessage"));
		}
	}
}
