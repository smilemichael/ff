//globals
var streamflow, map;
var select_feature_control;
var dateFrom,dateTo;

//OpenLayers projections
var proj_2227 = new OpenLayers.Projection('EPSG:2227'); //projection for stream layer
var proj_4326 = new OpenLayers.Projection('EPSG:4326'); //lat, lon
var proj_900913 =  new OpenLayers.Projection('EPSG:900913'); //google maps projection

//bounds of santa clara county, EPSG: 900913
var countyBounds = new OpenLayers.Bounds(-13604530.147681711,4444768.802554563 ,-13534055.207602875,4498656.90749554);

//initialize web map
function init(){
    //proxy host to resolve CORS
    OpenLayers.ProxyHost = '../OpenLayers/cgi-bin/proxy.php?url=';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
    OpenLayers.Util.onImageLoadErrorColor = "transparent";

    //map settings     
    map = new OpenLayers.Map('map', {
        numZoomLevels: 20,
        maxResolution: 156543.0339,
        minResolution: 0.2985821416854859,
        maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
        projection: proj_4326,
        displayProjection: proj_900913,
        units: "m",
        	controls: [
        			new OpenLayers.Control.PanZoomBar(),
        			new OpenLayers.Control.Navigation({'zoomWheelEnabled': true}),
        			new OpenLayers.Control.ScaleLine(),
        			new OpenLayers.Control.MousePosition({
                            prefix: '<a target="_blank" ' +
                                'href="http://spatialreference.org/ref/epsg/4326/">' +
                                'Lon | Lat</a> coordinates: ',
                            separator: ' | ',
                            numDigits: 6,
                            emptyString: 'Mouse is not over map.'
                        }),
        	]	
    });

    //layer switcher control
    var switcherControl = new OpenLayers.Control.LayerSwitcher({'ascending':false});
    map.addControl(switcherControl);
    switcherControl.maximizeControl();

    //google map base layers		
    var gsat = new OpenLayers.Layer.Google(" Google Satellite", {
        type: google.maps.MapTypeId.SATELLITE,
        numZoomLevels: 22,
        visibility: false,
        animationEnabled: true
        }
    );
    var grod = new OpenLayers.Layer.Google(" Google Road", {
        type: google.maps.MapTypeId.ROADMAP,
        numZoomLevels: 22,
        visibility: false,
        animationEnabled: true
        }
    );
    var gphys = new OpenLayers.Layer.Google(" Google Physical", {
        type: google.maps.MapTypeId.TERRAIN,
        numZoomLevels: 22,
        visibility: false,
        animationEnabled: true
        }
    );
    map.addLayers([gphys,grod,gsat]);

    //scvwd streamflow gages layer from GeoJSON
    streamflow = new OpenLayers.Layer.Vector(
        " Streamflow",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://localhost:8089/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:HistoryOnly&maxFeatures=100&outputFormat=json",
                format: new OpenLayers.Format.GeoJSON({
                    // extractStyles: false,
                    // extractAttributes: true,
                    // maxDepth: 10
                })
            }),
            strategies: [new OpenLayers.Strategy.Fixed()]
        }
    );

    //ALERT gage overlay layer from geoJSON
    alert_streamflow = new OpenLayers.Layer.Vector(
        " ALERT gages",
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://localhost:8089/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:Alert&maxFeatures=50&outputFormat=json&mode=download",
                format: new OpenLayers.Format.GeoJSON({
                    // extractStyles: false,
                    // extractAttributes: true,
                    // maxDepth: 100
                })
            }),
            strategies: [new OpenLayers.Strategy.Fixed()]
        }
    );

    //fc streamflow geoJSON
    forecast_streamflow = new OpenLayers.Layer.Vector(
        " Flood Forecast Gages",
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


    //streamflow gage feature style
    var sf_vector_style = new OpenLayers.Style({
        'cursor' : 'pointer',
        'fillColor':'#3399FF',
        'fillOpacity': 0.8,
        'strokeColor': '#232323',
        'strokeWidth': 2,
        'pointRadius': 6,
        'strokeDashStyle' : 'dot'
    });

    //streamflow gage feature select style
    var sf_vector_style_select = new OpenLayers.Style({
        'fillColor':'#000099',
        'fillOpacity': 0.9,
        'graphicName':'circle',
        'strokeColor': '#00FF00',
        'strokeWidth': 3,
        'pointRadius': 9,
        'strokeDashStyle' : 'solid'
    });

    var sf_vector_style_map = new OpenLayers.StyleMap({
        'default':sf_vector_style,
        'select':sf_vector_style_select
    });

    streamflow.styleMap = sf_vector_style_map;

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

    //Alert gage feature style
    var alert_vector_style = new OpenLayers.Style({
        'cursor' : 'pointer',
        'fillColor':'#FF9900',
        'graphicName': 'circle',
        'fillOpacity': 0.8,
        'strokeColor': '#000000',
        'strokeWidth': 2,
        'pointRadius': 6,
        'strokeDashStyle' : 'dot'
    });

    //Alert gage feature select style
    var alert_vector_style_select = new OpenLayers.Style({
        'fillColor':'#FFFF00',
        'graphicName': 'circle',
        'fillOpacity': 0.8,
        'strokeColor': '#00FF00',
        'strokeWidth': 3,
        'pointRadius': 9,
        'strokeDashStyle' : 'dot'
    });

    var alert_vector_style_map = new OpenLayers.StyleMap({
        'default':alert_vector_style,
        'select':alert_vector_style_select
    });

    alert_streamflow.styleMap = alert_vector_style_map;
    
    //add gage layers to map
    map.addLayers([streamflow, alert_streamflow, forecast_streamflow]);

    //select feature control for gage layers
    select_feature_control = new OpenLayers.Control.SelectFeature(
        [streamflow, alert_streamflow, forecast_streamflow],
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
    //streamflow.events.register('featureselected', this, selected_feature);
    //streamflow.events.register('featureunselected', this, unselected_feature);
    alert_streamflow.events.register('featureselected', this, alert_selected_feature);
    alert_streamflow.events.register('featureunselected', this, alert_unselected_feature);    
    forecast_streamflow.events.register('featureselected', this, forecast_selected_feature);
    forecast_streamflow.events.register('featureunselected', this, forecast_unselected_feature);

    //zoom to county extent
    map.zoomToExtent(countyBounds);
}

//handler for forecast gage selection
function forecast_selected_feature(event){
    $('#fcGageInfo').empty()//clear old contents
    var fcGageInfo = "";  //forecast gageInfo will contain the data of the selected forecast gage
    fcGageInfo +=  "<div class='gageInfo' id=\"" + event.feature.fid + "\">"+
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
    $('#fcGagePlot').load("assets/php/charts/fc_plot_panel.php?id=" + event.feature.attributes.ALERT_ID);
    $('#forecastInfo').slideDown(); //forecast gage info made visible

}

//handler for forecast gage deselection
function forecast_unselected_feature(event){
    $('#forecastInfo').slideUp();
}

//handler for alert gage selection
function alert_selected_feature(event){
    //empty old contents
    $('#tabs-1').empty();
    $('#plotSelect').empty();

    var gageInfo = "";  //gageInfo will contain the data of selected gages
    var plotSelect =""; //plotSelect is a select box used to redisplay plot        
    for(var i=0;i<alert_streamflow.selectedFeatures.length;i++){
        gageInfo +=  "<div class='gageInfo' id=\"" + alert_streamflow.selectedFeatures[i].fid+ "\"style='width:350px;cursor:pointer;border:2px solid;display:inline-block;border-radius:5px;padding:20px;margin:10px;'>"+
                    "<strong>Station Name: </strong>" + alert_streamflow.selectedFeatures[i].attributes.STA_NAME +"<br/>" +
                    "<strong>Station Number: </strong>" + alert_streamflow.selectedFeatures[i].attributes.STA_NUMBER +"<br/>" +
                    "<strong>ALERT ID: </strong>" + alert_streamflow.selectedFeatures[i].attributes.ALERT_ID +"<br/>" +
                    "<strong>Gage Type: </strong>" + alert_streamflow.selectedFeatures[i].attributes.GAGE_TYPE +"<br/>" +
                    "<strong>Major Watershed: </strong>" + alert_streamflow.selectedFeatures[i].attributes.WTRSHD_MAJ +"<br/>" +
                    "<strong>Longitude: </strong>" + alert_streamflow.selectedFeatures[i].attributes.LONDD83 +"<br/>" +
                    "<strong>Latitude: </strong>" + alert_streamflow.selectedFeatures[i].attributes.LATDD83 +"<br/></div>";
            
        plotSelect +="<option value=\"" + alert_streamflow.selectedFeatures[i].attributes.ALERT_ID + "\">" + alert_streamflow.selectedFeatures[i].attributes.STA_NAME+ "</option>";
    }
    plotSelect += "</select>";
    $("#tabs-1").append("Selected Gages<hr/>")
    $("#tabs-1").append(gageInfo);

    //UI aesthetics, change gageInfo box on mouseover
    $(".gageInfo").mouseover(function(){
        $(this).css("background-color", "#66FFFF");
    });
    $(".gageInfo").mouseleave(function(){
        $(this).css("background-color", "#FFFFFF");
    });

    //zoom to sensors extent when gageInfo box is clicked
    $('.gageInfo').on("click",function(){
        var featureLonLat = getFeatureLonLat(alert_streamflow.getFeatureByFid($(this).attr("id")));
        map.zoomToExtent(computeBBox(featureLonLat, "alert"));
    });

    //load plot, default plot is 1st feature of selectedFeatures array
    $('#plot').load('assets/php/charts/plot_consultant_map4.php?id='+ alert_streamflow.selectedFeatures[0].attributes.ALERT_ID);

    //more than one gage is selected...
    if(alert_streamflow.selectedFeatures.length > 1){

        //insert plot select box and make it visible
        $('#plotSelect').append(plotSelect)
        $('#plotSelectParent').css("visibility", "visible");

        //create get parameters string for multi-plot.php (i.e. id_0=1234&id_2=4567...)
        var getParams = "";
        for(var i=0; i < alert_streamflow.selectedFeatures.length; i++){
            getParams += "id_" + i + "=" + alert_streamflow.selectedFeatures[i].attributes.ALERT_ID;
            if(i < alert_streamflow.selectedFeatures.length-1){
                getParams += "&";
            }
        }

        //load multiplot
        $('#multiPlot').load('assets/php/charts/plot_multi.php?'+getParams);

        //enable multi-plot tab
        $( "#tabbedPanel" ).tabs("enable", 2 );
    }else{  
        //only single sensor selected
        //disable multi-plot
        $( "#tabbedPanel" ).tabs( "option", "disabled", [2] );
    }
    //make gage info panel visible
    $('#tabbedPanel').css('visibility', 'visible');
}

//unselected alert feature handler
function alert_unselected_feature(event){
    var gageInfo="";

    //empty old contents
    $("#tabs-1").empty();
    $('#plot').empty();
    $('#multiPlot').empty();

    //load first tab
    $( "#tabbedPanel" ).tabs({active: 0} );

    if(alert_streamflow.selectedFeatures.length > 0){
        for(var i=0;i<alert_streamflow.selectedFeatures.length;i++){
        gageInfo +=  "<div style='border:2px solid;display:inline-block;border-radius:5px;padding:20px;margin:10px;'>"+
                    "<strong>Station Name: </strong>" + alert_streamflow.selectedFeatures[i].attributes.STA_NAME +"<br/>" +
                    "<strong>Station Number: </strong>" + alert_streamflow.selectedFeatures[i].attributes.STA_NUMBER +"<br/>" +
                    "<strong>ALERT ID: </strong>" + alert_streamflow.selectedFeatures[i].attributes.ALERT_ID +"<br/>" +
                    "<strong>Gage Type: </strong>" + alert_streamflow.selectedFeatures[i].attributes.GAGE_TYPE +"<br/>" +
                    "<strong>Major Watershed: </strong>" + alert_streamflow.selectedFeatures[i].attributes.WTRSHD_MAJ +"<br/>" +
                    "<strong>Longitude: </strong>" + alert_streamflow.selectedFeatures[i].attributes.LONDD83 +"<br/>" +
                    "<strong>Latitude: </strong>" + alert_streamflow.selectedFeatures[i].attributes.LATDD83 +"<br/></div>";
            
        }
        $("#tabs-1").append(gageInfo);
    }else{
        $('#tabbedPanel').css('visibility', 'hidden');
    }
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
    if(gageType =="forecast"){
        var bottomOffset = -500; 
    }else{
        bottomOffset = -100;
    }
    var bBox = {
        left: lonlat.lon-100,
        bottom: lonlat.lat + bottomOffset,
        right: lonlat.lon+100,
        top: lonlat.lat+100
    }
    bounds = new OpenLayers.Bounds(bBox.left, bBox.bottom, bBox.right, bBox.top);
    return bounds;
}

//jquery code
$(document).ready(function(){
    
    //hide forecastInfo div
    $('#forecastInfo').hide();
    $('#forecastInfo').tabs();
    $('#forecastInfo').css("visibility", "visible");
    //display gage info in a tabbed,draggable panel
    $( "#tabbedPanel" ).tabs({collapsible: true, active: 0 });
    $('#tabbedPanel').draggable();

    //close gage info panel
    $('#btnClosePanel').on('click', function(){
        $('#tabbedPanel').css("visibility", "hidden");  //hide panel div
        //clear old data from tabs
        $('#tabs-1').empty();
        $('#plot').empty();
        $('#multiPlot').empty();
        $("#plotSelectParent").css("visibility", "hidden"); //hide plot select box
    });

    //change flow/stage plot via gage selection box
    $( "#plotSelect" ).change(function() {
        var id = $(this).find("option:selected").attr("value");
        $('#plot').html("Loading...<img src=\"assets/images/ajax-loader.gif\"/>");
        $('#plot').load('../php/charts/plot_consultant_map4.php?id='+ id);
    });

    //zoom to county extent on button click
    $("#btnCountyView").on("click", function(){
        map.zoomToExtent(countyBounds);
    });

    //disable drag when over plot for plot data zooming and selection
    $("#plot, #multiPlot").mouseover(function(){
        $('#tabbedPanel').draggable("disable");
    });
    $("#plot, #multiPlot").mouseleave(function(){
        $('#tabbedPanel').draggable("enable");
    });
    
    //initialize datepicker fields
    $( "#plotDPFrom" ).datepicker();
    $( "#plotDPTo" ).datepicker();
});



 