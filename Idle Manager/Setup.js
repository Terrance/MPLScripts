var SetupWnd;

var ErrorMsg = "";

function WndSetup_Open()
{
	SetupWnd = MsgPlus.CreateWnd("Windows.xml", "WndSetup", 0);
	WndSetup_FormFill();
	WndSetup_ObjEnDis();
}

function WndSetup_FormFill()
{
	SetupWnd.Combo_AddItem("CmbStatus", "Online", 0);
	SetupWnd.Combo_AddItem("CmbStatus", "Busy", 1);
	SetupWnd.Combo_AddItem("CmbStatus", "Be Right Back", 2);
	SetupWnd.Combo_AddItem("CmbStatus", "Away", 3);
	SetupWnd.Combo_AddItem("CmbStatus", "In a Call", 4);
	SetupWnd.Combo_AddItem("CmbStatus", "Out to Lunch", 5);
	SetupWnd.Combo_AddItem("CmbStatus", "Appear Offline", 6);
	try { SetupWnd.Button_SetCheckState("ChkStatus", ReadRegistry("Status", "Chk")); } catch (error) { SetupWnd.Button_SetCheckState("ChkStatus", 6); }
	try { SetupWnd.Combo_SetCurSel("CmbStatus", ReadRegistry("Status", "Cmb")) } catch (error) {}
	try { SetupWnd.SetControlText("EdtStatusMin", ReadRegistry("Status", "Min")) } catch (error) {}
	try { SetupWnd.Button_SetCheckState("ChkName", ReadRegistry("Name", "Chk")); } catch (error) {}
	try { SetupWnd.SetControlText("EdtNameTxt", ReadRegistry("Name", "Edt")) } catch (error) {}
	try { SetupWnd.SetControlText("EdtNameMin", ReadRegistry("Name", "Min")) } catch (error) {}
	try { SetupWnd.Button_SetCheckState("ChkPSM", ReadRegistry("PSM", "Chk")); } catch (error) {}
	try { SetupWnd.SetControlText("EdtPSMTxt", ReadRegistry("PSM", "Edt")) } catch (error) {}
	try { SetupWnd.SetControlText("EdtPSMMin", ReadRegistry("PSM", "Min")) } catch (error) {}
	try { SetupWnd.Button_SetCheckState("ChkSignout", ReadRegistry("Signout", "Chk")); } catch (error) {}
	try { SetupWnd.SetControlText("EdtSignoutMin", ReadRegistry("Signout", "Min")) } catch (error) {}
	try { SetupWnd.Button_SetCheckState("ChkLaunch", ReadRegistry("Launch", "Chk")); } catch (error) {}
	try { SetupWnd.SetControlText("EdtLaunchTxt", ReadRegistry("Launch", "Edt")) } catch (error) {}
	try { SetupWnd.SetControlText("EdtLaunchMin", ReadRegistry("Launch", "Min")) } catch (error) {}
	SetupWnd.Combo_AddItem("CmbShutdown", "Log off user", 0);
	SetupWnd.Combo_AddItem("CmbShutdown", "Turn off PC", 1);
	try { SetupWnd.Button_SetCheckState("ChkShutdown", ReadRegistry("Shutdown", "Chk")); } catch (error) { SetupWnd.Button_SetCheckState("ChkShutdown", 0); }
	try { SetupWnd.Combo_SetCurSel("CmbShutdown", ReadRegistry("Shutdown", "Cmb")) } catch (error) {}
	try { SetupWnd.SetControlText("EdtShutdownMin", ReadRegistry("Shutdown", "Min")) } catch (error) {}
}

