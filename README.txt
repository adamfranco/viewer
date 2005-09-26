|-------------------------------------------------------|
|                                                       |
| Concerto Viewer version 2.x                           |
|                                                       |
|-------------------------------------------------------|

I. About
II. License
III. Usage
	1. Stand-Alone Viewer
	2. Included Viewer

---------------------
| I. About
---------------------
This package is released as part of the Concerto project. Please visit 
	http://sourceforge.net/projects/concerto 
for updates and more information.

This package was developed by Adam Franco (Educational Technology, Middlebury College) in conjunction with the rest of the Concerto and Harmoni projects.

(c)2005 Middlebury College


---------------------
| II. License
---------------------
GNU General Public License (GPL) http://www.gnu.org/copyleft/gpl.html
See the LICENSE.txt text file for text of the license.


---------------------
| III. Usage of this package
---------------------

This package can be used in two ways:
	1. As a stand-alone application (requires PHP)
	2. Included in another application's [X]HTML (PHP optional)
	

 ---------------------
 | 1. Stand-alone viewer
 ---------------------
 
 

 ---------------------
 | 2. Included viewer
 ---------------------

As an alternative to stand-alone usage, the viewer can also be placed directly into any HTML file. The Viewer is made up of a self-contained Javascript library and some (optional) style-sheets to theme the result, both included in the <head> element. One or more viewers can be put on a page by placing div tags in the body of the HTML file, giving each a unique id, the class 'viewer', and size/position styles. A Javascript command for each viewer in the <body> tag's 'onload' attribute will create and run each viewer.

Put the following lines in the <head> section of your HTML file to provide access to the viewer classes:

	<script type='text/javascript' src='viewer.js'></script>


As well, you should also add the following lines the head section to import one or more style sheets for the viewer to give you nice icons instead of html buttons.

One style-sheet:

	<link rel="stylesheet" type="text/css" href="main/themes/white/style.css"/>

Multiple style-sheets (user-selection supported by Mozilla/Gecko browsers):

	<link rel="stylesheet" type="text/css" href="main/themes/white/style.css" title="White"/>
	<link rel="alternate stylesheet" type="text/css" href="main/themes/black/style.css" title="Black"/>


Somewhere in the body of your HTML you need to put a div element in which the viewer will be placed. This div element should have class, 'viewer', and a unique id. You should specify both the height and width via CSS. As well, it is important that you nest the viewer div inside another div element. The viewer will force the 'position' style of its div element to 'relative' in order to acomidate its absolutely positioned children. If the viewer element is not nested inside another div it may cover up subsequent content. An example is below:
	
	<div>
		<div id='viewerA' class='viewer' style='height: 500px; width: 650px; position: relative;' />
	</div>


Finally, to create the viewer you must place the following Javascript command in your HTML with the id of your viewer element and the URL of your source XML file as arguments:

	Javascript:new SlideShow('viewerA', 'http://www.example.edu/slideshow.xml');

This line is customarily put in the <body> tag's 'onload' attribute to start the viewer when the page is loaded:
	
	<body onload="Javascript:new SlideShow('viewerA', 'http://www.example.edu/slideshow.xml');">

Alternatively, the command could be placed in a button's 'onclick' attribute to start the slideshow when a button was clicked.

Please look at the following files in the sample/ subdirectory for examples:
	example1.html
	example2.html
