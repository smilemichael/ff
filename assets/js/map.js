//OpenLayers projections
var proj_4326 = new OpenLayers.Projection('EPSG:4326'); //lat, lon
var proj_900913 =  new OpenLayers.Projection('EPSG:900913'); //google maps projection
//OL map
var map;
//flood animation variables;
var myInterval;
var fcAnimate = false;
var animationIndex = 0;

//ol bounds for view select
var countyBounds = new OpenLayers.Bounds(-13604530.147681711,4444768.802554563 ,-13534055.207602875,4498656.90749554);
var sanJoseBounds = new OpenLayers.Bounds(-13575212.778089, 4482595.7357638, -13562982.853565, 4489322.194252);
var santaClaraBounds = new OpenLayers.Bounds(-13583080.00662, 4483885.4517777, -13570850.082096, 4490611.9102659);
var losAltosBounds = new OpenLayers.Bounds(-13596708.942446, 4491246.0376315, -13590593.980184, 4494131.5354489);
var milpitasBounds = new OpenLayers.Bounds(-13575631.431899, 4496367.3185259, -13563401.507375, 4502138.3141607);
var paloAltoBounds = new OpenLayers.Bounds(-13599848.424913, 4499135.226219, -13593733.462651, 4502020.7240364);
var sunnyvaleBounds = new OpenLayers.Bounds(-13591207.387007, 4485362.4567691, -13578977.462483, 4493569.8826801);

//////////////////APPLICATION JS FUNCTIONS///////////////////////
//initialize web map
function init(){
    //proxy host to resolve CORS
    OpenLayers.ProxyHost = 'proxy.php?url=';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
    OpenLayers.Util.onImageLoadErrorColor = "transparent";
   
    //map settings     
    map = new OpenLayers.Map('map', {
        maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
        autoUpdateSize: true,
        transitionEffect: null,
        zoomMethod: null,
        projection: proj_4326,
        units: "degrees",
        	controls: [
        			new OpenLayers.Control.PanZoomBar(),
        			new OpenLayers.Control.Navigation({'zoomWheelEnabled': true}),
        			new OpenLayers.Control.ScaleLine()
        	]	
    });

    //mouse position control used for tooltips over forecast gages
    var mousePositionControl = new OpenLayers.Control.MousePosition({
        id: "mousePositionControl",
        element: "MousePosition"
    });
    map.addControl(mousePositionControl);
    
    //layer switcher control
    var switcherControl = new OpenLayers.Control.LayerSwitcher({'ascending':false});
    map.addControl(switcherControl);
    switcherControl.maximizeControl();

    //google map base layers
    //google satellite base layer		
    var gsat = new OpenLayers.Layer.Google("&nbspGoogle Satellite", {
            type: google.maps.MapTypeId.SATELLITE,
            numZoomLevels: 18,
            visibility: false,
            animationEnabled: true
        }
    );
    //google road base layer
    var grod = new OpenLayers.Layer.Google("&nbspGoogle Road", {
            type: google.maps.MapTypeId.ROADMAP,
            numZoomLevels: 22,
            visibility: false,
            animationEnabled: true
        }
    );
    //google physical base layer
    var gphys = new OpenLayers.Layer.Google("&nbspGoogle Physical", {
            type: google.maps.MapTypeId.TERRAIN,
            visibility: false,
            animationEnabled: true
        }
    );
    map.addLayers([gphys,grod,gsat]);
    //zoom to county extent
    map.zoomToExtent(countyBounds);
    //disclaimer
    //gage registration state strings
    var registeredForGageMessage = "You are registered to receive alerts for this flood plain.";
    var notRegisteredForGageMessage = "You are not registered to receive alerts for this flood plain.";

    //ol select feature control
    var select_feature_control;

    var forecast_streamflow = new OpenLayers.Layer.Vector(
        "&nbspFlood Forecast Gages",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:ForecastStreamFlow&maxFeatures=50&outputFormat=json",
                format: new OpenLayers.Format.GeoJSON({
                    // extractStyles: false,
                    // extractAttributes: true,
                    // maxDepth: 10
                })  
            }),
            strategies: [new OpenLayers.Strategy.Fixed()],
            displayInLayerSwitcher: false
        }
        );

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

    //forecast gage style map
    var fc_vector_style_map = new OpenLayers.StyleMap({
        'default':fc_vector_style,
        'select':fc_vector_style_select
    });

    //apply stylemap to forecast gage layer
    forecast_streamflow.styleMap = fc_vector_style_map;

    //add forecast gage layer to map
    map.addLayers([forecast_streamflow]);

    //select feature control for forecast gages
    select_feature_control = new OpenLayers.Control.SelectFeature(
        [forecast_streamflow],
        {
            multiple:false,
            toggle: true,
            toggleKey: 'ctrlKey',
            box:false,
            callbacks: {
                over: featureOver,
                out: hideTooltip
            }
        }
        );

    //add select feature control to map
    map.addControl(select_feature_control);
    //activate select feature control
    select_feature_control.activate();

    //register events when features are selected/unselected
    forecast_streamflow.events.register('featureselected', this, forecast_selected_feature);
    forecast_streamflow.events.register('featureunselected', this, forecast_unselected_feature);
    
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
        bottom: lonlat.lat - (window.innerHeight)/0.75,
        right: lonlat.lon+100,
        top: lonlat.lat+100
    }
    bounds = new OpenLayers.Bounds(bBox.left, bBox.bottom, bBox.right, bBox.top);
    return bounds;
}

