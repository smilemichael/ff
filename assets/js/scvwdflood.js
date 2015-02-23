//omnipotent globally scoped application variable
//used to preserve a pristine global state (to not pollute the namespace)
var scvwdflood = {
    map: null,
    stationObjects: null,
    selectedStation: null,
    previousStation:  null, //previously selected station, for switching off spill layers
    forecast_selected_feature: function(event){
        var fcGageInfo = "";  //forecast gageInfo will contain the data of the selected forecast gage
        var featureLonLat = scvwdflood.getFeatureLonLat(event.feature);
        $('#fcGageInfo, #fcPlot').empty();//clear old contents
        fcGageInfo +=  "<div class='fcGageInfo' id=\"" + event.feature.fid + "\">"+
                    "<strong>Station Name: </strong>" + event.feature.attributes.STA_NAME +"<br/>" +
                    "<strong>Station Number: </strong>" + event.feature.attributes.STA_NUMBER +"<br/>" +
                    "<strong>ALERT ID: </strong>" + event.feature.attributes.ALERT_ID +"<br/>" +
                    "<strong>Gage Type: </strong>" + event.feature.attributes.GAGE_TYPE +"<br/>" +
                    "<strong>Major Watershed: </strong>" + event.feature.attributes.WTRSHD_MAJ +"<br/>" +
                    "<strong>Longitude: </strong>" + event.feature.attributes.LONDD83 +"<br/>" +
                    "<strong>Latitude: </strong>" + event.feature.attributes.LATDD83 +"<br/></div>";
                
        //zoom to selected forecast gage
        scvwdflood.map.zoomToExtent(scvwdflood.computeBBox(featureLonLat));
        $('#fcGageInfo').html(fcGageInfo);
        //make first tab active
        $("#forecastInfo").tabs( "option", "active", 0 );
        //enable flood simulation tab
        $("#forecastInfo").tabs( "enable", 2 );
        $('#forecastInfo').slideDown(function(){
            //display loading message while hydrograph is being rendered
            $('#fcPlot').html("loading hydrograph...<img src='assets/images/ajax-loader.gif'/>");
            //load forecast hydrograph before retrieving spill layers
            scvwdflood.selectedStation.loadPlot();
        }); //forecast gage info made visible
        
        //set selectedstation property of scvwdflood to currently selected station
        scvwdflood.selectedStation = scvwdflood.stationObjects[event.feature.attributes.STA_NUMBER];
        
        //get spill layers for selected station
        if(scvwdflood.selectedStation.spillLayersLoaded == false){
            scvwdflood.selectedStation.getSpillLayers();
        }

        
    },
    //handler for forecast gage deselection
    forecast_unselected_feature: function(event){
        scvwdflood.previousStation = scvwdflood.selectedStation;
        scvwdflood.previousStation.hideSpillLayers();

        $('#forecastInfo').slideUp(function(){
            scvwdflood.previousStation.plot.hc_chart.destroy();
            $('#fcPlot').html("loading hydrograph...<img src='assets/images/ajax-loader.gif'/>");
        });
        scvwdflood.selectedStation = null; //no station is currently selected
        $('#floodDemoSelect').val("default");//reset flood event select
    },
    featureOver: function(feature){
        var fname = feature.attributes.STA_NAME;
        if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            fname += ' '+ Math.round(feature.geometry.getGeodesicLength(feature.layer.map.baseLayer.projection) * 0.1) / 100 + 'km';
        }
        var xy = scvwdflood.map.getControl('mousePositionControl').lastXy || { x: 0, y: 0 };
        scvwdflood.showTooltip(fname, xy.x, xy.y);
    },
    showTooltip: function(ttText, x, y) {
        var windowWidth = $(window).width();;
        var o = document.getElementById('tooltip');
        o.innerHTML = ttText;
        if(o.offsetWidth) {
            var ew = o.offsetWidth;
        }else if(o.clip.width) {
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
    },
    hideTooltip: function(){
        document.getElementById('tooltip').style.visibility = 'hidden';
    },
    getFeatureLonLat: function(feature){ //get lon and lat of feature for zooming in on feature
        var point = new OpenLayers.LonLat(feature.attributes.LONDD83, feature.attributes.LATDD83);
        return point;
    },
    computeBBox: function(lonlat){ //compute bounding box given a LonLat object
        lonlat.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
        var bBox = {
            left: lonlat.lon-100,
            bottom: lonlat.lat - (window.innerHeight)/0.75,
            right: lonlat.lon+100,
            top: lonlat.lat+100
        }
        bounds = new OpenLayers.Bounds(bBox.left, bBox.bottom, bBox.right, bBox.top);
        return bounds;
    }
};

