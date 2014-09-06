/*
File: WndTools.js
Starts the document browser object, changes pages and populates the document list.
*/

function WndTools_Build()
{
	Debugging.Call("WndTools / Build");
	Window.Close(Wnds["Manage"]);
	Window.Close(Wnds["Tools"]);
	var List = Tool.List(false);
	if (List.length > 0)
	{
		Window.Open("Tools");
		Wnds["Tools"].Combo_AddItem("CmbSelect", "(no tool)");
		var List = Tool.List(true);
		for (var X in List)
		{
			Wnds["Tools"].Combo_AddItem("CmbSelect", List[X]);
		}
		Wnds["Tools"].Combo_SetCurSel("CmbSelect", 0);
	}
	else
	{
		Toast("No tools installed!", "You have no tools to use!  Why not go and download some?");
	}
}

function OnWndToolsEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndTools / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (ControlId === "BtnAbout")
		{
			var List = Tool.List();
			var Current = List[Wnds["Tools"].Combo_GetCurSel("CmbSelect") - 1];
			var Info = T[Current].I;
			Wnds["Tool_About"] = Window.Open(Current + "_About", 0, "Tools\\" + Current);
			try
			{
				Wnds["Tool_About"].GetControlText(""); // does window exist?
				T[Current].A(Wnds["Tool_About"]); // call on-open function
			}
			catch (error) // no about window
			{
				Dialog.Show(Info["Name"], "Name: " + Info["Name"] + " (version " + Info["Version"] + ")" + (Info["Author"] ? "\nAuthor: " + Info["Author"] : "") + (Info["Website"] ? "\nWebsite: " + Info["Website"] : "") + (Info["Description"] ? "\n\n" + Info["Description"] : ""), Dialog.Icon.Info, Dialog.Buttons.OK, Wnds["Tools"]);
			}
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndToolsEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndTools / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var List = Tool.List();
		var Load = List[Wnds["Tools"].Combo_GetCurSel("CmbSelect") - 1];
		var Width = 179 + 6; // left/right edges 3px each + 19px for borders
		var Height = 72 + 6 + 26; // top/bottom edges 3px each + 26px title bar + 74px for borders
		NoClose = true; // stops the Tool.Close() function from overriding
		Window.Close(Wnds["Tool"]);
		Interop.Call("user32.dll", "SetWindowPos", Wnds["Tools"].Handle, null, 0, 0, Width, Height, 0x2 | 0x4); // reset window size
		Enable(Wnds["Tools"], "BtnAbout", Load !== undefined);
		if (Load !== undefined)
		{
			Tool.Open(Load); // launch the tool!
		}
		Title(Wnds["Tools"], Load === undefined ? "" : T[Load].I["Name"]);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