function featureOver(feature){
    var fname = feature.attributes.STA_NAME;
    if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
        fname += ' '+ Math.round(feature.geometry.getGeodesicLength(feature.layer.map.baseLayer.projection) * 0.1) / 100 + 'km';
    }
    var xy = map.getControl('mousePositionControl').lastXy || { x: 0, y: 0 };
    showTooltip(fname, xy.x, xy.y);
}

//show station name tooltip when cursor is over gage vector feature
function showTooltip(ttText, x, y) {
    var windowWidth = $( window ).width();;
    var o = document.getElementById('tooltip');
    o.innerHTML = ttText;
    if(o.offsetWidth) {
        var ew = o.offsetWidth;
    } else if(o.clip.width) {
        var ew = o.clip.width;
    }
    y = y + 16;
    x = x - (ew / 4);
    if (x < 2) {
        x = 2;
    } else if(x + ew > windowWidth) {
        x = windowWidth - ew - 4;
    }
    o.style.left = x + 'px';
    o.style.top = y + 'px';
    o.style.visibility = 'visible';
}

//hide tool tip
function hideTooltip(){
    document.getElementById('tooltip').style.visibility = 'hidden';
}

///////////////////////////////////////FLOOD ANIMATION FUNCTIONS
function fAnimate(){
   if (animationIndex === chart.series[1].data.length) {
        animationIndex = 0;
        // selectedStation.displaySpill(0);
        stopFAnimate();
    }
    var x = chart.series[1].data[animationIndex].x;
    var tIndex = jQuery.inArray(x, fcTimeIndex);
    selectedStation.displaySpill(tIndex);
    chart.series[1].data[animationIndex].select();
    animationIndex += 1;
}

//stop flood animation function
function stopFAnimate(){
    clearInterval(myInterval);
    fcAnimate = false;
    $('.fccontrols').toggle();
}
///////////////////////////////////////END FLOOD ANIMATION FUNCTIONS
//handler for forecast gage selection
function forecast_selected_feature(event){
    if(previousStation != null){
        previousStation.hideSpillLayers();
        //remove old chart
    }
    $('#fcGageInfo, #fcPlot').empty();//clear old contents
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
    $('#fcAnimatePanel').css("visibility", "visible");
    //make first tab active
    $( "#forecastInfo" ).tabs( "option", "active", 0 );
    //enable flood simulation tab
    $( "#forecastInfo" ).tabs( "enable", 2 );
    $('#forecastInfo').slideDown(); //forecast gage info made visible
    
    //save station number of currently selected gage
    stationNumber = event.feature.attributes.STA_NUMBER; 
    selectedStation = stationObjects[stationNumber];
    
    //get spill layers for selected station
    if(selectedStation.spillLayersLoaded == false){
        selectedStation.getSpillLayers();
    }
    //load forecast hydrograph
    selectedStation.loadPlot();
    // if user is logged in, enable alert regisration/unregistration
    var $object = $('#alertMe');
    if($object.length > 0) {//check if alertme div exists in DOM
        $('#registrationControl').html(registrationControlHTML(selectedStation.stationNumber));
    }
    //disable download kml button until spill layer is displayed
    // $('#btnDownloadKML').attr("disabled", "disabled");
}

