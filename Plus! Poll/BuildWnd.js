function BuildWnd(WindowId, ID, Question, Answer, From)
{
	switch (WindowId)
	{
		case "WndNew":
			try
			{
				WndNew.Close(0);
			}
			catch (error)
			{
			}
			WndNew = MsgPlus.CreateWnd("Windows.xml", "WndNew");
			WndNew.Combo_AddItem("CmbAnswer", "True or false");
			WndNew.Combo_AddItem("CmbAnswer", "Yes or no");
			WndNew.Combo_AddItem("CmbAnswer", "Must be a number");
			WndNew.Combo_AddItem("CmbAnswer", "Prompt for text");
			WndNew.Combo_AddItem("CmbAnswer", "Multiple choice...");
			WndNew.Combo_SetCurSel("CmbAnswer", 0);
			WndNew.Combo_AddItem("CmbContacts", "Open conversations");
			WndNew.Combo_AddItem("CmbContacts", "All contacts");
			WndNew.Combo_AddItem("CmbContacts", "Online contacts");
			WndNew.Combo_AddItem("CmbContacts", "Certain people...");
			WndNew.Combo_SetCurSel("CmbContacts", 0);
			break;
		case "WndPoll":
			var TempWnd = null;
			switch (Answer)
			{
				case "true":
					TempWnd = MsgPlus.CreateWnd("Windows.xml", "WndTrue");
					break;
				case "yes":
					TempWnd = MsgPlus.CreateWnd("Windows.xml", "WndYes");
					break;
				case "number":
					TempWnd = MsgPlus.CreateWnd("Windows.xml", "WndNumber");
					TempWnd.SetControlText("EdtAnswer", "0");
					Interop.Call("user32", "SetFocus", TempWnd.GetControlHandle("EdtAnswer"));
					break;
				case "prompt":
					TempWnd = MsgPlus.CreateWnd("Windows.xml", "WndPrompt");
					Interop.Call("user32", "SetFocus", TempWnd.GetControlHandle("EdtAnswer"));
					break;
				default:
					TempWnd = MsgPlus.CreateWnd("Windows.xml", "WndMulti");
					TempWnd.SetControlText("TxtOptions", Answer);
					Answer = Answer.split("|");
					for (var X in Answer)
					{
						TempWnd.Combo_AddItem("CmbAnswer", Answer[X]);
					}
					break;
			}
			WndPoll[ID] = TempWnd;
			switch (From.length)
			{
				case 0:
					ErrorDialog("An internal error has occured whilst checking the sender.\nThis can occur if the contact is appearing offline.\n\nAsk the contact to send the poll again.", "Participate in a poll...", TempWnd);
					TempWnd.Close(0);
					return;
				case 1:
					TempWnd.SetControlText("EdtFrom", From[0].Email);
					break;
				default:
					AlertDialog("Because this poll was sent to you in a group conversation, and two or more contacts share the same name, it is not possible to work out the sender of the poll.\n\nTherefore, the answer will be sent to all of the contacts with a name matching that of the sender.", "Participate in a poll...", TempWnd);
					for (var X in From)
					{
						From[X] = From[X].Email;
					}
					TempWnd.SetControlText("EdtFrom", From.join(", "));
					break;
			}
			TempWnd.SetControlText("EdtID", ID);
			TempWnd.SetControlText("EdtQuestion", Question);
			break;
		case "WndResults":
			try
			{
				WndResults[ID].Close(0);
			}
			catch (error)
			{
			}
			var TempWnd = MsgPlus.CreateWnd("Windows.xml", "WndResults");
			WndResults[ID] = TempWnd;
			TempWnd.SetControlText("EdtID", ID);
			var Voters = CurrentPolls[ID].Voters;
			TempWnd.SetControlText("EdtQuestion", CurrentPolls[ID].Question);
			switch (CurrentPolls[ID].Voters)
			{
				case "chats":
					Voters = "(open conversations)";
					break;
				case "all":
					Voters = "(all contacts)";
					break;
				case "online":
					Voters = "(online contacts)";
					break;
				default:
					Voters = Voters.join(", ");
					break;
			}
			TempWnd.SetControlText("EdtVoters", Voters);
			var Count = 0
			for (var Voter in CurrentPolls[ID].Results)
			{
				TempWnd.LstView_AddItem("LstResults", Voter);
				TempWnd.LstView_SetItemText("LstResults", Count, 1, CurrentPolls[ID].Results[Voter]);
				Count++;
			}
			break;
	}
}
