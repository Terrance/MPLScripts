function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MsgKind)
{
	if (Origin === Messenger.MyName)
	{
		if (Message.substr(0, 9).toLowerCase() === "!poll.ask")
		{
			if (/^\!poll\.ask ([0-9]{1,12}) \"([^ ]+?)\" (true|yes|number|prompt|\"[^ ]+\")/.exec(Message) !== null)
			{
				var ID = RegExp.$1;
				var Question = RegExp.$2;
				return "[b]Plus! Poll[/b] | Your poll: \"" + Question + "\" (ID: " + ID + ")";
			}
		}
		else if (Message.substr(0, 12).toLowerCase() === "!poll.answer")
		{
			if (/^!poll\.answer ([0-9]+?) \"([^ ]+?)\"/.exec(Message) !== null)
			{
				var ID = (RegExp.$1 * 1);
				var Answer = RegExp.$2;
				return "[b]Plus! Poll[/b] | Your answer: \"" + Answer + "\" (ID: " + ID + ")";
			}
		}
		else if (Message.substr(0, 10).toLowerCase() === "!poll.ping")
		{
			return "[b]Plus! Poll[/b] | Ping request...";
		}
	}
	else
	{
		if (Message.substr(0, 9).toLowerCase() === "!poll.ask")
		{
			if (IncomingPolls)
			{
				if (/^\!poll\.ask ([0-9]{1,12}) \"([^ ]+?)\" (true|yes|number|prompt|\"[^ ]+\")/.exec(Message) === null)
				{
					InfoDialog("The supplied details for the received poll are invalid.\nAsk your contact to check that the message format is correct.", "Participate in a poll...", ChatWnd);
				}
				else
				{
					var From = new Array();
					var Contacts = ChatWnd.Contacts;
					for (var Enum = new Enumerator(Contacts); !Enum.atEnd(); Enum.moveNext())
					{
						var Contact = Enum.item();
						if (Contact.Name === Origin)
						{
							From.push(Contact);
						}
					}
					var ID = RegExp.$1;
					var Question = RegExp.$2;
					var Answer = RegExp.$3;
					BuildWnd("WndPoll", ID, Question, Answer, From);
					return "[b]Plus! Poll[/b] | Incoming poll: \"" + Question + "\" (ID: " + ID + ")";
				}
			}
			else
			{
				if (/^\!poll\.ask ([0-9]{1,12}) \"([^ ]+?)\" (true|yes|number|prompt|\"[^ ]+\")/.exec(Message) === null)
				{
					InfoDialog("The supplied details for the received poll are invalid.\nAsk your contact to check that the message format is correct.", "Participate in a poll...", ChatWnd);
				}
				else
				{
					var ID = RegExp.$1;
					var Question = RegExp.$2;
					MsgPlus.DisplayToastContact(NAME, "[b][c=4]Incoming poll [u]missed[/u]![/b][/c]", "You have missed a poll from:\n" + MsgPlus.RemoveFormatCodes(Origin));
					return "[b]Plus! Poll[/b] | Missed poll: \"" + Question + "\" (ID: " + ID + ")";
				}
			}
		}
		else if (Message.substr(0, 12).toLowerCase() === "!poll.answer")
		{
			if (/^!poll\.answer ([0-9]+?) \"([^ ]+?)\"/.exec(Message) === null)
			{
				InfoDialog("The supplied details for the received answer are invalid.\nAsk your contact to check that the message format is correct.", "Receive a poll response...", ChatWnd);
			}
			else
			{
				var ID = (RegExp.$1 * 1);
				var Answer = RegExp.$2;
				if (CurrentPolls[ID] === undefined)
				{
					InfoDialog("The supplied ID for the received answer doesn't exist or has expired.\nAsk your contact to check that the ID is correct.", "Receive a poll response...", ChatWnd);
				}
				else
				{
					var From = new Array();
					var Contacts = ChatWnd.Contacts;
					for (var Enum = new Enumerator(Contacts); !Enum.atEnd(); Enum.moveNext())
					{
						var Contact = Enum.item();
						if (Contact.Name === Origin)
						{
							From.push(Contact.Email);
						}
					}
					var Question = CurrentPolls[ID].Question;
					MsgPlus.DisplayToastContact(NAME, Origin, "Question: " + Question + "\nAnswer: " + Answer);
					switch (From.length)
					{
						case 0:
							ErrorDialog("An internal error has occured whilst checking the sender.\nThis can occur if the contact is appearing offline.\n\nAsk the contact to send the poll again.", "Participate in a poll...");
							return;
						case 1:
							CurrentPolls[ID].Results[From] = Answer;
							break;
						default:
							AlertDialog("Because this poll was sent to you in a group conversation, and two or more contacts share the same name, it is not possible to work out the sender of the poll.\n\nTherefore, the answer will be stored as from all of the contacts.", "The poll results...", ChatWnd);
							CurrentPolls[ID].Results[From.join(", ")] = Answer;
							break;
					}
					return "[b]Plus! Poll[/b] | Incoming answer: \"" + Answer + "\" (question: \"" + Question + "\", ID: " + ID + ")";
				}
			}
		}
		else if (Message.substr(0, 10).toLowerCase() === "!poll.ping")
		{
			if (WaitingPing)
			{
				InfoDialog("Ping request successful!", "Ping...", ChatWnd);
			}
			else
			{
				BlockCommands = false;
				ChatWnd.SendMessage("!poll.ping" + Space);
				BlockCommands = true;
			}
			return "[b]Plus! Poll[/b] | Ping request.";
		}
	}
}
