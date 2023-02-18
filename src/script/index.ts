/// <reference path="./Settings.ts" />
/// <reference path="./Socket.ts" />
/// <reference path="../../declaration/SAMMI.d.ts" />


function DonationAlertsTriggerInit() {
	const settings = new Settings(localStorage),
		socket = new Socket(settings),

		$inToken = <HTMLInputElement>document.getElementById('token'),
		$btnTokenVisible = <HTMLButtonElement>document.getElementById('toggle_visible_token'),
		$inTriggerName = <HTMLInputElement>document.getElementById('trigger_name'),
		$inSocketHost = <HTMLInputElement>document.getElementById('socket_host'),
		$btnSave = <HTMLButtonElement>document.getElementById('save_settings'),

		$inAmountTestTip = <HTMLInputElement>document.getElementById("amount_test_tip"),
		$btnSendTestTip = <HTMLButtonElement>document.getElementById("send_test_tip"),

		$loading = <HTMLDivElement>document.getElementById('loading_label'),
		$form = <HTMLDivElement>document.getElementById('settings_form');

	socket.ondonation = (don) => PushTip(don.username, don.amount, don.currency, don.message, settings.triggerName);



	function getCurrncySymbol(tipCurrency: string) {
		switch (tipCurrency) {
			case 'EUR': return '€';

			case 'GBP': return '£';

			case 'ARS':
			case 'AUD':
			case 'CAD':
			case 'HKD':
			case 'MXN':
			case 'USD': return '$'

			case 'CNY':
			case 'JPY': return '¥'
		}
		return tipCurrency;
	}

	function PushTip(username: string, tipAmount: number, tipCurrency: string, message: string, triggerName: string) {
		let tipCurrencySymbol = getCurrncySymbol(tipCurrency);


		SAMMI.alert(`DA Extenstion Trigger: ${triggerName}`);

		console.log('trigger', triggerName)
		SAMMI.triggerExt(triggerName, {
			"tipData": {
				"username": username,
				"tipAmount": tipAmount,
				"tipAmountString": tipAmount.toString(),
				"tipCurrency": tipCurrency,
				"tipCurrencySymbol": tipCurrencySymbol,
				"userMessage": message
			}
		})
	}

	//callback for btn toggleVisibleToken
	function toggleVisibleToken() {
		const is_hidden = $inToken.type == "password";
		$inToken.type = is_hidden ? "text" : "password";
		$btnTokenVisible.innerText = is_hidden ? "Скрыть" : "Показать";
	}
	$btnTokenVisible.addEventListener('click', toggleVisibleToken);

	//callback for btn Save
	function saveSettings() {
		const token = $inToken.value;
		if (!token) return alert('Токен не указан');

		const triggerName = $inTriggerName.value;
		if (!triggerName) return alert('Имя триггера не указано')

		const socketHost = $inSocketHost.value;
		if (!socketHost) return alert('Хост сокета не указан')

		settings.token = token;
		settings.triggerName = triggerName;
		settings.socketHost = socketHost;
		settings.save();
		alert("Настройки сохранены");
		socket.connect();
	}
	$btnSave.addEventListener('click', saveSettings);

	//callback for btn Test
	function sendTestTip() {
		const amount = parseFloat($inAmountTestTip.value);
		if (isNaN(amount)) return alert("Размер доната должен быть числом");
		if (amount < 1) return alert("Размер доната должен быть больше 0");

		PushTip('Test Username', amount, 'RUB', 'Test Tip', settings.triggerName);
	}
	$btnSendTestTip.addEventListener('click', sendTestTip);

	// insert settings in form
	settings.token && ($inToken.value = settings.token);
	$inTriggerName.value = settings.triggerName;
	settings.socketHost && ($inSocketHost.value = settings.socketHost);


	//Switch label
	$loading.hidden = true;
	$form.hidden = false;

	//Connect to socket
	if (settings.token && settings.socketHost)
		socket.connect();
}




// function connectSocket(token, triggerName, socketURL) {
// 	if (da_socket) {
// 		da_socket.disconnect();
// 		da_socket = null;
// 	}

// 	socketURL = socketURL || deafultHostSocket;
	// da_socket = io(`wss://${socketURL}/`);
// 	da_socket.on('connect', (msg) => {
// 		console.log(`Сокет подключился к ${socketURL}`);
// 		da_socket.emit('add-user', { token: token, type: 'alert_widget' });
// 	})
// 	da_socket.on('donation', function (msg) {
// 		const don = JSON.parse(msg);

// 		console.log(`Получен донат`, don);

// 		DAPushTip(
// 			don.username || '',
// 			don.amount || 0,
// 			don.currency || 'undefined',
// 			don.message || '',
// 			triggerName
// 		);
// 	});
// }
