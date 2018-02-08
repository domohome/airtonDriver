const MESSAGE_IDENTIFY = Buffer.from([0x01]);
const MESSAGE_ECHO = Buffer.from([0x02]);
const MESSAGE_EMIT = Buffer.from([0x03]);
var buffer_freq = Buffer.alloc(4);
buffer_freq.writeInt32BE(38);
var net = require('net');
var on24hot = [2944, 1784, 416, 1132, 392, 1160, 412, 412, 388, 436, 392, 500, 348, 1140, 408, 420, 404, 428, 412, 1136, 388, 1160, 388, 436, 392, 1156, 416, 408, 420, 408, 416, 1132, 416, 1148, 416, 408, 416, 1132, 416, 1116, 412, 432, 392, 432, 416, 1128, 396, 432, 420, 448, 388, 1136, 392, 432, 392, 432, 416, 408, 420, 432, 368, 432, 416, 408, 420, 420, 416, 408, 392, 432, 420, 404, 420, 416, 412, 416, 376, 464, 392, 404, 420, 432, 408, 432, 392, 408, 392, 1152, 424, 404, 420, 404, 420, 1136, 412, 408, 420, 420, 416, 1136, 416, 404, 420, 476, 348, 404, 420, 404, 424, 404, 420, 404, 420, 420, 420, 1128, 420, 1128, 396, 1160, 412, 408, 420, 404, 416, 436, 392, 412, 388, 456, 384, 1160, 416, 412, 412, 1124, 424, 1124, 428, 1124, 420, 1128, 424, 404, 416, 424, 416, 416, 412, 404, 420, 404, 396, 448, 376, 440, 384, 432, 420, 404, 420, 424, 412, 408, 392, 432, 392, 504, 324, 432, 416, 412, 416, 476, 324, 444, 380, 456, 408, 420, 404, 416, 384, 432, 416, 408, 392, 432, 396, 428, 396, 432, 416, 424, 416, 408, 416, 408, 420, 408, 388, 436, 416, 408, 420, 404, 416, 408, 392, 448, 420, 404, 416, 1132, 420, 1128, 420, 1128, 396, 1156, 392, 1156, 416, 1132, 392, 440, 416];

var off = [2984, 1748, 428, 1116, 436, 1116, 432, 392, 432, 396, 428, 392, 432, 1120, 432, 392, 432, 408, 432, 1116, 432, 1116, 432, 396, 428, 1120, 432, 392, 432, 396, 428, 1116, 456, 1108, 456, 372, 432, 1116, 432, 1116, 432, 396, 452, 372, 452, 1092, 456, 372, 456, 388, 452, 1092, 456, 376, 448, 372, 452, 372, 456, 368, 456, 372, 452, 372, 452, 388, 452, 372, 456, 368, 456, 376, 448, 368, 456, 372, 456, 368, 456, 376, 448, 384, 456, 376, 448, 372, 452, 380, 448, 368, 456, 368, 456, 1092, 456, 372, 452, 388, 452, 1092, 456, 372, 456, 368, 456, 376, 448, 372, 452, 372, 456, 376, 448, 384, 456, 1092, 456, 1092, 456, 1092, 456, 380, 444, 372, 456, 372, 452, 376, 448, 396, 444, 1092, 460, 376, 448, 1092, 456, 1092, 456, 1092, 456, 1096, 452, 380, 448, 384, 456, 376, 448, 372, 452, 372, 452, 372, 456, 376, 448, 372, 452, 372, 452, 388, 452, 372, 452, 372, 452, 372, 456, 368, 456, 372, 452, 380, 444, 372, 452, 388, 456, 368, 456, 372, 452, 372, 452, 380, 444, 372, 452, 372, 452, 380, 444, 388, 452, 376, 452, 372, 452, 372, 452, 380, 444, 372, 452, 376, 452, 376, 448, 388, 452, 372, 452, 1096, 452, 372, 452, 1096, 452, 1096, 456, 1096, 452, 1096, 452, 380, 448];

function toBuffer(array) {
	var buffer = Buffer.alloc(4*array.length)
	array.map((value, index) => {
		return buffer.writeInt32BE(value,4*index);
	});
	return buffer;
}

function toBufferLength(b) {
	var buffer = Buffer.alloc(4);
	buffer.writeInt32BE(b.length);
	return buffer;
}

var sock = null;
function init(createDeviceCallback) {
	log("STARTING TCP SERVER");
	var server = net.createServer(function(socket) {
		log("new client connect");
		sock = socket;
		createDeviceCallback(getDeviceObject());
		socket.on("data", (data) => {
			log(data);
		});
	});

	server.listen(10240, () => {
		log("listening on port 10240");
	});


}
function sendCommand(command) {
	return new Promise((resolve, reject) => {
		let data = toBuffer(command);
		let length = toBufferLength(command);
		console.log(command.length);
		const b = Buffer.concat([MESSAGE_EMIT,buffer_freq, length, data], 10+data.length); 
		if(sock) {
		log("sending frame");
			console.log(b);
			sock.write(b, ()=> resolve("sended"));
			reject("not connected");

		}
	});
}

module.exports = {
	setOn24Hot: function() {
		return sendCommand(on24hot);
	},
	setOff: function() {
		return sendCommand(off);
	},
	init: init
}


function log(message) {
	console.log("AIRTON : "+message);
}

function getDeviceObject() {
	return {
		device: {
			name: "clim_salon",
			protocol: 'wifi',
			service: 'airton',
			identifier: 1

		},
		types: [
			{
				type: 'power',
				identifier: 1,
				sensor: false,
				tag: "clim_salon",
				category: 'switch',
				min: 0,
				max: 1

			}

		]

	};

}
