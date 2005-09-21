
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
VideoMedia.prototype = new Media();
VideoMedia.prototype.constructor = VideoMedia;
VideoMedia.superclass = Media.prototype;

/**
 * The media class represents a media file in a slide.
 * 
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
function VideoMedia ( viewerElementId, mediaXMLNode) {
		
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
	VideoMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		VideoMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
		
		this.startAtZoomToFit = true;
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	VideoMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Quicktime MIME type
			var regex = new RegExp("^(video|audio)(/.+)?$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;

			if (typeElements[0].firstChild.nodeValue == "video"
				|| typeElements[0].firstChild.nodeValue == "audio") 
			{
				var urlElements = xmlNode.getElementsByTagName("url");
				var regex = new RegExp("^.+\.(mov|moov|qt|aac|adts)$", "i");
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
	VideoMedia.prototype.display = function (mediaSize) {
		this.load();
		
		// If we haven't displayed this media yet, zoom to fit.
		if (this.startAtZoomToFit != null) {
			this.startAtZoomToFit = null;
			if (this.isLargerThanTarget()) {
				this.zoomToFit();
				return;
			}
		}
		
		
		// Write the elements
		var html = "";
		html += "<embed id='" + this.viewerElementId + "_video' style='position: absolute;'";
		html += " scale='tofit'";
		html += " autoplay='false'";
		if (this.getPluginsPage())
	 		html += " pluginspage='" + this.getPluginsPage() + "'";
	 	if (this.getAdditionalAttras())
	 		html += " " + this.getAdditionalAttras();
		html += " src='" + this.url + "'";
		html += " href='" + this.url + "'";
		html += " width='" + this.getZoomedWidthPx() + "px'";
		html += " height='" + (this.getZoomedHeightPx() + this.getControlHeight()) + "px'";
		html += " />";
		
		html += "<div id='" + this.viewerElementId + "_download_link' style='position: absolute;'>";
		html += "<a";
		html += " href='" + this.url + "'>";
		html += "Download the Media";
		html += "</a>";
		html += "</div>";
		
		var destination = getElementFromDocument(this.viewerElementId + '_media');
		destination.innerHTML = html;
		
		
		// positioning
		var videoElement = getElementFromDocument(this.viewerElementId + '_video');
		if (this.getCenteredY() > (this.getControlHeight()/2))
			videoElement.style.top = (this.getCenteredY() - (this.getControlHeight()/2)) + "px";
		else
			videoElement.style.top = "0px";
		videoElement.style.left = this.getCenteredX() + "px";
				
		var downloadLink = getElementFromDocument(this.viewerElementId + '_download_link');
		downloadLink.style.top = (pixelsToInteger(videoElement.style.top) + pixelsToInteger(videoElement.height)) + "px";
		downloadLink.style.left = this.getCenteredX(downloadLink.offsetWidth) + "px";
		
		
		// Scroll positioning.
		destination._scrollTarget = this;
		destination.onscroll = updateScroll;
		
		this.setScrollXPercent(this.scrollXPercent);
		this.setScrollYPercent(this.scrollYPercent);
	}
	
	/**
	 * Answer the height of the controls for this player.
	 * 
	 * @return integer
	 * @access public
	 * @since 9/12/05
	 */
	VideoMedia.prototype.getControlHeight = function () {
		// A nice default value, over-ride for specific players.
		return 25;
	}
	
	/**
	 * Answer the URL where the plugin can be downloaded
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	VideoMedia.prototype.getPluginsPage = function () {
		return false;
	}
	
	/**
	 * Answer additional attributes to add to the embed tag
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	VideoMedia.prototype.getAdditionalAttras = function () {
		return false;
	}
	
	/**
	 * Answer the width, with a non-zero default.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	VideoMedia.prototype.getWidthPx = function () {
		var px = pixelsToInteger(this.width);
		if (px > 0)
			return px;
		else
			return 100;
	}
	
	/**
	 * Clear the zoom level.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	VideoMedia.prototype.resetZoom = function () {
		// Do nothing. Override in children that can zoom.
		this.startAtZoomToFit = true;
		this.zoomLevel = 1;
	}