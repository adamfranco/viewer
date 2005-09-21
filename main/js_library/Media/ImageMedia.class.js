
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
		
		// If we haven't displayed this media yet, zoom to fit.
		if (this.startAtZoomToFit != null) {
			this.startAtZoomToFit = null;
			if (this.isLargerThanTarget()) {
				this.zoomToFit();
				return;
			}
		}
		
		
				
		var html = "";
 		html += "<img";
 		html += " id='" + this.viewerElementId + "_image'";
 		html += " src='" + this.image.src + "'";
 		html += " height='" + this.getZoomedHeightPx() + "px'";
 		html += " width='" + this.getZoomedWidthPx() + "px'";
 		html += " style='position: absolute; top: " + this.getCenteredY() + "px; left: " + this.getCenteredX() + "px;' />";
 		
		var destination = getElementFromDocument(this.viewerElementId + '_media');
		destination.innerHTML = html;
		
		destination._scrollTarget = this;
		destination.onscroll = updateScroll;
		
		this.setScrollXPercent(this.scrollXPercent);
		this.setScrollYPercent(this.scrollYPercent);
		
		
		var image = getElementFromDocument(this.viewerElementId + '_image');
		image._scrollTarget = this;
		image.onclick = center;
		image.onmousemove = setCursor;
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