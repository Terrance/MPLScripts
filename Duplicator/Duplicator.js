var VERSION = "1.2";
new ActiveXObject("WScript.Shell").RegWrite(MsgPlus.ScriptRegPath + "\\Version", VERSION);

var OldName = "";
var OldPSM = "";
var OldDP = "";

var CheckName;
var CheckPSM;
var CheckDP;
var CheckUpdate;

var OldChkDP = "";
var NewChkDP = "";

var DupUser = "";
var DupUserR = "";
var Duplicating = false;

var ReDup;
var ReDupAdv;

var AutoUpdate = true;

function OnGetScriptMenu (nLocation)
{
	var menu = '<ScriptMenu>';
	
	if (Duplicating)
	{
		menu += '<SubMenu Label=\"Details of duplication...\">';
		menu += '<MenuEntry Id=\" \" Enabled=\"false\">Duplicating this user: ' + DupUser.Email + '</MenuEntry>';
		menu += '<Separator/>';
		if (CheckName == true)
		{
			menu += '<MenuEntry Id=\" \" Enabled=\"false\">Name: ' + DupUser.Name + '</MenuEntry>';
		}
		if (CheckPSM == true)
		{
			menu += '<MenuEntry Id=\" \" Enabled=\"false\">PSM: ' + DupUser.PersonalMessage + '</MenuEntry>';
		}
		if (CheckDP == true)
		{
			menu += '<MenuEntry Id=\" \" Enabled=\"false\">DP: ' + DupUser.DisplayPicture + '</MenuEntry>';
		}
		menu += '</SubMenu>';
		if (AutoUpdate)
		{
			menu += '<MenuEntry Id=\"DupUpdate\">Auto-updating is on...</MenuEntry>';
		}
		else
		{
			menu += '<MenuEntry Id=\"DupUpdate\">Auto-updating is off...</MenuEntry>';
		}
		menu += '<Separator/>';
		menu += '<MenuEntry Id=\"DupStop\">Stop duplicating...</MenuEntry>';
		menu += '<Separator/>';
	}
	if (nLocation == 1)
	{
		menu += '<MenuEntry Id=\" \" Enabled=\"false\">Duplicate this user!</MenuEntry>'
		menu += '<MenuEntry Id=\" \" Enabled=\"false\">Advanced duplication...</MenuEntry>';
	}
	if (nLocation == 2)
	{
		menu += '<MenuEntry Id=\"DupStart\">Duplicate this user!</MenuEntry>';
		menu += '<MenuEntry Id=\"DupAdv\">Advanced duplication...</MenuEntry>';
	}
	menu += '<Separator/>';
	menu += '<MenuEntry Id=\"About\">About Duplicator...</MenuEntry>';
	menu += '</ScriptMenu>';
 
	return menu;
}

