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
	$sourceURL = $_REQUEST['source'];
else
	$sourceURL = dirname($_SERVER['PHP_SELF'])."/sample/slideshow.xml";


// Themes
if (isset($_REQUEST['themesource']))
	$themeURL = $_REQUEST['themesource'];
else {
	if (isset($_REQUEST['theme']))
		$defaultTheme = $_REQUEST['theme'];
	else
		$defaultTheme = 'white';
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


?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
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

		<script type='text/javascript' src='viewer.js.php'></script>
		
		<title>Concerto Image Viewer</title>
	</head>
	<body onload="Javascript:new SlideShow('viewerA', '<?php print $sourceURL; ?>');">
		<div id='viewerA' class='viewer' style='height: 500px; width: 650px; position: relative;' />
	</body>
</html>