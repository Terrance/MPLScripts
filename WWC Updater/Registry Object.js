var Registry = new Object();
Registry.Path = "HKCU\\Software\\Patchou\\Messenger Plus! Live\\GlobalSettings\\Scripts\\";

Registry.Exists = function(Path)
{
	try
	{
		SHELL.RegRead(Registry.Path + Path);
		return true;
	}
	catch (error)
	{
		return false;
	}
}

Registry.Read = function(Path)
{
	if (Registry.Exists(Path))
	{
		return SHELL.RegRead(Registry.Path + Path);
	}
	else
	{
		return null;
	}
}

Registry.Write = function(Path, Value, Type)
{
	if (Type === undefined)
	{
		Type = "REG_SZ";
	}
	SHELL.RegWrite(Registry.Path + Path, Value, Type);
	return Registry.Exists(Path);
}

Registry.Delete = function(Path)
{
	if (Registry.Exists(Path))
	{
		SHELL.RegDelete(Registry.Path + Path);
	}
	return !Registry.Exists(Path);
}