function OnEvent_MenuClicked (sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId == "DupStart")
	{
		var EC = new Enumerator(iOriginWnd.Contacts); 
		for(; !EC.atEnd(); EC.moveNext()) 
		{ 
			var Contact = EC.item();
		}
		var CWndCon = iOriginWnd.Contacts;
		var CWndConCou = CWndCon.Count;
		if (CWndConCou == 1)
		{
			DupUserR = Contact;
			Duplicate();
		}
		else
		{
			MsgPlus.DisplayToast("Duplicator", "You cannot duplicate a user from a group conversation.  Open a one-to-one chat window with that contact to duplicate them.");
		}
	}
	if (sMenuId == "DupAdv")
	{
		var EC = new Enumerator(iOriginWnd.Contacts); 
		for(; !EC.atEnd(); EC.moveNext()) 
		{ 
			var Contact = EC.item();
		}
		var CWndCon = iOriginWnd.Contacts;
		var CWndConCou = CWndCon.Count;
		if (CWndConCou == 1)
		{
			DupUserR = Contact;
			var DupAdvWnd = MsgPlus.CreateWnd("Windows.xml", "WndDupAdv", 0);
			DupAdvWnd.SetControlText("RichEditEmail", DupUserR.Email);
			DupAdvWnd.SetControlText("RichEditName", DupUserR.Name);
			DupAdvWnd.SetControlText("RichEditPSM", DupUserR.PersonalMessage);
			DupAdvWnd.SetControlText("RichEditDP", DupUserR.DisplayPicture);
		}
		else
		{
			MsgPlus.DisplayToast("Duplicator", "You cannot duplicate a user from a group conversation.  Open a one-to-one chat window with that contact to duplicate them.");
		}
	}
	if (sMenuId == "DupStop")
	{
		if (Duplicating)
		{
			Unduplicate();
		}
		else
		{
			MsgPlus.DisplayToast("Duplicator", "You cannot stop duplicating if you haven't started doing so!");
		}
	}
	if (sMenuId == "DupUpdate")
	{
		if (AutoUpdate)
		{
			AutoUpdate = false;
			Debug.Trace("Auto-update is now disabled...");
		}
		else
		{
			AutoUpdate = true;
			Debug.Trace("Auto-update is now enabled...");
		}
	}
	if (sMenuId == "About")
	{
		MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
	}
}

function OnWndAboutEvent_CtrlClicked(objWnd, strControlId)
{
	if (strControlId == "BtnOk")
	{
		objWnd.Close(2);
	}
}

function OnGetScriptCommands ()
{
	command='<ScriptCommands>';
	
	if (Duplicating)
	{
		command+='<Command>';
		command+='<Name>dupstop</Name>';
		command+='<Description>Stop duplicing...</Description>';
		command+='</Command>';
	}
	
	command+='<Command>';
	command+='<Name>dupstart</Name>';
	command+='<Description>Duplicate this user!</Description>';
	command+='</Command>';
	
	command+='<Command>';
	command+='<Name>dupadv</Name>';
	command+='<Description>Advanced duplication...!</Description>';
	command+='</Command>';
	
	command+='</ScriptCommands>';

	return command;
}

function OnEvent_ChatWndSendMessage (ChatWnd, Message)
{
	var Command;
	var SMessage;
	var Param = new Array();
	var SiteM;
	var SArray = new Array();
	SArray = Message.split(" ");
	SMessage = "";	
	for (SiteM in SArray)
	{
		switch(SiteM) 				
		{
			case "0":	
				Command = SArray[SiteM].toLowerCase();
			break;
			default:
				Param[SiteM] = SArray[SiteM].toLowerCase();
				SMessage += " " + SArray[SiteM];
			break;
		}
	}
	if (Command == "/dupstart")
	{
		var EC = new Enumerator(ChatWnd.Contacts); 
		for(; !EC.atEnd(); EC.moveNext()) 
		{ 
			var Contact = EC.item();
		}
		var CWndCon = ChatWnd.Contacts;
		var CWndConCou = CWndCon.Count;
		if (CWndConCou == 1)
		{
			DupUserR = Contact;
			Duplicate();
		}
		else
		{
			MsgPlus.DisplayToast("Duplicator", "You cannot duplicate a user from a group conversation.  Open a one-to-one chat window with that contact to duplicate them.");
		}
	}
	if (Command == "/dupstop")
	{
		if (Duplicating)
		{
			Unduplicate();
		}
		else
		{
			MsgPlus.DisplayToast("Duplicator", "You cannot stop duplicating if you haven't started doing so!");
		}
	}
	if (Command == "/dupadv")
	{
		var EC = new Enumerator(ChatWnd.Contacts); 
		for(; !EC.atEnd(); EC.moveNext()) 
		{ 
			var Contact = EC.item();
		}
		var CWndCon = ChatWnd.Contacts;
		var CWndConCou = CWndCon.Count;
		if (CWndConCou == 1)
		{
			DupUserR = Contact;
			var DupAdvWnd = MsgPlus.CreateWnd("Windows.xml", "WndDupAdv", 0);
			DupAdvWnd.SetControlText("RichEditEmail", DupUserR.Email);
			DupAdvWnd.SetControlText("RichEditName", DupUserR.Name);
			DupAdvWnd.SetControlText("RichEditPSM", DupUserR.PersonalMessage);
			DupAdvWnd.SetControlText("RichEditDP", DupUserR.DisplayPicture);
		}
		else
		{
			MsgPlus.DisplayToast("Duplicator", "You cannot duplicate a user from a group conversation.  Open a one-to-one chat window with that contact to duplicate them.");
		}
	}
}

