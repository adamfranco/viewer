
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
TiffMedia.prototype = new ImageMedia();
TiffMedia.prototype.constructor = TiffMedia;
TiffMedia.superclass = ImageMedia.prototype;

/**
 * The media class represents a media file in a slide. More information on 
 * embedding Tiff images in web pages can be found at:
 * 		http://www.apple.com/quicktime/tutorials/embed.html
 * 
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
function TiffMedia ( viewerElementId, mediaXMLNode) {
		
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, mediaXMLNode );
	}
}

	/**
	 * initialize our object. Necessary for proper inheritance to work.
	 * 
	 * @param object Node mediaXMLNode
	 * @return void
	 * @access public
	 * @since 8/26/05
	 */
	TiffMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		TiffMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	TiffMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Tiff MIME type
			var regex = new RegExp("^image/tiff$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;

			if (typeElements[0].firstChild.nodeValue == "image") 
			{
				var urlElements = xmlNode.getElementsByTagName("url");
				var regex = new RegExp("^.+\.(tiff|tif)$", "i");
				if (regex.exec(urlElements[0].firstChild.nodeValue))
					return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	TiffMedia.prototype.display = function (mediaSize) {
		TiffMedia.superclass.display.call(this, mediaSize);
		
		// Add a "download" link for Firefox, etc which cannot display tiffs inline
		var destination = getElementFromDocument(this.viewerElementId + '_media');
		
		var html = "<div id='" + this.viewerElementId + "_download_link' style='position: absolute;'>";
		html += "<a";
		html += " href='" + this.url + "'>";
		html += "Download the Media";
		html += "</a>";
		html += "</div>";
		
		destination.innerHTML = destination.innerHTML + html;
		
		
		// positioning
		var imageElement = getElementFromDocument(this.viewerElementId + '_image');
				
		var downloadLink = getElementFromDocument(this.viewerElementId + '_download_link');
		downloadLink.style.top = (pixelsToInteger(imageElement.style.top) + pixelsToInteger(imageElement.height)) + "px";
		downloadLink.style.left = this.getCenteredX(downloadLink.offsetWidth) + "px";
	}