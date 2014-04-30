<?php
    // Load Config Database File
    require_once("config/config_database_local.php");

    $ids = array(); //ids array
    $tarray = array(); //time array
    $darray = array(); //date array
    $qarray = array();  //flowrate array

    $results = array(); //results for each db table
    $names = array();   //gage names

    $id_rated_tables = array();
    $id_tables = array();

    //get streamflow alert ids from GET parameters
    //format rated table and table names for data retrieval
    $i=0;
    foreach ($_GET as $key => $value) { 
        $ids[$i] = $value;
        $id_rated_tables[$i] = "s".$value."_rated";
        $id_tables[$i] = "s".$value."_0" ;

        $darray[$i] = array();
        $qarray[$i] = array();
        $tarray[$i++] = array();
    }

    //connect to DB
    $mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
    //echo $mysqli->host_info . "\n";

    //number of gages
    $num_gages = count($ids);

    // Get the Sensor Names from the Database where the Sensor IDs Match
    $query = "SELECT S_SNAME FROM sensors WHERE";
    //create query string to retrieve names of all sensors from db
    for($i=0;$i<$num_gages;$i++){
        $query.= " S_ID = " . $ids[$i];
        if($i < $num_gages-1){
            $query .= " || ";
        }
    }
    $res = $mysqli->query($query);
    $i=0;
    while($row = $res->fetch_array()){
        $names[$i++] = $row['S_SNAME'];
    }

    //get data for each gage
    for($i=0; $i<$num_gages;$i++){
        $query = "Select * From " . $id_rated_tables[$i] . " Where T_TIME > DATE_ADD(now(),INTERVAL -30 DAY) ORDER BY T_TIME ASC";
        $results[$i] = $mysqli->query($query);

        //let's get the number of rows in our result so we can use it in a for loop
        $numofrows = $results[$i]->num_rows;
        
        for($j=0;$j<$numofrows;$j++){
            $row = $results[$i]->fetch_array();
            sscanf($row['T_TIME'],"%s %s",$darray[$i][$j],$tarray[$i][$j]);

            //******* Start Flow *******//
            sscanf($row['R_DATA'],"%f",$qarray[$i][$j]);// Get the data value out of the string
        }

    }
    //create data strings for highcharts plot
    $dataStrings = array();
    for($j=0;$j<$num_gages;$j++){
        for($i=0;$i<count($darray[$j]);$i++){
            sscanf($darray[$j][$i],"%d-%d-%d",$the_year,$the_month,$the_day);
            $new_date = sprintf("%d, %02d, %02d",$the_year,$the_month-1,$the_day);
            $dataStrings[$j].="  [Date.UTC(";
            $dataStrings[$j].=$new_date;// Print out the Date value
            $dataStrings[$j].=" ,";
            sscanf($tarray[$j][$i],"%d:%d:%d",$the_hour,$the_minute,$the_second) ;
            $new_time = sprintf("%d, %d, %d",$the_hour,$the_minute,$the_second) ;
            $dataStrings[$j].=$new_time ;
            $dataStrings[$j].="), ";

        //******* Start Flow *******//
           $the_data = sprintf("%5.2f",$qarray[$j][$i]);// Get the data value out of the string
           $dataStrings[$j].=$the_data;
           if ( $i < count($darray[$j])-1 ) {
              $dataStrings[$j].= "],\n";
           } else {
              $dataStrings[$j].="]\n";
           }
        //******* End FLOW *******//
        }
    }
?>

<script type='text/javascript'>
$(document).ready(function(){
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'multiPlot',
                type: 'spline',
                zoomType: 'x',
            },
            title: {
                text: 'flow rate data'
            },
            subtitle: {
                text: 'date goes here'
            },
            xAxis: {
                gridLineWidth: 1,
                gridLineDashStyle: 'dot',
                type: 'datetime',
                dateTimeLabelFormats: {
                    hour: '%I:%M %P',
                    minute: '%I %M'
                }
            },
            yAxis: {
                lineWidth:1,

                title: {
                    text: 'flow rate (cfs)'
                },
                min: 0
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                        radius: 2, // Marker Size
                        symbol: 'circle', // Marker Shape (Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down". Additionally, the URL to a graphic can be given on this form: "url(graphic.png)")
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [
            <?php
                for($i=0;$i<$num_gages;$i++){
                    echo "{ name: '". $names[$i] . "', data: [" . $dataStrings[$i] . "]}";
                    if($i<$num_gages-1){
                        echo ",";
                    }
                }
            ?>
            ]
        });
    });
</script>
       
