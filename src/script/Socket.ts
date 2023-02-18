/// <reference path="./Settings.ts" />
/// <reference path="../../declaration/socket.io.d.ts" />

interface Donation {
	username: string;
	message: string;
	currency: string;
	amount: number;
}

class Socket {
	constructor(private readonly settings: Settings) { }
	private socket: SocketIO.Server | null = null;

	public ondonation: (don: Donation) => void = () => { };

	public connect() {
		this.disconnect();

		if (!this.settings.token || !this.settings.socketHost)
			return;

		this.socket = io();
		this.socket.on('connect', (msg) => {
			console.log(`Сокет подключился к ${this.settings.socketHost}`);
			this.socket.emit('add-user', { token: this.settings.token, type: 'alert_widget' });
		})
		this.ondonation
		this.socket.on('donation', (msg: string) => {
			const don: Donation = JSON.parse(msg);

			console.log(`Получен донат`, don);
			this.ondonation(don);
		});
	}

	public disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}
}
