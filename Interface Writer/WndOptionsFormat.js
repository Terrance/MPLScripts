/*
File: WndOptionsFormat.js
Events for processing the formatting options window.
*/

function OnWndOptionsFormatEvent_Build()
{
	Debugging.Call("WndOptionsFormat / Build", {});
	CloseWnd(WndOptionsFormat);
	WndOptionsFormat = OpenWnd("Options", "Options", "Format");
	WndOptionsFormat.Button_SetCheckState("ChkTabs", Registry.Read("Options\\ChkTabs"));
	WndOptionsFormat.Button_SetCheckState("ChkSystemTags", Registry.Read("Options\\ChkSystemTags"));
}

function OnWndOptionsFormatEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndOptionsFormat / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (ControlId === "BtnSave")
		{
			Registry.Write("Options\\ChkTabs", Number(WndOptionsFormat.Button_IsChecked("ChkTabs")), "REG_DWORD");
			Registry.Write("Options\\ChkSystemTags", Number(WndOptionsFormat.Button_IsChecked("ChkSystemTags")), "REG_DWORD");
			CloseWnd(WndOptionsFormat); // done
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndOptionsFormatEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndOptionsFormat / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		try // if this window was closed first
		{
			Enable(WndOptionsMenu, "BtnFormat", 1);
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
