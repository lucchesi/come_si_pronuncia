all:
	cp src/chrome/background.js bin/chrome
	cp src/chrome/manifest.json bin/chrome
	cp src/chrome/icon.png bin/chrome
	cp src/chrome/icon_128.png bin/chrome
	cp src/chrome/options.* bin/chrome
	cat src/parsed_lex.js src/chrome/content_script.js > bin/chrome/content_script.js

perl:
	(cd src && ./convert.pl < lex.out > parsed_lex.js)

small:
	(cd src && ./convert.pl < lex_small.out > parsed_lex.js)

clean:
	rm bin/chrome/background.js
	rm bin/chrome/manifest.json
	rm bin/chrome/icon.png
	rm bin/chrome/icon_128.png
	rm bin/chrome/options.*
	rm bin/chrome/content_script.js
	rm chrome.zip

zip:
	(cd bin && zip -r chrome chrome)
	mv bin/chrome.zip .