function WndSetup_ObjEnDis()
{
	if (SetupWnd.Button_IsChecked("ChkStatus"))
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("CmbStatus"), 1);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtStatusMin"), 1);
	}
	else
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("CmbStatus"), 0);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtStatusMin"), 0);
	}
	if (SetupWnd.Button_IsChecked("ChkName"))
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtNameTxt"), 1);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtNameMin"), 1);
	}
	else
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtNameTxt"), 0);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtNameMin"), 0);
	}
	if (SetupWnd.Button_IsChecked("ChkPSM"))
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtPSMTxt"), 1);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtPSMMin"), 1);
	}
	else
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtPSMTxt"), 0);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtPSMMin"), 0);
	}
	if (SetupWnd.Button_IsChecked("ChkSignout"))
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtSignoutMin"), 1);
	}
	else
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtSignoutMin"), 0);
	}
	if (SetupWnd.Button_IsChecked("ChkLaunch"))
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtLaunchTxt"), 1);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtLaunchMin"), 1);
	}
	else
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtLaunchTxt"), 0);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtLaunchMin"), 0);
	}
	if (SetupWnd.Button_IsChecked("ChkShutdown"))
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("CmbShutdown"), 1);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtShutdownMin"), 1);
	}
	else
	{
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("CmbShutdown"), 0);
		Interop.Call("user32","EnableWindow", SetupWnd.GetControlHandle("EdtShutdownMin"), 0);
	}
}

function WndSetup_FormVal()
{
	if (SetupWnd.Button_IsChecked("ChkStatus"))
	{
		if (SetupWnd.Combo_GetCurSel("CmbStatus") == -1)
		{
			ErrorMsg += "\nA status hasn\'t been selected from the drop-down.";
		}
		if (SetupWnd.GetControlText("EdtStatusMin") == "")
		{
			ErrorMsg += "\nA status change time limit hasn\'t been entered.";
		}
		else if (typeof parseInt(SetupWnd.GetControlText("EdtStatusMin")) === 'number' ? parseInt(SetupWnd.GetControlText("EdtStatusMin")) : 0) {} else
		{
			ErrorMsg += "\nA status change time limit hasn\'t been entered correctly.";
		}
	}
	if (SetupWnd.Button_IsChecked("ChkName"))
	{
		if (SetupWnd.GetControlText("EdtNameTxt") == "")
		{
			ErrorMsg += "\nA name value hasn\'t been entered.";
		}
		if (SetupWnd.GetControlText("EdtNameMin") == "")
		{
			ErrorMsg += "\nA name change time limit hasn\'t been entered.";
		}
		else if (typeof parseInt(SetupWnd.GetControlText("EdtNameMin")) === 'number' ? parseInt(SetupWnd.GetControlText("EdtNameMin")) : 0) {} else
		{
			ErrorMsg += "\nA name change time limit hasn\'t been entered correctly.";
		}
	}
	if (SetupWnd.Button_IsChecked("ChkPSM"))
	{
		if (SetupWnd.GetControlText("EdtPSMTxt") == "")
		{
			ErrorMsg += "\nA PSM value hasn\'t been entered.";
		}
		if (SetupWnd.GetControlText("EdtPSMMin") == "")
		{
			ErrorMsg += "\nA PSM change time limit hasn\'t been entered.";
		}
		else if (typeof parseInt(SetupWnd.GetControlText("EdtPSMMin")) === 'number' ? parseInt(SetupWnd.GetControlText("EdtPSMMin")) : 0) {} else
		{
			ErrorMsg += "\nA PSM change time limit hasn\'t been entered correctly.";
		}
	}
	if (SetupWnd.Button_IsChecked("ChkSignout"))
	{
		if (SetupWnd.GetControlText("EdtSignoutMin") == "")
		{
			ErrorMsg += "\nA automatic sign-out time limit hasn\'t been entered.";
		}
		else if (typeof parseInt(SetupWnd.GetControlText("EdtSignoutMin")) === 'number' ? parseInt(SetupWnd.GetControlText("EdtSignoutMin")) : 0) {} else
		{
			ErrorMsg += "\nA automatic sign-out time limit hasn\'t been entered correctly.";
		}
	}
	if (SetupWnd.Button_IsChecked("ChkLaunch"))
	{
		if (SetupWnd.GetControlText("EdtLaunchTxt") == "")
		{
			ErrorMsg += "\nA file path hasn\'t been entered.";
		}
		else if (!FlSysObj.FileExists(SetupWnd.GetControlText("EdtLaunchTxt")))
		{
			ErrorMsg += "\nA file path hasn\'t been entered correctly.";
		}
		if (SetupWnd.GetControlText("EdtLaunchMin") == "")
		{
			ErrorMsg += "\nA file launch time limit hasn\'t been entered.";
		}
		else if (typeof parseInt(SetupWnd.GetControlText("EdtLaunchMin")) === 'number' ? parseInt(SetupWnd.GetControlText("EdtLaunchMin")) : 0) {} else
		{
			ErrorMsg += "\nA file launch time limit hasn\'t been entered correctly.";
		}
	}
	if (SetupWnd.Button_IsChecked("ChkShutdown"))
	{
		if (SetupWnd.Combo_GetCurSel("CmbShutdown") == -1)
		{
			ErrorMsg += "\nA shutdown task hasn\'t been selected from the drop-down.";
		}
		if (SetupWnd.GetControlText("EdtShutdownMin") == "")
		{
			ErrorMsg += "\nA shutdown time limit hasn\'t been entered.";
		}
		else if (typeof parseInt(SetupWnd.GetControlText("EdtShutdownMin")) === 'number' ? parseInt(SetupWnd.GetControlText("EdtShutdownMin")) : 0) {} else
		{
			ErrorMsg += "\nA shutdown time limit hasn\'t been entered correctly.";
		}
	}
}

