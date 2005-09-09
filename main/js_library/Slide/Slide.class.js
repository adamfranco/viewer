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
function Slide (viewerElementId, xmlDocument, slideXmlNode) {
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, xmlDocument, slideXmlNode );
	}
}
	
	/**
	 * initialize our object. Necessary for proper inheritance to work.
	 * 
	 * @param object Document xmlDocument
	 * @param object Node slideXmlNode
	 * @return void
	 * @access public
	 * @since 8/26/05
	 */
	Slide.prototype.init = function ( viewerElementId, xmlDocument, slideXmlNode ) {
		this.title;
		this.caption;
		this.media = new Array();
		this.currentMediaIndex = 0;
		this.currentMediaSize;
		this.viewerElementId = viewerElementId;
		
		var titleElements = getElementsByPath(xmlDocument, slideXmlNode, "title");
		this.title = titleElements[0].firstChild.nodeValue;
		
		var captionElements = getElementsByPath(xmlDocument, slideXmlNode, "caption");
		this.caption = captionElements[0].firstChild.nodeValue;
		
		var mediaElements = getElementsByPath(xmlDocument, slideXmlNode, "media");
		for (var i = 0; i < mediaElements.length; i++) {
			this.media[i] = new MediaContainer( this.viewerElementId, xmlDocument, mediaElements[i]);
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
	Slide.prototype.display = function (mediaSize) {
		alert ("display() must be overridden by a child class of Slide.");
	}
	
	/**
	 * Redisplay the slide with the current mediaSize
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Slide.prototype.redisplay = function () {
		this.display(this.currentMediaSize);
	}
	
	/**
	 * Display the media buttons if we have more than one media item.
	 * 
	 * @return void
	 * @access public
	 * @since 8/24/05
	 */
	Slide.prototype.displayMediaButtons = function () {
		var destination = getElementFromDocument(this.viewerElementId + '_media_buttons');
		var toolbars = getElementFromDocument(this.viewerElementId + '_toolbars');
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
				
			html += "\n<input" + previousDisabled + " type='button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.previousMedia()' value='&lt;'/>";
			html += "\n<input" + nextDisabled + " type='button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.nextMedia()' value='&gt;'/>";
			
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
	Slide.prototype.load = function (mediaSize) {
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
	Slide.prototype.unload = function () {
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
	Slide.prototype.getMediaSizes = function () {
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
	Slide.prototype.nextMedia = function () {
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
	Slide.prototype.previousMedia = function () {
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
	Slide.prototype.zoomIn = function () {
		this.media[this.currentMediaIndex].zoomIn();
	}
	
	/**
	 * Zoom in on the current media
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Slide.prototype.zoomOut = function () {
		this.media[this.currentMediaIndex].zoomOut();
	}
	
	/**
	 * Zoom to 100%
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Slide.prototype.zoomToFull = function () {
		this.media[this.currentMediaIndex].zoomToFull();
	}
	
	/**
	 * Zoom to fit
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Slide.prototype.zoomToFit = function () {
		this.media[this.currentMediaIndex].zoomToFit();
	}
