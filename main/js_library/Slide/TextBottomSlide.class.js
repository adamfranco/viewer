/**
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
 
TextBottomSlide.prototype = new Slide();
TextBottomSlide.prototype.constructor = TextBottomSlide;
TextBottomSlide.superclass = TextBottomSlide.prototype;

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
function TextBottomSlide (xmlDocument, slideXmlNode) {
	if ( arguments.length > 0 ) {
		this.init( xmlDocument, slideXmlNode );
	}
}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	TextBottomSlide.prototype.display = function (mediaSize) {
		this.currentMediaSize = mediaSize;
		this.load(mediaSize);
		var destination = getElementFromDocument('slide');
		destination.innerHTML = "";
		
		destination.innerHTML += "\n<div id='media_buttons' class='toolbar' />";
		destination.innerHTML += "\n<div id='slide_text' class='content' />";
		destination.innerHTML += "\n<div id='image' />";
		
		
		var imageElement = getElementFromDocument('image');
		imageElement.style.position = "absolute";
		imageElement.style.left = "0px";
		imageElement.style.top = "0px";
		if (this.media.length > 1) {
			imageElement.style.height = (getElementHeight('slide') - 230) + "px";
		} else {
			imageElement.style.height = (getElementHeight('slide') - 200) + "px";
		}
		imageElement.style.width = getElementWidth('slide') + "px";
		imageElement.style.overflow = "scroll";
// 		imageElement.style.border = "1px solid #00f";		


		var mediaButtonsElement = getElementFromDocument('media_buttons');
		mediaButtonsElement.style.position = "absolute";
		mediaButtonsElement.style.top = (getElementHeight('slide') - 230) + "px";
		mediaButtonsElement.style.left = "0px";
		mediaButtonsElement.style.height = "30px";
		mediaButtonsElement.style.width = getElementWidth('slide') + "px";
// 		mediaButtonsElement.style.border = "1px solid #0f0";

		
		var textElement = getElementFromDocument('slide_text');
		textElement.style.position = "absolute";
		textElement.style.left = "0px";
		textElement.style.top = (getElementHeight('slide') - 200) + "px";
		textElement.style.height = "195px";
		textElement.style.width = getElementWidth('slide') + "px";
		textElement.style.overflow = "scroll";
		textElement.style.paddingTop = "5px";
		textElement.style.paddingLeft = "5px";
// 		textElement.style.border = "1px solid #f00";
		
		textElement.innerHTML = "\n<strong>" + this.title + "</strong>";
		textElement.innerHTML += "\n<br/>" + this.caption + "";

		
		
		this.media[this.currentMediaIndex].display(mediaSize);
 		this.displayMediaButtons();
	}
	