function OnWndDupAdvEvent_CtrlClicked(objWnd, strControlId)
{
	if (strControlId == "BtnRefresh")
	{
		objWnd.Close(2);
		var DupAdvWnd = MsgPlus.CreateWnd("Windows.xml", "WndDupAdv", 0);
		DupAdvWnd.SetControlText("RichEditEmail", DupUserR.Email);
		DupAdvWnd.SetControlText("RichEditName", DupUserR.Name);
		DupAdvWnd.SetControlText("RichEditPSM", DupUserR.PersonalMessage);
		DupAdvWnd.SetControlText("RichEditDP", DupUserR.DisplayPicture);
	}
	if (strControlId == "BtnDuplicate")
	{
		CheckName = objWnd.Button_IsChecked("CheckBoxName");
		CheckPSM = objWnd.Button_IsChecked("CheckBoxPSM");
		CheckDP = objWnd.Button_IsChecked("CheckBoxDP");
		CheckUpdate = objWnd.Button_IsChecked("CheckBoxUpdate");
		if (CheckName == false && CheckPSM == false && CheckDP == false)
		{
			MsgPlus.DisplayToast("Duplicator", "You cannot duplicate the user if you select no details to duplicate!")
		}
		else
		{
			Debug.Trace("Duplicate name: " + CheckName);
			Debug.Trace("Duplicate PSM: " + CheckPSM);
			Debug.Trace("Duplicate DP: " + CheckDP);
			Debug.Trace("Auto-update duplication: " + CheckUpdate);
			objWnd.Close(2);
			AdvancedDuplicate();
		}
	}
	if (strControlId == "BtnCancel")
	{
		objWnd.Close(2);
		DupUserR = "";
	}
}

function Duplicate ()
{
	DupUser = DupUserR;
	if (Duplicating)
	{
		ReDup = true;
		Unduplicate();
	}
	else
	{
		Debug.Trace("Attempting to duplicate user: " + DupUser);
		Duplicating = true;
		OldName = Messenger.MyName;
		OldPSM = Messenger.MyPersonalMessage;
		OldDP = Messenger.MyDisplayPicture;
		Debug.Trace("Name saved: " + OldName);
		Debug.Trace("PSM saved: " + OldPSM);
		Debug.Trace("DP saved: " + OldDP);
	}
	CheckName = true;
	CheckPSM = true;
	CheckDP = true;
	CheckUpdate = true;
	MsgPlus.AddTimer("WaitDup1", 500);
	Debug.Trace("Now waiting (1 second)...");
}

function AdvancedDuplicate ()
{
	DupUser = DupUserR;
	if (Duplicating)
	{
		ReDupAdv = true;
		Unduplicate();
	}
	else
	{
		DupUserR = "";
		Debug.Trace("Attempting to duplicate user: " + DupUser);
		Duplicating = true;
		OldName = Messenger.MyName;
		OldPSM = Messenger.MyPersonalMessage;
		OldDP = Messenger.MyDisplayPicture;
		Debug.Trace("Name saved: " + OldName);
		Debug.Trace("PSM saved: " + OldPSM);
		Debug.Trace("DP saved: " + OldDP);
	}
	MsgPlus.AddTimer("WaitAdvDup1", 500);
	Debug.Trace("Now waiting (1 second)...");
}

