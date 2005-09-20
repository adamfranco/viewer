<?php
/**
 * This file combines all of the javascript files together into one file for
 * reference from an HTML/XHTML file. Put the following lines in the <head>
 * section of your HTML file to provide access to the viewer classes:
 *
 *		<script type='text/javascript' src='viewer.js.php'></script>
 *
 * As well, you should also add the following lines the head section to import 
 * one or more style sheets for the viewer to give you nice icons instead of html 
 * buttons.
 *
 * One style-sheet:
 *
 *		<link rel="stylesheet" type="text/css" href="main/themes/white/style.css"/>
 *
 * Multiple style-sheets (user-selection supported by Mozilla/Gecko browsers):
 * 
 *		<link rel="stylesheet" type="text/css" href="main/themes/white/style.css" title="White"/>
 *		<link rel="alternate stylesheet" type="text/css" href="main/themes/black/style.css" title="Black"/>
 *
 *
 * @since 9/9/05
 * @package viewer
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 
 
header('Content-type: application/x-javascript');


require_once(dirname(__FILE__)."/main/js_library/Show.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/Slide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextLeftSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextRightSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextBottomSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextTopSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/MediaContainer.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/Media.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/ImageMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/VideoMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/QuicktimeMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/WindowsMediaMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/RealMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/FileMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/functions.js");


?>