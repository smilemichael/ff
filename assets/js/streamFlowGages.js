/***********SCVWD Flood Forecast System *******************
File: Gage_Spill_Plot_Init.js
By: Marcian Diamond
Description: This file contains configuration data and application code for gage, spill zone, and plot objects.

*****************************************/
//initialize gage objects
function initGages(){
  /////////////START STATION51 SPILL ZONE LAYER INIT/////////////////
  //spill layer names, used for KML download and to retrieve layers from geoserver via wms request URL
  var spillLayerNames = {
    cherry:   ["51_Cherry_100cfs", "51_Cherry_200cfs","51_Cherry_300cfs","51_Cherry_400cfs", "51_Cherry_500cfs",
                "51_Cherry_600cfs", "51_Cherry_700cfs", "51_Cherry_800cfs", "51_Cherry_900cfs", "51_Cherry_1000cfs",
                "51_Cherry_1100cfs", "51_Cherry_1200cfs", "51_Cherry_1300cfs", "51_Cherry_1400cfs", "51_Cherry_1500cfs",
                "51_Cherry_1600cfs", "51_Cherry_1700cfs", "51_Cherry_1800cfs"],
    jarvis: ["51_Jarvis_100cfs", "51_Jarvis_200cfs", "51_Jarvis_300cfs", "51_Jarvis_400cfs", "51_Jarvis_500cfs",
             "51_Jarvis_600cfs", "51_Jarvis_700cfs"],
    ross1: ["93_Ross1_100cfs", "93_Ross1_200cfs", "93_Ross1_300cfs","93_Ross1_400cfs","93_Ross1_500cfs"],
    ross2: ["93_Ross2_100cfs", "93_Ross2_200cfs"],
    rossL: ["93_RossL_100cfs", "93_RossL_200cfs"],
    rossR: ["93_RossR_100cfs", "93_RossR_200cfs", "93_RossR_300cfs","93_RossR_400cfs","93_RossR_500cfs"],
    WLL: ["117_WLL_280cfs", "117_WLL_421cfs", "117_WLL_561cfs", "117_WLL_701cfs", "117_WLL_841cfs",
          "117_WLL_982cfs", "117_WLL_1122cfs", "117_WLL_1262cfs", "117_WLL_1402cfs"],
    middlefieldL: ["112_MiddlefieldL_100cfs", "112_MiddlefieldL_208cfs"],
    middlefieldR: ["112_MiddlefieldR_100cfs", "112_MiddlefieldR_200cfs", "112_MiddlefieldR_300cfs", "112_MiddlefieldR_400cfs",
                   "112_MiddlefieldR_500cfs", "112_MiddlefieldR_600cfs", "112_MiddlefieldR_700cfs", "112_MiddlefieldR_800cfs", 
                   "112_MiddlefieldR_900cfs", "112_MiddlefieldR_1000cfs", "112_MiddlefieldR_1105cfs"],
    DS101L: ["112_DS101L_100cfs", "112_DS101L_200cfs", "112_DS101L_300cfs", "112_DS101L_400cfs",
             "112_DS101L_500cfs", "112_DS101L_600cfs", "112_DS101L_700cfs", "112_DS101L_800cfs", 
             "112_DS101L_836cfs"],
    DS101R: ["112_DS101R_100cfs", "112_DS101R_200cfs", "112_DS101R_300cfs"],
    popeChaucerL: ["112_PopeChaucerL_100cfs", "112_PopeChaucerL_200cfs", "112_PopeChaucerL_300cfs", "112_PopeChaucerL_415cfs"],     
    popeChaucerR: ["112_PopeChaucerR_100cfs", "112_PopeChaucerR_200cfs", "112_PopeChaucerR_300cfs", "112_PopeChaucerR_400cfs",
                    "112_PopeChaucerR_500cfs", "112_PopeChaucerR_600cfs", "112_PopeChaucerR_700cfs", "112_PopeChaucerR_800cfs",
                    "112_PopeChaucerR_900cfs", "112_PopeChaucerR_1000cfs", "112_PopeChaucerR_1100cfs", "112_PopeChaucerR_1179cfs"]
  };

  //////////START STATION OBJECT CONFIGURATION//////////////////////////////////////
  //////////START STATION51 OBJECT CONFIGURATION//////////////////////////////////////////////
  /////////////////STATION51 CHERRY SPILL ZONE OBJECT CONFIGURATION/////////////////
  var cherryOpt = {
    minSpill: 100, 
    maxSpill: 1800, 
    numSpillLayers: 18, 
    spillRates: [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": 100,"25year": 300,"50year": 800,"100year": 1800}, 
    spillLayerNames: spillLayerNames.cherry, 
    forecastData: Cherry
  };
  for(var i=0;i<cherryOpt.spillRates.length;i++){
      cherryOpt.spillRatesToLayers[cherryOpt.spillRates[i]] = null;
  }
  var sta51_Cherry_SpillZone = new SpillZone(cherryOpt);

  ////////////////STATION51 JARVIS SPILL ZONE OBJECT CONFIGURATION//////////////////////////////////////
  var jarvisOpt = {
    minSpill: 100, 
    maxSpill: 700, 
    numSpillLayers: 7, 
    spillRates: [100,200,300,400,500,600,700],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": 100,"25year": 300,"50year": 500,"100year": 700}, 
    spillLayerNames: spillLayerNames.jarvis, 
    forecastData: Jarvis 
  };

  for(var i=0;i<jarvisOpt.spillRates.length;i++){
      jarvisOpt.spillRatesToLayers[jarvisOpt.spillRates[i]] = null;
  }

  var sta51_Jarvis_SpillZone = new SpillZone(jarvisOpt);
  var sta51Opt = {
    staNum: 51,
    numSpillZones: 2,
    spillZoneNames: ["Cherry", "Jarvis"],
    spillZones: {"Cherry": sta51_Cherry_SpillZone, "Jarvis": sta51_Jarvis_SpillZone},
    spillExtent:  new OpenLayers.Bounds( -13580402.729243, 4466351.8865031,-13555942.880195,4482766.7383251),
    plot: new Plot("assets/js/plots/sta51/sta51Plot.js", sta51_histFlow, sta51_fcFlow)
  };

  var station51 = new Gage(sta51Opt);
  // //////////END STATION51 Object INIT///////////////////////////////////

  //////////START STATION93 OBJECT CONFIGURATION///////////////////////////////////
  /////////////////STATION93 ROSS1 SPILL ZONE OBJECT CONFIGURATION/////////////////
  var ross1Opt = {
    minSpill: 100, 
    maxSpill: 500, 
    numSpillLayers: 5, 
    spillRates: [100,200,300,400,500],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": null,"50year": 200,"100year": 500}, 
    spillLayerNames: spillLayerNames.ross1, 
    forecastData: Ross1 
  };
  for(var i=0;i<ross1Opt.spillRates.length;i++){
      ross1Opt.spillRatesToLayers[ross1Opt.spillRates[i]] = null;
  }
  var sta93_Ross1_SpillZone = new SpillZone(ross1Opt);
  // // /////////////////STATION93 ROSS2 SPILL ZONE OBJECT CONFIGURATION/////////////////
  var ross2Opt = {
    minSpill: 100, 
    maxSpill: 200, 
    numSpillLayers: 2, 
    spillRates: [100,200],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 200}, 
    spillLayerNames: spillLayerNames.ross2, 
    forecastData: Ross2 
  };
  for(var i=0;i<ross2Opt.spillRates.length;i++){
    ross2Opt.spillRatesToLayers[ross2Opt.spillRates[i]] = null;
  }
  var sta93_Ross2_SpillZone = new SpillZone(ross2Opt);
  // /////////////////STATION93 ROSSL SPILL ZONE OBJECT CONFIGURATION/////////////////
  var rossLOpt = {
    minSpill: 100, 
    maxSpill: 200, 
    numSpillLayers: 2, 
    spillRates: [100,200],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 200}, 
    spillLayerNames: spillLayerNames.rossL, 
    forecastData: RossL 
  };
  for(var i=0;i<rossLOpt.spillRates.length;i++){
      rossLOpt.spillRatesToLayers[rossLOpt.spillRates[i]] = null;
  }
  var sta93_RossL_SpillZone = new SpillZone(rossLOpt);
  // // /////////////////STATION93 ROSSR SPILL ZONE OBJECT CONFIGURATION/////////////////
  var rossROpt = {
    minSpill: 100, 
    maxSpill: 500, 
    numSpillLayers: 5, 
    spillRates: [100,200,300,400,500],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": null,"50year": 200,"100year": 500}, 
    spillLayerNames: spillLayerNames.rossR, 
    forecastData: RossR 
  };

  for(var i=0;i<rossROpt.spillRates.length;i++){
      rossROpt.spillRatesToLayers[rossROpt.spillRates[i]] = null;
  }
  var sta93_RossR_SpillZone = new SpillZone(rossROpt);

  var sta93Opt = {
    staNum: 93,
    numSpillZones: 4,
    spillZoneNames: ["Ross1", "Ross2", "RossL", "RossR"],
    spillZones: {"Ross1": sta93_Ross1_SpillZone, "Ross2": sta93_Ross2_SpillZone, "RossL": sta93_RossL_SpillZone, "RossR": sta93_RossR_SpillZone},
    spillExtent:   new OpenLayers.Bounds( -13580402.729243, 4466351.8865031,-13555942.880195,4482766.7383251),
    plot: new Plot("assets/js/plots/sta93/sta93Plot.js", sta93_histFlow, sta93_fcFlow)
  };

  var station93 = new Gage(sta93Opt);
  // // // // //////////END STATION93 OBJECT CONFIGURATION///////////////////////////////////
  // // // // //////////START STATION117 OBJECT INIT/////////////////////////////////
  // // // /////////////////STATION117 WLL SPILL ZONE OBJECT CONFIGURATION/////////////////
  var wllOpt = {
    minSpill: 280, 
    maxSpill: 1402, 
    numSpillLayers: 9, 
    spillRates: [280,421,561,701,841,982,1122,1262,1402],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": 421,"5year": 701,"10year": 841,"25year": 1122,"50year": 1262,"100year": 1402}, 
    spillLayerNames: spillLayerNames.WLL, 
    forecastData: WLL
  }

  for(var i=0;i<wllOpt.spillRates.length;i++){
      wllOpt.spillRatesToLayers[wllOpt.spillRates[i]] = null;
  }

  var sta117_WLL_SpillZone = new SpillZone(wllOpt);

  var sta117Opt = {
    staNum: 117,
    numSpillZones: 1,
    spillZoneNames: ["WLL"],
    spillZones: {"WLL": sta117_WLL_SpillZone},
    spillExtent:   new OpenLayers.Bounds(-13547493.618568, 4451161.743461, -13535263.694044, 4459369.169372),
    plot: new Plot("assets/js/plots/sta117/sta117Plot.js", sta117_histFlow, sta117_fcFlow)
  };

  var station117 = new Gage(sta117Opt);
  // ////////////END STATION117 OBJECT INIT/////////////////////////////////
  // // // //////////START STATION112 OBJECT CONFIGURATION///////////////////////////////////
  // // // /////////////////STATION112 Middlefield L SPILL ZONE OBJECT CONFIGURATION/////////////////
  var middlefieldLOpt = {
    minSpill: 100, 
    maxSpill: 208, 
    numSpillLayers: 2, 
    spillRates: [100,208],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 208}, 
    spillLayerNames: spillLayerNames.middlefieldL, 
    forecastData: MiddlefieldL
  }

  for(var i=0;i<middlefieldLOpt.spillRates.length;i++){
      middlefieldLOpt.spillRatesToLayers[middlefieldLOpt.spillRates[i]] = null;
  }

  var sta112_MiddlefieldL_SpillZone = new SpillZone(middlefieldLOpt);
  // // /////////////////STATION112 Middlefield R SPILL ZONE OBJECT CONFIGURATION/////////////////
  var middlefieldROpt = {
    minSpill: 100, 
    maxSpill: 1105, 
    numSpillLayers: 11, 
    spillRates: [100,200,300,400,500,600,700,800,900,1000,1105],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 1105}, 
    spillLayerNames: spillLayerNames.middlefieldR, 
    forecastData: MiddlefieldR
  }

  for(var i=0;i<middlefieldROpt.spillRates.length;i++){
      middlefieldROpt.spillRatesToLayers[middlefieldROpt.spillRates[i]] = null;
  }
  var sta112_MiddlefieldR_SpillZone = new SpillZone(middlefieldROpt);


  // // /////////////////STATION112 DS101L SPILL ZONE OBJECT CONFIGURATION/////////////////
  var ds101LOpt = {
    minSpill: 100, 
    maxSpill: 836, 
    numSpillLayers: 9, 
    spillRates: [100,200,300,400,500,600,700,800,836],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": 700,"50year": 800,"100year": 836}, 
    spillLayerNames: spillLayerNames.DS101L, 
    forecastData: DS101L
  }

  for(var i=0;i<ds101LOpt.spillRates.length;i++){
      ds101LOpt.spillRatesToLayers[ds101LOpt.spillRates[i]] = null;
  }
  var sta112_DS101L_SpillZone = new SpillZone(ds101LOpt);

  // // /////////////////STATION112 DS101R SPILL ZONE OBJECT CONFIGURATION/////////////////
  var ds101ROpt = {
    minSpill: 100, 
    maxSpill: 300, 
    numSpillLayers: 3, 
    spillRates: [100,200,300],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": 200,"50year": 300,"100year": 300}, 
    spillLayerNames: spillLayerNames.DS101R, 
    forecastData: DS101R
  }

  for(var i=0;i<ds101ROpt.spillRates.length;i++){
      ds101ROpt.spillRatesToLayers[ds101ROpt.spillRates[i]] = null;
  }

  var sta112_DS101R_SpillZone = new SpillZone(ds101ROpt);
  // /////////////////STATION112 PopeChaucerL SPILL ZONE OBJECT CONFIGURATION/////////////////\
  var popeChaucerLOpt = {
    minSpill: 100, 
    maxSpill: 415, 
    numSpillLayers: 4, 
    spillRates: [100,200,300,415],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": 100,"50year": 300,"100year": 415}, 
    spillLayerNames: spillLayerNames.popeChaucerL,
    forecastData: PopeChaucerL
  }

  for(var i=0;i<popeChaucerLOpt.spillRates.length;i++){
      popeChaucerLOpt.spillRatesToLayers[popeChaucerLOpt.spillRates[i]] = null;
  }

  var sta112_PopeChaucerL_SpillZone = new SpillZone(popeChaucerLOpt);

  // // /////////////////STATION112 PopeChaucerR SPILL ZONE OBJECT CONFIGURATION/////////////////
  var popeChaucerROpt = {
    minSpill: 100, 
    maxSpill: 1179, 
    numSpillLayers: 12, 
    spillRates: [100,200,300,400,500,600,700,800,900,1000,1100,1179],
    spillRatesToLayers: {}, 
    floodEvents: {"2year": null,"5year": null,"10year": null,"25year": 300,"50year": 900,"100year": 1179}, 
    spillLayerNames: spillLayerNames.popeChaucerR,
    forecastData: PopeChaucerR
  }

  for(var i=0;i<popeChaucerROpt.spillRates.length;i++){
      popeChaucerROpt.spillRatesToLayers[popeChaucerROpt.spillRates[i]] = null;
  }

  var sta112_PopeChaucerR_SpillZone = new SpillZone(popeChaucerROpt);
  var sta112Opt = {
    staNum: 112,
    numSpillZones: 6,
    spillZoneNames: ["MiddlefieldL", "MiddlefieldR", "DS101L", "DS101R", "PopeChaucerL", "PopeChaucerR"],
    spillZones: {
                  "MiddlefieldL": sta112_MiddlefieldL_SpillZone, "MiddlefieldR": sta112_MiddlefieldR_SpillZone, 
                  "DS101L": sta112_DS101L_SpillZone, "DS101R": sta112_DS101R_SpillZone, 
                  "PopeChaucerL": sta112_PopeChaucerL_SpillZone, "PopeChaucerR": sta112_PopeChaucerR_SpillZone
                },
    spillExtent: new OpenLayers.Bounds( -13607788.276007, 4489790.2122119,-13583328.426959, 4506205.0640339),
    plot: new Plot("assets/js/plots/sta112/sta112Plot.js", sta112_histFlow, sta112_fcFlow)
  };

  var station112 = new Gage(sta112Opt);
  // // // //////////END STATION112 OBJECT CONFIGURATION///////////////////////////////////
  // // // //////////END STATION OBJECTS CONFIGURATION/////////////////////////////
  //map station numbers to station objects
  scvwdflood.stationObjects = {"51":station51, "93":station93 ,"117":station117, "112":station112};
}

