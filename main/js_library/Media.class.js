
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 

/**
 * The media class represents a media file in a slide.
 * 
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
function Media ( xmlDocument, mediaXMLNode) {
		
	this.versions = new Array ();
	this.sizeOptions = new Array('thumb', 'small', 'medium', 'large', 'original');
	this.display = display;
	this.load = load;
	this.unload = unload;
	this.getMediaSizes = getMediaSizes;
	this.getSizeIndex = getSizeIndex;
	this.selectSizeIndex = selectSizeIndex;
	
	var versionElements = getElementsByPath(xmlDocument, mediaXMLNode, "version");
	for (var i = 0; i < versionElements.length; i++) {
		var sizeElements = getElementsByPath(xmlDocument, versionElements[i], "size");
		if (sizeElements.length > 0)
			var size = this.getSizeIndex(sizeElements[0].firstChild.nodeValue);
		else
			var size = this.getSizeIndex('original');
		
		this.versions[size] = new Array();
		
		var urlElements = getElementsByPath(xmlDocument, versionElements[i], "url");
		if (urlElements.length > 0)
			this.versions[size]['url'] = urlElements[0].firstChild.nodeValue;
		
		var typeElements = getElementsByPath(xmlDocument, versionElements[i], "type");
		if (typeElements.length > 0)
			this.versions[size]['type'] = typeElements[0].firstChild.nodeValue;
		
		var heightElements = getElementsByPath(xmlDocument, versionElements[i], "height");
		if (heightElements.length > 0)
			this.versions[size]['height'] = heightElements[0].firstChild.nodeValue;
		
		var widthElements = getElementsByPath(xmlDocument, versionElements[i], "width");
		if (widthElements.length > 0)
			this.versions[size]['width'] = widthElements[0].firstChild.nodeValue;
	}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function display (mediaSize) {
		this.load(mediaSize);
		var size = this.selectSizeIndex(mediaSize);
		
		var html = "";
 		html += "<img";
 		html += " src='" + this.versions[size]['image'].src + "'";
 		html += " height='" + this.versions[size]['height'] + "'";
 		html += " width='" + this.versions[size]['width'] + "'";
 		html += " align='left' />";
		var destination = getElementFromDocument('image');
		destination.innerHTML = html;
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function load (mediaSize) {
		var size = this.selectSizeIndex(mediaSize);
		if (this.versions[size]['image'] == null) {
			this.versions[size]['image'] = new Image();
			this.versions[size]['image'].src = this.versions[size]['url'];
		}
	}
	
	/**
	 * unload and clear our image cache
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function unload () {
		for (var i in this.versions) {
			this.versions[i]['image'] = null;
		}
	}
	
	/**
	 * Answer the availible sizes of media
	 * 
	 * @return array
	 * @access public
	 * @since 8/24/05
	 */
	function getMediaSizes () {
		var sizes = new Array();
		for (var i in this.versions) {
			sizes.push(this.sizeOptions[i]);
		}
		return arrayUnique(sizes);
	}
	
	/**
	 * Answer the integer size that corresponds to the text name.
	 * 
	 * @param string sizeName
	 * @return integer
	 * @access public
	 * @since 8/24/05
	 */
	function getSizeIndex (sizeName) {
		for (var i = 0; i < this.sizeOptions.length; i++) {
			if (sizeName == this.sizeOptions[i])
				return i;
		}
		
		alert("Media version size, '" + sizeName + "', is not in the allowed list:\n " + this.sizeOptions);
	}
	
	/**
	 * Answer the size index that equal to sizeName if a version exists for that
	 * size, otherwise, the next bigger existing version index. If no large version
	 * exists, then return a smaller version.
	 * 
	 * @param string sizeName
	 * @return integer
	 * @access public
	 * @since 8/24/05
	 */
	function selectSizeIndex (sizeName) {
		var targetIndex = this.getSizeIndex(sizeName);

		// Look for the desired or larger versions
		for (var i = targetIndex; i <= this.sizeOptions.length; i++) {
			if (this.versions[i])
				return i;
		}
		
		// Look for smaller versions
		for (var i = targetIndex - 1; i >= 0; i--) {
			if (this.versions[i])
				return i;
		}
		
		alert("No media version exists.");
	}
}

