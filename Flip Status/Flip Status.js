/*

STATUS_INVISIBLE (2) | Appear Offline
STATUS_ONLINE (3)    | Available/Online
STATUS_BUSY (4)      | Busy
STATUS_BRB (5)       | Be Right Back
STATUS_IDLE (6)      | Idle
STATUS_AWAY (7)      | Away
STATUS_INCALL (8)    | In a Call
STATUS_OUTLUNCH (9)  | Out to Lunch

*/

var Enabled = false;

var WLM = 14;
var Mode = 1;
var Refresh = 1000;

var CustomS = new Array();
CustomS[3] = true;

var OldStatus;

var TmpWnd1;
var TmpWnd2;

function OnEvent_Initialize (MessengerStart)
{
	MsgPlus.AddTimer("FlipStatus", Refresh);
}

function OnGetScriptMenu (nLocation)
{
	Menu = '<ScriptMenu>';
	
	if (Enabled == true)
	{
		Menu += '<MenuEntry Id=\"Enabled\">Disable Flip Status...</MenuEntry>';
	}
	else
	{
		Menu += '<MenuEntry Id=\"Enabled\">Enable Flip Status...</MenuEntry>';
	}
	
	Menu += '<Separator/>';
	
	Menu += '<MenuEntry Id=\"WLM\" Enabled=\"false\">Messenger: ' + WLM + '</MenuEntry>';
	
	if (Mode == 1)
	{
		Menu += '<MenuEntry Id=\"Mode\" Enabled=\"false\">Statuses: All</MenuEntry>';
	}
	if (Mode == 2)
	{
		Menu += '<MenuEntry Id=\"Mode\" Enabled=\"false\">Statuses: On/Off</MenuEntry>';
	}
	if (Mode == 3)
	{
		Menu += '<MenuEntry Id=\"Mode\" Enabled=\"false\">Statuses: Custom</MenuEntry>';
	}
	
	Menu += '<MenuEntry Id=\"Refresh\" Enabled=\"false\">Refresh: ' + Refresh + '</MenuEntry>';
	
	Menu += '<Separator/>';
	
	Menu += '<MenuEntry Id=\"Settings\">Flip Status Settings...</MenuEntry>';
	
	Menu += '<Separator/>';
	
	Menu += '<MenuEntry Id=\"About\">About Flip Status...</MenuEntry>';
	
	Menu += '</ScriptMenu>';
 	 	
	return Menu;
}

function OnEvent_MenuClicked (sMenuId, nLocation, iOriginWnd)
{
	if (sMenuId == "Enabled")
	{
		if (Enabled)
		{
			Enabled = false;
			Messenger.MyStatus = OldStatus;
		}
		else
		{
			OldStatus = Messenger.MyStatus;
			Enabled = true;
		}
		Debug.Trace("New Enabled: " + Enabled);
	}
	if (sMenuId == "Settings")
	{
		TmpWnd1 = MsgPlus.CreateWnd("Windows.xml", "WndSettings", 0);
		try
		{
			if (Enabled)
			{
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Enable"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("WLM_9"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("WLM_14"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_1"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_2"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Refresh"), 0);
				TmpWnd1.SetControlText("InfoTxt5", "Flip Status is currently enabled.");
			}
			else
			{
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Disable"), 0);
			}
			if (Mode == 1)
			{
				TmpWnd1.Button_SetCheckState("Mode_1", true);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 0);
			}
			else if (Mode == 2)
			{
				TmpWnd1.Button_SetCheckState("Mode_2", true);
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 0);
			}
			else if (Mode == 3)
			{
				TmpWnd1.Button_SetCheckState("Mode_3", true);
			}
			if (WLM == 9)
			{
				TmpWnd1.Button_SetCheckState("WLM_9", true);
			}
			else if (WLM == 14)
			{
				TmpWnd1.Button_SetCheckState("WLM_14", true);
			}
			TmpWnd1.SetControlText("Refresh", Refresh);
			if (WLM == 9 && Mode == 1)
			{
				CustomS[2] = false;
				CustomS[4] = true;
				CustomS[5] = true;
				CustomS[7] = true;
				CustomS[8] = true;
				CustomS[9] = true;
			}
			else if (WLM == 14 && Mode == 1)
			{
				CustomS[2] = false;
				CustomS[4] = true;
				CustomS[5] = false;
				CustomS[7] = true;
				CustomS[8] = false;
				CustomS[9] = false;
			}
			else if (Mode == 2)
			{
				CustomS[2] = true;
				CustomS[4] = false;
				CustomS[5] = false;
				CustomS[7] = false;
				CustomS[8] = false;
				CustomS[9] = false;
			}
		}
		catch (e)
		{
		}
	}
	if (sMenuId == "About")
	{
		MsgPlus.CreateWnd("Windows.xml", "WndAbout", 0);
	}
}

