//globals
var map;
var select_feature_control;

var currentFCGage;
var stationNumber;

//OpenLayers projections
var proj_2227 = new OpenLayers.Projection('EPSG:2227'); //projection for stream layer
var proj_4326 = new OpenLayers.Projection('EPSG:4326'); //lat, lon
var proj_900913 =  new OpenLayers.Projection('EPSG:900913'); //google maps projection

var countyBounds = new OpenLayers.Bounds(-13604530.147681711,4444768.802554563 ,-13534055.207602875,4498656.90749554);

//array to hold all ross ck @ cherry spill areas
var Ross_Ck_Cherry_SpillLayers;

//interval for flood animation;
var myInterval;
var slideInterval = 0;


//initialize web map
function init(){
    //proxy host to resolve CORS
    OpenLayers.ProxyHost = 'assets/OpenLayers/cgi-bin/proxy.php?url=';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
    OpenLayers.Util.onImageLoadErrorColor = "transparent";

   
    //map settings     
    map = new OpenLayers.Map('map', {
        //numZoomLevels: 20,
        //maxResolution: 156543.0339,
        //minResolution: 0.2985821416854859,
        maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
        projection: proj_4326,
        //displayProjection: proj_900913,
        units: "degrees",
        	controls: [
        			new OpenLayers.Control.PanZoomBar(),
        			new OpenLayers.Control.Navigation({'zoomWheelEnabled': true}),
        			new OpenLayers.Control.ScaleLine()
        	]	
    });

    //layer switcher control
    var switcherControl = new OpenLayers.Control.LayerSwitcher({'ascending':false});
    map.addControl(switcherControl);
    switcherControl.maximizeControl();

    // //mouse position control
    // var mousePositionControl = new OpenLayers.Control.MousePosition({
    //                                 prefix: '<a target="_blank" ' +
    //                                     'href="http://spatialreference.org/ref/epsg/900913/">' +
    //                                     'Lon | Lat</a> coordinates: ',
    //                                 separator: ' | ',
    //                                 numDigits: 6,
    //                                 emptyString: 'Mouse is not over map.'
    //                             });
    // mousePositionControl.position = new OpenLayers.Pixel(100, 100);
    // map.addControl(mousePositionControl);
    //mousePositionControl.activate();

    //google map base layers		
    var gsat = new OpenLayers.Layer.Google("&nbspGoogle Satellite", {
        type: google.maps.MapTypeId.SATELLITE,
        numZoomLevels: 18,
        visibility: false,
        animationEnabled: true
        }
    );
    var grod = new OpenLayers.Layer.Google("&nbspGoogle Road", {
        type: google.maps.MapTypeId.ROADMAP,
        numZoomLevels: 22,
        visibility: false,
        animationEnabled: true
        }
    );
    var gphys = new OpenLayers.Layer.Google("&nbspGoogle Physical", {
        type: google.maps.MapTypeId.TERRAIN,
        //numZoomLevels: 21,
        visibility: false,
        animationEnabled: true
        }
    );
    map.addLayers([gphys,grod,gsat]);

    ///////////////////START Stream gage layers///////////////////////////////////////////////////////
    //fc wiski_streamflow geoJSON
    //alertd config
    // forecast_streamflow = new OpenLayers.Layer.Vector(
    //     "&nbspFlood Forecast Gages",
    //     {
    //         protocol: new OpenLayers.Protocol.HTTP({
    //             url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:ForecastStreamFlow&maxFeatures=50&outputFormat=json",
    //             format: new OpenLayers.Format.GeoJSON({
    //                 // extractStyles: false,
    //                 // extractAttributes: true,
    //                 // maxDepth: 10
    //             })
                
    //         }),
    //         strategies: [new OpenLayers.Strategy.Fixed()]
    //     }
    // );

    //local config
    forecast_streamflow = new OpenLayers.Layer.Vector(
        "&nbspFlood Forecast Gages",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://localhost:8089/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:ForecastStreamFlow&maxFeatures=50&outputFormat=json",
                format: new OpenLayers.Format.GeoJSON({
                    // extractStyles: false,
                    // extractAttributes: true,
                    // maxDepth: 10
                })
                
            }),
            strategies: [new OpenLayers.Strategy.Fixed()]
        }
    );
    /////////////////// END Stream gage layers///////////////////////////////////////////////////////

    ///////////////////START ROSS CK SPILL AREA LAYERS///////////////////////////////////////////////////////
    //ross 1500cfs spill area
    ross_100cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 100cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_100cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );


    ross_200cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 200cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_200cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_300cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 300cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_300cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_400cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 400cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_400cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_500cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 500cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_500cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_600cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 600cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_600cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_700cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 700cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_700cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_800cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 800cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_800cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_900cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 900cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_900cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

   ross_1000cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1000cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1000cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_1100cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1100cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1100cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_1200cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1200cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1200cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_1300cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1300cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1300cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_1400cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1400cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1400cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

    ross_1500cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1500cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1500cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

   ross_1600cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1600cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1600cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

   ross_1700cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1700cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1700cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );

   ross_1800cfs_spillArea = new OpenLayers.Layer.Vector(
        " Ross 1800cfs Spill",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Ross_Cherry_1800cfs&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: true,
                    extractAttributes: true
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher:false
        }
    );


    Ross_Ck_Cherry_SpillLayers = [ross_100cfs_spillArea, ross_200cfs_spillArea, ross_300cfs_spillArea, ross_400cfs_spillArea,
                                    ross_500cfs_spillArea,ross_600cfs_spillArea,ross_700cfs_spillArea,ross_800cfs_spillArea,
                                    ross_900cfs_spillArea,ross_1000cfs_spillArea, ross_1100cfs_spillArea, ross_1200cfs_spillArea,
                                    ross_1300cfs_spillArea, ross_1400cfs_spillArea, ross_1500cfs_spillArea, ross_1600cfs_spillArea,
                                    ross_1700cfs_spillArea, ross_1800cfs_spillArea];
    ///////////////////END ROSS CK SPILL AREA LAYERS///////////////////////////////////////////////////////

    //forecast gage feature style
    var fc_vector_style = new OpenLayers.Style({
        'cursor' : 'pointer',
        'fillColor':'#FF0000',
        'graphicName': 'triangle',
        'fillOpacity': 0.8,
        'strokeColor': '#000000',
        'strokeWidth': 2,
        'pointRadius': 8,
        'strokeDashStyle' : 'dot'
    });

    //forecast gage feature select style
    var fc_vector_style_select = new OpenLayers.Style({
        'fillColor':'#CC0000',
        'graphicName': 'triangle',
        'fillOpacity': 0.8,
        'strokeColor': '#00FF00',
        'strokeWidth': 2,
        'pointRadius': 10,
        'strokeDashStyle' : 'dot'
    });

    var fc_vector_style_map = new OpenLayers.StyleMap({
        'default':fc_vector_style,
        'select':fc_vector_style_select
    });

    forecast_streamflow.styleMap = fc_vector_style_map;


    //configure styles for spill layers
    var spill_vector_style = new OpenLayers.Style({
        'fillColor':'#0033CC',
        //'graphicName': 'circle',
        'fillOpacity': 0.5,
        'strokeColor': '#000000',
        'strokeWidth': 0
        //'pointRadius': 6,
        //'strokeDashStyle' : 'dot'
    });

    var spill_vector_style_map = new OpenLayers.StyleMap({
        'default':spill_vector_style
        //'select':alert_vector_style_select
    });

    // styling rules for spill layer feature depths
    var ruleRange1 = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: "Range",
          value: 1
      }),
      symbolizer: {fillColor: "#66CCFF",
                   fillOpacity: 0.5}
    });

    var ruleRange2 = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: "Range",
          value: 2
      }),
      symbolizer: {fillColor: "#3399FF",
                   fillOpacity: 0.5}
    });

    var ruleRange3 = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: "Range",
          value: 3
      }),
      symbolizer: {fillColor: "#3399FF",
                   fillOpacity: 0.5}
    });

    var ruleRange4 = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: "Range",
          value: 4
      }),
      symbolizer: {fillColor: "#0066FF",
                   fillOpacity: 0.5}
    });
    
    var ruleRange5 = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: "Range",
          value: 5
      }),
      symbolizer: {fillColor: "#0000FF",
                   fillOpacity: 0.5}
    });

    var ruleRange6 = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: "Range",
          value: 6
      }),
      symbolizer: {fillColor: "#0000CC",
                   fillOpacity: 0.5}
    });

    spill_vector_style.addRules([ruleRange1, ruleRange2, ruleRange3, ruleRange4, ruleRange5, ruleRange6]);

    //ross CK stylemap setting, TODO for loop to assign style map.
    ross_100cfs_spillArea.styleMap = spill_vector_style_map;
    ross_200cfs_spillArea.styleMap = spill_vector_style_map;
    ross_300cfs_spillArea.styleMap = spill_vector_style_map;
    ross_400cfs_spillArea.styleMap = spill_vector_style_map;
    ross_500cfs_spillArea.styleMap = spill_vector_style_map;
    ross_600cfs_spillArea.styleMap = spill_vector_style_map;
    ross_700cfs_spillArea.styleMap = spill_vector_style_map;
    ross_800cfs_spillArea.styleMap = spill_vector_style_map;
    ross_900cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1000cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1100cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1200cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1300cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1400cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1500cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1600cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1700cfs_spillArea.styleMap = spill_vector_style_map;
    ross_1800cfs_spillArea.styleMap = spill_vector_style_map;

    
    //add gage layers to map
    map.addLayers([forecast_streamflow]);

    //add Ross ck spill areas to map, TODO FOR LOOP TO ADD LAYERS TO MAP
    map.addLayers([ ross_100cfs_spillArea,ross_200cfs_spillArea,ross_300cfs_spillArea,ross_400cfs_spillArea,
                    ross_500cfs_spillArea, ross_600cfs_spillArea,ross_700cfs_spillArea,ross_800cfs_spillArea, 
                    ross_900cfs_spillArea, ross_1000cfs_spillArea,ross_1100cfs_spillArea,ross_1200cfs_spillArea,
                    ross_1300cfs_spillArea, ross_1400cfs_spillArea,ross_1500cfs_spillArea, ross_1600cfs_spillArea,
                    ross_1700cfs_spillArea, ross_1800cfs_spillArea]);
    
    //select feature control for gage layers
    select_feature_control = new OpenLayers.Control.SelectFeature(
        [forecast_streamflow],
        {
            multiple:false,
            toggle: true,
            toggleKey: 'ctrlKey',
            multipleKey: 'shiftKey',
            box:false
        }
    );
    map.addControl(select_feature_control);
    select_feature_control.activate();

    //register events when features are selected/unselected
    forecast_streamflow.events.register('featureselected', this, forecast_selected_feature);
    forecast_streamflow.events.register('featureunselected', this, forecast_unselected_feature);

    //zoom to county extent
    map.zoomToExtent(countyBounds);

    // alert("GIS themes are for illustration and general analysis purposes only and are not accurate to surveying or engineering standards. Information is not guaranteed to be accurate, current or complete and use of this information is your responsibility")

}

