/*
File: WndOptionsGeneral.js
Events for processing the miscellaneous options window.
*/

function OnWndOptionsGeneralEvent_Build()
{
	Debugging.Call("WndOptionsGeneral / Build", {});
	CloseWnd(WndOptionsGeneral);
	WndOptionsGeneral = OpenWnd("Options", "Options", "General");
	WndOptionsGeneral.SetControlText("EdtCode", Registry.Read("Options\\EdtCode"));
	for (var X in EnumOptionsDouble)
	{
		WndOptionsGeneral.Combo_AddItem("CmbDouble", EnumOptionsDouble[X]); // populate
	}
	WndOptionsGeneral.Combo_SetCurSel("CmbDouble", Registry.Read("Options\\CmbDouble"));
}

function OnWndOptionsGeneralEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndOptionsGeneral / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		Enable(WndOptionsGeneral, "BtnSave", WndOptionsGeneral.GetControlText("EdtCode") !== ""); // enable if value specified
		if (ControlId === "BtnSave")
		{
			Registry.Write("Options\\EdtCode", WndOptionsGeneral.GetControlText("EdtCode"));
			Registry.Write("Options\\CmbDouble", WndOptionsGeneral.Combo_GetCurSel("CmbDouble"), "REG_DWORD");
			CloseWnd(WndOptionsGeneral); // done
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndOptionsGeneralEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndOptionsGeneral / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndOptionsGeneralEvent_CtrlClicked(WndOptionsGeneral, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndOptionsGeneralEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndOptionsGeneral / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		try // if this window was closed first
		{
			Enable(WndOptionsMenu, "BtnGeneral", 1);
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
