.PHONY: help
help: ## show this
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

login: ## clasp login
	npx clasp login --no-localhost

clean: ## clean dist folder
	rm -rf dist/public
	rm -f dist/*.ts
	mkdir -p dist/public

build: clean ## clean and build
	cp src/*.ts dist/
	cp src/public/*.html dist/public/
	cp src/public/css.css dist/public/css.html
	echo "<script>" > dist/public/main.js.html
	npx esbuild ./src/public/main.jsx --bundle --minify --target=esnext >> dist/public/main.js.html
	echo "</script>" >> dist/public/main.js.html

push: ## clasp push
	npx clasp push

build-push: build push ## build and push