//PLOT object code
function Plot(plotURL, historicData, forecastData){
  this.plotURL = plotURL;
  this.hc_chart = null;
	this.historicData = historicData;
	this.forecastData = forecastData;
	this.fcTimeIndex = new Array();
}

Plot.prototype.getFCCurrIndex = function(nowFC){
  for(var i=0;i<this.forecastData.length;i++){
    //work around for point select functionality in fc animation
    //initially data set is an array , i.e. forecastData[i] = [timstamp, flow];
    //after a point is selected programatically, the data structure of the forecast array changes
    //i.e. forecastData[i] = {x: timestamp, y: flow, selected: boolean}
    if(this.forecastData[i][0] == undefined){
      if(this.forecastData[i].x >= nowFC){
        return i;
      }
    }
    else{
      if(this.forecastData[i][0] >= nowFC){
        return i;
      }
    }
  }
}

Plot.prototype.getSeries = function(time){
  var fcCurrIndex = this.getFCCurrIndex(time);
  //todo actual interpolation calculation
  var lastHistPt = this.historicData[this.historicData.length-1][1];
  var firstFCPt = this.forecastData[0][1];
  var interp = (lastHistPt + firstFCPt)/2;
  var strInterp = interp.toFixed(2); //round to 2 decimal places
  interp = parseFloat(strInterp);

  var interpolation = [time, interp];
  this.historicData[this.historicData.length] = interpolation;
  this.forecastData.splice(0, fcCurrIndex);
  this.forecastData.splice(0, 0, interpolation);
  //add interpolation to spill zone forecast data
  this.hc_chart.addSeries({
 	  name: "Historic",
    color: '#000000',
    data: this.historicData
  });
  this.hc_chart.addSeries({
 	  name: "Forecast",
    color: '#0000FF',
  	data: this.forecastData
  });

  //reset time index array
  this.fcTimeIndex = [];
  for(var i=0;i<this.forecastData.length;i++){
  	this.fcTimeIndex.push(this.forecastData[i][0]);
  }
  return fcCurrIndex;
}
////END PLOT OBJECT CODE////////////////////

