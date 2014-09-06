/*
File: WndOptionsMenu.js
Events for processing the options menu clicks, as well as enabling/disabling buttons.
*/

function OnWndOptionsMenuEvent_Build()
{
	Debugging.Call("WndOptionsMenu / Build", {});
	CloseWnd(WndOptionsDebug);
	CloseWnd(WndOptionsFormat);
	CloseWnd(WndOptionsGeneral);
	CloseWnd(WndOptionsMenu);
	CloseWnd(WndOptionsSaving);
	CloseWnd(WndWriterSourceCode); // close all sub-windows first
	WndOptionsMenu = OpenWnd("Options", "Options", "Menu");
}

function OnWndOptionsMenuEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndOptionsMenu / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnGeneral":
				OnWndOptionsGeneralEvent_Build();
				break;
			case "BtnSaving":
				OnWndOptionsSavingEvent_Build();
				break;
			case "BtnFormat":
				OnWndOptionsFormatEvent_Build();
				break;
			case "BtnDebug":
				OnWndOptionsDebugEvent_Build();
				break;
			case "BtnDefault": // reset settings
				if (Dialog.Show("Options...", "Are you sure you wish to reset all settings to their defaults\nThis action is permanent and cannot be undone.", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, WndOptionsMenu) === Dialog.Result.Yes) // close sub-windows, then set defaults
				{
					CloseWnd(WndOptionsDebug);
					CloseWnd(WndOptionsFormat);
					CloseWnd(WndOptionsGeneral);
					CloseWnd(WndOptionsSaving);
					Registry.Write("Options\\EdtCode", "Lucida Console");
					Registry.Write("Options\\CmbDouble", 0, "REG_DWORD");
					Registry.Write("Options\\ChkSaveAction", 0, "REG_DWORD");
					Registry.Write("Options\\ChkSaveMins", 0, "REG_DWORD");
					Registry.Write("Options\\EdtSaveMins", 2, "REG_DWORD");
					Registry.Write("Options\\ChkBackup", 1, "REG_DWORD");
					Registry.Write("Options\\ChkTabs", 1, "REG_DWORD");
					Registry.Write("Options\\ChkSystemTags", 1, "REG_DWORD");
					Registry.Write("Options\\ChkDebug", 0, "REG_DWORD");
					Registry.Write("Options\\ChkDebugNotif", 0, "REG_DWORD");
					Registry.Write("Options\\ChkDebugTimer", 0, "REG_DWORD");
				}
				break;
		}
		if (ControlId !== "BtnDefault" && ControlId !== "BtnCancel") // a sub-window was open
		{
			Enable(WndOptionsMenu, ControlId, 0); // disable relative button
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndOptionsMenuEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndOptionsMenu / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndOptionsDebug);
		CloseWnd(WndOptionsFormat);
		CloseWnd(WndOptionsGeneral);
		CloseWnd(WndOptionsSaving);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
