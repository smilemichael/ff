// This file contains source code for the spill layers displayed for forecast gage Ross Ck
/////////////START STATION51 SPILL ZONE LAYER INIT/////////////////
//number of spill layers per spill zone
var cherry_numSpillLayers = 18;
var jarvis_numSpillLayers = 7;
//cherry spill layer names, used for KML download
var cherry_spillLayerNames = ["51_Cherry_100cfs", "51_Cherry_200cfs","51_Cherry_300cfs","51_Cherry_400cfs", "51_Cherry_500cfs",
                    "51_Cherry_600cfs", "51_Cherry_700cfs", "51_Cherry_800cfs", "51_Cherry_900cfs", "51_Cherry_1000cfs",
                    "51_Cherry_1100cfs", "51_Cherry_1200cfs", "51_Cherry_1300cfs", "51_Cherry_1400cfs", "51_Cherry_1500cfs",
                    "51_Cherry_1600cfs", "51_Cherry_1700cfs", "51_Cherry_1800cfs"];

//jarvis spill layer names
var jarvis_spillLayerNames = ["51_Jarvis_100cfs", "51_Jarvis_200cfs", "51_Jarvis_300cfs", "51_Jarvis_400cfs", "51_Jarvis_500cfs",
                           "51_Jarvis_600cfs", "51_Jarvis_700cfs"];

//array to hold cherry and jarvis spill OL Vector layers
var sta51_Cherry_SpillLayers = new Array();
var sta51_Jarvis_SpillLayers = new Array();