////////////////////SPILL ZONE OBJECT CODE/////////////////////////////////
function SpillZone(opt){
    this.minSpill = opt.minSpill;
    this.maxSpill = opt.maxSpill;
    this.numSpillLayers = opt.numSpillLayers;
    this.spillRates = opt.spillRates;
    this.spillRatesToLayers = opt.spillRatesToLayers;
    this.floodEvents = opt.floodEvents;
    this.displayedLayers = [];
    this.forecastData = opt.forecastData;
    this.spillLayerNames = opt.spillLayerNames;
}

//get spill layer closest to given spill rate
SpillZone.prototype.getLayerFromSpillRate = function(spillRate){
    //if spill rate greater than max rate return max spill layer
    if(spillRate >= this.maxSpill){
        return this.spillRatesToLayers[this.maxSpill];
    }
    //traverse through spillRates to layers keys and find which layer to display
    for(var i=0;i<this.numSpillLayers-1;i++){
        currSpillRate = this.spillRates[i];
        nextSpillRate = this.spillRates[i+1];
        if(spillRate >= currSpillRate && spillRate < nextSpillRate){
            return this.spillRatesToLayers[currSpillRate];
        }
    }
}
////////////////////END SPILL ZONE OBJECT CODE/////////////////////////////////
//////////GAGE OBJECT CODE////////////////////
function Gage(opt){
    this.stationNumber = opt.staNum;
    this.numSpillZones = opt.numSpillZones;
    this.spillZoneNames = opt.spillZoneNames;
    this.spillZones = opt.spillZones;
    this.spillExtent = opt.spillExtent;
    this.spillLayersLoaded = false;
    this.plot = opt.plot;
}

