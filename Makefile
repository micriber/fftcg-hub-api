.PHONY: up logs-node ssh-node watch build check start test eslint eslint-fix create-migration run-migration

DOCKER_RUN_CMD=docker-compose run --rm node

up:
	docker-compose up -d

logs-node:
	docker-compose logs -f node

logs-postgres:
	docker-compose logs -f postgres

ssh-node:
	docker-compose exec node bash

ssh-postgres:
	docker-compose exec postgres bash

build:
	$(DOCKER_RUN_CMD) npm run build

check:
	$(DOCKER_RUN_CMD) npm run check

start:
	$(DOCKER_RUN_CMD) npm run start

test:
	$(DOCKER_RUN_CMD) npm run test

test-func:
	$(DOCKER_RUN_CMD) npm run test:func

test-func-cov:
	$(DOCKER_RUN_CMD) npm run test:func:cov

test-unit:
	$(DOCKER_RUN_CMD) npm run test:unit

eslint:
	$(DOCKER_RUN_CMD) npm run eslint

eslint-fix:
	$(DOCKER_RUN_CMD) npm run eslint:fix

migration-create:
	$(DOCKER_RUN_CMD) npm run migration:generate -- $(MIGRATION_NAME)

migration-run:
	$(DOCKER_RUN_CMD) npm run migration:run

fixture:
	$(DOCKER_RUN_CMD) npm run fixture

fixture-test:
	$(DOCKER_RUN_CMD) npm run fixture:test

card:
	$(DOCKER_RUN_CMD) npm run card

card-test:
	$(DOCKER_RUN_CMD) npm run card:test

card-regen:
	$(DOCKER_RUN_CMD) npm run card:regen
