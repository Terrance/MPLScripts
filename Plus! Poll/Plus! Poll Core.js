function GeneratePoll(Question, Answer, Voters)
{
	var ID = Math.floor(Math.random() * 1000000000000);
	var Message = "!poll.ask " + ID + " \"" + Question + "\" ";
	switch (Answer)
	{
		case "true":
		case "yes":
		case "number":
		case "prompt":
			Message += Answer;
			break;
		default:
			Message += "\"" + Answer.join("|") + "\"";
			break;
	}
	Debug.Trace(">> New poll: " + Message);
	Message += "\n\nYou don't appear to have Plus! Poll installed, so you will need to respond using the following command:\n!poll.answer " + ID + " \"";
	switch (Answer)
	{
		case "true":
			Message += "True!/False!";
			break;
		case "yes":
			Message += "Yes!/No!";
			break;
		case "number":
			Message += "<number>";
			break;
		case "prompt":
			Message += "<answer>";
			break;
		default:
			Message += Answer.join("/");
			break;
	}
	Message += "\"" + Space;
	var Count = 0;
	BlockCommands = false;
	switch (Voters)
	{
		case "chats":
			var Chats = Messenger.CurrentChats;
			for (var Enum = new Enumerator(Chats); !Enum.atEnd(); Enum.moveNext())
			{
				var Chat = Enum.item();
				Chat.SendMessage(Message);
				Count++;
			}
			break;
		case "all":
			var Contacts = Messenger.MyContacts;
			for (var Enum = new Enumerator(Contacts); !Enum.atEnd(); Enum.moveNext())
			{
				var Contact = Enum.item();
				if (!Contact.IsBlocked)
				{
					var Chat = Messenger.OpenChat(Contact.Email);
					Chat.SendMessage(Message);
					Count++;
				}
			}
			break;
		case "online":
			var Contacts = Messenger.MyContacts;
			for (var Enum = new Enumerator(Contacts); !Enum.atEnd(); Enum.moveNext())
			{
				var Contact = Enum.item();
				if (Contact.Status >= 3 && !Contact.IsBlocked)
				{
					var Chat = Messenger.OpenChat(Contact.Email);
					Chat.SendMessage(Message);
					Count++;
				}
			}
			break;
		default:
			for (var X in Voters)
			{
				try
				{
					var Ok = true;
					if (Messenger.MyContacts.GetContact(Voters[X]) === null)
					{
						Ok = ConfirmDialog("The contact \"" + Voters[X] + "\" is not in your contact list.\nAre you sure you want to send them the poll?", "Create a new poll...", WndNew);
					}
					if (Ok)
					{
						var Chat = Messenger.OpenChat(Voters[X]);
						Chat.SendMessage(Message);
						Count++;
					}
				}
				catch (error)
				{
					ErrorDialog("The contact \"" + Voters[X] + "\" was unable to receive a poll invitation.", "Create a new poll...", WndNew);
				}
			}
			break;
	}
	BlockCommands = true;
	if (Count > 0)
	{
		CurrentPolls[ID] = new Object();
		CurrentPolls[ID].Question = Question;
		CurrentPolls[ID].Answer = Answer;
		CurrentPolls[ID].Voters = Voters;
		CurrentPolls[ID].Results = new Array();
		InfoDialog("The poll \"" + Question + "\" has been successfully created, sent to " + Count + " people!\n\nPeople with the script will be prompted with a form to fill in.\nOthers can respond using this command: !poll.answer " + ID + " \"Answer.\"", "Create a new poll...", WndNew);
		try
		{
			WndNew.Close(0);
		}
		catch (error)
		{
		}
	}
	else
	{
		ErrorDialog("The new poll was not created, because nobody has successfully received it!", "Create a new poll...", WndNew);
	}
}

function AnswerPoll(From, ID, Answer)
{
	var Message = "!poll.answer " + ID + " \"" + Answer + "\"";
	Debug.Trace(">> New answer: " + Message);
	Message += "\n\nYou don't appear to have Plus! Poll installed, so you can probably disregard this information." + Space;
	From = From.split(", ");
	BlockCommands = false;
	for (var X in From)
	{
		var Chat = Messenger.OpenChat(From[X]);
		Chat.SendMessage(Message);
	}
	BlockCommands = true;
	try
	{
		WndPoll[ID].Close(0);
	}
	catch (error)
	{
	}
}
