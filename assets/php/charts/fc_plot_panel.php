<script type = "text/javascript">

//get historic data 
var dataSetHistoric=[];
<?php

	 // Load Config Database File
    require_once("config/config_database.php");

    $id = $_GET["id"]; //ids array
    $tarray = array(); //time array
    $darray = array(); //date array
    $qarray = array();  //flowrate array

    $results = array(); //results for each db table

    //get streamflow alert ids from GET parameters
    //format rated table and table names for data retrieval
    $id_rated_table= "s".$id."_rated";
    $id_table = "s".$id."_0" ;

    //connect to DB
    $mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
    //echo $mysqli->host_info . "\n";
    // Get the Sensor Names from the Database where the Sensor IDs Match
    $query = "SELECT S_SNAME FROM sensors WHERE S_ID = " . $id;
    //create query string to retrieve names of all sensors from db
    $res = $mysqli->query($query);
 	$row = $res->fetch_array();
    $name = $row['S_SNAME'];
    
    //focus period for testing 4.10-4.13
    //current day
    //$now = '2014-04-11';
    $interval = -1; //interval in days for historic data 
    //get data for each gage
    $query = "Select * From " . $id_rated_table . " Where T_TIME > DATE_ADD(now(),INTERVAL -1 DAY) ORDER BY T_TIME ASC";
    $results = $mysqli->query($query);

    //let's get the number of rows in our result so we can use it in a for loop
    $numofrows = $results->num_rows;
    
    for($j=0;$j<$numofrows;$j++){
        $row = $results->fetch_array();
        sscanf($row['T_TIME'],"%s %s",$darray[$j],$tarray[$j]);

        //******* Start Flow *******//
        sscanf($row['R_DATA'],"%f",$qarray[$j]);// Get the data value out of the string
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
dataSetHistoric.push(<?php echo $dataString?>);
</script>

	<?php
        switch ($id) {
            case 2058:
                echo "<script src=\"assets/py/51.js\"></script>";
                break;
            case 1543:
                echo "<script src=\"assets/py/93.js\"></script>";

        }
    ?>
	<script type="text/javascript">
	var chart, dates, dateObj;
    var dataSetForecast =[];
    var year, month, date, hour, minute;
    var now = new Date();

    //subtract 7 from now to get Pacific ST for Highcharts bug fix
    now.setHours(now.getHours()-7);
    //now = now.toUTCString();
    for(var i = 0; i < FlowAndTime.length; i++){
        //month is single digit 
        if(FlowAndTime[i].x.length == 15){
            year = FlowAndTime[i].x.substring(5, 9);
            month = FlowAndTime[i].x.substring(0, 1)-1;
            date = FlowAndTime[i].x.substring(2, 4);
            hour = FlowAndTime[i].x.substring(10, 12);
            minute = FlowAndTime[i].x.substring(13, 15);
            //alert(minute);
            rate=FlowAndTime[i].y;
            dateObj = Date.UTC(year, month, date, hour,minute);
        }
        //TODO month is double digit
        if(dateObj > now){
            dataSetForecast.push([Date.UTC(year, month, date, hour,minute), rate]);
        }
    }

	$(document).ready(function(){
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'fcGagePlot',
                //height: $('#fcGagePlot').height(),
                //width: $('#fcGagePlot').width(),
                type: 'spline',
                zoomType: 'x',
                //marginTop: 0,
            },
            title:{
                text: "<?= $name ?>"
            },
            xAxis: {
                gridLineWidth: 1,
                gridLineDashStyle: 'dot',
                type: 'datetime',
                dateTimeLabelFormats: {
                    hour: '%I:%M %P',
                    minute: '%I %M'
                },
                plotLines: [{
                    value: now,
                    width: 2,
                    color: '#FF0000',
                    dashStyle: 'shortDash',
                    label: {
                        text: "Current Time",
                        rotation: 0,
                        style: {
                            color: '#333333',
                            fontWeight: 'bold'
                        }
                    },
                    id: 'now-line'
                }],
                min: dataSetHistoric[0][0],
                max: dataSetForecast[dataSetForecast.length-1][0]

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
                data:dataSetHistoric
                //data: [ <?php #echo $dataString; ?>, dataSet ]
            },{
                name: "Forecast",
                color: '#FF0000',
                data: dataSetForecast
            }]
        });
    });

	function getDates(){
		//var now = new Date();
		var today = now.getDate();
		var yesterday = today - 1;
		var fc1 = today+1; //forecast day 1
		var fc2 = today+2;
		//alert("today: " + today +"\nyesterday: " + yesterday);

		var ret_dates = { today: today, 
			yesterday: yesterday, 
			fc1: fc1, 
			fc2: fc2}

		return ret_dates;
	}
	</script>