//get spill rates when user clicks on forecast hydrograph
Gage.prototype.displaySpill = function(tIndex){
    for(var i=0;i<this.numSpillZones;i++){
        var spillZoneName = this.spillZoneNames[i];
        var spillZone = this.spillZones[spillZoneName]; 
        //remove any layers that may be currently displayed
        prevSpillLayer = spillZone.displayedLayers.pop();
        if(prevSpillLayer != undefined){
            prevSpillLayer.setVisibility(false);
        }
        if(tIndex < spillZone.forecastData.length){
          var fcSpillRate = spillZone.forecastData[tIndex][1];
        }
        //if fcSpillRate > min spill layer, theres a layer to display
        if(fcSpillRate>=spillZone.minSpill && fcSpillRate != -1){
            spillLayer = spillZone.getLayerFromSpillRate(fcSpillRate);
            spillLayer.setVisibility(true);
            spillZone.displayedLayers.push(spillLayer);
            // $('#btnDownloadKML').removeAttr('disabled');
            scvwdflood.map.zoomToExtent(this.spillExtent, true);
        }
    }
}

Gage.prototype.hideSpillLayers = function(){
    for(var i=0;i<this.numSpillZones;i++){
        var spillZoneName = this.spillZoneNames[i];
        var spillZone = this.spillZones[spillZoneName]; 
        if(spillZone.displayedLayers.length > 0){
            for(var j=0;j<spillZone.displayedLayers.length;j++){
                spillZone.displayedLayers[j].setVisibility(false);
            }
            spillZone.displayedLayers = [];
        }
    }
}
//retrieve spill layers from geoserver
//todo: look into alernative methods for retrieving spill data;
Gage.prototype.getSpillLayers = function(){
	    for(var i=0; i<this.numSpillZones; i++){
	        var spillZoneName = this.spillZoneNames[i];
	        var spillZone = this.spillZones[spillZoneName];
          console.log(spillZoneName);
	        for(var j=0;j<spillZone.numSpillLayers;j++){
	            spillZone.spillRatesToLayers[spillZone.spillRates[j]] = new OpenLayers.Layer.Vector(
	                spillZone.spillLayerNames[j],
	                    {
	                        protocol: new OpenLayers.Protocol.HTTP({
                              // url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + spillZone.spillLayerNames[j] +"&outputFormat=json&mode=download" , //alertd
	                            url: "http://54.173.207.47:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + spillZone.spillLayerNames[j] +"&outputFormat=json&mode=download" , //aws
                              format: new OpenLayers.Format.GeoJSON({
	                                extractStyles: true,
	                                extractAttributes: true
	                                // maxDepth: 10
	                            }) 
	                        }),
	                        strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
	                        visibility: false,
	                        displayInLayerSwitcher: false
	                    }
	                );
	            spillZone.spillRatesToLayers[spillZone.spillRates[j]].styleMap = scvwdflood.map.spill_vector_style_map;
	            scvwdflood.map.addLayer(spillZone.spillRatesToLayers[spillZone.spillRates[j]]);
	        }
	    }
    	this.spillLayersLoaded = true;
}

