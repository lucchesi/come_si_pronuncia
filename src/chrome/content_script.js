
function replace(txt, acc, chiu)
{
	//console.log("acc: " + acc);
	//console.log("chiu: " + chiu);
	
	// Some extra spaces to help the processing
	txt = txt.replace(/^/g, " ");
	txt = txt.replace(/$/g, " ");
	
	// this monster means simply "anything that is not a letter"
	txt = txt.replace(/([^\w\-\s\dÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÞþÐð])/g, " $1 ");
	
	// Fix the tags
	txt = txt.replace(/< (\w*) >/g, "<$1>");
	
	// Line breaks
	txt = txt.replace(/\n/g, " #NEW#LINE# ");
	
	// Tokenize the page
	txt = txt.split(" ");
	
	
	src = 0;
	quot = 0;
	squot = 0;
	for (i in txt)
	{
		// "Dude, that's a link"
		if (txt[i]=="src") src = 1;
		
		if (txt[i]=="\'" && src==1 && quot==0) {
			if (squot == 0) squot = 1;
			else { squot = 0; src = 0; }
		}
		
		if (txt[i]=="\"" && src==1 && squot==0) {
			if (quot == 0) quot = 1;
			else { quot = 0; src = 0; }
		}
		
		
		el = list[ txt[i].toLowerCase() ];
		
		if (el!=undefined && squot==0 && quot==0)
		{
			// Gets the case
			if (txt[i] == txt[i].toUpperCase())
				el = el.toUpperCase();
			else if (txt[i] != txt[i].toLowerCase()) // Assuming only the first letter is upper
			{
				if(el[0]=="(")
					el = "(" + el[1].toUpperCase() + el.substr(2);
				else
					el = el[0].toUpperCase() + el.substr(1);
			}
			
			
			//# Options #//
			// Chiusura:
			switch(chiu) {
				case "c_it":
					el = el.replace(/ɛ/gi, "è").replace(/ɔ/gi, "ò");
					break;
				case "c_i":
					el = el.replace(/ɛ/gi, "<i>e</i>").replace(/ɔ/gi, "<i>o</i>");
					break;
				case "c_u":
					el = el.replace(/ɛ/gi, "<u>e</u>").replace(/ɔ/gi, "<u>o</u>");
					break;
				case "c_upp":
					el = el.replace(/ɛ/gi, "E").replace(/ɔ/gi, "O");
					break;
				case "c_none":
					el = el.replace(/ɛ/gi, "e").replace(/ɔ/gi, "o");
					break;
				default:
					break;
			}
			
			// Accent:
			switch(acc) {
				case "a_i":
					el = el.replace("\(", "<i>").replace("\)", "</i>");
					break;
				case "a_upp":
					el = el.split(/[()]/g);
					el[1] = el[1].toUpperCase();
					el = el.join("");
					break;
				case "a_none":
					el = el.replace(/[()]/g, "");
					break;
				default:
					el = el.replace("\(", "<u>").replace("\)", "</u>");
					break;
			}
			
			txt[i] = el;
		}
		
	}
	// "pull yourself together!"
	txt = txt.join(" ");
	
	// Line breaks
	txt = txt.replace(/ #NEW#LINE# /g, "\n");
	
	// Remove the extra spaces
	txt = txt.replace(/ ([^\w\-\s\dÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÞþÐð]) /g, "$1");
	txt = txt.replace(/^ /g, "");
	txt = txt.replace(/ $/g, "");
	
	// If somehow this happens, remove it
	txt = txt.replace(/<u><\/u>/g, "");
	txt = txt.replace(/<i><\/i>/g, "");
	
	// Some magic to fix tags if we get too happy marking everything
	for (i=0; txt.match(/<([^>]*)<u>([^<>]*)<\/u>([^<]*)>/gi) && i<100; i++) {
		txt = txt.replace(/<([^>]*)<u>([^<>]*)<\/u>(.*)>/gi, "<$1$2$3>");
	}
	for (i=0; txt.match(/<([^>]*)<i>([^<>]*)<\/i>([^<]*)>/gi) && i<100; i++) {
		txt = txt.replace(/<([^>]*)<i>([^<>]*)<\/i>(.*)>/gi, "<$1$2$3>");
	}
	
	return txt;
}

var page;
if(document.URL != "chrome-extension://iifnmgagdhakheapgajijlmdaiddachf/options.html") {
	chrome.storage.local.get("vals", function(data)
	{
		if(chrome.runtime.lastError)
		{
			/* error */
			return;
		}

		vals = data.vals;
		if(!vals) vals = [];
		
		// Only gets the page once, so you'll always apply the script to the original
		if(!page) page = document.body.innerHTML;
		
		document.body.innerHTML = replace(page, vals["accent"], vals["chiusura"]);
	});
}

