/*
File: WndAbout.js
Processes link targets and stopping multiple windows.
*/

function OnWndAboutEvent_Build()
{
	Debugging.Call("WndAbout / Build", {});
	CloseWnd(WndAbout); // no duplicates!
	WndAbout = OpenWnd("Other", "", "About");
	Interop.Call("user32", "SetWindowTextW", WndAbout.Handle, NAME + " " + VERSION + " | About...");
}

function OnWndAboutEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndAbout / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "LnkWebsite":
				SHELL.run("http://www.ww-c.co.nr/");
				break;
			case "LnkForum":
				SHELL.run("http://www.msghelp.net/showthread.php?tid=90773");
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
