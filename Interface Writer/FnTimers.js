/*
File: FnTimers.js
Manages Plus! timers for auto-saves and status bar updates.
*/

function OnEvent_Timer(TimerId)
{
	try
	{
		Debugging.Call("Timer", {"TimerId" : TimerId});
		switch (TimerId)
		{
			case "AutoSave":
				if (NowEditing === 1 && Registry.Read("Options\\ChkSaveMins") && FilePath !== "") // editor open, auto-save enabled and file path set?
				{
					SaveFile();
				}
				MsgPlus.AddTimer("AutoSave", Registry.Read("Options\\EdtSaveMins") * 60000);
				break;
			case "ResetStatus":
				var Message = WndWriterManageWindows.GetControlText("TxtStatusBar");
				var Time = Number(Message.charAt(Message.length - 2)) - 1;
				if (Time === 0)
				{
					OnWndWriterManageWindowsEvent_Status("Welcome to " + NAME + ", version " + VERSION + ".", 0); // default message
				}
				else
				{
					OnWndWriterManageWindowsEvent_Status(Message.substr(0, Message.length - 4), Time); // subtract 1 from time and display
				}
				break;
			case "WaitView":
				OnWndViewerManagerEvent_Build();
				break;
			default:
				if (TimerId.substr(0, 8) === "WaitLoad")
				{
					var Path = TimerId.split("|");
					var Result = LoadFile(Path[1]);
					if (Result === true) // yay, it worked!
					{
						NowEditing = 1;
						if (Path[2] === "Tmp")
						{
							FilePath = "";
							FSO.DeleteFile(TempFile + "2");
						}
						OnWndWriterManageWindowsEvent_Build();
						OnWndWriterManageWindowsEvent_Status((FilePath === "" ? "Unsaved file re" : "File \"" + FilePath + "\" ") + "loaded successfully.");
						break;
					}
					else
					{
						switch (Result[0])
						{
							case 1:
								OnWndWriterErrorsEvent_Build(Result[1], Result[2]);
								break;
							case 2:
								Dialog.Show("Load an interface...", Result[1], Dialog.Icon.Error, Dialog.Buttons.OK);
								OnEvent_Timer(TimerId);
								break;
						}
					}
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
