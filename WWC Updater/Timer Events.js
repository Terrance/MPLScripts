function OnEvent_Timer(TimerId)
{
	switch (true)
	{
		case (TimerId === "ChkMinsUpdates" && NowLoading === 0):
			NoNotify = true;
			NowLoading = 1;
			DownloadList(NowLoading);
			break;
		case (TimerId === "ChkMinsOthers" && NowLoading === 0):
			NoNotify = true;
			NowLoading = 2;
			DownloadList(NowLoading);
			break;
		case (TimerId === "ChkMinsOthers" && NowLoading === 1):
			NoNotify = true;
			DoOthersLater = true;
			break;
	}
	MsgPlus.AddTimer(TimerId, 1800000);
}
