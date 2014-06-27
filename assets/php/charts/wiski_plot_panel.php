<script type = "text/javascript">

//get historic data 
var wkDataSetHistoric=[];
<?php

	 // Load Config Database File
    require_once("config/config_database_cube.php");
    $lastDay = '2010-12-31';
    $id = $_GET["id"]; //ids array
    $tarray = array(); //time array
    $darray = array(); //date array
    $qarray = array();  //flowrate array
    $results = array(); //results for each db table

    switch ($id) {
    case 5012:
        $name = "Coyote Ck below Coyote Reservoir";
    }
    
    if(array_key_exists('from', $_GET) && array_key_exists('to', $_GET)){
        $from = $_GET["from"];
        $to = $_GET["to"];
        $query = "Select * FROM 5012_q Where timestamp >= '" . $from . "'AND timestamp <= '" . $to . "'"; //limit 100000
    }else{
        $query = "Select * From 5012_q Where timestamp > DATE_ADD('" . $lastDay . "',INTERVAL -3 DAY) ORDER BY timestamp ASC LIMIT 500";
        
    }


    //get streamflow alert ids from GET parameters
    //format rated table and table names for data retrieval

    //connect to DB
    $mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
    //echo $mysqli->host_info . "\n";
    // Get the Sensor Names from the Database where the Sensor IDs Match
    //$query = "SELECT S_SNAME FROM sensors WHERE S_ID = " . $id;
    //create query string to retrieve names of all sensors from db
  //   $res = $mysqli->query($query);
 	// $row = $res->fetch_array();
  //   $name = $row['S_SNAME'];
    
    //focus period for testing 4.10-4.13
    //current day
    $interval = -1; //interval in days for historic data 
    //get data for each gage
    //$query = "Select * From 5012_q Where timestamp > DATE_ADD('" . $lastDay . "',INTERVAL -3 DAY) ORDER BY timestamp ASC LIMIT 500";
    $results = $mysqli->query($query);

    //let's get the number of rows in our result so we can use it in a for loop
    $numofrows = $results->num_rows;
    
    for($j=0;$j<$numofrows;$j++){
        $row = $results->fetch_array();
        sscanf($row['timestamp'],"%s %s",$darray[$j],$tarray[$j]);

        //******* Start Flow *******//
        sscanf($row['flowrate'],"%f",$qarray[$j]);// Get the data value out of the string
    }

    //create data strings for highcharts plot
    $dataString="";
    for($i=0;$i<count($darray);$i++){
        sscanf($darray[$i],"%d-%d-%d",$the_year,$the_month,$the_day);
        $new_date = sprintf("%d, %02d, %02d",$the_year,$the_month-1,$the_day);
        $dataString.="  [Date.UTC(";
        $dataString.=$new_date;// Print out the Date value
        $dataString.=" ,";
        sscanf($tarray[$i],"%d:%d:%d",$the_hour,$the_minute,$the_second) ;
        $new_time = sprintf("%d, %d, %d",$the_hour,$the_minute,$the_second) ;
        $dataString.=$new_time ;
        $dataString.="), ";

    //******* Start Flow *******//
       $the_data = sprintf("%5.2f",$qarray[$i]);// Get the data value out of the string
       $dataString.=$the_data;
       if ( $i < count($darray)-1 ) {
          $dataString.= "],\n";
       } else {
          $dataString.="]\n";
       }
    //******* End FLOW *******//
    }
?>
wkDataSetHistoric.push(<?php echo $dataString?>);
</script>
	<script type="text/javascript">
	var wkChart, dates, dateObj;
    var year, month, date, hour, minute;
    var now = new Date();


	$(document).ready(function(){
        wkChart = new Highcharts.Chart({
            chart: {
                renderTo: 'wkGagePlot',
                height: $(window).height()/2-100,
                //width: $('#fcGagePlot').width(),
                type: 'spline',
                zoomType: 'x'
                //marginTop: 0,
            },
            title:{
                text: "WISKI Data: <?php echo $name?>"
            },
            xAxis: {
                gridLineWidth: 1,
                gridLineDashStyle: 'dot',
                type: 'datetime',
                // dateTimeLabelFormats: {
                //     hour: '%I:%M %P',
                //     minute: '%I %M',
                //     year: '%Y'
                // },
                min: wkDataSetHistoric[0][0]
            },
            yAxis: {
                lineWidth:1,
                title: {
                    text: 'flow rate (cfs)'
                },
                min: 0,
                minRange:0.1
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle"
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    //workaround for legend item click bug
                    events: {
                        legendItemClick: function(event) {
                            return false;
                        }
                    },
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
            series: [{
                name: "Historic",
                color: '#0000FF',
                data:wkDataSetHistoric
            }]
        });
    });

	function getDates(){
		//var now = new Date();
		var today = now.getDate();
		var yesterday = today - 1;
		var fc1 = today+1; //forecast day 1
		var fc2 = today+2;

		var ret_dates = { today: today, 
			yesterday: yesterday, 
			fc1: fc1, 
			fc2: fc2}

		return ret_dates;
	}
	</script>