//this javascript file contains forecast gage configuration 

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

//handler for forecast gage selection
function forecast_selected_feature(event){
    if(previousStation != null){
        previousStation.hideSpillLayers();
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
    //$('#fcGagePlot').load("assets/php/charts/fc_plot_panel.php?id=" + event.feature.attributes.ALERT_ID);
    
    //TODO: improve algorithm for filling gageinfo tabs
    if(event.feature.attributes.STA_NUMBER === "51"){//ross ck at cherry ave;
        //load plot features
        loadPlot("2058");
        $('#fcAnimatePanel').css("visibility", "visible");
        //make first tab active
        $( "#forecastInfo" ).tabs( "option", "active", 0 );
        //enable flood simulation tab
        $( "#forecastInfo" ).tabs( "enable", 2 );
        //load flood demo html into demo tab

    }else if(event.feature.attributes.STA_NUMBER === "93"){ //Guadalupe R above Branham
        // $('#fcGagePlot').load("assets/php/charts/fc_plot_panel.php?id=" + event.feature.attributes.ALERT_ID);
        loadPlot("1543");
        $('#fcAnimatePanel').css("visibility", "visible");
        $( "#forecastInfo" ).tabs( "enable", 2 );
        $( "#forecastInfo" ).tabs( "option", "active", 0 );

    }else if(event.feature.attributes.STA_NUMBER === "117"){ //West Little Llagas blw
        loadPlot("1467");
        $('#fcAnimatePanel').css("visibility", "visible");
        $( "#forecastInfo" ).tabs( "enable", 2 );
        $( "#forecastInfo" ).tabs( "option", "active", 0 );
    }else if(event.feature.attributes.STA_NUMBER === "112"){ //San Francisquito Ck at Stanford
        loadPlot("112");
        //fc animation panel disabled until forecast data becomes available
        $('#fcAnimatePanel').css("visibility", "hidden");
        $( "#forecastInfo" ).tabs( "option", "active", 0 );
        $( "#forecastInfo" ).tabs( "enable", 2 )
    }
    
    $('#forecastInfo').slideDown(); //forecast gage info made visible
    
    stationNumber = event.feature.attributes.STA_NUMBER; 
    //save station number of currently selected gage
    selectedStation = stationObjects[stationNumber];

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



