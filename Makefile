# Makefile for PaperCreeper AI

.PHONY: build start docker-build

build:
	npm run build

start:
	npm start

docker-build:
	docker build -t papercreeper .

docker-run:
	docker run -p 3000:3000 papercreeper
