/*
File: WndOptionsSaving.js
Events for processing the saving options window.
*/

function OnWndOptionsSavingEvent_Build()
{
	Debugging.Call("WndOptionsSaving / Build", {});
	CloseWnd(WndOptionsSaving);
	WndOptionsSaving = OpenWnd("Options", "Options", "Saving");
	WndOptionsSaving.Button_SetCheckState("ChkSaveAction", Registry.Read("Options\\ChkSaveAction"));
	WndOptionsSaving.Button_SetCheckState("ChkSaveMins", Registry.Read("Options\\ChkSaveMins"));
	WndOptionsSaving.SetControlText("EdtSaveMins", Registry.Read("Options\\EdtSaveMins"));
	WndOptionsSaving.Button_SetCheckState("ChkBackup", Registry.Read("Options\\ChkBackup"));
	Enable(WndOptionsSaving, "EdtSaveMins", WndOptionsSaving.Button_IsChecked("ChkSaveMins")); // enable if option on
}

function OnWndOptionsSavingEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndOptionsSaving / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		Enable(WndOptionsSaving, "EdtSaveMins", WndOptionsSaving.Button_IsChecked("ChkSaveMins")); // enable if option on
		Enable(WndOptionsSaving, "BtnSave", Number(WndOptionsSaving.GetControlText("EdtSaveMins")) !== 0); // enable if valid
		if (ControlId === "BtnSave")
		{
			Registry.Write("Options\\ChkSaveAction", Number(WndOptionsSaving.Button_IsChecked("ChkSaveAction")), "REG_DWORD");
			Registry.Write("Options\\ChkSaveMins", Number(WndOptionsSaving.Button_IsChecked("ChkSaveMins")), "REG_DWORD");
			Registry.Write("Options\\EdtSaveMins", Number(WndOptionsSaving.GetControlText("EdtSaveMins")), "REG_DWORD");
			Registry.Write("Options\\ChkBackup", Number(WndOptionsSaving.Button_IsChecked("ChkBackup")), "REG_DWORD");
			CloseWnd(WndOptionsSaving);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndOptionsSavingEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndOptionsSaving / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndOptionsSavingEvent_CtrlClicked(WndOptionsSaving, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndOptionsSavingEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndOptionsSaving / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		try // if this window was closed first
		{
			Enable(WndOptionsMenu, "BtnSaving", 1);
		}
		catch (error)
		{
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
