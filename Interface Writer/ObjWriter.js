/*
File: ObjWriter.js
Core functions for adding/editing/deleting windows, controls and elements.
*/

var Writer = {};

Writer.WndId = []; // list of windows
Writer.WndSel = [-1, -1]; // window grid selection (...sel[0] = highlighted, ...sel[1] = performing action to), -1 = no selection
Writer.PrsSel = -1; // preset window grid selection
Writer.CtrlId = []; // list of controls
Writer.CtrlSel = [-1, -1]; // control grid selection
Writer.ElmtId = []; // list of elements
Writer.ElmtSel = [-1, -1]; // element grid selection
Writer.Extra = ""; // temp extra storage

Writer.AddWnd = function(WndId, Icon, Title, Template, BottomBar, Width, Height, InitialPos, Resizeable, IsAbsolute, Minimize, Maximize, Close, Extra)
{
	if (Interface.Window[WndId] === undefined) // not overwriting, are we?
	{
		Interface.Window[WndId] = {}; // written in full for easy comprehension :)
		Interface.Window[WndId].Icon = Icon;
		Interface.Window[WndId].Title = Title;
		Interface.Window[WndId].Template = Template;
		Interface.Window[WndId].BottomBar = BottomBar;
		Interface.Window[WndId].Width = Width;
		Interface.Window[WndId].Height = Height;
		Interface.Window[WndId].InitialPos = InitialPos;
		Interface.Window[WndId].Resizeable = Resizeable;
		Interface.Window[WndId].IsAbsolute = IsAbsolute;
		Interface.Window[WndId].Minimize = Minimize;
		Interface.Window[WndId].Maximize = Maximize;
		Interface.Window[WndId].Close = Close;
		Interface.Window[WndId].Extra = Extra;
		Interface.Window[WndId].Control = {};
		Interface.Window[WndId].Element = {};
		return true;
	}
	else // oops!
	{
		return false;
	}
}
Writer.EditWnd = function(WndId, Icon, Title, Template, BottomBar, Width, Height, InitialPos, Resizeable, IsAbsolute, Minimize, Maximize, Close, Extra, NewWndId)
{
	Interface.Window[WndId].Icon = Icon;
	Interface.Window[WndId].Title = Title;
	Interface.Window[WndId].Template = Template;
	Interface.Window[WndId].BottomBar = BottomBar;
	Interface.Window[WndId].Width = Width;
	Interface.Window[WndId].Height = Height;
	Interface.Window[WndId].InitialPos = InitialPos;
	Interface.Window[WndId].Resizeable = Resizeable;
	Interface.Window[WndId].IsAbsolute = IsAbsolute;
	Interface.Window[WndId].Minimize = Minimize;
	Interface.Window[WndId].Maximize = Maximize;
	Interface.Window[WndId].Close = Close;
	Interface.Window[WndId].Extra = Extra;
	if (NewWndId !== undefined) // change of window id?
	{
		Interface.Window[NewWndId] = Interface.Window[WndId];
		delete Interface.Window[WndId];
		WndId = NewWndId;
	}
	return Interface.Window[WndId] !== undefined;
}
Writer.DeleteWnd = function(WndId)
{
	delete Interface.Window[WndId];
	return Interface.Window[WndId] === undefined;
}

