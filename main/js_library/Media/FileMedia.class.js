
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
FileMedia.prototype = new Media();
FileMedia.prototype.constructor = FileMedia;
FileMedia.superclass = Media.prototype;

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
function FileMedia ( viewerElementId, xmlDocument, mediaXMLNode) {
		
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, xmlDocument, mediaXMLNode );
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
	FileMedia.prototype.init = function ( viewerElementId, xmlDocument, mediaXMLNode) {
		FileMedia.superclass.init.call(this, viewerElementId, xmlDocument, mediaXMLNode);
	}