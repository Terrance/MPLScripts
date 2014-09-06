var XML = new ActiveXObject("Microsoft.XMLDOM");
var FSO = new ActiveXObject("Scripting.FileSystemObject");

var FirstRun = false;
var DoOthersLater = false;
var NoNotify = true;
var NowLoading = 0;

var WndDownloading = null;

function OnEvent_Initialize(MessengerStart)
{
	if (Messenger.MyStatus > 1)
	{
		OnEvent_SigninReady(Messenger.MyEmail);
	}
}

function OnEvent_SigninReady(Email)
{
	if (Registry.Exists(NAME + "\\Options\\ChkStartupUpdates"))
	{
		var Updates = Registry.Read(NAME + "\\Options\\ChkStartupUpdates");
		var Others = Registry.Read(NAME + "\\Options\\ChkStartupOthers");
		if (Updates && Others)
		{
			DoOthersLater = true;
			NowLoading = 1;
			DownloadList(NowLoading);
		}
		else if (Updates || Others)
		{
			NowLoading = Updates ? 1 : 2;
			DownloadList(NowLoading);
		}
		else
		{
			NoNotify = false;
		}
		if (Registry.Read(NAME + "\\Options\\ChkMinsUpdates"))
		{
			MsgPlus.AddTimer("ChkMinsUpdates", 1800000);
		}
		if (Registry.Read(NAME + "\\Options\\ChkMinsOthers"))
		{
			MsgPlus.AddTimer("ChkMinsOthers", 1800001);
		}
	}
	else
	{
		FirstRun = true;
		Debug.Trace("| First run.");
		Registry.Write(NAME + "\\Options\\ChkStartupUpdates", 1, "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkStartupOthers", 0, "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkMinsUpdates", 0, "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkMinsOthers", 0, "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkProgressList", 1, "REG_DWORD");
		Registry.Write(NAME + "\\Options\\ChkProgressScripts", 1, "REG_DWORD");
		OnEvent_MenuClicked("Options");
	}
}

function OnEvent_Uninitialize(MessengerExit)
{
	if (FSO.FileExists(MsgPlus.ScriptFilesPath + "\\List.xml"))
	{
		FSO.DeleteFile(MsgPlus.ScriptFilesPath + "\\List.xml");
	}
	if (FSO.FolderExists(MsgPlus.ScriptFilesPath + "\\Installers"))
	{
		FSO.DeleteFolder(MsgPlus.ScriptFilesPath + "\\Installers");
	}
}
