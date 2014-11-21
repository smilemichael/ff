chart = new Highcharts.Chart({
  chart: {
            renderTo: 'fcPlot',
            height: 300,
            type: 'spline',
            zoomType: 'x'
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
        min: sta112_histFlow[0][0],
        max: sta112_fcFlow[sta112_fcFlow.length-1][0]
    },
    yAxis: {
        lineWidth:1,
        title: {
            text: 'flow rate (cfs)'
        },
        plotLines : [{
                value : sta112_floodWarning,
                color : 'red',
                dashStyle : 'shortdash',
                width : 2,
                label : {
                    text : 'Flood Warning'
                }
            }, {
                value : sta112_floodWatch,
                color : 'orange',
                dashStyle : 'shortdash',
                width : 2,
                label : {
                    text : 'Flood Watch'
                }
            }],
        min: 0,
        minRange: sta112_floodWarning + 500
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
                        var tIndex = jQuery.inArray(x, selectedStation.plot.fcTimeIndex);
                        selectedStation.displaySpill(tIndex);
                        this.select();
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
    }
}); //end chart