//handler for forecast gage selection
function forecast_selected_feature(event){
    $('#fcGageInfo').empty();//clear old contents
    $('#fcGagePlot').empty();
    var fcGageInfo = "";  //forecast gageInfo will contain the data of the selected forecast gage
    fcGageInfo +=  "<div class='fcGageInfo' id=\"" + event.feature.fid + "\">"+
                "<strong>Station Name: </strong>" + event.feature.attributes.STA_NAME +"<br/>" +
                "<strong>Station Number: </strong>" + event.feature.attributes.STA_NUMBER +"<br/>" +
                "<strong>ALERT ID: </strong>" + event.feature.attributes.ALERT_ID +"<br/>" +
                "<strong>Gage Type: </strong>" + event.feature.attributes.GAGE_TYPE +"<br/>" +
                "<strong>Major Watershed: </strong>" + event.feature.attributes.WTRSHD_MAJ +"<br/>" +
                "<strong>Longitude: </strong>" + event.feature.attributes.LONDD83 +"<br/>" +
                "<strong>Latitude: </strong>" + event.feature.attributes.LATDD83 +"<br/></div>";
            
    //zoom to selected forecast gage
    var featureLonLat = getFeatureLonLat(event.feature);
    map.zoomToExtent(computeBBox(featureLonLat, "forecast"));
    $('#fcGageInfo').html(fcGageInfo);
    //$('#fcGagePlot').load("assets/php/charts/fc_plot_panel.php?id=" + event.feature.attributes.ALERT_ID);
    if(event.feature.attributes.ALERT_ID === "2058"){
        // $('#fcGagePlot').load("assets/js/fc_dummyChart.js");
        $( "#forecastInfo" ).tabs( "option", "active", 0 );
        //enable flood simulation tab
        $( "#forecastInfo" ).tabs( "enable", 2 );

    }else if(event.feature.attributes.ALERT_ID === "1543"){
        // $('#fcGagePlot').load("assets/php/charts/fc_plot_panel.php?id=" + event.feature.attributes.ALERT_ID);
        $('#fcGagePlot').html("No Plot Data Available");
        $( "#forecastInfo" ).tabs( "disable", 2 );
        $( "#forecastInfo" ).tabs( "option", "active", 0 );

    }else if(event.feature.attributes.ALERT_ID === "1481"){
        $('#fcGagePlot').html("No Plot Data Available");
        $( "#forecastInfo" ).tabs( "option", "active", 0 );
        $( "#forecastInfo" ).tabs( "disable", 2 );
    }else if(event.feature.attributes.ALERT_ID === "1535"){
        $('#fcGagePlot').html("No Plot Data Available");
        $( "#forecastInfo" ).tabs( "option", "active", 0 );
        $( "#forecastInfo" ).tabs( "disable", 2 )
    }
    $('#forecastInfo').slideDown(); //forecast gage info made visible

    //save alert id of current FCGage
    currentFCGage = event.feature.attributes.ALERT_ID;
    stationNumber = event.feature.attributes.STA_NUMBER;

    //workaround for station 23.2 make stationNumber 23
    //maybe fix in shapefile
    if(stationNumber=="23.2"){
        stationNumber="23";
        alert(stationNumber);
    } 

    //if user is logged in, enable alert regisration/unregistration
    var $object = $('#alertMe');
    if($object.length > 0) {
        // alert(stationNumber);
        switch(stationNumber){
            case("51"): if(gages['gage_51'] == "T"){
                            $('#alertMe').html('<p>You are registered to receive alerts for this flood plain.</p>'+
                                '<button class="btn btn-warning" id="btnUnAlertMe" data-gage-number="' + stationNumber +'">Unsubscribe</button>' +
                                '<script>' +
                                    '$(\'#btnUnAlertMe\').on("click", function(){' +
                                        // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                        'unAlertMe();' +
                                    '});'+
                                '</script>');
                        }else{
                            $('#alertMe').html('<p>You have not registered to receive alerts for this flood plain.</p>'+
                            '<button class="btn btn-default" id="btnAlertMe" data-gage-number="' + stationNumber +'">ALERT Me!</button>' +
                            '<script>' +
                                '$(\'#btnAlertMe\').on("click", function(){' +
                                    // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                    'alertMe();' +
                                '});'+
                            '</script>');
                        }
                        break;
            case("23"): if(gages['gage_23'] == "T"){
                            $('#alertMe').html('<p>You are registered to receive alerts for this flood plain.</p>'+
                                '<button class="btn btn-warning" id="btnUnAlertMe" data-gage-number="' + stationNumber +'">Unsubscribe</button>' +
                                '<script>' +
                                    '$(\'#btnUnAlertMe\').on("click", function(){' +
                                        // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                        'unAlertMe();' +
                                    '});'+
                                '</script>');
                        }else{
                            $('#alertMe').html('<p>You have not registered to receive alerts for this flood plain.</p>'+
                            '<button class="btn btn-default" id="btnAlertMe" data-gage-number="' + stationNumber +'">ALERT Me!</button>' +
                            '<script>' +
                                '$(\'#btnAlertMe\').on("click", function(){' +
                                    // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                    'alertMe();' +
                                '});'+
                            '</script>');
                        }
                        break;       

            case("93"): if(gages['gage_93'] == "T"){
                            $('#alertMe').html('<p>You are registered to receive alerts for this flood plain.</p>'+
                                '<button class="btn btn-warning" id="btnUnAlertMe" data-gage-number="' + stationNumber +'">Unsubscribe</button>' +
                                '<script>' +
                                    '$(\'#btnUnAlertMe\').on("click", function(){' +
                                        // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                        'unAlertMe();' +
                                    '});'+
                                '</script>');
                        }else{
                            $('#alertMe').html('<p>You have not registered to receive alerts for this flood plain.</p>'+
                            '<button class="btn btn-default" id="btnAlertMe" data-gage-number="' + stationNumber +'">ALERT Me!</button>' +
                            '<script>' +
                                '$(\'#btnAlertMe\').on("click", function(){' +
                                    // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                    'alertMe();' +
                                '});'+
                            '</script>');
                        }
                        break;   
            case("117"): if(gages['gage_117'] == "T"){
                            $('#alertMe').html('<p>You are registered to receive alerts for this flood plain.</p>'+
                                '<button class="btn btn-warning" id="btnUnAlertMe" data-gage-number="' + stationNumber +'">Unsubscribe</button>' +
                                '<script>' +
                                    '$(\'#btnUnAlertMe\').on("click", function(){' +
                                        // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                        'unAlertMe();' +
                                    '});'+
                                '</script>');
                        }else{
                            $('#alertMe').html('<p>You have not registered to receive alerts for this flood plain.</p>'+
                            '<button class="btn btn-default" id="btnAlertMe" data-gage-number="' + stationNumber +'">ALERT Me!</button>' +
                            '<script>' +
                                '$(\'#btnAlertMe\').on("click", function(){' +
                                    // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                    'alertMe();' +
                                '});'+
                            '</script>');
                        }
                        break;                      
       
        }
        
    }else{
         //user has registered for gage add manage alert subscription link
    }

}

