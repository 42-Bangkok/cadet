include app/.env
export $(shell sed 's/=.*//' app/.env)

bump:
	cd app && npm i next@latest react@latest react-dom@latest eslint-config-next@latest
	cd app && npm update

db-push:
	cd app && npx drizzle-kit push:pg
db-generate:
	cd app && npx drizzle-kit generate:pg
# Tag & trigger github actions to build and push docker image
release:
	ver=$(shell date +%Y.%m.%d.%s) &&\
	echo $$ver &&\
	git tag -a $$ver -m "Release $$ver" &&\
	git push origin $$ver
test: test-build
test-build:
	docker build -t staffportal:latest .
	docker rmi staffportal:latest
api-schema:
	cd app && npx -y openapi-typescript ${GATEWAY_URL}/api/openapi.json -o schemas/gateway-api-schema.d.ts 
seed: seed-roles
seed-roles:
	cd app/scripts && npx -y tsx seed-roles.ts 
# Tag & trigger github actions to build and push docker image
release:
	ver=$(shell date +%Y.%m.%d.%s) &&\
	echo $$ver &&\
	git tag -a $$ver -m "Release $$ver" &&\
	git push origin $$ver