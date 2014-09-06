/*
File: Browse.js
Method of opening a Windows load/save dialog (credit to Matti for the original).
*/

function BrowseForFile(Title, Dir, Save, Ext, File, HWndP)
{
	Title = Title + " / " + NAME;
	var Filter = "DevTools Package (*.dtp)|*.dtp|Compressed (zipped) Folders (*.zip)|*.zip|All types of file (*.*)|*.*||";
	var OpenFileName = Interop.Allocate(88);
	with (OpenFileName)
	{
		WriteDWORD(0, Size);
		WriteDWORD(4, HWndP);
		WriteDWORD(8, 0);
		var SFilter = Interop.Allocate(2 * (Filter.length + 1));
		WriteMultiStringW(SFilter, Filter);
		WriteDWORD(12, SFilter.DataPtr);
		WriteDWORD(16, 0);
		WriteDWORD(20, 0);
		WriteDWORD(24, 1);
		if (typeof File !== "string")
		{
			File = "";
		}
		var SFile = Interop.Allocate(2 * (1024 + 1));
		SFile.WriteString(0, File);
		WriteDWORD(28, SFile.DataPtr);
		WriteDWORD(32, (SFile.Size / 2 - 1));
		WriteDWORD(36, 0);
		WriteDWORD(40, 0);
		if (typeof Dir === "string")
		{
			var SDir = Interop.Allocate(2 * (Dir.length + 1));
			SDir.WriteString(0, Dir);
			WriteDWORD(44, SDir.DataPtr);
		}
		if (typeof Title === "string")
		{
			var STitle = Interop.Allocate(2 * (Title.length + 1));
			STitle.WriteString(0, Title);
			WriteDWORD(48, STitle.DataPtr);
		}
		WriteDWORD(52, 8388608 | 524288 | 4 | 2097152 | 2048 | (Save ? 2 : 2048));
		WriteWORD(56, 0);
		WriteWORD(58, 0);
		if (typeof Ext === "string")
		{
			var SExt = Interop.Allocate(2 * (Ext.length + 1));
			SExt.WriteString(0, Ext);
			WriteDWORD(60, SExt.DataPtr);
		}
		else
		{
			WriteDWORD(60, 0);
		}
		WriteDWORD(64, 0);
		WriteDWORD(68, 0);
		WriteDWORD(72, 0);
		WriteDWORD(76, 0);
		WriteDWORD(80, 0);
		WriteDWORD(84, 0);
	}
	var Result = Interop.Call("comdlg32", (Save ? "GetSaveFileNameW" : "GetOpenFileNameW"), OpenFileName);
	var ToReturn = false;
	if (Result)
	{
		var PPath = SFile.ReadString(0);
		var PFiles = new Array();
		var PFile = "";
		var Pos = 2 * (PPath.length + 1);
		if (!Save)
		{
			while (true)
			{
				PFile = SFile.ReadString(Pos);
				if (PFile.length > 0)
				{
					PFiles.push(PFile);
					Pos += 2 * (PFile.length + 1);
				}
				else
				{
					break;
				}
			}
		}
		ToReturn = (PFiles.length > 0) ? new Array(PPath).concat(PFiles) : PPath;
	}
	OpenFileName.Size = 0;
	SFilter.Size = 0;
	SFile.Size = 0;
	SDir.Size = 0;
	return ToReturn;
	function WriteMultiStringW(DataBlock, String)
	{
		var Pos = 0;
		DataBlock.WriteString(0, String);
		Pos = String.indexOf("|", Pos);
		while (Pos !== -1)
		{
			DataBlock.WriteWORD(2 * Pos, 0);
			Pos = String.indexOf("|", Pos + 1);
		}
	}
}
