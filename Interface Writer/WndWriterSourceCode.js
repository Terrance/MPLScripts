/*
File: WndWriterSourceCode.js
Events for processing actions for displaying interface XML directly in the editor.
*/

function OnWndWriterSourceCodeEvent_Build()
{
	Debugging.Call("WndWriterSourceCode / Build", {});
	CloseWnd(Close.Wnd);
	WndWriterSourceCode = OpenWnd("Writer", "Writer", "SourceCode");
	WndWriterSourceCode.RichEdit_SetCharFormat("EdtSource", false, -1, -1, -1, -1, -1, -1, Registry.Read("Options\\EdtCode"));
	WndWriterSourceCode.SetControlText("EdtSource", SourceCode());
	if (FilePath === "")
	{
		Enable(WndWriterSourceCode, "BtnSave", 0);
	}
	WndWriterSourceCode.Combo_AddItem("CmbDisplay", "(all windows)", 0, "Folder");
	WndWriterSourceCode.Combo_SetCurSel("CmbDisplay", 0);
	for (var WndId in Interface.Window)
	{
		WndWriterSourceCode.Combo_AddItem("CmbDisplay", WndId, 0, "Window");
	}
}

function OnWndWriterSourceCodeEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSourceCode / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnSave":
				SaveFile(WndWriterSourceCode.GetControlText("EdtSource").split("\r\n"));
				OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" saved successfully.");
				break;
			case "BtnReturn":
				CloseWnd(WndWriterSourceCode);
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterSourceCodeEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterSourceCode / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var TmpSelection = WndWriterSourceCode.Combo_GetCurSel(ControlId);
		if (TmpSelection === 0)
		{
			WndWriterSourceCode.SetControlText("EdtSource", SourceCode()); // show code for all windows
		}
		else
		{
			WndWriterSourceCode.SetControlText("EdtSource", SourceCode(Writer.WndId[TmpSelection - 1])); // just show code for one window
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
