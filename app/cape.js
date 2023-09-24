// Controls the availability of developer extensions such as
// the evaluation buttons and selection between service providers.
var useDeveloperExtensions = 0;

var wsDictionary = "http://www.merriam-webster.com/cgi-bin/dictionary?";

var numberOfResults = 0;

var exampleTexts = new Array(
	"A man enters a n:pin-code of his own n:credit-card into a n:UBS-ATM-machine.",
	"p:Pi is a ratio of a circumference of a circle to its diameter.",
	"A dog is interested-in a bone. It is tasty. The dog likes it.",
	"A man runs a bit in a park.",
	"Some abaci are useful.",
	"There is a man who walks. There is a man who talks. The man who walks is happy.",
	"Every customer X enters every card or looks-at every clerk Y that is fond-of X and that enters a code.",
	"Every customer owns at least 3 cards.",
	"A man spends his own vacation in a warm country. Where does he spend the vacation?",
	"Who enters a card?",
	"John waits. A man brings him his pencil and his own computer.",
	"John gives his own wife a big and red apple.",
	"John gives an apple to Mary. Mary accepts the apple and eats it. She is happy and he has no apples.",
	"A customer enters some numbers into a machine or enters some letters into the machine.",
	"A customer enters a card and a numeric personal-code. If it is not valid then SM rejects the card.",
	"A big dog bites a man. He is not happy.",
	"Every human is a male or is a female.",
	"There is a man who waits in a bank.",
	"A customer enters a card. If it is not valid then SimpleMat rejects the card.",
	""
);

// Those variables give access to the DOM nodes.
// They will be set in init().
var busyLight;
var infoLine;
var ui;
var url;
var lexicon;
var results;
var apeItems;

var reloadLexicon;
var guess;
var noclex;

var serviceSelect;

// This holds the machine readable result data (input text, DRS, syntax trees)
var r;

function init()
{
	ui = new Controls(
		document.getElementById('acetext'),
		document.getElementById('analyse'),
		document.getElementById('down'),
		document.getElementById('up'),
		exampleTexts
	);

	ui.go_function = function () {
		acetextToWeb(ui.acetext);
	};


	r = new Results();

	results = document.getElementById('results');
	url = document.getElementById('url');
	lexicon = document.getElementById('lexicon');

	// If there is no lexicon field, then we create an artificial
	// empty lexicon.
	if(lexicon == null) {
		lexicon = new Object();
		lexicon.value = "";
	}

	busyLight = document.getElementById('busyLight');
	infoLine = document.getElementById('infoLine');

	// BUG: "cinput/acetext" is deprecated
	apeItems = new Array(
		new ApeItem(document.getElementById('displayInput'), "input", "", "div", "resultInput", "cinput"),
		new ApeItem(document.getElementById('displayParaphrase'), "paraphrase", "Paraphrase", "pre", "resultParaphrase", "cparaphrase"),
		new ApeItem(document.getElementById('displayParaphrase1'), "paraphrase1", "Core ACE paraphrase", "pre", "resultParaphrase", "cparaphrase1"),
		new ApeItem(document.getElementById('displayParaphrase2'), "paraphrase2", "NP ACE paraphrase", "pre", "resultParaphrase", "cparaphrase2"),
		new ApeItem(document.getElementById('displayDrspp'), "drspp", "DRS", "pre", "resultDrspp", "cdrspp"),
		new ApeItem(document.getElementById('displayDrsxml'), "drsxml", "DRS XML", "pre", "resultDrsxml", "cdrsxml"),
		new ApeItem(document.getElementById('displayFol'), "fol", "FOL", "p", "resultFol", "cfol"),
		new ApeItem(document.getElementById('displayPnf'), "pnf", "PNF", "p", "resultPnf", "cpnf"),
		new ApeItem(document.getElementById('displayTptp'), "tptp", "TPTP", "pre", "resultTptp", "ctptp"),
		new ApeItem(document.getElementById('displayOwlfsspp'), "owlfsspp", "OWL FSS", "pre", "resultOwlfsspp", "cowlfsspp"),
		new ApeItem(document.getElementById('displayOwlrdf'), "owlrdf", "OWL RDF/XML", "pre", "resultOwlrdf", "cowlrdf"),
		new ApeItem(document.getElementById('displayOwlxml'), "owlxml", "OWL XML", "pre", "resultOwlxml", "cowlxml"),
		new ApeItem(document.getElementById('displaySyntaxpp'), "syntaxpp", "Syntax", "pre", "resultSyntaxpp", "csyntaxpp"),
		new ApeItem(document.getElementById('displayTokens'), "tokens", "Tokens", "p", "resultTokens", "ctokens"),
		new ApeItem(document.getElementById('displayRuleml'), "ruleml", "RuleML", "pre", "resultRuleml", "cruleml")
	);
	
	reloadLexicon = document.getElementById('reloadLexicon');
	guess = document.getElementById('guess');
	noclex = document.getElementById('noclex');

	serviceSelect = document.getElementById('serviceSelect');

	if(useDeveloperExtensions) {
		//url.disabled = false;
		serviceSelect.className = "";
	}
	else {
		//url.disabled = true;
		serviceSelect.className = "hidden";
	}

	// IE6 bug: infoLine.replaceChild(document.createTextNode("Using service: " + url.value), infoLine.firstChild);
	// The following line is commented out because IE6 fails here.
	//infoLine.replaceChild(document.createTextNode("Using service: " + url.options[url.selectedIndex].text), infoLine.firstChild);

	document.onkeydown = keyListener;
//	document.onkeypress = keyListener;

	url.onchange = function () {
		// IE6 bug: infoLine.replaceChild(document.createTextNode("Using service: " + url.value), infoLine.firstChild);
		// IE6 would fail here but this is place is hidden from the users anyway
		infoLine.replaceChild(document.createTextNode("Using service: " + url.options[url.selectedIndex].text), infoLine.firstChild);
	}
}


