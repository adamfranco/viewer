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
			
		/*********************************************************
		 * General styles
		 *********************************************************/
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
			
		
		/*********************************************************
		 * Button image-replacements.
		 * Use text-indent to hide the button text
		 *********************************************************/
		 	
		 	.button {
		 		width: 20px;
				height: 20px;
				
		 		margin: 0;
				padding: 0;
				margin-left: 3px;
				border: 0;
				vertical-align: middle;
				
				text-indent: -1000em;
				
		 		cursor: pointer; /* hand-shaped cursor */
				cursor: hand; /* for IE 5.x */
		 	}
			
			.tostart_button {
				background-image: url(main/images/viewer_back_full.gif);
			}
			
			.previous_button {
				background-image: url(main/images/viewer_back.gif);
			}
			
			.next_button {
				background: url(main/images/viewer_forward.gif);
			}
			
			.toend_button {
				background: url(main/images/viewer_forward_full.gif);
			}
			
			.zoomin_button {
				width: 16px;
				height: 16px;
				background-image: url(main/images/zoom_in.gif);				
			}
			
			.zoomout_button {
				width: 16px;
				height: 16px;
				background-image: url(main/images/zoom_out.gif);				
			}
			
			.zoom100_button {
				width: 33px;
				height: 26px;
				background-image: url(main/images/100pc.gif);				
			}
			
			.zoomfit_button {
				width: 26px;
				height: 26px;
				background-image: url(main/images/fit.gif);				
			}
			
			.controls_button {
				width: 50px;
				height: 25px;
				background-image: url(main/images/show.gif);				
			}
			
			.close_controls_button {
				width: 50px;
				height: 25px;
				background-image: url(main/images/hide.gif);				
			}
			
			.play_button {
				width: 24px;
				height: 24px;
				background-image: url(main/images/play.gif);
			}
			
			.play_button[disabled] {
				background-image: url(main/images/play2.gif);
			}
			
			.pause_button {
				width: 24px;
				height: 24px;
				background-image: url(main/images/pause.gif);
			}
			
			.pause_button[disabled] {
				background-image: url(main/images/pause2.gif);
			}
			
			.once_button {
				width: 24px;
				height: 24px;
				background-image: url(main/images/hide.gif);
			}
			
			.loop_button {
				width: 24px;
				height: 24px;
				background-image: url(main/images/play.gif);
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
	<body onload="Javascript:new SlideShow('viewerA', 'http://slug.middlebury.edu/~afranco/viewer2/SampleSlideShow.xml');">
		<div style='border: 2px dashed #0aa'>
			<div id='viewerA' class='viewer' style='height: 500px; width: 650px; position: relative;' />
		</div>
<!-- 
		<div style='border: 2px dashed #0aa'>
			<div id='viewerB' class='viewer' style='height: 500px; width: 600px; position: relative;' />
		</div>
 -->
	</body>
</html>