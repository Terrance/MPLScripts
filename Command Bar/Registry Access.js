function ExistsRegistry(path, variable)
{
	if (path != null)
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + path + "\\" + variable; 
	}
	else
	{
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + variable; 
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
 
function DeleteRegistry(variable)
{
	var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + variable; 
	var Shell = new ActiveXObject("WScript.Shell");
	return Shell.RegDelete(RegPath);
}
 
function ReadRegistry(variable, value)
{
	var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + variable; 
	var Shell = new ActiveXObject("WScript.Shell");
	try
	{
		return Shell.RegRead(RegPath);
	}
	catch (error)
	{
		if (value != null)
		{
			Shell.RegWrite(RegPath, value);
			return value;
		}
		else
		{
			return null;
		}
	}
}
 
function WriteRegistry(variable, value, overwrite)
{
	var RegPath = MsgPlus.ScriptRegPath + Messenger.MyEmail + "\\" + variable; 
	var Shell = new ActiveXObject("WScript.Shell");
	if (overwrite != false)
	{
		Shell.RegWrite(RegPath, value);
		return value;
	}
	else
	{
		try
		{
			return Shell.RegRead(RegPath);
		}
		catch (error)
		{
			Shell.RegWrite(RegPath, value);
			return value;
		}
	}
}