function keyListener(e)
{
	if(!e) {
		//for IE
		e = window.event;
	}

	// Any control key other than shiftKey is OK.
	if(e.ctrlKey || e.altKey || e.metaKey) {

		if(e.keyCode == 38) { // arrow up
			ui.older();
		}
		else if(e.keyCode == 40) { // arrow down
			ui.newer();
		}
		else if(e.keyCode == 13) { // enter
			ui.go();
		}
		//else if(e.keyCode == 32 || e.keyCode == 52) { // space
		//	markBug();
		//}
		else if(e.keyCode == 55) { // 7
			analyseSelection();
		}
		else if(e.keyCode == 39) { // right arrow
			ui.larger();
		}
		else if(e.keyCode == 37) { // left arrow
			ui.smaller();
		}
		//else if(e.keyCode == 65) { // a
		//	ui.all();
		//}
		else if(e.keyCode == 53) { // new 5: old: 190: >.
			ui.complete();
		}
		else if(e.keyCode == 54) { // new 6: 220: \
			ui.format();
		}
		//else if(e.keyCode == 67) { // c
		//	ui.clear();
		//}
		else if(e.keyCode == 49 || e.keyCode == 51 || e.keyCode == 112 || e.keyCode == 114) { // 1, 3, F1, or F3
			if(useDeveloperExtensions) {
				useDeveloperExtensions = 0;
				//url.disabled = true;
				serviceSelect.className = "hidden";
			}
			else {
				useDeveloperExtensions = 1;
				//url.disabled = false;
				serviceSelect.className = "";
			}
		}
		else {
			//alert(e.keyCode);
		}
	}
}


function getNodeValue(doc, tagName)
{
	var elements = doc.getElementsByTagName(tagName);
	if (elements.length == 0) {
		return "";
	}
	else if (elements.item(0).hasChildNodes()) {

		var el = elements.item(0);
		var textContent = "";

		for (var i = 0; i < el.childNodes.length; i++) {
			textContent += el.childNodes[i].nodeValue;
		}

		return textContent;
	}
	else {
		return "";
	}
}