function WndSetup_SavePref()
{
	if (ErrorMsg == "")
	{
		WriteRegistry("Status", "Chk", SetupWnd.Button_IsChecked("ChkStatus"), true);
		WriteRegistry("Status", "Cmb", SetupWnd.Combo_GetCurSel("CmbStatus"), true);
		WriteRegistry("Status", "Min", SetupWnd.GetControlText("EdtStatusMin"), true);
		WriteRegistry("Name", "Chk", SetupWnd.Button_IsChecked("ChkName"), true);
		WriteRegistry("Name", "Edt", SetupWnd.GetControlText("EdtNameTxt"), true);
		WriteRegistry("Name", "Min", SetupWnd.GetControlText("EdtNameMin"), true);
		WriteRegistry("PSM", "Chk", SetupWnd.Button_IsChecked("ChkPSM"), true);
		WriteRegistry("PSM", "Edt", SetupWnd.GetControlText("EdtPSMTxt"), true);
		WriteRegistry("PSM", "Min", SetupWnd.GetControlText("EdtPSMMin"), true);
		WriteRegistry("Signout", "Chk", SetupWnd.Button_IsChecked("ChkSignout"), true);
		WriteRegistry("Signout", "Min", SetupWnd.GetControlText("EdtSignoutMin"), true);
		WriteRegistry("Launch", "Chk", SetupWnd.Button_IsChecked("ChkLaunch"), true);
		WriteRegistry("Launch", "Edt", SetupWnd.GetControlText("EdtLaunchTxt"), true);
		WriteRegistry("Launch", "Min", SetupWnd.GetControlText("EdtLaunchMin"), true);
		WriteRegistry("Shutdown", "Chk", SetupWnd.Button_IsChecked("ChkShutdown"), true);
		WriteRegistry("Shutdown", "Cmb", SetupWnd.Combo_GetCurSel("CmbShutdown"), true);
		WriteRegistry("Shutdown", "Min", SetupWnd.GetControlText("EdtShutdownMin"), true);
		Interop.Call('user32', 'MessageBoxW', SetupWnd.Handle, 'Your preferences have been saved.', 'Idle Manager', 64);
		SetupWnd.Close(0);
	}
	else
	{
		Interop.Call('user32', 'MessageBoxW', SetupWnd.Handle, 'One or more problems have occured:\n' + ErrorMsg, 'Idle Manager', 64);
		ErrorMsg = "";
	}
}

function OnWndSetupEvent_CtrlClicked(objWnd, strControlId)
{
	switch (strControlId)
	{
		case "BtnSave":
			WndSetup_FormVal();
			WndSetup_SavePref();
			break;
		default:
			WndSetup_ObjEnDis();
			break;
	}
}
