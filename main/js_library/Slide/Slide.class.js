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
function Slide (viewerElementId, slideXmlNode) {
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, slideXmlNode );
	}
}
	
	/**
	 * initialize our object. Necessary for proper inheritance to work.
	 * 
	 * @param object Node slideXmlNode
	 * @return void
	 * @access public
	 * @since 8/26/05
	 */
	Slide.prototype.init = function ( viewerElementId, slideXmlNode ) {
		this.title;
		this.caption;
		this.media = new Array();
		this.currentMediaIndex = null;
		this.currentMediaSize;
		this.viewerElementId = viewerElementId;
		
		// If we are passed a source attribute in the slideXmlNode,
		// then our current slideXmlNode is just a skeleton and we need to
		// asynchronously load the document at the 'source' and populate
		// our properties from it when we are asked to load.
		if (slideXmlNode.attributes.source && slideXmlNode.attributes.source.value) {
			this.source = slideXmlNode.attributes.source.value;
		}
		// We have the full slide info in our current slide node
		else {
			this.initFromXml (slideXmlNode);
		}
	}
	
	/**
	 * Initialize this slide from an xml Node
	 * 
	 * @param object Node slideXmlNode
	 * @return void
	 * @access public
	 * @since 12/16/05
	 */
	Slide.prototype.initFromXml = function ( slideXmlNode ) {
		var titleElements = slideXmlNode.getElementsByTagName("title");
		this.title = titleElements[0].firstChild.nodeValue;
		
		var captionElements = slideXmlNode.getElementsByTagName("caption");
		this.caption = "";
		for (var i = 0; i < captionElements[0].childNodes.length; i++) {
			this.caption += captionElements[0].childNodes.item(i).nodeValue;
		}
		
		var mediaElements = slideXmlNode.getElementsByTagName("media");
		if (mediaElements.length > 0)
			this.currentMediaIndex = 0;
		for (var i = 0; i < mediaElements.length; i++) {
			this.media[i] = new MediaContainer( this.viewerElementId, mediaElements[i]);
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
		if (this.source)
			this.loadXMLDoc(this.source, mediaSize, true);
		else
			this.doDisplay(mediaSize);
	}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	Slide.prototype.doDisplay = function (mediaSize) {
		alert ("doDisplay() must be overridden by a child class of Slide.");
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
			destination.style.verticalAlign = "center";
			destination.style.textAlign = "center";
			destination.style.paddingTop = "1px";
			destination.style.height = "29px";
			
			
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
				
			html += "\n<button" + previousDisabled + " class='button previous_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.previousMedia()' title='Previous Media'>&lt;</button>";
			html += "\n<button" + nextDisabled + " class='button next_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.nextMedia()' title='Next Media'>&gt;</button>";
			
			destination.innerHTML = html;
		} else {
			destination.style.display = "none";
		}
	}
	
	/**
	 * Load the XML document and set the callback to process when loading
	 * state changes.
	 *
	 * From: http://developer.apple.com/internet/webcontent/xmlhttpreq.html
	 * 
	 * @param string url
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	Slide.prototype.loadXMLDoc = function (url, mediaSize, doDisplay) {
		// Define a variable to point at this slide that will be in the
		// scope of the request-processing function, since 'this' will (at that
		// point) be that function.
		var slide = this;
					
		// branch for native XMLHttpRequest object (Mozilla, Safari, etc)
		if (window.XMLHttpRequest)
			var req = new XMLHttpRequest();
			
		// branch for IE/Windows ActiveX version
		else if (window.ActiveXObject)
			var req = new ActiveXObject("Microsoft.XMLHTTP");
		
		
		if (req) {
			req.onreadystatechange = function () {
				// For some reason IE6 fails if the 'var' is not
				// placed before working.
				var working = getElementFromDocument(slide.viewerElementId + '_loading');
				if (req.readyState > 0 && req.readyState < 4) {
					working.style.display = 'inline';
				} else {
					working.style.display = 'none';
				}
						
				// only if req shows "loaded"
				if (req.readyState == 4) {
					// only if we get a good load should we continue.
					if (req.status == 200) {
						slide.initFromXml(req.responseXML.documentElement);
						slide.source = null;
						slide.loadMedia(mediaSize);
						if (doDisplay) {
							slide.display(mediaSize);
						}
					} else {
						alert("There was a problem retrieving the XML data:\n" +
							req.statusText);
					}
				}
			}
			
			req.open("GET", url, true);
			req.send(null);
		}
	}	
	
	/**
	 * Load and cache the image Or initiate loading of the Slide XML
	 * and then the media.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Slide.prototype.load = function (mediaSize) {
		if (this.source)
			this.loadXMLDoc(this.source, mediaSize, false);
		else
			this.loadMedia(mediaSize);
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Slide.prototype.loadMedia = function (mediaSize) {
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
	 * Advance to the next media and display it.
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
	 * Answer true if there is a next media
	 * 
	 * @return boolean
	 * @access public
	 * @since 8/23/05
	 */
	Slide.prototype.hasNextMedia = function () {
		if (this.currentMediaIndex < (this.media.length - 1))
			return true;
		else
			return false;
	}
	
	/**
	 * Go back to the previous media and display it.
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
	 * Go back to the first media and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Slide.prototype.goToFirstMedia = function () {
		this.currentMediaIndex = 0;
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
		if (this.currentMediaIndex != null)
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
		if (this.currentMediaIndex != null)
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
		if (this.currentMediaIndex != null)
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
		if (this.currentMediaIndex != null)
			this.media[this.currentMediaIndex].zoomToFit();
	}
	
	/**
	 * Clear the zoom levels of the media
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Slide.prototype.resetZoom = function () {
		for (var i = 0; i < this.media.length; i++) {
			this.media[i].resetZoom();
		}
	}
