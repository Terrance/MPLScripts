var Blink = new Object();
Blink.Name = false;
Blink.PSM = false;
Blink.DP = false;
Blink.Status = false;
Blink.Time = 6000;
Blink.IsNow = false;

var Store = new Object();
Store.Name = new Object();
Store.Name.Old = "";
Store.Name.To = "";
Store.PSM = new Object();
Store.PSM.Old = "";
Store.PSM.To = "";
Store.DP = new Object();
Store.DP.Old = "";
Store.DP.To = "";
Store.Status = new Object();
Store.Status.Old = 0;
Store.Status.To = 2;