<?php
/**
 * This is the main control file for the viewer.
 * @since 8/22/05
 * @package viewer2
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */ 

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
		<style type="text/css">
			/* <![CDATA[ */
			span.hidden{
				display: none;
			}
			
			span.shown{
				display: inline;
				color: green;
				/*text-decoration: blink;*/
			}
			/* ]]> */
		</style>
		
		<script type='text/javascript'>
			/*<![CDATA[*/
			
			var slideShow;
			
			<?php require_once(dirname(__FILE__)."/main/js_library/show.class.js"); ?>
			
			<?php require_once(dirname(__FILE__)."/main/js_library/slide.class.js"); ?>
			
			<?php require_once(dirname(__FILE__)."/main/js_library/Media.class.js"); ?>
			
			<?php require_once(dirname(__FILE__)."/main/js_library/functions.js"); ?>
			
			/**
			 * Run our slideshow
			 * 
			 * @access public
			 * @since 8/22/05
			 */
			function runSlideShow () {
				slideShow = new SlideShow();
				slideShow.loadXMLDoc(
					'http://slug.middlebury.edu/~afranco/viewer2/SampleSlideShow.xml');
			}
			
			/*]]>*/
		</script>
		<title>Concerto: Browsing Exhibition *Turkey* </title>
	</head>
	<body onload='Javascript:runSlideShow()'>
		<div id='toolbars'>
			Toolbars
		</div>
		<div id='slide' />
		<span id="loading" class="hidden">loading...</span>
	</body>
</html>