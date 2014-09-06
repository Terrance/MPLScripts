function OnEvent_MyNameChange(NewName)
{
	if (NewName !== Store.Name.Old && NewName !== (Store.Name.To === "" ? "‮‮" : Store.Name.To))
	{
		Blink.Name = false;
		Store.Name.Old = "";
	}
}

function OnEvent_MyPsmChange(NewPsm)
{
	if (NewPsm !== Store.PSM.Old && NewPsm !== Store.PSM.To)
	{
		Blink.PSM = false;
		Store.PSM.Old = "";
	}
}

function OnEvent_MyStatusChange(NewStatus)
{
	if (NewStatus !== Store.Status.Old && NewStatus !== Store.Status.To)
	{
		Blink.Status = false;
		Store.Status.Old = 2;
	}
}
