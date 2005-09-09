<?php
/**
 * This file combines all of the javascript files together into one file for
 * inclusion into <script> tags or other external referencing.
 * 
 * @since 9/9/05
 * @package viewer
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 


require_once(dirname(__FILE__)."/main/js_library/Show.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/Slide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextLeftSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextRightSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextBottomSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/Slide/TextTopSlide.class.js");

require_once(dirname(__FILE__)."/main/js_library/MediaContainer.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/Media.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/ImageMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/AudioMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/VideoMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/Media/FileMedia.class.js");

require_once(dirname(__FILE__)."/main/js_library/functions.js");


?>