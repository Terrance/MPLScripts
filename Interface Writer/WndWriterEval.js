/*
File: WndWriterEval.js
Events for processing evaluation commands from the debug evaluator (use with caution).
*/

function OnWndWriterEvalEvent_Build()
{
	Debugging.Call("WndWriterEval / Build", {});
	CloseWnd(WndWriterEval);
	WndWriterEval = OpenWnd("Writer", "Writer", "Eval");
}

function OnWndWriterEvalEvent_CtrlClicked(PlusWnd, ControlId)
{
	try
	{
		Debugging.Call("WndWriterEval / CtrlClicked", {"PlusWnd" : PlusWnd.Handle, "ControlId" : ControlId});
		switch (ControlId)
		{
			case "BtnLoad": // load another JS file into the evaluator
				var Path = BrowseForFile("Load a script file...", ScriptDir, false, "", "", WndWriterEval.Handle, "Messenger Plus! Live script files (*.js)|*.js|Text files (*.txt)|*.txt|Any types of files (*.*)|*.*||");
				if (!Registry.Exists("Options\\ChkUnlockIntDir") && Path.indexOf(MsgPlus.ScriptFilesPath) !== -1)
				{
					Dialog.Show("Load a script file...", "Script files in this directory are not allowed to be accessed.", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEval);
				}
				else if (Path !== false)
				{
					if (FSO.FileExists(Path))
					{
						var TextFile = FSO.GetFile(Path).OpenAsTextStream(1, -1);
						if (TextFile.AtEndOfStream)
						{
							Dialog.Show("Load a script file...", "The specified file contains no code.", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEval);
						}
						else
						{
							WndWriterEval.SetControlText("EdtCode", TextFile.ReadAll());
						}
						TextFile.Close();
					}
					else
					{
						Dialog.Show("Load a script file...", "The specified path points to a directory that does not exist.", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEval);
						OnWndWriterEvalEvent_CtrlClicked(PlusWnd, ControlId);
					}
				}
				break;
			case "BtnSave": // save the evaluator contents to a JS file
				var Path = BrowseForFile("Save a script file...", ScriptDir, true, "", "", WndWriterEval.Handle, "Messenger Plus! Live script files (*.js)|*.js|Text files (*.txt)|*.txt|Any types of files (*.*)|*.*||");
				if (!Registry.Exists("Options\\ChkUnlockIntDir") && Path.indexOf(MsgPlus.ScriptFilesPath) !== -1)
				{
					Dialog.Show("Save a script file...", "Script files in this directory are not allowed to be accessed.", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEval);
				}
				else if (Path !== false)
				{
					var TextFile = FSO.OpenTextFile(Path, 2, 1, -1);
					var Code = WndWriterEval.GetControlText("EdtCode").split("\r\n");
					for (var X in Code)
					{
						TextFile.WriteLine(Code[X]);
					}
					TextFile.Close();
				}
				break;
			case "BtnEval":
				try // for security reasons, to try and stop some problems
				{
					eval(WndWriterEval.GetControlText("EdtCode")); // caution with this function!
				}
				catch (error) // failed - syntax error?
				{
					Dialog.Show("Evaluate some code...", "An error occured whilst parsing the code.\nReason: " + error.description + ".", Dialog.Icon.Error, Dialog.Buttons.OK, WndWriterEval);
				}
				break;
		}
	}
	catch (error)
	{
		Debugging.Catch(error);
	}
}
