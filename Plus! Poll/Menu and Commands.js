function OnGetScriptMenu(Location)
{
	var Menu = "<ScriptMenu>";
	{
		Menu += "<MenuEntry Id=\"New\">Create a new poll...</MenuEntry>";
		Menu += "<MenuEntry Id=\"Incoming\">" + (IncomingPolls ? "Dis" : "En") + "able incoming polls</MenuEntry>";
		Menu += "<Separator/>";
		Menu += "<SubMenu Label=\"Your active polls\">";
		var Count = 0;
		for (var X in CurrentPolls)
		{
			var Poll = CurrentPolls[X];
			Menu += "<SubMenu Label=\"" + X + " | " + Poll.Question + "\">";
			{
				Menu += "<MenuEntry Id=\"" + X + "|Results\">View results</MenuEntry>";
				Menu += "<MenuEntry Id=\"" + X + "|End\">End poll...</MenuEntry>";
			}
			Menu += "</SubMenu>";
			Count++;
		}
		if (Count === 0)
		{
			Menu += "<MenuEntry Id=\"New\" Enabled=\"False\">(no polls)</MenuEntry>";
		}
		else
		{
			Menu += "<Separator/>";
			Menu += "<MenuEntry Id=\"EndAll\">End ALL polls...</MenuEntry>";
		}
		Menu += "</SubMenu>";
		Menu += "<Separator/>";
		Menu += "<MenuEntry Id=\"About\">About " + NAME + "...</MenuEntry>";
	}
	return Menu + "</ScriptMenu>";
}

function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	var Command = MenuItemId.split("|");
	switch (Command[0])
	{
		case "New":
			BuildWnd("WndNew");
			break;
		case "Incoming":
			IncomingPolls = !IncomingPolls;
			MsgPlus.DisplayToastContact(NAME, "[b][c=" + (IncomingPolls ? "3" : "4") + "]Polls have been [u]" + (IncomingPolls ? "en" : "dis") + "abled[/u]![/b][/c]", "The receiving of polls from other users has now been " + (IncomingPolls ? "en" : "dis") + "abled.");
			break;
		case "EndAll":
			if (ConfirmDialog("Are you sure that you want to end all active polls?\nContacts sending subsequent responses to any of the polls will be ignored."))
			{
				CurrentPolls = new Array();
				for (var ID in WndResults)
				{
					Interop.Call("user32", "EnableWindow", WndResults[ID].GetControlHandle("BtnEnd"), 0);
				}
			}
			break;
		case "About":
			InfoDialog(NAME + " (Version " + VERSION + ")\nBy Whiz @ WhizWeb Community\n(http://www.ww-c.co.nr)");
			break;
		default:
			var ID = parseInt(Command[0]);
			var Poll = CurrentPolls[ID];
			switch (Command[1])
			{
				case "Results":
					BuildWnd("WndResults", ID);
					break;
				case "End":
					if (ConfirmDialog("Are you sure that you want to end the poll \"" + Poll.Question + "\"?\nContacts sending subsequent responses to this poll will be ignored."))
					{
						delete CurrentPolls[ID];
						Interop.Call("user32", "EnableWindow", WndResults[ID].GetControlHandle("BtnEnd"), 0);
					}
					break;
			}
			break;
	}
}

function OnGetScriptCommands()
{
	var Commands = "<ScriptCommands>";
	{
		Commands += "<Command>";
		{
			Commands += "<Name>poll.new</Name>";
			Commands += "<Description>Plus! Poll\nCreate a new poll...\nParameters: \"Question.\" true/yes/number/prompt (OR) \"Option 1.|Option 2.|...\"] chats/all/online (OR) \"Contact 1.|Contact 2.|...\"</Description>";
			Commands += "<Parameters>\"Question.\" true/yes/number/prompt (OR) \"Option 1.|Option 2.|...\" chats/all/online (OR) \"Contact 1.|Contact 2.|...\"</Parameters>";
		}
		Commands += "</Command>";
		Commands += "<Command>";
		{
			Commands += "<Name>poll.incoming</Name>";
			Commands += "<Description>Plus! Poll\n" + (IncomingPolls ? "Dis" : "En") + "able incoming polls...</Description>";
		}
		Commands += "</Command>";
		Commands += "<Command>";
		{
			Commands += "<Name>poll.ping</Name>";
			Commands += "<Description>Plus! Poll\nSee if the contact has Plus! Poll installed.</Description>";
		}
		Commands += "</Command>";
	}
	return Commands + "</ScriptCommands>";
}

function OnEvent_ChatWndSendMessage(ChatWnd, Message)
{
	if (Message.substr(0, 5).toLowerCase() === "!poll" && BlockCommands)
	{
		ErrorDialog("You don't need to send these types of commands, since you have Plus! Poll installed.\nUse the interfaces provided instead, or use /commands for local functions.", "Using !commands...", ChatWnd);
		return "";
	}
	else if (Message.substr(0, 9).toLowerCase() === "/poll.new")
	{
		if (/^\/poll\.new \"([^ ]+?)\" (true|yes|number|prompt|\"[^\"]+\") (chats|all|online|\"[^\"]+\")$/.exec(Message) === null)
		{
			var Message = "The supplied details for the new poll are invalid.  Ensure you use the following command format.\n\n";
			Message += "Enter a question (in quotes), and then type ONE of the these (true, yes, number, prompt) OR enter a list of choices (in quotes, separated by pipe '|' characters).  Then type ONE of these (chats, all, online) OR enter a list of email addresses (in quotes, separated by pipe '|' characters).";
			InfoDialog(Message, "Create a new poll...", ChatWnd);
		}
		else
		{
			var Question = RegExp.$1;
			var Answer = RegExp.$2;
			var Voters = RegExp.$3;
			switch (Answer.toLowerCase())
			{
				case "true":
				case "yes":
				case "number":
				case "prompt":
					break;
				default:
					Answer = Answer.replace(/\"/g, "");
					Answer = Answer.split("|");
					break;
			}
			switch (Voters.toLowerCase())
			{
				case "chats":
				case "all":
				case "online":
					break;
				default:
					Voters = Voters.replace(/\"/g, "");
					Voters = Voters.split("|");
					break;
			}
			GeneratePoll(Question, Answer, Voters);
		}
		return "";
	}
	else switch (Message.toLowerCase())
	{
		case "/poll.incoming":
			IncomingPolls = !IncomingPolls;
			MsgPlus.DisplayToastContact(NAME, "[b][c=" + (IncomingPolls ? "3" : "4") + "]Polls have been [u]" + (IncomingPolls ? "en" : "dis") + "abled[/u]![/b][/c]", "The receiving of polls from other users has now been " + (IncomingPolls ? "en" : "dis") + "abled.");
			return "";
		case "/poll.ping":
			BlockCommands = false;
			ChatWnd.SendMessage("!poll.ping" + Space);
			BlockCommands = true;
			WaitingPing = true;
			return "";
	}
}
