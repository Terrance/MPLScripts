/*
File: ObjRegistry.js
Easy read/write access to the registry, as well as checking for key existances.
*/

var Registry = new Object();

Registry.Exists = function(Path)
{
	try // does it exist?
	{
		SHELL.RegRead(MsgPlus.ScriptRegPath + Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\" + Path);
		return true;
	}
	catch (error) // nope
	{
		return false;
	}
}

Registry.Read = function(Path)
{
	if (Registry.Exists(Path)) // let's be sure: does it exist?
	{
		return SHELL.RegRead(MsgPlus.ScriptRegPath + Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\" + Path);
	}
	else // aha!
	{
		return null;
	}
}

Registry.Write = function(Path, Value, Type)
{
	if (Type === undefined)
	{
		Type = "REG_SZ"; // string type
	}
	SHELL.RegWrite(MsgPlus.ScriptRegPath + Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\" + Path, Value, Type);
	return Registry.Exists(Path);
}

Registry.Delete = function(Path)
{
	if (Registry.Exists(Path)) // does it exist, really?
	{
		SHELL.RegDelete(MsgPlus.ScriptRegPath + Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\" + Path);
	}
	return !Registry.Exists(Path); // now does it exist?
}
