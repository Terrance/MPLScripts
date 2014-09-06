var VERSION = "2.0";

function OnEvent_SigninReady(Email)
{
	new ActiveXObject("WScript.Shell").RegWrite(VERSION);
}

// ------------------------------------------------------

var settingEnable = false;
var settingMessage = "/nudge";
var setMessageChng = false;
var settingTimer = "100";
var setTimerChng = false;
var setnoteMesCmd = true;
var setMsgPlusAM = true;
var setSignInAlert = true;

function OnWndControlEvent_CtrlClicked(objWnd, strControlId)
{
	switch(strControlId)
	{
		case "BtnEnable":
			if (settingEnable)
			{
			}
			else
			{
				settingEnable = true;
				var Message = "Activation: enabled";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  Activation: enabled");
			}
			break;
		case "BtnDisable":
			if (settingEnable)
			{
				settingEnable = false;
				var Message = "Activation: disabled";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  Activation: disabled");
			}
			else
			{
			}
			break;
		case "BtnApply":
			if (settingMessage==objWnd.GetControlText("EditMessage"))
			{
			}
			if (objWnd.GetControlText("EditMessage") == "")
			{
				var Message = "New message was not set:\n message was left blank!";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  New message was not set: message was left blank!");
			}
			else
			{
				settingMessage = objWnd.GetControlText("EditMessage");
				var Message = "New message: " + settingMessage;
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  New message: " + settingMessage);
				setnoteMesCmd = (/^\/[^\s\/]+\s*[\s\S]*$/.test(settingMessage));
				objWnd.Close(1);
			}
			if (settingTimer==objWnd.GetControlText("EditTimer"))
			{
				var Message = "New timer was not set:\n timer was left blank!";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  New timer was not set: timer was left blank!");
			}
			else if (objWnd.GetControlText("EditTimer")=="")
			{
				var Message = "New timer was not set:\n timer was left blank!";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  New timer was not set: timer was left blank!");
			}
			else if (objWnd.GetControlText("EditTimer")<100)
			{
				var Message = "New timer was not set:\ntimer was under 100ms!";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  New timer was not set: timer was under 100ms!");
			}
			else if (typeof parseInt(objWnd.GetControlText("EditTimer")) === 'number' ? parseInt(objWnd.GetControlText("EditTimer")) : 0)
			{
				settingTimer = objWnd.GetControlText("EditTimer");
				var Message = "New timer: " + settingTimer + "ms";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  New timer: " + settingTimer + " milliseconds");
				objWnd.Close(1);
			}
			else
			{
				var Message = "New timer was not set:\ntimer used invalid characters!";
				Message = MsgPlus.RemoveFormatCodes(Message);
				MsgPlus.DisplayToast("Instant Response", Message);
				Debug.Trace("Instant Response  |  New timer was not set: timer used invalid characters!");	
			}
			if (objWnd.Button_IsChecked("ChkPlusAMStyle"))
			{
				if (setMsgPlusAM)
				{
				}
				else
				{
					setMsgPlusAM = objWnd.Button_IsChecked("ChkPlusAMStyle");
					var Message = "Plus! style: " + setMsgPlusAM;
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Plus! style: " + setMsgPlusAM);
				}
			}
			else
			{
				if (setMsgPlusAM)
				{
					setMsgPlusAM = objWnd.Button_IsChecked("ChkPlusAMStyle");
					var Message = "Plus! style: " + setMsgPlusAM;
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Plus! style: " + setMsgPlusAM);
				}
			}
			if (objWnd.Button_IsChecked("ChkSignInAlert"))
			{
				if (setSignInAlert)
				{
				}
				else
				{
					setSignInAlert = objWnd.Button_IsChecked("ChkSignInAlert");
					var Message = "Sign-in Alert: " + setSignInAlert;
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Sign-in Alert: " + setSignInAlert);
				}
			}
			else
			{
				if (setSignInAlert)
				{
					setSignInAlert = objWnd.Button_IsChecked("ChkSignInAlert");
					var Message = "Sign-in Alert: " + setSignInAlert;
					Message = MsgPlus.RemoveFormatCodes(Message);
					MsgPlus.DisplayToast("Instant Response", Message);
					Debug.Trace("Instant Response  |  Sign-in Alert: " + setSignInAlert);
				}
			}
			break;
		case "BtnCancel":
			objWnd.Close(1);
			break;
	}
}

function OnEvent_Signin(Email)
{
	if (settingEnable)
	{
		MsgPlus.CreateWnd("Windows.xml", "WndSigninAlert", 0);
	}
}

function OnWndSigninAlertEvent_CtrlClicked(objWnd, strControlId)
{
	switch(strControlId)
	{
		case "BtnYes":
			settingEnable = false;
			var Message = "Activation: disabled";
			Message = MsgPlus.RemoveFormatCodes(Message);
			MsgPlus.DisplayToast("Instant Response", Message);
			Debug.Trace("Instant Response  |  Activation: disabled");
			objWnd.Close(1);
		case "BtnNo":
			objWnd.Close(1);
			break;
	}
}

function OnWndAboutEvent_CtrlClicked(objWnd, strControlId)
{
	switch(strControlId)
	{
		case "BtnOk":
			objWnd.Close(1);
			break;
	}
}
