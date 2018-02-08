const clim = require("./lib/tcpServer.js");

module.exports = function(sails) {

	gladys.on("ready", function(){
		clim.init();
	});

	return {
		exec: function(params) {
			if(params.state.value) {
				console.log("switch clim on");
				clim.setOn24Hot();
			} else {
				console.log("switch clim off");
				clim.setOff();
			}
		}

	};
}
