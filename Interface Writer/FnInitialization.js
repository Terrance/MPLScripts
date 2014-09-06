/*
File: FnInitialization.js
Covers start-up and shut-down events, checking existance of files and restoring backups.
*/

function OnEvent_Initialize(MessengerStart)
{
	try
	{
		Debugging.Call("Initialize", {"MessengerStart" : MessengerStart});
		if (!MessengerStart)
		{
			MsgPlus.DisplayToastContact(NAME, "[b]" + NAME + " " + VERSION + "[/b]", " Script files are now reloading."); // check files have reloaded
		}
		VersionCheck();
		Debugging.Trace("<-- Start initialization. -->");
		Debugging.Trace("--> Searching for obsolete files...");
		var AllFiles = [];
		for (var RootFolder = new Enumerator(FSO.GetFolder(MsgPlus.ScriptFilesPath).Files); !RootFolder.atEnd(); RootFolder.moveNext())
		{
			AllFiles.push(RootFolder.item().Name); // loop through files in root folder, add to array
		}
		for (var ImagesFolder = new Enumerator(FSO.GetFolder(MsgPlus.ScriptFilesPath + "\\Images").Files); !ImagesFolder.atEnd(); ImagesFolder.moveNext())
		{
			AllFiles.push("Images\\" + ImagesFolder.item().Name); // loop through files in images folder, add to array
		}
		for (var InterfacesFolder = new Enumerator(FSO.GetFolder(MsgPlus.ScriptFilesPath + "\\Interfaces").Files); !InterfacesFolder.atEnd(); InterfacesFolder.moveNext())
		{
			AllFiles.push("Interfaces\\" + InterfacesFolder.item().Name); // loop through files in interfaces folder, add to array
		}
		try
		{
			var RequiredFiles = FSO.OpenTextFile(MsgPlus.ScriptFilesPath + "\\Files.txt").ReadAll().split("\r\n");
			var RequiredList = RequiredFiles.join("|");
			var LockedList = [];
			for (var File in AllFiles)
			{
				if (RequiredList.indexOf(AllFiles[File]) === -1) // file in script directory but not in required list, delete file
				{
					Debug.Trace("--> | Deleting file \"" + AllFiles[File] + "\"...");
					try
					{
						FSO.DeleteFile(MsgPlus.ScriptFilesPath + "\\" + AllFiles[File]);
					}
					catch (error)
					{
						Debug.Trace("--> | | Unable to delete \"" + AllFiles[File] + "\".");
						LockedList.push(AllFiles[File]);
					}
				}
			}
			if (LockedList.length === 1)
			{
				Dialog.Show("Initialization...", "Unable to delete the file \"" + LockedList[0] + "\".  Remove it manually from the script directory.", Dialog.Icon.Error, Dialog.Buttons.OK);
			}
			else if (LockedList.length > 1)
			{
				Dialog.Show("Initialization...", "Unable to delete the following files.  Remove them manually from the script directory.\n" + LockedList.join(", "), Dialog.Icon.Error, Dialog.Buttons.OK);
			}
			var AllList = AllFiles.join("|");
			var MissingList = [];
			var Count = 0;
			for (var File in RequiredFiles)
			{
				Count++;
				if (AllList.indexOf(RequiredFiles[File]) === -1 && RequiredFiles[File] !== "Debug.log" && RequiredFiles[File] !== "Backup.tmp" && Count > 4) // file in required list but not in script directory, warn user
				{
					Debug.Trace("--> | Missing file \"" + RequiredFiles[File] + "\".");
					MissingList.push("\"" + RequiredFiles[File] + "\"");
				}
			}
			if (MissingList.length === 1)
			{
				Dialog.Show("Initialization...", "The file " + MissingList[0] + " cannot be found.  Please reinstall the script.", Dialog.Icon.Error, Dialog.Buttons.OK);
			}
			else if (MissingList.length > 1)
			{
				Dialog.Show("Initialization...", "The following files cannot be found.  Please reinstall the script.\n" + MissingList.join(", "), Dialog.Icon.Error, Dialog.Buttons.OK);
			}
		}
		catch (error) // required list does not exist
		{
			Dialog.Show("Initialization...", "Unable to find the files list.  Check the script root folder for a file called \"Files.txt\".", Dialog.Icon.Error, Dialog.Buttons.OK);
		}
		Debugging.Trace("--> | All files processed.");
		Debugging.Trace("--> Checking sign-in state...");
		if (Messenger.MyStatus > 1)
		{
			Debugging.Trace("--> | Forwarding to sign-in function...");
			Debugging.Trace("<-- End initialization. -->");
			OnEvent_SigninReady(Messenger.MyEmail); // already signed in
		}
		else
		{
			Debugging.Trace("--> | Not signed in.");
			Debugging.Trace("<-- End initialization. -->");
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnEvent_SigninReady(Email)
{
	try
	{
		Debugging.Call("SigninReady", {"Email" : Email});
		Debugging.Trace("<-- Start sign-in. -->");
		Debugging.Trace("--> Checking sign-in user...");
		Debugging.Trace("--> | Email: " + Email);
		Debugging.Trace("--> Setting registry path...");
		var RegPath = MsgPlus.ScriptRegPath + Messenger.MyUserId + " (" + Messenger.MyEmail + ")\\"; // set registry path for later access
		Debugging.Trace("--> | <root>" + RegPath.substr(87, RegPath.length - 83));
		Debugging.Trace("--> Checking registry settings..."); // checks for required settings, creates or converts (from old versions) as required
		if (!Registry.Exists("Options\\EdtCode"))
		{
			Debugging.Trace("--> | Adding \"Options\\EdtCode\"...");
			Registry.Write("Options\\EdtCode", "Lucida Console");
		}
		if (!Registry.Exists("Options\\CmbDouble"))
		{
			Debugging.Trace("--> | Adding \"Options\\CmbDouble\"...");
			Registry.Write("Options\\CmbDouble", 0, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\CmbDouble")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\CmbDouble\"...");
			Registry.Write("Options\\CmbDouble", Number(Registry.Read("Options\\CmbDouble")), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkSaveAction"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkSaveAction\"...");
			Registry.Write("Options\\ChkSaveAction", 0, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\ChkSaveAction")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkSaveAction\"...");
			Registry.Write("Options\\ChkSaveAction", (Registry.Read("Options\\ChkSaveAction") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkSaveMins"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkSaveMins\"...");
			Registry.Write("Options\\ChkSaveMins", 0, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\ChkSaveMins")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkSaveMins\"...");
			Registry.Write("Options\\ChkSaveMins", (Registry.Read("Options\\ChkSaveMins") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\EdtSaveMins"))
		{
			Debugging.Trace("--> | Adding \"Options\\EdtSaveMins\"...");
			Registry.Write("Options\\EdtSaveMins", 2, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\EdtSaveMins")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\EdtSaveMins\"...");
			Registry.Write("Options\\EdtSaveMins", Number(Registry.Read("Options\\EdtSaveMins")), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkBackup"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkBackup\"...");
			Registry.Write("Options\\ChkBackup", 1, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\ChkBackup")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkBackup\"...");
			Registry.Write("Options\\ChkBackup", (Registry.Read("Options\\ChkBackup") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkTabs"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkTabs\"...");
			Registry.Write("Options\\ChkTabs", 1, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\ChkTabs")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkTabs\"...");
			Registry.Write("Options\\ChkTabs", (Registry.Read("Options\\ChkTabs") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkSystemTags"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkSystemTags\"...");
			Registry.Write("Options\\ChkSystemTags", 1, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\ChkSystemTags")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkSystemTags\"...");
			Registry.Write("Options\\ChkSystemTags", (Registry.Read("Options\\ChkSystemTags") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkDebug"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkDebug\"...");
			Registry.Write("Options\\ChkDebug", 0, "REG_DWORD");
			Debug.Trace("--> | | Debugging off.");
			Debug.Trace("<-- End sign-in. -->");
		}
		else if (typeof(Registry.Read("Options\\ChkDebug")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkDebug\"...");
			Registry.Write("Options\\ChkDebug", (Registry.Read("Options\\ChkDebug") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkDebugNotif"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkDebugNotif\"...");
			Registry.Write("Options\\ChkDebugNotif", 0, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\ChkDebugNotif")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkDebugNotif\"...");
			Registry.Write("Options\\ChkDebugNotif", (Registry.Read("Options\\ChkDebugNotif") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Options\\ChkDebugTimer"))
		{
			Debugging.Trace("--> | Adding \"Options\\ChkDebugTimer\"...");
			Registry.Write("Options\\ChkDebugTimer", 0, "REG_DWORD");
		}
		else if (typeof(Registry.Read("Options\\ChkDebugTimer")) === "string")
		{
			Debugging.Trace("--> | Updating \"Options\\ChkDebugTimer\"...");
			Registry.Write("Options\\ChkDebugTimer", (Registry.Read("Options\\ChkDebugTimer") === "-1" ? 1 : 0), "REG_DWORD");
		}
		if (!Registry.Exists("Miscellaneous\\Recent"))
		{
			Debugging.Trace("--> | Adding \"Miscellaneous\\Recent\"...");
			Registry.Write("Miscellaneous\\Recent", "||||");
			if (Registry.Exists("Recent"))
			{
				Registry.Write("Miscellaneous\\Recent", Registry.Read("Recent"));
				Registry.Delete("Recent");
			}
		}
		var RecentList = Registry.Read("Miscellaneous\\Recent").split("|"); // check five most recent files
		var RecentCount = 0;
		for (var X in RecentList)
		{
			if (RecentList[X] !== "")
			{
				RecentCount++;
			}
		}
		var RecentText = RecentCount + " file" + (RecentCount === 1 ? "" : "s") + " listed";
		Debugging.Trace("--> | All settings OK.");
		Debugging.Trace("--> Reading settings...");
		Debugging.Trace("--> | Key: Miscellaneous");
		Debugging.Trace("--> | | Recent: " + RecentText);
		Debugging.Trace("--> | | Tester: " + (Registry.Exists("Miscellaneous\\Tester") ? "path set" : "doesn't exist"));
		Debugging.Trace("--> | Key: Options");
		Debugging.Trace("--> | | ChkTabs: " + Boolean(Registry.Read("Options\\ChkTabs")));
		Debugging.Trace("--> | | ChkSaveAction: " + Boolean(Registry.Read("Options\\ChkSaveAction")));
		Debugging.Trace("--> | | ChkSaveMins: " + Boolean(Registry.Read("Options\\ChkSaveMins")));
		Debugging.Trace("--> | | EdtSaveMins: " + Registry.Read("Options\\EdtSaveMins"));
		Debugging.Trace("--> | | ChkSystemTags: " + Boolean(Registry.Read("Options\\ChkSystemTags")));
		Debugging.Trace("--> | | ChkDebug: " + Boolean(Registry.Read("Options\\ChkDebug")));
		Debugging.Trace("--> | | ChkDebugNotif: " + Boolean(Registry.Read("Options\\ChkDebugNotif")));
		Debugging.Trace("--> Ready to go!");
		Debugging.Trace("<-- End sign-in. -->");
		if (!Registry.Read("Options\\ChkDebug"))
		{
			try
			{
				FSO.DeleteFile(MsgPlus.ScriptFilesPath + "\\Debug.log");
			}
			catch (error)
			{
			}
		}
		if (FSO.FileExists(PresetFile))
		{
			LoadFile(PresetFile);
			Presets = Interface.Window; // load presets file
			VarCleanup();
		}
		else
		{
			Presets = []; // empty array
		}
		MsgPlus.AddTimer("AutoSave", 100);
		if (FSO.FileExists(BackupFile)) // Messenger crashed with the editor open in the last session, let's recover the file
		{
			if (Dialog.Show("Recover a session...", "It appears that Messenger crashed whilst a file was open Interface Writer.\nWould you like to try and recover the file?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No) === Dialog.Result.Yes)
			{
				MsgPlus.AddTimer("WaitLoad|" + BackupFile, 100); // doesn't like immediate loading, so we'll add a timer instead
			}
		}
		if (!Registry.Exists("Miscellaneous\\Notified"))
		{
			MsgPlus.DisplayToast(NAME, "In order to keep your version of Interface Writer up-to-date, you can download the WWC Updater.  Click here to find out more...", "", "InitializeNotifyUpdater"); // link to update script
			Registry.Write("Miscellaneous\\Notified", 1, "REG_DWORD");
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function InitializeNotifyUpdater()
{
	SHELL.run("\"http://mpls.ww-c.cz.cc/download/#WWC Updater\"");
}

function OnEvent_Signout(Email)
{
	try
	{
		Debugging.Call("Signout", {"Email" : Email});
		Debugging.Trace("<-- Start sign-out. -->");
		Debugging.Trace("--> Clearing variables, closing windows...");
		VarCleanup(); // clears all variables, files etc.
		Debugging.Trace("--> | Completed.");
		Debugging.Trace("--> Finished!");
		Debugging.Trace("<-- End sign-out. -->");
		if (Registry.Read("Options\\ChkDebug"))
		{
			Debugging.Save(MsgPlus.ScriptFilesPath + "\\Debug.log"); // save the log if debug enabled
		}
		Interface.Window = Presets;
		SaveFilePath(PresetFile); // save presets file
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnEvent_Uninitialize(MessengerExit)
{
	try
	{
		Debugging.Call("Uninitialize", {"MessengerExit" : MessengerExit});
		Debugging.Trace("<-- Start uninitialization. -->");
		Debugging.Trace("--> Checking sign-in state...");
		if (Messenger.MyStatus > 1)
		{
			Debugging.Trace("--> | Forwarding to sign-out function...");
			Debugging.Trace("<-- End uninitialization. -->");
			OnEvent_Signout(Messenger.MyEmail); // still signed in
		}
		else
		{
			Debugging.Trace("--> | Not signed in.");
			Debugging.Trace("<-- End uninitialization. -->");
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
