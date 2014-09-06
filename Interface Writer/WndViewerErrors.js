/*
File: WndViewerErrors.js
Events for processing interface XML errors with the viewer.
*/

function OnWndViewerErrorsEvent_Build(Errors, Fatal)
{
	Debugging.Call("WndViewerErrors / Build", {"Errors" : Errors, "Fatal" : Fatal});
	CloseWnd(WndViewerErrors);
	CloseWnd(WndViewerManager, 1);
	WndViewerErrors = OpenWnd("Viewer", "Viewer", "Errors");
	WndViewerErrors.RichEdit_SetCharFormat("EdtLog", false, -1, -1, -1, -1, -1, -1, Registry.Read("Options\\EdtCode"));
	WndViewerErrors.SetControlText("EdtLog", Errors);
	if (Fatal) // XML parse error or equivalent
	{
		Enable(WndViewerErrors, "BtnLoad", 0); // no, you can't load it
	}
}

function OnWndViewerErrorsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndViewerErrors / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnLoad": // alright then, load it...
				NowEditing = 2;
				OnWndViewerManagerEvent_Build();
				WndViewerManager.SetControlText("EdtPath", FilePath);
				for (var X in Interface.Window)
				{
					WndViewerManager.Combo_AddItem("CmbWindows", Interface.Window[X], 0, "Window");
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndViewerErrorsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndViewerErrors", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		if (ExitCode !== 1)
		{
			if (NowEditing === 0)
			{
				VarCleanup();
			}
			OnWndViewerManagerEvent_Build();
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