function OnWndSettingsEvent_CtrlClicked (objWnd, strControlId)
{
	try
	{
		TmpWnd2.Close(0);
	}
	catch (e)
	{
	}
	switch (strControlId)
	{
		case "Mode_3Edit":
			TmpWnd2 = MsgPlus.CreateWnd("Windows.xml", "WndSetCustom", 0);
			TmpWnd2.Button_SetCheckState("Online", true);
			Interop.Call("user32","EnableWindow", TmpWnd2.GetControlHandle("Online"), 0);
			if (WLM == 14)
			{
				Interop.Call("user32","EnableWindow", TmpWnd2.GetControlHandle("BeRightBack"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd2.GetControlHandle("InaCall"), 0);
				Interop.Call("user32","EnableWindow", TmpWnd2.GetControlHandle("OuttoLunch"), 0);
			}
			if (CustomS[2])
			{
				TmpWnd2.Button_SetCheckState("AppearOffline", true);
			}
			if (CustomS[4])
			{
				TmpWnd2.Button_SetCheckState("Busy", true);
			}
			if (CustomS[5])
			{
				TmpWnd2.Button_SetCheckState("BeRightBack", true);
			}
			if (CustomS[7])
			{
				TmpWnd2.Button_SetCheckState("Away", true);
			}
			if (CustomS[8])
			{
				TmpWnd2.Button_SetCheckState("InaCall", true);
			}
			if (CustomS[9])
			{
				TmpWnd2.Button_SetCheckState("OuttoLunch", true);
			}
			break;
		case "Enable":
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Enable"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Disable"), 1);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("WLM_9"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("WLM_14"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_1"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_2"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Refresh"), 0);
			TmpWnd1.SetControlText("InfoTxt5", "Flip Status is currently enabled.");
			OldStatus = Messenger.MyStatus;
			Enabled = true;
			break;
		case "Disable":
			Enabled = false;
			Messenger.MyStatus = OldStatus;
			TmpWnd1.SetControlText("Refresh", Refresh);
			TmpWnd1.SetControlText("InfoTxt5", "Flip Status is currently disabled.");
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Enable"), 1);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Disable"), 0);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("WLM_9"), 1);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("WLM_14"), 1);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_1"), 1);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_2"), 1);
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3"), 1);
			if (TmpWnd1.Button_IsChecked("Mode_3"))
			{
				Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 1);
			}
			Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Refresh"), 1);
			break;
		case "Ok":
			objWnd.Close(0);
			break;
		default:
			try
			{
				if (TmpWnd1.Button_IsChecked("WLM_9"))
				{
					WLM = 9;
				}
				else if (TmpWnd1.Button_IsChecked("WLM_14"))
				{
					WLM = 14;
				}
				if (TmpWnd1.Button_IsChecked("Mode_1"))
				{
					Mode = 1;
					Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 0);
				}
				else if (TmpWnd1.Button_IsChecked("Mode_2"))
				{
					Mode = 2;
					Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 0);
				}
				else if (TmpWnd1.Button_IsChecked("Mode_3"))
				{
					Mode = 3;
					Interop.Call("user32","EnableWindow", TmpWnd1.GetControlHandle("Mode_3Edit"), 1);
				}
				if (WLM == 9 && Mode == 1)
				{
					CustomS[2] = false;
					CustomS[4] = true;
					CustomS[5] = true;
					CustomS[7] = true;
					CustomS[8] = true;
					CustomS[9] = true;
				}
				else if (WLM == 14 && Mode == 1)
				{
					CustomS[2] = false;
					CustomS[4] = true;
					CustomS[5] = false;
					CustomS[7] = true;
					CustomS[8] = false;
					CustomS[9] = false;
				}
				else if (Mode == 2)
				{
					CustomS[2] = true;
					CustomS[4] = false;
					CustomS[5] = false;
					CustomS[7] = false;
					CustomS[8] = false;
					CustomS[9] = false;
				}
			}
			catch (e)
			{
			}
			break;
	}
}

