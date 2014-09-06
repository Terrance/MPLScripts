function OnGetScriptCommands()
{
	var ScriptCommands = "<ScriptCommands>";
	
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.enable</Name>";
	ScriptCommands    +=         "<Description>Turn Instant Response on.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.disable</Name>";
	ScriptCommands    +=         "<Description>Turn Instant Response off.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.control</Name>";
	ScriptCommands    +=         "<Description>Open the Instant Response Control Centre.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.message</Name>";
	ScriptCommands    +=         "<Description>Change the Instant Response message.</Description>";
	ScriptCommands    +=         "<Parameters>(message text)</Parameters>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.timer</Name>";
	ScriptCommands    +=         "<Description>Change the Instant Response timer.</Description>";
	ScriptCommands    +=         "<Parameters>(timer length)</Parameters>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.pluson</Name>";
	ScriptCommands    +=         "<Description>Turn the Instant Response Plus! Style on.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.plusoff</Name>";
	ScriptCommands    +=         "<Description>Turn the Instant Response Plus! Style off.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.alerton</Name>";
	ScriptCommands    +=         "<Description>Turn the Instant Response sign-in alert on.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.alertoff</Name>";
	ScriptCommands    +=         "<Description>Turn the Instant Response sign-in alert off.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    +=     "<Command>";
	ScriptCommands    +=         "<Name>ir.status</Name>";
	ScriptCommands    +=         "<Description>Check the status of Instant Response.</Description>";
	ScriptCommands    +=     "</Command>";
	ScriptCommands    += "</ScriptCommands>";
	
	return ScriptCommands;
}

function OnEvent_ChatWndSendMessage(oChatWnd, sMessage)
{
	if (/^\/([^\s\/]+)\s*([\s\S]*)$/.exec(sMessage) !== null)
	{
		var command = RegExp.$1.toLowerCase();
		var parameter = RegExp.$2;
		switch (command)
		{
			case 'ir.enable':
			 	if (settingEnable)
				{
				}
				else
				{
					settingEnable = true;
					var Message = "Activation: enabled";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Activation: enabled");
				}
			return "";
			case 'ir.disable':
				if (settingEnable)
				{
					settingEnable = false;
					var Message = "Activation: disabled";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Activation: disabled");
				}
				return "";
			case 'ir.control':
				var setbuildWnd = MsgPlus.CreateWnd("Windows.xml", "WndControl", 0);
				setbuildWnd.SetControlText("EditMessage", settingMessage);
				setbuildWnd.SetControlText("EditTimer", settingTimer);
				setbuildWnd.Button_SetCheckState("ChkPlusAMStyle", setMsgPlusAM);
				setbuildWnd.Button_SetCheckState("ChkSignInAlert", setSignInAlert);
				return "";
			case 'ir.message':
				if (settingMessage==parameter)
				{
				}
				else if (parameter=="")
				{
					var Message = "New message was not set:\n message was left blank!";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  New message was not set: message was left blank!");	
				}
				else
				{
					settingMessage = parameter;
					var Message = "New message: " + settingMessage;
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  New message: " + settingMessage);
					setnoteMesCmd = (/^\/[^\s\/]+\s*[\s\S]*$/.test(parameter));
				}
				return "";
			case 'ir.timer':
				if (settingTimer==parameter)
				{
				}
				else if (parameter=="")
				{
					var Message = "New timer was not set:\n timer was left blank!";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  New timer was not set: timer was left blank!");	
				}
				else	if (parameter<100)
				{
					var Message = "New timer was not set:\ntimer was under 100ms!";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  New timer was not set: timer was under 100ms!");	
				}
				else if (typeof parseInt(parameter) === 'number' ? parseInt(parameter) : 0)
				{
					settingTimer = parameter;
					var Message = "New timer: " + settingTimer + "ms";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  New timer: " + settingTimer + " milliseconds");
				}
				else
				{
					var Message = "New timer was not set:\ntimer used invalid characters!";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  New timer was not set: timer used invalid characters!");	
				}
				return "";
			case 'ir.pluson':
				if(setMsgPlusAM)
				{
				}
				else
				{
					setMsgPlusAM = true;
					var Message = "Plus! Style: on";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Plus! Style: on");
				}
				return "";
			case 'ir.plusoff':
				if(setMsgPlusAM)
				{
					setMsgPlusAM = false;
					var Message = "Plus! Style: off";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Plus! Style: off");
				}
				return "";
			case 'ir.alerton':
				if(setSignInAlert)
				{
				}
				else
				{
					setSignInAlert = true;
					var Message = "Sign-in Alert: enabled";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Sign-in Alert: on");
				}
				return "";
			case 'ir.alertoff':
				if(setSignInAlert)
				{
					setSignInAlert = false;
					var Message = "Sign-in Alert: disabled";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Sign-in Alert: off");
				}
				return "";
			case 'ir.status':
				if (settingEnable)
				{
					var Message1 = "Message: " + settingMessage + "\nTimer: " + settingTimer + " milliseconds" + "\nPlus! Style: " 
					if (setMsgPlusAM) { var PMessage = "on" } else { var PMessage = "off" }
					var Message2 = "\nSign-in Alert: "
					if (setSignInAlert) { var SMessage = "on" } else { var SMessage = "off" }
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message1 + PMessage + Message2 + SMessage);
					Debug.Trace("Instant Response  |  Message: " + settingMessage);
					Debug.Trace("Instant Response  |  Timer: " + settingTimer + " milliseconds");
					if (setMsgPlusAM) {	Debug.Trace("Instant Response  |  Plus! style: " + setMsgPlusAM); }
					else { Debug.Trace("Instant Response  |  Plus! style: " + setMsgPlusAM); }
					if (setSignInAlert) { Debug.Trace("Instant Response  |  Sign-in Alert: " + setSignInAlert); }
					else { Debug.Trace("Instant Response  |  Sign-in Alert: " + setSignInAlert); }
				}
				else
				{
					var Message = "Unable to show the status.  You need to enable the script first!";
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Status check error.");
				}
				return "";
			default:
				return 0;
		}
	}
}
