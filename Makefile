.PHONY: help
help: ## show this
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

login: ## clasp login
	clasp login --no-localhost

build:
	cp src/*.html dist/
	cp src/*.ts dist/
	cp src/_css.css dist/_css.html
	echo "<script>" > dist/_js_main.html
	npx esbuild ./src/_js_main.jsx --bundle --minify --target=esnext >> dist/_js_main.html
	echo "</script>" >> dist/_js_main.html

push: ## clasp push
	clasp push

build-push: build push ## build and push

