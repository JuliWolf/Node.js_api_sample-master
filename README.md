### Тестовый api на node.js ( mongodb + mogoose + jsonwebtoken )

Идея - Api предусматривающий регистрацию, добовление товраров, оформление заказов 
( Для тестирования различных front-end фреймворков в будующем )


#### Маршруты

Маршруты помеченные звёздочкой при запросе требуют заголовок Authorization c токеном авторизации
его можно получить по маршруту /user/login { email: String, password: String } 

пример: [{"key":"Authorization","value":"token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhQGJiLmNjIiwidXNlcklkIjoiNWE0YzI3NWI4ZDc3NWEwYWQ0NzRlNzA4IiwiaWF0IjoxNTE4MDA2ODY1LCJleHAiOjE1MTgwMTA0NjV9.J0ryX9D3s9D1EzOnYBnP7_b7q1MguBN2f5kXBGyyFpY","description":"","enabled":true}]


/products

1) GET /products Возвращает все продукты
2) GET /products/id Возвращает продукт по id
3) DELETE /products/id Удаляет продукт по id *
4) PATCH /products/id Изменяет продукт по id тело: formData { name: String, price: Number, productImage: File } *
5) POST /products Вносит новый продукт тело: formData { name: String, price: Number, productImage: File } *

/orders

1) GET /orders Возвращает все заказы *
2) GET /orders/id Возвращает заказ по id *
3) DELETE /orders/id Удаляет заказ по id *
4) POST /orders Добовляет заказ тело: raw json { productId: ObjectId, quantity: Number } * 

/user

1) POST /user/signup регистрирует пользователя тело raw json { email: String, password: String }
2) POST /user/login возвращает jsonwebtoken используемый для доступа к защищённым роутам
3) DELETE /user/id удаляет пользователя по id * 


#### На данном этапе все пользователи системы являются администраторами

Для работы

1) Клонируйте репозиторий
2) В файле app.js в секции "Настройка mongoose" настроить соединение с сервером баз данных 
2) В папке с репой npm install
2) В папке с репой npm start