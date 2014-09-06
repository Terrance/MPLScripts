function OnWndTrueEvent_CtrlClicked(PlusWnd, ControlId)
{
	var From = PlusWnd.GetControlText("EdtFrom");
	var ID = PlusWnd.GetControlText("EdtID");
	var Answer = PlusWnd.GetControlText("TxtVote");
	switch (ControlId)
	{
		case "BtnTrue":
			PlusWnd.SetControlText("TxtVote", "True!");
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnTrue"), 0);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnFalse"), 1);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnVote"), 1);
			break;
		case "BtnFalse":
			PlusWnd.SetControlText("TxtVote", "False!");
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnTrue"), 1);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnFalse"), 0);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnVote"), 1);
			break;
		case "BtnVote":
			AnswerPoll(From, ID, Answer);
			break;
	}
}

function OnWndYesEvent_CtrlClicked(PlusWnd, ControlId)
{
	var From = PlusWnd.GetControlText("EdtFrom");
	var ID = PlusWnd.GetControlText("EdtID");
	var Answer = PlusWnd.GetControlText("TxtVote");
	switch (ControlId)
	{
		case "BtnYes":
			PlusWnd.SetControlText("TxtVote", "Yes!");
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnYes"), 0);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnNo"), 1);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnVote"), 1);
			break;
		case "BtnNo":
			PlusWnd.SetControlText("TxtVote", "No!");
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnYes"), 1);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnNo"), 0);
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnVote"), 1);
			break;
		case "BtnVote":
			AnswerPoll(From, ID, Answer);
			break;
	}
}

function OnWndNumberEvent_CtrlClicked(PlusWnd, ControlId)
{
	var From = PlusWnd.GetControlText("EdtFrom");
	var ID = PlusWnd.GetControlText("EdtID");
	var Answer = parseInt(PlusWnd.GetControlText("EdtAnswer"));
	if (isNaN(Answer))
	{
		Answer = 0;
	}
	switch (ControlId)
	{
		case "BtnMinus":
			Answer--;
			PlusWnd.SetControlText("EdtAnswer", Answer);
			break;
		case "BtnPlus":
			Answer++;
			PlusWnd.SetControlText("EdtAnswer", Answer);
			break;
		case "BtnVote":
			AnswerPoll(From, ID, Answer);
			break;
	}
}

function OnWndNumberEvent_EditTextChanged(PlusWnd, ControlId)
{
	Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnVote"), (PlusWnd.GetControlText("EdtAnswer") !== ""));
}

function OnWndPromptEvent_CtrlClicked(PlusWnd, ControlId)
{
	var From = PlusWnd.GetControlText("EdtFrom");
	var ID = PlusWnd.GetControlText("EdtID");
	var Answer = PlusWnd.GetControlText("EdtAnswer");
	switch (ControlId)
	{
		case "BtnVote":
			AnswerPoll(From, ID, Answer);
			break;
	}
}

function OnWndPromptEvent_EditTextChanged(PlusWnd, ControlId)
{
	Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnVote"), (PlusWnd.GetControlText("EdtAnswer") !== ""));
}

function OnWndMultiEvent_CtrlClicked(PlusWnd, ControlId)
{
	var From = PlusWnd.GetControlText("EdtFrom");
	var ID = PlusWnd.GetControlText("EdtID");
	var Answer = PlusWnd.GetControlText("TxtOptions").split("|");
	Answer = Answer[PlusWnd.Combo_GetCurSel("CmbAnswer")];
	switch (ControlId)
	{
		case "BtnVote":
			AnswerPoll(From, ID, Answer);
			break;
	}
}

function OnWndMultiEvent_ComboSelChanged(PlusWnd, ControlId)
{
	Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnVote"), 1);
}
