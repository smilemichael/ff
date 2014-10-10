<script src="assets/py/sta112_histFlowTimeSeries.js"></script>
<script src="assets/py/sta112_fcFlowTimeSeries.js"></script>

<script type="text/javascript">
var chart, dates, dateObj;
var year, month, date, hour, minute;

//add now to the historic data set
var now = new Date().getTime() - 28800000; //subtract 8 hours (gmt->pst)
var twoDaysAgo = now - 172800000;
var sta112_hist =[];
//LOOK INTO interpolations between last historic point and first forecast point
histCurrIndex = 0;
for(var i=0;i<sta112_histFlow.length;i++){
     if(sta112_histFlow[i][0] >= twoDaysAgo){
        histCurrIndex = i;
        break;
     }
}
for(var i=histCurrIndex;i<sta112_histFlow.length;i++){
    sta112_hist.push([sta112_histFlow[i][0], sta112_histFlow[i][1]]);
}

sta112_hist.push([now, 0]);

var fcTimeIndex = [];
var sta112_fc = [];
//add now to forecast array
sta112_fc.push([now, 0]);
fcTimeIndex.push(now);
//initialize forecast array
//first find correct index to start addding forecast data stamps from
var fcCurrIndex = 0;
for(var i=0;i<sta112_fcFlow.length;i++){
     if(sta112_fcFlow[i][0] > now){
        fcCurrIndex = i;
        break;
     }
}

for(var i=fcCurrIndex;i<fcCurrIndex+191;i++){
    sta112_fc.push([sta112_fcFlow[i][0], sta112_fcFlow[i][1]]);
    fcTimeIndex.push(sta112_fcFlow[i][0]);
}

$(document).ready(function(){
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
            text: "San Francisquito"
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
            min: sta112_hist[0][0]
            // ,max: dataSetFlowForecast[191][0]
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
            data: sta112_hist
        },
        {
            name: "Forecast",
            color: '#FF0000',
            data: sta112_fc
        }]
    }); //end chart
});
</script>