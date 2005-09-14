
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
QuicktimeMedia.prototype = new VideoMedia();
QuicktimeMedia.prototype.constructor = QuicktimeMedia;
QuicktimeMedia.superclass = VideoMedia.prototype;

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
function QuicktimeMedia ( viewerElementId, mediaXMLNode) {
		
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
	QuicktimeMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		QuicktimeMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	QuicktimeMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Quicktime MIME type
			var regex = new RegExp("^(video/quicktime)|(audio/(aac|x-aac))$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;

			if (typeElements[0].firstChild.nodeValue == "video"
				|| typeElements[0].firstChild.nodeValue == "audio") 
			{
				var urlElements = xmlNode.getElementsByTagName("url");
				var regex = new RegExp("^.+\.(mov|moov|qt|aac|adts)$", "i");
				if (regex.exec(urlElements[0].firstChild.nodeValue))
					return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Answer the height of the controls for this player
	 * 
	 * @return integer
	 * @access public
	 * @since 9/12/05
	 */
	QuicktimeMedia.prototype.getControlHeight = function () {
		return 16;
	}
	
	/**
	 * Answer the URL where the plugin can be downloaded
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	QuicktimeMedia.prototype.getPluginsPage = function () {
		return 'http://www.apple.com/quicktime/download/';
	}