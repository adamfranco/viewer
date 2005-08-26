
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
function ImageMedia ( xmlDocument, mediaXMLNode) {
		
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
	ImageMedia.prototype.init = function ( xmlDocument, mediaXMLNode) {
		ImageMedia.superclass.init.call(this, xmlDocument, mediaXMLNode);
			
		this.startAtZoomToFit = true;
		this.image = null;
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

