/**
 * The source of this file was downloaded from 
 *		http://www.alistapart.com/stories/alternate/
 * and was at the time of its inclusion here offered for use without restrictions.
 *
 *
 * @since 5/23/06
 * 
 * @author Paul Sowden (http://www.idontsmoke.co.uk/)
 * @copyright Copyright &copy; 1998-2006 A List Apart Magazine and the authors.
 *
 * @version $Id$
 */ 
function setActiveStyleSheet(title) {
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if(a.getAttribute("title") == title) a.disabled = false;
		}
	}
}

function getActiveStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
	}
	return null;
}

function getPreferredStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1
			 && a.getAttribute("rel").indexOf("alt") == -1
			 && a.getAttribute("title")
			 ) return a.getAttribute("title");
	}
	return null;
}

/**
 * Answer an array of all style sheets.
 *
 * @return array
 * @access public
 * @since 5/23/06
 * @author Adam Franco
 */
function getStyleSheets() {
	var i, a;
	var j = 0;
	var sheets = new Array();
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			sheets[j] = a.getAttribute("title");
			j++;
		}
	}
	return sheets;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

window.onload = function(e) {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredStyleSheet();
	setActiveStyleSheet(title);
}

window.onunload = function(e) {
	var title = getActiveStyleSheet();
	createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
