/**
* cb: reference to the checkbox that controls the outputing of the result
* elementName: name of the APE output element (e.g. syntaxpp)
* label: UI label to use to output the result (e.g. syntax)
* styleMajor: div, p, or pre HTML-element to use to output the result
* styleMinor: CSS style to use to output the result
* queryParam: query parameter that corresponds to this result item
*/

function ApeItem(cb, elementName, label, styleMajor, styleMinor, queryParam)
{
	this.cb = cb;
	this.elementName = elementName;
	this.label = label;
	this.styleMajor = styleMajor;
	this.styleMinor = styleMinor;
	this.queryParam = queryParam;

	this.makeBox = function(document, textContent) {

		var box = document.createElement("div");

		if (this.label != "") {
			var label = document.createElement("span");
			label.appendChild(document.createTextNode(this.label));
			label.className = "label";
			box.appendChild(label);
		}

		var containerElement = document.createElement(this.styleMajor);
		containerElement.className = this.styleMinor;

		var textElement = document.createTextNode(textContent);
		containerElement.appendChild(textElement);

		box.className = "box";
		box.appendChild(containerElement);

		return box;
	}
}
