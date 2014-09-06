/*
File: WndOptionsDebug.js
Events for processing the debugging options window.
*/

function OnWndOptionsDebugEvent_Build()
{
	Debugging.Call("WndOptionsDebug / Build", {});
	CloseWnd(WndOptionsDebug);
	WndOptionsDebug = OpenWnd("Options", "Options", "Debug");
	WndOptionsDebug.Button_SetCheckState("ChkDebug", Registry.Read("Options\\ChkDebug"));
	WndOptionsDebug.Button_SetCheckState("ChkDebugNotif", Registry.Read("Options\\ChkDebugNotif"));
	WndOptionsDebug.Button_SetCheckState("ChkDebugTimer", Registry.Read("Options\\ChkDebugTimer"));
	Enable(WndOptionsDebug, "ChkDebugNotif", WndOptionsDebug.Button_IsChecked("ChkDebug")); // enable if debug enabled
	Enable(WndOptionsDebug, "ChkDebugTimer", WndOptionsDebug.Button_IsChecked("ChkDebug"));
}

function OnWndOptionsDebugEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndOptionsDebug / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		Enable(WndOptionsDebug, "ChkDebugNotif", WndOptionsDebug.Button_IsChecked("ChkDebug")); // enable if debug enabled
		Enable(WndOptionsDebug, "ChkDebugTimer", WndOptionsDebug.Button_IsChecked("ChkDebug"));
		if (ControlId === "BtnSave")
		{
			Registry.Write("Options\\ChkDebug", Number(WndOptionsDebug.Button_IsChecked("ChkDebug")), "REG_DWORD");
			Registry.Write("Options\\ChkDebugNotif", Number(WndOptionsDebug.Button_IsChecked("ChkDebugNotif")), "REG_DWORD");
			Registry.Write("Options\\ChkDebugTimer", Number(WndOptionsDebug.Button_IsChecked("ChkDebugTimer")), "REG_DWORD");
			CloseWnd(WndOptionsDebug); // done
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndOptionsDebugEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndOptionsDebug / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		try // if this window was closed first
		{
			Enable(WndOptionsMenu, "BtnDebug", 1);
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
