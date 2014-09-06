function OnWndHotkeysEvent_Build()
{
	QK_MGROPN = true; // flag to show manager already open
	WND_HTK = MsgPlus.CreateWnd("Windows.xml", "WndHotkeys", 0); // open the manager window
	QK_MGRVLDR = false; // do not validate whilst entering data
	WND_HTK.SetControlText("EdtChats", AR_LTR[HTK_CHATS]); // set the "Messenger Conversations" hotkey to the edit control
	WND_HTK.SetControlText("EdtInfo", AR_LTR[HTK_INFO]); // set the "Messenger Information" hotkey to the edit control
	WND_HTK.SetControlText("EdtLstCnts", AR_LTR[HTK_LSTCNTS]); // set the "Messenger Contact List" hotkey to the edit control
	WND_HTK.SetControlText("EdtManager", AR_LTR[HTK_MANAGER]); // set the "QuickKey Hotkey Manager" hotkey to the edit control
	WND_HTK.SetControlText("EdtOptions", AR_LTR[HTK_OPTIONS]); // set the "QuickKey Options" hotkey to the edit control
	WND_HTK.SetControlText("EdtStatus", AR_LTR[HTK_STATUS]); // set the "Messenger Status" hotkey to the edit control
	WND_HTK.Button_SetCheckState("ChkAlt", HTK_ALT); // set the "Alt" hotkey modifier usage to the checkbox control
	WND_HTK.Button_SetCheckState("ChkCtrl", HTK_CTRL); // set the "Ctrl" hotkey modifier usage to the checkbox control
	WND_HTK.Button_SetCheckState("ChkShift", HTK_SHIFT); // set the "Shift" hotkey modifier usage to the checkbox control
	WND_HTK.Button_SetCheckState("ChkWin", HTK_WIN); // set the "Win" hotkey modifier usage to the checkbox control
	Interop.Call("user32", "EnableWindow", WND_HTK.GetControlHandle("BtnSave"), 1); // enable the Save button
	QK_MGRVLDR = true; // resume validation on changes
}

function OnWndHotkeysEvent_CtrlClicked(PlusWnd, ControlId)
{
	if (ControlId === "BtnSave") // if the save button was clicked
	{
		HTK_CHATS = AR_LTR[PlusWnd.GetControlText("EdtChats")]; // store the "Messenger Conversations" hotkey
		HTK_INFO = AR_LTR[PlusWnd.GetControlText("EdtInfo")]; // store the "Messenger Information" hotkey
		HTK_LSTCNTS = AR_LTR[PlusWnd.GetControlText("EdtLstCnts")]; // store the "Messenger Contact List" hotkey
		HTK_MANAGER = AR_LTR[PlusWnd.GetControlText("EdtManager")]; // store the "QuickKey Hotkey Manager" hotkey
		HTK_OPTIONS = AR_LTR[PlusWnd.GetControlText("EdtOptions")]; // store the "QuickKey Options" hotkey
		HTK_STATUS = AR_LTR[PlusWnd.GetControlText("EdtStatus")]; // store the "Messenger Status" hotkey
		HTK_ALT = PlusWnd.Button_IsChecked("ChkAlt"); // store the "Alt" hotkey modifier usage to the checkbox control
		HTK_CTRL = PlusWnd.Button_IsChecked("ChkCtrl"); // store the "Ctrl" hotkey modifier usage to the checkbox control
		HTK_SHIFT = PlusWnd.Button_IsChecked("ChkShift"); // store the "Shift" hotkey modifier usage to the checkbox control
		HTK_WIN = PlusWnd.Button_IsChecked("ChkWin"); // store the "Win" hotkey modifier usage to the checkbox control
		PlusWnd.Close(0); // close the manager window
		Debug.Trace("Function called: OnEvent_Uninitialize");
		OnEvent_Uninitialize(); // unload hotkeys
		Debug.Trace("Function called: OnEvent_Initialize");
		OnEvent_Initialize(); // reload hotkeys
	}
	else if (ControlId.substr(0, 3) === "Chk")
	{
		OnWndHotkeysEvent_EditTextChanged(PlusWnd, "EdtManager");
	}
}

function OnWndHotkeysEvent_EditTextChanged(PlusWnd, ControlId)
{
	if (QK_MGRVLDR) // if validation is not disabled (for recursion reasons)
	{
		var TMP_KEY = PlusWnd.GetControlText(ControlId).charAt(0).toUpperCase(); // get the changed key
		QK_MGRVLDR = false; // do not validate whilst entering data
		PlusWnd.SetControlText(ControlId, TMP_KEY); // change the key
		QK_MGRVLDR = true; // resume validation on changes
		var TMP_KEYS = new Array("EdtChats", "EdtInfo", "EdtLstCnts", "EdtManager", "EdtOptions", "EdtStatus"); // get the names of other key fields
		for (var TMP_OKEY in TMP_KEYS) // for each key field
		{
			if (TMP_KEYS[TMP_OKEY] === ControlId) // if this key is the changed key
			{
				delete TMP_KEYS[TMP_OKEY]; // remove it from the list
			}
			TMP_KEYS[TMP_OKEY] = PlusWnd.GetControlText(TMP_KEYS[TMP_OKEY]); // get the key value
		}
		var TMP_UNQ = true; // default value (all keys are unique)
		var TMP_VLD = (/[A-Z0-9]/).exec(TMP_KEY) !== null || TMP_KEY === ""; // if the changed key
		var TMP_CHK = (PlusWnd.GetControlText("EdtManager") !== "") && (PlusWnd.Button_IsChecked("ChkAlt") || PlusWnd.Button_IsChecked("ChkCtrl") || PlusWnd.Button_IsChecked("ChkShift") || PlusWnd.Button_IsChecked("ChkWin")); // if the "QuickKey Hotkey Manager" edit control isn't empty and at least one checkbox control is checked
		for (var TMP_OKEY in TMP_KEYS) // for each key
		{
			if (TMP_KEYS[TMP_OKEY] === TMP_KEY && TMP_KEYS[TMP_OKEY] !== "") // if a key matches with another, and that match is not itself
			{
				TMP_UNQ = false; // not unique
				break;
			}
		}
		if (TMP_UNQ && TMP_VLD && TMP_CHK) // if all keys are unique and valid
		{
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnSave"), 1); // enable the Save button
		}
		else // if the keys are not unique
		{
			Interop.Call("user32", "EnableWindow", PlusWnd.GetControlHandle("BtnSave"), 0); // disable the Save button
		}
	}
}

function OnWndHotkeysEvent_Destroyed(PlusWnd, ExitCode)
{
	QK_MGROPN = false; // flag to show manager no longer open
}
