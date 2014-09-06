function OnWndResultsEvent_CtrlClicked(PlusWnd, ControlId)
{
	switch (ControlId)
	{
		case "BtnEnd":
			if (ConfirmDialog("Are you sure that you want to end the poll \"" + PlusWnd.GetControlText("EdtQuestion") + "\"?\nContacts sending subsequent responses to this poll will be ignored.", "The poll results...", PlusWnd))
			{
				delete CurrentPolls[parseInt(PlusWnd.GetControlText("EdtID"))];
				Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnEnd"), 0);
			}
			break;
	}
}

function OnWndResultsEvent_Destroyed(PlusWnd, ExitCode)
{
	delete WndResults[parseInt(PlusWnd.GetControlText("EdtID"))];
}