/**
* Note: we are currently not adding the column for Word/token
* as it is currently always empty.
*/
function getMessages(doc, tagName)
{
	var messages = doc.getElementsByTagName(tagName);

	if(messages == null) return null;
	if(messages.length == 0) return null;
	if(messages.item(0).childNodes == null) return null;
	if(messages.item(0).childNodes.length == 0) return null;

	var elTable = document.createElement("table");
	elTable.className = "resultMessages";

	var elThead = document.createElement("thead");

	var elTheadTr = document.createElement("tr");

	elTheadTr.appendChild(makeTableCell(" "));
	elTheadTr.appendChild(makeTableCell("Type"));
	elTheadTr.appendChild(makeTableCell("Sentence"));
	/* elTheadTr.appendChild(makeTableCell("Word")); */
	elTheadTr.appendChild(makeTableCell("Problem"));
	elTheadTr.appendChild(makeTableCell("Suggestion"));

	elThead.appendChild(elTheadTr);

	var elTbody = document.createElement("tbody");

	var messagesList = messages.item(0).childNodes;

	for(var i = 0; i < messagesList.length; i++) {

		if(messagesList[i].nodeType == 1) {
			var elTr = document.createElement("tr");
			
			elTr.appendChild(makeTableCellSimple(messagesList[i].getAttribute("importance")));
			elTr.appendChild(makeTableCell(messagesList[i].getAttribute("type")));
			elTr.appendChild(makeTableCell(messagesList[i].getAttribute("sentence")));
			/* elTr.appendChild(makeTableCell(messagesList[i].getAttribute("token"))); */

			if(messagesList[i].getAttribute("type") == "word") {
				elTr.appendChild(makeTableCellWithLink(wsDictionary, messagesList[i].getAttribute("value")));
			}
			else {
				elTr.appendChild(makeTableCell(messagesList[i].getAttribute("value")));
			}

			elTr.appendChild(makeTableCell(messagesList[i].getAttribute("repair")));
			elTbody.appendChild(elTr);
		}
	}

	elTable.appendChild(elThead);
	elTable.appendChild(elTbody);
	return elTable;
}


function makeTableCellSimple(className)
{
	var elTd = document.createElement("td");
	elTd.className = className;
	elTd.appendChild(document.createTextNode(className));
	return elTd;
}


function makeTableCell(textContent)
{
	var elTd = document.createElement("td");
	var textElement = document.createTextNode(textContent);
	elTd.appendChild(textElement);
	return elTd;
}


function makeTableCellWithLink(wsDictionary, textContent)
{
	var elTd = document.createElement("td");
	var elA = document.createElement("a");
	var textElement = document.createTextNode(textContent);

	elA.setAttribute("href", wsDictionary + textContent);

	elA.appendChild(textElement);
	elTd.appendChild(elA);
	return elTd;
}


function getResultNodeXML(response, overallTimeStart)
{
	// We finish measuring the time when the results have arrived, but have
	// not been embedded yet.
	var overallTimeEnd = new Date();
	var overallTime = (overallTimeEnd.getTime() - overallTimeStart.getTime())/1000;

	var div = document.createElement("div");
	var resultBox = document.createElement("div");

	div.className = "container";

	var infoBox = "";

	if(response.getElementsByTagName("duration").length != 0) {

		var d = response.getElementsByTagName("duration").item(0);

		infoBox = makeInfoBoxWithApeDuration(
			d.getAttribute("tokenizer"),
			d.getAttribute("parser"),
			d.getAttribute("refres"),
			overallTime,
			overallTimeEnd
		);
	}
	else {
		infoBox = makeInfoBox(overallTime, overallTimeEnd);
	}


	var errorMessage = getNodeValue(response, "error");
	
	if(errorMessage != "") {
		var errorType = response.getElementsByTagName("error").item(0).getAttribute("type");
		var errorText = document.createTextNode("ERROR: " + errorType + ": " + errorMessage);
		resultBox.className = "error";
		resultBox.appendChild(errorText);
	}
	else {
		var resultMessages = getMessages(response, "messages");

		if(resultMessages != null) {
			resultBox.appendChild(resultMessages);
		}

		for (var i = 0; i < apeItems.length; i++) {
			if(apeItems[i].cb.checked) {
				var textContent = getNodeValue(response, apeItems[i].elementName);
				if(textContent != "") {
					// This makes IE happy and doesn't affect Firefox.
					textContent = textContent.replace(/\n/g, "\r\n");
					resultBox.appendChild(apeItems[i].makeBox(document, textContent));
				}
			}
		}

		resultBox.className = "visible";


		// BUG: "cinput" is deprecated
		if (useDeveloperExtensions) {
			var text = getNodeValue(response, "input");
			var drs = getNodeValue(response, "drs");
			var trees = getNodeValue(response, "syntax");

			r.id2text.push(text);
			r.id2drs.push(drs);
			r.id2trees.push(trees);

			var id = r.id2text.length - 1;
			var evaluationBox = makeEvaluationBox(id);
			infoBox.insertBefore(evaluationBox, infoBox.firstChild);
		}
	}

	div.appendChild(infoBox);
	div.appendChild(resultBox);
	return div;
}


function makeInfoBoxWithApeDuration(tokenizerTime, parserTime, refresTime, overallTime, overallTimeEnd)
{
	var infoBox = document.createElement("div");
	var span = document.createElement("span");
	infoBox.className = "infoBox";

	var textTimeBox = document.createTextNode("overall: " + overallTime + " sec (tokenizer: " + tokenizerTime + " parser: " + parserTime + " refres: " + refresTime + ") :: " + overallTimeEnd);

	span.appendChild(textTimeBox);
	infoBox.appendChild(span);

	return infoBox;
}


