
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
WindowsMediaMedia.prototype = new VideoMedia();
WindowsMediaMedia.prototype.constructor = WindowsMediaMedia;
WindowsMediaMedia.superclass = VideoMedia.prototype;

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
function WindowsMediaMedia ( viewerElementId, mediaXMLNode) {
		
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
	WindowsMediaMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		WindowsMediaMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	WindowsMediaMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Quicktime MIME type
			var regex = new RegExp("^(video|audio)(/x-ms-[a-z]{2,3})?$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;

			if (typeElements[0].firstChild.nodeValue == "video"
				|| typeElements[0].firstChild.nodeValue == "audio") 
			{
				var urlElements = xmlNode.getElementsByTagName("url");
				var regex = new RegExp("^.+\.(asf|asx|wma|wmv|wax|wvx|wm|wmz|wmd)$", "i");
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
	WindowsMediaMedia.prototype.getControlHeight = function () {
		return 46;
	}
	
	/**
	 * Answer the URL where the plugin can be downloaded
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	WindowsMediaMedia.prototype.getPluginsPage = function () {
		return 'http://www.microsoft.com/Windows/MediaPlayer/';
	}