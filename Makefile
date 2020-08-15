ssh-node:
	docker-compose run --rm node bash

watch:
	docker-compose run --rm node npm run watch

build:
	docker-compose run --rm node npm run build

check:
	docker-compose run --rm node npm run check

start:
	docker-compose run --rm node npm run start
