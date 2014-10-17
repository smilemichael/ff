<?php
	session_start();
	//check logged in session variable and set client side variables
	if(isset($_SESSION['logged_in'])){
	    	require_once("assets/php/db/db_connect.php");
			$loggedIn = true;
			$query = "SELECT * FROM scvwd.user_gages WHERE user_id='".$_SESSION['id']."'";
			$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
		 	$row_gages = $res->fetch_array();
		 	//client side variable to hold gage subscription states
		 	//FIX for IE script cannot be placed outside of HTML tags
		 	echo "<script>var gages = {'gage_51':'".$row_gages['col_51']."', 'gage_93':'".$row_gages['col_93']."', 'gage_23':'".$row_gages['col_23']."', 'gage_117':'".$row_gages['col_117']."'};</script>";
	}else{
		$loggedIn = false;
	}

	//POST request handler for site log in
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    	//connect to DB
    	require_once("assets/php/db/db_connect.php");
    	//salt for crypt function
	    $salt ="salt";

	    //find user email in db
    	$query = "SELECT * FROM scvwd.users WHERE email = '" . $_POST["email"] . "'";
    	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
	 	$row = $res->fetch_array();

	    //check if provided password matches password stored in DB
		if($row["password"] == crypt($_POST['password'], $salt)){
			$loggedIn=true;
			//set session variables for session persistence
			$_SESSION['id'] = $row['id'];
			$_SESSION['email'] = $row['email'];
	    	$_SESSION['first_name'] = $row['first_name'];
	    	$_SESSION['logged_in'] = true;

			//TODO set session variables for gage subscription and session resumption
			//js variable for gage registration states
		 	header('Location: index.php'); 
		}else{
			$loggedIn=false;
		}
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>SCVWD Flood Forecast System</title>
		<!--stylesheets -->
    	<link rel="stylesheet" href="assets/css/style.css" type="text/css">
    	<link rel="stylesheet" href="assets/css/OL/theme/default/style.css" type="text/css">
    	<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Nova Square&text=SCVWDGIFcasingmdebApProty">
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
    	<link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
		<link rel="stylesheet" href="assets/css/custom.css" type="text/css">
	</head>
	<body onload="init()">
		<div id="myNav">
			<!-- if user logs in update navbar to show welcome message, account link, and log out link -->
			<?php if($loggedIn == true){ ?>
				<p class="navbar-text">Welcome, <?= $_SESSION['first_name']?>:&nbsp
				<a href='views/userAccount.php' target="_self">My Account&nbsp</a>|
				<a href = "controllers/logout.php">&nbspLog out</a></label></p>
			<?php	}else{ ?>
				<form class="" role="search" id="signInNavBar" action="index.php" method="post" style="margin-left:25px;margin-top:8px;display:inline-block">
                    <div class="form-group" style="display:inline;">
                        <input style="width:200px;display:inline;" type="text" name="email" id="email" class="form-control" placeholder="email">
                        <input style="width:200px;display:inline;" type="password" name="password" id="password" class="form-control" placeholder="password">
                    </div>
                    <button style="display:inline;" type="submit" class="btn btn-default btn-sm">Sign In</button>&nbspOr&nbsp<a href="views/registration_jv.php">Register</a>
                </form>
			<?php } ?>
				<div class="pull-right" style='white-space:nowrap;margin-right:25px;'>
				<div id="controls" style="display:inline-block;">
					<!-- <div class="btn-group" id="signInNavBar"> -->
					<!-- 	<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="margin-top:8px;">
							View Select&nbsp<span class="caret"></span>
						</button> -->
						<!-- <ul class="dropdown-menu" role="menu">
							<li><a id="countyView">County</a></li>
							<li><a id="sanJoseView">San Jose</a></li>
							<li><a id="santaClaraView">Santa Clara</a></li>
							<li><a id="losAltosView">Los Altos</a></li>
							<li><a id="milpitasView">Milpitas</a></li>
							<li><a id="paloAltoView">Palo Alto</a></li>
							<li><a id="sunnyvaleView">Sunnyvale</a></li>
						</ul>
					</div> -->
					<select id="sbViewSelect" class="form-control">
				  		<option><strong>View Select</strong></option>
				  		<option>County</option>
						<option>Los Altos</option>
						<option>Milpitas</option>
						<option>Palo Alto</option>
						<option>San Jose</option>
						<option>Santa Clara</option>
						<option>Sunnyvale</option>
					</select>
				</div>
				<a href="views/help.html" target="_blank">
					<button  type="submit" id="btnHelp" class="btn btn-info" style="margin-top:8px;">
						<span class="glyphicon glyphicon-info-sign"></span>&nbsp Help
					</button>
				</a>
			</div>
		</div><!--end navbar-->
		<div id="map"></div>
		<!-- hide mouseposition, position only used for tooltips -->
		<div id="mousePosition" style="visibility:hidden;"></div>
		<!-- popup div for tooltips over forecast gages -->
		<div class="popup" id="tooltip" style="visibility: hidden"></div>
		<!--flood forecast gage information in jQuery UI tabs -->
		<div id="forecastInfo">
			<ul>
				<li><a href="#fc-tabs-1">Flood Forecast Information</a></li>
				<li><a href="#fc-tabs-2">Gage Details</a></li>
				<li><a href="#fc-tabs-3">1% Flood Demo</a></li>
				<li><a href="#fc-tabs-4">ALERT Me</a></li>
			</ul>
			<div id="fc-tabs-1" style="white-space: nowrap;">
					<div id="fcPlot" style="">
					</div>
					<div id="fcAnimatePanel" class="panel panel-primary">
						<div class="panel-heading">
							<p class="panel-title" style="font-size:14px;color:white"> <strong>Forecast Animation</strong></p>
						</div>
						<div class="panel-body" style="">
							<div id='fcAnimationControls' style=""> 
			                   <!--  <p>Use the animation controls below to animate forecasted flooding conditions.</p> -->
			                    <p><strong>&nbsp&nbspAnimation Controls</strong></p> 
			                    <a id='fcAnimationControlBtn'> 
			                        <button class='btn btn-default btn-sm fccontrols' id='btnFCAnimate'>
			                            <span class='glyphicon glyphicon-play'></span>&nbspplay
			                        </button>
			                        <button class='btn btn-default btn-sm fccontrols' id='btnFCAnimateStop' style='display:none'>
			                            <span class='glyphicon glyphicon-stop'></span>&nbspstop
			                        </button>
			                    </a>
			                    <hr/>
			                    <p><strong>&nbsp&nbspDownload KML</strong></p>
		                       	<button id="btnDownloadKML" class='btn btn-default btn-sm' style='margin-left:10px;'>
		                            <span class='glyphicon glyphicon-download'></span>&nbspDownload
		                        </button> 
		                        <a href="" style="visibility:hidden;" id="linkKMLDownload">download kml</a>
			                </div>
						</div>
					</div>
			</div>
			<div id="fc-tabs-2">
				<div id="fcGageInfo">
				</div> 
			</div>
			<div id="fc-tabs-3">
				<div id="fcFloodSimulation" class="container">
					<div class="row">
					<!-- 	<div id="simInfo" class="col-md-5">
							A one-hundred-year flood is a flood event that has a 1% probability of occurring in any given year. Click the flood animation button to simulate this type of flood event. 
						</div> -->
						<div class="col-md-4">
							<div id="demoControls">
								<p><strong>Please Select Flood Event</strong></p>
								<select id ="floodDemoSelect" class="form-control" style="width:200px;">
									<option value="default">Choose...</option>
									<option value="2year">50% (2 year)</option>
									<option value="5year">20% (5 year)</option>
									<option value="10year">10% (10 year)</option>
									<option value="25year">4% (25 year)</option>
									<option value="50year">2% (50 year)</option>
									<option value="100year">1% (100 year)</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="fc-tabs-4">
				<?php if($loggedIn == false){ ?>
					<p>Please sign in or register to receive text/email flood alerts for this flood zone</p>
					<div class="container">
						<div class="row">
							<h4>Sign In</h4>
							<form class="" role="form" id="signInPanel" action="index.php" method="post">
								<div class="form-group" style="display:inline-block">
									<label style="display:inline">Email address</label>
									<input style="display:inline" type="email" class="form-control" name="email" id="email_p" placeholder="Enter email">
								</div>
								<div class="form-group" style="display:inline-block">
									<label style="display:inline">Password</label>
									<input style="display:inline" type="password" class="form-control" name="password" id="password_p" placeholder="Password">
								</div>
								<button type="submit" class="btn btn-default btn-sm" style="">Sign in</button>
							</form>
						</div>
						<div class="row" style="padding-top:20px;">
							<h4> Register Now</h4>
							<a href="views/registration_jv.php"><button class="btn btn-success">Register</button></a>
						</div>
					</div>
				<?php	} else{ ?>
					<div id="alertMe">
						<p id="alertGageRegistrationMessage"></p>
						<div id="registrationControl">
						</div>
					</div>
				<?php } ?>
			</div>
		</div>
		<!--load scripts at end of page -->
		<!--google maps, openlayers, proj4js -->
		<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false&amp;key=AIzaSyB7Ndq60bsM6G2DvKY7SGEbf7vsSa_2Eg8"></script>
		<script src="http://openlayers.org/api/OpenLayers.js"></script>
    	<script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.2/proj4-src.js"></script>

    	<!--jQuery, jQueryUI, bootstrap, highcharts-->
		<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
		<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
		<script src="//code.highcharts.com/highcharts.js"></script>

		<!-- jquery validation scripts -->
		<script src="http://jqueryvalidation.org/files/dist/jquery.validate.min.js"></script>
		<script src="http://jqueryvalidation.org/files/dist/additional-methods.min.js"></script>
		
		<!--flood forecast application specific scripts -->
		<script src="assets/js/alertMe.js"></script>
		<script src="assets/js/ff.js"></script>
		<script>
			$(document).ready(function () {

				$('#btnDownloadKML').on("click", function(){
					$('#linkKMLDownload').trigger('click');
				});

				$("#linkKMLDownload").click(function(event){
					event.preventDefault();
					var link = $(this);
					var link = "downloadKML.php?station=" + stationNumber + "&layer=" + currentSpillLayerNames[0];
					window.location = link;
				});
	
				//TODO consolidate sign in validation for both forms
				//navbar sign-in validation
				$("#signInNavBar").validate({
					rules: {
						email: {
							required: true,
							email: true
						},
						password: {
							required: true
						}		
					},
					messages: {
						email: {
							required: "Please enter email"
						},
						password: {
							required: "Please enter password"
						}
					},
				 	errorPlacement: function(error, element) { 
				 		//just nothing, empty. do nothing  
				 	},
					invalidHandler: function(form, validator) {
						var errors = validator.numberOfInvalids();
						if (errors) {
							alert("Invalid email and/or password ih.");
						}
					},
				 	submitHandler: function(form) {
				 		var email = $('#email').val();
				 		var password = $('#password').val();
				 		$.ajax({
							type: "GET",
							url: "controllers/signInValidate.php",
							datatype: "string",
							data: {email: email, password: password},
							success: function(data, textStatus, jqXHR) {
								if($.trim(data)=="1"){
									form.submit();
								}else{
									alert("Invalid email and/or password.");
								}
							}
						});
					}
				});

				//panel sign-in validation
				$("#signInPanel").validate({
					rules: {
						email_p: {
							required: true,
							email: true
						},
						password_p: {
							required: true
						}		
					},
					messages: {
						email_p: {
							required: "Please enter email"
						},
						password_p: {
							required: "Please enter password"
						}
					},
				 	errorPlacement: function(error, element) { 
				 		//just nothing, empty. do nothing  
				 	},
					invalidHandler: function(form, validator) {
						var errors = validator.numberOfInvalids();
						if (errors) {
							alert("Invalid email and/or password ih.");
						}
					},
				 	submitHandler: function(form) {
				 		var email_p = $('#email_p').val();
				 		var password_p = $('#password_p').val();
				 		$.ajax({
							type: "GET",
							url: "controllers/signInValidate.php",
							datatype: "string",
							data: {email: email_p, password: password_p},
							success: function(data, textStatus, jqXHR) {
								if($.trim(data)=="1"){
									form.submit();
								}else{
									alert("Invalid email and/or password.");
								}
							}
						});
					}
				});
			});
		</script>
	</body>
</html>