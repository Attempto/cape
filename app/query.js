function Query()
{
	this.p = new Object();

	//this.p.text = "APE helps every user.";
	//this.p.file = "http://attempto.ifi.uzh.ch/site/acetexts/example1.ace.txt";
	//this.p.ulexfile = "http://attempto.ifi.uzh.ch/site/acetexts/example1.ulex.pl";
	//this.p.ulextext = "pn_sg('APE', 'Attempto_Parsing_Engine', neutr). pn_pl('APEs', 'Attempto_Parsing_Engines', neutr).";

	// this.p.timelimit = 20; // BUG: not supported

	this.p.ulexreload = "off";

	this.p.cinput = "on"; // BUG: deprecated
	this.p.ctokens = "on";
	this.p.cparaphrase = "on";
	this.p.cparaphrase1 = "off";
	this.p.cparaphrase2 = "off";
	this.p.cdrs = "on";
	this.p.cdrspp = "on";
	this.p.cdrsxml = "on";
	this.p.csyntax = "on";
	this.p.csyntaxpp = "on";
	this.p.cowlxml = "on";
	this.p.cowlfsspp = "on";
	this.p.cfol = "on";
	this.p.cpnf = "on";
	this.p.ctptp = "on";
	this.p.cruleml = "on";

	this.p.guess = "off";
	this.p.noclex= "off";


	this.get = function (key) {
		return this.p[key];
	};

	// 'value' should only be 'on' or 'off'
	this.set = function (key, value) {
		this.p[key] = value;
	};

	// We use encodeURIComponent(), but only on 'text'. This method will not encode: ~!*()'
	// See also: http://xkr.us/articles/javascript/encode-compare/
	// BUG: Why do we only encode 'text'?
	this.toHttpquery = function () {

		var str = "";

		for (var i in this.p) {
			if (i == "text") {
				str += i + "=" + encodeURIComponent(this.p[i]) + "&";
			}
			else {
				str += i + "=" + this.p[i] + "&";
			}
		}

		// Remove the trailing ampersand.
		str = str.replace(/&$/, "");

		return str;
	};
}
