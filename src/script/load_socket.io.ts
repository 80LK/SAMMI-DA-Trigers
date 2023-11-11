async function load_socketio() {
	var io_sammi = io;
	const response = await fetch("https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.5.0/socket.io.js");
	const script = await response.text();
	eval(script);
	const loaded_io = io;
	//@ts-ignore
	io = io_sammi;
	return loaded_io
}
