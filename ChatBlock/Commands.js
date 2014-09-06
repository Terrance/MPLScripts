function OnGetScriptMenu(nLocation)
{
	var ScriptMenu="<ScriptMenu>";
	
	if (SingleEnabled)
	{
		ScriptMenu += "<MenuEntry Id=\"UnblockSingle\">Unblock all single-participant conversation windows...</MenuEntry>";
	}
	else
	{
		ScriptMenu += "<MenuEntry Id=\"BlockSingle\">Block all single-participant conversation windows...</MenuEntry>";
	}
	
	if (GroupEnabled)
	{
		ScriptMenu += "<MenuEntry Id=\"UnblockGroup\">Unblock all multi-participant conversation windows...</MenuEntry>";
	}
	else
	{
		ScriptMenu += "<MenuEntry Id=\"BlockGroup\">Block all multi-participant conversation windows...</MenuEntry>";
	}
	
	if (SingleEnabled || GroupEnabled)
	{
		ScriptMenu += "<Separator/>";
		ScriptMenu += "<MenuEntry Id=\"OpenChat\">Open a conversation window... [override]</MenuEntry>";
	}
	
	ScriptMenu += "<Separator/>";
	ScriptMenu += "<MenuEntry Id=\"About\">About ChatBlock...</MenuEntry>";
	
	ScriptMenu += "</ScriptMenu>";
 
	return ScriptMenu;
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	switch (sMenuId)
	{
		case "UnblockSingle":
			SingleEnabled = false;
			MsgPlus.DisplayToast(NAME, "Single conversation\nblocking disabled.");
			Debug.Trace("-> Single conversation blocking disabled.");
			break;
		case "BlockSingle":
			SingleEnabled = true;
			MsgPlus.DisplayToast(NAME, "Single conversation\nblocking enabled.");
			Debug.Trace("-> Single conversation blocking enabled.");
			break;
		case "UnblockGroup":
			GroupEnabled = false;
			MsgPlus.DisplayToast(NAME, "Group conversation\nblocking disabled.");
			Debug.Trace("-> Group conversation blocking disabled.");
			break;
		case "BlockGroup":
			GroupEnabled = true;
			MsgPlus.DisplayToast(NAME, "Group conversation\nblocking enabled.");
			Debug.Trace("-> Group conversation blocking enabled.");
			break;
		case "OpenChat":
			MsgPlus.CreateWnd("Windows.xml", "WndOpenChat", 0);
			break;
		case "About":
			MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
			break;
	}
}

function OnGetScriptCommands()
{
	var ScriptCommands = "<ScriptCommands>";
	
	if (SingleEnabled)
	{
		ScriptCommands    += 	"<Command>";
		ScriptCommands    += 	"<Name>cb.singleblock</Name>";
		ScriptCommands    += 	"<Description>Unblock all single-participant conversation windows...</Description>";
		ScriptCommands    += 	"</Command>";
	}
	else
	{
		ScriptCommands    += 	"<Command>";
		ScriptCommands    += 	"<Name>cb.singleblock</Name>";
		ScriptCommands    += 	"<Description>Block all single-participant conversation windows...</Description>";
		ScriptCommands    += 	"</Command>";
	}
	
	ScriptCommands    += 	"<Command>";
	ScriptCommands    += 	"<Name>cb.singlemessage</Name>";
	ScriptCommands    += 	"<Description>Modify the message sent when blocking single-participant conversation windows...</Description>";
	ScriptCommands    += 	"<Parameters>[message]</Parameters>";
	ScriptCommands    += 	"</Command>";
	
	if (GroupEnabled)
	{
		ScriptCommands    += 	"<Command>";
		ScriptCommands    += 	"<Name>cb.groupblock</Name>";
		ScriptCommands    += 	"<Description>Unblock all group-participant conversation windows...</Description>";
		ScriptCommands    += 	"</Command>";
	}
	else
	{
		ScriptCommands    += 	"<Command>";
		ScriptCommands    += 	"<Name>cb.groupblock</Name>";
		ScriptCommands    += 	"<Description>Block all group-participant conversation windows...</Description>";
		ScriptCommands    += 	"</Command>";
	}
	
	ScriptCommands    += 	"<Command>";
	ScriptCommands    += 	"<Name>cb.groupmessage</Name>";
	ScriptCommands    += 	"<Description>Modify the message sent when blocking group-participant conversation windows...</Description>";
	ScriptCommands    += 	"<Parameters>[message]</Parameters>";
	ScriptCommands    += 	"</Command>";
		
	ScriptCommands    += "</ScriptCommands>";

	return ScriptCommands;
}

function OnEvent_ChatWndSendMessage(oChatWnd, sMessage)
{
	if (/^\/([^\s\/]+)\s*([\s\S]*)$/.exec(sMessage) !== null)
	{
		var Command = RegExp.$1.toLowerCase();
		var Parameter = RegExp.$2;
		switch (Command)
		{
			case 'cb.singleblock':
				if (SingleEnabled)
				{
					SingleEnabled = false;
					MsgPlus.DisplayToast(NAME, "Single conversation\nblocking disabled.")
					Debug.Trace("-> Single conversation blocking disabled.")
				}
				else
				{
					SingleEnabled = true;
					MsgPlus.DisplayToast(NAME, "Single conversation\nblocking enabled.")
					Debug.Trace("-> Single conversation blocking enabled.")
				}
				return "";	
			case 'cb.singlemessage':
				SingleMessage = Parameter;
				MsgPlus.DisplayToast(NAME, "Single conversation\nmessage saved.")
				Debug.Trace("-> Single conversation message saved.")
				return "";
			case 'cb.groupblock':
				if (GroupEnabled)
				{
					GroupEnabled = false;
					MsgPlus.DisplayToast(NAME, "Group conversation\nblocking disabled.")
					Debug.Trace("-> Group conversation blocking disabled.")
				}
				else
				{
					GroupEnabled = true;
					MsgPlus.DisplayToast(NAME, "Group conversation\nblocking enabled.")
					Debug.Trace("-> Group conversation blocking enabled.")
				}
				return "";
			case 'cb.groupmessage':
				GroupMessage = Parameter;
				MsgPlus.DisplayToast(NAME, "Group conversation\nmessage saved.")
				Debug.Trace("-> Group conversation message saved.")
				return "";
			}
	}
}