//////////////////APPLICATION JS FUNCTIONS///////////////////////
//initialize web map
function init(){
    //proxy host to resolve CORS
    OpenLayers.ProxyHost = 'proxy.php?url=';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
    OpenLayers.Util.onImageLoadErrorColor = "transparent";
    
    //map settings     
    var map = new OpenLayers.Map('map', {
        maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
        autoUpdateSize: true,
        transitionEffect: null,
        zoomMethod: null,
        projection: new OpenLayers.Projection('EPSG:4326'),
        units: "degrees",
        	controls: [
        			new OpenLayers.Control.PanZoomBar(),
        			new OpenLayers.Control.Navigation({'zoomWheelEnabled': true}),
        			new OpenLayers.Control.ScaleLine()
        	]	
    });

    map.viewBounds = {  
                        "county":   new OpenLayers.Bounds(-13604530.147681711,4444768.802554563 ,-13534055.207602875,4498656.90749554),
                        "losAltos": new OpenLayers.Bounds(-13596708.942446, 4491246.0376315, -13590593.980184, 4494131.5354489),
                        "sanJose":  new OpenLayers.Bounds(-13575212.778089, 4482595.7357638, -13562982.853565, 4489322.194252),
                        "santaClara": new OpenLayers.Bounds(-13583080.00662, 4483885.4517777, -13570850.082096, 4490611.9102659),
                        "milpitas": new OpenLayers.Bounds(-13575631.431899, 4496367.3185259, -13563401.507375, 4502138.3141607),
                        "paloAlto": new OpenLayers.Bounds(-13599848.424913, 4499135.226219, -13593733.462651, 4502020.7240364),
                        "sunnyvale": new OpenLayers.Bounds(-13591207.387007, 4485362.4567691, -13578977.462483, 4493569.8826801)
                    };

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
            visibility: false,
            animationEnabled: true
        }
    );
    
    //ol select feature control
    forecast_streamflow = new OpenLayers.Layer.Vector(
        "&nbspFlood Forecast Gages",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://54.173.207.47:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:ForecastStreamFlow&maxFeatures=50&outputFormat=json", //aws
                // url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:ForecastStreamFlow&maxFeatures=50&outputFormat=json", //alertd
                format: new OpenLayers.Format.GeoJSON()  
            }),
            strategies: [new OpenLayers.Strategy.Fixed()],
            displayInLayerSwitcher: false
        }
    );

    //forecast gage feature style
    var fc_vector_style = new OpenLayers.Style({
        'cursor' : 'pointer',
        'externalGraphic': 'assets/images/streamflow.png',
        'fillOpacity': 0.8,
        'pointRadius': 12
    });

    //forecast gage feature select style
    var fc_vector_style_select = new OpenLayers.Style({
        'externalGraphic': 'assets/images/streamflow_selected.png',
        'fillOpacity': 0.8,
        'pointRadius': 16
    });

    //forecast gage style map
    var fc_vector_style_map = new OpenLayers.StyleMap({
        'default':fc_vector_style,
        'select':fc_vector_style_select
    });

    map.spill_vector_style_map = new OpenLayers.StyleMap({
        'default':   new OpenLayers.Style({
                      'fillColor':'#0033CC',
                      'fillOpacity': 0.5,
                      'strokeColor': '#0000FF',
                      'strokeWidth': 0
                    })
    });
    map.events.register("changebaselayer", this, function(obj){
        alert("test");
    });



    //apply stylemap to forecast gage layer
    forecast_streamflow.styleMap = fc_vector_style_map;
     //register events when features are selected/unselected
    forecast_streamflow.events.register('featureselected', this, scvwdflood.forecast_selected_feature);
    forecast_streamflow.events.register('featureunselected', this, scvwdflood.forecast_unselected_feature);

    //add all layers to map
    map.addLayers([gphys,grod,gsat,forecast_streamflow]);

    //select feature control for forecast gages
    select_feature_control = new OpenLayers.Control.SelectFeature(
        [forecast_streamflow], //this layer must be added to map before being referenced by the control
        {
            multiple:false,
            toggle: true,
            toggleKey: 'ctrlKey',
            box:false,
            callbacks: {
                over: scvwdflood.featureOver,
                out: scvwdflood.hideTooltip
            }
        }
    );
    //add select feature control to map
    map.addControl(select_feature_control);
    //activate select feature control
    select_feature_control.activate();
    //zoom to county extent
    map.zoomToExtent(map.viewBounds["county"]);
    
    //add map to global scvwdflood object
    scvwdflood.map = map;
    //hack to add legend
    //todo use regex to determine div id
    // $("#OpenLayers_Control_LayerSwitcher_37_layersDiv").append('<div class="baseLbl">Legend</div><div class="baseLayersDiv"><img src="assets/images/streamflow.png">&nbspStreamflow Gage</div>');
    $("#OpenLayers_Control_LayerSwitcher_32_layersDiv").append('<div class="baseLbl">Legend</div><div class="baseLayersDiv"><img src="assets/images/streamflow.png">&nbspStreamflow Gage</div>');
}




