function DownloadList(Type)
{
	Debug.Trace("| Downloading XML list (" + Type + ")...");
	MsgPlus.DownloadFile("http://www.ww-c.netii.net/mpls/api/", MsgPlus.ScriptFilesPath + "\\List.xml");
	try
	{
		WndDownloading.Close(0);
	}
	catch (error)
	{
	}
	if (Registry.Read(NAME + "\\Options\\ChkProgressList"))
	{
		WndDownloading = MsgPlus.CreateWnd("Windows.xml", "WndDownloading", 0);
		WndDownloading.SetControlText("TxtMain", "Downloading script updates list.\nPlease wait a moment...");
	}
}