//handler for user gage registration
function alertMe(){
    var jqxhr = $.ajax( "alertMe.php?sta=" + stationNumber)
        .done(function() {
            // alert( "success" );
            $('#alertMe').html("<p>You are registered to receive alerts for this flood plain.</p>" +
                '<button class="btn btn-warning" id="btnAlertMe" data-gage-number="' + stationNumber +'">Unsubscribe</button>' +
                            '<script>' +
                                '$(\'#btnUnAlertMe\').on("click", function(){' +
                                    // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                    'unAlertMe();' +
                                '});'+
                            '</script>');
            //update gages client-side variable
            gages["gage_"+stationNumber] = "T";
        })
        .fail(function() {
            alert( "error" );
        })
        .always(function() {
            // alert( "complete" );
        });
}

//handler for user gage unsubscription
function unAlertMe(){
    var jqxhr = $.ajax( "unAlertMe.php?sta=" + stationNumber)
        .done(function() {
            // alert( "success" );
            $('#alertMe').html('<p>You have not registered to receive alerts for this flood plain.</p>'+
                            '<button class="btn btn-default" id="btnAlertMe" data-gage-number="' + stationNumber +'">ALERT Me!</button>' +
                            '<script>' +
                                '$(\'#btnAlertMe\').on("click", function(){' +
                                    // 'alert("button clicked!"\+$(\'#btnAlertMe\').data("gageNumber"));' +
                                    'alertMe();' +
                                '});'+
                            '</script>');
            //update gage variable
            gages["gage_"+stationNumber] = "F";
        })
        .fail(function() {
            alert( "error" );
        })
        .always(function() {
            // alert( "complete" );
        });
}
//handler for forecast gage deselection
function forecast_unselected_feature(event){
    currentFCGage = ""; //no gage selected
    $('#forecastInfo').slideUp();
}


