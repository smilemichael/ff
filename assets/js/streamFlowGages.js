/***********SCVWD Flood Forecast System *******************
File: Gage_Spill_Plot_Init.js
By: Marcian Diamond
Description: This file contains configuration data and application code for gage, spill zone, and plot objects.

*****************************************/
//initialize gage objects
function initGages(){
  /////////////START STATION51 SPILL ZONE LAYER INIT/////////////////
  //cherry spill layer names, used for KML download
  var cherry_spillLayerNames = ["51_Cherry_100cfs", "51_Cherry_200cfs","51_Cherry_300cfs","51_Cherry_400cfs", "51_Cherry_500cfs",
                      "51_Cherry_600cfs", "51_Cherry_700cfs", "51_Cherry_800cfs", "51_Cherry_900cfs", "51_Cherry_1000cfs",
                      "51_Cherry_1100cfs", "51_Cherry_1200cfs", "51_Cherry_1300cfs", "51_Cherry_1400cfs", "51_Cherry_1500cfs",
                      "51_Cherry_1600cfs", "51_Cherry_1700cfs", "51_Cherry_1800cfs"];

  //jarvis spill layer names
  var jarvis_spillLayerNames = ["51_Jarvis_100cfs", "51_Jarvis_200cfs", "51_Jarvis_300cfs", "51_Jarvis_400cfs", "51_Jarvis_500cfs",
                             "51_Jarvis_600cfs", "51_Jarvis_700cfs"];

  // //////////START STA93 SPILL ZONE INIT/////////////////////////////////
  //ross2 variables
  var ross2_spillLayerNames = ["93_Ross2_100cfs", "93_Ross2_200cfs"];

  //ross1 variables
  var ross1_spillLayerNames = ["93_Ross1_100cfs", "93_Ross1_200cfs", "93_Ross1_300cfs","93_Ross1_400cfs","93_Ross1_500cfs"];

  //rossR variables
  var rossR_spillLayerNames = ["93_RossR_100cfs", "93_RossR_200cfs", "93_RossR_300cfs","93_RossR_400cfs","93_RossR_500cfs"];

  //rossL variables
  var rossL_spillLayerNames = ["93_RossL_100cfs", "93_RossL_200cfs"];
  // //////////END STA93 SPILLZONE INIT/////////////////////////////////
  // //////////START STATION117 SPILLZONE INIT/////////////////////////////
  var WLL_spillLayerNames = ["117_WLL_280cfs", "117_WLL_421cfs", "117_WLL_561cfs", "117_WLL_701cfs", "117_WLL_841cfs",
                              "117_WLL_982cfs", "117_WLL_1122cfs", "117_WLL_1262cfs", "117_WLL_1402cfs"];
  // //////////END STA117 SPILLZONE INIT/////////////////////////////
  // //////////START STATION112 SPILLZONE INIT/////////////////////////////
  ///////middlefield L
  //middlefieldL variables
  var middlefieldL_spillLayerNames = ["112_MiddlefieldL_100cfs", "112_MiddlefieldL_208cfs"];

  //////////middlefield R
  //middlefieldR variables
  var middlefieldR_spillLayerNames = ["112_MiddlefieldR_100cfs", "112_MiddlefieldR_200cfs", "112_MiddlefieldR_300cfs", "112_MiddlefieldR_400cfs",
                                         "112_MiddlefieldR_500cfs", "112_MiddlefieldR_600cfs", "112_MiddlefieldR_700cfs", "112_MiddlefieldR_800cfs", 
                                         "112_MiddlefieldR_900cfs", "112_MiddlefieldR_1000cfs", "112_MiddlefieldR_1105cfs"];

  //////////DS101 L
  //DS101 L variables
  var DS101L_spillLayerNames = ["112_DS101L_100cfs", "112_DS101L_200cfs", "112_DS101L_300cfs", "112_DS101L_400cfs",
                                         "112_DS101L_500cfs", "112_DS101L_600cfs", "112_DS101L_700cfs", "112_DS101L_800cfs", 
                                         "112_DS101L_836cfs"];
  //////////DS101 R
  //DS101 R variables
  var DS101R_spillLayerNames = ["112_DS101R_100cfs", "112_DS101R_200cfs", "112_DS101R_300cfs"];

  //////////Pope Chaucer L
  //Pope chaucer L variables
  var popeChaucerL_spillLayerNames = ["112_PopeChaucerL_100cfs", "112_PopeChaucerL_200cfs", "112_PopeChaucerL_300cfs", "112_PopeChaucerL_415cfs"];

  // //////////Pope Chaucer R
  // //Pope chaucer R variables
  var popeChaucerR_spillLayerNames = ["112_PopeChaucerR_100cfs", "112_PopeChaucerR_200cfs", "112_PopeChaucerR_300cfs", "112_PopeChaucerR_400cfs",
                                      "112_PopeChaucerR_500cfs", "112_PopeChaucerR_600cfs", "112_PopeChaucerR_700cfs", "112_PopeChaucerR_800cfs",
                                      "112_PopeChaucerR_900cfs", "112_PopeChaucerR_1000cfs", "112_PopeChaucerR_1100cfs", "112_PopeChaucerR_1179cfs"];

  //////////END STA112 SPILLZONE INIT////////////////////////////////
  

  //////////START STATION OBJECT CONFIGURATION//////////////////////////////////////
  //////////START STATION51 OBJECT CONFIGURATION//////////////////////////////////////////////
  /////////////////STATION51 CHERRY SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta51_Cherry_spillZone_spillRates = [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800];
  var sta51_Cherry_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta51_Cherry_spillZone_spillRates.length;i++){
      sta51_Cherry_spillZone_spillRatesToLayers[sta51_Cherry_spillZone_spillRates[i]] = null;
  }
  var sta51_Cherry_spillZone_floodEvents = {"2year": null,"5year": null,"10year": 100,"25year": 300,"50year": 800,"100year": 1800};
  var sta51_Cherry_spillZone = new SpillZone(100, 1800, 18, sta51_Cherry_spillZone_spillRates, sta51_Cherry_spillZone_spillRatesToLayers, sta51_Cherry_spillZone_floodEvents, cherry_spillLayerNames, Cherry);

  ////////////////STATION51 JARVIS SPILL ZONE OBJECT CONFIGURATION//////////////////////////////////////
  var sta51_Jarvis_spillZone_spillRates = [100,200,300,400,500,600,700];
  var sta51_Jarvis_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta51_Jarvis_spillZone_spillRates.length;i++){
      sta51_Jarvis_spillZone_spillRatesToLayers[sta51_Jarvis_spillZone_spillRates[i]] = null;
  }
  var sta51_Jarvis_spillZone_floodEvents = {"2year": null,"5year": null,"10year": 100,"25year": 300,"50year": 500,"100year": 700};
  var sta51_Jarvis_spillZone = new SpillZone(100, 700, 7, sta51_Jarvis_spillZone_spillRates, sta51_Jarvis_spillZone_spillRatesToLayers, sta51_Jarvis_spillZone_floodEvents, jarvis_spillLayerNames, Jarvis);

  var sta51_spillZoneNames = ["Cherry", "Jarvis"];
  var sta51_spillZones = {"Cherry": sta51_Cherry_spillZone, "Jarvis": sta51_Jarvis_spillZone};
  var sta51_spillExtent =  new OpenLayers.Bounds( -13580402.729243, 4466351.8865031,-13555942.880195,4482766.7383251);

  var sta51Plot = new Plot("assets/js/plots/sta51/sta51Plot.js", sta51_histFlow, sta51_fcFlow);
  var station51 = new Gage(51, 2, sta51_spillZoneNames, sta51_spillZones, sta51_spillExtent, sta51Plot);
  // //////////END STATION51 Object INIT///////////////////////////////////

  //////////START STATION93 OBJECT CONFIGURATION///////////////////////////////////
  /////////////////STATION93 ROSS1 SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta93_Ross1_spillZone_spillRates = [100,200,300,400,500];
  var sta93_Ross1_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta93_Ross1_spillZone_spillRates.length;i++){
      sta93_Ross1_spillZone_spillRatesToLayers[sta93_Ross1_spillZone_spillRates[i]] = null;
  }
  var sta93_Ross1_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": 200,"100year": 500};
  var sta93_Ross1_spillZone = new SpillZone(100, 500, 5, sta93_Ross1_spillZone_spillRates, sta93_Ross1_spillZone_spillRatesToLayers, sta93_Ross1_spillZone_floodEvents, ross1_spillLayerNames, Ross1);
  // /////////////////STATION93 ROSS2 SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta93_Ross2_spillZone_spillRates = [100,200];
  var sta93_Ross2_spillZone_spillRatesToLayers = {};

  for(var i=0;i<sta93_Ross2_spillZone_spillRates.length;i++){
      sta93_Ross2_spillZone_spillRatesToLayers[sta93_Ross2_spillZone_spillRates[i]] = null;
  }

  var sta93_Ross2_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 200};
  var sta93_Ross2_spillZone = new SpillZone(100, 200, 2, sta93_Ross2_spillZone_spillRates, sta93_Ross2_spillZone_spillRatesToLayers, sta93_Ross2_spillZone_floodEvents, ross2_spillLayerNames, Ross2);
  /////////////////STATION93 ROSSL SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta93_RossL_spillZone_spillRates = [100,200];
  var sta93_RossL_spillZone_spillRatesToLayers = {};

  for(var i=0;i<sta93_RossL_spillZone_spillRates.length;i++){
      sta93_RossL_spillZone_spillRatesToLayers[sta93_RossL_spillZone_spillRates[i]] = null;
  }

  var sta93_RossL_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 200};
  var sta93_RossL_spillZone = new SpillZone(100, 200, 2, sta93_RossL_spillZone_spillRates, sta93_RossL_spillZone_spillRatesToLayers, sta93_RossL_spillZone_floodEvents, rossL_spillLayerNames, RossL);
  // /////////////////STATION93 ROSSR SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta93_RossR_spillZone_spillRates = [100,200,300,400,500];
  var sta93_RossR_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta93_RossR_spillZone_spillRates.length;i++){
      sta93_RossR_spillZone_spillRatesToLayers[sta93_RossR_spillZone_spillRates[i]] = null;
  }

  var sta93_RossR_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": 200,"100year": 500};
  var sta93_RossR_spillZone = new SpillZone(100, 500, 5, sta93_RossR_spillZone_spillRates, sta93_RossR_spillZone_spillRatesToLayers, sta93_RossR_spillZone_floodEvents, rossR_spillLayerNames, RossR);


  var sta93_spillZoneNames = ["Ross1", "Ross2", "RossL", "RossR"];
  var sta93_spillZones = {"Ross1": sta93_Ross1_spillZone, "Ross2": sta93_Ross2_spillZone, "RossL": sta93_RossL_spillZone, "RossR": sta93_RossR_spillZone};
  var sta93_spillExtent =  new OpenLayers.Bounds( -13580402.729243, 4466351.8865031,-13555942.880195,4482766.7383251);

  var sta93Plot = new Plot("assets/js/plots/sta93/sta93Plot.js", sta93_histFlow, sta93_fcFlow);
  var station93 = new Gage(93, 4, sta93_spillZoneNames, sta93_spillZones, sta93_spillExtent, sta93Plot);
  // // //////////END STATION93 OBJECT CONFIGURATION///////////////////////////////////
  // // //////////START STATION117 OBJECT INIT/////////////////////////////////
  // /////////////////STATION117 WLL SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta117_WLL_spillZone_spillRates = [280,421,561,701,841,982,1122,1262,1402];
  var sta117_WLL_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta117_WLL_spillZone_spillRates.length;i++){
      sta117_WLL_spillZone_spillRatesToLayers[sta93_RossR_spillZone_spillRates[i]] = null;
  }

  var sta117_WLL_spillZone_floodEvents = {"2year": 421,"5year": 701,"10year": 841,"25year": 1122,"50year": 1262,"100year": 1402};
  var sta117_WLL_spillZone = new SpillZone(280, 1402, 9, sta117_WLL_spillZone_spillRates, sta117_WLL_spillZone_spillRatesToLayers, sta117_WLL_spillZone_floodEvents, WLL_spillLayerNames, WLL);

  var sta117_spillZoneNames = ["WLL"];
  var sta117_spillZones = {"WLL": sta117_WLL_spillZone};                            
  var sta117_spillExtent =  new OpenLayers.Bounds(-13547493.618568, 4451161.743461, -13535263.694044, 4459369.169372);

  var sta117Plot = new Plot("assets/js/plots/sta117/sta117Plot.js", sta117_histFlow, sta117_fcFlow);
  var station117 = new Gage(117, 1, sta117_spillZoneNames, sta117_spillZones, sta117_spillExtent, sta117Plot);
  // ////////////END STATION117 OBJECT INIT/////////////////////////////////

  // //////////START STATION112 OBJECT CONFIGURATION///////////////////////////////////
  // /////////////////STATION112 Middlefield L SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta112_MiddlefieldL_spillZone_spillRates = [100,208];
  var sta112_MiddlefieldL_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta112_MiddlefieldL_spillZone_spillRates.length;i++){
      sta112_MiddlefieldL_spillZone_spillRatesToLayers[sta112_MiddlefieldL_spillZone_spillRates[i]] = null;
  }

  var sta112_MiddlefieldL_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 208};
  var sta112_MiddlefieldL_spillZone = new SpillZone(100, 208, 2, sta112_MiddlefieldL_spillZone_spillRates, sta112_MiddlefieldL_spillZone_spillRatesToLayers, sta112_MiddlefieldL_spillZone_floodEvents, middlefieldL_spillLayerNames, MiddlefieldL);
  // /////////////////STATION112 Middlefield R SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta112_MiddlefieldR_spillZone_spillRates = [100,200,300,400,500,600,700,800,900,1000,1105];
  var sta112_MiddlefieldR_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta112_MiddlefieldR_spillZone_spillRates.length;i++){
      sta112_MiddlefieldR_spillZone_spillRatesToLayers[sta112_MiddlefieldR_spillZone_spillRates[i]] = null;
  }

  var sta112_MiddlefieldR_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 1105};
  var sta112_MiddlefieldR_spillZone = new SpillZone(100, 1105, 11, sta112_MiddlefieldR_spillZone_spillRates, sta112_MiddlefieldR_spillZone_spillRatesToLayers, sta112_MiddlefieldR_spillZone_floodEvents, middlefieldR_spillLayerNames, MiddlefieldR);

  // /////////////////STATION112 DS101L SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta112_DS101L_spillZone_spillRates = [100,200,300,400,500,600,700,800,836];
  var sta112_DS101L_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta112_DS101L_spillZone_spillRates.length;i++){
      sta112_DS101L_spillZone_spillRatesToLayers[sta112_DS101L_spillZone_spillRates[i]] = null;
  }

  var sta112_DS101L_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 700,"50year": 800,"100year": 836};
  var sta112_DS101L_spillZone = new SpillZone(100, 836, 9, sta112_DS101L_spillZone_spillRates, sta112_DS101L_spillZone_spillRatesToLayers, sta112_DS101L_spillZone_floodEvents, DS101L_spillLayerNames, DS101L);

  // /////////////////STATION112 DS101R SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta112_DS101R_spillZone_spillRates = [100,200,300];
  var sta112_DS101R_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta112_DS101R_spillZone_spillRates.length;i++){
      sta112_DS101R_spillZone_spillRatesToLayers[sta112_DS101R_spillZone_spillRates[i]] = null;
  }
  var sta112_DS101R_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 200,"50year": 300,"100year": 300};
  var sta112_DS101R_spillZone = new SpillZone(100, 300, 3, sta112_DS101R_spillZone_spillRates, sta112_DS101R_spillZone_spillRatesToLayers, sta112_DS101R_spillZone_floodEvents, DS101R_spillLayerNames, DS101R);

  /////////////////STATION112 PopeChaucerL SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta112_PopeChaucerL_spillZone_spillRates = [100,200,300,415];
  var sta112_PopeChaucerL_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta112_PopeChaucerL_spillZone_spillRates.length;i++){
      sta112_PopeChaucerL_spillZone_spillRatesToLayers[sta112_PopeChaucerL_spillZone_spillRates[i]] = null;
  }
  var sta112_PopeChaucerL_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 100,"50year": 300,"100year": 415};
  var sta112_PopeChaucerL_spillZone = new SpillZone(100, 415, 4, sta112_PopeChaucerL_spillZone_spillRates, sta112_PopeChaucerL_spillZone_spillRatesToLayers, sta112_PopeChaucerL_spillZone_floodEvents, popeChaucerL_spillLayerNames, PopeChaucerL);

  // /////////////////STATION112 PopeChaucerR SPILL ZONE OBJECT CONFIGURATION/////////////////
  var sta112_PopeChaucerR_spillZone_spillRates = [100,200,300,400,500,600,700,800,900,1000,1100,1179];
  var sta112_PopeChaucerR_spillZone_spillRatesToLayers = {};
  for(var i=0;i<sta112_PopeChaucerR_spillZone_spillRates.length;i++){
      sta112_PopeChaucerR_spillZone_spillRatesToLayers[sta112_PopeChaucerR_spillZone_spillRates[i]] = null;
  }
  var sta112_PopeChaucerR_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 300,"50year": 900,"100year": 1179};
  var sta112_PopeChaucerR_spillZone = new SpillZone(100, 1179, 12, sta112_PopeChaucerR_spillZone_spillRates, sta112_PopeChaucerR_spillZone_spillRatesToLayers, sta112_PopeChaucerR_spillZone_floodEvents, popeChaucerR_spillLayerNames, PopeChaucerR);


  var sta112_spillZoneNames = ["MiddlefieldL", "MiddlefieldR", "DS101L", "DS101R", "PopeChaucerL", "PopeChaucerR"];
  var sta112_spillZones = {
                              "MiddlefieldL": sta112_MiddlefieldL_spillZone, "MiddlefieldR": sta112_MiddlefieldR_spillZone, 
                              "DS101L": sta112_DS101L_spillZone, "DS101R": sta112_DS101R_spillZone, 
                              "PopeChaucerL": sta112_PopeChaucerL_spillZone, "PopeChaucerR": sta112_PopeChaucerR_spillZone
                          };
  var sta112_spillExtent =  new OpenLayers.Bounds( -13607788.276007, 4489790.2122119,-13583328.426959, 4506205.0640339);

  var sta112Plot = new Plot("assets/js/plots/sta112/sta112Plot.js", sta112_histFlow, sta112_fcFlow);
  var station112 = new Gage(112, 6, sta112_spillZoneNames, sta112_spillZones, sta112_spillExtent, sta112Plot);
  // // //////////END STATION112 OBJECT CONFIGURATION///////////////////////////////////
  // // //////////END STATION OBJECTS CONFIGURATION/////////////////////////////

  // // //map station numbers to station objects
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
function SpillZone(minSpill, maxSpill, numSpillLayers, spillRates, spillRatesToLayers, floodEvents, spillLayerNames, forecastData){
    this.minSpill = minSpill;
    this.maxSpill = maxSpill;
    this.numSpillLayers = numSpillLayers;
    this.spillRates = spillRates;
    this.spillRatesToLayers = spillRatesToLayers;
    this.floodEvents = floodEvents;
    this.displayedLayers = [];
    this.forecastData = forecastData;
    this.spillLayerNames = spillLayerNames;
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
function Gage(staNum, numSpillZones, spillZoneNames, spillZones, spillExtent, plot){
    this.stationNumber = staNum;
    this.numSpillZones = numSpillZones;
    this.spillZoneNames = spillZoneNames;
    this.spillZones = spillZones;
    this.spillExtent = spillExtent;
    this.spillLayersLoaded = false;
    this.plot = plot;
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


