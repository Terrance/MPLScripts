/*
File: Tool.js
Functions for dealing with tools in the tool array.
*/

var Tool =
{
	"Close" : function(Code)
	{
		if (Code > 0)
		{
			Window.Close(Wnds["Tool"]);
			var Width = 179 + 6; // normal size of 179px + left/right edges 3px each
			var Height = 72 + 6 + 26; // normal size of 72px + top/bottom edges 3px each + 26px title bar
			Interop.Call("user32.dll", "SetWindowPos", Wnds["Tools"].Handle, null, 0, 0, Width, Height, 0x2 | 0x4);
			Wnds["Tools"].Combo_SetCurSel("CmbSelect", 0);
			Enable(Wnds["Tools"], "BtnAbout", 0);
		}
		else if (!NoClose)
		{
			Window.Close(Wnds["Tool"]);
		}
	},
	"Disable" : function(ID)
	{
		D[ID] = T[ID]; // swap to disabled
		delete T[ID];
		Registry.Write(ID + "\\Enabled", 0, "REG_DWORD");
	},
	"Enable" : function(ID)
	{
		T[ID] = D[ID]; // swap to enabled
		delete D[ID];
		Registry.Write(ID + "\\Enabled", 1, "REG_DWORD");
	},
	"List" : function(Names, Disabled)
	{
		var List = [];
		for (var ID in T) // if "Names", the tool's name is returned, otherwise, the ID is
		{
			List.push(Names ? T[ID].I["Name"] : ID);
		}
		if (Disabled) // include disabled tools in list?
		{
			for (var ID in D)
			{
				List.push(Names ? D[ID].I["Name"] : ID);
			}
		}
		return List;
	},
	"New" : function(ID)
	{
		T[ID] = // create new object
		{
			"A" : function(PlusWnd) {}, // on-open function (about window)
			"D" : function(Message) // custom debugging function
			{
				if (Debugging.Data[Debugging.Data.length - 1].substr(1, ID.length) !== ID && Debugging.Data[Debugging.Data.length - 1].charAt(0) !== "=")
				{
					Debugging.Trace("-----------------------------------------------------------------");
				}
				Message = Message.replace(/\r/g, "").split("\n"); // just in case, so all lines are prefixed
				for (var X in Message)
				{
					Debugging.Trace("[" + ID + "] " + Message[X]);
				}
			},
			"O" : function(PlusWnd) {}, // on-open function (tool window)
			"V" : [] // variable storage (since globals can interfere with other tools)
		};
	},
	"Open" : function(ID)
	{
		Debugging.Trace("<-- Start tool display. -->");
		Debugging.Trace("--> Tool: " + ID);
		Debugging.Trace("--> | Interface: Tools\\" + ID + ".xml");
		Debugging.Trace("--> | Window ID: Wnd" + ID);
		Debugging.Trace("--> Fetching dimensions...");
		var Size = T[ID].W;
		Debugging.Trace("--> | Size: " + Size[0] + " x " + Size[1]);
		Debugging.Trace("--> Opening child window...");
		Wnds["Tool"] = MsgPlus.CreateChildWnd(Wnds["Tools"], "Tools\\" + ID + ".xml", "Wnd" + ID, 9, 62);
		var Width = Size[0] + 6 + 18; // left/right edges 3px each + 18px for borders
		var Height = Size[1] + 3 + 26 + 74; // top/bottom edges 3px each + 26px title bar + 74px for borders
		if (Width < 179 + 6) // minimum width
		{
			Width = 179 + 6;
		}
		Debugging.Trace("--> | Window created, resizing parent to " + Width + " x " + Height + "...");
		Interop.Call("user32.dll", "SetWindowPos", Wnds["Tools"].Handle, null, 0, 0, Width, Height, 0x2 | 0x4);
		Debugging.Trace("--> Tool loaded successfully.");
		Debugging.Trace("<-- End tool display. -->");
		T[ID].O(Wnds["Tool"]); // call on-open function
	}
};
