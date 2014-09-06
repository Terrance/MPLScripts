var VERSION = "1.0";

function OnEvent_SigninReady(Email)
{
	new ActiveXObject("WScript.Shell").RegWrite(VERSION);
}

// ------------------------------------------------------

var MCOpen = false;
var MCOnCnt = null;
var MCObjWd = null;

var CTEnmtr = null;
var CTSlctdId = -1;
var CTSlctW = null;

var CTArry = new Array();
var StArry = new Array("Unknown", "Offline", "Unknown", "Online", "Busy", "Be Right Back", "Idle", "Away", "In a Call", "Out to Lunch");

function OnGetScriptMenu(nLocation)
{
	menu='<ScriptMenu>';
	
	if (MCOpen)
	{
		menu+='<MenuEntry Id=\"Mini\" Enabled=\"False\">Create a MiniChat...</MenuEntry>';
	}
	else
	{
		menu+='<MenuEntry Id=\"Mini\">Create a MiniChat...</MenuEntry>';
	}
	menu+='<Separator/>';
	menu+='<MenuEntry Id=\"About\">About MiniChats...</MenuEntry>';
	
	menu+='</ScriptMenu>';
 	 	
	return menu;
}

function OnEvent_MenuClicked(sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId == "Mini")
	{
		CTSlctW = MsgPlus.CreateWnd("Windows.xml", "WndContact", 0);
		Interop.Call("user32", "EnableWindow", CTSlctW.GetControlHandle("BtnOk"), 0);
		CTEnmtr = new Enumerator(Messenger.MyContacts);
		var CTEnCt = 0;
		for(; !CTEnmtr.atEnd(); CTEnmtr.moveNext())
		{
			var TmpCtObj = CTEnmtr.item();
			CTSlctW.LstView_AddItem("LstCts", MsgPlus.RemoveFormatCodes(TmpCtObj.Name));
			CTSlctW.LstView_SetItemText("LstCts", CTEnCt, 1, TmpCtObj.Email);
			CTSlctW.LstView_SetItemText("LstCts", CTEnCt, 2, StArry[TmpCtObj.Status]);
			CTArry.push(TmpCtObj.Email);
			CTEnCt++;
		}
	}
    	if (sMenuId == "About")
	{
		MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
	}
}

function OnWndContactEvent_LstViewSelStateChanged(objWnd, CtrlId, ItemIdx, SelState)
{
	switch (CtrlId)
	{
		case "LstCts":
			CTSlctdId = ItemIdx;
			if (ItemIdx == -1)
			{
				Interop.Call("user32", "EnableWindow", CTSlctW.GetControlHandle("BtnOk"), 0);
			}
			else
			{
				Interop.Call("user32", "EnableWindow", CTSlctW.GetControlHandle("BtnOk"), 1);
			}
			break;
	}
}

function OnWndContactEvent_LstViewDblClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "LstCts":
			if (CTSlctdId == -1)
			{
				Interop.Call("user32", "EnableWindow", CTSlctW.GetControlHandle("BtnOk"), 0);
			}
			else
			{
				MCOpen = true;
				MCOnCnt = Messenger.MyContacts.GetContact(CTArry[CTSlctdId]);
				CTSlctW.Close(0);
				MCObjWd = MsgPlus.CreateWnd("Windows.xml", "WndMiniChat", 0);
				MCObjWd.SetControlText("TxtAdr", MsgPlus.RemoveFormatCodes(MCOnCnt.Name) + " | " + MCOnCnt.Email + " (" + StArry[MCOnCnt.Status] + ")");
				MsgPlus.AddTimer("MCOWRfN", 100);
				var TmpCW = Messenger.OpenChat(MCOnCnt.Email);
				try
				{
					TmpCW.SendMessage("");
				}
				catch (error)
				{
				}
				try
				{
					TmpCW.SendMessage("/close");
				}
				catch (error)
				{
				}
			}
			break;
	}
}

function OnWndContactEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "BtnOk":
			if (CTSlctdId == -1)
			{
				Interop.Call("user32", "EnableWindow", CTSlctW.GetControlHandle("BtnOk"), 0);
			}
			else
			{
				MCOpen = true;
				MCOnCnt = Messenger.MyContacts.GetContact(CTArry[CTSlctdId]);
				CTSlctW.Close(0);
				MCObjWd = MsgPlus.CreateWnd("Windows.xml", "WndMiniChat", 0);
				MCObjWd.SetControlText("TxtAdr", MsgPlus.RemoveFormatCodes(MCOnCnt.Name) + " | " + MCOnCnt.Email + " (" + StArry[MCOnCnt.Status] + ")");
				if (MCOnCnt.Blocked)
				{
					Interop.Call("user32", "EnableWindow", MCObjWd.GetControlHandle("BtnSnd"), 1);
				}
				MsgPlus.AddTimer("MCOWRfN", 100);
				var TmpCW = Messenger.OpenChat(MCOnCnt.Email);
				try
				{
					TmpCW.SendMessage("");
				}
				catch (error)
				{
				}
				try
				{
					TmpCW.SendMessage("/close");
				}
				catch (error)
				{
				}
			}
			break;
		case "BtnRfs":
			CTSlctW.Close(0);
			OnEvent_MenuClicked("Mini");
			break;
	}
}

function OnWndMiniChatEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "RdoClr":
			try
			{
				MCObjWd.SetControlText("EdtHst", "");
			}
			catch (error)
			{
			}
			try
			{
				MCObjWd.Button_SetCheckState("RdoClr", false);
			}
			catch (error)
			{
			}
			break;
		case "ChkTop":
			Interop.Call("user32", "SetWindowPos", MCObjWd.handle, (MCObjWd.Button_IsChecked(strControlId))?-1:-2,0,0,0,0,0x02|0x01);
			break;
		case "BtnMre":
			var MF_CHECKED = 0x8;
			var MF_APPEND = 0x100;
			var MF_DISABLED = 0x2;
			var MF_GRAYED = 0x1;
			var MF_SEPARATOR = 0x800;
			var MF_STRING = 0x0;
			var TPM_LEFTALIGN = 0x0;
			var TPM_RETURNCMD = 0x0100;
			var TPM_VERNEGANIMATION = 0x2000;var MCOWSbc = MsgPlus.CreateWnd("Windows.xml", "WndSubclass", 2); 
			var MCOWMnu = Interop.Call("user32", "CreatePopupMenu");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_GRAYED, 0, "Contact functions:");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 101, "Block/Unblock");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 102, "Conversation...");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 103, "Information...");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_SEPARATOR, 0, 0);
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_GRAYED, 0, "Interactions:");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 201, "Nudge (/nudge)");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 202, "Wink (/wink)");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_SEPARATOR, 0, 0);
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_GRAYED, 0, "Change status:");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 301, "Online");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 302, "Busy");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 303, "Be Right Back");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 304, "Away");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 305, "In a Call");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 306, "Out to Lunch");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 307, "Appear Offline");
			Interop.Call("user32", "AppendMenuW", MCOWMnu, MF_STRING, 308, "Personalize...");
			var MCOWMsLc = Interop.Allocate(8);
			Interop.Call("user32", "GetCursorPos", MCOWMsLc);
			var Result = Interop.Call("user32", "TrackPopupMenu", MCOWMnu, TPM_LEFTALIGN | TPM_RETURNCMD | TPM_VERNEGANIMATION, MCOWMsLc.ReadDWORD(0), MCOWMsLc.ReadDWORD(4), 0, MCOWSbc.Handle, 0);
			switch (Result)
			{
				case 101:
					MCOnCnt.Blocked = !MCOnCnt.Blocked;
					if (MCOnCnt.Blocked)
					{
						Interop.Call("user32", "EnableWindow", MCObjWd.GetControlHandle("BtnSnd"), 1);
					}
					else
					{
						Interop.Call("user32", "EnableWindow", MCObjWd.GetControlHandle("BtnSnd"), 0);
					}
					break;
				case 102:
					Messenger.OpenChat(MCOnCnt.Email);
					break;
				case 103:
					var TmpCW = Messenger.OpenChat(MCOnCnt.Email);
					TmpCW.SendMessage("/ctcinfo");
					TmpCW.SendMessage("/close");
					break;
				case 201:
					var TmpCW = Messenger.OpenChat(MCOnCnt.Email);
					TmpCW.SendMessage("/nudge");
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + "You have just sent a nudge!\n\n");
					TmpCW.SendMessage("/close");
					break;
				case 202:
					var TmpCW = Messenger.OpenChat(MCOnCnt.Email);
					TmpCW.SendMessage("/wink");
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + "You have just sent a wink!\n\n");
					TmpCW.SendMessage("/close");
					break;
				case 301:
					Messenger.MyStatus = 3;
					break;
				case 302:
					Messenger.MyStatus = 4;
					break;
				case 303:
					Messenger.MyStatus = 5;
					break;
				case 304:
					Messenger.MyStatus = 7;
					break;
				case 305:
					Messenger.MyStatus = 8;
					break;
				case 306:
					Messenger.MyStatus = 9;
					break;
				case 307:
					Messenger.MyStatus = 2;
					break;
				case 308:
					var TmpCW = Messenger.OpenChat(MCOnCnt.Email);
					TmpCW.SendMessage("/persostat");
					TmpCW.SendMessage("/close");
					break;
			}
			MCOWSbc.Close(0);
			break;
		case "BtnSnd":
			var TmpMsg = MCObjWd.GetControlText("EdtMsg");
			MCObjWd.SetControlText("EdtMsg", "");
			if (TmpMsg != "" && TmpMsg != " " && TmpMsg != "  ")
			{
				if (TmpMsg.charAt(0) == "/")
				{
					MCObjWd.SetControlText("TxtEml", "Sending command...");
					if (TmpMsg == "/emoticon")
					{
						MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + "You have just sent an emoticon!\n\n");
					}
					if (TmpMsg == "/nudge")
					{
						MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + "You have just sent a nudge!\n\n");
					}
					else if (TmpMsg == "/wink")
					{
						MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + "You have just sent a wink!\n\n");
					}
				}
				else
				{
					MCObjWd.SetControlText("TxtAdr", "Sending message...");
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + MsgPlus.RemoveFormatCodes(Messenger.MyName) + " says:\n-> " + TmpMsg + "\n\n");
				}
				var TmpCW = Messenger.OpenChat(MCOnCnt.Email);
				TmpCW.SendMessage(TmpMsg);
				TmpCW.SendMessage("/close");
			}
			break;
	}
}

