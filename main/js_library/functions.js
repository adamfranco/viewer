function getElementFromDocument(id) {
	// Gecko, KHTML, Opera, IE6+
	if (document.getElementById) {
		return document.getElementById(id);
	}
	// IE 4-5
	if (document.all) {
		return document.all[id];
	}			
}

/**
 * Return an array of nodes based on the search string
 * 
 * @param object document
 * @param object contextNode
 * @param string searchString
 * @return array
 * @access public
 * @since 8/23/05
 */
function getElementsByPath (xmlDocument, contextNode, searchString) {
	if (xmlDocument.evaluate) {
		// Mozilla Version
		var nodeIterator = xmlDocument.evaluate(
										searchString, 
										contextNode, 
										null, 
										XPathResult.ORDERED_NODE_ITERATOR_TYPE, 
										null);
		var nodeArray = new Array();
		var i = 0;
		var node = nodeIterator.iterateNext();
		while (node) {
			nodeArray[i] = node;
			node = nodeIterator.iterateNext();
			i++;
		}
		return nodeArray;
	} else {
		// IE version
		return contextNode.selectNodes(searchString);
	}
}

/**
 * Answer an array only the unique elements of the input array
 * 
 * @param array inputArray
 * @return array
 * @access public
 * @since 8/24/05
 */
function arrayUnique ( inputArray ) {
	var uniqueArray = new Array();
	var i = 0;
	for (var j = 0; j < inputArray.length; j++) {
		if (!inArray(inputArray[j], uniqueArray)) {
			uniqueArray[i] = inputArray[j];
			i++;
		}
	}
	return uniqueArray;
}

/**
 * Answer true if the value passed is in the array
 * 
 * @param mixed value
 * @param array array
 * @return boolean
 * @access public
 * @since 8/24/05
 */
function inArray ( value, array ) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == value)
			return true;
	}
	
	return false;
}