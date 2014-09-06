/*
File: FnMiscellaneous.js
Functions for enabling window controls, sorting arrays by keys, counting items in objects and so on.
*/

function Enable(Window, Control, Condition) // enable/disable a control
{
	Interop.Call("user32", "EnableWindow", Window.GetControlHandle(Control), Condition);
}

function Checked(Window, Control) // returns the state of the checkbox
{
	return Interop.Call("user32", "SendMessageW", Window.GetControlHandle(Control), 240, 2, 0);
}

function KeySort(Array) // sort an array by key
{
	var Keys = [];
	for (var Key in Array)
	{
     	Keys.push(Key);
	}
	Keys.sort();
	var Return = [];
	for (var Key in Keys)
	{
     	Return[Keys[Key]] = Array[Keys[Key]];
	}
	return Return;
}

function Space(Number) // make white space - where was this used?
{
	var Space = "";
	for (var Count = 0; Count < Number; Count++)
	{
		Space += " ";
	}
	return Space;
}

Enumerator.prototype.count = function() // simplifies counting the number of items in an object
{
	var Count = 0;
	while (!this.atEnd())
	{
		this.moveNext();
		Count++;
	}
	this.moveFirst();
	return Count;
}
