<?php
/**
 * This file acts as a stand-alone viewer program and loads a slideshow with
 * the contents of the URL to an XML file as its source data, or a sample
 * slideshow if no XML file is specified. the name of the desired theme
 * subdirectory can also be passed.
 *
 * Example Usage (without theme specified):
 *		http://www.mydomain.edu/viewer/index.php?source=http://www.mydomain.edu/slideshow.xml
 *
 * Example Usage (with theme specified):
 *		http://www.mydomain.edu/viewer/index.php?source=http://www.mydomain.edu/slideshow.xml&theme=black
 * 
 * Additionally, a 'themesource' parameter allows for the usage of an arbitrary
 * style-sheet to use for theming the viewer.
 *
 * Example Usage (with themesource specified):
 *		http://www.mydomain.edu/viewer/index.php?source=http://www.mydomain.edu/slideshow.xml&themesource==http://www.mydomain.edu/mytheme.css
 * 
 *
 *
 *
 * @since 8/22/05
 * @package viewer2
 * 
 * @copyright Copyright &copy; 2005, Middlebury College
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License (GPL)
 *
 * @version $Id$
 */

$themeURL = null;
$defaultTheme = null;
$themes = array();

// XML File URL
if (isset($_REQUEST['source']))
	$sourceURL = urldecode($_REQUEST['source']);
else
	$sourceURL = dirname($_SERVER['PHP_SELF'])."/sample/slideshow.xml";


// Themes
if (isset($_REQUEST['themesource']))
	$themeURL = urldecode($_REQUEST['themesource']);
else {
	if (isset($_REQUEST['theme']))
		$defaultTheme = $_REQUEST['theme'];
	else
		$defaultTheme = 'black';
}

if ($handle = opendir(dirname(__FILE__)."/main/themes")) {
	while (false !== ($file = readdir($handle))) {
		if ($file != "." 
			&& $file != ".."
			&& is_dir(dirname(__FILE__)."/main/themes/".$file)
			&& file_exists(dirname(__FILE__)."/main/themes/".$file."/style.css")) 
		{
			$themes[$file] = dirname($_SERVER['PHP_SELF'])."/main/themes/".$file."/style.css";
		}
	}
	closedir($handle);
}
ksort($themes);	


if (isset($_REQUEST['start'])) {
	$startingSlide = intval($_REQUEST['start']);
} else {
	$startingSlide = 0;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang='en'>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
		<!-- Default Title, will be overwritten via javascript. -->
		<title>Concerto Viewer</title>
<?php

// Default Theme
if (isset($themeURL)) {
	print "\t\t<link rel='stylesheet' type='text/css' href='".$themeURL."'/>\n";
} else {
	print "\t\t<link rel='stylesheet' type='text/css' href='".$themes[$defaultTheme]."' title='".$defaultTheme."'/>\n";
}

// Alternate Themes
foreach ($themes as $name => $url) {
	if ($name != $defaultTheme)
		print "\t\t<link rel='alternate stylesheet' type='text/css' href='".$themes[$name]."' title='".$name."'/>\n";
}


?>
		<style type='text/css'>
			.viewer {
				border: 0px;
			}
		</style>
		
		<script type='text/javascript' src='viewer.js.php'></script>
		
		<script type='text/javascript'>
			/*<![CDATA[*/
			
			function resizeToWindow() {
				var viewerDiv = getElementFromDocument('viewerA');
				
				// Mozilla version
				if (typeof(window.innerHeight) == 'number') {
					viewerDiv.style.height = (window.innerHeight - 19) + "px";
					viewerDiv.style.width = (window.innerWidth - 14) + "px";
				}
				
				// IE 6 'standards complient mode' version
				else if (document.documentElement
					&& (document.documentElement.clientHeight || document.documentElement.clientWidth)) 
				{
					viewerDiv.style.height = (document.documentElement.clientHeight - 4) + "px";
					viewerDiv.style.width = (document.documentElement.clientWidth - 14) + "px";
				}
				
				// IE 4,5,6
				else if(document.body 
					&& (document.body.clientWidth || document.body.clientHeight)) 
				{
					viewerDiv.style.height = (document.body.clientHeight - 4) + "px";
					viewerDiv.style.width = (document.body.clientWidth - 14) + "px";
				}
				
				// If we still haven't matched, we can't determine the window
				// height, so lets just return
				else {
					return;
				}
				
				// If we have a loaded slideshow, tell it to resize itself to the
				// new size.
				if (viewerDiv._slideShow) {
					viewerDiv._slideShow.reloadSizes();
				}
			}
			
			// set the window's resize event here since it is XHTML 1.0 does not
			// allow the body element to have an onresize attribute;
			window.onresize = resizeToWindow;
			
			/*]]>*/
		</script>
	</head>
	<body onload="Javascript:resizeToWindow(); var show = new SlideShow('viewerA', '<?php print $sourceURL; ?>', <?php print $startingSlide; ?>, true);" style='margin: 0px; padding: 0px;'>
		<div id='viewerA' class='viewer' style='height: 500px; width: 650px; position: relative; margin-left: 5px; margin-right: 5px;' />
		<noscript>
			<div style='margin: 20px;'>
				<h2>Error: JavaScript not available in your browser</h2>
				<p>
					Javascript must be enabled in your browser to view this slideshow.
				</p>
				<ul>
					<li><strong>Mozilla/Firefox</strong> - This option is called <em>Enable JavaScript</em> and is located under:<br/><em>Preferences</em> --&gt; <em>Web Features</em></li>
					<li><strong>Safari</strong> - This option is called <em>Enable JavaScript</em> and is located under:<br/><em>Preferences</em> --&gt; <em>Security</em> --&gt; <em>Web Content</em></li>
					<li><strong>Opera</strong> - This option is called <em>Enable JavaScript</em> and is located under:<br/><em>Preferences</em> --&gt; <em>Advanced</em> --&gt; <em>Content</em></li>
					<li><strong>Internet Explorer</strong> - This option is called <em>Active scripting</em> and is located under:<br/><em>Internet Options</em> --&gt; <em>Security</em> --&gt; <em>Custom Level</em> --&gt; <em>Scripting</em></li>
				</ul>
				<p style='margin: 20px;'>
					Please enable JavaScript in your browser and reload this page. <br/>If you browser does not support JavaScript, please try this page with one of the browsers listed above or another modern browser.
				</p>
			</div>
		</noscript>
	</body>
</html>