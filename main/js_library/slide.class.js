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
		destination.innerHTML = "";
		
		destination.innerHTML += "\n<div id='media_buttons' class='toolbar' />";
		destination.innerHTML += "\n<div id='slide_text' class='content' />";
		destination.innerHTML += "\n<div id='image' />";
		
		var mediaButtonsElement = getElementFromDocument('media_buttons');
		mediaButtonsElement.style.position = "absolute";
		mediaButtonsElement.style.top = "0px";
		mediaButtonsElement.style.left = "200px";
		mediaButtonsElement.style.height = "30px";
		mediaButtonsElement.style.width = (getElementWidth('slide') - 200) + "px";
// 		mediaButtonsElement.style.border = "1px solid #0f0";

		
		var textElement = getElementFromDocument('slide_text');
		textElement.style.position = "absolute";
		textElement.style.left = "0px";
		textElement.style.top = "0px";
		textElement.style.height = (getElementHeight('slide') - 5) + "px";
		textElement.style.width = "195px";
		textElement.style.overflow = "scroll";
		textElement.style.paddingTop = "5px";
		textElement.style.paddingLeft = "5px";
// 		textElement.style.border = "1px solid #f00";
		
		textElement.innerHTML = "\n<strong>" + this.title + "</strong>";
		textElement.innerHTML += "\n<br/>" + this.caption + "";
		
		
		var imageElement = getElementFromDocument('image');
		imageElement.style.position = "absolute";
		imageElement.style.left = "200px";
		if (this.media.length > 1) {
			imageElement.style.top = "30px";
			imageElement.style.height = (getElementHeight('slide') - 30) + "px";
		} else {
			imageElement.style.top = "0px";
			imageElement.style.height = getElementHeight('slide') + "px";
		}
		imageElement.style.width = (getElementWidth('slide') - 200) + "px";
		imageElement.style.overflow = "scroll";
// 		imageElement.style.border = "1px solid #00f";
		
		
		this.media[this.currentMediaIndex].display(mediaSize);
 		this.displayMediaButtons();
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