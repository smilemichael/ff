<?php
	// Load Config Database File
	require_once("config/config_database_local.php");

	// Make a MySQL Connection
	mysql_connect($db_hostname, $db_username, $db_password) or die(mysql_error());
	mysql_select_db($db_database) or die(mysql_error());
?>
<?php
//  Adjusts the max and min values for plotting
function maxmin(&$vmax,&$vmin)
{

	if ( $vmax <= ($vmin + .01) )
		$vmin = $vmax - 1. ;

	//ERROR if max < min -> reset values
	if ( $vmax <= $vmin ) {
		if ( $vmax > 0. ) {
		    $vmin = $vmax-1;
		    $vmax = $vmax+1;
		} else {
		    $vmax = 1. ;
		    $vmin = 0. ;
		}
	}

	//Set temporary values and compute range
    $Max = $vmax ;
    $Min = $vmin ;
    $Range = $Max - $Min ;
                
/*      Determine 10 factor of range */
        $factor = log10($Range) ;
        $factor = floor($factor) ;
        
/*      Compute divisor for use in max/min setting */
/*      Negative exponents must be inversed after expanding */
        if ( $factor < 0. )
                $factor = 1. / pow(10.,abs($factor)) ;
        else
                $factor = pow(10.,$factor) ;

/*      Adjust max and min to even values for range factors */
        $vmax = ceil($Max/$factor) * $factor ;     /* change max to ceiling */
        $vmin = floor($Min/$factor) * $factor ;    /* change min to floor */

        return ;
}
?>

<?php
// Get ID from URL String
// Store Sensor ID in $id
$id=$_GET['id'];
// $y0 = $_GET['y0'];
// $m0 = $_GET['m0'];
// $d0 = $_GET['d0'];
// $y1 = $_GET['y1'];
// $m1 = $_GET['m1'];
// $d1 = $_GET['d1'];
// $dateFrom = new DateTime(intval($m0+1) . "/" . intval($d0) . "/" . intval($y0));
// $dateTo = new DateTime(intval($m1+1) . "/" . intval($d1) . "/" . intval($y1));
// $dateNow = new DateTime("now");
// $interval = $dateTo->diff($dateFrom);

//echo $dateNow->format('Y-m-d H:i:s');

// Add add sensor id to rated table
$id_rated_table = "s".$id."_rated";
$id_table = "s".$id."_0" ;
// Get the Sensor Name from the Database where the Sensor ID Matches
$query = "SELECT S_SNAME FROM sensors WHERE S_ID = $id";
$result = mysql_query($query) or die(mysql_error());
$sensorname = mysql_fetch_array($result); 
?>

<!--<script src="/../javascript/jquery.min.js"></script>
<script src="/../javascript/highcharts.js"></script>-->
<!--<script src="/../../Highcharts/js/highcharts.js"></script>-->
<!--<script src="/../../Highcharts/js/highcharts.js"></script>-->

<script type="text/javascript">



//
// Get stage values
//
<?php
$tarray = array() ;
$darray = array() ;
$sarray = array() ;
$qarray = array() ;

$maxs = -9999. ;
$mins = 9999. ;

$maxq = -9999. ;
$minq = 9999. ;
$both = TRUE ;

// Select all data for the past month
//$query = "Select * From $id_rated_table Where T_TIME > '" . $dateFrom->format('Y-m-d H:i:s') . "' && T_tIME < '" . $dateTo->format('Y-m-d H:i:s') . "' ORDER BY T_TIME ASC";
//$query = "Select * From $id_rated_table Where T_TIME > '2014-02-25 00:00:00' && T_TIME < '2014-02-28 00:00:00'ORDER BY T_TIME ASC";
//$query = "Select * From $id_rated_table Where T_TIME > DATE_ADD('2014-02-25 00:00:00' ,INTERVAL -30 DAY) ORDER BY T_TIME ASC";
$query = "Select * From $id_rated_table Where T_TIME > DATE_ADD(now(),INTERVAL -30 DAY) ORDER BY T_TIME ASC";
//$result = mysql_query($query) or die(mysql_error());
$result = mysql_query($query) ;
if ( !$result ) {
   $both = FALSE ;
	//$query = "Select * From $id_rated_table Where T_TIME > DATE_ADD('2014-02-25 00:00:00' ,INTERVAL -30 DAY) ORDER BY T_TIME ASC";
   $query = "Select * From $id_table Where T_TIME > DATE_ADD(now(),INTERVAL -30 DAY) ORDER BY T_TIME ASC";
   $result = mysql_query($query) ;
}
//let's get the number of rows in our result so we can use it in a for loop
$numofrows = mysql_num_rows($result);

