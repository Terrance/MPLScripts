var WndUpdates = null;
var WndOthers = null;
var WndAll = null;
var UpdateSel = -1;
var OtherSel = -1;
var AllSel = -1;

var Scripts = [];
var Total = 0;
var Completed = 0;
var Errors = 0;

function OnEvent_DownloadFileComplete(Url, OutFile, Success)
{
	if (OutFile === MsgPlus.ScriptFilesPath + "\\List.xml")
	{
		try
		{
			WndDownloading.Close(0);
		}
		catch (error)
		{
		}
		if (Success && XML.load(OutFile))
		{
			Debug.Trace("| Downloaded successfully.");
			if (NowLoading === 1)
			{
				try
				{
					WndUpdates.Close(0);
				}
				catch (error)
				{
				}
				var Count = 0;
				Scripts = [];
				for (var ScriptEnum = new Enumerator(XML.selectNodes("//MPLs/Script")); !ScriptEnum.atEnd(); ScriptEnum.moveNext())
				{
					var Script = ScriptEnum.item();
					var Name = Script.getAttribute("Name");
					var VersionNew = Script.getAttribute("Version");
					var VersionOld = Registry.Read(Name + "\\Version");
					if (Number(VersionNew) > Number(VersionOld) && Registry.Exists(Name + "\\Version"))
					{
						var Path = "//MPLs/Script[@Name=\"" + Name + "\"][@Version=\"" + VersionNew + "\"]/";
						var Summary = XML.selectSingleNode(Path + "Summary").text;
						var Description = XML.selectSingleNode(Path + "Description").text;
						var Install = XML.selectSingleNode(Path + "Install").text;
						var Beta = XML.selectSingleNode(Path + "Beta").text;
						Scripts[Name] = [];
						Scripts[Name][VersionNew] =
						{
							"VersionOld" : VersionOld,
							"Summary" : Summary,
							"Description" : Description,
							"Install" : Install
						};
						Count++;
						if (Beta !== "")
						{
							Scripts[Name + " BETA"] = [];
							Scripts[Name + " BETA"][Beta] =
							{
								"VersionOld" : VersionOld,
								"Summary" : Summary,
								"Description" : Description,
								"Install" : Install
							};
							Count++;
						}
					}
				}
				Debug.Trace("| " + (Count) + " update" + (Count === 1 ? "" : "s") + " found.");
				if (Count > 0)
				{
					WndUpdates = MsgPlus.CreateWnd("Windows.xml", "WndUpdates", 0);
					WndUpdates.SetControlText("TxtHead", (Count) + " script update" + (Count > 1 ? "s are" : " is") + " available.  Use the list below to review the available updates.  It is recommended that you download all updates, in order to improve functionality.");
					Count = 0;
					for (var Name in Scripts)
					{
						for (var Version in Scripts[Name])
						{
							WndUpdates.LstView_AddItem("LstScripts", Name);
							WndUpdates.LstView_SetCheckedState("LstScripts", Count, true);
							WndUpdates.LstView_SetItemText("LstScripts", Count, 1, Scripts[Name][Version].VersionOld);
							WndUpdates.LstView_SetItemText("LstScripts", Count, 2, Version);
							Count++;
						}
					}
					Interop.Call("user32", "SetWindowTextW", WndUpdates.Handle, NAME + " | Script updates (" + Count + ")...");
				}
				else
				{
					if (Registry.Read(NAME + "\\Options\\ChkProgressList") || !NoNotify)
					{
						Dialog.Show("No script updates are available at the moment.", Dialog.Icon.Info, Dialog.Buttons.OK);
					}
					if (DoOthersLater)
					{
						DoOthersLater = false;
						NowLoading = 2;
						OnEvent_DownloadFileComplete(undefined, MsgPlus.ScriptFilesPath + "\\List.xml", true);
					}
					else
					{
						NowLoading = 0;
						NoNotify = false;
					}
				}
			}
			else if (NowLoading === 2)
			{
				try
				{
					WndOthers.Close(0);
				}
				catch (error)
				{
				}
				var Count = 0;
				Scripts = [];
				for (var ScriptEnum = new Enumerator(XML.selectNodes("//MPLs/Script")); !ScriptEnum.atEnd(); ScriptEnum.moveNext())
				{
					var Script = ScriptEnum.item();
					var Name = Script.getAttribute("Name");
					var Version = Script.getAttribute("Version");
					if (!Registry.Exists(Name + "\\Version"))
					{
						var Path = "//MPLs/Script[@Name=\"" + Name + "\"][@Version=\"" + Version + "\"]/";
						var Summary = XML.selectSingleNode(Path + "Summary").text;
						var Description = XML.selectSingleNode(Path + "Description").text;
						var Install = XML.selectSingleNode(Path + "Install").text;
						var Beta = XML.selectSingleNode(Path + "Beta").text;
						Scripts[Name] = [];
						Scripts[Name][Version] =
						{
							"Summary" : Summary,
							"Description" : Description,
							"Install" : Install
						};
						Count++;
						if (Beta !== "")
						{
							Scripts[Name + " BETA"] = [];
							Scripts[Name + " BETA"][Beta] =
							{
								"VersionOld" : VersionOld,
								"Summary" : Summary,
								"Description" : Description,
								"Install" : Install
							};
							Count++;
						}
					}
				}
				Debug.Trace("| " + (Count) + " other" + (Count === 1 ? "" : "s") + " found.");
				if (Count > 0)
				{
					WndOthers = MsgPlus.CreateWnd("Windows.xml", "WndOthers", 0);
					WndOthers.SetControlText("TxtHead", (Count) + " other script" + (Count > 1 ? "s are" : " is") + " available.  Use the list below to review the available scripts.  We recommend that you try some of these scripts, but they are completely optional.");
					Count = 0;
					for (var Name in Scripts)
					{
						for (var Version in Scripts[Name])
						{
							WndOthers.LstView_AddItem("LstScripts", Name);
							WndOthers.LstView_SetCheckedState("LstScripts", Count, true);
							WndOthers.LstView_SetItemText("LstScripts", Count, 1, Version);
							Count++;
						}
					}
					Interop.Call("user32", "SetWindowTextW", WndOthers.Handle, NAME + " | Other scripts (" + Count + ")...");
				}
				else
				{
					if (Registry.Read(NAME + "\\Options\\ChkProgressList") || !NoNotify)
					{
						Dialog.Show("No other scripts are available at the moment.", Dialog.Icon.Info, Dialog.Buttons.OK);
					}
					NowLoading = 0;
					NoNotify = false;
				}
			}
			else if (NowLoading === 3)
			{
				try
				{
					WndAll.Close(0);
				}
				catch (error)
				{
				}
				var Count = 0;
				Scripts = [];
				for (var ScriptEnum = new Enumerator(XML.selectNodes("//MPLs/Script")); !ScriptEnum.atEnd(); ScriptEnum.moveNext())
				{
					var Script = ScriptEnum.item();
					var Name = Script.getAttribute("Name");
					var VersionNew = Script.getAttribute("Version");
					var VersionOld = Registry.Exists(Name + "\\Version") ? Registry.Read(Name + "\\Version") : "n/a";
					var Path = "//MPLs/Script[@Name=\"" + Name + "\"][@Version=\"" + VersionNew + "\"]/";
					var Summary = XML.selectSingleNode(Path + "Summary").text;
					var Description = XML.selectSingleNode(Path + "Description").text;
					var Install = XML.selectSingleNode(Path + "Install").text;
					var Beta = XML.selectSingleNode(Path + "Beta").text;
					Scripts[Name] = [];
					Scripts[Name][VersionNew] =
					{
						"VersionOld" : VersionOld,
						"Summary" : Summary,
						"Description" : Description,
						"Install" : Install
					};
					Count++;
					if (Beta !== "")
					{
						Scripts[Name + " BETA"] = [];
						Scripts[Name + " BETA"][Beta] =
						{
							"VersionOld" : VersionOld,
							"Summary" : Summary,
							"Description" : Description,
							"Install" : Install
						};
						Count++;
					}
				}
				Debug.Trace("| " + (Count) + " update" + (Count === 1 ? "" : "s") + " found.");
				if (Count > 0)
				{
					WndAll = MsgPlus.CreateWnd("Windows.xml", "WndAll", 0);
					WndAll.SetControlText("TxtHead", (Count) + " script" + (Count > 1 ? "s are" : " is") + " available in total.  Use the list below to review the available scripts.  It is recommended that you download any updates, but the other scripts are optional.");
					Count = 0;
					for (var Name in Scripts)
					{
						for (var Version in Scripts[Name])
						{
							WndAll.LstView_AddItem("LstScripts", Name);
							WndAll.LstView_SetCheckedState("LstScripts", Count, true);
							WndAll.LstView_SetItemText("LstScripts", Count, 1, Scripts[Name][Version].VersionOld);
							WndAll.LstView_SetItemText("LstScripts", Count, 2, Version);
							Count++;
						}
					}
					Interop.Call("user32", "SetWindowTextW", WndAll.Handle, NAME + " | All scripts (" + Count + ")...");
				}
				else
				{
					if (Registry.Read(NAME + "\\Options\\ChkProgressList") || !NoNotify)
					{
						Dialog.Show("No scripts are available at the moment.", Dialog.Icon.Info, Dialog.Buttons.OK);
					}
					if (DoOthersLater)
					{
						DoOthersLater = false;
						NowLoading = 2;
						OnEvent_DownloadFileComplete(undefined, MsgPlus.ScriptFilesPath + "\\List.xml", true);
					}
					else
					{
						NowLoading = 0;
						NoNotify = false;
					}
				}
			}
		}
		else
		{
			Debug.Trace("| Failed to download.");
			Dialog.Show("Failed to download the XML update list.\nThe service may be down for maintennance.", Dialog.Icon.Error, Dialog.Buttons.OK);
		}
	}
	else
	{
		Completed++;
		Debug.Trace("| " + Completed + " of " + Total + " downloaded.");
		WndDownloading.SetControlText("TxtMain", "Downloading: " + (Completed) + " of " + Total + " scripts.\nPlease wait a moment...");
		if (!Success)
		{
			Errors++;
		}
		if (Completed === Total)
		{
			if (Dialog.Show((Completed - Errors) + " of " + Total + " files were downloaded successfully.\nWould you like to view these files now?\n\nNote: these files will expire when Messenger is closed.", Dialog.Icon.Info, Dialog.Buttons.Yes_No, WndDownloading) === Dialog.Result.Yes)
			{
				SHELL.run("explorer \"" + MsgPlus.ScriptFilesPath + "\\Installers\"");
			}
			WndDownloading.Close(0);
			Total = 0;
			Completed = 0;
			Errors = 0;
		}
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
}
