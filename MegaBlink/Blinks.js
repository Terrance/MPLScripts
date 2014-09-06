function OnEvent_Timer(TimerId)
{
	Debug.Trace("Function called: OnEvent_Timer");
	Debug.Trace("| Current time: " + Blink.Time + "ms");
	Blink.IsNow = !Blink.IsNow;
	Debug.Trace("| Is a blink now: " + Blink.IsNow);
	Debug.Trace("| Blink name: " + Blink.Name);
	if (Blink.Name)
	{
		Messenger.MyName = (Blink.IsNow ? (Store.Name.To === "" ? "‮‮" : Store.Name.To) : Store.Name.Old);
	}
	Debug.Trace("| Blink PSM: " + Blink.PSM);
	if (Blink.PSM)
	{
		Messenger.MyPersonalMessage = (Blink.IsNow ? Store.PSM.To : Store.PSM.Old);
	}
	Debug.Trace("| Blink DP: " + Blink.DP);
	if (Blink.DP)
	{
		Messenger.MyDisplayPicture = (Blink.IsNow ? Store.DP.To : Store.DP.Old);
	}
	Debug.Trace("| Blink status: " + Blink.Status);
	if (Blink.Status)
	{
		Messenger.MyStatus = (Blink.IsNow ? Store.Status.To : Store.Status.Old);
	}
	MsgPlus.AddTimer("Refresh", Blink.Time);
}

function OnEvent_Initialize(MessengerStart)
{
	OnEvent_Timer();
}
