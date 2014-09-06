Debug.Trace("-> Loading ChatBlock script...")

function OnEvent_Initialize(MessengerStart)
{
 	Debug.Trace("-> Welcome to ChatBlock!")
 	Debug.Trace("---> Settings for " + UserEmail + ":")
	Debug.Trace("-----> Single conversation block = " + SingleEnabled)
	Debug.Trace("-------> Single conversation message = \"" + SingleMessage + "\"")
	Debug.Trace("-----> Group conversation block = " + GroupEnabled)
	Debug.Trace("-------> Group conversation message = \"" + GroupMessage + "\"")
}

function OnEvent_ChatWndCreated(Wnd)
{
	Window = Wnd;
	WindowContacts = Wnd.Contacts;
	
	Debug.Trace("-> Conversation window opened!")	
	Debug.Trace("---> Conversation participant(s) = " + WindowContacts.Count);
		
	if (WindowContacts.Count==1)
	{
		Debug.Trace("---> Single conversation detected!")
		if (SingleEnabled==true)
		{
			Debug.Trace("---> Single conversation blocking is enabled!")
			if (SingleMessage=="")
			{
				Debug.Trace("---> No single conversation message setup...")
			}
			else
			{
				Window.SendMessage(SingleMessage);
				Debug.Trace("---> Single conversation message sent!")
			}
			Window.SendMessage("/close");
			MsgPlus.DisplayToast(NAME, "Single conversation blocked.")
			Debug.Trace("-----> Single conversation blocked!")
		}
		else
		{
			Debug.Trace("---> Single conversation blocking is disabled!")
		}
	}
	if (WindowContacts.Count>1)
	{
		Debug.Trace("---> Group conversation detected!")
		if (GroupEnabled==true)
		{
			Debug.Trace("---> Group conversation blocking is enabled!")
			if (GroupMessage=="")
			{
				Debug.Trace("---> No group conversation message setup...")
			}
			else
			{
				Window.SendMessage(GroupMessage);
				Debug.Trace("---> Group conversation message sent!")
			}
			Window.SendMessage("/close");
			MsgPlus.DisplayToast(NAME, "Group conversation blocked.")
			Debug.Trace("-----> Group conversation blocked!")
		}
		else
		{
			Debug.Trace("---> Group conversation blocking is disabled!")
		}
	}
}

function OnWndOpenChatEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "BtnOpen":
			var WindowContact = objWnd.GetControlText("EdtAddress");
			objWnd.Close(2);
			var SngEnChk = false;
			var GrpEnChk = false;
			if (SingleEnabled)
			{
				SngEnChk = true;
				SingleEnabled = false;
			}
			if (GroupEnabled)
			{
				GrpEnChk = true;
				GroupEnabled = false;
			}
			Messenger.OpenChat(WindowContact);
			if (SngEnChk)
			{
				SngEnChk = false;
				SingleEnabled = true;
			}
			if (GrpEnChk)
			{
				GrpEnChk = false;
				GroupEnabled = true;
			}
			Debug.Trace("-> Conversation window opened!")	
			Debug.Trace("---> Conversation participant(s) = " + WindowContact);
			break;
	}
}
