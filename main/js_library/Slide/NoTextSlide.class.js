/**
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
 
NoTextSlide.prototype = new Slide();
NoTextSlide.prototype.constructor = NoTextSlide;
NoTextSlide.superclass = NoTextSlide.prototype;

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
function NoTextSlide ( viewerElementId, slideXmlNode) {
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
	NoTextSlide.prototype.display = function (mediaSize) {
		this.currentMediaSize = mediaSize;
		this.load(mediaSize);
		var destination = getElementFromDocument(this.viewerElementId + '_slide');
		destination.innerHTML = "";
		
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media_buttons' class='toolbar' />";
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media' />";

		var imageElement = getElementFromDocument(this.viewerElementId + '_media');
		imageElement.style.position = "absolute";
		imageElement.style.left = "0px";
		if (this.media.length > 1) {
			imageElement.style.top = "30px";
			imageElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 30) + "px";
		} else {
			imageElement.style.top = "0px";
			imageElement.style.height = getElementHeight(this.viewerElementId + '_slide') + "px";
		}
		imageElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 0) + "px";
		imageElement.style.overflow = "auto";
// 		imageElement.style.border = "1px solid #00f";
		
		
		var mediaButtonsElement = getElementFromDocument(this.viewerElementId + '_media_buttons');
		mediaButtonsElement.style.position = "absolute";
		mediaButtonsElement.style.top = "0px";
		mediaButtonsElement.style.left = "0px";
		mediaButtonsElement.style.height = "30px";
		mediaButtonsElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 0) + "px";
// 		mediaButtonsElement.style.border = "1px solid #0f0";
		
		
		if (this.media[this.currentMediaIndex])
			this.media[this.currentMediaIndex].display(mediaSize);
		
 		this.displayMediaButtons();
	}
	