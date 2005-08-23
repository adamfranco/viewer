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
	var slides;
	var currentIndex = 0;
	var tmp = 'hi';
	this.tmp = tmp;
	
	var me = this;
	this.loadXMLDoc = loadXMLDoc;
	this.display = display;
	this.next = next;
	this.previous = previous;
	this.processReqChange = processReqChange;
	this.createSlides = createSlides;
	this.cacheAround = cacheAround;
	
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
		slideElements = xmlDocument.getElementsByTagName('slide');
		slides = new Array(slideElements.length);
		for (i=0; i < slideElements.length; i++) {			
			slides[i] = new Slide(slideElements.item(i));
		}
		
		this.display();
		this.cacheAround(currentIndex);
	}
	
	/**
	 * Display the current slide
	 * 
	 * @return void
	 * @access public
	 * @since 8/22/05
	 */
	function display () {
		destination = getElementFromDocument('toolbars');
		
		destination.innerHTML = "\n<br/>Slide Number: " + (currentIndex + 1);
		destination.innerHTML += " of: " + slides.length;
		
		var previousDisabled = "";
		var nextDisabled = "";
		if (currentIndex <= 0)
			previousDisabled = " disabled='disabled'";
		if (currentIndex >= (slides.length - 1))
			nextDisabled = " disabled='disabled'";
			
		destination.innerHTML += "<input" + previousDisabled + " type='button' onclick='Javascript:slideShow.previous()' value='previous'/>";
		destination.innerHTML += "<input" + nextDisabled + " type='button' onclick='Javascript:slideShow.next()' value='next'/>";
		
		slides[currentIndex].display();
	}
	
	/**
	 * Advance to the next slide and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function next () {
		currentIndex++;
		this.display();
		
		this.cacheAround(currentIndex);
	}
	
	/**
	 * Go back to the previous slide and display it.
	 * 
	 * @return void
	 * @access public
	 * @since 8/23/05
	 */
	function previous () {
		currentIndex--;
		this.display();
		
		this.cacheAround(currentIndex);
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
		for (i = index + 1; (i <= (index + numToCacheAhead) && (i < slides.length)); i++) {
			slides[i].load();
		}
		for (i = index - 1; (i >= (index - numToCacheBehind) && (i >= 0)); i--) {
			slides[i].load();
		}
		
		// unload the excess images
		for (i = (index + numToCacheAhead + 1); i < slides.length; i++) {
			slides[i].unload();
		}
		for (i = (index - numToCacheBehind - 1); i >= 0; i--) {
			slides[i].unload();
		}
	}
}

