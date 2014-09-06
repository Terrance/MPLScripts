/*
File: WndMulti.js
Processes the importing of multiple new tools.
*/

function WndMulti_Build()
{
	Debugging.Call("WndMulti / Build");
	Window.Close(Wnds["Install"]);
	Window.Close(Wnds["Multi"]);
	if (Install.length === 1)
	{
		WndInstall_Build(Install[0]);
	}
	else
	{
		Window.Open("Multi");
		var IDs = [];
		for (var X in Install)
		{
			Wnds["Multi"].Combo_AddItem("CmbSelect", Install[X][0]);
			IDs.push(Install[X][0]);
		}
		Wnds["Multi"].Combo_SetCurSel("CmbSelect", 0);
		Wnds["Multi"].SetControlText("TxtIDs", IDs);
		Title(Wnds["Multi"], "Install (" + Install.length + ")");
	}
}

function OnWndMultiEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndMulti / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var IDs = Wnds["Multi"].GetControlText("TxtID").split("|");
		var Data = Install[Wnds["Multi"].Combo_GetCurSel("CmbSelect")];
		var ID = Data[0];
		switch (ControlId)
		{
			case "BtnInstall":
				WndInstall_Build(Data);
				break;
			case "BtnDelete":
				if (Dialog.Show("Install: " + ID, "Do you want to remove the tool files from the Tools folder?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, Wnds["Install"]) === Dialog.Result.Yes)
				{
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
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndMultiEvent_Cancel(PlusWnd)
{
	try
	{
		Debugging.Call("WndMulti / Cancel", {"PlusWnd" : PlusWnd.Handle});
		Install = [];
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
