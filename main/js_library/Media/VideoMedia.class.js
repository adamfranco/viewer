
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
VideoMedia.prototype = new Media();
VideoMedia.prototype.constructor = VideoMedia;
VideoMedia.superclass = Media.prototype;

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
function VideoMedia ( viewerElementId, mediaXMLNode) {
		
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
	VideoMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		VideoMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	VideoMedia.prototype.supportsNode = function (xmlNode) {
		return false;
	}