//handler for user gage registration
function alertMe(){
    var jqxhr = $.ajax( "alertMe.php?sta=" + stationNumber)
        .done(function() {
            // alert( "success" );
            $('#alertGageRegistrationMessage').html(registeredForGageMessage);
            $('#registrationControl').html('<button class="btn btn-warning" id="btnUnAlertMe" data-gage-number="' + stationNumber +'">Unsubscribe</button>' +
                        '<script>' +
                            '$(\'#btnUnAlertMe\').on("click", function(){' +
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
            $('#alertGageRegistrationMessage').html(notRegisteredForGageMessage);
            $('#registrationControl').html('<button class="btn btn-default" id="btnAlertMe" data-gage-number="' + stationNumber +'">ALERT Me!</button>' +
                        '<script>' +
                            '$(\'#btnAlertMe\').on("click", function(){' +
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