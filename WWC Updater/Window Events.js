function OnWndUpdatesEvent_CtrlClicked(PlusWnd, ControlId)
{
	switch (ControlId)
	{
		case "BtnInfo":
			var Name = WndUpdates.LstView_GetItemText("LstScripts", UpdateSel, 0);
			var Version = WndUpdates.LstView_GetItemText("LstScripts", UpdateSel, 2);
			var Data = Scripts[Name][Version];
			Dialog.Show(Name + " (version " + Version + "): " + Data.Summary + "\n\n" + Data.Description + "\n\nHow to use this script:\n" + Data.Install.replace(/<li>/g, "> ").replace(/<\/li>/g, "\n"), Dialog.Icon.Info, Dialog.Buttons.OK, WndUpdates);
			break;
		case "BtnDownload":
			var Count = 0;
			var ToDownload = [];
			for (var Name in Scripts)
			{
				if (WndUpdates.LstView_GetCheckedState("LstScripts", Count))
				{
					ToDownload.push(Name);
					Total++;
				}
				Count++;
			}
			if (Total === 0)
			{
				if (OnWndUpdatesEvent_Cancel(WndUpdates))
				{
					return;
				}
			}
			WndUpdates.Close(0);
			if (!FSO.FolderExists(MsgPlus.ScriptFilesPath + "\\Installers"))
			{
				FSO.CreateFolder(MsgPlus.ScriptFilesPath + "\\Installers");
			}
			for (var X in ToDownload)
			{
				var Name = ToDownload[X];
				MsgPlus.DownloadFile("http://www.ww-c.netii.net/mpls/download/scripts/" + Name + ".plsc", MsgPlus.ScriptFilesPath + "\\Installers\\" + Name + ".plsc");
			}
			if (Registry.Read(NAME + "\\Options\\ChkProgressScripts"))
			{
				WndDownloading = MsgPlus.CreateWnd("Windows.xml", "WndDownloading", 0);
				WndDownloading.SetControlText("TxtMain", "Downloading: " + Completed + " of " + Total + " scripts.\nPlease wait a moment...");
			}
			break;
	}
}

function OnWndUpdatesEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	UpdateSel = ItemIdx;
	Interop.Call("user32", "EnableWindow", WndUpdates.GetControlHandle("BtnInfo"), UpdateSel !== -1);
	if (UpdateSel !== -1)
	{
		WndUpdates.LstView_SetSelectedState("LstScripts", UpdateSel, true);
	}
}

function OnWndUpdatesEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	OnWndUpdatesEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx);
}

function OnWndUpdatesEvent_Cancel(PlusWnd)
{
	var Cancel = Dialog.Show("Are you sure you wish to cancel the script updates?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndUpdates) === Dialog.Result.No;
	if (!Cancel)
	{
		WndUpdates.Close(0);
		if (DoOthersLater)
		{
			DoOthersLater = false;
			NowLoading = 2;
			OnEvent_DownloadFileComplete(undefined, MsgPlus.ScriptFilesPath + "\\List.xml", true);
		}
		else
		{
			NowLoading = 0;
		}
	}
	return Cancel;
}

function OnWndOthersEvent_CtrlClicked(PlusWnd, ControlId)
{
	switch (ControlId)
	{
		case "BtnInfo":
			var Name = WndOthers.LstView_GetItemText("LstScripts", OtherSel, 0);
			var Version = WndOthers.LstView_GetItemText("LstScripts", OtherSel, 1);
			var Data = Scripts[Name][Version];
			Dialog.Show(Name + " (version " + Version + "): " + Data.Summary + "\n\n" + Data.Description + "\n\nHow to use this script:\n" + Data.Install.replace(/<li>/g, "> ").replace(/<\/li>/g, "\n"), Dialog.Icon.Info, Dialog.Buttons.OK, WndOthers);
			break;
		case "BtnDownload":
			var Count = 0;
			var ToDownload = [];
			for (var Name in Scripts)
			{
				if (WndOthers.LstView_GetCheckedState("LstScripts", Count))
				{
					ToDownload.push(Name);
					Total++;
				}
				Count++;
			}
			if (Total === 0)
			{
				if (OnWndOthersEvent_Cancel(PlusWnd))
				{
					return;
				}
			}
			WndOthers.Close(0);
			if (!FSO.FolderExists(MsgPlus.ScriptFilesPath + "\\Installers"))
			{
				FSO.CreateFolder(MsgPlus.ScriptFilesPath + "\\Installers");
			}
			for (var X in ToDownload)
			{
				var Name = ToDownload[X];
				MsgPlus.DownloadFile("http://www.ww-c.netii.net/mpls/download/scripts/" + Name + ".plsc", MsgPlus.ScriptFilesPath + "\\Installers\\" + Name + ".plsc");
			}
			if (Registry.Read(NAME + "\\Options\\ChkProgressScripts"))
			{
				WndDownloading = MsgPlus.CreateWnd("Windows.xml", "WndDownloading", 0);
				WndDownloading.SetControlText("TxtMain", "Downloading: " + Completed + " of " + Total + " scripts.\nPlease wait a moment...");
			}
			break;
	}
}

function OnWndOthersEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	OtherSel = ItemIdx;
	Interop.Call("user32", "EnableWindow", WndOthers.GetControlHandle("BtnInfo"), OtherSel !== -1);
	if (OtherSel !== -1)
	{
		WndOthers.LstView_SetSelectedState("LstScripts", OtherSel, true);
	}
}

function OnWndOthersEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	OnWndOthersEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx);
}

function OnWndOthersEvent_Cancel(PlusWnd)
{
	var Cancel = Dialog.Show("Are you sure you wish to cancel the other scripts?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndOthers) === Dialog.Result.No;
	if (!Cancel)
	{
		NowLoading = 0;
	}
	return Cancel;
}

function OnWndAllEvent_CtrlClicked(PlusWnd, ControlId)
{
	switch (ControlId)
	{
		case "BtnInfo":
			var Name = WndAll.LstView_GetItemText("LstScripts", AllSel, 0);
			var Version = WndAll.LstView_GetItemText("LstScripts", AllSel, 2);
			var Data = Scripts[Name][Version];
			Dialog.Show(Name + " (version " + Version + "): " + Data.Summary + "\n\n" + Data.Description + "\n\nHow to use this script:\n" + Data.Install.replace(/<li>/g, "> ").replace(/<\/li>/g, "\n"), Dialog.Icon.Info, Dialog.Buttons.OK, WndAll);
			break;
		case "BtnDownload":
			var Count = 0;
			var ToDownload = [];
			for (var Name in Scripts)
			{
				if (WndAll.LstView_GetCheckedState("LstScripts", Count))
				{
					ToDownload.push(Name);
					Total++;
				}
				Count++;
			}
			if (Total === 0)
			{
				if (OnWndAllEvent_Cancel(PlusWnd))
				{
					return;
				}
			}
			WndAll.Close(0);
			if (!FSO.FolderExists(MsgPlus.ScriptFilesPath + "\\Installers"))
			{
				FSO.CreateFolder(MsgPlus.ScriptFilesPath + "\\Installers");
			}
			for (var X in ToDownload)
			{
				var Name = ToDownload[X];
				MsgPlus.DownloadFile("http://www.ww-c.netii.net/mpls/download/scripts/" + Name + ".plsc", MsgPlus.ScriptFilesPath + "\\Installers\\" + Name + ".plsc");
			}
			if (Registry.Read(NAME + "\\Options\\ChkProgressScripts"))
			{
				WndDownloading = MsgPlus.CreateWnd("Windows.xml", "WndDownloading", 0);
				WndDownloading.SetControlText("TxtMain", "Downloading: " + Completed + " of " + Total + " scripts.\nPlease wait a moment...");
			}
			break;
	}
}

function OnWndAllEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx)
{
	AllSel = ItemIdx;
	Interop.Call("user32", "EnableWindow", WndAll.GetControlHandle("BtnInfo"), AllSel !== -1);
	if (AllSel !== -1)
	{
		WndAll.LstView_SetSelectedState("LstScripts", AllSel, true);
	}
}

function OnWndAllEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx)
{
	OnWndAllEvent_LstViewClicked(PlusWnd, ControlId, ItemIdx);
}

function OnWndAllEvent_Cancel(PlusWnd)
{
	var Cancel = Dialog.Show("Are you sure you wish to cancel all of the scripts?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndAll) === Dialog.Result.No;
	if (!Cancel)
	{
		NowLoading = 0;
	}
	return Cancel;
}

function OnWndDownloadingEvent_Cancel(PlusWnd)
{
	return true;
}

function OnWndOptionsEvent_CtrlClicked(PlusWnd, ControlId)
{
	if (ControlId === "BtnSave")
	{
		Registry.Write(NAME + "\\Options\\ChkStartupUpdates", Number(WndOptions.Button_IsChecked("ChkStartupUpdates")), "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkStartupOthers", Number(WndOptions.Button_IsChecked("ChkStartupOthers")), "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkMinsUpdates", Number(WndOptions.Button_IsChecked("ChkMinsUpdates")), "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkMinsOthers", Number(WndOptions.Button_IsChecked("ChkMinsOthers")), "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkProgressList", Number(WndOptions.Button_IsChecked("ChkProgressList")), "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkProgressScripts", Number(WndOptions.Button_IsChecked("ChkProgressScripts")), "REG_DWORD");
		WndOptions.Close(0);
		if (Registry.Read(NAME + "\\Options\\ChkMinsUpdates"))
		{
			MsgPlus.AddTimer("ChkMinsUpdates", 1800000);
		}
		else
		{
			MsgPlus.CancelTimer("ChkMinsUpdates");
		}
		if (Registry.Read(NAME + "\\Options\\ChkMinsOthers"))
		{
			MsgPlus.AddTimer("ChkMinsOthers", 1800001);
		}
		else
		{
			MsgPlus.CancelTimer("ChkMinsOthers");
		}
	}
}

function OnWndOptionsEvent_Destroyed(PlusWnd, ExitCode)
{
	if (FirstRun)
	{
		if (Dialog.Show("Would you like to check for updates now?", Dialog.Icon.Question, Dialog.Buttons.Yes_No) === Dialog.Result.Yes)
		{
			NowLoading = 1;
			DownloadList(NowLoading);
		}
	}
}
