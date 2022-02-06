.PHONY: help
help: ## show this
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

login: ## clasp login
	clasp login --no-localhost

clean: ## clean dist folder
	rm -rf dist/public
	rm -f dist/*.ts
	mkdir -p dist/public

build: clean ## clean and build
	cd editor && npm run build

	@echo "==> build apps scripts: start"
	@echo "==> ..."
	@cp src/*.ts dist/
	@cp src/public/index.html dist/public/
	@cp src/public/assets.html dist/public/
	@cp src/public/js_assets.html dist/public/
	@cp src/public/new_file_created.html dist/public/

	@echo "<style>" > dist/public/index.css.html
	@cat editor/dist/assets/index.*.css >> dist/public/index.css.html
	@echo "</style>" >> dist/public/index.css.html

	@echo '<script type="module">' > dist/public/index.js.html
	@cat editor/dist/assets/index.*.js >> dist/public/index.js.html
	@echo "</script>" >> dist/public/index.js.html
	@echo "==> build apps scripts: finished"

push: ## clasp push
	@echo "==> clasp push"
	@clasp push
