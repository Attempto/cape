
function analyseSelection()
{
//	var selection = window.getSelection();
	var selection = getSel();

	if(selection == null || selection == "") {
		alert("The selection is empty. Nothing to analyse.");
	}
	else {
		acetextToWeb_x(selection.toString(), new Date());
	}
}


function getSel()
{
	var txt = '';

	if (window.getSelection) {
		txt = window.getSelection();
	}

	else if (document.getSelection) {
		txt = document.getSelection();
	}

	else if (document.selection) {
		txt = document.selection.createRange().text;
	}

	return txt;
}


function markBug()
{
	var selection = window.getSelection();
        var range = selection.getRangeAt(selection.rangeCount - 1).cloneRange();

        var parent = range.commonAncestorContainer;

        while(parent != null && parent.className != "container") {
                parent = parent.parentNode;
        }

        if(parent != null) {
                var bug = document.createElement("span");
                bug.className = "bug";

                try {
                        bug.appendChild(range.extractContents());
                        range.insertNode(bug);
                        //range.surroundContents(bug); // buggy
                } catch(err){
                        alert(err.message);
                };

                range.detach();

                var note_text = prompt("Add a comment...", "");

                if(note_text != null && note_text != "") {
                        var div = document.createElement("div");
                        var note = document.createTextNode(note_text);
                        div.appendChild(note);
                        div.className = "commentBox";
                        parent.appendChild(div);
                }
        }
}


function minimize() {
	var menu = document.getElementById('menu');
	var menuButton = document.getElementById('menuButton');
	
	if(menu.className == "hidden") {
		menu.className = "menu";
		var textElement = document.createTextNode("Hide menu");
		menuButton.removeChild(menuButton.firstChild);
		menuButton.appendChild(textElement);
	}
	else {
		menu.className = "hidden";
		var textElement = document.createTextNode("Show menu");
		menuButton.removeChild(menuButton.firstChild);
		menuButton.appendChild(textElement);
	}
}