//string to javascript Date object
function stringToDate(str1){
    // str1 format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
    var mon1   = parseInt(str1.substring(0,2));
    var dt1  = parseInt(str1.substring(3,5));
    var yr1   = parseInt(str1.substring(6,10));
    var date1 = new Date(yr1, mon1-1, dt1);
    return date1;
}

//get lon and lat of feature for zooming in on feature
function getFeatureLonLat(feature){
    var point = new OpenLayers.LonLat(feature.attributes.LONDD83, feature.attributes.LATDD83);
    return point;
}

//compute bounding box given a LonLat object
function computeBBox(lonlat, gageType){
    lonlat.transform(proj_4326, proj_900913);
    var bBox = {
        left: lonlat.lon-100,
        bottom: lonlat.lat - $(window).height()/0.75,
        right: lonlat.lon+100,
        top: lonlat.lat+100
    }
    bounds = new OpenLayers.Bounds(bBox.left, bBox.bottom, bBox.right, bBox.top);
    return bounds;
}

function showSpillLayer(gageID, flowRate){
    //TODO ZOOM TO EXTENT OF SPILL LAYERS, EXPLORE OTHER ALGORITHMS FOR SPILL LAYER DISPLAY
    switch(gageID){
        //START SHOW ROSS CK AT CHERRY AVE SPILL AVE SPILL LAYERS////////////////////
        case "2058":
            //first switch off all spill layers
            if(flowRate<100){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
            }
            if(flowRate>=100&&flowRate<200){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_100cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=200&&flowRate<300){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_200cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=300&&flowRate<400){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_300cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=400&&flowRate<500){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }   
                ross_400cfs_spillArea.setVisibility(true); 
            }
            else if(flowRate>=500&&flowRate<600){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_500cfs_spillArea.setVisibility(true); 
            }
            else if(flowRate>=600&&flowRate<700){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_600cfs_spillArea.setVisibility(true); 
            }
            else if(flowRate>=700&&flowRate<800){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_700cfs_spillArea.setVisibility(true); 
            }
            else if(flowRate>=800&&flowRate<900){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_800cfs_spillArea.setVisibility(true); 
            }
            else if(flowRate>=900&&flowRate<1000){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_900cfs_spillArea.setVisibility(true); 
            }
            else if(flowRate>=1000&&flowRate<1100){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1000cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1100&&flowRate<1200){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1100cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1200&&flowRate<1300){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1200cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1300&&flowRate<1400){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1300cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1400&&flowRate<1500){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1400cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1500&&flowRate<1600){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1500cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1600&&flowRate<1700){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1600cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1700&&flowRate<1800){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1700cfs_spillArea.setVisibility(true);
            }
            else if(flowRate>=1800&&flowRate<1900){
                for(var i=0;i<Ross_Ck_Cherry_SpillLayers.length;i++){
                    Ross_Ck_Cherry_SpillLayers[i].setVisibility(false);
                }
                ross_1800cfs_spillArea.setVisibility(true);
            }
            break;
            //END SHOW ROSS CK AT CHERRY AVE SPILL AVE SPILL LAYERS////////////////////

    }
}
//jquery code
$(document).ready(function(){
    
    //hide forecastInfo div
    $('#forecastInfo').hide();
    $('#forecastInfo').tabs();
    $('#forecastInfo').css("visibility", "visible");


    $("#btnControls").toggle(function(){
        $('#controls').fadeOut();
    }, function(){
        $('#controls').fadeIn();
    });

    // view menu event handlers
    $('#countyView').on("click", function(){
        map.zoomToExtent(countyBounds, true);
    });
    //initialize datepicker fields

    //TODO 1 FUNCTION FOR ALL GAGE SELECTION FUNCTIONALITY!!!!!!!!!!
    //alert gage select handler

    //forecast gage select handler
    $('#forecastMenu li').on("click", function(){
        //unselect old forecast gage for 1 at a time gage processing
        if(forecast_streamflow.selectedFeatures.length > 0) select_feature_control.unselect(forecast_streamflow.selectedFeatures[0]);
        var alertID = $(this).attr("id");
        var feat = forecast_streamflow.getFeaturesByAttribute("ALERT_ID", alertID);
        var fc_temp = feat;
        select_feature_control.select(feat[0]);
    });


    //on legend btn click slide sideways
    $("#btnLegend").on("click", function(){
        $("#legend").animate({width: 'toggle'});

    });
    //slider for floodsimulatino
    $('#slider').slider({
        min: 0,
        max: 2000
    });

    // $( "#slider" ).on("slidechange", function(event, ui){
    //     var slideValue = $('#slider').slider("option", "value");
    //     $('#sliderValueLabel a').html(slideValue);
    //     showSpillLayer(currentFCGage, slideValue);
    // });

    $( "#slider" ).on( "slide", function( event, ui ) {
        var slideValue = $('#slider').slider("option", "value");
        $('#sliderValueLabel a').html(slideValue);
        showSpillLayer(currentFCGage, slideValue);
    } );


    $('#btnFloodAnimation').on("click", function(){
        myInterval = window.setInterval('animateSlider()',200);
    });

    $('#btnSignIn').on("click", function(){
        // alert('test');
        $('#signInNavBar').html();
        $('#signInNavBar').html('<form class="navbar-form navbar-left" role="search">' +
                                    '<div class="form-group">' +
                                        '<input type="text" class="form-control" placeholder="email">' +
                                        '<input type="text" class="form-control" placeholder="password">' +
                                    '</div>' +
                                    '<button type="submit" class="btn btn-default">Submit</button>' +
                                '</form>');
        });

    
});

function animateSlider(){
    // alert("animate!");
    $( "#slider" ).slider( "value", slideInterval);
    var slideValue = $('#slider').slider("option", "value");
    $('#sliderValueLabel a').html(slideValue);

    showSpillLayer(currentFCGage, slideValue);
    slideInterval += 100;
    if(slideInterval > 1900){
        clearInterval(myInterval);
        slideInterval = 0;
    }
}



 