
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
			if (typeElements[0].firstChild.nodeValue == 'image')
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
 		html += " src='" + this.image.src + "'";
 		html += " height='" + (pixelsToInteger(this.height) * this.zoomLevel) + "px'";
 		html += " width='" + (pixelsToInteger(this.width) * this.zoomLevel) + "px'";
 		html += " style='position: absolute; top: " + this.getCenteredY() + "px; left: " + this.getCenteredX() + "px;' />";
 		
		var destination = getElementFromDocument(this.viewerElementId + '_image');
		destination.innerHTML = html;
		
		destination._scrollTarget = this;
		destination.onscroll = updateScroll;
		
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

