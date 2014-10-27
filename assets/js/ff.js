//OpenLayers projections
var proj_4326 = new OpenLayers.Projection('EPSG:4326'); //lat, lon
var proj_900913 =  new OpenLayers.Projection('EPSG:900913'); //google maps projection
//OL map
var map;

//application state variables
var stationNumber = null; //currently selected station number
var selectedStation = null;
var previousStation = null; //previously selected station, for switching off spill layers

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

    //Add station gages and spill layer configuration script to document////////////////////////////////////////
    var script   = document.createElement("script");
    script.type  = "text/javascript";
    script.src   = "assets/js/stations_Gage_SpillLayerInit.js";    // use this for linked script
    document.body.appendChild(script); 

    //Add forecast gage layer script to document
    var script   = document.createElement("script");
    script.type  = "text/javascript";
    script.src   = "assets/js/forecastGageLayerInit.js";    // use this for linked script
    document.body.appendChild(script);
    //zoom to county extent
    map.zoomToExtent(countyBounds);
    //disclaimer
    
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

function loadPlot(staID){

    //station 112 historic data not in datawise, so a different script is used to render the stream flow hydrograph
    if(staID == "112"){
        $('#fcPlot').load("assets/php/charts/fc_plot_usgs.php");
    }else{
        $('#fcPlot').load("assets/php/charts/fc_plot_scvwd.php?id=" + staID);
    }
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
    // selectedStation.previousFlowRate = 0;
    fcAnimate = false;
    $('.fccontrols').toggle();
}
///////////////////////////////////////END FLOOD ANIMATION FUNCTIONS
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
    });

    $('#btnDownloadKML').on("click", function(){
        console.log("downloadbtn pushed");
        selectedStation.downloadKML();
        // $('#linkKMLDownload').trigger('click');
    });

});

