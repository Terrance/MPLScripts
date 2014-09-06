Debug.Trace("-> Creating variables...");
var QK_MNUOPN = false; // open menu detector
var QK_MGRVLDR = false; // already validating hotkeys
var QK_MGROPN = false; // manager already open
var WND_SBC = null; // subclass window
var WND_HTK = null; // hotkey manager window
var WM_HOTKEY = 0x312; // hotkey code
var MOD_ALT = 0x1; // "Alt" key down
var MOD_CTRL = 0x2; // "Ctrl" key down
var MOD_SHIFT = 0x4; // "Shift" key down
var MOD_WIN = 0x8; // "Win" key down
var MF_CHECKED = 0x8; // checked menu option
var MF_APPEND = 0x100; // append menu item
var MF_GRAYED = 0x1; // disabled menu option
var MF_SEPARATOR = 0x800; // menu separator
var MF_STRING = 0x0; // text menu option
var MF_POPUP = 0x10; // sub-menu option
var TPM_LEFTALIGN = 0x1; // align text left
var TPM_RETURNCMD = 0x0100; // returns cmd value
var TPM_VERNEGANIMATION = 0x2000; // menu animations
var GMEM_MOVEABLE = 0x2; // clipboard item movement
var GMEM_SHARE = 0x2000; // clipboard sharing
var GMEM_ZEROINIT = 0x40; // clipboard zero in it
var HTK_CHATS = 0x43; // "Messenger Conversations" hotkey (C, 67)
var HTK_INFO = 0x49; // "Messenger Information" hotkey (I, 73)
var HTK_LSTCNTS = 0x4C; // "Messenger Contact List" hotkey (L, 76)
var HTK_MANAGER = 0x4D; // "QuickKey Hotkey Manager" hotkey (M, 77)
var HTK_OPTIONS = 0x51; // "QuickKey Options" hotkey (Q, 81)
var HTK_STATUS = 0x53; // "Messenger Status" hotkey (S, 83)
var HTK_ALT = true; // use the "Alt" key in hotkey combinations
var HTK_CTRL = true; // use the "Ctrl" key in hotkey combinations
var HTK_SHIFT = false; // use the "Shift" key in hotkey combinations
var HTK_WIN = false; // use the "Win" key in hotkey combinations
var MNU_CHATS = 1; // "Messenger Conversations" ID
var MNU_INFO = 2; // "Messenger Information" ID
var MNU_LSTCNTS = 3; // "Messenger Contact List" ID
var MNU_MANAGER = 4; // "QuickKey Hotkey Manager" ID
var MNU_OPTIONS = 5; // "QuickKey Options" ID
var MNU_STATUS = 6; // "Messenger Status" ID
var SET_CHATS1 = true; // "Messenger Conversations" setting 1 ("Show offline contacts")
var SET_INFO1 = true; // "Messenger Information" setting 1 ("Show contact information")
var SET_LSTCNTS1 = true; // "Messenger Contact List" setting 1 ("Show offline contacts")
var SET_LSTCNTS2 = true; // "Messenger Contact List" setting 2 ("Show blocked contacts")
var SET_LSTCNTS3 = true; // "Messenger Contact List" setting 3 ("Use advanced contact menu")
var SET_LSTCNTS4 = true; // "Messenger Contact List" setting 4 ("Show contact details")
var SET_STATUS1 = true; // "Messenger Status" setting 1 ("Show sign-out option")
var SET_GLOBAL1 = true; // "Global Options" setting 1 ("Disable menus on lock")
var SET_GLOBAL2 = true; // "Global Options" setting 2 ("Show names, not emails")

Debug.Trace("-> Creating arrays...");
var AR_STATNM = new Array("Unknown", "Offline", "Appear Offline", "Online", "Busy", "Be Right Back", "Idle", "Away", "In a Call", "Out to Lunch"); // status names
var AR_LTR = new Array(); // empty letter array
var Letters = "0123456789       ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // letter/number string (space skips undefined virtual keys)
Letters = Letters.split(""); // convert string into array
var Count = 0x30; // start number (equivalent of 0)
for (var Letter in Letters) // for each letter
{
	AR_LTR[Count] = Letters[Letter].toString(); // put it under the right number
	AR_LTR[Letters[Letter]] = Count; // allow reverse letter lookup
	Count++; // increase the count
}

