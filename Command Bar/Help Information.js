function Help(Command)
{
	var TmpMessage = "";
	switch (Command)
	{
		case "block":
			TmpMessage += "== Command Usage: Block <block> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: block() email\n";
			TmpMessage += "Flags: (none)\n";
			TmpMessage += "Parameters: email (address of contact)\n";
			break;
		case "info":
			TmpMessage += "== Command Usage: Information <info> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: info() content\n";
			TmpMessage += "Flags: (none)\n";
			TmpMessage += "Parameters: content (email address OR 'version' OR 'chats')\n";
			TmpMessage += "Notes: for email address, the contact must not be blocked.\n";
			break;
		case "msg":
			TmpMessage += "== Command Usage: Message <msg> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: msg(c) email | message\n";
			TmpMessage += "Flags: c (close the conversation after)\n";
			TmpMessage += "Parameters: email (address of contact) | message (optional, message to send)\n";
			TmpMessage += "Notes: the contact must not be blocked.\n";
			break;
		case "name":
			TmpMessage += "== Command Usage: Name <name> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: name(a) text\n";
			TmpMessage += "Flags: a (add to existing name)\n";
			TmpMessage += "Parameters: text (to become the new name)\n";
			break;
		case "psm":
			TmpMessage += "== Command Usage: PSM <psm> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: psm(a) text\n";
			TmpMessage += "Flags: a (add to existing psm)\n";
			TmpMessage += "Parameters: text (to become the new PSM)\n";
			break;
		case "status":
			TmpMessage += "== Command Usage: Status <status> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: status() identifier\n";
			TmpMessage += "Flags: (none)\n";
			TmpMessage += "Parameters: identifier (name OR number of status)\n";
			break;
		case "lock":
			TmpMessage += "== Command Usage: Lock <lock> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: lock()\n";
			TmpMessage += "Flags: (none)\n";
			TmpMessage += "Parameters: (none)\n";
			break;
		case "out":
			TmpMessage += "== Command Usage: Sign-out <out> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: out()\n";
			TmpMessage += "Flags: (none)\n";
			TmpMessage += "Parameters: (none)\n";
			break;
		case "cut":
			TmpMessage += "== Command Usage: Shortcut <cut> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: cut(a/e/r) command\n";
			TmpMessage += "Flags: a (add) OR r (remove)\n";
			TmpMessage += "Parameters: identifier (to activate shortcut) [ | command (to perform on shortcut use) ]\n";
			break;
		case "help":
			TmpMessage += "== Command Usage: Help <help> ==\n";
			TmpMessage += "\n";
			TmpMessage += "Usage: help() command\n";
			TmpMessage += "Flags: (none)\n";
			TmpMessage += "Parameters: command (optional, command to get help with)\n";
			break;
		default:
			TmpMessage = "== Using the Command Bar ==\n";
			TmpMessage += "\n";
			TmpMessage += "Commands should be written in the following format: \"command(flags) parameter\"\n";
			TmpMessage += "Multiple parameters should be separated with a pipe, but multiple flags do not need separation.\n";
			TmpMessage += "\n";
			TmpMessage += "Using the two buttons on the left of the command bar, you can build a command from preset data.\n";
			TmpMessage += "Commands: click this button to get a list of all available commands\n";
			TmpMessage += "Contacts: click this button to get a list of all contacts in the contact list\n";
			TmpMessage += "\n";
			TmpMessage += "\n";
			TmpMessage += "== Available Commands ==\n";
			TmpMessage += "\n";
			TmpMessage += "Block <block>: (un)block a contact - flags: (none) / parameters: email\n";
			TmpMessage += "Information <info>: get contact information - flags: (none) / parameters: content\n";
			TmpMessage += "Message <msg>: send a message - flags: c <close after> / parameters: email | message [optional]\n";
			TmpMessage += "Name <name>: change your display name - flags: a <add to existing name> / parameter: text\n";
			TmpMessage += "PSM <psm>: change your personal message - flags: a <add to existing PSM> / parameter: text\n";
			TmpMessage += "Status <status>: change your status - flags: (none) / parameter: identifier\n";
			TmpMessage += "Lock <lock>: Lock Messenger - flags: (none) / parameters: (none)\n";
			TmpMessage += "Sign-out <out>: sign out of Messenger - flags: (none) / parameters: (none)\n";
			TmpMessage += "Shortcut <cut>: manage shortcuts - flags: a <add>, r <remove> / parameters: identifier | command [flag \"a\" only]\n";
			TmpMessage += "Help <help>: show the help guide - flags: (none) / parameter: command [optional]\n";
			TmpMessage += "\n";
			TmpMessage += "You can also start a conversation simply by entering an email address (they must be on your contact list, though).\n";
			TmpMessage += "\n";
			TmpMessage += "\n";
			TmpMessage += "== Working with Shortcuts ==\n";
			TmpMessage += "\n";
			TmpMessage += "Shortcuts allow you to shorten a command into a single word or phrase.\n";
			TmpMessage += "To manage your shortcuts, use the \"cut()\" command as mentioned above.\n";
			TmpMessage += "\n";
			TmpMessage += "Shortcut should be written using a plus followed by the identifier, like this: \"+identifier\".\n";
			TmpMessage += "The shortcut identifier may contain any characters, except spaces.  Identifiers are not case-sensitive.\n";
			TmpMessage += "The shortcut information is all stored, so flags and parameters do not need specifying.\n";
			break;
	}
	Alert(TmpMessage);
}
