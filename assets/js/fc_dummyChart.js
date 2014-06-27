<script src="assets/py/51Dummy.js"></script>
<script src="assets/py/51_spillDummy.js"></script>
<script type="text/javascript">
    var dataSetForecast =[];
    var dataSetHistoric =[];
    var chart, dates, dateObj, event_test;
    var year, month, date, hour, minute;
    var timeIndex = [];

    //dummy data bounds
    var upperBounds = Date.UTC(2014, 04, 07, 00, 00);
    var lowerBounds = Date.UTC(2014, 04, 03, 00, 00);
    var now = Date.UTC(2014, 04, 05, 00, 00);
    var numHistoricPts = 2*24*4; //15 minute intervals for 48 hours
function initDummyData(){

    //subtract 7 from now to get Pacific ST for Highcharts bug fix
    //
    //now.setHours(now.getHours()-7);
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
            //24 * 60 * 60 * 1000
        }

        //TODO month is double digit
        if(dateObj < upperBounds){
            dataSetForecast.push([Date.UTC(year, month, date, hour,minute), rate]);
            timeIndex.push(Date.UTC(year, month, date, hour,minute)); //save date info in FLowAndTime as UTC
            // dataSetHistoric.push([lowerBounds, (1500 * Math.random())]);
            var val = (Math.floor(1000*Math.sin(i/(FlowAndTime.length/8))));
            if(val < 1){
                val = 1;
            }
            dataSetHistoric.push([lowerBounds, val]);
            lowerBounds += 15 * 60 * 1000;
        }
    }
}
$(document).ready(function(){
        initDummyData();
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'fcGagePlot',
                height: $(window).height()/2-100,
                //width: $('#fcGagePlot').width(),
                type: 'spline',
                zoomType: 'x'               
            },
            title:{
                text: "Flood Forecast Demo test"
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
                        text: "Current Time",
                        rotation: 0,
                        style: {
                            color: '#333333',
                            fontWeight: 'bold'
                        }
                    },
                    id: 'now-line'
                }]//,
                // min: dataSetHistoric[0][0],
                // max: dataSetForecast[dataSetForecast.length-1][0]

            },
            yAxis: {
                lineWidth:1,
                title: {
                    text: 'flow rate (cfs)'
                },
                plotLines : [{
                    value : 900,
                    color : 'red',
                    dashStyle : 'shortdash',
                    width : 2,
                    label : {
                        text : 'Flood Warning'
                    }
                }, {
                    value : 600,
                    color : 'orange',
                    dashStyle : 'shortdash',
                    width : 2,
                    label : {
                        text : 'Flood Watch'
                    }
                }],
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
                    allowPointSelect: true,
                    //workaround for legend item click bug
                    point: {
	                    events: {
	                    	click: function(e){
	                    		var x = this.x;
	                    		var tIndex = jQuery.inArray(x, timeIndex);
	                    		var spillRate = FlowAndTimeSpill[tIndex].y;
	                    		//alert(spillRate);
	                    		showSpillLayer("2058", spillRate);
	                    	}
	                    }
                    },
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
            series: [
            {
                name: "Historic",
                color: '#0000FF',
                data:dataSetHistoric
                //data: [ <?php #echo $dataString; ?>, dataSet ]
            },
            {
                name: "Forecast",
                color: '#0000FF',
                dashStyle: 'shortdash',
                data: dataSetForecast
            }]
        });
    });
</script>