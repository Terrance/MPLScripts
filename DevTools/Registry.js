/*
File: Registry.js
Reads to, and writes from, the registry, as well as checking for key existances.
*/

var Registry =
{
	"Exists" : function(Path, Global)
	{
		try // does it exist?
		{
			ActiveX["WSS"].RegRead(MsgPlus.ScriptRegPath + (Global ? "" : Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\") + Path);
			return true;
		}
		catch (error) // nope
		{
			return false;
		}
	},
	"Read" : function(Path, Global)
	{
		if (Registry.Exists(Path, Global)) // let's be sure: does it exist?
		{
			return ActiveX["WSS"].RegRead(MsgPlus.ScriptRegPath + (Global ? "" : Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\") + Path);
		}
		else // aha!
		{
			return null;
		}
	},
	"Write" : function(Path, Value, Type, Global)
	{
		if (Type === undefined)
		{
			Type = "REG_SZ"; // string type
		}
		ActiveX["WSS"].RegWrite(MsgPlus.ScriptRegPath + (Global ? "" : Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\") + Path, Value, Type);
		return Registry.Exists(Path, Global);
	},
	"Delete" : function(Path, Global)
	{
		if (Registry.Exists(Path, Global)) // does it exist, really?
		{
			ActiveX["WSS"].RegDelete(MsgPlus.ScriptRegPath + (Global ? "" : Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\") + Path);
		}
		return !Registry.Exists(Path, Global); // now does it exist?
	}
};
