function OnWndNewEvent_CtrlClicked(PlusWnd, ControlId)
{
	Interop.Call("user32", "EnableWindow", WndNew.GetControlHandle("BtnPoll"), (WndNew.GetControlText("EdtQuestion") !== "" && !(WndNew.Combo_GetCurSel("CmbAnswer") === 4 && WndNew.GetControlText("EdtChoices").split("|").length <= 1) && !(WndNew.Combo_GetCurSel("CmbContacts") === 3 && WndNew.GetControlText("EdtVoters") === "")));
	Interop.Call("user32", "EnableWindow", WndNew.GetControlHandle("TxtChoices"), WndNew.Combo_GetCurSel("CmbAnswer") === 4);
	Interop.Call("user32", "EnableWindow", WndNew.GetControlHandle("EdtChoices"), WndNew.Combo_GetCurSel("CmbAnswer") === 4);
	Interop.Call("user32", "EnableWindow", WndNew.GetControlHandle("TxtVoters"), WndNew.Combo_GetCurSel("CmbContacts") === 3);
	Interop.Call("user32", "EnableWindow", WndNew.GetControlHandle("EdtVoters"), WndNew.Combo_GetCurSel("CmbContacts") === 3);
	if (ControlId === "BtnPoll")
	{
		var Question = WndNew.GetControlText("EdtQuestion").replace(/[\"]/gi, "");
		var AnsType = WndNew.Combo_GetCurSel("CmbAnswer");
		var Answer = WndNew.GetControlText("EdtChoices").replace(/[\"]/gi, "").split("|");
		var VoteType = WndNew.Combo_GetCurSel("CmbContacts");
		var Voters = WndNew.GetControlText("EdtVoters").replace(/[\"]/gi, "").split("|");
		switch (AnsType)
		{
			case 0:
				Answer = "true";
				break;
			case 1:
				Answer = "yes";
				break;
			case 2:
				Answer = "number";
				break;
			case 3:
				Answer = "prompt";
				break;
		}
		switch (VoteType)
		{
			case 0:
				Voters = "chats";
				break;
			case 1:
				if (ConfirmDialog("Warning: sending a poll to all contacts can slow down WLM, and server-side message limits may stop the sending of poll requests.  Continue?", "Create a new poll...", WndNew))
				{
					Voters = "all";
					break;
				}
				else
				{
					return;
				}
			case 2:
				Voters = "online";
				break;
		}
		GeneratePoll(Question, Answer, Voters);
	}
}

function OnWndNewEvent_ComboSelChanged(PlusWnd, ControlId)
{
	OnWndNewEvent_CtrlClicked(WndNew, ControlId);
}

function OnWndNewEvent_EditTextChanged(PlusWnd, ControlId)
{
	OnWndNewEvent_CtrlClicked(WndNew, ControlId);
}
