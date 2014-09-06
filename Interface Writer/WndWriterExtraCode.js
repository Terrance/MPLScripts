/*
File: WndWriterExtraCode.js
Events for processing the edits of additional code tied to a window, control or element.
*/

function OnWndWriterExtraCodeEvent_Build()
{
	Debugging.Call("WndWriterExtraCode / Build", {});
	CloseWnd(WndWriterExtraCode);
	WndWriterExtraCode = OpenWnd("Writer", "Writer", "ExtraCode");
	WndWriterExtraCode.RichEdit_SetCharFormat("EdtCode", false, -1, -1, -1, -1, -1, -1, Registry.Read("Options\\EdtCode"));
	WndWriterExtraCode.SetControlText("EdtCode", Writer.Extra);
}

function OnWndWriterExtraCodeEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterExtraCode / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnStore":
				Writer.Extra = WndWriterExtraCode.GetControlText("EdtCode");
				CloseWnd(WndWriterExtraCode);
				break;
			case "BtnTab": // can be glitchy at the start of a new line - seems to split the \r and \n (guess they count as one, even with replacement)
				var Position = WndWriterExtraCode.EditBox_GetCurSelStart("EdtCode");
				var Code = WndWriterExtraCode.GetControlText("EdtCode").replace("\r\n", "\n"); // somewhat fixes this issue
				WndWriterExtraCode.SetControlText("EdtCode", (Code.substr(0, Position) + "	" + Code.substr(Position, Code.length).replace("\n", "\r\n")));
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