//display gage's spillzone layers for particular flood event
Gage.prototype.displayFloodEvent = function(floodEvent){
    this.hideSpillLayers();
    for(var i=0;i<this.numSpillZones; i++){
        var spillZoneName = this.spillZoneNames[i];
        var spillZone = this.spillZones[spillZoneName];
        var floodEventSpillRate = spillZone.floodEvents[floodEvent];
        if(floodEventSpillRate!=null){
            var spillLayer = spillZone.spillRatesToLayers[floodEventSpillRate];
            spillLayer.setVisibility(true);
            spillZone.displayedLayers.push(spillLayer);
            $('#btnClearDemoSpill').removeAttr('disabled');
        }else{
            $('#btnClearDemoSpill').attr('disabled', 'disabled');
        }
    }
    scvwdflood.map.zoomToExtent(this.spillExtent, true);
}

Gage.prototype.loadPlot = function(){
    //have to use scvwdflood.selectedStation variable, this keyword doesn't work inside getScript
    $.getScript(this.plot.plotURL)
      .done(function( script, textStatus ) {
        console.log( textStatus );
        scvwdflood.selectedStation.plot.hc_chart = chart;
        var now = new Date().getTime() - 28800000;
        scvwdflood.selectedStation.plot.hc_chart.xAxis[0].addPlotLine({
          value: now,
          color: 'red',
          width: 2,
          color: '#000000',
          dashStyle: 'shortDash',
          zIndex: 1000,
          label: {
                    text: "Current Time (PST)",
                    rotation: 0,
                    style: {
                      color: '#333333',
                      fontWeight: 'bold',
                      top: 10
                    }
                  },
                  id: 'now-line'
        });
        var index = scvwdflood.selectedStation.plot.getSeries(now);
        //add now to spill datasets
        for(var i=0;i<scvwdflood.selectedStation.numSpillZones;i++){
          var spillZoneName = scvwdflood.selectedStation.spillZoneNames[i];
          var spillZone = scvwdflood.selectedStation.spillZones[spillZoneName];
          spillZone.forecastData.splice(0, index); //1-1 relation
          spillZone.forecastData.splice(0,0, [now, 0]);
        }
      })
      .fail(function( jqxhr, settings, exception ) {
        console.log( "Triggered ajaxError handler. e: " + exception + "\njqxhr: " + jqxhr.statusCode());
    });
}
///////////////////END GAGE OBJECT CODE/////////////////////