function OnEvent_Initialize(MessengerStart)
{
	if (Messenger.MyStatus > 1) // if the user is signed in already
	{
		Debug.Trace("Function called: OnEvent_SigninReady");
		OnEvent_SigninReady(Messenger.MyEmail); // continue
	}
}

function OnEvent_SigninReady(Email)
{
	WriteRegistry(null, "Conversations\\1", SET_CHATS1); // write default value for "Messenger Conversations" setting 1
	WriteRegistry(null, "Information\\1", SET_INFO1); // write default value for "Messenger Information" setting 1
	WriteRegistry(null, "Contact List\\1", SET_LSTCNTS1); // write default value for "Messenger Contact List" setting 1
	WriteRegistry(null, "Contact List\\2", SET_LSTCNTS2); // write default value for "Messenger Contact List" setting 2
	WriteRegistry(null, "Contact List\\3", SET_LSTCNTS3); // write default value for "Messenger Contact List" setting 3
	WriteRegistry(null, "Contact List\\4", SET_LSTCNTS4); // write default value for "Messenger Contact List" setting 4
	WriteRegistry(null, "Status\\1", SET_STATUS1); // write default value for "Messenger Status" setting 1
	WriteRegistry(null, "Global\\1", SET_GLOBAL1); // write default value for "Global Options" setting 1
	WriteRegistry(null, "Global\\2", SET_GLOBAL2); // write default value for "Global Options" setting 2
	WriteRegistry(null, "Hotkeys\\Conversations", HTK_CHATS); // write default value for "Messenger Conversations" hotkey
	WriteRegistry(null, "Hotkeys\\Information", HTK_INFO); // write default value for "Messenger Information" hotkey
	WriteRegistry(null, "Hotkeys\\Contact List", HTK_LSTCNTS); // write default value for "Messenger Contact List" hotkey
	WriteRegistry(null, "Hotkeys\\Hotkey Manager", HTK_MANAGER); // write default value for "QuickKey Hotkey Manager" hotkey
	WriteRegistry(null, "Hotkeys\\Options", HTK_OPTIONS); // write default value for "QuickKey Options" hotkey
	WriteRegistry(null, "Hotkeys\\Status", HTK_STATUS); // write default value for "Messenger Status" hotkey
	WriteRegistry(null, "Hotkeys\\Alt", HTK_ALT, false); // write default value for "Alt" key modifier
	WriteRegistry(null, "Hotkeys\\Ctrl", HTK_CTRL, false); // write default value for "Ctrl" key modifier
	WriteRegistry(null, "Hotkeys\\Shift", HTK_SHIFT, false); // write default value for "Shift" key modifier
	WriteRegistry(null, "Hotkeys\\Win", HTK_WIN, false); // write default value for "Win" key modifier
	
	if (ExistsRegistry(null, "Subclass")) // check if the subclass handle exists
	{
		Debug.Trace("-> Unregistering old hotkeys...");
		var Subclass = parseInt(ReadRegistry(null, "Subclass")); // get subclass handle, if it exists
		Interop.Call("user32", "UnregisterHotKey", Subclass, MNU_CHATS); // "Messenger Conversations" hotkey
		Interop.Call("user32", "UnregisterHotKey", Subclass, MNU_INFO); // "Messenger Information" hotkey
		Interop.Call("user32", "UnregisterHotKey", Subclass, MNU_LSTCNTS); // "Messenger Contact List" hotkey
		Interop.Call("user32", "UnregisterHotKey", Subclass, MNU_MANAGER); // "QuickKey Hotkey Manager" hotkey
		Interop.Call("user32", "UnregisterHotKey", Subclass, MNU_OPTIONS); // "QuickKey Options" hotkey
		Interop.Call("user32", "UnregisterHotKey", Subclass, MNU_STATUS); // "Messenger Status" hotkey
	}
	
	Debug.Trace("-> Loading user preferences...");
	SET_CHATS1 = Boolean(parseInt(ReadRegistry(null, "Conversations\\1"))); // get "Messenger Conversations" setting 1
	SET_INFO1 = Boolean(parseInt(ReadRegistry(null, "Information\\1"))); // get "Messenger Information" setting 1
	SET_LSTCNTS1 = Boolean(parseInt(ReadRegistry(null, "Contact List\\1"))); // get "Messenger Contact List" setting 1
	SET_LSTCNTS2 = Boolean(parseInt(ReadRegistry(null, "Contact List\\2"))); // get "Messenger Contact List" setting 2
	SET_LSTCNTS3 = Boolean(parseInt(ReadRegistry(null, "Contact List\\3"))); // get "Messenger Contact List" setting 3
	SET_LSTCNTS4 = Boolean(parseInt(ReadRegistry(null, "Contact List\\4"))); // get "Messenger Contact List" setting 4
	SET_STATUS1 = Boolean(parseInt(ReadRegistry(null, "Status\\1"))); // get "Messenger Status" setting 1
	SET_GLOBAL1 = Boolean(parseInt(ReadRegistry(null, "Global\\1"))); // get "Global Options" setting 1
	SET_GLOBAL2 = Boolean(parseInt(ReadRegistry(null, "Global\\2"))); // get "Global Options" setting 2
	HTK_CHATS = parseInt(ReadRegistry(null, "Hotkeys\\Conversations")); // get "Messenger Conversations" hotkey setting
	HTK_INFO = parseInt(ReadRegistry(null, "Hotkeys\\Information")); // get "Messenger Information" hotkey setting
	HTK_LSTCNTS = parseInt(ReadRegistry(null, "Hotkeys\\Contact List")); // get "Messenger Contact List" hotkey setting
	HTK_MANAGER = parseInt(ReadRegistry(null, "Hotkeys\\Hotkey Manager")); // get "QuickKey Hotkey Manager" hotkey setting
	HTK_OPTIONS = parseInt(ReadRegistry(null, "Hotkeys\\Options")); // get "QuickKey Options" hotkey setting
	HTK_STATUS = parseInt(ReadRegistry(null, "Hotkeys\\Status")); // get "Messenger Status" hotkey setting
	HTK_ALT = Boolean(parseInt(ReadRegistry(null, "Hotkeys\\Alt"))); // get "Alt" hotkey combination modifier setting
	HTK_CTRL = Boolean(parseInt(ReadRegistry(null, "Hotkeys\\Ctrl"))); // get "Ctrl" hotkey combination modifier setting
	HTK_SHIFT = Boolean(parseInt(ReadRegistry(null, "Hotkeys\\Shift"))); // get "Shift" hotkey combination modifier setting
	HTK_WIN = Boolean(parseInt(ReadRegistry(null, "Hotkeys\\Win"))); // get "Win" hotkey combination modifier setting
	
	Debug.Trace("-> Creating subclass window...");
	WND_SBC = MsgPlus.CreateWnd("Windows.xml", "WndSubclass", 2); // window handle to pass the menu object
	WriteRegistry(null, "Subclass", WND_SBC.Handle); // set the subclass window's handle in the registry
	
	Debug.Trace("-> Registering message notification...");
	WND_SBC.RegisterMessageNotification(WM_HOTKEY, true); // hotkey detector notification
	
	Debug.Trace("-> Registering hotkeys...");
	var TMP_MODS = (HTK_ALT ? MOD_ALT : 0) + (HTK_CTRL ? MOD_CTRL : 0) + (HTK_SHIFT ? MOD_SHIFT : 0) + (HTK_WIN ? MOD_WIN : 0); // calculate modifiers
	Interop.Call("user32", "RegisterHotKey", WND_SBC.Handle, MNU_CHATS, TMP_MODS, HTK_CHATS); // "Messenger Conversations" hotkey
	Interop.Call("user32", "RegisterHotKey", WND_SBC.Handle, MNU_INFO, TMP_MODS, HTK_INFO); // "Messenger Information" hotkey
	Interop.Call("user32", "RegisterHotKey", WND_SBC.Handle, MNU_LSTCNTS, TMP_MODS, HTK_LSTCNTS); // "Messenger Contact List" hotkey
	Interop.Call("user32", "RegisterHotKey", WND_SBC.Handle, MNU_MANAGER, TMP_MODS, HTK_MANAGER); // "QuickKey Hotkey Manager" hotkey
	Interop.Call("user32", "RegisterHotKey", WND_SBC.Handle, MNU_OPTIONS, TMP_MODS, HTK_OPTIONS); // "QuickKey Options" hotkey
	Interop.Call("user32", "RegisterHotKey", WND_SBC.Handle, MNU_STATUS, TMP_MODS, HTK_STATUS); // "Messenger Status" hotkey
}

