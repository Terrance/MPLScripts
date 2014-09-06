/*
File: WndBrowser.js
Starts the document browser object, changes pages and populates the document list.
*/

function WndBrowser_Build()
{
	Debugging.Call("WndBrowser / Build");
	Window.Close(Wnds["Browser"]);
	Window.Open("Browser");
	Enable(Wnds["Browser"], "CmbSelect", 0);
	var Browser = Wnds["Browser"].Browser_GetInterface("BrwDocument");
	(
		function(IntBrowser)
		{
			function IntBrowser::TitleChange(Text)
			{
				Title(Wnds["Browser"], "Browser: " + Text);
			}
		}
	)
	(Browser);
	Browser.Navigate2("http://mpls.ww-c.cz.cc/devtools/?dt=1");
}