function makeInfoBox(overallTime, overallTimeEnd)
{
	var infoBox = document.createElement("div");
	var span = document.createElement("span");
	infoBox.className = "infoBox";

	var textTimeBox = document.createTextNode("overall: " + overallTime + " sec :: " + overallTimeEnd);

	span.appendChild(textTimeBox);
	infoBox.appendChild(span);

	return infoBox;
}


function acetextToWeb(text)
{
	var overallTimeStart = new Date();

	var textNormalized = text.value;
	// Strip the space from the beginning and end of the text.
	textNormalized = textNormalized.replace(/^\s*/g, "");
	textNormalized = textNormalized.replace(/\s*$/g, "");

	var lexiconNormalized = lexicon.value;
	// Strip the space from the beginning and end of the URL.
	lexiconNormalized = lexiconNormalized.replace(/^\s*/g, "");
	lexiconNormalized = lexiconNormalized.replace(/\s*$/g, "");

	var query = new Query();

	if (textNormalized.match(/^http:\/\//)) {
		query.set("file", textNormalized);
	}
	else {
		query.set("text", textNormalized);
	}

	if (lexiconNormalized.match(/^http:\/\//)) {
		query.set("ulexfile", lexiconNormalized);
	}
	else {
		query.set("ulextext", lexiconNormalized);
	}

	text.value = textNormalized;
	lexicon.value = lexiconNormalized;
	

	for (var i = 0; i < apeItems.length; i++) {
		apeItems[i].cb.checked ? query.set(apeItems[i].queryParam, "on") : query.set(apeItems[i].queryParam, "off");
	}

	reloadLexicon.checked ? query.set("ulexreload", "on") : query.set("ulexreload", "off");
	guess.checked ? query.set("guess", "on") : query.set("guess", "off");
	noclex.checked ? query.set("noclex", "on") : query.set("noclex", "off");

	// The checkbox is switched off every time a query is sent, since we don't want to
	// reload the lexicon every time. The user has to explicitly manually switch it back on
	// if he needs a reload.
	reloadLexicon.checked = false;

	var req = makeXMLHttpRequestObject();

	if (req) {
		// IE6 bug: var wsUrl = url.value;
		var wsUrl = url.options[url.selectedIndex].text;

		// BUG: temporary hack to use the unizh-URI as the webservice URI
		// in case the client uses the unizh-URI. The problem is that due to
		// security constraints the two URIs must match.
		if ((window.location.href).match(/\.unizh\./)) {
			wsUrl = wsUrl.replace(/\.uzh\./, ".unizh.");
		}

		sendQuery(req, wsUrl, query.toHttpquery(), overallTimeStart);
	}
}


function sendQuery(req, wsUrl, httpQuery, overallTimeStart)
{
	req.onreadystatechange = function() {
		if (req.readyState == 4) {

			busyLight.className = "hidden";

			if (req.status == 200) {

				if(req.responseXML == null) {
					alert(req.responseText);
				}
				else {
					var result = getResultNodeXML(req.responseXML, overallTimeStart);

					// Make the source readable with a newline.
					var newline = document.createTextNode("\n");
					results.insertBefore(newline, results.firstChild);

					results.insertBefore(result, results.firstChild);

					numberOfResults++;
				}
			}
			else {
				alert("Failed to retrieve data from\n" + wsUrl + "\nError: " + req.statusText + " (" + req.status + ")");
			}
		}
		else {
			busyLight.className = 's' + req.readyState;
		}
	}


	// We look at the length of the query and use POST if the length is too long.
	// We do this to avoid the "414 Request-URI Too Long" error
	if(httpQuery.length < 1000) {

		try {
			req.open("GET", wsUrl + "?" + httpQuery, true);
			req.send(null);
		}
		catch(e) {
			alert(e);
		}
	}
	else {
		try {
			req.open("POST", wsUrl, true);

			// Note: Opera doesn't support this, as of 2005-03-19
			// Note: it seems to be fixed in Opera 9
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			req.send(httpQuery);
		}
		catch(e) {
			alert(e);
		}
	}
}


function makeXMLHttpRequestObject()
{
	var r;

	if(window.XMLHttpRequest) {
		r = new XMLHttpRequest();
        }
	else if(window.ActiveXObject) {
		r = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if(!r) {
		alert("Failed to create XMLHttpRequest object.");
	}

	return r;
}
