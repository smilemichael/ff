<?php
    $station = $_GET['station'];
    $layers = $_GET['layers'];
    $layerArray = explode(",", $layers);
    // $fullPath = "C:\\xampp\\htdocs\\scvwd\\app_beta_ALERTC_config\\ff\\assets\\kml\\" . $station . "\\" . $layer . ".kml";
    $fullPath = "C:\\xampp\\htdocs\\scvwd\\app_beta_ALERTC_config\\ff\\assets\\kml\\" . $station ."\\";

    //investigate using geoservers kml reflector
    //i.e. http://alertd:8080/geoserver/wms/kml?layers=scvwd:51_Cherry_100cfs
    echo "full path: " . $fullPath;
    echo "<br/>";
    echo "station: " . $station;
    echo "<br/>";
    echo "layers: " . $layers;
    echo "<br/>";
    echo "count layers array: " . count($layerArray) . "<br/>";
    $files_to_zip = array();
    for($i=0;$i<count($layerArray);$i++){
        // echo "layer " . $i . ": " . $layerArray[$i] . "<br/>";
        array_push($files_to_zip, $fullPath . $layerArray[$i] . ".kml");
    }
    print_r($files_to_zip);
    // $fd = fopen("$fullPath", "r");
    // if ($fd = fopen ($fullPath, "r")) {
    //     $fsize = filesize($fullPath);
    //     $path_parts = pathinfo($fullPath);
    //     // header("Content-type: application/octet-stream");
    //     header("Content-type: text/plain"); //this header makes the save dialog box appear
    // 	// header("Content-Disposition: attachment; filename=\"" . $layer . ".kml\"");
    //     header("Content-Disposition: attachment; filename=\"" . $layer . ".kml\"");

    // 	header("Content-length: $fsize");
    // 	header("Cache-control: private"); //
            
    //     while(!feof($fd)) {
    //         $buffer = fread($fd, 2048);
    //         echo $buffer;
    //     }
    // }
    // fclose ($fd);
    // exit;

    /* creates a compressed zip file */
function create_zip($files = array(),$destination = '',$overwrite = false) {
    //if the zip file already exists and overwrite is false, return false
    // if(file_exists($destination) && !$overwrite) { return false; }
    //vars
    $valid_files = array();
    //if files were passed in...
    if(is_array($files)) {
        //cycle through each file
        foreach($files as $file) {
            //make sure the file exists
            if(file_exists($file)) {
                $valid_files[] = $file;
            }
        }
    }
    //if we have good files...
    if(count($valid_files)) {
        //create the archive
        $zip = new ZipArchive();
        if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
            return false;
        }
        //add the files
        foreach($valid_files as $file) {
            $zip->addFile($file,$file);
        }
        //debug
        //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
        
        //close the zip -- done!
        $zip->close();
        // return file_exists($destination);
        
        //send zip data to client
        if ($fd = fopen ($destination, "r")) {
            $fsize = filesize($destination);
            $path_parts = pathinfo($destination);
            //http headers
            header("Content-type: application/octet-stream");
            // header("Content-type: text/plain"); //this header makes the save dialog box appear
            // header("Content-Disposition: attachment; filename=\"" . $layer . ".kml\"");
            header("Content-Disposition: attachment; filename=\"kml.zip\"");
            header('Content-Transfer-Encoding: binary');
            header("Content-length: $fsize");
            header("Cache-control: private"); 
            header("Pragma: public");


            ob_clean();
            flush();
            // while(!feof($fd)) {
            //     $buffer = fread($fd, 2048);
            //     echo $buffer;
            // }
            echo readfile("$destination");
        }
        fclose ($fd);

        //remove zip file from server
        unlink($destination);
        return 1;
    }
    else
    {
        return false;
    }
}


//if true, good; if false, zip creation failed
$result = create_zip($files_to_zip,'my-archive.zip');
?>