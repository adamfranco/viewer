/**
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
 
TextCenterSlide.prototype = new Slide();
TextCenterSlide.prototype.constructor = TextCenterSlide;
TextCenterSlide.superclass = TextCenterSlide.prototype;

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
function TextCenterSlide ( viewerElementId, slideXmlNode) {
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
	TextCenterSlide.prototype.doDisplay = function (mediaSize) {
		this.currentMediaSize = mediaSize;
		this.load(mediaSize);
		var destination = getElementFromDocument(this.viewerElementId + '_slide');
		destination.innerHTML = "\n<div id='" + this.viewerElementId + "_slide_text' class='content' />";
		
		var textElement = getElementFromDocument(this.viewerElementId + '_slide_text');
		textElement.style.position = "absolute";
		textElement.style.left = "0px";
		textElement.style.top = "0px";
		textElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 5) + "px";
		textElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 5) + "px";
		textElement.style.overflow = "auto";
		textElement.style.paddingTop = "5px";
		textElement.style.paddingLeft = "5px";
		textElement.style.textAlign = "center";
// 		textElement.style.border = "1px solid #f00";
		
		var html = "\n<div id='" + this.viewerElementId + "_innertext'>";
		html += "\n\t<div class='slide_title'>" + this.title + "</div>";
		html += "\n\t<div class='slide_caption'>" + this.caption + "</div>";
		html += "\n</div>";
		textElement.innerHTML = html;
		
		var innertextElement = getElementFromDocument(this.viewerElementId + '_innertext');
		innertextElement.style.position = "absolute";
		var centeredTop = (getElementHeight(this.viewerElementId + '_slide_text')/2 - innertextElement.offsetHeight/2);
		if (centeredTop > 0)
			innertextElement.style.top = centeredTop + "px";
		else 
			innertextElement.style.top = "0px";
		
		var centeredLeft = (getElementWidth(this.viewerElementId + '_slide_text')/2 - innertextElement.offsetWidth/2);
		if (centeredLeft > 0)
			innertextElement.style.left = centeredLeft + "px";
		else 
			innertextElement.style.left = "0px";

	}
	