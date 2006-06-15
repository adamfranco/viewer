
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
ImageMedia.prototype = new Media();
ImageMedia.prototype.constructor = ImageMedia;
ImageMedia.superclass = Media.prototype;

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
function ImageMedia ( viewerElementId, mediaXMLNode) {
		
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, mediaXMLNode );
	}
}

	/**
	 * initialize our object. Necessary for proper inheritance to work.
	 * 
	 * @param object Node mediaXMLNode
	 * @return void
	 * @access public
	 * @since 8/26/05
	 */
	ImageMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		ImageMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
		
		this.startAtZoomToFit = true;
		this.image = null;
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	ImageMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			var regex = new RegExp("^image(/[a-z]+)?$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;
		}
		
		return false;
	}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	ImageMedia.prototype.display = function (mediaSize) {
		this.load();
		
		var html = "";
 		html += "<img";
 		html += " id='" + this.viewerElementId + "_image'";
 		html += " src='" + this.image.src + "'/>";
 		
		var destination = getElementFromDocument(this.viewerElementId + '_media');
		destination.innerHTML = html;

		destination._scrollTarget = this;
		destination.onscroll = updateScroll;
		
		var image = getElementFromDocument(this.viewerElementId + '_image');
		image._scrollTarget = this;
		image.onclick = center;
		image.onmousemove = setCursor;
		
		// Wait for our image to load, and then set-up the initital position
		this.setUpPositionOnComplete()
	}
	
	/**
	 * Resize the image once it has finished loading
	 * 
	 * @return void
	 * @access public
	 * @since 1/05/06
	 */
	ImageMedia.prototype.setUpPositionOnComplete = function () {
		if (this.isComplete()) {
			this.setStartingPositionAndZoom();
		} else {
			if (!window.media_objects)
				window.media_objects = new Array();
			
			window.media_objects[this.url] = this;
			window.setTimeout('setUpPositionIfComplete("' + this.url + '");', 100);
		}
	}
	
	/**
	 * Resize the the media if it has been loaded.
	 * 
	 * @param string url
	 * @return void
	 * @access public
	 * @since 1/5/06
	 */
	function setUpPositionIfComplete (url) {
		var media_object = this.media_objects[url];
		
		if (media_object.isComplete()) {
			var loading = getElementFromDocument(media_object.viewerElementId + '_loading')
			loading.style.display = 'none'; 
			
			media_object.setStartingPositionAndZoom();
		} else {
			var loading = getElementFromDocument(media_object.viewerElementId + '_loading')
			loading.style.display = 'block'; 
			
			window.setTimeout('setUpPositionIfComplete("' + url + '");', 100);
		}
	}
	
	/**
	 * Answer true if the size of the image is known
	 * 
	 * @return boolean
	 * @access public
	 * @since 1/5/06
	 */
	ImageMedia.prototype.isComplete = function () {	
		if (this.height && this.height != "0px" 
			&& this.width && this.width != "0px")
		{
			return true;
		} else {
			return this.loadNaturalSize();
		}
	}
	
	/**
	 * Answer true if the image has finished loading (and has a non-zero height
	 * and width). Put the natural height in this object
	 * 
	 * @return boolean
	 * @access public
	 * @since 1/5/06
	 */
	ImageMedia.prototype.loadNaturalSize = function () {		
		var imageElement = getElementFromDocument(this.viewerElementId + '_image');
		
		if (imageElement.naturalHeight > 0 && imageElement.naturalWidth > 0) {
// 			alert ("imageElement.naturalHeight=" + imageElement.naturalHeight + 
// 				"imageElement.naturalWidth=" + imageElement.naturalWidth);
			this.height = imageElement.naturalHeight;
			this.width = imageElement.naturalWidth;
			return true;
		}
		
		// It seems that IE first returns invalid sizes in the
		// image itself, before it loads the image element with
		// the correct size.
		if (imageElement.complete && imageElement.height > 0 && imageElement.width > 0) {
// 			alert ("imageElement.height=" + imageElement.height
// 				+ "imageElement.width=" + imageElement.width);
			this.height = imageElement.height;
			this.width = imageElement.width;
			return true;
		}
		

		
		return false;
	}
	
	/**
	 * Set up the starting zoom and scroll.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	ImageMedia.prototype.setStartingPositionAndZoom = function () {
		// If we haven't displayed this media yet, zoom to fit.
		if (this.startAtZoomToFit != null) {
			this.startAtZoomToFit = null;
			if (this.isLargerThanTarget()) {
				this.zoomToFit();
				return;
			}
		}
		
		var imageElement = getElementFromDocument(this.viewerElementId + '_image');
		imageElement.height = this.getZoomedHeightPx();
		imageElement.width = this.getZoomedWidthPx();
		imageElement.style.position = 'absolute';
		imageElement.style.top = this.getCenteredY() + "px";
		imageElement.style.left = this.getCenteredX() + "px";
		
		this.setScrollXPercent(this.scrollXPercent);
		this.setScrollYPercent(this.scrollYPercent);
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	ImageMedia.prototype.load = function (mediaSize) {
		if (this.image == null) {
			this.image = new Image();
			this.image.src = this.url;
		}
	}
	
	/**
	 * unload and clear our image cache
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	ImageMedia.prototype.unload = function () {
		this.image = null;
	}
	
	/**
	 * Answer the distance X-direction from the edge of the image to the
	 * center of the scrolled window.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	ImageMedia.prototype.getScrollCenterX = function () {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		return target.scrollLeft + Math.round(target.clientWidth/2) + this.getCenteredX();
	}
	
	/**
	 * Answer the distance Y-direction from the edge of the image to the
	 * center of the scrolled window.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	ImageMedia.prototype.getScrollCenterY = function () {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		return target.scrollTop + Math.round(target.clientHeight/2) + this.getCenteredY();
	}
	
	/**
	 * Center the image on the place where the mouse was clicked.
	 * 
	 * @return void
	 * @access public
	 * @since 9/15/05
	 */
	center = function (event) {
		var zoomIn = false;
		var zoomOut = false;
		
		if (event) {
			// Mozilla/Konqueror/Safari version
			var clickedX = event.layerX;
			var clickedY = event.layerY;
		} else {
			// IE version
			var event = window.event;
			var clickedX = window.event.offsetX;
			var clickedY = window.event.offsetY;
		}
	
		if (event.ctrlKey || event.metaKey) {
			if (event.shiftKey)
				zoomOut = true;
			else
				zoomIn = true;
		}
	
	
		var changeX = -(this._scrollTarget.getScrollCenterX() - clickedX);
		var changeY = -(this._scrollTarget.getScrollCenterY() - clickedY);
		
		
		var target = getElementFromDocument(this._scrollTarget.viewerElementId + '_media');
		
		if (target.scrollLeft >= 0
			&& target.scrollLeft <= (target.scrollWidth - target.clientWidth/2))
		{
			target.scrollLeft = target.scrollLeft + changeX;
			this._scrollTarget.scrollXPercent = (target.clientWidth/2 + target.scrollLeft)/target.scrollWidth;
		
		}
		
		if (target.scrollTop >= 0 
			&& target.scrollTop <= (target.scrollHeight - target.clientHeight/2))
		{
			target.scrollTop = target.scrollTop + changeY;
			this._scrollTarget.scrollYPercent = (target.clientHeight/2 + target.scrollTop)/target.scrollHeight;
		}
		
		if (zoomIn)
			this._scrollTarget.zoomIn();
		else if (zoomOut)
			this._scrollTarget.zoomOut();
	}

	/**
	 * Set the cursor based on the meta-keys pressed.
	 * 
	 * @return void
	 * @access public
	 * @since 9/15/05
	 */
	setCursor = function (event) {
		if (!event)
			event = window.event;
		
		if (event.ctrlKey || event.metaKey) {
			if (event.shiftKey)
				this.style.cursor = 'help';
			else
				this.style.cursor = 'crosshair';
		} else {
			this.style.cursor = 'default';
		}
	}
	
	/**
	 * Clear the zoom level.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	ImageMedia.prototype.resetZoom = function () {
		this.startAtZoomToFit = true;
		this.zoomLevel = 1;
	}