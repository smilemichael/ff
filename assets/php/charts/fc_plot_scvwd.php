<script type = "text/javascript">
//get historic data 
var dataSetFlowHistoric=[];
<?php
	// Load Config Database File
    require_once("../db/config_db_alertd_datawise.php");
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
    $interval = -1; //interval in days for historic data 
    //get data for each gage
    $query = "Select * From " . $id_rated_table . " Where T_TIME > DATE_ADD(now(),INTERVAL -2 DAY) ORDER BY T_TIME ASC";
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

    //set filename with forecast flow js variable
    switch($id){
        case "2058":
            $fcFlowDataFile = "sta51_fcFlowTimeSeries.js";
            $fcFlowVar = "sta51_fcFlow";
            $fcSpillDataFiles = array("sta51_Cherry_fcSpillTimeSeries.js", "sta51_Jarvis_fcSpillTimeSeries.js");
            $fcSpillVars = array("Cherry", "Jarvis");
            $fc = true; //forecast data available
            break;
        case "1543":
            $fcFlowDataFile = "sta93_fcFlowTimeSeries.js";
            $fcFlowVar = "sta93_fcFlow";
            $fcSpillDataFiles = array("sta93_RossL_fcSpillTimeSeries.js","sta93_RossR_fcSpillTimeSeries.js","sta93_Ross1_fcSpillTimeSeries.js", "sta93_Ross2_fcSpillTimeSeries.js");
            $fcSpillVars = array("RossL","RossR","Ross1","Ross2");
            $fc = true;
            break;
        case "1467":
            $fcFlowDataFile = "sta117_fcFlowTimeSeries.js";
            $fcFlowVar = "sta117_fcFlow";
            $fcSpillDataFiles = array("sta117_WLL_fcSpillTimeSeries.js");
            $fcSpillVars = array("WLL");
            $name = "West Little Llagas blw Edmundson Ave";
            $fc = false;
            break;
    }
?>

dataSetFlowHistoric.push(<?php echo $dataString?>);

</script>
<?php 
    //link flow and spill forecast data variables to document
    echo "<script src='assets/py/" . $fcFlowDataFile . "'></script>";
    if($fc){
        for($i=0;$i<count($fcSpillDataFiles);$i++){
            echo "<script src='assets/py/" . $fcSpillDataFiles[$i] . "'></script>";
        }
    }
?>
<script type="text/javascript">
var chart, dates, dateObj;
var year, month, date, hour, minute;

//add now to the historic data set
var now = new Date().getTime() - 28800000; //subtract 8 hours (gmt->pst)


var nowFC = new Date().getTime() - 28800000; //subtract 8 hours (gmt->pst)
var dataSetFlowForecast = [];
var fcTimeIndex = [];

$(document).ready(function(){

    //initialize forecast array
    //first find correct index to start addding forecast data stamps from
    var fcCurrIndex = 0;
    for(var i=0;i<<?=$fcFlowVar?>.length;i++){
         if(<?=$fcFlowVar?>[i][0] >= nowFC){
            fcCurrIndex = i;
            break;
         }
    }

    //interpolate between last point in historic flow dataset and first point in forecast flow dataset
    // if(dataSetFlowHistoric.length > 0)
    lastPtHistoricFlow = dataSetFlowHistoric[dataSetFlowHistoric.length-1][1];
    firstPtForecastFlow = <?=$fcFlowVar?>[fcCurrIndex][1];
    //linear interpolation
    interpolation = (lastPtHistoricFlow + firstPtForecastFlow)/2;

    //add now to historic array
    dataSetFlowHistoric.push([now, interpolation]);
    //add now to forecast array
    dataSetFlowForecast.push([now, interpolation]);
    fcTimeIndex.push(now);

    //TODO make dynamic for all fcSpillZones
    <?php
        if($fc){
            for($i=0;$i<count($fcSpillVars);$i++){
                echo $fcSpillVars[$i] . ".splice(0,fcCurrIndex);";
                echo $fcSpillVars[$i] . ".splice(0,0,[now, 0]);";
                echo $fcSpillVars[$i] . ".splice(192, " . $fcSpillVars[$i] . ".length);";    
                echo "selectedStation.spillZones['" . $fcSpillVars[$i] . "'].forecastData = " .  $fcSpillVars[$i] . ";";
            }
        }
       
    ?>

    //determine num timepoints to use for forecast dataset
    var numTimePoints = 0;
    //if forecast dataset has more than two days of data use 191 timpoints
    if(<?=$fcFlowVar?>.length - fcCurrIndex>191){
        numTimePoints = 191;
    }else{
        numTimePoints = <?=$fcFlowVar?>.length - fcCurrIndex;
    }
    for(var i=fcCurrIndex;i<fcCurrIndex+numTimePoints;i++){
        dataSetFlowForecast.push([<?=$fcFlowVar?>[i][0], <?=$fcFlowVar?>[i][1]]);
        fcTimeIndex.push(<?=$fcFlowVar?>[i][0]);
    }
    <?php
     //wll exception, forecast data is directly used for spill data
        if(!$fc){
            echo "selectedStation.spillZones['WLL'].forecastData = dataSetFlowForecast";
        }
    ?>

    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'fcPlot',
            height: 300,
            //width: $('#fcGagePlot').width(),
            type: 'spline',
            zoomType: 'x'
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
                color: '#000000',
                dashStyle: 'shortDash',
                label: {
                    text: "Current Time (PST)", //TODO PST
                    rotation: 0,
                    style: {
                        color: '#333333',
                        fontWeight: 'bold'
                    }
                },
                id: 'now-line'
            }],
            min: dataSetFlowHistoric[0][0],
            max: dataSetFlowForecast[numTimePoints][0]
        },
        yAxis: {
            lineWidth:1,
            title: {
                text: 'flow rate (cfs)'
            },
            plotLines : [{
                    value : selectedStation.floodWarning,
                    color : 'red',
                    dashStyle : 'shortdash',
                    width : 2,
                    label : {
                        text : 'Flood Warning'
                    }
                }, {
                    value : selectedStation.floodWatch,
                    color : 'orange',
                    dashStyle : 'shortdash',
                    width : 2,
                    label : {
                        text : 'Flood Watch'
                    }
                }],
            min: 0,
            minRange: selectedStation.floodWarning + 500
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle"
        },
        credits: {
            enabled: false
        },
        tooltip: {
            backgroundColor: '#FCFFC5',
            formatter: function() {
            return  '<b>' + this.series.name +'</b><br/>' +
                Highcharts.dateFormat('%b.%e,  %I:%M %P',
                                      new Date(this.x))
            + ', ' + this.y + ' cfs';
            }
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function(e){
                            var x = this.x;
                            var tIndex = jQuery.inArray(x, fcTimeIndex);
                            alert(tIndex);
                            selectedStation.displaySpill(tIndex);
                            this.select();
                            if(fcAnimate==true){
                                stopFAnimate();
                            }
                            //reset floodevent demo select 
                            $('#floodDemoSelect').val("default");
                        }
                    }
                },
                //workaround for legend item click bug
                events: {
                    legendItemClick: function(event) {
                        return false;
                    }
                },
                marker: {
                    enabled: true,
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
            data: dataSetFlowHistoric
        },
        {
            name: "Forecast",
            color: '#FF0000',
            data: dataSetFlowForecast
        }]
    }); //end chart
});
</script>