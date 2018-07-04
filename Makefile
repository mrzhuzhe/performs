BABEL = ./node_modules/babel-cli/bin/babel.js
UglifyJS2 = ./node_modules/uglify-js/bin/uglifyjs

default: check
	yarn run dist

dev: check
	yarn run concat

build: check
	yarn run dist

test:
	yarn run test

check:
	yarn install
