/*
File: VarGlobals.js
All global variables: objects, conditions, windows, file paths, enumerations and so on.
*/

var FSO = new ActiveXObject("Scripting.FileSystemObject"); // read/write files
var XMLO = new ActiveXObject("Microsoft.XMLDOM"); // process XML files
var SAP = new ActiveXObject("Shell.Application"); // run apps/files

var IconFile = Interop.Call("user32", "LoadImageW", Interop.Call("kernel32", "GetCurrentProcess"), MsgPlus.ScriptFilesPath + "\\Images\\icon-logo.ico", 1, 0, 0, 48);

var FilePath = "";
var FileLoadImport = false; // are we importing on error?

var ScriptDir = SHELL.RegRead("HKEY_LOCAL_MACHINE\\Software\\Patchou\\Messenger Plus! Live\\ScriptsDir");
var BackupFile = MsgPlus.ScriptFilesPath + "\\Backup.tmp";
var TempFile = MsgPlus.ScriptFilesPath + "\\Temp.xml";
var PresetFile = MsgPlus.ScriptFilesPath + "\\Presets.xml";

var NowEditing = 0; // 0 = none, 1 = editor, 2 = viewer
var HelpGuide = false; // help mode?

var Close = {"Wnd" : 1, "Ctrl" : 2, "Elmt" : 3}; // for easier use of CloseWnd()

var EnumWindowTemplate = ["DialogTmpl", "WindowTmpl", "ChildTmpl"];
var EnumWindowBottomBar = ["None", "Plain", "Light", "Default"];

var EnumWindowInitialPos = ["Normal", "CenteredParent", "CenteredScreen", "Minimised", "Maximised", "Random"];

var EnumControlType = ["", "BrowserControl", "ButtonControl", "CheckBoxControl", "CodeEditControl", "ComboBoxControl", "DateTimeControl", "EditControl", "HotKeyControl", "LinkControl", "ListBoxControl", "ListViewControl", "MenuButtonControl", "ProgressControl", "RadioControl", "RichEditControl", "RichStaticControl", "ScrollBarControl", "SliderControl", "SpinControl", "StaticControl", "TreeViewControl"];
var EnumElementType = ["", "ArrowElement", "FigureElement", "ImageElement", "LineElement", "PlaceHolderElement"];

var EnumControlLocation = ["Use Positioning", "Bottom Bar (left)", "Bottom Bar (right)"];

var EnumControlElementAnchorH = ["LeftFixed", "RightFixed", "LeftRightFixed"];
var EnumControlElementAnchorV = ["TopFixed", "BottomFixed", "TopBottomFixed"];

var EnumOptionsDouble = ["Edit Window", "Preview Window", "Control Manager", "Element Manager"]; // double-click options

var Interface = {};
Interface.Window = [];
var Clipboard = {};

var WndAbout; // idea - window array?

var WndOptionsDebug;
var WndOptionsFormat;
var WndOptionsGeneral;
var WndOptionsMenu;
var WndOptionsSaving;

var WndViewerErrors;
var WndViewerManager;
var WndViewerPreview;

var WndWriterAddControl;
var WndWriterAddElement;
var WndWriterAddWindow;
var WndWriterBuildWindowI;
var WndWriterBuildWindowM;
var WndWriterCreateInterface;
var WndWriterEditControl;
var WndWriterEditElement;
var WndWriterEditMultiControls;
var WndWriterEditMultiElements;
var WndWriterEditMultiWindows;
var WndWriterEditWindow;
var WndWriterErrors;
var WndWriterEval;
var WndWriterExtraCode;
var WndWriterLoadInterface;
var WndWriterManageControls;
var WndWriterManageElements;
var WndWriterManageWindows;
var WndWriterPresetWindows;
var WndWriterPreviewWindow;
var WndWriterSelectControls;
var WndWriterSelectElements;
var WndWriterSelectWindows;
var WndWriterSourceCode;

var WndSubclass = OpenWnd("Other", "", "Subclass", 2); // start subclass now
