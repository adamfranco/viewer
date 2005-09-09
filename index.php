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
			.loading{
				color: green;
				text-decoration: blink;
			}
			
			.toolbar {
				border-bottom: 1px solid #500;
			}
			
			.viewer {
				 border: 1px solid #500;
			}
			

			
			/* ]]> */
		</style>
		
		<script type='text/javascript'>
			/*<![CDATA[*/
						
			<?php require_once(dirname(__FILE__)."/viewer.js.php"); ?>
			
			/*]]>*/
		</script>
		<title>Concerto: Browsing Exhibition *Turkey* </title>
	</head>
	<body onload="Javascript:new SlideShow('viewerA', 'http://slug.middlebury.edu/~afranco/viewer2/SampleSlideShow.xml'); new SlideShow('viewerB', 'http://slug.middlebury.edu/~afranco/viewer2/SampleSlideShow.xml');">
		<div style='border: 2px dashed #0aa'>
			<div id='viewerA' class='viewer' style='height: 500px; width: 600px; position: relative;' />
		</div>
		<div style='border: 2px dashed #0aa'>
			<div id='viewerB' class='viewer' style='height: 500px; width: 600px; position: relative;' />
		</div>
	</body>
</html>