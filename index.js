const clim = require("./lib/tcpServer.js");

module.exports = function(sails) {
	return {
		install: function() {
	var clim = {
		device: {
			name: "clim_salon",
			protocol: 'wifi',
			service: 'airton',
			identifier: 1

		},
		types: [
			{
				type: 'power',
				sensor: false,
				tag: "clim_salon",
				category: 'switch',
				min: 0,
				max: 1

			}

		]

	};
	return gladys.device.create(device)


		},
		exec: function(params) {
			switch(params) {
				case "on":
					clim.setOn24Hot();
					break;
				case "off":
					clim.setOff();
			}
		},
		setup: function() {
			console.log(gladys.device.create());
		}

	};
}
