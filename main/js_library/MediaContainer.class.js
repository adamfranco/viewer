
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
function MediaContainer ( viewerElementId, mediaXMLNode) {
		
	this.versions = new Array ();
	this.sizeOptions = new Array('thumb', 'small', 'medium', 'large', 'original');
	this.mediaClasses = new Array(ImageMedia, QuicktimeMedia, WindowsMediaMedia, VideoMedia, FileMedia);
	this.currentMediaSize = 'original';
	this.viewerElementId = viewerElementId;
	
	this.display = display;
	this.load = load;
	this.unload = unload;
	this.getMediaSizes = getMediaSizes;
	this.getSizeIndex = getSizeIndex;
	this.selectSizeIndex = selectSizeIndex;
	this.zoomIn = zoomIn;
	this.zoomOut = zoomOut;
	this.zoomToFull = zoomToFull;
	this.zoomToFit = zoomToFit;
	
	var versionElements = mediaXMLNode.getElementsByTagName("version");
	for (var i = 0; i < versionElements.length; i++) {
		var sizeElements = versionElements[i].getElementsByTagName("size");
		if (sizeElements.length > 0)
			var size = this.getSizeIndex(sizeElements[0].firstChild.nodeValue);
		else
			var size = this.getSizeIndex('original');
		
		for (var j = 0; j < this.mediaClasses.length; j++) {
			if (this.mediaClasses[j].prototype.supportsNode(versionElements[i])) {
				this.versions[size] = new this.mediaClasses[j] (this.viewerElementId, versionElements[i]);
				break;
			}
		}
	}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function display (mediaSize) {
		this.currentMediaSize = mediaSize;
		var size = this.selectSizeIndex(mediaSize);
		this.versions[size].display();
	}
	
	/**
	 * Redisplay the media based on our current media size
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function redisplay () {
		this.display(this.currentMediaSize);
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function load (mediaSize) {
		var size = this.selectSizeIndex(mediaSize);
		this.versions[size].load();
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
			this.versions[i].unload();
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
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomIn () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomIn();
	}
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomOut () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomOut();
	}
	
	/**
	 * Zoom to 100% and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomToFull () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomToFull();
	}
	
	/**
	 * Zoom to fit and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomToFit () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomToFit();
	}
}

