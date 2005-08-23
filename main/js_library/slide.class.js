/**
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 

/**
 * The Show is a controlling class wich maintains the order of slides and controls
 * their creation.
 * 
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
function Slide (xmlDocument, slideXmlNode) {
	this.title;
	this.caption;
	this.media = new Array();
	
	this.display = display;
	this.load = load;
	this.unload = unload;
	
	var titleElements = getElementsByPath(xmlDocument, slideXmlNode, "title");
	this.title = titleElements[0].firstChild.nodeValue;
	
	var captionElements = getElementsByPath(xmlDocument, slideXmlNode, "caption");
	this.caption = captionElements[0].firstChild.nodeValue;
	
	var mediaElements = getElementsByPath(xmlDocument, slideXmlNode, "media");
	for (var i = 0; i < mediaElements.length; i++) {
		this.media[i] = new Media( xmlDocument, mediaElements[i]);
	}
	

	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function display () {
		this.load();
		var destination = getElementFromDocument('slide');
		destination.innerHTML = "";
		
 		destination.innerHTML += "<div id='image'>The Image Goes Here</div>";
		destination.innerHTML += "\n<strong>" + this.title + "</strong>";
		destination.innerHTML += "\n<br/>" + this.caption + "";
		
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function load () {
		for (var i = 0; i < this.media.length; i++) {
			this.media[i].load();
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
		for (var i = 0; i < this.media.length; i++) {
			this.media[i].unload();
		}
	}
}