/*
File: Window.js
Opens and closes windows, applies icons and other global settings.
*/

var Wnds = {};

var Window =
{
	"Close" : function(Wnd, Code)
	{
		try
		{
			Wnd.Close(Code === undefined ? 0 : Code);
			return true;
		}
		catch (error) // doesn't exist
		{
			return false;
		}
	},
	"CloseAll" : function()
	{
		for (var X in Wnds) // loop through array
		{
			Window.Close(Wnds[X]);
		}
	},
	"Open" : function(Wnd, Code, File)
	{
		if (File) // specific interface (for tools)?
		{
			return MsgPlus.CreateWnd(File + ".xml", "Wnd" + Wnd, Code === undefined ? 0 : Code);
		}
		else // core window file
		{
			Wnds[Wnd] = MsgPlus.CreateWnd("Interface.xml", "Wnd" + Wnd, Code === undefined ? 0 : Code);
		}
	}
};
