/*
File: ActiveX.js
Storage of ActiveXControls under a single object.
*/

var ActiveX =
{
	"FSO" : new ActiveXObject("Scripting.FileSystemObject"), // file system
	"WSS" : new ActiveXObject("WScript.Shell"), // registry
	"XML" : new ActiveXObject("Microsoft.XMLDom") // XML processing
};
