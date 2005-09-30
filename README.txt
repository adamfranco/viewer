|-------------------------------------------------------|
|                                                       |
| Concerto Viewer version 2.0.1                         |
|                                                       |
|-------------------------------------------------------|

1. About
2. License
3. Usage
	A. Stand-Alone Viewer
	B. Included Viewer
4. Changelog



---------------------
| 1. About
---------------------
This package is released as part of the Concerto project. Please
visit 
	http://sourceforge.net/projects/concerto
	http://concerto.sourceforge.net
for updates and more information.

This package was developed by Adam Franco (Educational Technology,
Middlebury College) in conjunction with the rest of the Concerto and
Harmoni projects.

Copyright (c) 2005 Middlebury College




---------------------
| 2. License
---------------------
GNU General Public License (GPL) 
http://www.gnu.org/copyleft/gpl.html
See the LICENSE.txt text file for text of the license.




---------------------
| 3. Usage of this package
---------------------

This package can be used in two ways:
	A. As a stand-alone application (requires PHP)
	B. Included in another application's [X]HTML (PHP optional)
	



	---------------------
	| 3. Usage of this package
	|		A. Stand-alone viewer
	---------------------
	
	If PHP is availible on your webserver, you can run the viewer as a
	stand-alone application.
	
	The 'index.php' file is a PHP script which creates an XHTML page with
	a viewer as its only element. As well, the script will resize the
	viewer to fit the entire browser-window.
	
	To test the stand-alone viewer with a sample slideshow, simply point
	your browser at the 'index.php' file in this directory.
	
	To open the viewer with a particular slideshow, pass the URL
	(relative or absolute) of your slideshow XML file to the viewer as
	the 'source' parameter:
	
		index.php?source=sample/slideshow.xml
	
	As well, you can specify which of the included themes you wish to use
	as the default:
	
		index.php?source=sample/slideshow.xml&theme=blue
	
	Alternatively, you can specify the URL of your own style-sheet to use
	instead of the included ones:
		
		index.php?source=sample/slideshow.xml&themesource=main/themes/black/style.css
	
	You can also use Javascript to open a new window with no menues,
	location bar, etc. Please see the example4.html file for an example
	of this:
		
		samples/example4.html
	
	
	
	
	---------------------
	| 3. Usage of this package
	|		B. Included viewer
	---------------------
	
	As an alternative to stand-alone usage, the viewer can also be placed
	directly into any HTML file. 
	
	The Viewer is made up of a self-contained Javascript library and some
	(optional) style-sheets to theme the result. Both should be included
	in the <head> element of your HTML document. One or more viewers can
	be put on a page by placing div tags in the body of the HTML
	document, giving each a unique id, the class 'viewer', and
	size/position styles. A Javascript command for each viewer in the
	<body> tag's 'onload' attribute will create and run each viewer.
	
	Put the following lines in the <head> section of your HTML document
	to provide access to the viewer classes:
	
		<script type='text/javascript' src='viewer.js'></script>
	
	
	As well, you should also add the following lines the head section to
	import one or more style sheets for the viewer to give you nice icons
	instead of html buttons.
	
	One style-sheet:
	
		<link rel="stylesheet" type="text/css" href="main/themes/white/style.css"/>
	
	Multiple style-sheets (user-selection supported by Mozilla/Gecko
	browsers):
	
		<link rel="stylesheet" type="text/css" href="main/themes/white/style.css" title="White"/>
		<link rel="alternate stylesheet" type="text/css" href="main/themes/black/style.css" title="Black"/>
	
	
	Somewhere in the body of your HTML document you need to put a div
	element in which the viewer will be placed. This div element should
	have class, 'viewer', and a unique id. You should specify both the
	height and width via CSS. As well, it is important that you nest the
	viewer div inside another div element. The viewer will force the
	'position' style of its div element to 'relative' in order to
	acomidate its absolutely positioned children. If the viewer element
	is not nested inside another div it may cover up subsequent content.
	An example is below:
		
		<div>
			<div id='viewerA' class='viewer' style='height: 500px; width: 650px; position: relative;' />
		</div>
	
	
	Finally, to create the viewer you must place the following Javascript
	command in your HTML with the id of your viewer element and the URL
	of your source XML file as arguments:
	
		Javascript:new SlideShow('viewerA',	'http://www.example.edu/slideshow.xml');
	
	This line is customarily put in the <body> tag's 'onload' attribute
	to start the viewer when the page is loaded:
		
		<body onload="Javascript:new SlideShow('viewerA', 'http://www.example.edu/slideshow.xml');">
	
	Alternatively, the command could be placed in a button's 'onclick'
	attribute to start the slideshow when a button was clicked.
	
	Please look at the following files in the 'sample/' subdirectory for
	examples:
		sample/example1.html
		sample/example2.html
		sample/example3.html




---------------------
| 4. Changelog
---------------------

******************************
Version 2.0.1
The Nebulous Future...
------------------------------
 - Now uses urldecode to support url-encoded source and theme urls that may 
   contain &'s and parameters themselves.
 - Now text-left/right/top/bottom slides  now don't throw errors if no media are
   given.
 - Now allows for text-only and media-only slides, both centered on the viewer.
 - Added a default "title" and "noscript" elements to the stand-alone viewer to improve
   accessibility.
   

******************************
Version 2.0.0
2005-09-26
------------------------------
 - No changes as this is the first release of Viewer 2.
 
 - Major differences between Viewer 2 and Viewer 1 are below:
 	- Now doesn't require PHP
 	- Now fully object-oriented Javascript
 	- Slideshow definition is now up to the user, no more 'input modules'.
 	- Now uses an XML file for the Slideshow source.
 	- Can now be included into an [X]HTML document.
 	- All theming is done via CSS
 	- Can be used without CSS support
 	- User-specified themes/style-sheets can be used.
