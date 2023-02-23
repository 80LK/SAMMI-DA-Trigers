/// <reference path="./Settings.ts" />
/// <reference path="./Socket.ts" />
/// <reference path="../../declaration/SAMMI.d.ts" />


async function DonationAlertsTriggerInit() {
	const settings = new Settings(localStorage),
		socket = new Socket(settings),

		$inToken = <HTMLInputElement>document.getElementById('token'),
		$btnTokenVisible = <HTMLButtonElement>document.getElementById('toggle_visible_token'),

		$inTriggerName = <HTMLInputElement>document.getElementById('trigger_name'),
		$inSocketHost = <HTMLInputElement>document.getElementById('socket_host'),

		$chbEnableConvertCurrency = <HTMLInputElement>document.getElementById('enableConvertCurreny'),
		$fieldConvertCurrenyTo = <HTMLTableRowElement>document.getElementById('fieldConvertCurrenyTo'),
		$selConvertCurrenyTo = <HTMLSelectElement>document.getElementById('convertCurrenyTo'),


		$btnSave = <HTMLButtonElement>document.getElementById('save_settings'),

		$inAmountTestTip = <HTMLInputElement>document.getElementById("amount_test_tip"),
		$btnSendTestTip = <HTMLButtonElement>document.getElementById("send_test_tip"),

		$loading = <HTMLDivElement>document.getElementById('loading_label'),
		$form = <HTMLDivElement>document.getElementById('settings_form');

	socket.ondonation = (don) => PushTip(don.username, don.amount, don.currency, don.message, settings.triggerName);

	$chbEnableConvertCurrency.addEventListener('change', () => {
		$fieldConvertCurrenyTo.hidden = !$chbEnableConvertCurrency.checked;
	})


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

	const currency = await (async () => {
		try {
			const request = await fetch('https://www.cbr-xml-daily.ru/latest.js');
			const response = await request.json();
			response.rates.RUB = 1;
			return response.rates
		} catch (e) {
			if (settings.enableConvertCurency) {
				alert("Не удалось получить курс валют. Конвертация отключена");
				settings.enableConvertCurency = false;
			}
			return { noConv: 1 };
		}
	})();
	console.log(currency);
	function convert(amount: number, from: string, to: string): number {
		if (currency.noConv === 1) return amount;

		from = from.toUpperCase(),
			to = to.toUpperCase();

		if (from == to) return amount;

		if (!currency.hasOwnProperty(from)) {
			console.error(`Unknown currency "${from}"`)
			return amount;
		}
		if (!currency.hasOwnProperty(to)) {
			console.error(`Unknown currency "${to}"`)
			return amount;
		}

		return (amount / currency[from]) * currency[to];
	}

	function PushTip(username: string, tipAmount: number, tipCurrency: string, message: string, triggerName: string) {
		let tipCurrencySymbol = getCurrncySymbol(tipCurrency);


		SAMMI.alert(`DA Extenstion Trigger: ${triggerName}`);

		console.log('trigger', triggerName, (settings.enableConvertCurency ? {
			tipConvertAmount: convert(tipAmount, tipCurrency, settings.convertCurrencyTo),
			tipConvertCurrency: settings.convertCurrencyTo,
			tipConvertCurrencySymbol: getCurrncySymbol(settings.convertCurrencyTo)
		} : {}))
		SAMMI.triggerExt(triggerName, {
			"tipData": {
				"username": username,
				"tipAmount": tipAmount,
				"tipAmountString": tipAmount.toString(),
				"tipCurrency": tipCurrency,
				"tipCurrencySymbol": getCurrncySymbol(tipCurrencySymbol),
				"userMessage": message,
				... (settings.enableConvertCurency ? {
					tipConvertAmount: convert(tipAmount, tipCurrency, settings.convertCurrencyTo),
					tipConvertCurrency: settings.convertCurrencyTo,
					tipConvertCurrencySymbol: getCurrncySymbol(settings.convertCurrencyTo)
				} : {})
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
		settings.enableConvertCurency = $chbEnableConvertCurrency.checked;
		settings.convertCurrencyTo = $selConvertCurrenyTo.value;
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
	$fieldConvertCurrenyTo.hidden = !($chbEnableConvertCurrency.checked = settings.enableConvertCurency);
	$selConvertCurrenyTo.value = settings.convertCurrencyTo;

	//Switch label
	$loading.hidden = true;
	$form.hidden = false;

	//Connect to socket
	if (settings.token && settings.socketHost)
		socket.connect();
}