function OnWndMiniChatEvent_Destroyed(objWnd, ExitCode)
{
	MsgPlus.CancelTimer("MCOWRfN");
	MCOpen = false;
	MCOnCnt = null;
}

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MsgKind)
{
	if (MCOpen)
	{
		if (Origin == MCOnCnt.Name)
		{
			ChatWnd.SendMessage("/close");
			switch (MsgKind)
			{
				case 1:
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + MsgPlus.RemoveFormatCodes(Origin) + " says:\n-> " + Message + "\n\n");
					break;
				case 2:
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + MsgPlus.RemoveFormatCodes(Origin) + " has just sent a wink!\n\n");
					break;
				case 3:
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + MsgPlus.RemoveFormatCodes(Origin) + " has just sent a voice clip!\n\n");
					break;
				case 4:
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + MsgPlus.RemoveFormatCodes(Origin) + " is searching for:\n-> " + Message + "\n\n");
					break;
				case 5:
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + MsgPlus.RemoveFormatCodes(Origin) + "'s search results:\n-> " + Message + "\n\n");
					break;
				case 6:
					MCObjWd.SetControlText("EdtHst", MCObjWd.GetControlText("EdtHst") + MsgPlus.RemoveFormatCodes(Origin) + " said:\n-> " + Message + "\n\n");
					break;
			}
		}
	}
}

function OnEvent_Timer(TimerId)
{
	switch (TimerId)
	{
		case "MCOWRfN":
			try
			{
				MCObjWd.SetControlText("TxtAdr", MsgPlus.RemoveFormatCodes(MCOnCnt.Name) + " | " + MCOnCnt.Email + " (" + StArry[MCOnCnt.Status] + ")");
			}
			catch (error)
			{
			}
			break;
	}
}

function OnWndAboutEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "BtnOk":
			objWnd.Close(0);
			break;
	}
}
