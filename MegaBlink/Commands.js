function OnGetScriptCommands()
{
	var ScriptCommands = "<ScriptCommands>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.all</Name>";
	ScriptCommands +=  "	<Description>" + (Blink.Name || Blink.PSM || Blink.DP || Blink.Status ? "Dis" : "En") + "able mega-blinking (name, PSM, DP and status blinking).</Description>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.name</Name>";
	ScriptCommands +=  "	<Description>" + (Blink.Name ? "Dis" : "En") + "able name blinking.</Description>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.name.to</Name>";
	ScriptCommands +=  "	<Description>Change the name to show when 'blinking'.\nCurrent setting: \"" + Store.Name.To + "\"</Description>";
	ScriptCommands +=  "	<Parameters>[name to change to]</Parameters>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.psm</Name>";
	ScriptCommands +=  "	<Description>" + (Blink.PSM ? "Dis" : "En") + "able PSM blinking.</Description>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.psm.to</Name>";
	ScriptCommands +=  "	<Description>Change the PSM to show when 'blinking'.\nCurrent setting: \"" + Store.PSM.To + "\"</Description>";
	ScriptCommands +=  "	<Parameters>[PSM to change to]</Parameters>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.dp</Name>";
	ScriptCommands +=  "	<Description>" + (Blink.DP ? "Dis" : "En") + "able DP blinking.</Description>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.dp.to</Name>";
	ScriptCommands +=  "	<Description>Change the DP to show when 'blinking'.\nCurrent setting: \"" + Store.DP.To + "\"</Description>";
	ScriptCommands +=  "	<Parameters>[DP to change to]</Parameters>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.status</Name>";
	ScriptCommands +=  "	<Description>" + (Blink.Status ? "Dis" : "En") + "able status blinking.</Description>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.status.to</Name>";
	ScriptCommands +=  "	<Description>Change the status to show when 'blinking'.\nCurrent setting: " + Store.Status.To + "</Description>";
	ScriptCommands +=  "	<Parameters>[status to change to]</Parameters>";
	ScriptCommands +=  "</Command>";
	ScriptCommands +=  "<Command>";
	ScriptCommands +=  "	<Name>mb.time</Name>";
	ScriptCommands +=  "	<Description>Change the amount of time between 'blinks'.\nCurrent setting: " + (Blink.Time / 1000) + " seconds.</Description>";
	ScriptCommands +=  "</Command>";
	return ScriptCommands + "</ScriptCommands>";
}

function OnEvent_ChatWndSendMessage(oChatWnd, sMessage)
{
	if (/^\/([^\s\/]+)\s*([\s\S]*)$/.exec(sMessage) !== null)
	{
		var Command = RegExp.$1.toLowerCase();
		Command = Command.split(".");
		var Parameter = RegExp.$2;
		if (Command[0] === "mb")
		{
			switch (Command[1])
			{
				case "all":
					if (Blink.Name || Blink.PSM || Blink.DP || Blink.Status)
					{
						Blink.Name = Blink.PSM = Blink.DP = Blink.Status = false;
						Messenger.MyName = Store.Name.Old;
						Messenger.MyPersonalMessage = Store.PSM.Old;
						Messenger.MyDisplayPicture = Store.DP.Old;
						Messenger.MyStatus = Store.Status.Old;
					}
					else
					{
						Blink.Name = Blink.PSM = Blink.DP = Blink.Status = true;
						Store.Name.Old = Messenger.MyName;
						Store.PSM.Old = Messenger.MyPersonalMessage;
						Store.DP.Old = Messenger.MyDisplayPicture;
						Store.Status.Old = Messenger.MyStatus;
					}
					MsgPlus.DisplayToast(NAME, "Mega-blinking has been " + (Blink.Name ? "en" : "dis") + "abled.");
					break;
				case "name":
					if (Command[2] === "to")
					{
						Store.Name.To = Parameter;
						MsgPlus.DisplayToast(NAME, "The name blink text is now set as\n\"" + Store.Name.To + "\".");
					}
					else
					{
						Blink.Name = !Blink.Name;
						MsgPlus.DisplayToast(NAME, "Name blinking has been " + (Blink.Name ? "en" : "dis") + "abled.");
						if (Blink.Name)
						{
							Store.Name.Old = Messenger.MyName;
						}
						else
						{
							Messenger.MyName = Store.Name.Old;
						}
					}
					break;
				case "psm":
					if (Command[2] === "to")
					{
						Store.PSM.To = Parameter;
						MsgPlus.DisplayToast(NAME, "The PSM blink text is now set as\n\"" + Store.PSM.To + "\".");
					}
					else
					{
						Blink.PSM = !Blink.PSM;
						MsgPlus.DisplayToast(NAME, "PSM blinking has been " + (Blink.PSM ? "en" : "dis") + "abled.");
						if (Blink.PSM)
						{
							Store.PSM.Old = Messenger.MyPersonalMessage;
						}
						else
						{
							Messenger.MyPersonalMessage = Store.PSM.Old;
						}
					}
					break;
				case "dp":
					if (Command[2] === "to")
					{
						Store.DP.To = Parameter;
						MsgPlus.DisplayToast(NAME, "The DP blink path is now set as\n\"" + Store.DP.To + "\".");
					}
					else
					{
						Blink.DP = !Blink.DP;
						MsgPlus.DisplayToast(NAME, "DP blinking has been " + (Blink.DP ? "en" : "dis") + "abled.");
						if (Blink.DP)
						{
							Store.DP.Old = Messenger.MyDisplayPicture;
						}
						else
						{
							Messenger.MyDisplayPicture = Store.DP.Old;
						}
					}
					break;
				case "status":
					if (Command[2] === "to")
					{
						if (!isNaN(Parameter) && Parameter >= 2 && Parameter < 10)
						{
							Parameter = Math.floor(Parameter);
							Store.Status.To = Parameter;
							MsgPlus.DisplayToast(NAME, "The status blink is now set as " + Store.Status.To + ".");
						}
					}
					else
					{
						Blink.Status = !Blink.Status;
						MsgPlus.DisplayToast(NAME, "Status blinking has been " + (Blink.Status ? "en" : "dis") + "abled.");
						if (Blink.Status)
						{
							Store.Status.Old = Messenger.MyStatus;
						}
						else
						{
							Messenger.MyStatus = Store.Status.Old;
						}
					}
					break;
				case "time":
					if (!isNaN(Parameter) && Parameter >= 6)
					{
						Blink.Time = Parameter * 1000;
						MsgPlus.DisplayToast(NAME, "The time between blinks\nis now set as " + (Blink.Time / 1000) + " seconds.");
					}
					break;
			}
			Debug.Trace("| Settings changed, reloading timer...");
			OnEvent_Timer();
			return "";
		}
	}
}
