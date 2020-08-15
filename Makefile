DOCKER_RUN_CMD=docker-compose run --rm node

up:
	docker-compose up -d

logs-node:
	docker-compose logs -f node

ssh-node:
	docker-compose exec node bash

watch:
	$(DOCKER_RUN_CMD) npm run watch

build:
	$(DOCKER_RUN_CMD) npm run build

check:
	$(DOCKER_RUN_CMD) npm run check

start:
	$(DOCKER_RUN_CMD) npm run start
