/*
File: FnVarsWnds.js
Functions related to opening/closing Plus! windows and resetting variables on exit.
*/

function OpenWnd(File, Prefix, Wnd, Flag) // open a window, set the icons
{
	var TmpWnd = MsgPlus.CreateWnd("Interfaces\\" + File + ".xml", "Wnd" + Prefix + Wnd, (Flag === undefined ? 0 : Flag));
	Interop.Call("user32", "SendMessageW", TmpWnd.Handle, 128, 0, IconFile);
	Interop.Call("user32", "SendMessageW", TmpWnd.Handle, 128, 1, IconFile);
	return TmpWnd;
}

function CloseWnd(Wnd, Code)
{
	try // is it a window?
	{
		if (Code === undefined) // exit code?
		{
			Code = 0;
		}
		Wnd.Close(Code);
		return true;
	}
	catch (error)
	{
		try
		{
			switch (Wnd) // is it a close code?
			{
				case Close.Wnd: // window sharing violations
					CloseWnd(WndWriterAddWindow);
					CloseWnd(WndWriterBuildWindowI);
					CloseWnd(WndWriterBuildWindowM);
					CloseWnd(WndWriterEditMultiWindows);
					CloseWnd(WndWriterEditWindow);
					CloseWnd(WndWriterManageControls);
					CloseWnd(WndWriterManageElements);
					CloseWnd(WndWriterPresetWindows);
					CloseWnd(WndWriterPreviewWindow);
					CloseWnd(WndWriterSelectWindows);
					CloseWnd(WndWriterSourceCode);
					break;
				case Close.Ctrl: // control sharing violations
					CloseWnd(WndWriterAddControl);
					CloseWnd(WndWriterEditMultiControls);
					CloseWnd(WndWriterEditControl);
					CloseWnd(WndWriterSelectControls);
					break;
				case Close.Elmt: // element sharing violations
					CloseWnd(WndWriterAddElement);
					CloseWnd(WndWriterEditMultiElements);
					CloseWnd(WndWriterEditElement);
					CloseWnd(WndWriterSelectElements);
					break;
				default: // destroyed window, perhaps
					return false;
			}
		}
		catch (error)
		{
		}
	}
}

function VarCleanup() // resets all variables, deletes temp files
{
	FileSave = null;
	FilePath = "";
	MsgPlus.CancelTimer("ResetStatus");
	NowEditing = 0;
	CloseWnd(WndViewerErrors);
	CloseWnd(WndViewerManager);
	CloseWnd(WndViewerPreview);
	CloseWnd(WndWriterAddControl);
	CloseWnd(WndWriterAddElement);
	CloseWnd(WndWriterAddWindow);
	CloseWnd(WndWriterCreateInterface);
	CloseWnd(WndWriterEditControl);
	CloseWnd(WndWriterEditElement);
	CloseWnd(WndWriterEditMultiWindows);
	CloseWnd(WndWriterEditWindow);
	CloseWnd(WndWriterErrors);
	CloseWnd(WndWriterExtraCode);
	CloseWnd(WndWriterLoadInterface);
	CloseWnd(WndWriterManageControls);
	CloseWnd(WndWriterManageElements);
	CloseWnd(WndWriterManageWindows, 1);
	CloseWnd(WndWriterPreviewWindow);
	CloseWnd(WndWriterSelectWindows);
	CloseWnd(WndWriterSourceCode);
	Interface.Window = [];
	Writer.Wnd = [];
	Writer.WndId = [];
	Writer.WndSel = [-1, -1];
	Writer.CtrlId = [];
	Writer.CtrlSel = [-1, -1];
	Writer.ElmtId = [];
	Writer.ElmtSel = [-1, -1];
	if (FSO.FileExists(TempFile))
	{
		FSO.DeleteFile(TempFile);
	}
	if (FSO.FileExists(BackupFile))
	{
		FSO.DeleteFile(BackupFile);
	}
}