function Unduplicate ()
{
	Debug.Trace("Attempting to unduplicate user: " + DupUser);
	Duplicating = false;
	Debug.Trace("Name to restore: " + OldName);
	Debug.Trace("PSM to restore: " + OldPSM);
	Debug.Trace("DP to restore: " + OldDP);
	MsgPlus.AddTimer("WaitUndup1", 500);
	Debug.Trace("Now waiting (1 second)...");
}

function OnEvent_Timer (TimerId)
{
	switch (TimerId)
	{
		case "WaitDup1":
			Messenger.MyName = DupUser.Name;
			Messenger.MyPersonalMessage = DupUser.PersonalMessage;
			Messenger.MyDisplayPicture = DupUser.DisplayPicture;
			MsgPlus.AddTimer("WaitDup2", 500);
			break;
		case "WaitDup2":
			Debug.Trace("New name: " + Messenger.MyName);
			Debug.Trace("New PSM: " + Messenger.MyPersonalMessage);
			Debug.Trace("New DP: " + Messenger.MyDisplayPicture);
			MsgPlus.DisplayToast("Duplicator", "You have started duplicating:\n" + DupUser.Email);
			MsgPlus.AddTimer("CheckDupStatus", 100);
			DupUserR = "";
			break;
		case "WaitAdvDup1":
			if (CheckName == true)
			{
				Messenger.MyName = DupUser.Name;
			}
			if (CheckPSM == true)
			{
				Messenger.MyPersonalMessage = DupUser.PersonalMessage;
			}
			if (CheckDP == true)
			{
				Messenger.MyDisplayPicture = DupUser.DisplayPicture;
			}
			MsgPlus.AddTimer("WaitAdvDup2", 500)
			break;
		case "WaitAdvDup2":
			Debug.Trace("New name: " + Messenger.MyName);
			Debug.Trace("New PSM: " + Messenger.MyPersonalMessage);
			Debug.Trace("New DP: " + Messenger.MyDisplayPicture);
			MsgPlus.DisplayToast("Duplicator", "You have started duplicating:\n" + DupUser.Email);
			if (CheckUpdate == true)
			{
				AutoUpdate = true;
			}
			else
			{
				AutoUpdate = false;
			}
			DupUserR = "";
			MsgPlus.AddTimer("CheckDupStatus", 100);
			break;
		case "WaitUndup1":
			Messenger.MyName = OldName;
			Messenger.MyPersonalMessage = OldPSM;
			Messenger.MyDisplayPicture = OldDP;
			MsgPlus.AddTimer("WaitUndup2", 500);
			break;
		case "WaitUndup2":
			try
			{
				Debug.Trace("New name: " + Messenger.MyName);
				Debug.Trace("New PSM: " + Messenger.MyPersonalMessage);
				Debug.Trace("New DP: " + Messenger.MyDisplayPicture);
				MsgPlus.DisplayToast("Duplicator", "You have stopped duplicating:\n" + DupUser.Email);
			}
			catch(error)
			{
				MsgPlus.DisplayToast("Duplicator", "You have stopped duplicating:\n" + DupUser.Email + "\nBut some info couldn't be edited.");
			}
			DupUser = "";
			OldName = "";
			OldPSM = "";
			OldDP = "";
			if (ReDup)
			{
				Duplicate();
				ReDup = false;
			}
			if (ReDupAdv)
			{
				AdvancedDuplicate();
				ReDupAdv = false;
			}
			break;
		case "CheckDupStatus":
			if (Duplicating)
			{
				if (AutoUpdate)
				{
					Messenger.MyName = DupUser.Name;
					Messenger.MyPersonalMessage = DupUser.PersonalMessage;
					Messenger.MyDisplayPicture = DupUser.DisplayPicture;
				}
				MsgPlus.AddTimer("CheckDupStatus", 100);
			}
			break;
	}
}
