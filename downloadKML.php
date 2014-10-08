<?php
    $station = $_GET['station'];
    $layer = $_GET['layer'];
    $fullPath = "C:\\xampp\\htdocs\\scvwd\\app_beta_ALERTC_config\\ff\\assets\\kml\\" . $station . "\\" . $layer . ".kml";
    
    $fd = fopen("$fullPath", "r");
    if ($fd = fopen ($fullPath, "r")) {
        $fsize = filesize($fullPath);
        $path_parts = pathinfo($fullPath);
        // header("Content-type: application/octet-stream");
        header("Content-type: text/plain"); //this header makes the save dialog box appear
    	header("Content-Disposition: attachment; filename=\"" . $layer . ".kml\"");
    	header("Content-length: $fsize");
    	header("Cache-control: private"); //
            
        while(!feof($fd)) {
            $buffer = fread($fd, 2048);
            echo $buffer;
        }
    }
    fclose ($fd);
    exit;
?>