
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
function Media ( viewerElementId, mediaXMLNode) {
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
	Media.prototype.init = function ( viewerElementId, mediaXMLNode) {
		
		this.zoomLevel = 1;
		this.zoomIncrement = 1.25;
		this.fitMargin = 20;
		this.scrollXPercent = 0.5;
		this.scrollYPercent = 0.5;
		this.viewerElementId = viewerElementId;
				
		var urlElements = mediaXMLNode.getElementsByTagName("url");
		if (urlElements.length > 0)
			this.url = urlElements[0].firstChild.nodeValue;
		
		var typeElements = mediaXMLNode.getElementsByTagName("type");
		if (typeElements.length > 0)
			this.type = typeElements[0].firstChild.nodeValue;
		
		var heightElements = mediaXMLNode.getElementsByTagName("height");
		if (heightElements.length > 0)
			this.height = heightElements[0].firstChild.nodeValue;
		else
			this.height = "0px";
		
		var widthElements = mediaXMLNode.getElementsByTagName("width");
		if (widthElements.length > 0)
			this.width = widthElements[0].firstChild.nodeValue;
		else
			this.width = "0px";
	}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	Media.prototype.display = function (mediaSize) {
		this.load();
				
		var html = "";
		html += "<div id='" + this.viewerElementId + "_download_link' style='position: absolute;'>";
		html += "<a";
		html += " href='" + this.url + "'>";
		html += "Download the Media";
		html += "</a>";
		html += "</div>";
		
		var destination = getElementFromDocument(this.viewerElementId + '_image');
		destination.innerHTML = html;
		
		var downloadLink = getElementFromDocument(this.viewerElementId + '_download_link');
		downloadLink.style.top = this.getCenteredY(downloadLink.offsetHeight) + "px";
		downloadLink.style.left = this.getCenteredX(downloadLink.offsetWidth) + "px";
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	Media.prototype.supportsNode = function (xmlNode) {
		alert("Error: over-ride method Media.supportsNode(xmlNode) in child class!");
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Media.prototype.load = function (mediaSize) {
		// override to cache our target if possible
	}
	
	/**
	 * unload and clear our image cache
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Media.prototype.unload = function () {
		// if we are caching, override to un-cache.
	}
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomIn = function () {
		this.zoomLevel = this.zoomLevel * this.zoomIncrement;
		this.display();
	}
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomOut = function () {
		this.zoomLevel = this.zoomLevel / this.zoomIncrement;
		this.display();
	}
	
	/**
	 * Zoom to 100% and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomToFull = function () {
		this.zoomLevel = 1;
		this.display();
	}
	
	/**
	 * Answer the height
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getHeightPx = function () {
		return pixelsToInteger(this.height);
	}
	
	/**
	 * Answer the width
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getWidthPx = function () {
		return pixelsToInteger(this.width);
	}
	
	/**
	 * Answer the height after the zoom factor is taken into account
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getZoomedHeightPx = function () {
		return this.getHeightPx() * this.zoomLevel;
	}
	
	/**
	 * Answer the width after the zoom factor is taken into account
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getZoomedWidthPx = function () {
		return this.getWidthPx() * this.zoomLevel;
	}
	
	/**
	 * Zoom to fit and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomToFit = function () {
		if (this.getHeightPx() != 0 && this.getWidthPx() != 0) {
			var targetHeight = getElementHeight(this.viewerElementId + '_image') - this.fitMargin;
			var targetWidth = getElementWidth(this.viewerElementId + '_image') - this.fitMargin;
			
			var heightRatio = targetHeight/this.getHeightPx();
			var widthRatio = targetWidth/this.getWidthPx();
			
			if (heightRatio <= widthRatio)
				this.zoomLevel = heightRatio;
			else
				this.zoomLevel = widthRatio;
			
			this.display();
		}
	}
	
	/**
	 * Answer the integer number of pixels in the X-direction to offset the 
	 * image in order to center it.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getCenteredX = function (imageWidth) {
		var targetWidth = getElementWidth(this.viewerElementId + '_image') - this.fitMargin;
		if (imageWidth == null)
			var imageWidth = this.getZoomedWidthPx();
		
		if (imageWidth > targetWidth) {
			return 0;
		} else {
			return ((targetWidth/2) - (imageWidth/2));
		}
	}
	
	/**
	 * Answer the integer number of pixels in the X-direction to offset the 
	 * image in order to center it.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getCenteredY = function (imageHeight) {
		var targetHeight = getElementHeight(this.viewerElementId + '_image') - this.fitMargin;
		if (imageHeight == null)
			var imageHeight = this.getZoomedHeightPx();
		
		if (imageHeight > targetHeight) {
			return 0;
		} else {
			return ((targetHeight/2) - (imageHeight/2));
		}
	}
	
	/**
	 * Answer the percentage that the image is scrolled in the X-direction.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getScrollXPercent = function () {
		var target = getElementFromDocument(this.viewerElementId + '_image');
		return ((target.scrollLeft + target.clientWidth/2)/target.scrollWidth);
	}
	
	/**
	 * Answer the percentage that the image is scrolled in the Y-direction.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getScrollYPercent = function () {
		var target = getElementFromDocument(this.viewerElementId + '_image');
		return ((target.scrollTop + target.clientHeight/2)/target.scrollHeight);
	}
	
	/**
	 * Set the new scroll amount so that it is the same percentage scroll as
	 * the parameter
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.setScrollXPercent = function (scrollPercent) {
		var target = getElementFromDocument(this.viewerElementId + '_image');
		target.scrollLeft = Math.round((target.scrollWidth * scrollPercent) - target.clientWidth/2);
	}
	
	/**
	 * Set the new scroll amount so that it is the same percentage scroll as
	 * the parameter
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.setScrollYPercent = function (scrollPercent) {
		var target = getElementFromDocument(this.viewerElementId + '_image');
		target.scrollTop = Math.round((target.scrollHeight * scrollPercent) - target.clientHeight/2);
	}
	
	/**
	 * Update the scroll percentage based on the the current one.
	 * "this" will be the element that onscroll was set to, so it must
	 * have its target set at the same time as the onscroll event was set.
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	updateScroll = function () {
		this._scrollTarget.scrollXPercent = this._scrollTarget.getScrollXPercent();
		this._scrollTarget.scrollYPercent = this._scrollTarget.getScrollYPercent();
	}
	
	/**
	 * Answer true if the image is larger than the target area it will go in.
	 * 
	 * @return boolean
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.isLargerThanTarget = function () {
		var targetHeight = getElementHeight(this.viewerElementId + '_image') - this.fitMargin;
		var targetWidth = getElementWidth(this.viewerElementId + '_image') - this.fitMargin;
		
		if (this.getHeightPx() < targetHeight && this.getWidthPx() < targetWidth)
			return false;
		else
			return true;
	}
	
	
