function OnEvent_Timer(TimerID)
{
	Debug.Trace("Instant Response  |  Timer completed!");
	if (setMsgPlusAM)
	{
		if (setnoteMesCmd)
		{
			Messenger.OpenChat(TimerID).SendMessage(settingMessage);
		}
		else
		{
			Messenger.OpenChat(TimerID).SendMessage("AutoMessage: " + settingMessage);
		}
	}
	else
	{
		Messenger.OpenChat(TimerID).SendMessage(settingMessage);
	}
	Debug.Trace("Instant Response  |  Message sent!");
}

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MessageKind)
{
	if (Origin != Messenger.MyName)
	{
		if (settingEnable)
		{
			Debug.Trace("Instant Response  |  Message received!");
			var Contacts = ChatWnd.Contacts; 
			var e = new Enumerator(Contacts); 
			for(; !e.atEnd(); e.moveNext())
			{ 
				var Contact = e.item(); 
				Debug.Trace("Instant Response  |  Email: " + Contact.Email + " (Stage 1)");
			}
			if (Message != settingMessage)
			{
				var Contacts = ChatWnd.Contacts; 
				var e = new Enumerator(Contacts);
				var NoContacts = 0; 
				for(; !e.atEnd(); e.moveNext())
	
				var Contact = e.item(); 
				Debug.Trace("Instant Response  |  Email: " + Contact.Email + " (Stage 2)");
				NoContacts = NoContacts + 1;
			}
			if (NoContacts == 1)
			{
				MsgPlus.AddTimer(Contact.Email, settingTimer);
				
			}
		}
		else
		{
			Debug.Trace("Instant Response  |  Message received!");
			Debug.Trace("Instant Response  |  Response disabled!");
		}
	}
}
