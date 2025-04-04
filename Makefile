.PHONY: up logs-node ssh-node watch build check start test eslint eslint-fix create-migration run-migration

DOCKER_RUN_CMD=docker-compose exec node

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

check:
	$(DOCKER_RUN_CMD) npm run check

test:
	$(DOCKER_RUN_CMD) npm run test

eslint:
	$(DOCKER_RUN_CMD) npm run eslint

eslint-fix:
	$(DOCKER_RUN_CMD) npm run eslint:fix

migration-create:
	$(DOCKER_RUN_CMD) npm run migration:generate -- $(MIGRATION_NAME)

migration-run:
	$(DOCKER_RUN_CMD) npm run migration:run

card:
	$(DOCKER_RUN_CMD) npm run card

card-regen:
	$(DOCKER_RUN_CMD) npm run card:regen

