/*
File: Events.js
Provides the initialize and uninitialize events.
*/

function OnEvent_Initialize(MessengerStart)
{
	try
	{
		Debugging.Call("Initialize", {"MessengerStart" : MessengerStart});
		if (VersionCheck() && !MessengerStart)
		{
			Toast("Files reloaded successfully!", "File changes have occured, so " + NAME + " has been reloaded."); // check files have reloaded
		}
		if (Messenger.MyStatus > 1)
		{
			OnEvent_SigninReady(Messenger.MyEmail);
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
		Install = [];
		Debugging.Trace("<-- Start tool include. -->");
		Debugging.Trace("--> Searching for tools...");
		for (var ToolsEnum = new Enumerator(ActiveX["FSO"].GetFolder(MsgPlus.ScriptFilesPath + "\\Tools").Files); !ToolsEnum.atEnd(); ToolsEnum.moveNext())
		{
			var ID = ToolsEnum.item().Name.split("."); // start tool validation
			if (ID[1] === "js") // JS file?
			{
				ID = ID[0];
				Debugging.Trace("--> | Processing file \"" + ID + ".js\"...");
				var Short = (ID.length > 15 ? ID.substr(0, 12) + " (...)" : ID + ".js");
				var Path = MsgPlus.ScriptFilesPath + "\\Tools\\" + ID + ".js";
				var XML = MsgPlus.ScriptFilesPath + "\\Tools\\" + ID + ".xml";
				var Stream = ActiveX["FSO"].GetFile(Path).OpenAsTextStream(1, -1);
				var File = Stream.ReadAll();
				Stream.Close();
				var Split = File.split("\r\n");
				var Loop = 0;
				while (Loop < 2)
				{
					for (var X in Split)
					{
						if (Split[X].indexOf("//") === 0 || Split[X].indexOf("/*") === 0 || Split[X].length === 0)
						{
							Split.splice(X, 1);
						}
					}
					Loop++;
				}
				if (ID.match(/[^A-Za-z0-9_]/gi)) // ID has valid characters?
				{
					Debugging.Trace("--> | | Failed: invalid tool ID.");
					Toast("Tool load failed...", "File: " + Short + "\nReason: invalid tool ID (...).", "LoadFailInfo", 0);
					continue;
				}
				else if (Split[0].indexOf("Tool.New(") === -1) // calls initialize function?
				{
					Debugging.Trace("--> | | Failed: no initialize call.");
					Toast("Tool load failed...", "File: " + Short + "\nReason: no initialize call (...).", "LoadFailInfo", 1);
					continue;
				}
				else if (Split[0].indexOf("Tool.New(\"" + ID + "\");") === -1 && Split[0].indexOf("Tool.New('" + ID + "');") === -1) // calls function properly?
				{
					Debugging.Trace("--> | | Failed: tool ID mismatch.");
					Toast("Tool load failed...", "File: " + Short + "\nReason: tool ID mismatch (...).", "LoadFailInfo", 2);
					continue;
				}
				else if (!ActiveX["FSO"].FileExists(XML)) // has an associated XML file?
				{
					Debugging.Trace("--> | | Failed: no interface file.");
					Toast("Tool load failed...", "File: " + Short + "\nReason: no interface file (...).", "LoadFailInfo", 3);
					continue;
				}
				else if (ActiveX["XML"].load(XML)) // valid XML?
				{
					if (ActiveX["XML"].selectSingleNode("//Interfaces/Window[@Id=\"Wnd" + ID + "\"]") === null) // has a tool window?
					{
						Debugging.Trace("--> | | Failed: no tool window.");
						Toast("Tool load failed...", "File: " + Short + "\nReason: no tool window (...).", "LoadFailInfo", 5);
						continue;
					}
					else if (ActiveX["XML"].selectSingleNode("//Interfaces/Window[@Id=\"Wnd" + ID + "\"]/ChildTmpl") === null) // is a child window?
					{
						Debugging.Trace("--> | | Failed: not a child window.");
						Toast("Tool load failed...", "File: " + Short + "\nReason: not a child window (...).", "LoadFailInfo", 6);
						continue;
					}
					var Position, Window;
					try // valid position tags?
					{
						Position = ActiveX["XML"].selectSingleNode("//Interfaces/Window[@Id=\"Wnd" + ID + "\"]/Position");
						Window = [parseInt(Position.getAttribute("Width")), parseInt(Position.getAttribute("Height"))];
						if (Window[0] === null || Window[1] === null)
						{
							throw null;
						}
					}
					catch (error)
					{
						Debugging.Trace("--> | | Failed: invalid window.");
						Toast("Tool load failed...", "File: " + Short + "\nReason: invalid dimensions (...).", "LoadFailInfo", 7);
						continue;
					}
					if (Registry.Read(ID, true)) // tool been installed yet?
					{
						MsgPlus.LoadScriptFile("Tools\\" + ID + ".js"); // perfect, include the tool!
						if (T[ID] === undefined)
						{
							Toast("Tool load failed...", "File: " + Short + "\nReason: syntax error (...).", "LoadFailInfo", 8);
						}
						else
						{
							T[ID].W = Window;
							Debugging.Trace("--> | | Tool included successfully.");
							if (!Registry.Read(ID + "\\Enabled")) // enabled?
							{
								Debugging.Trace("--> | | Tool not enabled.");
								Tool.Disable(ID);
							}
						}
					}
					else
					{
						Debugging.Trace("--> | | Tool not yet installed.");
						Install.push([ID, File, Window]); // add to install queue
					}
				}
				else
				{
					Debugging.Trace("--> | | Failed: invalid XML file.");
					Toast("Tool load failed...", "File: " + Short + "\nReason: invalid XML file (...).", "LoadFailInfo", 4);
					continue;
				}
				Debugging.Trace("--> | All tools processed.");
			}
		}
		Debugging.Trace("<-- End tool include. -->");
		if (Install.length === 1)
		{
			Toast("A tool is ready to install!", "Click to install \"" + Install[0][0] + "\".", "WndInstall_Build", Install[0]);
		}
		else if (Install.length > 1)
		{
			Toast(Install.length + " tools are ready to install!", "Click here to install them (you can choose which in a moment).", "WndMulti_Build", Install);
		}
		if (!Registry.Exists("Notified"))
		{
			Toast("Get the latest version...", "Download the WWC Updater to keep " + NAME + " up-to-date.", "InitializeNotifyUpdater"); // link to update script
			Registry.Write("Notified", 1, "REG_DWORD");
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function InitializeNotifyUpdater()
{
	ActiveX["WSS"].run("\"http://mpls.ww-c.cz.cc/download/#WWC Updater\"");
}

function LoadFailInfo(Error)
{
	var Message = "";
	switch (Error)
	{
		case 0:
			Message = "The tool ID can only contain letters, numbers and underscores.  You may use other characters in the tool's name, but not in the ID.";
			break;
		case 1:
			Message = "The tool script must call the Tool.New() function on the first line.  If the function is called, but further on in the script, move the function to the top.  Remember: you should not create global variables, due to possible conflicts with other tools - make sure you use the T['...'].V['...'] array for storing data.";
			break;
		case 2:
			Message = "The ID of the tool must match the file name of the tool files.  Either rename the files to match the ID used within the files, or change the IDs in the files to match the file names.";
			break;
		case 3:
			Message = "An interface file under the same name as the tool file cannot be found.  The XML file must share the same name as the JS file, and must also be within the Tools folder.";
			break;
		case 4:
			Message = "The supplied XML file appears to be invalid.";
			break;
		case 5:
			Message = "The interface file does not appear to have a window under the tool's name.  The main tool window must be named 'Wnd{ToolName}' (for example, 'WndMyTool').";
			break;
		case 6:
			Message = "The tool window must use the <ChildTmpl/> tag, so that it can be embedded into " + NAME + ".";
			break;
		case 7:
			Message = "The tool window does not appear to have a valid <Position> tag.  The window must have a width and height set.  Client position attributes are not supported.";
			break;
		case 8:
			Message = "The tool JS file may have a syntax error, meaning that it wasn't imported into " + NAME + ".";
			break;
		default:
			return;
	}
	Dialog.Show("Load", Message, Dialog.Icon.Info);
}

function OnEvent_Signout(Email)
{
	try
	{
		Debugging.Call("Signout", {"Email" : Email});
		if (Registry.Read("Debug"))
		{
			Debugging.Save(MsgPlus.ScriptFilesPath + "\\Debug.log"); // save the log if debug enabled
		}
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
		if (Messenger.MyStatus > 1)
		{
			OnEvent_Signout(Messenger.MyEmail); // still signed in (reload?)
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
