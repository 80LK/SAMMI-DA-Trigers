# SAMMI DA Triggers

SAMMI-Расширение, добавляющий тригер донатов из DonationAlerts


## Как узнать свой хост сокета

1. Запустите любую группу [виджетов](https://www.donationalerts.com/dashboard/widgets/alerts).
![Run widget](/img/get-host-1.jpg "Run widget")
2. В открывшемся окне запустите DevTools(F12, Ctrl+Shift+I или ПКМ -> "Посмотреть код")
![Open DevTools](/img/get-host-2.jpg "Open DevTools")
3. Откройте вкладку Network и выберите "WS"
![Open Network](/img/get-host-3.jpg "Open Network")
4. Нажмите F5 и найдите сокет DonationAlerts (Request URL содержит donationalerts.ru). Хост сокета указал в группе "Request Heaeders" в поле "Host".
![Find Socket and get Host](/img/get-host-4.jpg "Find Socket and get Host")

## Используется
* [Курсы валют, API](https://www.cbr-xml-daily.ru)
