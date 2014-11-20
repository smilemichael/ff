chart = new Highcharts.Chart({
	chart: {
            renderTo: 'fcPlot',
            height: 300,
            type: 'spline',
            zoomType: 'x'
        },
    title:{
        text: "Ross Creek at Cherry Ave."
    },
    xAxis: {
        gridLineWidth: 1,
        gridLineDashStyle: 'dot',
        type: 'datetime',
        dateTimeLabelFormats: {
            hour: '%I:%M %P',
            minute: '%I %M'
        },
        min: sta51_histFlow[0][0],
        max: sta51_fcFlow[sta51_fcFlow.length-1][0]
    },
    yAxis: {
        lineWidth:1,
        title: {
            text: 'flow rate (cfs)'
        },
        plotLines : [{
                value : sta51_floodWarning,
                color : 'red',
                dashStyle : 'shortdash',
                width : 2,
                label : {
                    text : 'Flood Warning'
                }
            }, {
                value : sta51_floodWatch,
                color : 'orange',
                dashStyle : 'shortdash',
                width : 2,
                label : {
                    text : 'Flood Watch'
                }
            }],
        min: 0,
        minRange: sta51_floodWarning + 500
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
                        selectedStation.plot.animationIndex = 0;
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
    }
    // ,
    // series: [{
    //     name: "Historic",
    //     color: '#0000FF',
    //     data: sta51_histFlow
    // }]
    // },
    // {
    // 	name: "Forecast",
    //     color: '#FF0000',
    //     data: sta51_fcFlow
    // }]
}); //end chart