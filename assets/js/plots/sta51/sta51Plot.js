chart = new Highcharts.Chart({
	chart: {
            renderTo: 'fcPlot',
            height: 300,
            type: 'spline',
            zoomType: 'xy'
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
            minute: '%I:%M %P',
            second: '%I:%M:%S %P'
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
                value : 1200,
                color : 'red',
                dashStyle : 'shortdash',
                width : 2,
                label : {
                    text : 'Flood Warning'
                }
            }, {
                value : 800,
                color : 'orange',
                dashStyle : 'shortdash',
                width : 2,
                label : {
                    text : 'Flood Watch'
                }
            }],
        min: 0,
        max: 1200*1.2
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