//handler for forecast gage deselection
function forecast_unselected_feature(event){
    previousStation = selectedStation;
    previousStation.plot.hc_chart.destroy();
    if(fcAnimate == true){ //stop animation if its playing
        stopFAnimate();
    }
    $('#forecastInfo').slideUp();
    selectedStation = null; //no station is currently selected
    $('#floodDemoSelect').val("default");//reset flood event select
}

//this function returns html to be placed in ALERT ME tab
//html is dependent upon gage registration state
function registrationControlHTML(staNumber){
    var htmlString = "";
    var stationString = "gage_" + staNumber;
    var registered;
    if(gages[stationString] === "T"){
        registered = true
    }else{
        registered = false;
    }
    if(registered){
        $('#alertGageRegistrationMessage').html(registeredForGageMessage);
        htmlString +=   '<button class="btn btn-warning" id="btnUnAlertMe" data-gage-number="' + selectedStation.stationNumber +'">Unsubscribe</button>' +
                        '<script>' +
                            '$(\'#btnUnAlertMe\').on("click", function(){' +
                                'unAlertMe();' +
                            '});'+
                        '</script>';  
    }else{
        $('#alertGageRegistrationMessage').html(notRegisteredForGageMessage);
        htmlString +=   '<button class="btn btn-default" id="btnAlertMe" data-gage-number="' + selectedStation.stationNumber +'">ALERT Me!</button>' +
                        '<script>' +
                            '$(\'#btnAlertMe\').on("click", function(){' +
                                'alertMe();' +
                            '});'+
                        '</script>'; 
    }
    return htmlString;
}

//////////////////END APPLICATION JS FUNCTIONS///////////////////////


//JQUERY CODE
$(document).ready(function(){
    //hide forecastInfo div
    $('#forecastInfo').hide();
    //enable jQuery UI tabs on forecastInfo div
    $('#forecastInfo').tabs();
    //make forecast info visible, now that its off screen 
    $('#forecastInfo').css("visibility", "visible");

    //start flood animation on play button click
    $('#btnFCAnimate').on("click", function(){
        fcAnimate = true;
        //reset flood event select box
        $('#floodDemoSelect').val("default");
        //clear any old spill layers that may have been displayed from flood demo select
        map.zoomToExtent(selectedStation.spillExtent, true);
        //set animation interval and callback
        myInterval = window.setInterval('fAnimate()', 20);
        //toggle controls so stop button appears
        $('.fccontrols').toggle();
    });
    
    //stop flood animation on stop button click
    $('#btnFCAnimateStop').on("click", function(){
        stopFAnimate();
    });
    
    //show flood events for flood demos
    $("#floodDemoSelect").change(function() {
        var floodEvent = $("#floodDemoSelect").val();
        //TODO make dynamic
        if(floodEvent != "default"){
            selectedStation.displayFloodEvent(floodEvent);
        }else{
            selectedStation.hideAllSpillLayers();
        }
    });
    // view menu event handlers
    $('#sbViewSelect').change(function(){
        bounds = $('#sbViewSelect option:selected').val();
        map.zoomToExtent(eval(bounds),true);
        $('#sbViewSelect').val("default");
    });

    $('#btnDownloadKML').on("click", function(){
        console.log("downloadbtn pushed");
        selectedStation.downloadKML();
        // $('#linkKMLDownload').trigger('click');
    });

});

