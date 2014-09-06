/*
File: Globals.js
Registers global variables for ActiveXControls, references and so on.
*/

var T = {}; // tools
var D = {}; // disabled

var Install = []; // tools to install on sign-in
var NoClose = false; // fixes Esc glitch

function Enable(Window, Control, Condition) // enable/disable a control
{
	return Interop.Call("user32", "EnableWindow", Window.GetControlHandle(Control), Condition);
}

function Title(Window, Text) // changes a window's title
{
	return Interop.Call("user32", "SetWindowTextW", Window.Handle, (Text === "" ? "" : Text + " / ") + NAME);
}

function Toast(Title, Message, Callback, Param) // display a formatted toast
{
	return MsgPlus.DisplayToastContact(NAME, "[b]" + Title + "[/b]", Message, "", Callback, Param);
}
