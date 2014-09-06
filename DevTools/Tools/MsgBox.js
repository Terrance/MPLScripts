Tool.New("MsgBox");

T["MsgBox"].I =
{
	"Name" : "Message Box",
	"Version" : "1.0",
	"Description" : "Message Box is a simple tool for generating dialog windows using the Interop.Call() function.  It can set the icon, buttons and handle of a new dialog.",
	"Author" : "Whiz @ WhizWeb Community",
	"Website" : "http://www.ww-c.co.nr"
};

T["MsgBox"].O = function(PlusWnd)
{
	PlusWnd.Combo_AddItem("CmbIcon", "None (0)");
	PlusWnd.Combo_AddItem("CmbIcon", "Error (16)");
	PlusWnd.Combo_AddItem("CmbIcon", "Question (32)");
	PlusWnd.Combo_AddItem("CmbIcon", "Alert (48)");
	PlusWnd.Combo_AddItem("CmbIcon", "Info (64)");
	PlusWnd.Combo_SetCurSel("CmbIcon", 0);
	PlusWnd.Combo_AddItem("CmbButtons", "OK (0)");
	PlusWnd.Combo_AddItem("CmbButtons", "OK, Cancel (1)");
	PlusWnd.Combo_AddItem("CmbButtons", "Abort, Retry, Ignore (2)");
	PlusWnd.Combo_AddItem("CmbButtons", "Yes, No, Cancel (3)");
	PlusWnd.Combo_AddItem("CmbButtons", "Yes, No (4)");
	PlusWnd.Combo_AddItem("CmbButtons", "Retry, Cancel (5)");
	PlusWnd.Combo_SetCurSel("CmbButtons", 0);
	PlusWnd.Combo_AddItem("CmbHandle", "No window");
	PlusWnd.Combo_AddItem("CmbHandle", "Contact list");
	PlusWnd.Combo_AddItem("CmbHandle", "Custom window:");
	PlusWnd.Combo_SetCurSel("CmbHandle", 0);
	T["MsgBox"].D("Tool opened.");
}

function OnWndMsgBoxEvent_CtrlClicked(PlusWnd, ControlId)
{
	var Title = PlusWnd.GetControlText("EdtTitle");
	var Message = PlusWnd.GetControlText("EdtMessage");
	var Icon = PlusWnd.Combo_GetCurSel("CmbIcon") * 16;
	var Buttons = PlusWnd.Combo_GetCurSel("CmbButtons");
	var Handle = PlusWnd.Combo_GetCurSel("CmbHandle");
	Handle = (Handle === 0 ? "null" : (Handle === 1 ? "Messenger.ContactListWndHandle" : PlusWnd.GetControlText("EdtHandle") + ".Handle"));
	switch (ControlId)
	{
		case "BtnAlert":
			T["MsgBox"].D("Alert preview shown.");
			Interop.Call("user32", "MessageBoxW", PlusWnd.Handle, Message, Title, Icon | Buttons);
			break;
		case "BtnCode":
			var Code = "Interop.Call(\"user32\", \"MessageBoxW\", " + Handle + ", \"" + Message + "\", \"" + Title + "\", " + Icon + " | " + Buttons + ");"
			T["MsgBox"].D("Code generated:");
			T["MsgBox"].D(Code);
			PlusWnd.SetControlText("EdtCode", Code);
			break;
	}
}

function OnWndMsgBoxEvent_ComboSelChanged(PlusWnd, ControlId)
{
	if (ControlId === "CmbHandle")
	{
		Enable(PlusWnd, "EdtHandle", PlusWnd.Combo_GetCurSel("CmbHandle") === 2);
		Enable(PlusWnd, "BtnCode", PlusWnd.Combo_GetCurSel("CmbHandle") !== 2 || (PlusWnd.Combo_GetCurSel("CmbHandle") === 2 && PlusWnd.GetControlText("EdtHandle") !== ""));
	}
}

function OnWndMsgBoxEvent_EditTextChanged(PlusWnd, ControlId)
{
	if (ControlId === "EdtHandle")
	{
		Enable(PlusWnd, "EdtHandle", PlusWnd.Combo_GetCurSel("CmbHandle") === 2);
		Enable(PlusWnd, "BtnCode", PlusWnd.Combo_GetCurSel("CmbHandle") !== 2 || (PlusWnd.Combo_GetCurSel("CmbHandle") === 2 && PlusWnd.GetControlText("EdtHandle") !== ""));
	}
}

T["MsgBox"].A = function(PlusWnd)
{
	T["MsgBox"].D("About window open.");
}

function OnWndMsgBox_AboutEvent_CtrlClicked(PlusWnd, ControlId)
{
	if (ControlId === "LnkWebsite")
	{
		ActiveX["WSS"].run("http://www.ww-c.co.nr/");
	}
}

function OnWndMsgBoxEvent_Destroyed(PlusWnd, ExitCode)
{
	T["MsgBox"].D("Tool closed.");
	Tool.Close(ExitCode);
}