Writer.AddCtrl = function(WndId, CtrlId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Caption, Help, Location, Comment, Enabled, Visible, Extra)
{
	if (Interface.Window[WndId].Control[CtrlId] === undefined) // not overwriting, are we?
	{
		Interface.Window[WndId].Control[CtrlId] = {};
		Interface.Window[WndId].Control[CtrlId].Type = Type;
		Interface.Window[WndId].Control[CtrlId].Left = Left;
		Interface.Window[WndId].Control[CtrlId].Top = Top;
		Interface.Window[WndId].Control[CtrlId].Width = Width;
		Interface.Window[WndId].Control[CtrlId].Height = Height;
		Interface.Window[WndId].Control[CtrlId].AnchorH = AnchorH;
		Interface.Window[WndId].Control[CtrlId].AnchorV = AnchorV;
		Interface.Window[WndId].Control[CtrlId].Caption = Caption;
		Interface.Window[WndId].Control[CtrlId].Help = Help;
		Interface.Window[WndId].Control[CtrlId].Location = Location;
		Interface.Window[WndId].Control[CtrlId].Comment = Comment;
		Interface.Window[WndId].Control[CtrlId].Extra = Extra;
		Interface.Window[WndId].Control[CtrlId].Enabled = Enabled;
		Interface.Window[WndId].Control[CtrlId].Visible = Visible;
		return true;
	}
	else // oops
	{
		return false;
	}
}
Writer.EditCtrl = function(WndId, CtrlId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Caption, Help, Location, Comment, Enabled, Visible, Extra, NewCtrlId)
{
	Interface.Window[WndId].Control[CtrlId] = {};
	Interface.Window[WndId].Control[CtrlId].Type = Type;
	Interface.Window[WndId].Control[CtrlId].Left = Left;
	Interface.Window[WndId].Control[CtrlId].Top = Top;
	Interface.Window[WndId].Control[CtrlId].Width = Width;
	Interface.Window[WndId].Control[CtrlId].Height = Height;
	Interface.Window[WndId].Control[CtrlId].AnchorH = AnchorH;
	Interface.Window[WndId].Control[CtrlId].AnchorV = AnchorV;
	Interface.Window[WndId].Control[CtrlId].Caption = Caption;
	Interface.Window[WndId].Control[CtrlId].Help = Help;
	Interface.Window[WndId].Control[CtrlId].Location = Location;
	Interface.Window[WndId].Control[CtrlId].Comment = Comment;
	Interface.Window[WndId].Control[CtrlId].Enabled = Enabled;
	Interface.Window[WndId].Control[CtrlId].Visible = Visible;
	Interface.Window[WndId].Control[CtrlId].Extra = Extra;
	if (NewCtrlId !== undefined) // change of control id?
	{
		Interface.Window[WndId].Control[NewCtrlId] = Interface.Window[WndId].Control[CtrlId];
		delete Interface.Window[WndId].Control[CtrlId];
		CtrlId = NewCtrlId;
	}
	return Interface.Window[WndId].Control[CtrlId] !== undefined;
}
Writer.DeleteCtrl = function(WndId, CtrlId)
{
	delete Interface.Window[WndId].Control[CtrlId];
	return Interface.Window[WndId].Control[CtrlId] === undefined;
}

Writer.AddElmt = function(WndId, ElmtId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Comment, Extra)
{
	if (Interface.Window[WndId].Element[ElmtId] === undefined) // not overwriting, are we?
	{
		Interface.Window[WndId].Element[ElmtId] = {};
		Interface.Window[WndId].Element[ElmtId].Type = Type;
		Interface.Window[WndId].Element[ElmtId].Left = Left;
		Interface.Window[WndId].Element[ElmtId].Top = Top;
		Interface.Window[WndId].Element[ElmtId].Width = Width;
		Interface.Window[WndId].Element[ElmtId].Height = Height;
		Interface.Window[WndId].Element[ElmtId].AnchorH = AnchorH;
		Interface.Window[WndId].Element[ElmtId].AnchorV = AnchorV;
		Interface.Window[WndId].Element[ElmtId].Comment = Comment;
		Interface.Window[WndId].Element[ElmtId].Extra = Extra;
		return true;
	}
	else // oops!
	{
		return false;
	}
}
Writer.EditElmt = function(WndId, ElmtId, Type, Left, Top, Width, Height, AnchorH, AnchorV, Comment, Extra, NewElmtId)
{
	Interface.Window[WndId].Element[ElmtId] = {};
	Interface.Window[WndId].Element[ElmtId].Type = Type;
	Interface.Window[WndId].Element[ElmtId].Left = Left;
	Interface.Window[WndId].Element[ElmtId].Top = Top;
	Interface.Window[WndId].Element[ElmtId].Width = Width;
	Interface.Window[WndId].Element[ElmtId].Height = Height;
	Interface.Window[WndId].Element[ElmtId].AnchorH = AnchorH;
	Interface.Window[WndId].Element[ElmtId].AnchorV = AnchorV;
	Interface.Window[WndId].Element[ElmtId].Comment = Comment;
	Interface.Window[WndId].Element[ElmtId].Extra = Extra;
	if (NewElmtId !== undefined) // change of element id?
	{
		Interface.Window[WndId].Element[NewElmtId] = Interface.Window[WndId].Element[ElmtId];
		delete Interface.Window[WndId].Element[ElmtId];
		ElmtId = NewElmtId;
	}
	return Interface.Window[WndId].Element[ElmtId] !== undefined;
}
Writer.DeleteElmt = function(WndId, ElmtId)
{
	delete Interface.Window[WndId].Element[ElmtId];
	return Interface.Window[WndId].Element[ElmtId] === undefined;
}
