
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
RealMedia.prototype = new VideoMedia();
RealMedia.prototype.constructor = RealMedia;
RealMedia.superclass = VideoMedia.prototype;

/**
 * The media class represents a RealNetworks media file in a slide.
 * For more information on the Real plugin, see:
 * http://service.real.com/help/library/guides/realone/ProductionGuide/HTML/realpgd.htm?page=htmfiles/embed.htm%23overview
 * 
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
function RealMedia ( viewerElementId, mediaXMLNode) {
		
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
	RealMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		RealMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	RealMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Quicktime MIME type
			var regex = new RegExp("^(video|audio|application)/(vnd.rn|x-pn)-real(audio|video|media)$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;

			if (typeElements[0].firstChild.nodeValue == "video"
				|| typeElements[0].firstChild.nodeValue == "audio"
				|| typeElements[0].firstChild.nodeValue == "application") 
			{
				var urlElements = xmlNode.getElementsByTagName("url");
				var regex = new RegExp("^.+\.(rm|rv|ra|ram)$", "i");
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
	RealMedia.prototype.getControlHeight = function () {
		return 66;
	}
	
	/**
	 * Answer the URL where the plugin can be downloaded
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	RealMedia.prototype.getPluginsPage = function () {
		return 'http://www.real.com/';
	}
	
	/**
	 * Answer additional attributes to add to the embed tag
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	RealMedia.prototype.getAdditionalAttras = function () {
		return "type='audio/x-pn-realaudio-plugin' controls='ImageWindow,ControlPanel,StatusBar' maintainaspect='true'";
	}