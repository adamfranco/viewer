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
function SlideShow () {
	var req;
	this.slides;
	this.currentIndex = 0;
	this.mediaSize = 'original';
	this.title = 'SlideShow';
	this.showPlaybackToolbar = true;
	this.playing = false;
	this.slide_delay = 3;
	this.loop = false;
	
	
	var me = this;
	this.loadXMLDoc = loadXMLDoc;
	this.display = display;
	this.next = next;
	this.hasNext = hasNext;
	this.previous = previous;
	this.toStart = toStart;
	this.toEnd = toEnd;
	this.play = play;
	this.playAdvance = playAdvance;
	this.pause = pause;
	this.changeDelay = changeDelay;
	this.processReqChange = processReqChange;
	this.createSlides = createSlides;
	this.cacheAround = cacheAround;
	this.getMediaSizes = getMediaSizes;
	this.changeMediaSize = changeMediaSize;
	this.nextMedia = nextMedia;
	this.previousMedia = previousMedia;
	this.zoomIn = zoomIn;
	this.zoomOut = zoomOut;
	this.zoomToFull = zoomToFull;
	this.zoomToFit = zoomToFit;
	this.getViewerHeight = getViewerHeight;
	this.getViewerWidth = getViewerWidth;
	this.getToolbarHeight = getToolbarHeight;
	
	// Attach ourselves to the View obect for later referencing from static
	// methods.
	var viewerElement = getElementFromDocument('viewer');
	viewerElement._slideShow = this;
	
	// Write our main div elements
	var viewerElement = getElementFromDocument('viewer');
	viewerElement.innerHTML = "";
	viewerElement.innerHTML += "\n<div id='toolbars' class='toolbar' />";
	viewerElement.innerHTML += "\n<div id='slide' />";
	viewerElement.innerHTML += "\n<span id='loading' class='hidden'>loading...</span>";
// 	viewerElement.style.overflow = 'hidden';
	
	var toolbarsElement = getElementFromDocument('toolbars');
	toolbarsElement.style.height =  this.getToolbarHeight() + "px";
	toolbarsElement.style.width =  this.getViewerWidth() + "px";
	toolbarsElement.style.position = "absolute";
	toolbarsElement.style.left = "0px";
	toolbarsElement.style.top = "0px";
	
	var slideElement = getElementFromDocument('slide');
	slideElement.style.height =  (this.getViewerHeight() - this.getToolbarHeight())  + "px";
	slideElement.style.width =  this.getViewerWidth() + "px";
	slideElement.style.position = "absolute";
	slideElement.style.left = "0px";
	slideElement.style.top = this.getToolbarHeight() + "px";
	
		
	/**
	 * Load the XML document and set the callback to process when loading
	 * state changes.
	 *
	 * From: http://developer.apple.com/internet/webcontent/xmlhttpreq.html
	 * 
	 * @param string url
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function loadXMLDoc (url) {
		// branch for native XMLHttpRequest object
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			req.onreadystatechange = processReqChange;
			req.open("GET", url, true);
			req.send(null);
		// branch for IE/Windows ActiveX version
		} else if (window.ActiveXObject) {
			req = new ActiveXObject("Microsoft.XMLHTTP");
			if (req) {
				req.onreadystatechange = me.processReqChange;
				req.open("GET", url, true);
				req.send();
			}
		}
	}

	/**
	 * Process the XMLHTTP input when the loading state changes.
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function processReqChange () {

		// For some reason IE6 fails if the 'var' is not
		// placed before working.
		var working = getElementFromDocument('loading');
		if (req.readyState > 0 && req.readyState < 4) {
			working.className = 'shown';
		} else {
			working.className = 'hidden';
		}
				
		// only if req shows "loaded"
		if (req.readyState == 4) {
			// only if we get a good load should we continue.
			if (req.status == 200) {
				me.createSlides(req.responseXML);
			} else {
				alert("There was a problem retrieving the XML data:\n" +
					req.statusText);
			}
		}
	}	
	
	/**
	 * Create slide objects each with their own xml chunk which defines their
	 * content.
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function createSlides ( xmlDocument ) {		
		var titleElements = getElementsByPath(xmlDocument, xmlDocument, "slideshow/title");
		if (titleElements.length > 0) {
			this.title = titleElements[0].firstChild.nodeValue;
			document.title = this.title;
		}
		
		var slideElements = getElementsByPath(xmlDocument, xmlDocument, "slideshow/slide");
		this.slides = new Array(slideElements.length);
		for (var i = 0; i < slideElements.length; i++) {
			var positionElements = getElementsByPath(xmlDocument, slideElements[i], "text-position");
			if (positionElements[0])
				var position = positionElements[0].firstChild.nodeValue;
			else
				var position = null;
			
			if (position == 'right')
	 			this.slides[i] = new TextRightSlide(xmlDocument, slideElements[i]);
	 		else if (position == 'bottom')
	 			this.slides[i] = new TextBottomSlide(xmlDocument, slideElements[i]);
	 		else if (position == 'top')
	 			this.slides[i] = new TextTopSlide(xmlDocument, slideElements[i]);
	 		else
	 			this.slides[i] = new TextLeftSlide(xmlDocument, slideElements[i]);
		}
		this.display();
		this.cacheAround(this.currentIndex);
	}
	
	/**
	 * Display the current slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function display () {		
		var destination = getElementFromDocument('toolbars');
		var html = "";
		
		// Main Tool Bar
		html += "\n<div id='main_toolbar' style='padding: 2px; text-align: center; width: " + destination.style.width + "; border: 0px solid #0f0'>";
			
		// Next/Previous buttons
		var previousDisabled = "";
		var nextDisabled = "";
		if (this.currentIndex <= 0)
			previousDisabled = " disabled='disabled'";
		if (this.currentIndex >= (this.slides.length - 1))
			nextDisabled = " disabled='disabled'";
			
		html += "\n<input" + previousDisabled + " type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.toStart()' value='&lt;&lt;'/>";
		html += "\n<input" + previousDisabled + " type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.previous()' value='&lt;'/>";
		html += "\n<input" + nextDisabled + " type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.next()' value='&gt;'/>";
		html += "\n<input" + nextDisabled + " type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.toEnd()' value='&gt;&gt;'/>";
		
		
		html += "\n &nbsp;&nbsp; " + (this.currentIndex + 1);
		html += " of " + this.slides.length + " &nbsp;&nbsp; ";
		
		// Media size selection
		var sizes = this.getMediaSizes();
		var selected;
		html += "\nSize: <select id='media_size' onchange='Javascript:getElementFromDocument(\"viewer\")._slideShow.changeMediaSize()'>";
		for (var i = 0; i < sizes.length; i++) {
			if (this.mediaSize == sizes[i]) {
				selected = " selected='selected'";
			} else {
				selected = '';
			}
			html += "\n\t<option value='" + sizes[i] + "'" + selected + ">" + sizes[i] + "</option>";
		}
		html += "\n</select> &nbsp;&nbsp; ";
				
		
		// Zoom Buttons
		html += " \n<input type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.zoomIn()' value='+'/>";
		html += "\n<input type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.zoomOut()' value='-'/>";
		html += " \n<input type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.zoomToFull()' value='100%'/>";
		html += "\n<input type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.zoomToFit()' value='&lt;--&gt;'/>";
		
		
		html += "\n</div>";
		
		
		
		if (this.showPlaybackToolbar == true) {
			// Slideshow playing controls
			html += "\n<div id='playback_toolbar' style='padding: 2px; text-align: center; width: " + destination.style.width + "; border: 0px solid #0f0'>";
			
			if (this.playing == true) {
				html += " \n<input id='play_button' type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.play()' value='|&gt;' disabled='disabled'/>";
				html += " \n<input id='pause_button' type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.pause()' value='||'/>";
			} else {
				html += " \n<input id='play_button' type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.play()' value='|&gt;'/>";
				html += " \n<input id='pause_button' type='button' onclick='Javascript:getElementFromDocument(\"viewer\")._slideShow.pause()' value='||' disabled='disabled'/>";
			}
			
			// Media size selection
			html += " Delay: ";
			var selected;
			html += "\n<select id='slide_delay' onchange='Javascript:getElementFromDocument(\"viewer\")._slideShow.changeDelay()'>";
			for (var i = 1; i <= 10; i++) {
				if (this.slide_delay == i) {
					selected = " selected='selected'";
				} else {
					selected = '';
				}
				html += "\n\t<option value='" + i + "'" + selected + ">" + i + "s</option>";
			}
			for (var i = 15; i <= 45; i=i+15) {
				if (this.slide_delay == i) {
					selected = " selected='selected'";
				} else {
					selected = '';
				}
				html += "\n\t<option value='" + i + "'" + selected + ">" + i + "s</option>";
			}
			for (var i = 60; i <= 600; i=i+60) {
				if (this.slide_delay == i) {
					selected = " selected='selected'";
				} else {
					selected = '';
				}
				html += "\n\t<option value='" + i + "'" + selected + ">" + (i/60) + "m</option>";
			}
			html += "\n</select>";
			
			html += "\n</div>";
		}
		
		destination.innerHTML = html;
		
		// display the size
		this.slides[this.currentIndex].display(this.mediaSize);
	}
	
	/**
	 * Advance to the next slide and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function next () {
		if (this.currentIndex < (this.slides.length - 1)) {
			this.currentIndex++;
		} else if (this.loop == true) {
			this.currentIndex = 0;
		}
		
		this.display();
		this.cacheAround(this.currentIndex);
	}
	
	/**
	 * Answer true if there is a next slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function hasNext () {
		if (this.currentIndex < (this.slides.length - 1)) {
			return true;
		} else if (this.loop == true) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Go back to the previous slide and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function previous () {
		this.currentIndex--;
		this.display();
		
		this.cacheAround(this.currentIndex);
	}
	
	/**
	 * Go back to the beginning of the show.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function toStart () {
		this.currentIndex = 0;
		this.display();
		
		this.cacheAround(this.currentIndex);
	}
	
	/**
	 * Go back to the end of the show.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function toEnd () {
		this.currentIndex = this.slides.length - 1;
		this.display();
		
		this.cacheAround(this.currentIndex);
	}
	
	/**
	 * Play the slideshow.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function play () {
		this.playing = true;
		setTimeout("getElementFromDocument('viewer')._slideShow.playAdvance();", 
			(this.slide_delay * 1000));
				
		var playButton = getElementFromDocument('play_button');
		playButton.disabled = true;
		var pauseButton = getElementFromDocument('pause_button');
		pauseButton.disabled = false;
	}
	
	/**
	 * Advance to the next slide in the slideshow.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function playAdvance () {
		if (this.playing == true) {
			if (this.hasNext()) {
				this.next();
				setTimeout("getElementFromDocument('viewer')._slideShow.playAdvance();", 
					(this.slide_delay * 1000));				
			} else {
				this.playing = false;
				
				var playButton = getElementFromDocument('play_button');
				playButton.disabled = false;
				var pauseButton = getElementFromDocument('pause_button');
				pauseButton.disabled = true;
			}
		}
	}
	
	/**
	 * Pause the slideshow.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function pause () {
		this.playing = false;
		var playButton = getElementFromDocument('play_button');
		playButton.disabled = false;
		var pauseButton = getElementFromDocument('pause_button');
		pauseButton.disabled = true;
	}

	/**
	 * Change the media size.
	 * 
	 * @return void
	 * @access public
	 * @since 8/24/05
	 */
	function changeDelay () {
		var delayElement = getElementFromDocument('slide_delay');
		this.slide_delay = delayElement.value;
	}
	
	/**
	 * Load the images around our current index.
	 * Unload images far from our index to save on memory.
	 * 
	 * @param integer index
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function cacheAround ( index ) {
		var numToCacheAhead = 5;
		var numToCacheBehind = 5;
				
		// Load the needed images
		for (i = index + 1; (i <= (index + numToCacheAhead) && (i < this.slides.length)); i++) {
			this.slides[i].load(this.mediaSize);
		}
		for (i = index - 1; (i >= (index - numToCacheBehind) && (i >= 0)); i--) {
			this.slides[i].load(this.mediaSize);
		}
		
		// unload the excess images
		for (i = (index + numToCacheAhead + 1); i < this.slides.length; i++) {
			this.slides[i].unload();
		}
		for (i = (index - numToCacheBehind - 1); i >= 0; i--) {
			this.slides[i].unload();
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
		if (this.sizes == null) {
			var sizes = new Array();
			for (var i = 0; i < this.slides.length; i++) {
				sizes = sizes.concat(this.slides[i].getMediaSizes());
			}
			this.sizes = arrayUnique(sizes);
		}
		return this.sizes;
	}
	
	/**
	 * Change the media size.
	 * 
	 * @return void
	 * @access public
	 * @since 8/24/05
	 */
	function changeMediaSize () {
		var sizeElement = getElementFromDocument('media_size');
		this.mediaSize = sizeElement.value;
		this.display();
		this.cacheAround(this.currentIndex);
	}
	
	/**
	 * Advance to the next media and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function nextMedia () {
		this.slides[this.currentIndex].nextMedia();
	}
	
	/**
	 * Go back to the previous media and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function previousMedia () {
		this.slides[this.currentIndex].previousMedia();
	}
	
	/**
	 * Zoom in on the current slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomIn () {
		this.slides[this.currentIndex].zoomIn();
	}
	
	/**
	 * Zoom in on the current slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomOut () {
		this.slides[this.currentIndex].zoomOut();
	}
	
	/**
	 * Zoom to 100%
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomToFull () {
		this.slides[this.currentIndex].zoomToFull();
	}
	
	/**
	 * Zoom to fit
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	function zoomToFit () {
		this.slides[this.currentIndex].zoomToFit();
	}
	
	/**
	 * Answer the height of the viewer. 
	 * This will either be the height of the viewer <div> tag or the height of
	 * the window.
	 * 
	 * @return string
	 * @access public
	 * @since 8/25/05
	 */
	function getViewerHeight () {
		return getElementHeight('viewer');
		
		// @todo, add window size sniffing.
	}
	
	/**
	 * Answer the width of the viewer. 
	 * This will either be the width of the viewer <div> tag or the width of
	 * the window.
	 * 
	 * @return string
	 * @access public
	 * @since 8/25/05
	 */
	function getViewerWidth () {
		return getElementWidth('viewer');
		
		// @todo, add window size sniffing.
	}
	
	/**
	 * Answer the height of the toolbars.
	 * 
	 * @return string
	 * @access public
	 * @since 8/25/05
	 */
	function getToolbarHeight () {
		if (this.showPlaybackToolbar == true)
			return '60';
		else
			return '30';
	}
}

