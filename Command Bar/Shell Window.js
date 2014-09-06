function OnWndCommandBar_ShellEvent_Destroyed(PlusWnd, ExitCode)
{
	IntCurrentChild = -1;
}

function OnWndCommandBar_ShellEvent_MessageNotification(PlusWnd, Message, wParam, lParam)
{
	if (Message == 0x5)
	{
		var TmpPosInfo = new Object();
		TmpPosInfo.X = PlusWnd.GetElementPos("PlhChild", POSINFO_X);
		TmpPosInfo.Y = PlusWnd.GetElementPos("PlhChild", POSINFO_Y);
		TmpPosInfo.Width = PlusWnd.GetElementPos("PlhChild", POSINFO_WIDTH);
		TmpPosInfo.Height = PlusWnd.GetElementPos("PlhChild", POSINFO_HEIGHT);
		if (IntCurrentChild == 0)
		{
			Interop.Call("user32", "SetWindowPos", WndCommandBar_CMain.Handle, 0, 0, 0, TmpPosInfo.Width, TmpPosInfo.Height, 0x10 | 0x2);
		}
		else
		{
			Interop.Call("user32", "SetWindowPos", WndCommandBar_CList.Handle, 0, 0, 0, TmpPosInfo.Width, TmpPosInfo.Height, 0x10 | 0x2);
		}
	}
	else if (Message == 0x100)
	{
		if (wParam === 0xD) 
		{   
			OnWndCommandBar_ShellEvent_CtrlClicked(WndCommandBar_CMain, "BtnOk");
			return 1;
		}
	}
	return -1;
}