// Keeps getting the next row until there are no more to get
for($i = 0; $i < $numofrows; $i++) {
$row = mysql_fetch_array($result); // Get a row from our result set
sscanf($row['T_TIME'],"%s %s",$darray[$i],$tarray[$i]);

//******* Start Stage *******//
sscanf($row['T_DATA'],"%f",$sarray[$i]);// Get the data value out of the string
if ( $sarray[$i] > $maxs ) {
   $maxs = $sarray[$i] ; 
} 
if ( $sarray[$i] < $mins ) {
   $mins = $sarray[$i] ;  
}
maxmin($maxs,$mins) ;
if ( $mins < 0. ) {
  $maxs = $maxs - $mins ;
  $mins = 0 ;
}

if ( $both ) {
//******* Start Flow *******//
sscanf($row['R_DATA'],"%f",$qarray[$i]);// Get the data value out of the string

if ( $qarray[$i] > $maxq ) {
   $maxq = $qarray[$i] ; 
} 


if ( $qarray[$i] < $minq ) {
   $minq = $qarray[$i] ;  
}
maxmin($maxq,$minq) ;

if ( $minq < 0. ) {
   $minq = 0. ;
}

}

}
?>

$(document).ready(function() {
	chart = new Highcharts.Chart({
	chart: {
		width: 700,
		height: 500,
		renderTo: 'plot',
		zoomType: 'x',
		spacingRight: 10,
		backgroundColor: 'rgba(256, 256, 256, 0.80)',
		borderWidth: 2,
		plotBackgroundColor: 'rgba(256, 256, 256, 1)',
		plotBorderWidth: 1
	},
	title: {
		text: '<?php echo $id." ".$sensorname['S_SNAME']; ?>',
		style: {
		color: '#0099ff',
		font: 'bold 18px Verdana, Geneva, Arial, Sans-Serif'
		}
	},
	subtitle: {
		text: '(These data readings are Preliminary)',
		style: {
		color: 'red',
	    font: '12px Verdana, Geneva, Arial, Sans-Serif'
		}
	},
	xAxis: {
		gridLineWidth: 1,
		lineColor: '#000',
		tickColor: '#000',
		type: 'datetime',
		dateTimeLabelFormats: {
		month: '%e. %b',
		year: '%b'
		}
	},
	yAxis: [{ // Primary yAxis (Stage)
		minorTickInterval: 'auto',
		lineColor: '#000',
		lineWidth: 1,
		tickColor: '#000',
		tickWidth: 1,
		alternateGridColor: null,
		title: {
			text: 'Stage (feet)',
			style: {
				color: '#058DC7',
				font: 'bold 14px Verdana, Geneva, Arial, Sans-Serif'
			}
		},
		max: <?php echo $maxs; ?>,
		min: <?php echo $mins; ?>,
		labels: {
			formatter: function() {
				return this.value;
			},
			style: {
				color: '#058DC7'
			}
		},
	}

<?php if ( $both ) { echo ", {" ;  // Secondary yAxis (Flow Rate)
	echo "minorTickInterval: 'auto'," ;
	echo "lineColor: '#000'," ;
	echo "lineWidth: 1,";
	echo "tickColor: '#000',";
	echo "tickWidth: 1,";
	echo "max: $maxq,";
	echo "min: $minq,";	
	
	echo "alternateGridColor: null,";
	echo "title: {";
		echo "text: 'Flow Rate (cfs)',";
		echo "style: {";
			echo "color: '#BE7371',";
			echo "font: 'bold 14px Verdana, Geneva, Arial, Sans-Serif'";
		echo "}";
	echo "},";
	echo "labels: {";
		echo "formatter: function() {";
			echo "return this.value;";
		echo "},";
		echo "style: {";
			echo "color: '#BE7371'";
		echo "}";
	echo "},";
	echo "opposite: true";
   echo "}";

    }
?>

],

tooltip: {
	formatter: function() {
	return Highcharts.dateFormat('%b %e. %Y at %H:%M:%S', this.x) +'<b> '+ this.y +(this.series.name == 'Flow Rate' ? ' cfs' : ' feet');+' </b>';
	}
},
legend: {
	itemStyle: {
	font: 'bold 12px Verdana, Geneva, Arial, Sans-Serif',
	color: 'black'
	},
	itemHoverStyle: {
	color: '#039'
	},
	itemHiddenStyle: {
	color: 'gray'
	}
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
credits: {
	enabled: false // Removes Credits
},

<?php

if ( $both ) {

echo "series: [{\n" ;
echo "name: 'Stage',\n" ;
echo "color: '#058DC7',\n" ;
echo "type: 'spline',\n" ;
echo "yAxis: 0,\n" ;
echo "data: [\n" ;

// Keeps getting the next row until there are no more to get
for($i = 0; $i < $numofrows; $i++) {

   sscanf($darray[$i],"%d-%d-%d",$the_year,$the_month,$the_day);
   $new_date = sprintf("%d, %02d, %02d",$the_year,$the_month-1,$the_day);
   echo "	[Date.UTC(";
   echo $new_date;// Print out the Date value
   echo " ,";
   sscanf($tarray[$i],"%d:%d:%d",$the_hour,$the_minute,$the_second) ;
   $new_time = sprintf("%d, %d, %d",$the_hour,$the_minute,$the_second) ;
   echo $new_time ;
   echo "), ";

//******* Start Stage *******//
   $the_data = sprintf("%5.2f",$sarray[$i]);// Get the data value out of the string
   echo $the_data ;
   if ( $i < ($numofrows-1) ) {
       echo "],\n";
   } else {
       echo "]\n";
   }
//******* End Stage *******//
}

echo " ] } , {\n";
echo "name: 'Flow Rate',\n";
echo "color: '#BE7371',\n";
echo "type: 'spline',\n";
echo "yAxis: 1,\n";
echo "data: [\n";
// Select all data for the past seven days
for($i = 0; $i < $numofrows; $i++) {

   sscanf($darray[$i],"%d-%d-%d",$the_year,$the_month,$the_day);
   $new_date = sprintf("%d, %02d, %02d",$the_year,$the_month-1,$the_day);
   echo "	[Date.UTC(";
   echo $new_date;// Print out the Date value
   echo " ,";
   sscanf($tarray[$i],"%d:%d:%d",$the_hour,$the_minute,$the_second) ;
   $new_time = sprintf("%d, %d, %d",$the_hour,$the_minute,$the_second) ;
   echo $new_time ;
   echo "), ";

//******* Start Flow *******//
   $the_data = sprintf("%5.2f",$qarray[$i]);// Get the data value out of the string
   echo $the_data ;
   if ( $i < ($numofrows-1) ) {
      echo "],\n";
   } else {
      echo "]\n";
   }
//******* End FLOW *******//
}

echo "	]";
echo "}]";
echo "}" ;
echo ")" ;
echo "})" ;

} else {

echo "series: [ {\n" ;
echo "name: 'Stage',\n" ;
echo "color: '#058DC7',\n" ;
echo "type: 'spline',\n" ;
echo "yAxis: 0,\n" ;
echo "data: [\n" ;

// Keeps getting the next row until there are no more to get
for($i = 0; $i < $numofrows; $i++) {

   sscanf($darray[$i],"%d-%d-%d",$the_year,$the_month,$the_day);
   $new_date = sprintf("%d, %02d, %02d",$the_year,$the_month-1,$the_day);
   echo "	[Date.UTC(";
   echo $new_date;// Print out the Date value
   echo " ,";
   sscanf($tarray[$i],"%d:%d:%d",$the_hour,$the_minute,$the_second) ;
   $new_time = sprintf("%d, %d, %d",$the_hour,$the_minute,$the_second) ;
   echo $new_time ;
   echo "), ";

//******* Start Stage *******//
   $the_data = sprintf("%5.2f",$sarray[$i]);// Get the data value out of the string
   echo $the_data ;
   if ( $i < ($numofrows-1) ) {
       echo "],\n";
   } else {
       echo "]\n";
   }

}
echo "  ]\n" ;
echo " }]\n" ;
echo "});\n" ;
echo "});\n" ;
//******* End Stage *******//
}

?>

</script>
