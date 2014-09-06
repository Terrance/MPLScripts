/*
File: WndWriterAddWindow.js
Events for processing window addition functions.
*/

function OnWndWriterAddWindowEvent_Build()
{
	Debugging.Call("WndWriterAddWindow / Build", {});
	CloseWnd(Close.Wnd);
	WndWriterAddWindow = OpenWnd("Windows", "Writer", "AddWindow"); // yay, lots of drop-down population
	WndWriterAddWindow.Button_SetCheckState("ChkIcon", true);
	for (var X in EnumWindowTemplate)
	{
		WndWriterAddWindow.Combo_AddItem("CmbTemplate", EnumWindowTemplate[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterAddWindow.Combo_SetCurSel("CmbTemplate", 0);
	for (var X in EnumWindowBottomBar)
	{
		WndWriterAddWindow.Combo_AddItem("CmbBottomBar", EnumWindowBottomBar[X] + (X == 0 ? " (default)" : ""));
	}
	WndWriterAddWindow.Combo_SetCurSel("CmbBottomBar", 0);
	for (var X in EnumWindowInitialPos)
	{
		WndWriterAddWindow.Combo_AddItem("CmbInitialPos", EnumWindowInitialPos[X] + (X == 1 ? " (default)" : ""));
	}
	WndWriterAddWindow.Combo_SetCurSel("CmbInitialPos", 1);
	WndWriterAddWindow.Button_SetCheckState("ChkMinimize", true);
	WndWriterAddWindow.Button_SetCheckState("ChkClose", true);
	WndWriterAddWindow.Button_SetCheckState("ChkIsAbsolute", true);
}

function OnWndWriterAddWindowEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddWindow / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnTitle": // write title attribute tag to extra code
				var TmpExtra = "<Attributes>\r\n";
				TmpExtra += "	<Caption>" + WndWriterAddWindow.GetControlText("EdtTitle") + "</Caption>\r\n";
				TmpExtra += "</Attributes>";
				Writer.Extra = TmpExtra + (Writer.Extra === "" ? "" : "\r\n" + Writer.Extra);
			case "BtnCode":
				OnWndWriterExtraCodeEvent_Build();
				break;
			case "MnuAdd":
			case "MnuSave":
			case "MnuBoth":
				var WndId = WndWriterAddWindow.GetControlText("EdtId");
				var Icon = WndWriterAddWindow.Button_IsChecked("ChkIcon");
				var Title = WndWriterAddWindow.GetControlText("EdtTitle");
				var Template = WndWriterAddWindow.Combo_GetCurSel("CmbTemplate");
				var BottomBar = WndWriterAddWindow.Combo_GetCurSel("CmbBottomBar");
				var Width = WndWriterAddWindow.GetControlText("EdtWidth");
				var Height = WndWriterAddWindow.GetControlText("EdtHeight");
				var InitialPos = WndWriterAddWindow.Combo_GetCurSel("CmbInitialPos");
				var Resizeable = WndWriterAddWindow.Button_IsChecked("ChkResizeable");
				var IsAbsolute = WndWriterAddWindow.Button_IsChecked("ChkIsAbsolute");
				var Minimize = WndWriterAddWindow.Button_IsChecked("ChkMinimize");
				var Maximize = WndWriterAddWindow.Button_IsChecked("ChkMaximize");
				var Close = WndWriterAddWindow.Button_IsChecked("ChkClose");
				var Extra = Writer.Extra;
				if (ControlId === "MnuAdd" || ControlId === "MnuBoth") // add to interface
				{
					Debugging.Trace("<-- Start window add. -->");
					Debugging.Trace("--> Checking existance of window \"" + WndId + "\"...");
					var Ok = true;
					for (var AllWndsId in Interface.Window)
					{
						if (WndId.toLowerCase() === AllWndsId.toLowerCase())
						{
							Debugging.Trace("--> | Window already exists.");
							Debugging.Trace("--> | | Asking to overwrite...");
							Ok = Dialog.Show("Add a new window...", "Do you want to replace the existing window \"" + AllWndsId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterAddWindow) === Dialog.Result.Yes;
							if (Ok)
							{
								if (!Writer.DeleteWnd(AllWndsId))
								{
									Debugging.Trace("--> | | Failed to overwrite.");
									Dialog.Show("Add a new window...", "An error occured whilst overwriting the window \"" + AllWndsId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterAddWindow);
									break;
								}
							}
							break;
						}
					}
					if (Ok)
					{
						Debugging.Trace("--> | Window does not exist (or can be overwritten).");
						Debugging.Trace("--> Collecting information for new window \"" + WndId + "\"..."); // might as well dump it in the debug
						Debugging.Trace("--> | Title: " + (Icon ? "[icon] " : "") + (Title === "" ? "(none)" : Title));
						Debugging.Trace("--> | Allow: " + (Minimize || Maximize || Close ? (Minimize ? "minimize, " : "") + (Maximize ? "maximize, " : "") + (Close ? "close" : "") : "(none)"));
						Debugging.Trace("--> | Template: " + EnumWindowTemplate[Template] + (Template === 0 ? " (Bottom Bar: " + EnumWindowBottomBar[BottomBar] + ")" : ""));
						Debugging.Trace("--> | Positioning: " + EnumWindowInitialPos[InitialPos]);
						Debugging.Trace("--> | Size: " + Width + " x " + Height + " (" + (IsAbsolute ? "pixels" : "dialog units") + ")");
						Debugging.Trace("--> | Extra: " + (Extra !== ""));
						Debugging.Trace("--> Adding window object to the interface array...");
						if (Writer.AddWnd(WndId, Icon, Title, Template, BottomBar, Width, Height, InitialPos, Resizeable, IsAbsolute, Minimize, Maximize, Close, Extra)) // yay!
						{
							Debugging.Trace("--> | Window add successful.");
							ProcessAutoSave();
							OnWndWriterManageWindowsEvent_Populate();
							OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" added to interface.");
						}
						else // this shouldn't happen, but just in case...
						{
							Debugging.Trace("--> | Window add error.");
							Dialog.Show("Add a new window...", "An error occured whilst adding the window \"" + WndId + "\".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterAddWindow);
						}
					}
					else
					{
						Debugging.Trace("--> | Window cannot be overwritten.");
					}
					Debugging.Trace("<-- End window add. -->");
				}
				if (ControlId === "MnuSave" || ControlId === "MnuBoth") // add to presets
				{
					if (Presets[WndId] !== undefined)
					{
						if (Dialog.Show("Add a new window...", "Do you want to replace the existing preset window \"" + WndId + "\"?", Dialog.Icon.Question, Dialog.Buttons.Yes_No, WndWriterAddWindow) === Dialog.Result.No)
						{
							break;
						}
					}
					Presets[WndId] = {}; // not a good way of doing this - needs to sync with file more often
					Presets[WndId].Icon = Icon;
					Presets[WndId].Title = Title;
					Presets[WndId].Template = Template;
					Presets[WndId].BottomBar = BottomBar;
					Presets[WndId].Width = Width;
					Presets[WndId].Height = Height;
					Presets[WndId].InitialPos = InitialPos;
					Presets[WndId].Resizeable = Resizeable;
					Presets[WndId].IsAbsolute = IsAbsolute;
					Presets[WndId].Minimize = Minimize;
					Presets[WndId].Maximize = Maximize;
					Presets[WndId].Close = Close;
					Presets[WndId].Extra = Extra;
					Presets[WndId].Control = {};
					Presets[WndId].Element = {};
					OnWndWriterManageWindowsEvent_Status("Window \"" + WndId + "\" added to " + (ControlId === "MnuBoth" ? "interface and " : "") + "presets.");
				}
				CloseWnd(WndWriterAddWindow);
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterAddWindowEvent_EditTextChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddWindow / EditTextChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		Enable(WndWriterAddWindow, "BtnAdd", !WndWriterAddWindow.GetControlText("EdtId").match(/[^A-Za-z0-9_]/g) && WndWriterAddWindow.GetControlText("EdtId") !== "" && WndWriterAddWindow.GetControlText("EdtWidth") !== "" && WndWriterAddWindow.GetControlText("EdtHeight") !== ""); // ID has valid characters and is not blank, and width and height are not blank
		if (WndWriterAddWindow.Combo_GetCurSel("CmbTemplate") === 2) // child window?
		{
			Enable(WndWriterAddWindow, "ChkIcon", 0);
			Enable(WndWriterAddWindow, "EdtTitle", 0);
			Enable(WndWriterAddWindow, "BtnTitle", 0);
			Enable(WndWriterAddWindow, "CmbBottomBar", 0);
			Enable(WndWriterAddWindow, "CmbInitialPos", 0);
			Enable(WndWriterAddWindow, "ChkResizeable", 0);
			Enable(WndWriterAddWindow, "ChkMinimize", 0);
			Enable(WndWriterAddWindow, "ChkMaximize", 0);
			Enable(WndWriterAddWindow, "ChkClose", 0);
		}
		else
		{
			Enable(WndWriterAddWindow, "ChkIcon", 1);
			Enable(WndWriterAddWindow, "EdtTitle", 1);
			Enable(WndWriterAddWindow, "BtnTitle", 1);
			Enable(WndWriterAddWindow, "CmbBottomBar", WndWriterAddWindow.Combo_GetCurSel("CmbTemplate") === 0); // only if a dialog
			Enable(WndWriterAddWindow, "CmbInitialPos", 1);
			Enable(WndWriterAddWindow, "ChkResizeable", 1);
			Enable(WndWriterAddWindow, "ChkMinimize", 1);
			Enable(WndWriterAddWindow, "ChkMaximize", 1);
			Enable(WndWriterAddWindow, "ChkClose", 1);
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterAddWindowEvent_ComboSelChanged(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterAddWindow / ComboSelChanged", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		OnWndWriterAddWindowEvent_EditTextChanged(WndWriterAddWindow, ControlId);
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}

function OnWndWriterAddWindowEvent_Destroyed(PlusWnd, ExitCode)
{
	try
	{
		Debugging.Call("WndWriterAddWindow / Destroyed", {"PlusWnd" : PlusWnd.Handle, "ExitCode" : ExitCode});
		CloseWnd(WndWriterExtraCode);
		Writer.Extra = "";
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
