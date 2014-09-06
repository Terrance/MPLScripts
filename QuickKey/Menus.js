function OnWndSubclassEvent_MessageNotification(PlusWnd, Message, wParam, lParam) // on the press of a hotkey
{
	if (Messenger.MyStatus > 1 && (!MsgPlus.MessengerIsLocked && SET_GLOBAL1 || !SET_GLOBAL1) /* && !QK_MNUOPN */) // if the user is signed in, Messenger Lock is disabled (if set to check) and no other menu is open
	{
		Debug.Trace("-> Building menu (" + wParam + ")...");
		QK_MNUOPN = true; // stop multiple menus
		var MNU_MAIN = Interop.Call("user32", "CreatePopupMenu"); // creates a new menu
		switch (wParam) // detect which menu to build
		{
			case MNU_CHATS:
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1, "== Messenger Conversations ==");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				var CHT_HIDE = false; // default value (not hiding any conversations)
				if (Messenger.CurrentChats.Count > 0) // if there is at least one conversation open
				{
					var CHT_CRT = Messenger.CurrentChats; // get the chat objects
					var X = new Enumerator(CHT_CRT); // enumerate the objects
					var CHT_OBJAR = new Array(); // empty object array
					var CHT_IDAR = new Array(); // empty ID array
					var CHT_CRTID = 1001; // start number
					for(; !X.atEnd(); X.moveNext()) // for each chat object 
					{
						var CHT_TOBJ = X.item(); // get the item
						var CHT_TOBJ_CNT = CHT_TOBJ.Contacts; // get the item's contacts
						var Y = new Enumerator(CHT_TOBJ_CNT); // enumerate the contacts
						var CHT_TOBJ_CNT_DTL = new Array(); // empty data array
						for(; !Y.atEnd(); Y.moveNext()) // for each contact object
						{
							var CHT_TOBJ_CNT_OBJ = Y.item(); // get the item
							CHT_TOBJ_CNT_DTL.push(SET_GLOBAL2 ? CHT_TOBJ_CNT_OBJ.Name : CHT_TOBJ_CNT_OBJ.Email); // push the contact's information
						}
						if (CHT_TOBJ_CNT.Count === 1) // if the chat is single
						{
							Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, CHT_CRTID, MsgPlus.RemoveFormatCodes("Single conversation: " + CHT_TOBJ_CNT_DTL));
							CHT_OBJAR.push(CHT_TOBJ); // push the chat object
							CHT_IDAR.push(CHT_CRTID); // push the chat ID
						}
						else if (SET_CHATS1)
						{
							Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, CHT_CRTID, MsgPlus.RemoveFormatCodes("Group (" + CHT_TOBJ_CNT.Count + "): " + CHT_TOBJ_CNT_DTL.join(", ")));
							CHT_OBJAR.push(CHT_TOBJ); // push the chat object
							CHT_IDAR.push(CHT_CRTID); // push the chat ID
						}
						else
						{
							CHT_HIDE = true; // flag to show hidden chats message
						}
						CHT_CRTID++; // increment the current ID
					}
					if (CHT_HIDE) // if one or more chats have been hidden
					{
						Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_GRAYED, 0, "(some windows are not shown)");
					}
				}
				else // if no chats are open
				{
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_GRAYED, 0, "(no conversations are open)");
				}
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 0, "Close this menu... (&X)");
				break;
			case MNU_INFO:
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1, "== Messenger Information ==");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1001, "&Email address: " + Messenger.MyEmail);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1002, "&Identification number: " + Messenger.MyuserId);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1003, "&Name: " + Messenger.MyName);
				if (Messenger.MyPersonalMessage !== "") // if a PSM is set
				{
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1004, "&PSM: " + Messenger.MyPersonalMessage);
				}
				if (Messenger.MyCurrentMedia !== "") // if some media is set
				{
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1005, "&Media: " + Messenger.MyCurrentMedia);
				}
				if (Messenger.MyDisplayPicture !== "") // if a DP is set
				{
					var TMP_DP = Messenger.MyDisplayPicture.split("\\"); // split the DP string
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1006, "&DP: " + TMP_DP[TMP_DP.length - 1]);
				}
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1007, "&Current status: " + AR_STATNM[Messenger.MyStatus]);
				if (SET_INFO1) // if "Show contact information"
				{
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
					var TMP_CNTLST = Messenger.MyContacts; // get the contact objects
					var X = new Enumerator(TMP_CNTLST); // enumerate the objects
					var TMP_CNTALL = 0; // start value for counter
					var TMP_CNTNON = 0; // start value for counter
					for(; !X.atEnd(); X.moveNext()) // for each contact object
					{
						var CHT_TOBJ_CNT_OBJ = X.item(); // get the item
						TMP_CNTALL++; // increment the counter
						if (CHT_TOBJ_CNT_OBJ.Status > 2 && CHT_TOBJ_CNT_OBJ.Name !== Messenger.MyName) // if the contact is online and it isn't the current user
						{
							TMP_CNTNON++; // increment the counter
						}
					}
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1008, "&Total number of contacts: " + TMP_CNTALL);
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1009, "Number of &online contacts: " + TMP_CNTNON);
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1010, "Number of conversation &windows: " + Messenger.CurrentChats.Count);
				}
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 0, "Close this menu... (&X)");
				break;
			case MNU_LSTCNTS:
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1, "== Messenger Contact List ==");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				var TMP_CNTLST = Messenger.MyContacts; // get the contact objects
				var X = new Enumerator(TMP_CNTLST); // enumerate the objects
				var AR_CNTOBJ = new Array(); // empty object array
				var AR_CNTIDS = new Array(); // empty ID array
				var TMP_CNTLSTOFF = false; // default value (not hiding any contacts)
				if (SET_LSTCNTS3) // if "Use advanced contact menu"
				{
					var TMP_CNTNID = 1; // start value for counter
					for(; !X.atEnd(); X.moveNext()) // for each contact object
					{
						var CHT_TOBJ_CNT_OBJ = X.item(); // get the item
						if ((!SET_LSTCNTS1 && CHT_TOBJ_CNT_OBJ.Status === 1) || (!SET_LSTCNTS2 && CHT_TOBJ_CNT_OBJ.Blocked)) // if not "Show offline contacts" and the contact is offline, or if not "Show blocked contacts" and the contact is blocked
						{
							TMP_CNTLSTOFF = true; // flag to show hidden contacts message
						}
						else // otherwise
						{
							var CHT_TOBJ_CNT_OBJBLK = ""; // empty string for blocked addition
							if (CHT_TOBJ_CNT_OBJ.Blocked) // if the contact is blocked
							{
								CHT_TOBJ_CNT_OBJBLK = ", Blocked"; // add the blocked string
							}
							var MNU_SUB1 = Interop.Call("user32", "CreatePopupMenu");
							if (SET_LSTCNTS4) // if "Show contact details"
							{
								Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_STRING, 1000 + TMP_CNTNID, "&Email address: " + CHT_TOBJ_CNT_OBJ.Email);
								var TMP_ID = 0; // temporary ID holder
								for (var TMP_POS = 0; TMP_POS < CHT_TOBJ_CNT_OBJ.Email.length; TMP_POS++) // for each character of the email address
								{
									TMP_ID = (TMP_ID * 101 + CHT_TOBJ_CNT_OBJ.Email.charCodeAt(TMP_POS)) % 4294967296; // process ID addition
								}
								Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_STRING, 2000 + TMP_CNTNID, "&Identification number: " + TMP_ID);
								Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_SEPARATOR, 0, 0);
								Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_STRING, 3000 + TMP_CNTNID, "&Name: " + MsgPlus.RemoveFormatCodes(CHT_TOBJ_CNT_OBJ.Name));
								if (CHT_TOBJ_CNT_OBJ.PersonalMessage !== "") // if a PSM is set
								{
									Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_STRING, 4000 + TMP_CNTNID, "&PSM: " + MsgPlus.RemoveFormatCodes(CHT_TOBJ_CNT_OBJ.PersonalMessage));
								}
								if (CHT_TOBJ_CNT_OBJ.CurrentMedia !== "") // if some media is set
								{
									Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_STRING, 5000 + TMP_CNTNID, "&Media: " + CHT_TOBJ_CNT_OBJ.CurrentMedia);
								}
								if (CHT_TOBJ_CNT_OBJ.DisplayPicture !== "") // if a DP is set
								{
									var TMP_DP = CHT_TOBJ_CNT_OBJ.DisplayPicture.split("\\"); // split the DP string
									Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_STRING, 6000 + TMP_CNTNID, "&DP: " + TMP_DP[TMP_DP.length - 1]);
								}
								Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_STRING, 7000 + TMP_CNTNID, "&Current status: " + AR_STATNM[CHT_TOBJ_CNT_OBJ.Status]);
								Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_SEPARATOR, 0, 0);
							}
							Interop.Call("user32", "AppendMenuW", MNU_SUB1, (CHT_TOBJ_CNT_OBJ.Email === Messenger.MyEmail ? MF_GRAYED : MF_STRING), 8000 + TMP_CNTNID, "&Open a conversation");
							Interop.Call("user32", "AppendMenuW", MNU_SUB1, MF_SEPARATOR, 0, 0);
							Interop.Call("user32", "AppendMenuW", MNU_SUB1, (CHT_TOBJ_CNT_OBJ.Blocked ? MF_CHECKED : MF_STRING), 9000 + TMP_CNTNID, "&Block this contact");
							Interop.Call("user32", "AppendMenuW", MNU_SUB1, (CHT_TOBJ_CNT_OBJ.IsFloating ? MF_CHECKED : MF_STRING), 10000 + TMP_CNTNID, "&Show on the desktop");
							Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_POPUP, MNU_SUB1, (SET_GLOBAL2 ? MsgPlus.RemoveFormatCodes(CHT_TOBJ_CNT_OBJ.Name) : CHT_TOBJ_CNT_OBJ.Email) + " (" + AR_STATNM[CHT_TOBJ_CNT_OBJ.Status] + CHT_TOBJ_CNT_OBJBLK + ")");
							AR_CNTOBJ.push(CHT_TOBJ_CNT_OBJ); // push the contact object
							AR_CNTIDS.push(TMP_CNTNID); // push the contact ID
							TMP_CNTNID++; // increment the counter
						}
					}
					if (TMP_CNTLSTOFF) // if one or more contacts have been hidden
					{
						Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_GRAYED, 0, "(some contacts are not shown)");
					}
				}
				else
				{
					var TMP_CNTNID = 1001; // start value for counter
					for(; !X.atEnd(); X.moveNext()) // for each contact object
					{
						var CHT_TOBJ_CNT_OBJ = X.item(); // get the item
						if ((!SET_LSTCNTS1 && CHT_TOBJ_CNT_OBJ.Status === 1) || (!SET_LSTCNTS2 && CHT_TOBJ_CNT_OBJ.Blocked)) // if not "Show offline contacts" and the contact is offline, or if not "Show blocked contacts" and the contact is blocked
						{
							TMP_CNTLSTOFF = true; // flag to show hidden contacts message
						}
						else
						{
							var CHT_TOBJ_CNT_OBJBLK = ""; // empty string for blocked addition
							if (CHT_TOBJ_CNT_OBJ.Blocked) // if the contact is blocked
							{
								CHT_TOBJ_CNT_OBJBLK = ", Blocked"; // add the blocked string
							}
							Interop.Call("user32", "AppendMenuW", MNU_MAIN, (CHT_TOBJ_CNT_OBJ.Email === Messenger.MyEmail ? MF_GRAYED : MF_STRING), 0, (SET_GLOBAL2 ? MsgPlus.RemoveFormatCodes(CHT_TOBJ_CNT_OBJ.Name) : CHT_TOBJ_CNT_OBJ.Email) + " (" + AR_STATNM[CHT_TOBJ_CNT_OBJ.Status] + CHT_TOBJ_CNT_OBJBLK + ")");
							AR_CNTOBJ.push(CHT_TOBJ_CNT_OBJ); // push the contact object
							AR_CNTIDS.push(TMP_CNTNID); // push the contact ID
							TMP_CNTNID++; // increment the counter
						}
					}
					if (TMP_CNTLSTOFF) // if one or more contacts have been hidden
					{
						Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_GRAYED, 0, "(some contacts are not shown)");
					}
				}
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 0, "Close this menu... (&X)");
				break;
			case MNU_OPTIONS:
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1, "== QuickKey Options ==");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				var MNU_SUB1 = Interop.Call("user32", "CreatePopupMenu");
				Interop.Call("user32", "AppendMenuW", MNU_SUB1, (SET_CHATS1 ? MF_CHECKED : MF_STRING), 1001, "Show &group conversations");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_POPUP, MNU_SUB1, "Messenger &Conversations");
				var MNU_SUB2 = Interop.Call("user32", "CreatePopupMenu");
				Interop.Call("user32", "AppendMenuW", MNU_SUB2, (SET_INFO1 ? MF_CHECKED : MF_STRING), 2001, "Show contact &information");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_POPUP, MNU_SUB2, "Messenger &Information");
				var MNU_SUB3 = Interop.Call("user32", "CreatePopupMenu");
				Interop.Call("user32", "AppendMenuW", MNU_SUB3, (SET_LSTCNTS1 ? MF_CHECKED : MF_STRING), 3001, "Show &offline contacts");
				Interop.Call("user32", "AppendMenuW", MNU_SUB3, (SET_LSTCNTS2 ? MF_CHECKED : MF_STRING), 3002, "Show &blocked contacts");
				Interop.Call("user32", "AppendMenuW", MNU_SUB3, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_SUB3, (SET_LSTCNTS3 ? MF_CHECKED : MF_STRING), 3003, "Use advanced &contact menu");
				Interop.Call("user32", "AppendMenuW", MNU_SUB3, (SET_LSTCNTS3 ? (SET_LSTCNTS4 ? MF_CHECKED : MF_STRING) : (SET_LSTCNTS4 ? MF_CHECKED | MF_GRAYED : MF_GRAYED)), 3004, "Show contact &details");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_POPUP, MNU_SUB3, "Messenger Contact &List");
				var MNU_SUB4 = Interop.Call("user32", "CreatePopupMenu");
				Interop.Call("user32", "AppendMenuW", MNU_SUB4, (SET_STATUS1 ? MF_CHECKED : MF_STRING), 4001, "Show &sign-out option");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_POPUP, MNU_SUB4, "Messenger &Status");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				var MNU_SUB5 = Interop.Call("user32", "CreatePopupMenu");
				Interop.Call("user32", "AppendMenuW", MNU_SUB5, (SET_GLOBAL1 ? MF_CHECKED : MF_STRING), 5001, "Disable menus on &lock");
				Interop.Call("user32", "AppendMenuW", MNU_SUB5, (SET_GLOBAL2 ? MF_CHECKED : MF_STRING), 5002, "Show &name, not email");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_POPUP, MNU_SUB5, "&Global Options");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 6001, "&View list of all shortcuts");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, (QK_MGROPN ? MF_GRAYED : MF_STRING), 6002, "&Manage QuickKey shortcuts...");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 6003, "&Re-register all hotkeys");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 6004, "About &" + NAME + " " + VERSION + "...");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 0, "Close this menu... (&X)");
				break;
			case MNU_STATUS:
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1, "== Messenger Status ==");
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				var TMP_STATCT = 1001; // start value for counter
				for (var X in AR_STATNM) // for each available status
				{
					if (X > 1 && X != 6) // if status is not offline or idle
					{
						Interop.Call("user32", "AppendMenuW", MNU_MAIN, (Messenger.MyStatus == X ? MF_CHECKED | MF_GRAYED : MF_STRING), TMP_STATCT, "&" + X + ") " + AR_STATNM[X]);
						TMP_STATCT++; // increment the counter
					}
				}
				if (SET_STATUS1) // if "Show sign-out option"
				{
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
					Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 1008, "Sign &Out");
				}
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_SEPARATOR, 0, 0);
				Interop.Call("user32", "AppendMenuW", MNU_MAIN, MF_STRING, 0, "Close this menu... (&X)");
		}
		var MNU_MS_LCTN = Interop.Allocate(8); // allocate a memory block for the cursor position
		Interop.Call("user32", "GetCursorPos", MNU_MS_LCTN); // get and store the cursor position
		var MNU_RSLT = Interop.Call("user32", "TrackPopupMenu", MNU_MAIN, TPM_LEFTALIGN | TPM_RETURNCMD | TPM_VERNEGANIMATION, MNU_MS_LCTN.ReadDWORD(0), MNU_MS_LCTN.ReadDWORD(4), 0, WND_SBC.Handle, 0); // build the menu and store the result
		Debug.Trace("-> Processing result (" + MNU_RSLT + ")...");
		switch (wParam)
		{
			case MNU_CHATS: // "Messenger Conversations"
				if (MNU_RSLT === 1) // copy all information
				{
					var TMP_STR = new Array(); // empty result array
					for (var X in CHT_OBJAR) // for each chat object
					{
						var TMP_STR_SUB = new Array();
						var CHT_TOBJ = CHT_OBJAR[X]; // get the item
						var CHT_TOBJ_CNT = CHT_TOBJ.Contacts; // get the item's contacts
						var Y = new Enumerator(CHT_TOBJ_CNT); // enumerate the contacts
						var CHT_TOBJ_CNT_DTL = new Array(); // empty data array
						for(; !Y.atEnd(); Y.moveNext()) // for each contact object
						{
							var CHT_TOBJ_CNT_OBJ = Y.item(); // get the item
							TMP_STR_SUB.push(SET_GLOBAL2 ? CHT_TOBJ_CNT_OBJ.Name : CHT_TOBJ_CNT_OBJ.Email); // push the contact's information
						}
						TMP_STR.push("> " + (TMP_STR_SUB.length === 1 ? "Single conversation: " : "Group (" + TMP_STR_SUB.length + "): ") + TMP_STR_SUB.join(", "));
					}
					TMP_STR.push(TMP_STR.length === 0 ? "(no conversations are open)" : undefined); // add empty message
					CopyToClipboard("Currently open conversations:\r\n" + TMP_STR.join("\r\n")); // copy everything
				}
				else
				{
					var TMP_CHTIDY = 0; // start value for counter
					for (var X in CHT_IDAR) // for each chat ID
					{
						if (CHT_IDAR[X] === MNU_RSLT) // if the ID matches the menu selection
						{
							Interop.Call("user32", "SetForegroundWindow", CHT_OBJAR[X].Handle); // bring the relevent window to the front
							break;
						}
					}
				}
				break;
			case MNU_INFO: // "Messenger Information"
				switch (MNU_RSLT) // choose which data to copy
				{
					case 1: // copy all information
						var TMP_STR = "Email address: " + Messenger.MyEmail + "\r\nIdentification number: " + Messenger.MyUserId + "\r\n\r\nName: " + Messenger.MyName + (Messenger.MyPersonalMessage === "" ? "" : "\r\nPSM: " + Messenger.MyPersonalMessage); // collect data
						TMP_STR += (Messenger.MyCurrentMedia === "" ? "" : "\r\nMedia: " + Messenger.MyCurrentMedia) + (Messenger.MyDisplayPicture === "" ? "" : "\r\nDP: " + Messenger.MyDisplayPicture) + "\r\nStatus: " + AR_STATNM[Messenger.MyStatus]; // collect data
						CopyToClipboard(TMP_STR); // copy everything
						break;
					case 1001: // copy the user's email
						CopyToClipboard(Messenger.MyEmail); // copy the data
						break;
					case 1002: // copy the user's ID
						CopyToClipboard(Messenger.MyUserId); // copy the data
						break;
					case 1003: // copy the user's name
						CopyToClipboard(Messenger.MyName); // copy the data
						break;
					case 1004: // copy the user's PSM
						CopyToClipboard(Messenger.MyPersonalMessage); // copy the data
						break;
					case 1005: // copy the user's media
						CopyToClipboard(Messenger.MyCurrentMedia); // copy the data
						break;
					case 1006: // copy the user's DP
						CopyToClipboard(Messenger.MyDisplayPicture); // copy the data
						break;
					case 1007: // copy the user's status
						CopyToClipboard(AR_STATNM[Messenger.MyStatus]); // copy the data
						break;
				}
				break;
			case MNU_LSTCNTS: // "Messenger Contact List"
				if (MNU_RSLT === 1) // copy all information
				{
					var TMP_STR = new Array(); // empty result array
					for (var X in AR_CNTOBJ) // for each contact object
					{
						TMP_STR.push("> " + MsgPlus.RemoveFormatCodes(AR_CNTOBJ[X].Name) + " (" + AR_CNTOBJ[X].Email + ")");
					}
					TMP_STR.push(TMP_STR.length === 0 ? "(no contacts are available)" : undefined); // add empty message
					CopyToClipboard("Contacts in your contact list:\r\n" + TMP_STR.join("\r\n")); // copy everything
				}
				else if (SET_LSTCNTS3) // if "Use advanced contact menu"
				{
					var TMP_FNO = Math.round(MNU_RSLT / 1000) * 1000; // round it to get the mode
					for (var X in AR_CNTIDS) // for each contact ID
					{
						if ((TMP_FNO + AR_CNTIDS[X]) === MNU_RSLT) // if the ID matches the menu selection
						{
							switch (TMP_FNO) // switch by operation
							{
								case 1000: // copy the contact's email
									CopyToClipboard(AR_CNTOBJ[X].Email); // copy the data
									break;
								case 2000: // copy the contact's ID
									var TMP_ID = 0; // temporary ID holder
									for (var TMP_POS = 0; TMP_POS < AR_CNTOBJ[X].Email.length; TMP_POS++) // for each character of the email address
									{
										TMP_ID = (TMP_ID * 101 + AR_CNTOBJ[X].Email.charCodeAt(TMP_POS)) % 4294967296; // process ID addition
									}
									CopyToClipboard(TMP_ID); // copy the data
									break;
								case 3000: // copy the contact's name
									CopyToClipboard(AR_CNTOBJ[X].Name); // copy the data
									break;
								case 4000: // copy the contact's PSM
									CopyToClipboard(AR_CNTOBJ[X].PersonalMessage); // copy the data
									break;
								case 5000: // copy the contact's media
									CopyToClipboard(AR_CNTOBJ[X].CurrentMedia); // copy the data
									break;
								case 6000: // copy the contact's DP
									CopyToClipboard(AR_CNTOBJ[X].DisplayPicture); // copy the data
									break;
								case 7000: // copy the contact's status
									CopyToClipboard(AR_STATNM[AR_CNTOBJ[X].Status]); // copy the data
									break;
								case 8000: // "Open a conversation"
									Messenger.OpenChat(AR_CNTOBJ[X]); // open a conversation using the relevent contact object
									break;
								case 9000: // "Block this contact"
									AR_CNTOBJ[X].Blocked = !AR_CNTOBJ[X].Blocked; // toggle the block property of the relevent object
									break;
								case 10000: // "Show on the desktop"
									AR_CNTOBJ[X].IsFloating = !AR_CNTOBJ[X].IsFloating; // toggle the float property of the relevent object
									break;
							}
							break;
						}
					}
				}
				else
				{
					for (var X in AR_CNTIDS) // for each contact ID
					{
						if (AR_CNTIDS[X] === MNU_RSLT) // if the ID matches the menu selection
						{
							Messenger.OpenChat(AR_CNTOBJ[X]); // open a conversation using the relevent contact object
							break;
						}
					}
				}
				break;
			case MNU_MANAGER: // "QuickKey Hotkey Manager"
				if (!QK_MGROPN) // if the manager isn't already open
				{
					OnWndHotkeysEvent_Build(); // open the hotkey manager
				}
				break;
			case MNU_OPTIONS: // "QuickKey Options"
				switch (MNU_RSLT) // switch by operation
				{
					case 1: // copy all information
						var TMP_STR = "Messenger Conversations:\r\n> Show group conversations: " + SET_CHATS1 + "\r\n\r\n"; // collect data
						TMP_STR += "Messenger Information\r\n> Show contact information: " + SET_INFO1 + "\r\n\r\n"; // collect data
						TMP_STR += "Messenger Contact List\r\n> Show offline contacts: " + SET_LSTCNTS1 + "\r\n> Show blocked contacts: " + SET_LSTCNTS2 + "\r\n> Use advanced contact menu: " + SET_LSTCNTS3 + "\r\n> Show contact details: " + SET_LSTCNTS4 + "\r\n\r\n"; // collect data
						TMP_STR += "Messenger Status\r\n> Show sign-out option: " + SET_STATUS1 + "\r\n\r\n"; // collect data
						TMP_STR += "Global Options \r\n> Disable menus on lock: " + SET_GLOBAL1 + "\r\n> Show name, not email: " + SET_GLOBAL2 + "\r\n\r\n"; // collect data
						CopyToClipboard(TMP_STR); // copy everything
						break;
					case 1001: // "Messenger Conversations" --> "Show group conversations"
						SET_CHATS1 = !SET_CHATS1; // toggle the option
						break;
					case 2001: // "Messenger Information" --> "Show contact information"
						SET_INFO1 = !SET_INFO1; // toggle the option
						break;
					case 3001: // "Messenger Contact List" --> "Show offline contacts"
						SET_LSTCNTS1 = !SET_LSTCNTS1; // toggle the option
						break;
					case 3002: // "Messenger Contact List" --> "Show blocked contacts"
						SET_LSTCNTS2 = !SET_LSTCNTS2; // toggle the option
						break;
					case 3003: // "Messenger Contact List" --> "Use advanced contact menu"
						SET_LSTCNTS3 = !SET_LSTCNTS3; // toggle the option
						break;
					case 3004: // "Messenger Contact List" --> "Show contact details"
						SET_LSTCNTS4 = !SET_LSTCNTS4; // toggle the option
						break;
					case 4001: // "Messenger Status" --> "Show sign-out option"
						SET_STATUS1 = !SET_STATUS1; // toggle the option
						break;
					case 5001: // "Global Options " --> "Disable menus on lock"
						SET_GLOBAL1 = !SET_GLOBAL1; // toggle the option
						break;
					case 5002: // "Global Options " --> "Show name, not email"
						SET_GLOBAL2 = !SET_GLOBAL2; // toggle the option
						break;
					case 6001: // "View list of all shortcuts"
						var TMP_MODS = new Array(); // empty modifier array
						if (HTK_CTRL) // if "Ctrl" modifier in use
						{
							TMP_MODS.push("Ctrl"); // add "Ctrl" modifier to description
						}
						if (HTK_SHIFT) // if "Shift" modifier in use
						{
							TMP_MODS.push("Shift"); // add "Shift" modifier to description
						}
						if (HTK_ALT) // if "Alt" modifier in use
						{
							TMP_MODS.push("Alt"); // add "Alt" modifier to description
						}
						if (HTK_WIN) // if "Win" modifier in use
						{
							TMP_MODS.push("Win"); // add "Win" modifier to description
						}
						TMP_MODS = TMP_MODS.join(" + ");
						var TMP_MSG = TMP_MODS + " + " + AR_LTR[HTK_CHATS] + " = Messenger Conversations\n" + TMP_MODS + " + " + AR_LTR[HTK_INFO] + " = Messenger Information\n" + TMP_MODS + " + " + AR_LTR[HTK_LSTCNTS] + " = Messenger Contact List\n"; // add to message
						TMP_MSG += TMP_MODS + " + " + AR_LTR[HTK_MANAGER] + " = QuickKey Hotkey Manager\n" + TMP_MODS + " + " + AR_LTR[HTK_OPTIONS] + " = QuickKey Options\n" + TMP_MODS + " + " + AR_LTR[HTK_STATUS] + " = Messenger Status"; // add to message
						Interop.Call("user32", "MessageBoxW", null, TMP_MSG, NAME, 48); // show alert with all hotkeys
						break;
					case 6002: // "Manage QuickKey shortcuts"
						OnWndHotkeysEvent_Build();
						break;
					case 6003: // "Re-register all hotkeys"
						Debug.Trace("Function called: OnEvent_Uninitialize");
						OnEvent_Uninitialize(); // unload hotkeys
						Debug.Trace("Function called: OnEvent_Initialize");
						OnEvent_Initialize(); // reload hotkeys
						break;
					case 6004: // "About QuickKey 2.2..."
						Interop.Call("user32", "MessageBoxW", null, NAME + " (Version " + VERSION + ")\nBy Whiz @ WhizWeb Community\n(http://www.ww-c.co.nr)\n\nThanks to Matty, Matti, SmokingCookie and\nWarmth at the Messenger Plus! Live forum.", NAME, 48); // show about message
						break;
				}
				break;
			case MNU_STATUS: // "Messenger Status"
				switch (MNU_RSLT) // switch by operation
				{
					case 1: // copy all information
						CopyToClipboard("Current status: " + Messenger.MyStatus + " (" + AR_STATNM[Messenger.MyStatus] + ")"); // copy everything
						break;
					case 1001: // "2) Appear Offline"
						Messenger.MyStatus = 2; // switch to that status
						break;
					case 1002: // "3) Online"
						Messenger.MyStatus = 3; // switch to that status
						break;
					case 1003: // "4) Busy"
						Messenger.MyStatus = 4; // switch to that status
						break;
					case 1004: // "5) Be Right Back"
						Messenger.MyStatus = 5; // switch to that status
						break;
					case 1005: // "7) Away"
						Messenger.MyStatus = 7; // switch to that status
						break;
					case 1006: // "8) In a Call"
						Messenger.MyStatus = 8; // switch to that status
						break;
					case 1007: // "9) Out to Lunch"
						Messenger.MyStatus = 9; // switch to that status
						break;
					case 1008: // "Sign Out"
						Messenger.Signout(); // sign out of Messenger
						break;
				}
				break;
		}
		QK_MNUOPN = false; // flag to allow a new menu to open
	}
}
