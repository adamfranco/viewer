
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
AudioMedia.prototype = new Media();
AudioMedia.prototype.constructor = AudioMedia;
AudioMedia.superclass = Media.prototype;

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
function AudioMedia ( viewerElementId, mediaXMLNode) {
		
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
	AudioMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		AudioMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}