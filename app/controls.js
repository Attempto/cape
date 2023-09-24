/*
Usage:

var ui = new Controls(
		document.getElementById('acetext'),
		document.getElementById('analyse'),
		document.getElementById('down'),
		document.getElementById('up'),
		["Every man waits.", "John likes Mary."]
	);

Functions older() and newer() emulate the Unix commandline history:
1. Save the modification of the history slot.
2. Move up/down
3. Disable the button if we went too far.
*/


function Controls(acetext, button_analyse, down_arrow, up_arrow, acetexts)
{
	this.acetext = acetext;
	
	this.button_analyse = button_analyse;

	this.down_arrow = down_arrow;

	this.up_arrow = up_arrow;

	this.acetexts = acetexts;

	this.down_arrow.disabled = true;

	this.model = "";

	this.currentTextIndex = this.acetexts.length - 1;

	this.go_function = function() {
		alert("ERROR: go_function not defined!");
	};

	this.modelOverwrite = function () {
		this.model = this.acetext.value;
		if(this.model == "") {
			alert("Model cleared.");
		}
		else {
			alert("Model overwritten with the contents of the textarea.");
		}
	};

	this.modelShow = function () {
		if(this.model != "") {
			this.acetext.value = this.model;
		}
		else {
			alert("Nothing to show, the model is empty.");
		}
	};

	this.modelAppend = function () {
		if(this.acetext.value == "") {
			alert("Nothing to append.");
		}
		else if (this.model == "") {
			this.model = this.acetext.value;
			alert("Model initiated with the contents of the textarea.");
		}
		else {
			this.model = this.model + "\n" + this.acetext.value;
			alert("The contents of the textarea appended to the model.");
		}
	};


	this.clear = function () {
		this.acetexts = [];
		this.up_arrow.disabled = true;
		this.down_arrow.disabled = true;
		this.currentTextIndex = 0;
	};

	this.all = function () {
		var all = "";

		for(var i = 0; i < this.acetexts.length; i++) {
			all = all + this.acetexts[i] + "\n";
		}

		this.acetext.value = all;
		this.currentTextIndex = this.acetexts.length - 1;
		this.down_arrow.disabled = true;
	};

	this.complete = function () {
		var current = this.acetext.value;
		var collection = [];

		for(var i = 0; i < this.acetexts.length; i++) {
			if(this.acetexts[i].indexOf(current) == 0) {
				collection.push(this.acetexts[i]);
			}
		}

		if(collection.length == 1) {
			this.acetext.value = collection[0];
		}
		else if(collection.length > 1){
			var s = current.length;

			while(isSubstringShared(collection, s)) {
				s = s + 1;
			}

			this.acetext.value = collection[0].substring(0, s - 1);
		}

		function isSubstringShared(collection, s) {
			var sstr = collection[0].substring(0, s);

			for(var i = 1; i < collection.length; i++) {
				if(collection[i].indexOf(sstr) != 0) {
					return 0;
				}
			}

			return 1;
		}

	};

	// BUG: this is work in progress
	this.format = function () {
		var c = this.acetext.value;

		// Normalize spaces
		c = c.replace(/^ */, "");
		c = c.replace(/ *$/, "");
		c = c.replace(/  */g, " ");

		// Normalize C-comments . Don't work.
		c = c.replace(/\/\*/, "\n\/\*");
		c = c.replace(/\*\//, "\*\/\n");

		// Break lines after period (.), If/if and then.
		c = c.replace(/\.\s*/g, ".\n");
		c = c.replace(/If\s*/g, "If\n  ");
		c = c.replace(/It is false that\s*/g, "It is false that\n  ");
		c = c.replace(/it is false that\s*/g, "it is false that\n  ");
		c = c.replace(/\s\s*if\s\s*/g, "\nif\n  ");
		c = c.replace(/\s*then\s*/g, "\nthen\n  ");

		c = c.replace(/^( *)(.*) or\s\s*/g, "$1$2\n$1$1 or ");
		c = c.replace(/\n( *)(.*) or\s\s*/g, "$1$2\n$1$1 or ");

		this.acetext.value = c;

		//this.acetext.rows = 40;
	}

	this.older = function () {

		if(this.currentTextIndex > 0) {
			this.acetexts[this.currentTextIndex] = this.acetext.value;
			this.currentTextIndex--;
			this.acetext.value = this.acetexts[this.currentTextIndex];
			this.down_arrow.disabled = false;
		}
	
		if(this.currentTextIndex == 0) {
			this.up_arrow.disabled = true;
		}

		this.acetext.focus();

	};


	this.newer = function () {

		if(this.currentTextIndex < this.acetexts.length - 1) {
			this.acetexts[this.currentTextIndex] = this.acetext.value;
			this.currentTextIndex++;
			this.acetext.value = this.acetexts[this.currentTextIndex];
			this.up_arrow.disabled = false;
		}

		if(this.currentTextIndex == this.acetexts.length - 1) {
			this.down_arrow.disabled = true;
		}

		this.acetext.focus();
	};


	this.go = function () {

		if (this.acetext.value == "") {
			alert("The textarea is empty. Nothing to analyse.");
		}
		else {
			this.go_function();

			this.acetexts.pop();

			this.acetexts.push(this.acetext.value);
			this.acetexts.push("");

			this.acetext.value = "";
			this.currentTextIndex = this.acetexts.length - 1;

			this.up_arrow.disabled = false;
			this.down_arrow.disabled = true;
		}
	};


	this.larger = function () {
		if(this.acetext.rows < 40) { 
			this.acetext.rows += 1;
		}
	};


	this.smaller = function () {
		if(this.acetext.rows > 1) { 
			this.acetext.rows -= 1;
		}
	};
}
