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
function SlideShow (viewerElementId, xmlDocumentUrl, startingSlide, allowCompare) {
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, xmlDocumentUrl, startingSlide, allowCompare );
	}
}
	
	/**
	 * Initialize this object
	 * 
	 * @param string viewerElementId
	 * @param string xmlDocumentUrl
	 * @return void
	 * @access public
	 * @since 9/21/05
	 */
	SlideShow.prototype.init = function (viewerElementId, xmlDocumentUrl, startingSlide, allowCompare ) {
		var req = this.req;
		
		this.slides;
		
		if (startingSlide)
			this.currentIndex = startingSlide;
		else
			this.currentIndex = 0;
			
		this.mediaSize = 'original';
		this.title = 'SlideShow';
		this.showPlaybackToolbar = false;
		this.playing = false;
		this.slide_delay = 10;
		this.loop = false;
		this.viewerElementId = viewerElementId;
		this.allowCompare = allowCompare;
		
		// Attach ourselves to the View obect for later referencing from static
		// methods.
		var viewerElement = getElementFromDocument(this.viewerElementId);
		if (!viewerElement) {
			alert("Error: Could not find div element with id, '" + this.viewerElementId 
				+ "', on the page. Not loading viewer.");
		}
		viewerElement.style.position = "relative";
		viewerElement._slideShow = this;
		
		// Write our main div elements
		viewerElement.innerHTML = "";
		viewerElement.innerHTML += "\n<div id='" + this.viewerElementId + "_toolbars' class='toolbar' />";
		viewerElement.innerHTML += "\n<div id='" + this.viewerElementId + "_slide' />";
		viewerElement.innerHTML += "\n<div id='" + this.viewerElementId + "_loading' class='loading'>loading...</div>";
		
		this.layoutChildren();
		
		
		// Load our xmlDocument
		this.loadXMLDoc(xmlDocumentUrl);
	}
		
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
	SlideShow.prototype.loadXMLDoc = function (url) {
		// Define a variable to point at this slideshow that will be in the
		// scope of the request-processing function, since 'this' will (at that
		// point) be that function.
		var slideShow = this;
					
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
				var working = getElementFromDocument(slideShow.viewerElementId + '_loading');
				if (req.readyState > 0 && req.readyState < 4) {
					working.style.display = 'block';
				} else {
					working.style.display = 'none';
				}
						
				// only if req shows "loaded"
				if (req.readyState == 4) {
					// only if we get a good load should we continue.
					if (req.status == 200) {
						slideShow.createSlides(req.responseXML);
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
	 * Create slide objects each with their own xml chunk which defines their
	 * content.
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	SlideShow.prototype.createSlides = function ( xmlDocument ) {		
		var titleElements = xmlDocument.documentElement.getElementsByTagName("title");
		if (titleElements.length > 0 && titleElements[0].firstChild) {
			this.title = titleElements[0].firstChild.nodeValue;
			// Set the document's title to that of the slideshow if it is not
			// already specified.
			if (!document.title || document.title == "" || document.title == "Concerto Viewer")
				document.title = this.title;
		}
		
		
		// Load the sizes if possible.
		var sizeElements = xmlDocument.documentElement.getElementsByTagName("size");
		if (sizeElements.length > 0 && this.sizes == null) {
			var sizes = new Array();
			for (var i = 0; i < sizeElements.length; i++) {
				sizes[i] = sizeElements[i].firstChild.nodeValue;
			}
			this.sizes = arrayUnique(sizes);
		}
		
		// Load the default slide if possible.
		var defaultSizeElements = xmlDocument.documentElement.getElementsByTagName("default_size");
		if (defaultSizeElements.length > 0) {
			this.mediaSize = defaultSizeElements[0].firstChild.nodeValue;
		}
		
		var slideElements = xmlDocument.documentElement.getElementsByTagName("slide");
		this.slides = new Array(slideElements.length);
		for (var i = 0; i < slideElements.length; i++) {
			var positionElements = slideElements[i].getElementsByTagName("text-position");
			if (positionElements[0])
				var position = positionElements[0].firstChild.nodeValue;
			else
				var position = null;
			
			if (position == 'right')
	 			this.slides[i] = new TextRightSlide(this.viewerElementId, slideElements[i]);
	 		else if (position == 'bottom')
	 			this.slides[i] = new TextBottomSlide(this.viewerElementId, slideElements[i]);
	 		else if (position == 'top')
	 			this.slides[i] = new TextTopSlide(this.viewerElementId, slideElements[i]);
	 		else if (position == 'center')
	 			this.slides[i] = new TextCenterSlide(this.viewerElementId, slideElements[i]);
	 		else if (position == 'none')
	 			this.slides[i] = new NoTextSlide(this.viewerElementId, slideElements[i]);
	 		else
	 			this.slides[i] = new TextLeftSlide(this.viewerElementId, slideElements[i]);
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
	SlideShow.prototype.display = function () {
		// make sure that our currentIndex is in-bounds
		if (this.currentIndex < 0)
			this.currentIndex = 0;
		if (this.currentIndex >= this.slides.length)
			this.currentIndex = this.slides.length - 1;
		
		var destination = getElementFromDocument(this.viewerElementId + '_toolbars');
		destination.style.height =  this.getToolbarHeight() + "px";
		
		var slideElement = getElementFromDocument(this.viewerElementId + '_slide');
		slideElement.style.height =  (this.getViewerHeight() - this.getToolbarHeight())  + "px";
		slideElement.style.top =  this.getToolbarHeight()  + "px";
		
		var html = "";
		
		// Main Tool Bar
		html += "\n<div class='main_toolbar' id='" + this.viewerElementId + "_main_toolbar' style='padding: 2px; text-align: center; width: " + destination.style.width + "; border: 0px solid #0f0'>";
			
		// Next/Previous buttons
		var previousDisabled = "";
		var nextDisabled = "";
		if (this.currentIndex <= 0)
			previousDisabled = " disabled='disabled'";
		if (this.currentIndex >= (this.slides.length - 1))
			nextDisabled = " disabled='disabled'";
			
		html += "\n&nbsp;<button" + previousDisabled + " class='button tostart_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.toStart()' title='To Start' accesskey='v'>&lt;&lt;</button>";
		html += "\n<button" + previousDisabled + " class='button previous_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.previous()' title='Previous' accesskey='b'>&lt;</button>";
		html += "\n<button" + nextDisabled + " class='button next_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.next()' title='Next' accesskey='n'>&gt;</button>";
		html += "\n<button" + nextDisabled + " class='button toend_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.toEnd()' title='To End' accesskey='m'>&gt;&gt;</button>";
		
		
		html += "\n &nbsp;&nbsp; " + (this.currentIndex + 1);
		html += " of " + this.slides.length + " &nbsp;&nbsp; ";
		
		// Media size selection
		var sizes = this.getMediaSizes();
		var selected;
		html += "\nSize: <select id='" + this.viewerElementId + "_media_size' onchange='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.changeMediaSize()'>";
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
		html += " \n<button class='button zoomin_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.zoomIn()' title='Zoom In' accesskey='i'>+</button>";
		html += "\n<button class='button zoomout_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.zoomOut()' title='Zoom Out' accesskey='o'>-</button>";
		html += " \n<button class='button zoom100_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.zoomToFull()' title='Zoom 100%' accesskey='1'>100%</button>";
		html += "\n<button class='button zoomfit_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.zoomToFit()' title='Zoom to Fit' accesskey='f'>&lt;--&gt;</button>";
		
		if (this.allowCompare)
			html += "\n<button class='button compare_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.compare()' title='Compare in a new window.' accesskey='n'>Compare</button>";
		
		if (this.showPlaybackToolbar == true)
			html += "\n<button class='button close_controls_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.togglePlayControls()' title='Hide Controls' accesskey='c'>HideControls</button>";
		else
			html += "\n<button class='button controls_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.togglePlayControls()' title='Show Controls' accesskey='m'>ShowControls</button>";
		
		
		html += "\n</div>";
		
		
		
		if (this.showPlaybackToolbar == true) {
			// Slideshow playing controls
			html += "\n<div id='" + this.viewerElementId + "_playback_toolbar' width: " + destination.style.width + ";'>";
			html += "\n\t<div style='float: left;'>&nbsp;";
			
			if (this.playing == true) {
				var playDisabled = " disabled='disabled' style='display: none'";
				var pauseDisabled = " accesskey='p'";
			} else {
				var playDisabled = " accesskey='p'";
				var pauseDisabled = " disabled='disabled' style='display: none'";
			}
			html += " \n<button class='button play_button' id='" + this.viewerElementId + "_play_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.play()'" + playDisabled + " title='Play'>|&gt;</button>";
			html += " \n<button class='button pause_button' id='" + this.viewerElementId + "_pause_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.pause()'" + pauseDisabled + " title='Pause'>||</button>";
			
			
			// Media size selection
			html += " &nbsp;&nbsp; Delay: ";
			var selected;
			html += "\n<select id='" + this.viewerElementId + "_slide_delay' onchange='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.changeDelay()'>";
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
			
			html += " &nbsp;&nbsp; ";
			
			if (this.loop == true) {
				html += " \n<button class='button loop_button' id='" + this.viewerElementId + "_loop_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.toggleLoop()' title='Toggle Looping' accesskey='l'>&lt;__]</button>";
			} else {
				html += " \n<button class='button once_button' id='" + this.viewerElementId + "_loop_button' onclick='Javascript:getElementFromDocument(\"" + this.viewerElementId + "\")._slideShow.toggleLoop()' title='Toggle Looping' accesskey='l'>--&gt;|</button>";
			}
			
			html += "\n\t</div>";
			html += "\n\t<div style='float: right;'>Page Style:";
			html += "\n\t\t<select onchange='Javascript:setActiveStyleSheet(this.value)'>";
			var sheets = getStyleSheets();
			var currentSheet = getActiveStyleSheet();
			for (var i = 0; i < sheets.length; i++) {
				if (sheets[i] == currentSheet)
					selected = " selected='selected'";
				else
					selected = '';
				html += "\n\t\t\t<option value='" + sheets[i] + "'" + selected + ">" + sheets[i] + "</option>";
			}
			html += "\n\t\t</select>";
			html += "\n\t</div>";
			
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
	SlideShow.prototype.next = function () {
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
	SlideShow.prototype.hasNext = function () {
		if (this.currentIndex < (this.slides.length - 1)) {
			return true;
		} else if (this.loop == true) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Answer true if there is a next media in the current slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	SlideShow.prototype.hasNextMedia = function () {
		return this.slides[this.currentIndex].hasNextMedia();
	}
	
	/**
	 * Go back to the previous slide and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	SlideShow.prototype.previous = function () {
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
	SlideShow.prototype.toStart = function () {
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
	SlideShow.prototype.toEnd = function () {
		this.currentIndex = this.slides.length - 1;
		this.display();
		
		this.cacheAround(this.currentIndex);
	}
	
	/**
	 * Go a particular slide.
	 * 
	 * @param integer The index to go to.
	 * @return void
	 * @access public
	 * @since 10/16/05
	 */
	SlideShow.prototype.toSlideIndex = function (index) {
		if (index >= 0 && index < this.slides.length) {
			this.currentIndex = index;
			this.display();
		
			this.cacheAround(this.currentIndex);
		}
	}
	
	/**
	 * Play the slideshow.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	SlideShow.prototype.play = function () {
		this.playing = true;
		setTimeout("getElementFromDocument('" + this.viewerElementId + "')._slideShow.playAdvance();", 
			(this.slide_delay * 1000));
				
		var playButton = getElementFromDocument(this.viewerElementId + '_play_button');
		playButton.disabled = true;
		playButton.style.display = 'none';
		var pauseButton = getElementFromDocument(this.viewerElementId + '_pause_button');
		pauseButton.disabled = false;
		pauseButton.style.display = 'inline';
	}
	
	/**
	 * Advance to the next slide in the slideshow.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	SlideShow.prototype.playAdvance = function () {
		if (this.playing == true) {
			if (this.hasNext()
				|| this.hasNextMedia()) 
			{
				if (this.hasNextMedia())
					this.slides[this.currentIndex].nextMedia();
				else {
					this.next();
					this.slides[this.currentIndex].goToFirstMedia();
				}
				
				setTimeout("getElementFromDocument('" + this.viewerElementId + "')._slideShow.playAdvance();", 
					(this.slide_delay * 1000));				
			} else {
				this.playing = false;
				
				var playButton = getElementFromDocument(this.viewerElementId + '_play_button');
				playButton.disabled = false;
				playButton.style.display = 'inline';
				var pauseButton = getElementFromDocument(this.viewerElementId + '_pause_button');
				pauseButton.disabled = true;
				pauseButton.style.display = 'none';
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
	SlideShow.prototype.pause = function () {
		this.playing = false;
		var playButton = getElementFromDocument(this.viewerElementId + '_play_button');
		playButton.disabled = false;
		playButton.style.display = 'inline';
		var pauseButton = getElementFromDocument(this.viewerElementId + '_pause_button');
		pauseButton.disabled = true;
		pauseButton.style.display = 'none';
	}

	/**
	 * Change the media size.
	 * 
	 * @return void
	 * @access public
	 * @since 8/24/05
	 */
	SlideShow.prototype.changeDelay = function () {
		var delayElement = getElementFromDocument(this.viewerElementId + '_slide_delay');
		this.slide_delay = delayElement.value;
	}
	
	/**
	 * Toggle the visibility of the play controls
	 * 
	 * @return void
	 * @access public
	 * @since 8/24/05
	 */
	SlideShow.prototype.togglePlayControls = function () {
		this.showPlaybackToolbar = !(this.showPlaybackToolbar);
		this.display();
	}
	
	/**
	 * Toggle the looping of the slideshow playing
	 * 
	 * @return void
	 * @access public
	 * @since 8/24/05
	 */
	SlideShow.prototype.toggleLoop = function () {
		this.loop = !(this.loop);
		this.display();
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
	SlideShow.prototype.cacheAround = function ( index ) {
		var numToCacheAhead = 10;
		var numToCacheBehind = 10;
				
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
	SlideShow.prototype.getMediaSizes = function () {
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
	SlideShow.prototype.changeMediaSize = function () {
		var sizeElement = getElementFromDocument(this.viewerElementId + '_media_size');
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
	SlideShow.prototype.nextMedia = function () {
		this.slides[this.currentIndex].nextMedia();
	}
	
	/**
	 * Go back to the previous media and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	SlideShow.prototype.previousMedia = function () {
		this.slides[this.currentIndex].previousMedia();
	}
	
	/**
	 * Zoom in on the current slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	SlideShow.prototype.zoomIn = function () {
		this.slides[this.currentIndex].zoomIn();
	}
	
	/**
	 * Zoom in on the current slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	SlideShow.prototype.zoomOut = function () {
		this.slides[this.currentIndex].zoomOut();
	}
	
	/**
	 * Zoom to 100%
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	SlideShow.prototype.zoomToFull = function () {
		this.slides[this.currentIndex].zoomToFull();
	}
	
	/**
	 * Zoom to fit
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	SlideShow.prototype.zoomToFit = function () {
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
	SlideShow.prototype.getViewerHeight = function () {
		return getElementHeight(this.viewerElementId);
		
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
	SlideShow.prototype.getViewerWidth = function () {
		return getElementWidth(this.viewerElementId);
		
		// @todo, add window size sniffing.
	}
	
	/**
	 * Answer the height of the toolbars.
	 * 
	 * @return string
	 * @access public
	 * @since 8/25/05
	 */
	SlideShow.prototype.getToolbarHeight = function () {
		if (this.showPlaybackToolbar == true)
			return '60';
		else
			return '30';
	}
	
	/**
	 * Layout the child elements positions with respect to the viewer element
	 * 
	 * @return void
	 * @access public
	 * @since 9/21/05
	 */
	SlideShow.prototype.layoutChildren = function () {
		var toolbarsElement = getElementFromDocument(this.viewerElementId + '_toolbars');
		toolbarsElement.style.height =  this.getToolbarHeight() + "px";
		toolbarsElement.style.width =  this.getViewerWidth() + "px";
		toolbarsElement.style.position = "absolute";
		toolbarsElement.style.left = "0px";
		toolbarsElement.style.top = "0px";
		
		var slideElement = getElementFromDocument(this.viewerElementId + '_slide');
		slideElement.style.height =  (this.getViewerHeight() - this.getToolbarHeight())  + "px";
		slideElement.style.width =  this.getViewerWidth() + "px";
		slideElement.style.position = "absolute";
		slideElement.style.left = "0px";
		slideElement.style.top = this.getToolbarHeight() + "px";
		
		var loadingElement = getElementFromDocument(this.viewerElementId + '_loading');
		loadingElement.style.height =  Math.floor((this.getViewerHeight() - this.getToolbarHeight())/2)  + "px";
		loadingElement.style.width =  this.getViewerWidth() + "px";
		loadingElement.style.position = "absolute";
		loadingElement.style.left = "0px";
		loadingElement.style.top = Math.floor((this.getViewerHeight() - this.getToolbarHeight())/2) + "px";
	}
	
	/**
	 * Reload the sizes of the viewer. This may be used on window resizing or 
	 * other events.
	 * 
	 * @return void
	 * @access public
	 * @since 9/21/05
	 */
	SlideShow.prototype.reloadSizes = function () {
		// It seems that IE's body.onresize event gets called as the viewer
		// changes the size of it div element (before our child slides are even
		// loaded), so only run this if we actually have children to resize.
		if (this.slides) {
			this.layoutChildren();
			for (var i = 0; i < this.slides.length; i++)
				this.slides[i].resetZoom();
			this.display();
		}
	}

	/**
	 * Open a new viewer on the same slide.
	 * 
	 * @return void
	 * @access public
	 * @since 5/23/06
	 */
	SlideShow.prototype.compare = function () {		
		var myUrl = window.location.toString();
		// Clean off the parameters that we are going to set
		var regex = /&start=[0-9]*/;
		myUrl = myUrl.replace(regex, '');
		var regex = /&theme=[a-zA-Z0-9_\-]*/;
		myUrl = myUrl.replace(regex, '');
		
		
		// Add our parameters back on.
		var regex = /.*\?.*/;
		if (!myUrl.match(regex))
			myUrl += '?';
		
		myUrl += '&start=' + this.currentIndex;
		
		var activeStyleSheet = getActiveStyleSheet();
		if (activeStyleSheet)
			myUrl += '&theme=' + activeStyleSheet;
		
		
		var options = "copyhistory=no,";
		options += "toolbar=" + ((window.toolbar.visible)?'yes':'no') + ",";
		options += "location=" + ((window.locationbar.visible)?'yes':'no') + ",";
		options += "directories=" + ((window.personalbar.visible)?'yes':'no') + ",";
		options += "statusbar=" + ((window.statusbar.visible)?'yes':'no') + ",";
		options += "scrollbars=" + ((window.scrollbars.visible)?'yes':'no') + ",";
		options += "resizable=" + ((true)?'yes':'no') + ",";
		options += "width=" + window.innerWidth + ",";
		options += "height=" + window.innerHeight;
		var newWindow = window.open(myUrl, '_blank', options);
		window.focus();
		if (screen.width && screen.height && confirm('Fit to screen?')) {
			if (confirm("Yes/OK for side by side\nNo/Cancel for above/below")) {
				var width = screen.width/2;
				var height = screen.height;
				var positionX = width;
				var positionY = 0;
			} else {
				var width = screen.width;
				var height = screen.height/2;
				var positionX = 0;
				var positionY = height;
			}
			
			window.moveTo(0, 0);
			window.outerWidth = width;
			window.outerHeight = height;
			
			newWindow.outerWidth = width;
			newWindow.outerHeight = height;
			// moveto doesn't seem to quite work, so, first put it at the origen
			// then use moveBy.
			newWindow.moveTo(0, 0);
			newWindow.moveBy(positionX, positionY);
		}
		newWindow.focus();
	}/**
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
		if (slideXmlNode.getAttribute('source')) {
			this.source = slideXmlNode.getAttribute('source');
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
		if (titleElements[0].firstChild)
			this.title = titleElements[0].firstChild.nodeValue;
		else
			this.title = "";
		
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
			destination.style.verticalAlign = "middle";
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
		
		// Safari 
		var regex = /&#38;/
		while (url.match(regex))
			url = url.replace(regex, '&');
							
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
					working.style.display = 'block';
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
/**
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
 
TextLeftSlide.prototype = new Slide();
TextLeftSlide.prototype.constructor = TextLeftSlide;
TextLeftSlide.superclass = TextLeftSlide.prototype;

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
function TextLeftSlide ( viewerElementId, slideXmlNode) {
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
	TextLeftSlide.prototype.doDisplay = function (mediaSize) {
		this.currentMediaSize = mediaSize;
		this.load(mediaSize);
		var destination = getElementFromDocument(this.viewerElementId + '_slide');
		destination.innerHTML = "";
		
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media_buttons' class='toolbar' />";
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_slide_text' class='content' />";
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media' class='media' />";
		
		var mediaButtonsElement = getElementFromDocument(this.viewerElementId + '_media_buttons');
		mediaButtonsElement.style.position = "absolute";
		mediaButtonsElement.style.top = "0px";
		mediaButtonsElement.style.left = "200px";
		mediaButtonsElement.style.height = "30px";
		mediaButtonsElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 200) + "px";
// 		mediaButtonsElement.style.border = "1px solid #0f0";

		
		var textElement = getElementFromDocument(this.viewerElementId + '_slide_text');
		textElement.style.position = "absolute";
		textElement.style.left = "0px";
		textElement.style.top = "0px";
		textElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 5) + "px";
		textElement.style.width = "195px";
		textElement.style.overflow = "auto";
		textElement.style.paddingTop = "5px";
		textElement.style.paddingLeft = "5px";
// 		textElement.style.border = "1px solid #f00";
		
		textElement.innerHTML = "\n<div class='slide_title'>" + this.title + "</div>";
		textElement.innerHTML += "\n<div class='slide_caption'>" + this.caption + "</div>";
		
		
		var imageElement = getElementFromDocument(this.viewerElementId + '_media');
		imageElement.style.position = "absolute";
		imageElement.style.left = "200px";
		if (this.media.length > 1) {
			imageElement.style.top = "30px";
			imageElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 30) + "px";
		} else {
			imageElement.style.top = "0px";
			imageElement.style.height = getElementHeight(this.viewerElementId + '_slide') + "px";
		}
		imageElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 200) + "px";
		imageElement.style.overflow = "auto";
// 		imageElement.style.border = "1px solid #00f";
		
		if (this.media[this.currentMediaIndex])
			this.media[this.currentMediaIndex].display(mediaSize);
			
 		this.displayMediaButtons();
	}
	/**
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
 
TextRightSlide.prototype = new Slide();
TextRightSlide.prototype.constructor = TextRightSlide;
TextRightSlide.superclass = TextRightSlide.prototype;

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
function TextRightSlide ( viewerElementId, slideXmlNode) {
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
	TextRightSlide.prototype.doDisplay = function (mediaSize) {
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
		if (this.media.length > 1) {
			imageElement.style.top = "30px";
			imageElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 30) + "px";
		} else {
			imageElement.style.top = "0px";
			imageElement.style.height = getElementHeight(this.viewerElementId + '_slide') + "px";
		}
		imageElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 200) + "px";
		imageElement.style.overflow = "auto";
// 		imageElement.style.border = "1px solid #00f";
		
		
		var mediaButtonsElement = getElementFromDocument(this.viewerElementId + '_media_buttons');
		mediaButtonsElement.style.position = "absolute";
		mediaButtonsElement.style.top = "0px";
		mediaButtonsElement.style.left = "0px";
		mediaButtonsElement.style.height = "30px";
		mediaButtonsElement.style.width = (getElementWidth(this.viewerElementId + '_slide') - 200) + "px";
// 		mediaButtonsElement.style.border = "1px solid #0f0";

		
		var textElement = getElementFromDocument(this.viewerElementId + '_slide_text');
		textElement.style.position = "absolute";
		textElement.style.left = getElementWidth(this.viewerElementId + '_media') + "px";
		textElement.style.top = "0px";
		textElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 5) + "px";
		textElement.style.width = "195px";
		textElement.style.overflow = "auto";
		textElement.style.paddingTop = "5px";
		textElement.style.paddingLeft = "5px";
// 		textElement.style.border = "1px solid #f00";
		
		textElement.innerHTML = "\n<div class='slide_title'>" + this.title + "</div>";
		textElement.innerHTML += "\n<div class='slide_caption'>" + this.caption + "</div>";
		
		
		if (this.media[this.currentMediaIndex])
			this.media[this.currentMediaIndex].display(mediaSize);
		
 		this.displayMediaButtons();
	}
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
	/**
 * @since 8/22/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
 
TextTopSlide.prototype = new Slide();
TextTopSlide.prototype.constructor = TextTopSlide;
TextTopSlide.superclass = TextTopSlide.prototype;

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
function TextTopSlide ( viewerElementId, slideXmlNode) {
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
	TextTopSlide.prototype.doDisplay = function (mediaSize) {
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
		imageElement.style.top = "200px";
		if (this.media.length > 1) {
			imageElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 230) + "px";
		} else {
			imageElement.style.height = (getElementHeight(this.viewerElementId + '_slide') - 200) + "px";
		}
		imageElement.style.width = getElementWidth(this.viewerElementId + '_slide') + "px";
		imageElement.style.overflow = "auto";
// 		imageElement.style.border = "1px solid #00f";		


		var mediaButtonsElement = getElementFromDocument(this.viewerElementId + '_media_buttons');
		mediaButtonsElement.style.position = "absolute";
		mediaButtonsElement.style.top = (getElementHeight(this.viewerElementId + '_slide') - 30) + "px";
		mediaButtonsElement.style.left = "0px";
		mediaButtonsElement.style.height = "30px";
		mediaButtonsElement.style.width = getElementWidth(this.viewerElementId + '_slide') + "px";
// 		mediaButtonsElement.style.border = "1px solid #0f0";

		
		var textElement = getElementFromDocument(this.viewerElementId + '_slide_text');
		textElement.style.position = "absolute";
		textElement.style.left = "0px";
		textElement.style.top = "0px";
		textElement.style.height = "195px";
		textElement.style.width = getElementWidth(this.viewerElementId + '_slide') + "px";
		textElement.style.overflow = "auto";
		textElement.style.paddingTop = "5px";
		textElement.style.paddingLeft = "5px";
// 		textElement.style.border = "1px solid #f00";
		
		textElement.innerHTML = "\n<div class='slide_title'>" + this.title + "</div>";
		textElement.innerHTML += "\n<div class='slide_caption'>" + this.caption + "</div>";

		
		
		if (this.media[this.currentMediaIndex])
			this.media[this.currentMediaIndex].display(mediaSize);
		
 		this.displayMediaButtons();
	}
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
	NoTextSlide.prototype.doDisplay = function (mediaSize) {
		this.currentMediaSize = mediaSize;
		this.load(mediaSize);
		var destination = getElementFromDocument(this.viewerElementId + '_slide');
		destination.innerHTML = "";
		
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media_buttons' class='toolbar' />";
		destination.innerHTML += "\n<div id='" + this.viewerElementId + "_media' class='media' />";

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
	
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 

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
function MediaContainer ( viewerElementId, mediaXMLNode) {
	if ( arguments.length > 0 ) {
		this.init( viewerElementId, mediaXMLNode );
	}
}
	
	/**
	 * Initialize this object
	 * 
	 * @param string viewerElementId
	 * @param string xmlDocumentUrl
	 * @return void
	 * @access public
	 * @since 9/21/05
	 */
	MediaContainer.prototype.init = function ( viewerElementId, mediaXMLNode) {
		this.versions = new Array ();
		this.sizeOptions = new Array('thumb', 'small', 'medium', 'large', 'original');
		this.mediaClasses = new Array(TiffMedia, ImageMedia, QuicktimeMedia, RealMedia, WindowsMediaMedia, VideoMedia, FileMedia);
		this.currentMediaSize = 'original';
		this.viewerElementId = viewerElementId;
		
		var versionElements = mediaXMLNode.getElementsByTagName("version");
		for (var i = 0; i < versionElements.length; i++) {
			var sizeElements = versionElements[i].getElementsByTagName("size");
			if (sizeElements.length > 0)
				var size = this.getSizeIndex(sizeElements[0].firstChild.nodeValue);
			else
				var size = this.getSizeIndex('original');
			
			for (var j = 0; j < this.mediaClasses.length; j++) {
				if (this.mediaClasses[j].prototype.supportsNode(versionElements[i])) {
					this.versions[size] = new this.mediaClasses[j] (this.viewerElementId, versionElements[i]);
					break;
				}
			}
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
	MediaContainer.prototype.display = function (mediaSize) {
		this.currentMediaSize = mediaSize;
		var size = this.selectSizeIndex(mediaSize);
		this.versions[size].display();
	}
	
	/**
	 * Redisplay the media based on our current media size
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	MediaContainer.prototype.redisplay = function () {
		this.display(this.currentMediaSize);
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	MediaContainer.prototype.load = function (mediaSize) {
		var size = this.selectSizeIndex(mediaSize);
		this.versions[size].load();
	}
	
	/**
	 * unload and clear our image cache
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	MediaContainer.prototype.unload = function () {
		for (var i in this.versions) {
			this.versions[i].unload();
		}
	}
	
	/**
	 * Answer the availible sizes of media
	 * 
	 * @return array
	 * @access public
	 * @since 8/24/05
	 */
	MediaContainer.prototype.getMediaSizes = function () {
		var sizes = new Array();
		for (var i in this.versions) {
			sizes.push(this.sizeOptions[i]);
		}
		return arrayUnique(sizes);
	}
	
	/**
	 * Answer the integer size that corresponds to the text name.
	 * 
	 * @param string sizeName
	 * @return integer
	 * @access public
	 * @since 8/24/05
	 */
	MediaContainer.prototype.getSizeIndex = function (sizeName) {
		for (var i = 0; i < this.sizeOptions.length; i++) {
			if (sizeName == this.sizeOptions[i])
				return i;
		}
		
		alert("Media version size, '" + sizeName + "', is not in the allowed list:\n " + this.sizeOptions);
	}
	
	/**
	 * Answer the size index that equal to sizeName if a version exists for that
	 * size, otherwise, the next bigger existing version index. If no large version
	 * exists, then return a smaller version.
	 * 
	 * @param string sizeName
	 * @return integer
	 * @access public
	 * @since 8/24/05
	 */
	MediaContainer.prototype.selectSizeIndex = function (sizeName) {
		var targetIndex = this.getSizeIndex(sizeName);

		// Look for the desired or larger versions
		for (var i = targetIndex; i <= this.sizeOptions.length; i++) {
			if (this.versions[i])
				return i;
		}
		
		// Look for smaller versions
		for (var i = targetIndex - 1; i >= 0; i--) {
			if (this.versions[i])
				return i;
		}
		
		alert("No media version exists.");
	}
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	MediaContainer.prototype.zoomIn = function () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomIn();
	}
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	MediaContainer.prototype.zoomOut = function () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomOut();
	}
	
	/**
	 * Zoom to 100% and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	MediaContainer.prototype.zoomToFull = function () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomToFull();
	}
	
	/**
	 * Zoom to fit and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	MediaContainer.prototype.zoomToFit = function () {
		this.versions[this.selectSizeIndex(this.currentMediaSize)].zoomToFit();
	}
	
	/**
	 * Clear the zoom levels of the media
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	MediaContainer.prototype.resetZoom = function () {
		var sizes = this.getMediaSizes();
		for (var i = 0; i < sizes.length; i++) {
			this.versions[this.getSizeIndex(sizes[i])].resetZoom();
		}
	}

/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 

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
function Media ( viewerElementId, mediaXMLNode) {
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
	Media.prototype.init = function ( viewerElementId, mediaXMLNode) {
		
		this.zoomLevel = 1;
		this.zoomIncrement = 1.25;
		this.fitMargin = 0;
		this.scrollXPercent = 0.5;
		this.scrollYPercent = 0.5;
		this.viewerElementId = viewerElementId;
				
		var urlElements = mediaXMLNode.getElementsByTagName("url");
		if (urlElements.length > 0)
			this.url = urlElements[0].firstChild.nodeValue.replace(/&amp;/g, '&');
		
		var typeElements = mediaXMLNode.getElementsByTagName("type");
		if (typeElements.length > 0)
			this.type = typeElements[0].firstChild.nodeValue;
		
		var heightElements = mediaXMLNode.getElementsByTagName("height");
		if (heightElements.length > 0)
			this.height = heightElements[0].firstChild.nodeValue;
		else
			this.height = "0px";
		
		var widthElements = mediaXMLNode.getElementsByTagName("width");
		if (widthElements.length > 0)
			this.width = widthElements[0].firstChild.nodeValue;
		else
			this.width = "0px";
	}
	
	/**
	 * Display the slide content in the 'slide' div.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	Media.prototype.display = function (mediaSize) {
		this.load();
				
		var html = "";
		html += "<div id='" + this.viewerElementId + "_download_link' style='position: absolute;'>";
		html += "<a";
		html += " href='" + this.url.replace(/&/g, '&amp;') + "'>";
		html += "Download the Media";
		html += "</a>";
		html += "</div>";
		
		var destination = getElementFromDocument(this.viewerElementId + '_media');
		destination.innerHTML = html;
		
		var downloadLink = getElementFromDocument(this.viewerElementId + '_download_link');
		downloadLink.style.top = this.getCenteredY(downloadLink.offsetHeight) + "px";
		downloadLink.style.left = this.getCenteredX(downloadLink.offsetWidth) + "px";
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	Media.prototype.supportsNode = function (xmlNode) {
		alert("Error: over-ride method Media.supportsNode(xmlNode) in child class!");
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Media.prototype.load = function (mediaSize) {
		// override to cache our target if possible
	}
	
	/**
	 * unload and clear our image cache
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Media.prototype.unload = function () {
		// if we are caching, override to un-cache.
	}
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomIn = function () {
		this.zoomLevel = this.zoomLevel * this.zoomIncrement;
		this.display();
	}
	
	/**
	 * Zoom in and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomOut = function () {
		this.zoomLevel = this.zoomLevel / this.zoomIncrement;
		this.display();
	}
	
	/**
	 * Zoom to 100% and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomToFull = function () {
		this.zoomLevel = 1;
		this.display();
	}
	
	/**
	 * Answer the height
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getHeightPx = function () {
		return pixelsToInteger(this.height);
	}
	
	/**
	 * Answer the width
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getWidthPx = function () {
		return pixelsToInteger(this.width);
	}
	
	/**
	 * Answer the height after the zoom factor is taken into account
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getZoomedHeightPx = function () {
		return this.getHeightPx() * this.zoomLevel;
	}
	
	/**
	 * Answer the width after the zoom factor is taken into account
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getZoomedWidthPx = function () {
		return this.getWidthPx() * this.zoomLevel;
	}
	
	/**
	 * Zoom to fit and redisplay
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.zoomToFit = function () {
		if (this.getHeightPx() != 0 && this.getWidthPx() != 0) {
			var targetHeight = getElementHeight(this.viewerElementId + '_media') - this.fitMargin;
			var targetWidth = getElementWidth(this.viewerElementId + '_media') - this.fitMargin;
			
			var heightRatio = targetHeight/this.getHeightPx();
			var widthRatio = targetWidth/this.getWidthPx();
			
			if (heightRatio <= widthRatio)
				this.zoomLevel = heightRatio;
			else
				this.zoomLevel = widthRatio;
			
			this.display();
		}
	}
	
	/**
	 * Answer the integer number of pixels in the X-direction to offset the 
	 * image in order to center it.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getCenteredX = function (imageWidth) {
		var targetWidth = getElementWidth(this.viewerElementId + '_media') - this.fitMargin;
		if (imageWidth == null)
			var imageWidth = this.getZoomedWidthPx();
		
		if (imageWidth > targetWidth) {
			return 0;
		} else {
			return ((targetWidth/2) - (imageWidth/2));
		}
	}
	
	/**
	 * Answer the integer number of pixels in the X-direction to offset the 
	 * image in order to center it.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getCenteredY = function (imageHeight) {
		var targetHeight = getElementHeight(this.viewerElementId + '_media') - this.fitMargin;
		if (imageHeight == null)
			var imageHeight = this.getZoomedHeightPx();
		
		if (imageHeight > targetHeight) {
			return 0;
		} else {
			return ((targetHeight/2) - (imageHeight/2));
		}
	}
	
	/**
	 * Answer the percentage that the image is scrolled in the X-direction.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getScrollXPercent = function () {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		return ((target.scrollLeft + target.clientWidth/2)/target.scrollWidth);
	}
	
	/**
	 * Answer the percentage that the image is scrolled in the Y-direction.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.getScrollYPercent = function () {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		return ((target.scrollTop + target.clientHeight/2)/target.scrollHeight);
	}
	
	/**
	 * Set the new scroll amount so that it is the same percentage scroll as
	 * the parameter
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.setScrollXPercent = function (scrollPercent) {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		target.scrollLeft = Math.round((target.scrollWidth * scrollPercent) - target.clientWidth/2);
	}
	
	/**
	 * Set the new scroll amount so that it is the same percentage scroll as
	 * the parameter
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.setScrollYPercent = function (scrollPercent) {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		
		target.scrollTop = Math.round((target.scrollHeight * scrollPercent) - target.clientHeight/2);
	}
	
	/**
	 * Update the scroll percentage based on the the current one.
	 * "this" will be the element that onscroll was set to, so it must
	 * have its target set at the same time as the onscroll event was set.
	 * 
	 * @return void
	 * @access public
	 * @since 8/25/05
	 */
	updateScroll = function () {
		this._scrollTarget.scrollXPercent = this._scrollTarget.getScrollXPercent();
		this._scrollTarget.scrollYPercent = this._scrollTarget.getScrollYPercent();
	}
	
	/**
	 * Answer true if the image is larger than the target area it will go in.
	 * 
	 * @return boolean
	 * @access public
	 * @since 8/25/05
	 */
	Media.prototype.isLargerThanTarget = function () {
		var targetHeight = getElementHeight(this.viewerElementId + '_media') - this.fitMargin;
		var targetWidth = getElementWidth(this.viewerElementId + '_media') - this.fitMargin;
		
		if (this.getHeightPx() < targetHeight && this.getWidthPx() < targetWidth)
			return false;
		else
			return true;
	}
	
	/**
	 * Clear the zoom level.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	Media.prototype.resetZoom = function () {
		// Do nothing. Override in children that can zoom.
	}

/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
ImageMedia.prototype = new Media();
ImageMedia.prototype.constructor = ImageMedia;
ImageMedia.superclass = Media.prototype;

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
function ImageMedia ( viewerElementId, mediaXMLNode) {
		
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
	ImageMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		ImageMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
		
		this.startAtZoomToFit = true;
		this.image = null;
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	ImageMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			var regex = new RegExp("^image(/[a-z]+)?$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;
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
	ImageMedia.prototype.display = function (mediaSize) {
		this.load();
		
		var html = "";
 		html += "<img";
 		html += " id='" + this.viewerElementId + "_image'";
 		html += " src='" + this.image.src.replace(/&/g, '&amp;') + "'/>";
 		
		var destination = getElementFromDocument(this.viewerElementId + '_media');
		destination.innerHTML = html;

		destination._scrollTarget = this;
		destination.onscroll = updateScroll;
		
		var image = getElementFromDocument(this.viewerElementId + '_image');
		image._scrollTarget = this;
		image.onclick = center;
		image.onmousemove = setCursor;
		
		// Wait for our image to load, and then set-up the initital position
		this.setUpPositionOnComplete()
	}
	
	/**
	 * Resize the image once it has finished loading
	 * 
	 * @return void
	 * @access public
	 * @since 1/05/06
	 */
	ImageMedia.prototype.setUpPositionOnComplete = function () {
		if (this.isComplete()) {
			this.setStartingPositionAndZoom();
		} else {
			if (!window.media_objects)
				window.media_objects = new Array();
			
			window.media_objects[this.url] = this;
			window.setTimeout('setUpPositionIfComplete("' + this.url + '");', 100);
		}
	}
	
	/**
	 * Resize the the media if it has been loaded.
	 * 
	 * @param string url
	 * @return void
	 * @access public
	 * @since 1/5/06
	 */
	function setUpPositionIfComplete (url) {
		var media_object = this.media_objects[url];
		
		if (media_object.isComplete()) {
			var loading = getElementFromDocument(media_object.viewerElementId + '_loading')
			loading.style.display = 'none'; 
			
			media_object.setStartingPositionAndZoom();
		} else {
			var loading = getElementFromDocument(media_object.viewerElementId + '_loading')
			loading.style.display = 'block'; 
			
			window.setTimeout('setUpPositionIfComplete("' + url + '");', 100);
		}
	}
	
	/**
	 * Answer true if the size of the image is known
	 * 
	 * @return boolean
	 * @access public
	 * @since 1/5/06
	 */
	ImageMedia.prototype.isComplete = function () {	
		if (this.height && this.height != "0px" 
			&& this.width && this.width != "0px")
		{
			return true;
		} else {
			return this.loadNaturalSize();
		}
	}
	
	/**
	 * Answer true if the image has finished loading (and has a non-zero height
	 * and width). Put the natural height in this object
	 * 
	 * @return boolean
	 * @access public
	 * @since 1/5/06
	 */
	ImageMedia.prototype.loadNaturalSize = function () {		
		var imageElement = getElementFromDocument(this.viewerElementId + '_image');
		
		if (imageElement.naturalHeight > 0 && imageElement.naturalWidth > 0) {
// 			alert ("imageElement.naturalHeight=" + imageElement.naturalHeight + 
// 				"imageElement.naturalWidth=" + imageElement.naturalWidth);
			this.height = imageElement.naturalHeight;
			this.width = imageElement.naturalWidth;
			return true;
		}
		
		// It seems that IE first returns invalid sizes in the
		// image itself, before it loads the image element with
		// the correct size.
		if (imageElement.complete && imageElement.height > 0 && imageElement.width > 0) {
// 			alert ("imageElement.height=" + imageElement.height
// 				+ "imageElement.width=" + imageElement.width);
			this.height = imageElement.height;
			this.width = imageElement.width;
			return true;
		}
		

		
		return false;
	}
	
	/**
	 * Set up the starting zoom and scroll.
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	ImageMedia.prototype.setStartingPositionAndZoom = function () {
		// If we haven't displayed this media yet, zoom to fit.
		if (this.startAtZoomToFit != null) {
			this.startAtZoomToFit = null;
			if (this.isLargerThanTarget()) {
				this.zoomToFit();
				return;
			}
		}
		
		var imageElement = getElementFromDocument(this.viewerElementId + '_image');
		imageElement.height = this.getZoomedHeightPx();
		imageElement.width = this.getZoomedWidthPx();
		imageElement.style.position = 'absolute';
		imageElement.style.top = this.getCenteredY() + "px";
		imageElement.style.left = this.getCenteredX() + "px";
		
		this.setScrollXPercent(this.scrollXPercent);
		this.setScrollYPercent(this.scrollYPercent);
	}
	
	/**
	 * Load and cache the image
	 * 
	 * @param string mediaSize
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	ImageMedia.prototype.load = function (mediaSize) {
		if (this.image == null) {
			this.image = new Image();
			this.image.src = this.url;
		}
	}
	
	/**
	 * unload and clear our image cache
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	ImageMedia.prototype.unload = function () {
		this.image = null;
	}
	
	/**
	 * Answer the distance X-direction from the edge of the image to the
	 * center of the scrolled window.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	ImageMedia.prototype.getScrollCenterX = function () {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		return target.scrollLeft + Math.round(target.clientWidth/2) + this.getCenteredX();
	}
	
	/**
	 * Answer the distance Y-direction from the edge of the image to the
	 * center of the scrolled window.
	 * 
	 * @return integer
	 * @access public
	 * @since 8/25/05
	 */
	ImageMedia.prototype.getScrollCenterY = function () {
		var target = getElementFromDocument(this.viewerElementId + '_media');
		return target.scrollTop + Math.round(target.clientHeight/2) + this.getCenteredY();
	}
	
	/**
	 * Center the image on the place where the mouse was clicked.
	 * 
	 * @return void
	 * @access public
	 * @since 9/15/05
	 */
	center = function (event) {
		var zoomIn = false;
		var zoomOut = false;
		
		if (event) {
			// Mozilla/Konqueror/Safari version
			var clickedX = event.layerX;
			var clickedY = event.layerY;
		} else {
			// IE version
			var event = window.event;
			var clickedX = window.event.offsetX;
			var clickedY = window.event.offsetY;
		}
	
		if (event.ctrlKey || event.metaKey) {
			if (event.shiftKey)
				zoomOut = true;
			else
				zoomIn = true;
		}
	
	
		var changeX = -(this._scrollTarget.getScrollCenterX() - clickedX);
		var changeY = -(this._scrollTarget.getScrollCenterY() - clickedY);
		
		
		var target = getElementFromDocument(this._scrollTarget.viewerElementId + '_media');
		
		if (target.scrollLeft >= 0
			&& target.scrollLeft <= (target.scrollWidth - target.clientWidth/2))
		{
			target.scrollLeft = target.scrollLeft + changeX;
			this._scrollTarget.scrollXPercent = (target.clientWidth/2 + target.scrollLeft)/target.scrollWidth;
		
		}
		
		if (target.scrollTop >= 0 
			&& target.scrollTop <= (target.scrollHeight - target.clientHeight/2))
		{
			target.scrollTop = target.scrollTop + changeY;
			this._scrollTarget.scrollYPercent = (target.clientHeight/2 + target.scrollTop)/target.scrollHeight;
		}
		
		if (zoomIn)
			this._scrollTarget.zoomIn();
		else if (zoomOut)
			this._scrollTarget.zoomOut();
	}

	/**
	 * Set the cursor based on the meta-keys pressed.
	 * 
	 * @return void
	 * @access public
	 * @since 9/15/05
	 */
	setCursor = function (event) {
		if (!event)
			event = window.event;
		
		if (event.ctrlKey || event.metaKey) {
			if (event.shiftKey)
				this.style.cursor = 'help';
			else
				this.style.cursor = 'crosshair';
		} else {
			this.style.cursor = 'default';
		}
	}
	
	/**
	 * Clear the zoom level.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	ImageMedia.prototype.resetZoom = function () {
		this.startAtZoomToFit = true;
		this.zoomLevel = 1;
	}
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
		html += " src='" + this.url.replace(/&/g, '&amp;') + "'";
		html += " href='" + this.url.replace(/&/g, '&amp;') + "'";
		html += " width='" + this.getZoomedWidthPx() + "px'";
		html += " height='" + (this.getZoomedHeightPx() + this.getControlHeight()) + "px'";
		html += " />";
		
		html += "<div id='" + this.viewerElementId + "_download_link' style='position: absolute;'>";
		html += "<a";
		html += " href='" + this.url.replace(/&/g, '&amp;') + "'>";
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
		html += " href='" + this.url.replace(/&/g, '&amp;') + "'>";
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
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
QuicktimeMedia.prototype = new VideoMedia();
QuicktimeMedia.prototype.constructor = QuicktimeMedia;
QuicktimeMedia.superclass = VideoMedia.prototype;

/**
 * The media class represents a media file in a slide. More information on 
 * embedding Quicktime in web pages can be found at:
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
function QuicktimeMedia ( viewerElementId, mediaXMLNode) {
		
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
	QuicktimeMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		QuicktimeMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	QuicktimeMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Quicktime MIME type
			var regex = new RegExp("^(video/quicktime)|(audio/(aac|x-aac))$", "i");
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
	 * Answer the height of the controls for this player
	 * 
	 * @return integer
	 * @access public
	 * @since 9/12/05
	 */
	QuicktimeMedia.prototype.getControlHeight = function () {
		return 16;
	}
	
	/**
	 * Answer the URL where the plugin can be downloaded
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	QuicktimeMedia.prototype.getPluginsPage = function () {
		return 'http://www.apple.com/quicktime/download/';
	}
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
WindowsMediaMedia.prototype = new VideoMedia();
WindowsMediaMedia.prototype.constructor = WindowsMediaMedia;
WindowsMediaMedia.superclass = VideoMedia.prototype;

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
function WindowsMediaMedia ( viewerElementId, mediaXMLNode) {
		
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
	WindowsMediaMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		WindowsMediaMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	WindowsMediaMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Quicktime MIME type
			var regex = new RegExp("^(video|audio)(/x-ms-[a-z]{2,3})?$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;

			if (typeElements[0].firstChild.nodeValue == "video"
				|| typeElements[0].firstChild.nodeValue == "audio") 
			{
				var urlElements = xmlNode.getElementsByTagName("url");
				var regex = new RegExp("^.+\.(asf|asx|wma|wmv|wax|wvx|wm|wmz|wmd)$", "i");
				if (regex.exec(urlElements[0].firstChild.nodeValue))
					return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Answer the height of the controls for this player
	 * 
	 * @return integer
	 * @access public
	 * @since 9/12/05
	 */
	WindowsMediaMedia.prototype.getControlHeight = function () {
		return 46;
	}
	
	/**
	 * Answer the URL where the plugin can be downloaded
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	WindowsMediaMedia.prototype.getPluginsPage = function () {
		return 'http://www.microsoft.com/Windows/MediaPlayer/';
	}
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
RealMedia.prototype = new VideoMedia();
RealMedia.prototype.constructor = RealMedia;
RealMedia.superclass = VideoMedia.prototype;

/**
 * The media class represents a RealNetworks media file in a slide.
 * For more information on the Real plugin, see:
 * http://service.real.com/help/library/guides/realone/ProductionGuide/HTML/realpgd.htm?page=htmfiles/embed.htm%23overview
 * 
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */
function RealMedia ( viewerElementId, mediaXMLNode) {
		
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
	RealMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		RealMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	RealMedia.prototype.supportsNode = function (xmlNode) {
		var typeElements = xmlNode.getElementsByTagName("type");
		if (typeElements.length > 0) {
			// Quicktime MIME type
			var regex = new RegExp("^(video|audio|application)/(vnd.rn|x-pn)-real(audio|video|media)$", "i");
			if (regex.exec(typeElements[0].firstChild.nodeValue))
				return true;

			if (typeElements[0].firstChild.nodeValue == "video"
				|| typeElements[0].firstChild.nodeValue == "audio"
				|| typeElements[0].firstChild.nodeValue == "application") 
			{
				var urlElements = xmlNode.getElementsByTagName("url");
				var regex = new RegExp("^.+\.(rm|rv|ra|ram)$", "i");
				if (regex.exec(urlElements[0].firstChild.nodeValue))
					return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Answer the height of the controls for this player
	 * 
	 * @return integer
	 * @access public
	 * @since 9/12/05
	 */
	RealMedia.prototype.getControlHeight = function () {
		return 66;
	}
	
	/**
	 * Answer the URL where the plugin can be downloaded
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	RealMedia.prototype.getPluginsPage = function () {
		return 'http://www.real.com/';
	}
	
	/**
	 * Answer additional attributes to add to the embed tag
	 * 
	 * @return string OR false
	 * @access public
	 * @since 9/12/05
	 */
	RealMedia.prototype.getAdditionalAttras = function () {
		return "type='audio/x-pn-realaudio-plugin' controls='ImageWindow,ControlPanel,StatusBar' maintainaspect='true'";
	}
/**
 * @since 8/23/05
 * @package viewer.js_library
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
FileMedia.prototype = new Media();
FileMedia.prototype.constructor = FileMedia;
FileMedia.superclass = Media.prototype;

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
function FileMedia ( viewerElementId, mediaXMLNode) {
		
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
	FileMedia.prototype.init = function ( viewerElementId, mediaXMLNode) {
		FileMedia.superclass.init.call(this, viewerElementId, mediaXMLNode);
	}
	
	/**
	 * Answer true if this media class supports the node passed
	 * 
	 * @param object Element xmlNode
	 * @return boolean
	 * @access public
	 * @since 9/12/05
	 */
	FileMedia.prototype.supportsNode = function (xmlNode) {
		return true;
	}/**
 * Run our slideshow
 * 
 * @access public
 * @since 8/22/05
 */
function runSlideShow (slideshowXML) {
	slideShow = new SlideShow();
	slideShow.loadXMLDoc(slideshowXML);
}

/**
 * Answer the element of the document by id.
 * 
 * @param string id
 * @return object The html element
 * @access public
 * @since 8/25/05
 */
function getElementFromDocument(id) {
	// Gecko, KHTML, Opera, IE6+
	if (document.getElementById) {
		return document.getElementById(id);
	}
	// IE 4-5
	if (document.all) {
		return document.all[id];
	}			
}

/**
 * Answer an array only the unique elements of the input array
 * 
 * @param array inputArray
 * @return array
 * @access public
 * @since 8/24/05
 */
function arrayUnique ( inputArray ) {
	var uniqueArray = new Array();
	var i = 0;
	for (var j = 0; j < inputArray.length; j++) {
		if (!inArray(inputArray[j], uniqueArray)) {
			uniqueArray[i] = inputArray[j];
			i++;
		}
	}
	return uniqueArray;
}

/**
 * Answer true if the value passed is in the array
 * 
 * @param mixed value
 * @param array array
 * @return boolean
 * @access public
 * @since 8/24/05
 */
function inArray ( value, array ) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == value)
			return true;
	}
	
	return false;
}


/**
 * Answer the pixel height of the specified element if availible. 
 * 
 * @param string elementId
 * @return string
 * @access public
 * @since 8/25/05
 */
function getElementHeight (elementId) {
	var element = getElementFromDocument(elementId);
	if (element == null || element.style.height == null)
		alert("Unknown height for element, '" + elementId + "'");
	return pixelsToInteger(element.style.height);
}

/**
 * Answer the pixel width of the specified element if availible. 
 * 
 * @param string elementId
 * @return string
 * @access public
 * @since 8/25/05
 */
function getElementWidth (elementId) {
	var element = getElementFromDocument(elementId);
	if (element == null || element.style.width ==null)
		alert("Unknown width for element, '" + elementId + "'");
	return pixelsToInteger(element.style.width);
}


/**
 * Answer the integer that corresponds tho the given pixel value.
 * strip of the 'px' component of the string.
 * 
 * @param string pixelString
 * @return integer
 * @access public
 * @since 8/25/05
 */
function pixelsToInteger (pixelString) {
	var sizeRegEx = new RegExp("^([0-9\.]+)(px)?$", "i");
	var sizeString = new String (pixelString);
	var matches = sizeString.match(sizeRegEx);
	if (matches)
		return new Number(matches[1]);
	else
		return 0;
}


/**
 * Inspect an object in a popup window
 * 
 * @param object object
 * @return void
 * @access public
 * @since 5/23/06
 */
function inspect (object) {
	var temp = "\n<div>Inspecting: " + object.constructor.toString() + "</div>";
	temp += "\n<table border='1'>";
	for (x in object)
		temp += "\n\t<tr>\n\t\t<td>" + x + "</td>\n\t\t<td style='white-space: pre'>" + object[x] + "</td>\n\t</tr>";
	temp += "\n</table>";
	
	var newWindow = window.open("", "_blank", "toolbar=no,location=no,directories=no,statusbar=no,scrollbars=yes,resizable=yes,width=800,height=800");
	newWindow.document.write(temp);
	newWindow.document.close();
	newWindow.focus();
}/**
 * The source of this file was downloaded from 
 *		http://www.alistapart.com/stories/alternate/
 * and was at the time of its inclusion here offered for use without restrictions.
 *
 *
 * @since 5/23/06
 * 
 * @author Paul Sowden (http://www.idontsmoke.co.uk/)
 * @copyright Copyright &copy; 1998-2006 A List Apart Magazine and the authors.
 *
 * @version $Id$
 */ 
function setActiveStyleSheet(title) {
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if(a.getAttribute("title") == title) a.disabled = false;
		}
	}
}

function getActiveStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
	}
	return null;
}

function getPreferredStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1
			 && a.getAttribute("rel").indexOf("alt") == -1
			 && a.getAttribute("title")
			 ) return a.getAttribute("title");
	}
	return null;
}

/**
 * Answer an array of all style sheets.
 *
 * @return array
 * @access public
 * @since 5/23/06
 * @author Adam Franco
 */
function getStyleSheets() {
	var i, a;
	var j = 0;
	var sheets = new Array();
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			sheets[j] = a.getAttribute("title");
			j++;
		}
	}
	return sheets;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

window.onload = function(e) {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredStyleSheet();
	setActiveStyleSheet(title);
}

window.onunload = function(e) {
	var title = getActiveStyleSheet();
	createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
