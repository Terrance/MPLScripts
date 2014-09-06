function OnGetScriptCommands()
{
	var ScriptCommands = "<ScriptCommands>";
	ScriptCommands += "<Command>";
	ScriptCommands += "<Name>browser</Name>";
	ScriptCommands += "<Description>" + NAME + "\nOpen a new window...\nParameter: address</Description>";
	ScriptCommands += "<Parameters>[address]</Parameters>";
	ScriptCommands += "</Command>";
	return ScriptCommands += "</ScriptCommands>";
}

function OnEvent_ChatWndSendMessage(oChatWnd, sMessage)
{
	if (/^\/([^\s\/]+)\s*([\s\S]*)$/.exec(sMessage) !== null)
	{
		var Command = RegExp.$1.toLowerCase();
		var Parameter = RegExp.$2;
		switch (Command)
		{
			case "browser":
				Browser(Parameter);
				return "";
		}
	}
}

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MessageKind)
{
	var Address = /([A-z]*:\/\/|www\.)([^\"\'\`\\)\(<> ]+)/g;
	var Test = Address.exec(Message);
	if (Test !== null)
	{
		var Match = Test.toString().split(",");
		MsgPlus.DisplayToast(NAME, "Click here to display:\n" + Match[0], null, "Browser", Match[0]);
	}
}
