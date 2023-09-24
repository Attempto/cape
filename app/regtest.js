/**
* UI for submitting regression test cases.
*/

var wsRegTestSet = "http://attempto.ifi.uzh.ch/cgi-bin/acetextset/textadd.cgi";


function Results()
{
	this.id2text = new Array();
	this.id2drs = new Array();
	this.id2trees = new Array();
}


function makeEvaluationBox(id)
{
	var evaluationBox = document.createElement("span");
	evaluationBox.className = "evaluationBox";

	var evaluationButtonGood = makeButton(id, "✔", "good", "Evaluate the result for text " + id + " as good.");
	var evaluationButtonBad  = makeButton(id, "✘", "bad", "Evaluate the result for text " + id + " as bad.");

	evaluationBox.appendChild(evaluationButtonGood);
	evaluationBox.appendChild(evaluationButtonBad);

	return evaluationBox;
}


function makeButton(id, buttonLabel, buttonStyle, buttonTitle)
{
	var rtButton = document.createElement("button");
	rtButton.setAttribute("title", buttonTitle);

/*
	var rtButtonText = document.createElement("img");
	rtButtonText.setAttribute("src", buttonLabel + ".png");
	rtButtonText.setAttribute("alt", buttonLabel);
*/
	var rtButtonSpan = document.createElement("span");
	rtButtonSpan.className = buttonStyle;
	var rtButtonText = document.createTextNode(buttonLabel);

	rtButtonSpan.appendChild(rtButtonText);
	rtButton.appendChild(rtButtonSpan);

	var posting =   "text=" + encodeURIComponent(r.id2text[id]) + "&" +
			"drs=" + encodeURIComponent(r.id2drs[id]) + "&" +
			"trees=" + encodeURIComponent(r.id2trees[id]);

	if(buttonStyle == "good") {
		rtButton.addEventListener("click", function () {

			var rtset = makeXMLHttpRequestObject();

			if(rtset) {
				var r = sendRegTestText(rtset, wsRegTestSet, posting + "&eval=0");

				if(!r) {
					this.disabled = true;
					this.className = "blendin";
					this.parentNode.removeChild(this.parentNode.childNodes[1]);
				}
			}
		}, false);
	}

	else {
		rtButton.addEventListener("click", function () {

			var comment = prompt("Add a comment ...", "");

			// If Cancel was not pressed then ...
			if(comment != null) {
				var rtset = makeXMLHttpRequestObject();

				if(rtset != null) {
					var r = sendRegTestText(rtset, wsRegTestSet, posting + "&eval=1&comment=" + comment);

					if(!r) {
						this.disabled = true;
						this.className = "blendin";
						this.setAttribute("title", comment);
						this.parentNode.removeChild(this.parentNode.childNodes[0]);
					}
				}
			}

		}, false);
	}

	return rtButton;
}


function sendRegTestText(rtset, wsRegTestSet, posting)
{
	try {
		rtset.open("POST", wsRegTestSet, false);
		rtset.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		rtset.send(posting);
		return 0;
	}
	catch(e) {
		alert(e);
		return -1;
	}
}
