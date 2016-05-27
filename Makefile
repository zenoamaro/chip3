DEVELOPMENT=env NODE_ENV=development
PRODUCTION=env NODE_ENV=production
NODE=./node_modules/.bin/babel-node
LINT=./node_modules/.bin/eslint
TEST=./node_modules/.bin/mocha
TEST_DIRECT=./node_modules/.bin/_mocha
TEST_COMPILERS=js:babel/register
DOCS=./node_modules/.bin/jsdoc
COMPILE=./node_modules/.bin/babel
BUILD=./node_modules/.bin/webpack
DEV_SERVER=./node_modules/.bin/webpack-dev-server

usage:
	@echo PACKAGE
	@echo - prepublish .... tests, rebuilds lib, dist and docs.
	@echo - build ......... builds and optimizes distributables.
	@echo - devel ......... rebuilds on file change.
	@echo - clean ......... removes the built artifacts.
	@echo
	@echo META
	@echo - docs .......... compiles the docs from the sources.
	@echo - lint .......... lints the source.
	@echo - test .......... runs the unit tests.
	@echo - test-watch .... reruns the unit tests on file change.

prepublish: clean lint test docs compile build

clean:
	@rm -rf dist lib docs

devel:
	@$(DEVELOPMENT) $(DEV_SERVER) --config .webpackrc

lint:
	@$(LINT) src

compile:
	@$(COMPILE) -q -d lib src

build: clean
	@$(PRODUCTION) $(BUILD) --config .webpackrc

test:
	@$(TEST) --compilers $(TEST_COMPILERS) test/index.js

test-watch:
	@$(TEST) -bw -R min --compilers $(TEST_COMPILERS) test/index.js

docs:
	-@$(DOCS) --configure .jsdocrc

.PHONY: usage prepublish clean devel\
        build docs lint test test-watch
