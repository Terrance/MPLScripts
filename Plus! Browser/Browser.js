var Windows = new Array();
var Browsers = new Array();
var Addresses = new Array();

var Browser = function(StartURL)
{
	var Window = MsgPlus.CreateWnd("Windows.xml", "WndBrowser", 0);
	Windows[Window.Handle] = Window;
	var Browser = Window.Browser_GetInterface("BrwBrowser");
	Browsers[Window.Handle] = Browser;
	var Address = Browser.LocationURL;
	Addresses[Window.Handle] = Address;
	(
		function(IntBrowser)
		{
			function IntBrowser::DocumentComplete(pDisp, URL)
			{
				Debug.Trace("--> Done.");
				Window.SetControlText("TxtStatus", "Done.");
				Window.SetControlText("EdtAddress", Browser.LocationURL);
				Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnStop"), false);
				Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnRefresh"), true);
			}
			function IntBrowser::DownloadBegin()
			{
				Debug.Trace("--> Loading...");
				Window.SetControlText("TxtStatus", "Loading (0%)...");
				Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnStop"), true);
				Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnRefresh"), false);
			}
			function IntBrowser::ProgressChange(nProgress, nProgressMax)
			{
				try
				{
					Window.SendControlMessage("PrgLoading", 0x402, nProgress / nProgressMax * 100, 0);
					if (nProgress / nProgressMax >= 0)
					{
						Window.SetControlText("TxtStatus", "Loading (" + Math.floor(nProgress / nProgressMax * 100) + "%)...");
						Debug.Trace("----> Progress: " + nProgress / nProgressMax * 100 + "%");
					}
				}
				catch (error)
				{
					try
					{
						Window.SendControlMessage("PrgLoading", 0x402, 0, 0);
					}
					catch (error)
					{
					}
				}
			}
			function IntBrowser::TitleChange(sText)
			{
				Debug.Trace("----> Title: " + sText);
				Window.SetControlText("TxtTitle", sText);
			}
		}
	)
	(Browser);
	if (StartURL === undefined)
	{
		Browser.GoHome();
	}
	else
	{
		Browser.Navigate2(StartURL);
	}
}

function OnWndBrowserEvent_CtrlClicked(PlusWnd, ControlId)
{
	var Window = Windows[PlusWnd.Handle];
	var Browser = Browsers[PlusWnd.Handle];
	var Address = Addresses[PlusWnd.Handle];
	switch (ControlId)
	{
		case "BtnBack":
			try
			{
				Browser.GoBack();
			}
			catch (error)
			{
				Window.SetControlText("TxtStatus", "You can't go back!");
			}
			break;
		case "BtnForward":
			try
			{
				Browser.GoForward();
			}
			catch (error)
			{
				Window.SetControlText("TxtStatus", "You can't go forward!");
			}
			break;
		case "BtnStop":
			Browser.Stop();
			Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnStop"), false);
			Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnRefresh"), true);
			break;
		case "BtnRefresh":
			Browser.Navigate2(Browser.LocationURL);
			break;
		case "BtnHome":
			Browser.GoHome();
			break;
		case "BtnGo":
			Browser.Navigate2(Window.GetControlText("EdtAddress"));
			Window.SetControlText("EdtAddress", Browser.LocationURL);
			break;
		case "BtnSearch":
			Browser.Navigate2("http://www.google.com/search?q=" + Window.GetControlText("EdtAddress"));
			break;
	}
}

function OnWndBrowserEvent_EditTextChanged(PlusWnd, ControlId)
{
	var Window = Windows[PlusWnd.Handle];
	var Enable = Window.GetControlText("EdtAddress") !== "";
	Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnGo"), Enable);
	Interop.Call("user32","EnableWindow", Window.GetControlHandle("BtnSearch"), Enable);
}

function OnWndBrowserEvent_Destroyed(PlusWnd, ExitCode)
{
	delete Windows[PlusWnd.Handle];
	delete Browsers[PlusWnd.Handle];
	delete Addresses[PlusWnd.Handle];
}
