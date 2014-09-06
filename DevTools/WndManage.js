/*
File: WndManage.js
Allows the user to enable, disable and remove tools.
*/

function WndManage_Build()
{
	Debugging.Call("WndManage / Build");
	Window.Close(Wnds["Manage"]);
	Window.Close(Wnds["Tools"]);
	var List = Tool.List(false, true);
	if (List.length > 0)
	{
		Window.Open("Manage");
		for (var X in List)
		{
			Wnds["Manage"].Combo_AddItem("CmbSelect", (Registry.Read(List[X] + "\\Enabled") ? T[List[X]].I["Name"] : List[X] + " (disabled)"));
		}
		Wnds["Manage"].Combo_SetCurSel("CmbSelect", 0);
		Wnds["Manage"].SetControlText("BtnToggle", (Registry.Read(List[Wnds["Manage"].Combo_GetCurSel("CmbSelect")] + "\\Enabled") ? "Dis" : "En") + "able");
	}
	else
	{
		Toast("No tools installed!", "You have no tools to manage!  Why not go and download some?");
	}
}

function OnWndManageEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndManage / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var List = Tool.List(false, true);
		var Current = List[Wnds["Manage"].Combo_GetCurSel("CmbSelect")];
		switch (ControlId)
		{
			case "BtnToggle":
				if (Registry.Read(Current + "\\Enabled"))
				{
					Tool.Disable(Current);
				}
				else
				{
					Tool.Enable(Current);
				}
				WndManage_Build(); // refresh
				break;
			case "BtnRemove":
				if (Dialog.Show("Manage", "Are you sure you want to remove the tool \"" + Current + "\"?", Dialog.Icon.Alert, Dialog.Buttons.Yes_No, Wnds["Manage"]) === Dialog.Result.Yes)
				{
					Debugging.Trace("<-- Start tool remove. -->");
					if (Registry.Read(Current + "\\Enabled"))
					{
						Tool.Disable(Current);
					}
					var Name = D[Current].I["Name"];
					Debugging.Trace("--> Preparing to remove tool \"" + Name + "\"...");
					Debugging.Trace("--> | Deleting disable tool object...");
					delete D[Current];
					Debugging.Trace("--> | Deleting associated files...");
					ActiveX["FSO"].DeleteFile(MsgPlus.ScriptFilesPath + "\\Tools\\" + Current + ".js");
					ActiveX["FSO"].DeleteFile(MsgPlus.ScriptFilesPath + "\\Tools\\" + Current + ".xml");
					if (ActiveX["FSO"].FolderExists(MsgPlus.ScriptFilesPath + "\\Tools\\" + Current + "\\"))
					{
						ActiveX["FSO"].DeleteFolder(MsgPlus.ScriptFilesPath + "\\Tools\\" + Current);
					}
					Debugging.Trace("--> | Deleting registry keys...");
					Registry.Delete(Current, true); // installed (global)
					Registry.Delete(Current + "\\"); // entire key (per-user)
					Debugging.Trace("--> Tool removal complete.");
					Toast("Tool removed...", "The tool \"" + Name + "\" has been removed successfully.");
					Debugging.Trace("<-- End tool remove. -->");
					WndManage_Build(); // refresh
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndManageEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndManage / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		var List = Tool.List(false, true);
		var Current = List[Wnds["Manage"].Combo_GetCurSel("CmbSelect")];
		Wnds["Manage"].SetControlText("BtnToggle", (Registry.Read(Current + "\\Enabled") ? "Dis" : "En") + "able");
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