function OnWndSettingsEvent_EditTextChanged (objWnd, strControlId)
{
	switch (strControlId)
	{
		case "Refresh":
			Refresh = TmpWnd1.GetControlText("Refresh");
			break;
	}
}

function OnWndSetCustomEvent_CtrlClicked (objWnd, strControlId)
{
	switch (strControlId)
	{
		case "Ok":
			if (TmpWnd2.Button_IsChecked("AppearOffline"))
			{
				CustomS[2] = true;
			}
			else
			{
				CustomS[2] = false;
			}
			if (TmpWnd2.Button_IsChecked("Busy"))
			{
				CustomS[4] = true;
			}
			else
			{
				CustomS[4] = false;
			}
			if (TmpWnd2.Button_IsChecked("BeRightBack"))
			{
				CustomS[5] = true;
			}
			else
			{
				CustomS[5] = false;
			}
			if (TmpWnd2.Button_IsChecked("Away"))
			{
				CustomS[7] = true;
			}
			else
			{
				CustomS[7] = false;
			}
			if (TmpWnd2.Button_IsChecked("InaCall"))
			{
				CustomS[8] = true;
			}
			else
			{
				CustomS[8] = false;
			}
			if (TmpWnd2.Button_IsChecked("OuttoLunch"))
			{
				CustomS[9] = true;
			}
			else
			{
				CustomS[9] = false;
			}
			objWnd.Close(0);
			break;
		case "Cancel":
			objWnd.Close(0);
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

function OnEvent_Timer (TimerId)
{
	if (TimerId == "FlipStatus")
	{
		if (Enabled == true)
		{
			if (Mode == 1)
			{
				if (WLM == 9)
				{
					switch (Messenger.MyStatus)
					{
						case 3:
							Messenger.MyStatus = 4;
							break;
						case 4:
							Messenger.MyStatus = 5;
							break;
						case 5:
							Messenger.MyStatus = 7;
							break;
						case 7:
							Messenger.MyStatus = 8;
							break;
						case 8:
							Messenger.MyStatus = 9;
							break;
						case 9:
							Messenger.MyStatus = 3;
							break;
						default:
							Messenger.MyStatus = 3;
							break;
					}
				}
				else if (WLM == 14)
				{
					switch (Messenger.MyStatus)
					{
						case 3:
							Messenger.MyStatus = 4;
							break;
						case 4:
							Messenger.MyStatus = 7;
							break;
						case 7:
							Messenger.MyStatus = 3;
							break;
						default:
							Messenger.MyStatus = 3;
							break;
					}
				}
			}
			else if (Mode == 2)
			{
				switch (Messenger.MyStatus)
				{
					case 2:
						Messenger.MyStatus = 3;
						break;
					case 3:
						Messenger.MyStatus = 2;
						break;
					default:
						Messenger.MyStatus = 3;
						break;
				}
			}
			else if (Mode == 3)
			{
				switch (Messenger.MyStatus)
				{
					case 3:
						if (CustomS[4])
						{
							Messenger.MyStatus = 4;
						}
						else if (CustomS[5])
						{
							Messenger.MyStatus = 5;
						}
						else if (CustomS[7])
						{
							Messenger.MyStatus = 7;
						}
						else if (CustomS[8])
						{
							Messenger.MyStatus = 8;
						}
						else if (CustomS[9])
						{
							Messenger.MyStatus = 9;
						}
						else if (CustomS[2])
						{
							Messenger.MyStatus = 2;
						}
						break;
					case 4:
						if (CustomS[5])
						{
							Messenger.MyStatus = 5;
						}
						else if (CustomS[7])
						{
							Messenger.MyStatus = 7;
						}
						else if (CustomS[8])
						{
							Messenger.MyStatus = 8;
						}
						else if (CustomS[9])
						{
							Messenger.MyStatus = 9;
						}
						else if (CustomS[2])
						{
							Messenger.MyStatus = 2;
						}
						else if (CustomS[3])
						{
							Messenger.MyStatus = 3;
						}
						break;
					case 5:
						if (CustomS[7])
						{
							Messenger.MyStatus = 7;
						}
						else if (CustomS[8])
						{
							Messenger.MyStatus = 8;
						}
						else if (CustomS[9])
						{
							Messenger.MyStatus = 9;
						}
						else if (CustomS[2])
						{
							Messenger.MyStatus = 2;
						}
						else if (CustomS[3])
						{
							Messenger.MyStatus = 3;
						}
						else if (CustomS[4])
						{
							Messenger.MyStatus = 4;
						}
						break;
					case 7:
						if (CustomS[8])
						{
							Messenger.MyStatus = 8;
						}
						else if (CustomS[9])
						{
							Messenger.MyStatus = 9;
						}
						else if (CustomS[2])
						{
							Messenger.MyStatus = 2;
						}
						else if (CustomS[3])
						{
							Messenger.MyStatus = 3;
						}
						else if (CustomS[4])
						{
							Messenger.MyStatus = 4;
						}
						else if (CustomS[5])
						{
							Messenger.MyStatus = 5;
						}
						break;
					case 8:
						if (CustomS[9])
						{
							Messenger.MyStatus = 9;
						}
						else if (CustomS[2])
						{
							Messenger.MyStatus = 2;
						}
						else if (CustomS[3])
						{
							Messenger.MyStatus = 3;
						}
						else if (CustomS[4])
						{
							Messenger.MyStatus = 4;
						}
						else if (CustomS[5])
						{
							Messenger.MyStatus = 5;
						}
						else if (CustomS[7])
						{
							Messenger.MyStatus = 7;
						}
						break;
					case 9:
						if (CustomS[2])
						{
							Messenger.MyStatus = 2;
						}
						else if (CustomS[3])
						{
							Messenger.MyStatus = 3;
						}
						else if (CustomS[4])
						{
							Messenger.MyStatus = 4;
						}
						else if (CustomS[5])
						{
							Messenger.MyStatus = 5;
						}
						else if (CustomS[7])
						{
							Messenger.MyStatus = 7;
						}
						else if (CustomS[8])
						{
							Messenger.MyStatus = 8;
						}
						break;
					case 2:
						if (CustomS[3])
						{
							Messenger.MyStatus = 3;
						}
						else if (CustomS[4])
						{
							Messenger.MyStatus = 4;
						}
						else if (CustomS[5])
						{
							Messenger.MyStatus = 5;
						}
						else if (CustomS[7])
						{
							Messenger.MyStatus = 7;
						}
						else if (CustomS[8])
						{
							Messenger.MyStatus = 8;
						}
						else if (CustomS[9])
						{
							Messenger.MyStatus = 9;
						}
						break;
					default:
						Messenger.MyStatus = 3;
						break;
				}
			}
		}
		try
		{
			MsgPlus.AddTimer("FlipStatus", Refresh);
		}
		catch (e)
		{
			Interop.Call('user32', 'MessageBoxW', TmpWnd1.Handle, 'The refresh time must be at least 100ms (1/10 of a second).\nTherefore, the refresh time has been reset to 1000ms (1 second).', 'Flip Status', 64);
			Refresh = 1000;
			MsgPlus.AddTimer("FlipStatus", Refresh);
			try
			{
				TmpWnd1.SetControlText("Refresh", Refresh);
			}
			catch (e)
			{
			}
		}
	}
}

function OnEvent_Signout (Email)
{
	Enabled = false;
}

function OnEvent_Uninitialize (MessengerExit)
{
	Enabled = false;
}