function OnEvent_Uninitialize(MessengerExit)
{
	if (Messenger.MyStatus > 1) // if the user is signed in already
	{
		Debug.Trace("Function called: OnEvent_Signout");
		OnEvent_Signout(Messenger.MyEmail); // continue
	}
}

function OnEvent_Signout(Email)
{
	Debug.Trace("-> Unregistering hotkeys...");
	Interop.Call("user32", "UnregisterHotKey", WND_SBC.Handle, MNU_CHATS); // "Messenger Conversations" hotkey
	Interop.Call("user32", "UnregisterHotKey", WND_SBC.Handle, MNU_INFO); // "Messenger Information" hotkey
	Interop.Call("user32", "UnregisterHotKey", WND_SBC.Handle, MNU_LSTCNTS); // "Messenger Contact List" hotkey
	Interop.Call("user32", "UnregisterHotKey", WND_SBC.Handle, MNU_MANAGER); // "QuickKey Hotkey Manager" hotkey
	Interop.Call("user32", "UnregisterHotKey", WND_SBC.Handle, MNU_OPTIONS); // "QuickKey Options" hotkey
	Interop.Call("user32", "UnregisterHotKey", WND_SBC.Handle, MNU_STATUS); // "Messenger Status" hotkey
	
	Debug.Trace("-> Destroying subclass window...");
	WND_SBC.Close(0); // close the menu object passing window
	WND_SBC = null; // reset the variable to default
	DeleteRegistry(null, "Subclass"); // remove the old subclass window's handle
	
	Debug.Trace("-> Saving user preferences...");
	WriteRegistry(null, "Conversations\\1", SET_CHATS1, true); // set "Messenger Conversations" setting 1
	WriteRegistry(null, "Information\\1", SET_INFO1, true); // set "Messenger Information" setting 1
	WriteRegistry(null, "Contact List\\1", SET_LSTCNTS1, true); // set "Messenger Contact List" setting 1
	WriteRegistry(null, "Contact List\\2", SET_LSTCNTS2, true); // set "Messenger Contact List" setting 2
	WriteRegistry(null, "Contact List\\3", SET_LSTCNTS3, true); // set "Messenger Contact List" setting 3
	WriteRegistry(null, "Contact List\\4", SET_LSTCNTS4, true); // set "Messenger Contact List" setting 4
	WriteRegistry(null, "Status\\1", SET_STATUS1, true); // set "Messenger Status" setting 1
	WriteRegistry(null, "Global\\1", SET_GLOBAL1, true); // set "Global Options" setting 1
	WriteRegistry(null, "Global\\2", SET_GLOBAL2, true); // set "Global Options" setting 2
	WriteRegistry(null, "Hotkeys\\Conversations", HTK_CHATS, 67); // set "Messenger Conversations" hotkey setting
	WriteRegistry(null, "Hotkeys\\Information", HTK_INFO, 73); // set "Messenger Information" hotkey setting
	WriteRegistry(null, "Hotkeys\\Contact List", HTK_LSTCNTS, 76); // set "Messenger Contact List" hotkey setting
	WriteRegistry(null, "Hotkeys\\Hotkey Manager", HTK_MANAGER, 81); // set "QuickKey Hotkey Manager" hotkey setting
	WriteRegistry(null, "Hotkeys\\Options", HTK_OPTIONS, 81); // set "QuickKey Options" hotkey setting
	WriteRegistry(null, "Hotkeys\\Status", HTK_STATUS, 83); // set "Messenger Status" hotkey setting
	WriteRegistry(null, "Hotkeys\\Alt", HTK_ALT, true); // set "Alt" hotkey combination modifier setting
	WriteRegistry(null, "Hotkeys\\Ctrl", HTK_CTRL, true); // set "Ctrl" hotkey combination modifier setting
	WriteRegistry(null, "Hotkeys\\Shift", HTK_SHIFT, true); // set "Shift" hotkey combination modifier setting
	WriteRegistry(null, "Hotkeys\\Win", HTK_WIN, true); // set "Win" hotkey combination modifier setting
}
