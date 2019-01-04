const clim = require("../lib/tcpServer.js");
clim.init(callback);

function callback() {
	clim.setOn24Hot();
	//clim.setOff();
}

