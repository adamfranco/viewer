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
	this.currentMediaSize;
	
	this.display = display;
	this.redisplay = redisplay;
	this.load = load;
	this.unload = unload;
	this.getMediaSizes = getMediaSizes;
	this.displayMediaButtons = displayMediaButtons;
	this.nextMedia = nextMedia;
	this.previousMedia = previousMedia;
	this.zoomIn = zoomIn;
	this.zoomOut = zoomOut;
	this.zoomToFull = zoomToFull;
	this.zoomToFit = zoomToFit;
	
	
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
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function display (mediaSize) {
		this.currentMediaSize = mediaSize;
		this.load(mediaSize);
		var destination = getElementFromDocument('slide');
		var html = "";
		
// 		html += "\n<div id='media_buttons' class='toolbar'";
// 		html += " style='";
// 			html += " position: absolute;";
// 			html += " height: 30px;";
// 			html += " width: " + getElementWidth('slide') + "px;";
// 			html += " border: 1px solid #0f0;";
// 		html += "' />";

		
		html += "\n<div id='slide_text' class='content'";
		html += " style='";
			html += " overflow: scroll;";
			html += " position: absolute;";
			html += " height: " + (getElementHeight('slide') - 30) + "px;";
			html += " width: 200px;";
			html += " border: 1px solid #f00;";
			html += " top: 30px;";
			html += " left: 0px;";
		html += "'>";
		
		html += "\n<strong>" + this.title + "</strong>";
		html += "\n<br/>" + this.caption + "";
		html += "\n</div>";

 		 		
 		html += "\n<div id='image' class='content'";
 		html += " style='";
 			html += " overflow: scroll;";
 			html += " position: absolute;";
 			html += " height: " + (getElementHeight('slide') - 30) + "px;";
 			html += " width: " + (getElementWidth('slide') - 200) + "px;";
 			html += " border: 1px solid #00f;";
 			html += " top: 30px;";
			html += " left: 200px;";
			
 		html += "' />";
		
		destination.innerHTML = html;
		
		this.media[this.currentMediaIndex].display(mediaSize);
// 		this.displayMediaButtons();
	}
	
	/**
	 * Redisplay the slide with the current mediaSize
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function redisplay () {
		this.display(this.currentMediaSize);
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
			var html = "Media Number: ";
			html += (this.currentMediaIndex + 1);
			html += " of: ";
			html += this.media.length;
			
			var previousDisabled = "";
			var nextDisabled = "";
			if (this.currentMediaIndex <= 0)
				previousDisabled = " disabled='disabled'";
			if (this.currentMediaIndex >= (this.media.length - 1))
				nextDisabled = " disabled='disabled'";
				
			html += "\n<input" + previousDisabled + " type='button' onclick='Javascript:slideShow.previousMedia()' value='&lt;'/>";
			html += "\n<input" + nextDisabled + " type='button' onclick='Javascript:slideShow.nextMedia()' value='&gt;'/>";
			
			destination.innerHTML = html;
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
		this.redisplay();
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
		this.redisplay();
	}
	
	/**
	 * Zoom in on the current media
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomIn () {
		this.media[this.currentMediaIndex].zoomIn();
	}
	
	/**
	 * Zoom in on the current media
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomOut () {
		this.media[this.currentMediaIndex].zoomOut();
	}
	
	/**
	 * Zoom to 100%
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomToFull () {
		this.media[this.currentMediaIndex].zoomToFull();
	}
	
	/**
	 * Zoom to fit
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomToFit () {
		this.media[this.currentMediaIndex].zoomToFit();
	}
}