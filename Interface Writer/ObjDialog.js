/*
File: ObjDialog.js
Provides easy access to the Win32 MessageBoxW function, with enumerated variables.
*/

var Dialog = new Object();

Dialog.Icon = {"Error" : 16, "Question" : 32, "Alert" : 48, "Info" : 64};
Dialog.Buttons = {"OK" : 0, "OK_Cancel" : 1, "Abort_Retry_Ignore" : 2, "Yes_No_Cancel" : 3, "Yes_No" : 4, "Retry_Cancel" : 5};

Dialog.Result = {1 : "OK", 2 : "Cancel", 3 : "Abort", 4 : "Retry", 5 : "Ignore", 6 : "Yes", 7 : "No", "OK" : 1, "Cancel" : 2, "Abort" : 3, "Retry" : 4, "Ignore" : 5, "Yes" : 6, "No" : 7}; // enumerations for return values (e.g. Dialog.Show(...) = Dialog.Result.Yes) - works both ways

Dialog.Show = function(Title, Message, Icon, Buttons, Window) // icon/button parameters can be either way round (share a variable in interop call)
{
	return Interop.Call("user32", "MessageBoxW", (Window === null || Window === undefined ? WndSubclass.Handle : Window.Handle), Message, (Title === "" || Title === undefined ? NAME : NAME + " | " + Title), Icon | Buttons);
}