//instantiate cherry spill layers
for(var i=0;i<cherry_numSpillLayers;i++){
    sta51_Cherry_SpillLayers[i] = new OpenLayers.Layer.Vector(
        cherry_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + cherry_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}

//instantiate jarvis spill layers
for(var i=0;i<jarvis_numSpillLayers;i++){
    sta51_Jarvis_SpillLayers[i] = new OpenLayers.Layer.Vector(
        jarvis_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + jarvis_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}
//////////END STATION51 SPILL ZONEINIT/////////////////////////////////

//////////START STA93 SPILL ZONE INIT/////////////////////////////////
//ross2 variables
var ross2_numSpillLayers = 2;
var ross2_spillLayerNames = ["93_Ross2_100cfs", "93_Ross2_200cfs"];
var sta93_Ross2_SpillLayers = new Array();

//ross1 variables
var ross1_numSpillLayers = 5;
var ross1_spillLayerNames = ["93_Ross1_100cfs", "93_Ross1_200cfs", "93_Ross1_300cfs","93_Ross1_400cfs","93_Ross1_500cfs"];
var sta93_Ross1_SpillLayers = new Array();

//rossR variables
var rossR_numSpillLayers = 5;
var rossR_spillLayerNames = ["93_RossR_100cfs", "93_RossR_200cfs", "93_RossR_300cfs","93_RossR_400cfs","93_RossR_500cfs"];
var sta93_RossR_SpillLayers = new Array();

//rossL variables
var rossL_numSpillLayers = 2;
var rossL_spillLayerNames = ["93_RossL_100cfs", "93_RossL_200cfs"];
var sta93_RossL_SpillLayers = new Array();

//instantiate ross2 spill layers
for(var i=0;i<ross2_numSpillLayers;i++){
    sta93_Ross2_SpillLayers[i] = new OpenLayers.Layer.Vector(
        ross2_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + ross2_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
                format: new OpenLayers.Format.GeoJSON({
                    extractStyles: false,
                    extractAttributes: false
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher: false
        }
    );
}


// //instantiate ross2 spill layers wms
// for(var i=0;i<ross2_numSpillLayers;i++){
//     sta93_Ross2_SpillLayers[i] = new OpenLayers.Layer.WMS(
//         ross2_spillLayerNames[i],
//         "http://10.25.5.112:8080/geoserver/wms/scvwd", 
//         {
//             layers: 'scvwd:' + ross2_spillLayerNames[i], 
//             transparent:"true",
//             styles: "green"}, 
//         {isBaseLayer:false, opacity: 1, singleTile: true, visibility: true} 
//     );
// }

//instantiate ross1 spill layers
for(var i=0;i<ross1_numSpillLayers;i++){
    sta93_Ross1_SpillLayers[i] = new OpenLayers.Layer.Vector(
        ross1_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + ross1_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}

//instantiate rossR spill layers
for(var i=0;i<rossR_numSpillLayers;i++){
    sta93_RossR_SpillLayers[i] = new OpenLayers.Layer.Vector(
        rossR_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + rossR_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}

//instantiate rossL spill layers
for(var i=0;i<rossL_numSpillLayers;i++){
    sta93_RossL_SpillLayers[i] = new OpenLayers.Layer.Vector(
        rossL_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + rossL_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}
//////////END STA93 SPILLZONE INIT/////////////////////////////////
//////////START STATION117 SPILLZONE INIT/////////////////////////////
//rossL variables
var WLL_numSpillLayers = 9;
var WLL_spillLayerNames = ["117_WLL_280cfs", "117_WLL_421cfs", "117_WLL_561cfs", "117_WLL_701cfs", "117_WLL_841cfs",
                            "117_WLL_982cfs", "117_WLL_1122cfs", "117_WLL_1262cfs", "117_WLL_1402cfs"];
var sta117_WLL_SpillLayers = new Array();

//instantiate WLL spill layers
for(var i=0;i<WLL_numSpillLayers;i++){
    sta117_WLL_SpillLayers[i] = new OpenLayers.Layer.Vector(
        WLL_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + WLL_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}

//////////END STA117 SPILLZONE INIT/////////////////////////////
//////////START STATION112 SPILLZONE INIT/////////////////////////////
///////middlefield L
//middlefieldL variables
var middlefieldL_numSpillLayers = 2;
var middlefieldL_spillLayerNames = ["112_MiddlefieldL_100cfs", "112_MiddlefieldL_208cfs"];
var sta112_MiddlefieldL_SpillLayers = new Array();

//instantiate SFQ MiddleField L spill layers
for(var i=0;i<middlefieldL_numSpillLayers;i++){
    sta112_MiddlefieldL_SpillLayers[i] = new OpenLayers.Layer.Vector(
        middlefieldL_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + middlefieldL_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}
//////////middlefield R
//middlefieldR variables
var middlefieldR_numSpillLayers = 11;
var middlefieldR_spillLayerNames = ["112_MiddlefieldR_100cfs", "112_MiddlefieldR_200cfs", "112_MiddlefieldR_300cfs", "112_MiddlefieldR_400cfs",
                                       "112_MiddlefieldR_500cfs", "112_MiddlefieldR_600cfs", "112_MiddlefieldR_700cfs", "112_MiddlefieldR_800cfs", 
                                       "112_MiddlefieldR_900cfs", "112_MiddlefieldR_1000cfs", "112_MiddlefieldR_1105cfs"];
var sta112_MiddlefieldR_SpillLayers = new Array();

//instantiate SFQ MiddleField R spill layers
//testing kml mirror
for(var i=0;i<middlefieldR_numSpillLayers;i++){
    sta112_MiddlefieldR_SpillLayers[i] = new OpenLayers.Layer.Vector(
    middlefieldR_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                // url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + middlefieldR_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
                url: "http://10.25.5.112:8080/geoserver/wms/kml?layers=scvwd:" + middlefieldR_spillLayerNames[i] + "&mode=download",
                // url: "http://10.25.5.112:8080/geoserver/wms?BBOX=-122,37,-121,38&height=1024&width=1024&layers=scvwd:" + middlefieldR_spillLayerNames[i] + "&request=GetMap&service=wms&styles=polygon&format_options=SUPEROVERLAY:false;KMPLACEMARK:false;KMSCORE:40;KMATTR:true;&srs=EPSG:4326&format=application/vnd.google-earth.kmz&transparent=false&version=1.1.1",
                format: new OpenLayers.Format.KML({
                    extractStyles: false,
                    extractAttributes: false
                    // maxDepth: 10
                }) 
            }),
            strategies: [new OpenLayers.Strategy.Fixed({preload: true})],
            visibility: false,
            displayInLayerSwitcher: false
        }
    );

}
//////////DS101 L
//DS101 L variables
var DS101L_numSpillLayers = 9;
var DS101L_spillLayerNames = ["112_DS101L_100cfs", "112_DS101L_200cfs", "112_DS101L_300cfs", "112_DS101L_400cfs",
                                       "112_DS101L_500cfs", "112_DS101L_600cfs", "112_DS101L_700cfs", "112_DS101L_800cfs", 
                                       "112_DS101L_836cfs"];
var sta112_DS101L_SpillLayers = new Array();

//instantiate SFQ DS101L spill layers
for(var i=0;i<DS101L_numSpillLayers;i++){
    sta112_DS101L_SpillLayers[i] = new OpenLayers.Layer.Vector(
    DS101L_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + DS101L_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}

//////////DS101 R
//DS101 R variables
var DS101R_numSpillLayers = 3;
var DS101R_spillLayerNames = ["112_DS101R_100cfs", "112_DS101R_200cfs", "112_DS101R_300cfs"];
var sta112_DS101R_SpillLayers = new Array();

//instantiate SFQ DS101R spill layers
for(var i=0;i<DS101R_numSpillLayers;i++){
    sta112_DS101R_SpillLayers[i] = new OpenLayers.Layer.Vector(
    DS101R_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + DS101R_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}

//////////Pope Chaucer L
//Pope chaucer L variables
var popeChaucerL_numSpillLayers = 4;
var popeChaucerL_spillLayerNames = ["112_PopeChaucerL_100cfs", "112_PopeChaucerL_200cfs", "112_PopeChaucerL_300cfs", "112_PopeChaucerL_415cfs"];
var sta112_PopeChaucerL_SpillLayers = new Array();

//instantiate SFQ PopeChaucerL spill layers
for(var i=0;i<popeChaucerL_numSpillLayers;i++){
    sta112_PopeChaucerL_SpillLayers[i] = new OpenLayers.Layer.Vector(
    popeChaucerL_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + popeChaucerL_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}

//////////Pope Chaucer R
//Pope chaucer R variables
var popeChaucerR_numSpillLayers = 12;
var popeChaucerR_spillLayerNames = ["112_PopeChaucerR_100cfs", "112_PopeChaucerR_200cfs", "112_PopeChaucerR_300cfs", "112_PopeChaucerR_400cfs",
                                    "112_PopeChaucerR_500cfs", "112_PopeChaucerR_600cfs", "112_PopeChaucerR_700cfs", "112_PopeChaucerR_800cfs",
                                    "112_PopeChaucerR_900cfs", "112_PopeChaucerR_1000cfs", "112_PopeChaucerR_1100cfs", "112_PopeChaucerR_1179cfs"];
var sta112_PopeChaucerR_SpillLayers = new Array();

//instantiate SFQ PopeChaucerL spill layers
for(var i=0;i<popeChaucerR_numSpillLayers;i++){
    sta112_PopeChaucerR_SpillLayers[i] = new OpenLayers.Layer.Vector(
    popeChaucerR_spillLayerNames[i],
        {
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://10.25.5.112:8080/geoserver/scvwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scvwd:" + popeChaucerR_spillLayerNames[i] +"&outputFormat=json&mode=download" ,
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
}
//////////END STA112 SPILLZONE INIT////////////////////////////////
/////////START STYLING RULES FOR ALL SPILL LAYERS//////////////////
var spill_vector_style = new OpenLayers.Style({
  'fillColor':'#0033CC',
  'fillOpacity': 0.5,
  'strokeColor': '#0000FF',
  // 'strokeColor': '#000000',
  'strokeWidth': 0
});

var spill_vector_style_map = new OpenLayers.StyleMap({
  'default':spill_vector_style
});

// // styling rules for Ross Ck spill layer feature depths
// var ruleRange1 = new OpenLayers.Rule({
// filter: new OpenLayers.Filter.Comparison({
//     type: OpenLayers.Filter.Comparison.EQUAL_TO,
//     property: "Range",
//     value: 1
// }),
// symbolizer: {fillColor: "#66CCFF",
//              fillOpacity: 0.5}
// });

// var ruleRange2 = new OpenLayers.Rule({
// filter: new OpenLayers.Filter.Comparison({
//     type: OpenLayers.Filter.Comparison.EQUAL_TO,
//     property: "Range",
//     value: 2
// }),
// symbolizer: {fillColor: "#3399FF",
//              fillOpacity: 0.5}
// });

// var ruleRange3 = new OpenLayers.Rule({
// filter: new OpenLayers.Filter.Comparison({
//     type: OpenLayers.Filter.Comparison.EQUAL_TO,
//     property: "Range",
//     value: 3
// }),
// symbolizer: {fillColor: "#3399FF",
//              fillOpacity: 0.5}
// });

// var ruleRange4 = new OpenLayers.Rule({
// filter: new OpenLayers.Filter.Comparison({
//     type: OpenLayers.Filter.Comparison.EQUAL_TO,
//     property: "Range",
//     value: 4
// }),
// symbolizer: {fillColor: "#0066FF",
//              fillOpacity: 0.5}
// });

// var ruleRange5 = new OpenLayers.Rule({
// filter: new OpenLayers.Filter.Comparison({
//     type: OpenLayers.Filter.Comparison.EQUAL_TO,
//     property: "Range",
//     value: 5
// }),
// symbolizer: {fillColor: "#0000FF",
//              fillOpacity: 0.5}
// });

// var ruleRange6 = new OpenLayers.Rule({
// filter: new OpenLayers.Filter.Comparison({
//     type: OpenLayers.Filter.Comparison.EQUAL_TO,
//     property: "Range",
//     value: 6
// }),
// symbolizer: {fillColor: "#0000CC",
//              fillOpacity: 0.5}
// });

// //add style rules to spill vector style map
// spill_vector_style.addRules([ruleRange1, ruleRange2, ruleRange3, ruleRange4, ruleRange5, ruleRange6]);
/////////END STYLING RULES FOR ALL SPILL LAYERS//////////////////

////////START APPLY STYLE MAP TO LAYERS///////////////////////////
///STATION 51
//Apply style map to all cherry spill layers
for(var i=0;i<cherry_numSpillLayers;i++){
  sta51_Cherry_SpillLayers[i].styleMap = spill_vector_style_map;
} 

//Apply style map to all jarvis spill layers
for(var i=0;i<jarvis_numSpillLayers;i++){
  sta51_Jarvis_SpillLayers[i].styleMap = spill_vector_style_map;
}   

//Apply style map to ross2 spill layers
for(var i=0;i<ross2_numSpillLayers;i++){
  sta93_Ross2_SpillLayers[i].styleMap = spill_vector_style_map;
} 

///////STATION 93
//Apply style map to ross1 spill layers
for(var i=0;i<ross1_numSpillLayers;i++){
  sta93_Ross1_SpillLayers[i].styleMap = spill_vector_style_map;
} 

//Apply style map to rossR spill layers
for(var i=0;i<rossR_numSpillLayers;i++){
  sta93_RossR_SpillLayers[i].styleMap = spill_vector_style_map;
}

//Apply style map to rossR spill layers
for(var i=0;i<rossL_numSpillLayers;i++){
  sta93_RossL_SpillLayers[i].styleMap = spill_vector_style_map;
}

//////STATION 117
//Apply style map to WLL spill layers
for(var i=0;i<WLL_numSpillLayers;i++){
  sta117_WLL_SpillLayers[i].styleMap = spill_vector_style_map;
}

////////STATION 112
//middlefield L
for(var i=0;i<middlefieldL_numSpillLayers;i++){
    sta112_MiddlefieldL_SpillLayers[i].styleMap = spill_vector_style_map;
}

//middlefield R
for(var i=0;i<middlefieldR_numSpillLayers;i++){
    sta112_MiddlefieldR_SpillLayers[i].styleMap = spill_vector_style_map;
}

//DS101 L
for(var i=0;i<DS101L_numSpillLayers;i++){
    sta112_DS101L_SpillLayers[i].styleMap = spill_vector_style_map;
}
//DS101 R
for(var i=0;i<DS101R_numSpillLayers;i++){
    sta112_DS101R_SpillLayers[i].styleMap = spill_vector_style_map;
}
//Pope Chaucer L
for(var i=0;i<popeChaucerL_numSpillLayers;i++){
    sta112_PopeChaucerL_SpillLayers[i].styleMap = spill_vector_style_map;
}

//Pope Chaucer R
for(var i=0;i<popeChaucerR_numSpillLayers;i++){
    sta112_PopeChaucerR_SpillLayers[i].styleMap = spill_vector_style_map;
}
///ADD ALL SPILL LAYERS TO MAP
//STATION 51
map.addLayers(sta51_Cherry_SpillLayers);
map.addLayers(sta51_Jarvis_SpillLayers);
//STATION 93
map.addLayers(sta93_Ross2_SpillLayers);
map.addLayers(sta93_Ross1_SpillLayers);
map.addLayers(sta93_RossR_SpillLayers);
map.addLayers(sta93_RossL_SpillLayers);
////STATION 117
map.addLayers(sta117_WLL_SpillLayers);
////STATION 112
map.addLayers(sta112_MiddlefieldL_SpillLayers);
map.addLayers(sta112_MiddlefieldR_SpillLayers);
map.addLayers(sta112_DS101L_SpillLayers);
map.addLayers(sta112_DS101R_SpillLayers);
map.addLayers(sta112_PopeChaucerL_SpillLayers);
map.addLayers(sta112_PopeChaucerR_SpillLayers);

//////////START STATION OBJECT CONFIGURATION//////////////////////////////////////
//////////START STATION51 OBJECT CONFIGURATION//////////////////////////////////////////////
/////////////////STATION51 CHERRY SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta51_Cherry_spillZone_spillRates = [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800];
var sta51_Cherry_spillZone_spillRatesToLayers = {
    100: sta51_Cherry_SpillLayers[0], 200:sta51_Cherry_SpillLayers[1], 300:sta51_Cherry_SpillLayers[2],
    400:sta51_Cherry_SpillLayers[3], 500:sta51_Cherry_SpillLayers[4], 600:sta51_Cherry_SpillLayers[5],
    700:sta51_Cherry_SpillLayers[6], 800:sta51_Cherry_SpillLayers[7], 900:sta51_Cherry_SpillLayers[8],
    1000:sta51_Cherry_SpillLayers[9], 1100:sta51_Cherry_SpillLayers[10],1200:sta51_Cherry_SpillLayers[11],
    1300:sta51_Cherry_SpillLayers[12], 1400:sta51_Cherry_SpillLayers[13],1500:sta51_Cherry_SpillLayers[14],
    1600:sta51_Cherry_SpillLayers[15],1700:sta51_Cherry_SpillLayers[16],1800:sta51_Cherry_SpillLayers[17]
};

var sta51_Cherry_spillZone_floodEvents = {"2year": null,"5year": null,"10year": 100,"25year": 300,"50year": 800,"100year": 1800};
var sta51_Cherry_spillZone = new SpillZone(100, 1800, 18, sta51_Cherry_spillZone_spillRates, sta51_Cherry_spillZone_spillRatesToLayers, sta51_Cherry_spillZone_floodEvents);
////////////////STATION51 JARVIS SPILL ZONE OBJECT CONFIGURATION//////////////////////////////////////
var sta51_Jarvis_spillZone_spillRates = [100,200,300,400,500,600,700];
var sta51_Jarvis_spillZone_spillRatesToLayers = {
    100: sta51_Jarvis_SpillLayers[0], 200:sta51_Jarvis_SpillLayers[1], 300:sta51_Jarvis_SpillLayers[2],
    400:sta51_Jarvis_SpillLayers[3], 500:sta51_Jarvis_SpillLayers[4], 600:sta51_Jarvis_SpillLayers[5],
    700:sta51_Jarvis_SpillLayers[6]
};

var sta51_Jarvis_spillZone_floodEvents = {"2year": null,"5year": null,"10year": 100,"25year": 300,"50year": 500,"100year": 700};
var sta51_Jarvis_spillZone = new SpillZone(100, 700, 7, sta51_Jarvis_spillZone_spillRates, sta51_Jarvis_spillZone_spillRatesToLayers, sta51_Jarvis_spillZone_floodEvents);


var sta51_spillZoneNames = ["Cherry", "Jarvis"];
var sta51_spillZones = {"Cherry": sta51_Cherry_spillZone, "Jarvis": sta51_Jarvis_spillZone};
var sta51_spillExtent =  new OpenLayers.Bounds( -13580402.729243, 4466351.8865031,-13555942.880195,4482766.7383251);
var sta51_floodWatch = 800;
var sta51_floodWarning = 1200;
var station51 = new Gage(51, 2, sta51_spillZoneNames, sta51_spillZones, sta51_spillExtent, sta51_floodWatch, sta51_floodWarning);
// //////////END STATION51 Object INIT///////////////////////////////////


//////////START STATION93 OBJECT CONFIGURATION///////////////////////////////////
/////////////////STATION93 ROSS1 SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta93_Ross1_spillZone_spillRates = [100,200,300,400,500];
var sta93_Ross1_spillZone_spillRatesToLayers = {
    100: sta93_Ross1_SpillLayers[0], 200:sta93_Ross1_SpillLayers[1], 300:sta93_Ross1_SpillLayers[2],
    400:sta93_Ross1_SpillLayers[3], 500:sta93_Ross1_SpillLayers[4]
};

var sta93_Ross1_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": 200,"100year": 500};
var sta93_Ross1_spillZone = new SpillZone(100, 500, 5, sta93_Ross1_spillZone_spillRates, sta93_Ross1_spillZone_spillRatesToLayers, sta93_Ross1_spillZone_floodEvents);
/////////////////STATION93 ROSS2 SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta93_Ross2_spillZone_spillRates = [100,200];
var sta93_Ross2_spillZone_spillRatesToLayers = {
    100: sta93_Ross2_SpillLayers[0], 200:sta93_Ross2_SpillLayers[1]
};

var sta93_Ross2_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 200};
var sta93_Ross2_spillZone = new SpillZone(100, 200, 2, sta93_Ross2_spillZone_spillRates, sta93_Ross2_spillZone_spillRatesToLayers, sta93_Ross2_spillZone_floodEvents);
/////////////////STATION93 ROSSL SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta93_RossL_spillZone_spillRates = [100,200];
var sta93_RossL_spillZone_spillRatesToLayers = {
    100: sta93_RossL_SpillLayers[0], 200:sta93_RossL_SpillLayers[1]
};

var sta93_RossL_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 200};
var sta93_RossL_spillZone = new SpillZone(100, 200, 2, sta93_RossL_spillZone_spillRates, sta93_RossL_spillZone_spillRatesToLayers, sta93_RossL_spillZone_floodEvents);
/////////////////STATION93 ROSSR SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta93_RossR_spillZone_spillRates = [100,200,300,400,500];
var sta93_RossR_spillZone_spillRatesToLayers = {
    100: sta93_RossR_SpillLayers[0], 200:sta93_RossR_SpillLayers[1], 300:sta93_RossR_SpillLayers[2],
    400:sta93_RossR_SpillLayers[3], 500:sta93_RossR_SpillLayers[4]
};

var sta93_RossR_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": 200,"100year": 500};
var sta93_RossR_spillZone = new SpillZone(100, 500, 5, sta93_RossR_spillZone_spillRates, sta93_RossR_spillZone_spillRatesToLayers, sta93_RossR_spillZone_floodEvents);

var sta93_spillZoneNames = ["Ross1", "Ross2", "RossL", "RossR"];
var sta93_spillZones = {"Ross1": sta93_Ross1_spillZone, "Ross2": sta93_Ross2_spillZone, "RossL": sta93_RossL_spillZone, "RossR": sta93_RossR_spillZone};
var sta93_spillExtent =  new OpenLayers.Bounds( -13580402.729243, 4466351.8865031,-13555942.880195,4482766.7383251);
var sta93_floodWatch = 5000;
var sta93_floodWarning = 7000;
var station93 = new Gage(93, 4, sta93_spillZoneNames, sta93_spillZones, sta93_spillExtent, sta93_floodWatch, sta93_floodWarning);
// //////////END STATION93 OBJECT CONFIGURATION///////////////////////////////////
// //////////START STATION117 OBJECT INIT/////////////////////////////////
/////////////////STATION117 WLL SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta117_WLL_spillZone_spillRates = [280,421,561,701,841,982,1122,1262,1402];
var sta117_WLL_spillZone_spillRatesToLayers = {
    280: sta117_WLL_SpillLayers[0], 421:sta117_WLL_SpillLayers[1], 561:sta117_WLL_SpillLayers[2],
    701:sta117_WLL_SpillLayers[3], 841:sta117_WLL_SpillLayers[4], 982:sta117_WLL_SpillLayers[5],
    1122:sta117_WLL_SpillLayers[6],1262:sta117_WLL_SpillLayers[7],1402:sta117_WLL_SpillLayers[8]
};

var sta117_WLL_spillZone_floodEvents = {"2year": 421,"5year": 701,"10year": 841,"25year": 1122,"50year": 1262,"100year": 1402};
var sta117_WLL_spillZone = new SpillZone(280, 1402, 9, sta117_WLL_spillZone_spillRates, sta117_WLL_spillZone_spillRatesToLayers, sta117_WLL_spillZone_floodEvents);

var sta117_spillZoneNames = ["WLL"];
var sta117_spillZones = {"WLL": sta117_WLL_spillZone};                            
var sta117_spillExtent =  new OpenLayers.Bounds(-13547493.618568, 4451161.743461, -13535263.694044, 4459369.169372);
var sta117_floodWatch = 150;
var sta117_floodWarning = 280;
var station117 = new Gage(117, 1, sta117_spillZoneNames, sta117_spillZones, sta117_spillExtent, sta117_floodWatch, sta117_floodWarning);
////////////END STATION117 OBJECT INIT/////////////////////////////////

//////////START STATION112 OBJECT CONFIGURATION///////////////////////////////////
/////////////////STATION112 Middlefield L SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta112_MiddlefieldL_spillZone_spillRates = [100,208];
var sta112_MiddlefieldL_spillZone_spillRatesToLayers = {
        100: sta112_MiddlefieldL_SpillLayers[0], 208:sta112_MiddlefieldL_SpillLayers[1]
    };

var sta112_MiddlefieldL_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 208};
var sta112_MiddlefieldL_spillZone = new SpillZone(100, 208, 2, sta112_MiddlefieldL_spillZone_spillRates, sta112_MiddlefieldL_spillZone_spillRatesToLayers, sta112_MiddlefieldL_spillZone_floodEvents);
/////////////////STATION112 Middlefield R SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta112_MiddlefieldR_spillZone_spillRates = [100,200,300,400,500,600,700,800,900,1000,1105];
var sta112_MiddlefieldR_spillZone_spillRatesToLayers = {
    100: sta112_MiddlefieldR_SpillLayers[0], 200:sta112_MiddlefieldR_SpillLayers[1], 300:sta112_MiddlefieldR_SpillLayers[2], 400:sta112_MiddlefieldR_SpillLayers[3],
    500: sta112_MiddlefieldR_SpillLayers[4], 600:sta112_MiddlefieldR_SpillLayers[5], 700:sta112_MiddlefieldR_SpillLayers[6], 800:sta112_MiddlefieldR_SpillLayers[7],
    900: sta112_MiddlefieldR_SpillLayers[8], 1000:sta112_MiddlefieldR_SpillLayers[9], 1105:sta112_MiddlefieldR_SpillLayers[10]
};

var sta112_MiddlefieldR_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": null,"50year": null,"100year": 1105};
var sta112_MiddlefieldR_spillZone = new SpillZone(100, 1105, 11, sta112_MiddlefieldR_spillZone_spillRates, sta112_MiddlefieldR_spillZone_spillRatesToLayers, sta112_MiddlefieldR_spillZone_floodEvents);

/////////////////STATION112 DS101L SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta112_DS101L_spillZone_spillRates = [100,200,300,400,500,600,700,800,836];
var sta112_DS101L_spillZone_spillRatesToLayers = {
    100: sta112_DS101L_SpillLayers[0], 200:sta112_DS101L_SpillLayers[1],300: sta112_DS101L_SpillLayers[2], 400:sta112_DS101L_SpillLayers[3],
    500: sta112_DS101L_SpillLayers[4], 600:sta112_DS101L_SpillLayers[5],700: sta112_DS101L_SpillLayers[6], 800:sta112_DS101L_SpillLayers[7],
    836: sta112_DS101L_SpillLayers[8]
};

var sta112_DS101L_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 700,"50year": 800,"100year": 836};
var sta112_DS101L_spillZone = new SpillZone(100, 836, 9, sta112_DS101L_spillZone_spillRates, sta112_DS101L_spillZone_spillRatesToLayers, sta112_DS101L_spillZone_floodEvents);

/////////////////STATION112 DS101R SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta112_DS101R_spillZone_spillRates = [100,200,300];
var sta112_DS101R_spillZone_spillRatesToLayers = {
    100: sta112_DS101R_SpillLayers[0], 200:sta112_DS101R_SpillLayers[1], 300: sta112_DS101R_SpillLayers[2]
};

var sta112_DS101R_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 200,"50year": 300,"100year": 300};
var sta112_DS101R_spillZone = new SpillZone(100, 300, 3, sta112_DS101R_spillZone_spillRates, sta112_DS101R_spillZone_spillRatesToLayers, sta112_DS101R_spillZone_floodEvents);

/////////////////STATION112 PopeChaucerL SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta112_PopeChaucerL_spillZone_spillRates = [100,200,300,415];
var sta112_PopeChaucerL_spillZone_spillRatesToLayers = {
    100: sta112_PopeChaucerL_SpillLayers[0], 200:sta112_PopeChaucerL_SpillLayers[1], 300: sta112_PopeChaucerL_SpillLayers[2], 415: sta112_PopeChaucerL_SpillLayers[3]
};

var sta112_PopeChaucerL_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 100,"50year": 300,"100year": 415};
var sta112_PopeChaucerL_spillZone = new SpillZone(100, 415, 4, sta112_PopeChaucerL_spillZone_spillRates, sta112_PopeChaucerL_spillZone_spillRatesToLayers, sta112_PopeChaucerL_spillZone_floodEvents);

/////////////////STATION112 PopeChaucerR SPILL ZONE OBJECT CONFIGURATION/////////////////
var sta112_PopeChaucerR_spillZone_spillRates = [100,200,300,400,500,600,700,800,900,1000,1100,1179];
var sta112_PopeChaucerR_spillZone_spillRatesToLayers = {
    100: sta112_PopeChaucerR_SpillLayers[0], 200:sta112_PopeChaucerR_SpillLayers[1], 300: sta112_PopeChaucerR_SpillLayers[2], 400: sta112_PopeChaucerR_SpillLayers[3],
    500: sta112_PopeChaucerR_SpillLayers[4], 600:sta112_PopeChaucerR_SpillLayers[5], 700: sta112_PopeChaucerR_SpillLayers[6], 800: sta112_PopeChaucerR_SpillLayers[7],
    900: sta112_PopeChaucerR_SpillLayers[8], 1000:sta112_PopeChaucerR_SpillLayers[9], 1100: sta112_PopeChaucerR_SpillLayers[10], 1179: sta112_PopeChaucerR_SpillLayers[11]

};

var sta112_PopeChaucerR_spillZone_floodEvents = {"2year": null,"5year": null,"10year": null,"25year": 300,"50year": 900,"100year": 1179};
var sta112_PopeChaucerR_spillZone = new SpillZone(100, 1179, 12, sta112_PopeChaucerR_spillZone_spillRates, sta112_PopeChaucerR_spillZone_spillRatesToLayers, sta112_PopeChaucerR_spillZone_floodEvents);


var sta112_spillZoneNames = ["MiddlefieldL", "MiddlefieldR", "DS101L", "DS101R", "PopeChaucerL", "PopeChaucerR"];
var sta112_spillZones = {
                            "MiddlefieldL": sta112_MiddlefieldL_spillZone, "MiddlefieldR": sta112_MiddlefieldR_spillZone, 
                            "DS101L": sta112_DS101L_spillZone, "DS101R": sta112_DS101R_spillZone, 
                            "PopeChaucerL": sta112_PopeChaucerL_spillZone, "PopeChaucerR": sta112_PopeChaucerR_spillZone
                        };
var sta112_spillExtent =  new OpenLayers.Bounds( -13607788.276007, 4489790.2122119,-13583328.426959, 4506205.0640339);
var sta112_floodWatch = 3200;
var sta112_floodWarning = 4600;
var station112 = new Gage(112, 6, sta112_spillZoneNames, sta112_spillZones, sta112_spillExtent, sta112_floodWatch, sta112_floodWarning);
// //////////END STATION112 OBJECT CONFIGURATION///////////////////////////////////
// //////////END STATION OBJECTS CONFIGURATION/////////////////////////////

// //map station numbers to station objects
var stationObjects = {"51": station51, "93": station93, "117": station117, "112": station112};

//////////GAGE OBJECT CODE////////////////////
function SpillZone(minSpill, maxSpill, numSpillLayers, spillRates, spillRatesToLayers, floodEvents){
    this.minSpill = minSpill;
    this.maxSpill = maxSpill;
    this.numSpillLayers = numSpillLayers;
    this.spillRates = spillRates;
    this.spillRatesToLayers = spillRatesToLayers;
    this.floodEvents = floodEvents;
    this.displayedLayers = [];
    this.forecastData = null;
}

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

function Gage(staNum, numSpillZones, spillZoneNames, spillZones, spillExtent, floodWatch, floodWarning){
    this.stationNumber = staNum;
    this.numSpillZones = numSpillZones;
    this.spillZoneNames = spillZoneNames;
    this.spillZones = spillZones;
    this.spillExtent = spillExtent;
    this.floodWatch = floodWatch;
    this.floodWarning = floodWarning;
}

//get spill rates when user clicks on forecast hydrograph
Gage.prototype.displaySpill = function(tIndex){
    //index of forecasted spill rate
    var index = tIndex;
    for(var i=0;i<this.numSpillZones;i++){
        var spillZoneName = this.spillZoneNames[i];
        var spillZone = this.spillZones[spillZoneName]; 

        //remove any layers that may be currently displayed
        // this.hideSpillLayers();
        prevSpillLayer = spillZone.displayedLayers.pop();
        if(prevSpillLayer != undefined){
            prevSpillLayer.setVisibility(false);
        }

        var fcSpillRate = spillZone.forecastData[tIndex][1];
        //if fcSpillRate > min spill layer, theres a layer to display
        if(fcSpillRate>=spillZone.minSpill){
            spillLayer = spillZone.getLayerFromSpillRate(fcSpillRate);
            spillLayer.setVisibility(true);
            spillZone.displayedLayers.push(spillLayer);
            // $('#btnDownloadKML').removeAttr('disabled');
            map.zoomToExtent(this.spillExtent, true);
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
        }
    }
    map.zoomToExtent(this.spillExtent, true);
}

Gage.prototype.downloadKML = function(){
    //research ajax call
    layerString = "&layers=";
    numLayersInStr = 0;
    for(var i=0;i<this.numSpillZones;i++){
        spillZoneName = this.spillZoneNames[i];
        spillZone = this.spillZones[spillZoneName];
        if(spillZone.displayedLayers.length > 0){
            if(numLayersInStr > 0){
                layerString +=",";
            }
            layerName = spillZone.displayedLayers[0].name;
            layerString += layerName;
            numLayersInStr++;
        }
    }
    //download kml if spills are displayed
    if(numLayersInStr > 0){
        var link = "controllers/downloadKML.php?station=" + this.stationNumber + layerString;
        window.location = link;
    }else{
        alert("No spills currently on map.");
    }
}
///////////////////END GAGE OBJECT CODE/////////////////////


