function CopyToClipboard(String)
{
	var Length = String.length * 2 + 2; // get the string's length
	if (Interop.Call("user32", "OpenClipboard", 0)) // if the clipboard opens successfully
	{
		var Heap = Interop.Call("kernel32", "GlobalAlloc", 0, Length);
		var Lock = Interop.Call("kernel32", "GlobalLock", Heap); // lock the clipboard
		Interop.Call("kernel32", "RtlMoveMemory", Lock, String, Length); // set the memory mode
		Interop.Call("kernel32", "GlobalUnlock", Heap); // unlock the clipboard
		if (Interop.Call("user32", "OpenClipboard", 0)) // if the clipboard opens successfully
		{
			Interop.Call("user32", "EmptyClipboard"); // clear the current clipboard data
			Interop.Call("user32", "SetClipboardData", 13, Heap); // set the new clipboard data
			Interop.Call("user32", "CloseClipboard"); // close the clipboard
		}
	}
	Interop.Call("user32", "MessageBoxW", null, "The following data has been copied to the clipboard:\n\n" + String, NAME, 48); // show confirmation message
}

function ExistsRegistry(Path, Variable)
{
	if (Path !== null)
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Path + "\\" + Variable; 
	}
	else
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Variable; 
	}
	var Shell = new ActiveXObject("WScript.Shell");
	try
	{
		Shell.RegRead(RegPath);
		return true;
	}
	catch (error)
	{
		return false;
	}
}
 
function DeleteRegistry(Path, Variable)
{
	if (Path !== null)
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Path + "\\" + Variable; 
	}
	else
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Variable; 
	}
	var Shell = new ActiveXObject("WScript.Shell");
	return Shell.RegDelete(RegPath);
}
 
function ReadRegistry(Path, Variable, Value)
{
	if (Path !== null)
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Path + "\\" + Variable; 
	}
	else
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Variable; 
	}
	var Shell = new ActiveXObject("WScript.Shell");
	try
	{
		return Shell.RegRead(RegPath);
	}
	catch (error)
	{
		if (Value !== null)
		{
			Shell.RegWrite(RegPath, Value);
			return Value;
		}
		else
		{
			return null;
		}
	}
}
 
function WriteRegistry(Path, Variable, Value, Overwrite)
{
	if (Path !== null)
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Path + "\\" + Variable; 
	}
	else
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + Variable; 
	}
	var Shell = new ActiveXObject("WScript.Shell");
	if (Overwrite)
	{
		Shell.RegWrite(RegPath, Value);
		return Value;
	}
	else
	{
		try
		{
			return Shell.RegRead(RegPath);
		}
		catch (error)
		{
			Shell.RegWrite(RegPath, Value);
			return Value;
		}
	}
}