function OnWndCommandBar_ShellEvent_CtrlClicked(PlusWnd, ControlId)
{
	if (IntCurrentChild == 0)
	{
		StrStoredCmd = WndCommandBar_CMain.GetControlText("EdtCmd");
		WndCommandBar_CMain.SetControlText("EdtCmd", "Processing...");
		var TmpCmdOK = true;
		if (StrStoredCmd == "")
		{
			Error("Enter a command into the box.  Press the first button to get a list of available commands, or press the second to grab a contact's email address.")
			TmpCmdOK = false;
		}
		else
		{
			if (/\+([^ ]+)/.exec(StrStoredCmd) !== null)
			{
				var TmpIdentifier = RegExp.$1.toLowerCase();
				TmpAction = ReadRegistry("Shortcuts\\" + TmpIdentifier);
				if (TmpAction == null)
				{
					Error("The shortcut \"+" + TmpIdentifier + "\" is not recognized.  You can register it using \"cut(a) " + TmpIdentifier + "|<action>\".");
					TmpCmdOK = false;
				}
				else
				{
					StrStoredCmd = TmpAction;
				}
			}
			if (/(^[a-zA-Z]+)\(([a-zA-Z|]*)\)( [^ ]+)?/.exec(StrStoredCmd) !== null)
			{
		  		var TmpFunction = RegExp.$1.toLowerCase();
		  		var TmpFlags = RegExp.$2.toLowerCase();
		  		TmpFlags = Unduplicate(TmpFlags.split(""));
		  		var TmpParameter = RegExp.$3;
		  		TmpParameter = TmpParameter.substr(1, TmpParameter.length);
				switch (TmpFunction)
				{
					case "block":
						var TmpContact = Messenger.MyContacts.GetContact(TmpParameter.split(" ").join(""));
						try
						{
							TmpContact.Blocked = !TmpContact.Blocked;
						}
						catch (error)
						{
							Error("== Error from function: Block ==\n\nContact fetch failed.");
							TmpCmdOK = false;
						}
						break;
					case "info":
						if (TmpFlags[0] != undefined)
						{
							Alert("== Warning from function: Information ==\n\nFlags not supported with this function.");
						}
						switch (TmpParameter.toLowerCase())
						{
							case "ver": case "version":
								Alert("Command Bar: " + VERSION + "\n\nWindows Live Messenger: " + Messenger.Version + " (" + Messenger.VersionBuild + ")\nMessenger Plus! Live: " + (MsgPlus.Version + "").substr(0, 4) + " (" + MsgPlus.VersionBuild + ")");
								break;
							case "chats":
								var TmpChatWnds = Messenger.CurrentChats;
								var TmpCount = TmpChatWnds.Count;
								var TmpMessage = "Number of open windows: " + TmpCount;
								if (TmpCount > 0)
								{
									TmpMessage += "\n";
									var TmpChatWndE = new Enumerator(TmpChatWnds);
									for(; !TmpChatWndE.atEnd(); TmpChatWndE.moveNext())
									{
										var TmpChatWndO = TmpChatWndE.item();
										if (TmpChatWndO.Contacts.Count == 1)
										{
											TmpMessage += "\n> Single conversation: ";
										}
										else
										{
											TmpMessage += "\n> Group conversation: ";
										}
										var TmpChatWndContactA = new Array();
										var TmpChatWndContacts = TmpChatWndO.Contacts;
										var TmpChatWndContactE = new Enumerator(TmpChatWndContacts);
										for(; !TmpChatWndContactE.atEnd(); TmpChatWndContactE.moveNext())
										{
											var TmpChatWndContactO = TmpChatWndContactE.item();
											TmpChatWndContactA.push(TmpChatWndContactO.Email);
										}
										TmpMessage += TmpChatWndContactA.join(", ");
									}
								}
								Alert(TmpMessage);
								break;
							case "":
								Error("== Error from function: Information ==\n\nNo parameter specified.");
								TmpCmdOK = false;
								break;
							default:
								var TmpChatWnd = Messenger.OpenChat(TmpParameter.split(" ").join(""));
								try
								{
									TmpChatWnd.SendMessage("/ctcinfo");
								}
								catch (error)
								{
									Error("== Error from function: Information ==\n\nContact fetch failed.\nNote: the user must not be blocked.");
									TmpCmdOK = false;
								}
								break;
						}
						break;
					case "msg":
						var TmpParameters = TmpParameter.split("|");
						var TmpChatWnd = Messenger.OpenChat(TmpParameters[0].split(" ").join(""));
						try
						{
							TmpChatWnd.SendMessage("");
							if (TmpParameters.length == 2)
							{
								TmpChatWnd.SendMessage(TmpParameters[1]);
							}
							for (var X in TmpFlags)
							{
								switch (TmpFlags[X])
								{
									case "c":
										Interop.Call("user32", "SendMessageW", TmpChatWnd.Handle, 0x10, 0, 0);
										break;
									default:
										Alert("== Warning from function: Message ==\n\nUnknown flag specified: \"" + TmpFlags[X] + "\".");
										break;
								}
							}
						}
						catch (error)
						{
							Error("== Error from function: Message ==\n\nConversation window creation failed.\nNote: the user must not be blocked.");
							TmpCmdOK = false;
							try
							{
								Interop.Call("user32", "SendMessageW", TmpChatWnd.Handle, 0x10, 0, 0);
							}
							catch (error)
							{
							}
						}
						break;
					case "name":
						var TmpNewName = TmpParameter;
						for (var X in TmpFlags)
						{
							switch (TmpFlags[X])
							{
								case "a":
									TmpNewName = Messenger.MyName + TmpNewName;
									break;
								default:
									Alert("== Warning from function: Name ==\n\nUnknown flag specified: \"" + TmpFlags[X] + "\".");
									break;
							}
						}
						Messenger.MyName = TmpNewName;
						break;
					case "psm":
						var TmpNewPSM = TmpParameter;
						for (var X in TmpFlags)
						{
							switch (TmpFlags[X])
							{
								case "a":
									TmpNewPSM = Messenger.MyPersonalMessage + TmpNewPSM;
									break;
								default:
									Alert("== Warning from function: PSM ==\n\nUnknown flag specified: \"" + TmpFlags[X] + "\".");
									break;
							}
						}
						Messenger.MyPersonalMessage = TmpNewPSM;
						break;
					case "status":
						if (TmpFlags[0] != undefined)
						{
							Alert("== Warning from function: Status ==\n\nFlags not supported with this function.");
						}
						if (TmpParameter == "idle" || TmpParameter == 6)
						{
							Alert("== Warning from function: Status ==\n\nYou cannot set your status to idle.\nThe away status will be used instead.");
						}
						if (isNaN(TmpParameter))
						{
							switch (TmpParameter.toLowerCase())
							{
								case "appear offline": case "offline": case "off": case "invisible":
									Messenger.MyStatus = 2;
									break;
								case "online": case "on": case "available":
									Messenger.MyStatus = 3;
									break;
								case "busy":
									Messenger.MyStatus = 4;
									break;
								case "be right back": case "brb":
									Messenger.MyStatus = 5;
									break;
								case "away": case "idle":
									Messenger.MyStatus = 7;
									break;
								case "in a call": case "on the phone": case "call": case "phone":
									Messenger.MyStatus = 8;
									break;
								case "out to lunch": case "lunch":
									Messenger.MyStatus = 9;
									break;
								default:
									Error("== Error from function: Status ==\n\nInvalid identifier specified.");
									break;
							}
						}
						else if (TmpParameter > 1 && TmpParameter < 10)
						{
							if (TmpParameter == 6)
							{
								TmpParameter = 7;
							}
							Messenger.MyStatus = TmpParameter;
						}
						else
						{
							Error("== Error from function: Status ==\n\nInvalid identifier specified.");
							TmpCmdOK = false;
						}
						break;
					case "lock":
						if (TmpFlags[0] != undefined)
						{
							Alert("== Warning from function: Lock ==\n\nFlags not supported with this function.");
						}
						MsgPlus.LockMessenger(true);
						break;
					case "out":
						if (TmpFlags[0] != undefined)
						{
							Alert("== Warning from function: Sign-out ==\n\nFlags not supported with this function.");
						}
						Messenger.Signout();
						break;
					case "cut":
						var TmpParameters = TmpParameter.split("|");
						TmpParameters[0] = TmpParameters[0].split(" ").join("");
						if ((TmpParameters[0] == undefined || TmpParameters[0] == "") && TmpFlags[0] != undefined)
						{
							Error("== Error from function: Shortcut ==\n\nNo identifier specified.");
							TmpCmdOK = false;
						}
						else if (TmpFlags[0] == "a" && (TmpParameters[1] == undefined || TmpParameters[1] == ""))
						{
							Error("== Error from function: Shortcut ==\n\nNo action specified.");
							TmpCmdOK = false;
							break;
						}
						else switch (TmpFlags[0])
						{
							case "a":
								WriteRegistry("Shortcuts\\" + TmpParameters[0], TmpParameters[1], true);
								Alert("Shortcut \"+" + TmpParameters[0] + "\" (with action \"" + TmpParameters[1] + "\") registered successfully.");
								break;
							case "r":
								try
								{
									DeleteRegistry("Shortcuts\\" + TmpParameters[0]);
									Alert("Shortcut \"+" + TmpParameters[0] + "\" unregistered successfully.");
								}
								catch (error)
								{
									Error("== Error from function: Shortcut ==\n\nUnrecognized identifier: \"" + TmpParameters[0] + "\".");
									TmpCmdOK = false;
								}
								break;
							case undefined:
								Error("== Error from function: Shortcut ==\n\nNo flag specified.");
								TmpCmdOK = false;
								break;
							default:
								Error("== Error from function: Shortcut ==\n\nUnknown flag specified: \"" + TmpFlags[0] + "\".");
								TmpCmdOK = false;
								break;
						}
						break;
					case "help":
						Help(TmpParameter.toLowerCase());
						break;
					default:
						Error("The command \"" + StrStoredCmd + "\" is not recognised.  Check that you haven't spelt anything incorrectly, and refer to the guide for full command instructions (to view the guide, enter \"help()\" as a command).");
						TmpCmdOK = false;
						break;
				}
			}
			else
			{
				var TmpAddress = StrStoredCmd.split(" ");
				TmpAddress = TmpAddress[0];
				var TmpMatch = false;
				var TmpContacts = Messenger.MyContacts;
				for (var TmpEnum = new Enumerator(TmpContacts); !TmpEnum.atEnd(); TmpEnum.moveNext())
				{
					if (TmpEnum.item().Email == TmpAddress)
					{
						TmpMatch = true;
						break;
					}
				}
				if (TmpMatch)
				{
					Messenger.OpenChat(TmpAddress);
				}
				else if (TmpCmdOK)
				{
					Error("The command \"" + StrStoredCmd + "\" is invalid.  Check that you haven't spelt anything incorrectly, and refer to the guide for full command instructions (to view the guide, enter \"help()\" as a command).");
					TmpCmdOK = false;
				}
			}
		}
	}
	else
	{
		var TmpSelection = WndCommandBar_CList.Combo_GetCurSel("CmbList");
		if (TmpSelection > -1)
		{
			switch (IntCurrentChild)
			{
				case 1:
					TmpSelection = ArrCommands[WndCommandBar_CList.Combo_GetCurSel("CmbList")][1] + "()";
					break;
				case 2:
					TmpSelection = ArrContacts[WndCommandBar_CList.Combo_GetCurSel("CmbList")].Email;
					break;
			}
		}
		else
		{
			TmpSelection = "";
		}
		WndCommandBar_CList.Close(0);
		WndCommandBar_CMain = MsgPlus.CreateChildWnd(WndCommandBar_Shell, "Windows.xml", "WndCommandBar_CMain", 12, 2);
		IntCurrentChild = 0;
		OnWndCommandBar_ShellEvent_MessageNotification(WndCommandBar_Shell, 0x5);
		if (StrStoredCmd.charAt(StrStoredCmd.length - 1) != " " && TmpSelection != "" && StrStoredCmd != "")
		{
			StrStoredCmd += " ";
		}
		WndCommandBar_CMain.SetControlText("EdtCmd", StrStoredCmd + TmpSelection);
		return;
	}
	if (TmpCmdOK)
	{
		StrStoredCmd = "";
	}
	WndCommandBar_CMain.SetControlText("EdtCmd", StrStoredCmd);
	Interop.Call("user32.dll", "SetFocus", WndCommandBar_CMain.GetControlHandle("EdtCmd"));
}
