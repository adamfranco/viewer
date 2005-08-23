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
function Slide (slideXMLNode) {
	this.title;
	this.caption;
	this.mediaUrl;
	this.image;
	
	this.display = display;
	this.load = load;
	this.unload = unload;
	
	for (j=0; j < slideXMLNode.childNodes.length; j++) {
		tagname = slideXMLNode.childNodes[j].tagName;
		switch (tagname) {
			case 'title':
				if (slideXMLNode.childNodes[j].firstChild != null)
					this.title = slideXMLNode.childNodes[j].firstChild.nodeValue;
				break;
			case 'caption':
				if (slideXMLNode.childNodes[j].firstChild != null)
					this.caption = slideXMLNode.childNodes[j].firstChild.nodeValue;
				break;
			case 'mediaUrl':
				if (slideXMLNode.childNodes[j].firstChild != null)
					this.mediaUrl = slideXMLNode.childNodes[j].firstChild.nodeValue;
				break;
		}
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
		destination = getElementFromDocument('slide');
		
		destination.innerHTML = "<img src='" + this.image.src + "' align='left' />";
		destination.innerHTML += "\n<strong>" + this.title + "</strong>";
		destination.innerHTML += "\n<br/>" + this.caption + "";
		destination.innerHTML += "\n<br/><em>" + this.image.src + "</em>";
		
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