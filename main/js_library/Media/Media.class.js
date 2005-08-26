
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
	if ( arguments.length > 0 ) {
		this.init( xmlDocument, mediaXMLNode );
	}
}

	/**
	 * initialize our object. Necessary for proper inheritance to work.
	 * 
	 * @param object Document xmlDocument
	 * @param object Node mediaXMLNode
	 * @return void
	 * @access public
	 * @since 8/26/05
	 */
	Media.prototype.init = function ( xmlDocument, mediaXMLNode) {
		
		this.zoomLevel = 1;
		this.zoomIncrement = 1.25;
		this.fitMargin = 20;		
				
		var urlElements = getElementsByPath(xmlDocument, mediaXMLNode, "url");
		if (urlElements.length > 0)
			this.url = urlElements[0].firstChild.nodeValue;
		
		var typeElements = getElementsByPath(xmlDocument, mediaXMLNode, "type");
		if (typeElements.length > 0)
			this.type = typeElements[0].firstChild.nodeValue;
		
		var heightElements = getElementsByPath(xmlDocument, mediaXMLNode, "height");
		if (heightElements.length > 0)
			this.height = heightElements[0].firstChild.nodeValue;
		
		var widthElements = getElementsByPath(xmlDocument, mediaXMLNode, "width");
		if (widthElements.length > 0)
			this.width = widthElements[0].firstChild.nodeValue;
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
		html += "<div style='position: absolute; top: " + this.getCenteredY() + "px; left: " + this.getCenteredX() + "px;'>";
		html += "<a";
		html += " href='" + this.url + "'>";
		html += "Download the Media";
		html += "</a>";
		html += "</div>";
		
		var destination = getElementFromDocument('image');
		destination.innerHTML = html;
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
	 * Zoom to fit and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomToFit = function () {
		var targetHeight = getElementHeight('image') - this.fitMargin;
		var targetWidth = getElementWidth('image') - this.fitMargin;
		var imageHeight = pixelsToInteger(this.height);
		var imageWidth = pixelsToInteger(this.width);
		
		var heightRatio = targetHeight/imageHeight;
		var widthRatio = targetWidth/imageWidth;
		
		if (heightRatio <= widthRatio)
			this.zoomLevel = heightRatio;
		else
			this.zoomLevel = widthRatio;
		
		this.display();
	}
	
	/**
	 * Answer the integer number of pixels in the X-direction to offset the 
	 * image in order to center it.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getCenteredX = function () {
		var targetWidth = getElementWidth('image') - this.fitMargin;
		var imageWidth = pixelsToInteger(this.width) * this.zoomLevel;
		
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
	Media.prototype.getCenteredY = function () {
		var targetHeight = getElementHeight('image') - this.fitMargin;
		var imageHeight = pixelsToInteger(this.height) * this.zoomLevel;
		
		if (imageHeight > targetHeight) {
			return 0;
		} else {
			return ((targetHeight/2) - (imageHeight/2));
		}
	}
	
	/**
	 * Answer true if the image is larger than the target area it will go in.
	 * 
	 * @return boolean
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.isLargerThanTarget = function () {
		var targetHeight = getElementHeight('image') - this.fitMargin;
		var targetWidth = getElementWidth('image') - this.fitMargin;
		var imageHeight = pixelsToInteger(this.height);
		var imageWidth = pixelsToInteger(this.width);
		
		if (imageHeight < targetHeight && imageWidth < targetWidth)
			return false;
		else
			return true;
	}
	
	
