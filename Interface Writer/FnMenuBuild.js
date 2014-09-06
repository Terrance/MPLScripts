/*
File: FnMenuBuild.js
Manages the script menu and menu click events.
*/

function OnGetScriptMenu(Location)
{
	try
	{
		Debugging.Call("ScriptMenu", {"Location" : Location});
		var Menu = "<ScriptMenu>\n";
		Menu += "	<MenuEntry Id=\"Create\">Create...</MenuEntry>\n";
		Menu += "	<Separator/>\n";
		Menu += "	<MenuEntry Id=\"Load\">Load...</MenuEntry>\n";
		var Recent = Registry.Read("Miscellaneous\\Recent").split("|").reverse(); // last used first
		var Count = 0;
		var List = "";
		for (var X in Recent)
		{
			if (Recent[X] !== "") // don't show blank slots
			{
				Count++;
				List += "		<MenuEntry Id=\"Recent|" + Recent[X] + "\">" + Count + ") " + Recent[X] + (FSO.FileExists(Recent[X]) ? "" : " [?]") + "</MenuEntry>\n";
			}
		}
		if (List !== "")
		{
			Menu += "	<SubMenu Label=\"Recent\">\n";
			Menu += List;
			Menu += "		<Separator/>\n";
			Menu += "		<MenuEntry Id=\"Recent|Clear\">Clear recent files list...</MenuEntry>\n";
			Menu += "	</SubMenu>\n";
		}
		Menu += "	<SubMenu Label=\"View\">\n";
		Menu += "		<MenuEntry Id=\"View|Viewer\">Interface Viewer (script)...</MenuEntry>\n";
		Menu += "		<MenuEntry Id=\"View|Tester\">Interface Tester (external)...</MenuEntry>\n";
		if (Registry.Exists("Miscellaneous\\Tester")) // is Interface Tester located?
		{
			Menu += "		<Separator/>\n";
			Menu += "		<MenuEntry Id=\"View|Find\">Re-locate Interface Tester...</MenuEntry>\n";
		}
		Menu += "	</SubMenu>\n";
		Menu += "	<Separator/>\n";
		if (NowEditing === 0) // the editor isn't open
		{
			Menu += "	<SubMenu Label=\"Presets\">\n";
			Menu += "		<MenuEntry Id=\"Presets|Load\">Load</MenuEntry>\n";
			Menu += "		<MenuEntry Id=\"Presets|Save\">Save</MenuEntry>\n";
			Menu += "		<Separator/>\n";
			if (FSO.FileExists(PresetFile)) // does the preset file exist?
			{
				Menu += "		<SubMenu Label=\"Edit\">\n";
				Menu += "			<MenuEntry Id=\"Presets|Edit\">Interface Writer...</MenuEntry>\n";
				Menu += "			<MenuEntry Id=\"Presets|XML\">Raw XML code...</MenuEntry>\n";
				Menu += "		</SubMenu>\n";
			}
			else
			{
				Menu += "		<MenuEntry Id=\"Presets|XML\">Create...</MenuEntry>\n";
			}
			Menu += "	</SubMenu>\n";
		}
		else
		{
			Menu += "	<MenuEntry Id=\"Presets|XML\">Presets...</MenuEntry>\n";
		}
		Menu += "	<Separator/>\n";
		Menu += "	<MenuEntry Id=\"Options\">Options...</MenuEntry>\n";
		Menu += "	<MenuEntry Id=\"About\">About...</MenuEntry>\n";
		if (Registry.Read("Options\\ChkDebug")) // debug options enabled?
		{
			Menu += "	<Separator/>\n";
			Menu += "	<SubMenu Label=\"Debug\">\n";
			Menu += "		<MenuEntry Id=\"Debug|Files\">Open script files</MenuEntry>\n";
			Menu += "		<Separator/>\n";
			Menu += "		<MenuEntry Id=\"Debug|Eval\">Show evaluator...</MenuEntry>\n";
			Menu += "		<MenuEntry Id=\"Debug|Reg\">Registry Editor...</MenuEntry>\n";
			if (FSO.FileExists(MsgPlus.ScriptFilesPath + "\\Debug.log")) // log file exists?
			{
				Menu += "		<Separator/>\n";
				Menu += "		<MenuEntry Id=\"Debug|Open\">Open log file...</MenuEntry>\n";
				Menu += "		<MenuEntry Id=\"Debug|Delete\">Delete log file</MenuEntry>\n";
			}
			Menu += "		<Separator/>\n";
			Menu += "		<MenuEntry Id=\"Debug|Clear\">Clear debug data</MenuEntry>\n";
			Menu += "		<Separator/>\n";
			Menu += "		<MenuEntry Id=\"Debug|Export\">Export log now</MenuEntry>\n";
			Menu += "	</SubMenu>\n";
		}
		return Menu += "</ScriptMenu>";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	try
	{
		Debugging.Call("MenuClicked", {"MenuItemId" : MenuItemId, "Location" : Location, "OriginWnd" : typeof(OriginWnd) === "object" ? OriginWnd.Handle : (OriginWnd === undefined ? "undefined (recursive call)" : Messenger.ContactListWndHandle)});
		switch (MenuItemId)
		{
			case "Create":
				if (NowEditing !== 0)
				{
					if (Dialog.Show("Create a new interface...", "You are currently using the " + (NowEditing === 2 ? "viewer" : "editor") + " with another file.\nIf you create a new interface, any unsaved changes will be lost.\n\n\Are you sure that you wish to create a new interface?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No) === Dialog.Result.No)
					{
						break;
					}
					VarCleanup();
				}
				if (Dialog.Show("Create a new interface...", "Do you want to create a file to save the interface in?", Dialog.Icon.Question, Dialog.Buttons.Yes_No) === Dialog.Result.Yes)
				{
					var Path = BrowseForFile("Create a new interface...", ScriptDir, true, "", "", WndSubclass.Handle);
					if (!Path)
					{
						break;
					}
					FilePath = Path;
					Debugging.Trace("<-- Start file save. -->");
					var WorkPath = FilePath.split("\\");
					Debugging.Trace("--> File to save: " + WorkPath[WorkPath.length - 1]);
					delete WorkPath[WorkPath.length - 1];
					WorkPath = WorkPath.join("\\");
					WorkPath = WorkPath.substr(0, WorkPath.length - 1);
					Debugging.Trace("--> | In directory: " + WorkPath);
					Debugging.Trace("--> Checking existance of directories...");
					if (FSO.FolderExists(WorkPath))
					{
						Debugging.Trace("--> | Directory exists.");
						if (WorkPath === MsgPlus.ScriptFilesPath + "\\Interfaces")
						{
							Debugging.Trace("--> | File is in a directory of restricted access.");
							Dialog.Show("Create a new interface...", "Interfaces in this folder are not allowed to be accessed.", Dialog.Icon.Error, Dialog.Buttons.OK);
							OnEvent_MenuClicked(MenuItemId, Location, OriginWnd);
						}
						else
						{
							Debugging.Trace("--> | File is in accessible directory.");
							Debugging.Trace("--> Saving text file...");
							var TextFile = FSO.OpenTextFile(FilePath, 2, 1, -1);
							if (TextFile)
							{
								Debugging.Trace("--> | File save successful.");
								TextFile.Close();
								NowEditing = 1;
								OnWndWriterManageWindowsEvent_Build();
								OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" created successfully.");
								Debugging.Trace("<-- End file creation. -->");
								break;
							}
							else
							{
								Debugging.Trace("--> | Unknown error in OpenTextFile, cancelling file creation.");
								Dialog.Show("Create a new interface...", "An unknown error occured whilst creating the file.", Dialog.Icon.Error, Dialog.Buttons.OK);
								try
								{
									TextFile.Close();
								}
								catch (error)
								{
								}
								OnEvent_MenuClicked(MenuItemId, Location, OriginWnd); // refresh
							}
						}
					}
					else
					{
						Debugging.Trace("--> | Directory does not exist.");
						Dialog.Show("Create a new interface...", "The specified path points to a directory that does not exist.", Dialog.Icon.Error, Dialog.Buttons.OK);
						OnEvent_MenuClicked(MenuItemId, Location, OriginWnd);
					}
					Debugging.Trace("--> Cancelling file save...");
					FilePath = "";
					Debugging.Trace("<-- End file creation. -->");
				}
				else // yay, it worked!
				{	
					NowEditing = 1;
					OnWndWriterManageWindowsEvent_Build();
					OnWndWriterManageWindowsEvent_Status("File created successfully.");
				}
				break;
			case "Load":
				if (NowEditing !== 0)
				{
					if (Dialog.Show("Load an interface...", "You are currently using the " + (NowEditing === 2 ? "viewer" : "editor") + " with another file.\nIf you load an interface, any unsaved changes will be lost.\n\n\Are you sure that you wish to load an interface?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No) === Dialog.Result.No)
					{
						break;
					}
					VarCleanup();
				}
				var Path = BrowseForFile("Load an interface...", ScriptDir, false, "", "", WndSubclass.Handle);
				if (!Path)
				{
					break;
				}
				var Result = LoadFile(Path);
				if (Result === true) // yay, it worked!
				{
					NowEditing = 1;
					OnWndWriterManageWindowsEvent_Build();
					OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" loaded successfully.");
					break;
				}
				else
				{
					switch (Result[0])
					{
						case 1:
							OnWndWriterErrorsEvent_Build(Result[1], Result[2]);
							break;
						case 2:
							Dialog.Show("Load an interface...", Result[1], Dialog.Icon.Error, Dialog.Buttons.OK);
							OnEvent_MenuClicked(MenuItemId, Location, OriginWnd);
							break;
					}
				}
				break;
			case "Options":
				OnWndOptionsMenuEvent_Build();
				break;
			case "About":
				OnWndAboutEvent_Build();
				break;
		}
		if (MenuItemId.substr(0, 6) === "Recent")
		{
			var Command = MenuItemId.substr(7, MenuItemId.length);
			if (Command === "Clear")
			{
				Registry.Write("Miscellaneous\\Recent", "||||");
			}
			else if (FSO.FileExists(Command))
			{
				if (NowEditing !== 0)
				{
					if (Dialog.Show("Load an interface...", "You are currently using the " + (NowEditing === 2 ? "viewer" : "editor") + " with another file.\nIf you load an interface, any unsaved changes will be lost.\n\n\Are you sure that you wish to load an interface?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No) === Dialog.Result.No)
					{
						return;
					}
					VarCleanup();
				}
				MsgPlus.AddTimer("WaitLoad|" + Command, 100);
			}
			else
			{
				Dialog.Show("Load an interface...", "This file no longer exists.  Use the \"Load...\" option to locate it.\n" + Command, Dialog.Icon.Error, Dialog.Buttons.OK);
			}
		}
		else if (MenuItemId.substr(0, 4) === "View")
		{
			switch (MenuItemId.substr(5, MenuItemId.length))
			{
				case "Viewer":
					if (NowEditing !== 0)
					{
						if (Dialog.Show("View an interface file...", "You are currently using the " + (NowEditing === 2 ? "viewer" : "editor") + " with another file.\nIf you view an interface file, any unsaved changes will be lost.\n\n\Are you sure that you wish to view an interface file?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No) === Dialog.Result.No)
						{
							break;
						}
						VarCleanup();
					}
					MsgPlus.AddTimer("WaitView", 100);
					break;
				case "Tester":
					if (Registry.Exists("Miscellaneous\\Tester"))
					{
						if (FSO.FileExists(Registry.Read("Miscellaneous\\Tester")))
						{
							SHELL.run("\"" + Registry.Read("Miscellaneous\\Tester") + "\"");
						}
						else
						{
							Dialog.Show("Interface Tester...", "The specified path points to a file that does not exist.", Dialog.Icon.Error, Dialog.Buttons.OK);
							OnEvent_MenuClicked("View|Find", Location, OriginWnd);
						}
					}
					else
					{
						if (Dialog.Show("Interface Tester...", "You need to locate the Interface Tester application before you can use this option.\nThe Interface Tester application can be downloaded from http://www.msgpluslive.net.", Dialog.Icon.Question, Dialog.Buttons.OK_Cancel) === 1)
						{
							OnEvent_MenuClicked("View|Find", Location, OriginWnd);
						}
					}
					break;
				case "Find":
					var Path = BrowseForFile("Interface Tester...", ScriptDir, false, "", "MPInterfaceTester.exe", WndSubclass.Handle, "Executible applications (*.exe)|*.exe||");
					if (Path !== false)
					{
						if (FSO.FileExists(Path))
						{
							Registry.Write("Miscellaneous\\Tester", Path);
							OnEvent_MenuClicked("View|Tester", Location, OriginWnd);
						}
						else
						{
							Dialog.Show("Interface Tester...", "The specified path points to a file that does not exist.", Dialog.Icon.Error, Dialog.Buttons.OK);
							OnEvent_MenuClicked(MenuItemId, Location, OriginWnd);
						}
					}
					break;
			}
		}
		else if (MenuItemId.substr(0, 7) === "Presets") // need to implement a separate method of editing preset file
		{
			switch (MenuItemId.substr(8, MenuItemId.length))
			{
				case "Load":
					if (FSO.FileExists(PresetFile))
					{
						LoadFile(PresetFile);
						Presets = Interface.Window;
						VarCleanup();
					}
					else
					{
						ErrorDialog("Load all preset windows...", "The file \"Presets.xml\" does not exist.  Create a new interface with this name and save it to the Interface Writer directory.", Dialog.Icon.Error, Dialog.Buttons.OK);
					}
					break;
				case "Save":
					Interface.Window = Presets;
					SaveFilePath(PresetFile);
					break;
				case "Edit":
					var Result = LoadFile(PresetFile);
					if (Result === true) // yay, it worked!
					{
						NowEditing = 1;
						OnWndWriterManageWindowsEvent_Build();
						OnWndWriterManageWindowsEvent_Status("File \"" + FilePath + "\" loaded successfully.");
						break;
					}
					else
					{
						switch (Result[0])
						{
							case 1:
								OnWndWriterErrorsEvent_Build(Result[1], Result[2]);
								break;
							case 2:
								Dialog.Show("Load an interface...", Result[1], Dialog.Icon.Error, Dialog.Buttons.OK);
								OnEvent_MenuClicked(MenuItemId, Location, OriginWnd);
								break;
						}
					}
				case "XML":
					if (!FSO.FileExists(PresetFile))
					{
						var TextFile = FSO.OpenTextFile(PresetFile, 2, 1, -1);
						TextFile.Close();
					}
					SHELL.run("notepad \"" + PresetFile + "\"");
					break;
			}
		}
		else if (MenuItemId.substr(0, 5) === "Debug")
		{
			switch (MenuItemId.substr(6, MenuItemId.length))
			{
				case "Files":
					SHELL.run("explorer \"" + MsgPlus.ScriptFilesPath + "\"");
					break;
				case "Eval":
					OnWndWriterEvalEvent_Build();
					break;
				case "Reg":
					SHELL.run("regedit");
					break;
				case "Open":
					SHELL.run("notepad \"" + MsgPlus.ScriptFilesPath + "\\Debug.log\"");
					break;
				case "Delete":
					FSO.DeleteFile(MsgPlus.ScriptFilesPath + "\\Debug.log");
					break;
				case "Clear":
					Debug.ClearDebuggingWindow();
					Debugging.Data = new Array();
					break;
				case "Export":
					Debugging.Save(MsgPlus.ScriptFilesPath + "\\Debug.log");
					break;
			}
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
