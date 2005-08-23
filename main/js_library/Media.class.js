
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
function Media (mediaXMLNode) {
		
	this.urls = new Array ();
	this.image;
	
	this.display = display;
	this.load = load;
	this.unload = unload;
	
// 	this.type = mediaXMLNode.selectSingleNode("type");
// 	for (var i in mediaXMLNode.childNodes) {
// 		tagname = mediaXMLNode.childNodes[i].tagName;
// 		if (
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function display () {
// 		this.load();
// 		var destination = getElementFromDocument('image');
// 		destination.innerHTML = "";
// 		
//  		destination.innerHTML = "<img src='" + this.image.src + "' align='left' />";
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function load () {
		if (this.image == null) {
			this.image = new Image();
			this.image.src = this.mediaUrl;
		}
	}
	
	/**
	 * unload and clear our image cache
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function unload () {
		this.image = null;
	}
	
}

