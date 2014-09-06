// the Tool.New() function must come before anything else (except comments)
Tool.New("MyTool");

// you should then define the tool's information - name, version and description are required
T["MyTool"].I =
{
	"Name" : "My Tool",
	"Version" : "1.0",
	"Description" : "My Tool is an example of how to write a tool for the DevTools script.  You can make a copy of it and use it as a template for building your own custom tools.",
	"Author" : "Whiz @ WhizWeb Community",
	"Website" : "http://www.ww-c.co.nr"
};

// use the T[...].O() function to run code when the tool is opened
T["MyTool"].O = function(PlusWnd)
{
	PlusWnd.SetControlText("EdtTest", "Go on, then.  Type something...");
	// you can use T[...].D() to write messages to the script debug
	T["MyTool"].D("Tool opened.");
}

// window events can be called just like in a script
function OnWndMyToolEvent_CtrlClicked(PlusWnd, ControlId)
{
	switch (ControlId)
	{
		case "BtnAlert":
			T["MyTool"].D("Content length: " + PlusWnd.GetControlText("EdtTest").length);
			Dialog.Show("My Tool: Text box...", PlusWnd.GetControlText("EdtTest"), Dialog.Icon.Info, Dialog.Buttons.OK, PlusWnd);
			break;
		case "BtnReset":
			PlusWnd.SetControlText("EdtTest", "");
			T["MyTool"].D("Text area reset.");
			break;
	}
}

// use the T[...].A() function to run code when the about window is opened
T["MyTool"].A = function(PlusWnd)
{
	T["MyTool"].D("About window open.");
}

// you can (optionally) use events for your about window, for example, to open links
function OnWndMyTool_AboutEvent_CtrlClicked(PlusWnd, ControlId)
{
	if (ControlId === "LnkWebsite")
	{
		ActiveX["WSS"].run("http://www.ww-c.co.nr/");
	}
}

// this function must always be specified, so that the script doesn't get stuck when the user presses Esc
function OnWndMyToolEvent_Destroyed(PlusWnd, ExitCode)
{
	T["MyTool"].D("Tool closed.");
	Tool.Close(ExitCode);
}
