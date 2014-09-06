function Alert(Message, Title, Window)
{
	if (Title == "" || Title == undefined)
	{
		Title = "";
	}
	else
	{
		Title = " | " + Title;
	}
	try
	{
		Interop.Call("user32", "MessageBoxW", Window.Handle, Message, NAME + Title, 48);
	}
	catch (error)
	{
		Interop.Call("user32", "MessageBoxW", null, Message, NAME + Title, 48);
	}
}
 
function Confirm(Message, Title, Window)
{
	if (Title == "" || Title == undefined)
	{
		Title = "";
	}
	else
	{
		Title = " | " + Title;
	}
	try
	{
		return Interop.Call("user32", "MessageBoxW", Window.Handle, Message, NAME + Title, 4 | 32) === 6;
	}
	catch (error)
	{   
		return Interop.Call("user32", "MessageBoxW", null, Message, NAME + Title, 4 | 32) === 6;
	}
}

function Error(Message, Title, Window)
{
	if (Title == "" || Title == undefined)
	{
		Title = "";
	}
	else
	{
		Title = " | " + Title;
	}
	try
	{
		Interop.Call("user32", "MessageBoxW", Window.Handle, Message, NAME + Title, 16);
	}
	catch (error)
	{   
		Interop.Call("user32", "MessageBoxW", null, Message, NAME + Title, 16);
	}
}
