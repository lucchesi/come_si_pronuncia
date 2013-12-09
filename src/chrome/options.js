
names = ["accent", "chiusura"];
window.vals = {};

function getValues() {
	vals = {};
	for (i in names) {
		tmp = document.getElementsByName( names[i] );
		
		for (j in tmp) {
			if(tmp[j].checked == true) {
				vals[ names[i] ] = tmp[j].id;
			}
		}
	}
	window.vals = vals;
	return vals;
}

// Saves options to storage.
function save_options() {
	window.vals = getValues();
	for (i in names) {
		chrome.storage.local.set({"vals": window.vals}, function(){});
	}
	
	// Update status to let user know options were saved.
	stats = document.getElementById("status");
	stats.innerHTML = "Options Saved.";
	setTimeout(function() { stats.innerHTML = "";}, 1500);
}

// Restores select box state to saved value from storage.
chrome.storage.local.get("vals", function(data)
{
	window.vals = data.vals;
	if(!window.vals) window.vals = [];
	
	for (i in names)
	{
		tmp = document.getElementsByName( names[i] );
		
		if( window.vals[ names[i] ]!=undefined ) {
			for (j in tmp) {
				if (tmp[j].id == window.vals[ names[i] ]) {
					tmp[j].checked = true;
				}
			}
		}
		else {
			tmp[0].checked = true;
		}
	}
	
	change_text();
});

var txt="";
// Updates the example text
function change_text() {
	txt = document.getElementById("example").value;
	
	// Some preprocessing
	txt = txt.replace(/</gi, "&lt;");
	txt = txt.replace(/>/gi, "&gt;");
	txt = txt.replace(/\$/gi, "&#36;");
	txt = txt.replace(/\n/g, "<br>\n");
	
	window.vals = getValues();
	document.getElementById("test_div").innerHTML = replace(txt, window.vals[names[0]], window.vals[names[1]]);
}

document.getElementById("example").addEventListener('keydown', change_text);
document.getElementById("example").addEventListener('keyup', change_text);

document.querySelector('#save').addEventListener('click', save_options);

// On every option change, update the example text 
for (i in names) {
	tmp = document.getElementsByName( names[i] );

	for (j in tmp) {
		if(tmp[j].addEventListener) {
			tmp[j].addEventListener("click", change_text);
		}
	}
}

