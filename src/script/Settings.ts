class Settings {
	constructor(private readonly storage: Storage) {
		this.read();
	}

	public token: string | null = null;
	public triggerName: string = "DonationAlerts Tip";
	public socketHost: string | null = null;

	public read() {
		this.token = this.storage.getItem('token');
		this.triggerName = this.storage.getItem('triggerName') || this.triggerName;
		this.socketHost = this.storage.getItem('socketHost') || this.storage.getItem('socketURL') || "socket1.donationalerts.ru:443";
	}

	public save() {
		if (this.token !== null) this.storage.setItem('token', this.token);
		if (this.socketHost !== null) this.storage.setItem('socketHost', this.socketHost);
		this.storage.setItem('triggerName', this.triggerName);
	}
}
