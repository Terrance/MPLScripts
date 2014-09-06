/*
File: WndInstall.js
Processes the importing of a new tool.
*/

function WndInstall_Build(Data)
{
	Debugging.Call("WndInstall / Build", {"Data" : Data[0] + " (...)"});
	Window.Close(Wnds["Install"]);
	Window.Close(Wnds["Multi"]);
	Window.Open("Install");
	Wnds["Install"].RichEdit_SetCharFormat("EdtCode", false, -1, -1, -1, -1, -1, -1, "Consolas");
	Wnds["Install"].SetControlText("TxtID", Data[0] + "|" + Data[2]);
	Wnds["Install"].SetControlText("EdtCode", Data[1]);
	Title(Wnds["Install"], "Install: " + Data[0]);
}

function OnWndInstallEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndInstall / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		if (ControlId === "BtnInstall")
		{
			Debugging.Trace("<-- Start tool install. -->");
			var ID = Wnds["Install"].GetControlText("TxtID").split("|");
			Debugging.Trace("--> Installing tool \"" + ID[0] + "\"...");
			Debugging.Trace("--> | Writing installed registry key...");
			Registry.Write(ID[0], 1, "REG_DWORD", true); // installed (global)
			Debugging.Trace("--> | Writing enabled registry key...");
			Registry.Write(ID[0] + "\\Enabled", 1, "REG_DWORD"); // enabled (per-user)
			Debugging.Trace("--> | | Registry keys set.");
			Debugging.Trace("--> | Loading script file...");
			MsgPlus.LoadScriptFile("Tools\\" + ID[0] + ".js");
			var Size = ID[1].split(",");
			Debugging.Trace("--> | | Storing window size (" + Size[0] + " x " + Size[1] + ")...");
			T[ID[0]].W = [parseInt(Size[0]), parseInt(Size[1])];
			Debugging.Trace("--> | Tool installed successfully.");
			Window.Close(Wnds["Install"]);
			Toast("New tool installed!", "\"" + ID[0] + "\" has been installed as is now enabled.");
			if (Install.length === 1)
			{
				Install = [];
				Debugging.Trace("--> | | Install queue cleared.");
			}
			else
			{
				for (var X in Install)
				{
					if (ID[0] === Install[X][0])
					{
						Install.splice(X, 1);
						break;
					}
				}
				Debugging.Trace("--> | | Tool removed from queue.");
				WndMulti_Build();
			}
			Debugging.Trace("<-- End tool install. -->");
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndInstallEvent_Cancel(PlusWnd)
{
	try
	{
		Debugging.Call("WndInstall / Cancel", {"PlusWnd" : PlusWnd.Handle});
		var ID = Wnds["Install"].GetControlText("TxtID").split("|")[0];
		switch (Dialog.Show("Install: " + ID, "Do you want to remove the tool files from the Tools folder?", Dialog.Icon.Question, Dialog.Buttons.Yes_No_Cancel, Wnds["Install"]))
		{
			case Dialog.Result.Yes:
				ActiveX["FSO"].DeleteFile(MsgPlus.ScriptFilesPath + "\\Tools\\" + ID + ".js");
				ActiveX["FSO"].DeleteFile(MsgPlus.ScriptFilesPath + "\\Tools\\" + ID + ".xml");
				if (ActiveX["FSO"].FolderExists(MsgPlus.ScriptFilesPath + "\\Tools\\" + ID + "\\"))
				{
					ActiveX["FSO"].DeleteFolder(MsgPlus.ScriptFilesPath + "\\Tools\\" + ID);
				}
				if (Install.length === 1)
				{
					Install = [];
				}
				else
				{
					for (var X in Install)
					{
						if (ID === Install[X][0])
						{
							Install.splice(X, 1);
							break;
						}
					}
					WndMulti_Build();
				}
				return false;
			case Dialog.Result.No:
				if (Install.length === 1)
				{
					Install = [];
				}
				else
				{
					WndMulti_Build();
				}
				return false;
			case Dialog.Result.Cancel:
				return true;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
