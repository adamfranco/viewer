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
function TextBottomSlide ( viewerElementId, slideXmlNode) {
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, slideXmlNode );
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
	TextBottomSlide.prototype.doDisplay = function (mediaSize) {
		this.currentMediaSize = mediaSize;
		this.load(mediaSize);
		var destination = getElementFromDocument(this.viewerElementId + '_slide');
		destination.innerHTML = "";
		
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media_buttons' class='toolbar' />";
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_slide_text' class='content' />";
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media' class='media' />";
		
		
		var imageElement = getElementFromDocument(this.viewerElementId + '_media');
		imageElement.style.position = "absolute";
		imageElement.style.left = "0px";
		imageElement.style.top = "0px";
		if (this.media.length > 1) {
			imageElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 130) + "px";
		} else {
			imageElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 100) + "px";
		}
		imageElement.style.width = getElementWidth(this.viewerElementId + '_slide') + "px";
		imageElement.style.overflow = "auto";
// 		imageElement.style.border = "1px solid #00f";		


		var mediaButtonsElement = getElementFromDocument(this.viewerElementId + '_media_buttons');
		mediaButtonsElement.style.position = "absolute";
		mediaButtonsElement.style.top = (getElementHeight(this.viewerElementId + '_slide') - 230) + "px";
		mediaButtonsElement.style.left = "0px";
		mediaButtonsElement.style.height = "30px";
		mediaButtonsElement.style.width = getElementWidth(this.viewerElementId + '_slide') + "px";
// 		mediaButtonsElement.style.border = "1px solid #0f0";

		
		var textElement = getElementFromDocument(this.viewerElementId + '_slide_text');
		textElement.style.position = "absolute";
		textElement.style.left = "0px";
		textElement.style.top = (getElementHeight(this.viewerElementId + '_slide') - 100) + "px";
		textElement.style.height = "95px";
		textElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 5) + "px";
		textElement.style.overflow = "auto";
		textElement.style.paddingTop = "5px";
		textElement.style.paddingLeft = "5px";
		textElement.style.textAlign = "center";
// 		textElement.style.border = "1px solid #f00";
		
		textElement.innerHTML = "\n<div class='slide_title'>" + this.title + "</div>";
		textElement.innerHTML += "\n<div class='slide_caption'>" + this.caption + "</div>";

		
		
		if (this.media[this.currentMediaIndex])
			this.media[this.currentMediaIndex].display(mediaSize);
		
 		this.displayMediaButtons();
	}
	