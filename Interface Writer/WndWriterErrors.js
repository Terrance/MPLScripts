/*
File: WndWriterErrors.js
Events for processing interface XML errors in the editor.
*/

function OnWndWriterErrorsEvent_Build(Errors, Fatal)
{
	Debugging.Call("WndWriterErrors / Build", {});
	CloseWnd(WndWriterErrors);
	WndWriterErrors = OpenWnd("Writer", "Writer", "Errors");
	WndWriterErrors.RichEdit_SetCharFormat("EdtLog", false, -1, -1, -1, -1, -1, -1, Registry.Read("Options\\EdtCode"));
	WndWriterErrors.SetControlText("EdtLog", Errors);
	if (Fatal) // XML parse error or equivalent
	{
		Enable(WndWriterErrors, "BtnLoad", 0);
	}
	if (FileLoadImport) // are we importing instead of loading?
	{
		WndWriterErrors.SetControlText("BtnLoad", "&Import");
	}
}

function OnWndWriterErrorsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterErrors / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnLoad": // good, let's load it then
				NowEditing = 1;
				CloseWnd(WndWriterErrors, 1);
				if (FileLoadImport)
				{
					ProcessAutoSave();
					OnWndWriterManageWindowsEvent_Populate();
					OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" imported successfully.");
				}
				else
				{
					OnWndWriterManageWindowsEvent_Build();
					OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" loaded successfully.");
				}
				FileLoadImport = false;
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterErrorsEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterErrors / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		if (ExitCode !== 1)
		{
			if (NowEditing === 0)
			{
				VarCleanup();
			}
			if (!FileLoadImport)
			{
				OnEvent_MenuClicked("Load"); // load another file
			}
			FileLoadImport = false;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