//////////////////END APPLICATION JS FUNCTIONS///////////////////////
//JQUERY CODE
$(document).ready(function(){

    //disclaimer message on app launch
    $("#disclaimer-message").dialog({
        modal: true,
        minWidth: 500,
        draggable: true,
        resizable: false,
        buttons: {
            "I understand and agree": function() {
                    $(this).dialog("close");
                }
        }
    });
    //mouse position used for tooltip
    var currentMousePos = { x: -1, y: -1 };
    //update mousePosition on mouseMove
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    //help box functions and event handling
    var floodEventHelpText = "A hypothetical flood of a certain chance that is based on historically recorded data. For more information: <a href='http://water.usgs.gov/edu/100yearflood.html' target='_blank'>http://water.usgs.gov/edu/100yearflood.html</a>";
    var helpBoxOpen = false;
    $('#helpBox').hide(); //hide help box initially
    $("#closeHelpBox").on('click',function(){
        $('#helpBox').fadeOut('slow');
        helpBoxOpen = false;

    });
    function showHelpBox(hbText, x, y){
        $('#helpBox').css('top', y +'px');
        $('#helpBox').css('left', x +'px');
        $('#helpBoxText').html(hbText);

        // $('#helpBox').css('display', 'block');
        $('#helpBox').fadeIn( "slow", function() {
            // Animation complete
         });
        helpBoxOpen = true;
    }
    $('#floodEventHelpIcon').on("mouseover", function(){
        if(!helpBoxOpen){
            var xy = map.getControl('mousePositionControl').lastXy || { x: 0, y: 0 };
            // $('#helpBox').css('display', 'block');
            showHelpBox(floodEventHelpText, currentMousePos.x, currentMousePos.y);
        }
    });
    //end help box modules
    //initialize streamflow gage objects (streamFlowGages.js)
    initGages();
    $('#forecastInfo').hide(); //hide forecastInfo div
    $('#forecastInfo').tabs(); //enable jQuery UI tabs on forecastInfo div
    $('#forecastInfo').tabs('disable', 3 ); //disable alert me button while registration, etc. is under construction
    //make forecast info visible, now that its off screen 
    $('#forecastInfo').css("visibility", "visible");
    
    //show flood events for flood demos
    $("#floodDemoSelect").change(function() {
        var floodEvent = $("#floodDemoSelect").val();
        if(floodEvent != "default"){
            scvwdflood.selectedStation.displayFloodEvent(floodEvent);
        }
    });
    
    //map bounds menu event handler
    $('#sbViewSelect').change(function(){
        map.zoomToExtent(map.viewBounds[$('#sbViewSelect option:selected').val()],true);
        $('#sbViewSelect').val("default");
    });

    //gage selection menu event handler
    $('#sbGageSelect').change(function(){
        select_feature_control.unselectAll();
        select_feature_control.select(forecast_streamflow.getFeatureByFid($('#sbGageSelect option:selected').val()));
        $('#sbGageSelect').val("default");
    });

    //event handler to clear demo spills
    $('#btnClearDemoSpill').on('click', function(){
        scvwdflood.selectedStation.hideSpillLayers();
        $(this).attr('disabled', 'disabled');
        $('#floodDemoSelect').val('default');
    });

});

