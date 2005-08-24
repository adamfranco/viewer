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
	this.currentMediaIndex = 0;
	
	this.display = display;
	this.load = load;
	this.unload = unload;
	this.getMediaSizes = getMediaSizes;
	this.displayMediaButtons = displayMediaButtons;
	this.nextMedia = nextMedia;
	this.previousMedia = previousMedia;
	
	
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
	function display (mediaSize) {
		this.load(mediaSize);
		var destination = getElementFromDocument('slide');
		destination.innerHTML = "";
		
		destination.innerHTML += "\n<div id='media_buttons' class='toolbar'/>";
 		destination.innerHTML += "\n<div id='image' class='content'>The Image Goes Here</div>";
		destination.innerHTML += "\n<div id='slide_text' class='content'>";
		destination.innerHTML += "\n<strong>" + this.title + "</strong>";
		destination.innerHTML += "\n<br/>" + this.caption + "";
		destination.innerHTML += "\n</div>";
		
		this.media[this.currentMediaIndex].display(mediaSize);
		this.displayMediaButtons();
	}
	
	/**
	 * Display the media buttons if we have more than one media item.
	 * 
	 * @return void
	 * @access public
	 * @since 8/24/05
	 */
	function displayMediaButtons () {
		var destination = getElementFromDocument('media_buttons');
		var toolbars = getElementFromDocument('toolbars');
		if (this.media.length > 1) {
			destination.style.display = "block";
			destination.innerHTML = "Media Number: ";
			destination.innerHTML += (this.currentMediaIndex + 1);
			destination.innerHTML += " of: ";
			destination.innerHTML += this.media.length;
			
			var previousDisabled = "";
			var nextDisabled = "";
			if (this.currentMediaIndex <= 0)
				previousDisabled = " disabled='disabled'";
			if (this.currentMediaIndex >= (this.media.length - 1))
				nextDisabled = " disabled='disabled'";
				
			destination.innerHTML += "\n<input" + previousDisabled + " type='button' onclick='Javascript:slideShow.previousMedia()' value='&lt;'/>";
			destination.innerHTML += "\n<input" + nextDisabled + " type='button' onclick='Javascript:slideShow.nextMedia()' value='&gt;'/>";
		} else {
			destination.style.display = "none";
		}
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function load (mediaSize) {
		for (var i = 0; i < this.media.length; i++) {
			this.media[i].load(mediaSize);
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
	
	/**
	 * Answer the availible sizes of media
	 * 
	 * @return array
	 * @access public
	 * @since 8/24/05
	 */
	function getMediaSizes () {
		var sizes = new Array();
		for (var i = 0; i < this.media.length; i++) {
			sizes = sizes.concat(this.media[i].getMediaSizes());
		}
		
		return arrayUnique(sizes);
	}
	
	/**
	 * Advance to the next slide and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function nextMedia () {
		this.currentMediaIndex++;
	}
	
	/**
	 * Go back to the previous slide and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function previousMedia () {
		this.currentMediaIndex--;
	}
}