/*
File: ObjDebugging.js
Provides the debugging object for custom debug actions.
*/

var Debugging = {};

Debugging.Start = new Date(); // start time
Debugging.Data = []; // array
Debugging.Last = ""; // last event called (for error alert)

Debugging.Trace = function(Text)
{
	if (Messenger.MyStatus > 1) // signed in?
	{
		try
		{
			if (Registry.Read("Options\\ChkDebug")) // debug enabled?
			{
				Debug.Trace(Text);
				Debugging.Data.push(Text);
			}
		}
		catch (error) // first use, maybe?
		{
			Debug.Trace(Text);
			Debugging.Data.push(Text);
		}
	}
	else // not signed in, debug anyway
	{
		Debug.Trace(Text);
		Debugging.Data.push(Text);
	}
}

Debugging.Call = function(Function, Parameters)
{
	Debugging.Last = Function;
	var Notif = Function.substr(Function.length - 19, Function.length);
	if ((Notif !== "MessageNotification" || (Notif === "MessageNotification" && Registry.Read("Options\\ChkDebugNotif"))) && (Function !== "Timer" || (Function === "Timer" && Registry.Read("Options\\ChkDebugTimer")))) // conditions, based on debug settings
	{
		Debugging.Trace("=================================================================");
		Debugging.Trace("** Event called: " + Function + " **");
		Debugging.Trace("Call time: " + new Date());
		Debugging.Trace("-----------------------------------------------------------------");
		var Count = 0;
		for (var Parameter in Parameters) // loop through parameters
		{
			Debugging.Trace("|| " + Parameter + ": " + Parameters[Parameter]);
			Count++;
		}
		if (Count === 0)
		{
			Debugging.Trace("(no attached parameters)");
		}
		Debugging.Trace("=================================================================");
	}
}

Debugging.Catch = function(Error)
{
	Debugging.Trace("/////////////////////////////////////////////////////////////////");
	Debugging.Trace("** Error in: " + Debugging.Last + " **");
	Debugging.Trace("Description: " + Error.description + " (" + Error.number + ")");
	Debugging.Trace("Error time: " + new Date());
	Debugging.Trace("/////////////////////////////////////////////////////////////////");
	if (Registry.Read("Options\\ChkDebug")) // show toast
	{
		MsgPlus.DisplayToastContact(NAME, "[b]" + Debugging.Last.split(" / ")[0] + "[/b]", "An error has occured:\n" + Error.description, "", "DebugCatchToast", { "description" : Error.description, "number" : Error.number, "last" : Debugging.Last }); // doesn't support object function as callback
	}
}

function DebugCatchToast(Error) // workaround for toast click to open alert
{
	Dialog.Show("Error (" + Error.last + ")...", "An error has occured whilst running the function \"" + Error.last + "\".\nError description: " + Error.description + " (" + Error.number + ")", Dialog.Icon.Error, Dialog.Buttons.OK);
}

Debugging.Save = function(Path)
{
	var TextFile = FSO.CreateTextFile(Path, 2);
	TextFile.WriteLine("");
	TextFile.WriteLine("=================================================================");
	TextFile.WriteLine("**************** Interface Writer: Debugging Log ****************");
	TextFile.WriteLine("-----------------------------------------------------------------");
	TextFile.WriteLine("Start time: " + Debugging.Start);
	TextFile.WriteLine("=================================================================");
	TextFile.WriteLine("");
	for (var X in Debugging.Data) // loop through data
	{
		TextFile.WriteLine(Debugging.Data[X]);
	}
	TextFile.WriteLine("");
	TextFile.WriteLine("=================================================================");
	TextFile.WriteLine("End time: " + new Date()); // export date/time
	TextFile.WriteLine("=================================================================");
	TextFile.Close();
}
