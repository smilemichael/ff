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
    	//salt for crypt function, just for practice
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
    	<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" />
		<link rel="stylesheet" href="assets/css/custom.css" type="text/css">
	</head>
	<body onload="init()">
		<div id="myNav">
			<!-- if user logs in update navbar to show welcome message, account link, and log out link -->
			<?php #if($loggedIn == true){ ?>
				<!-- <p class="navbar-text">Welcome, <?= $_SESSION['first_name']?>:&nbsp
				<a href='views/userAccount.php' target="_self">My Account&nbsp</a>|
				<a href = "controllers/logout.php">&nbspLog out</a></label></p> -->
			<?php	#}else{ ?>
           <!--      <div id="btnsNavBar">
                	<a id="" href="#modal" class="btn btn-success modal_trigger">Login</a>&nbspOr&nbsp<a href="views/registration_uc.html" class="btn btn-info">Register</a>
				</div> -->
			<?php #} ?>
				<div id="logo" style="display:inline;margin-left:10px;">
					<a href="http://www.valleywater.org"><img  src="assets/images/logo.gif"></a>
				</div>

				<div class="pull-right" style="display:inline!important; margin-top:10px;">
					<span class="glyphicon glyphicon-search" title="View Select" style="display:inline;">&nbsp</span>
					<select id="sbGageSelect" class="form-control" style="display:inline;width:135px;margin-right:25px;">
				  		<option selected="selected" disabled="disabled" value="default">Gage Select</option>
				  		<option value="ForecastStreamFlow.1">Ross Ck. at Cherry Ave.</option>
						<option value="ForecastStreamFlow.2">Upper Guadalupe above Branham Ln.</option>
						<option value="ForecastStreamFlow.4">West Little Llagas blw Edmundson Ave.</option>
						<option value="ForecastStreamFlow.3">San Francisquito CK. at Stanford</option>
					</select>
					<span class="glyphicon glyphicon-eye-open" title="View Select" style="display:inline;">&nbsp</span>
					<select id="sbViewSelect" class="form-control" style="display:inline;width:125px;margin-right:25px;">
				  		<option selected="selected" disabled="disabled" value="default">View Select</option>
				  		<option value="county">County</option>
						<option value="losAltos">Los Altos</option>
						<option value="milpitas">Milpitas</option>
						<option value="paloAlto">Palo Alto</option>
						<option value="sanJose">San Jose</option>
						<option value="santaClara">Santa Clara</option>
						<option value="sunnyvale">Sunnyvale</option>
					</select>
				</div>
		</div><!--end navbar-->
		<div id="map"></div>
		<!-- hide mouseposition, position only used for tooltips -->
		<div id="mousePosition" style="visibility:hidden;"></div>
		<!-- popup div for tooltips over forecast gages -->
		<div class="popup" id="tooltip" style="visibility: hidden"></div>
		<!--flood forecast gage information in jQuery UI tabs -->
		<div id="modal" class="popupContainer" style="display:none;">
			<header class="popupHeader">
				<span class="header_title">Login</span>
				<span class="modal_close"><i class="fa fa-times"></i></span>
			</header>
		    <section class="popupBody">
		    	<div class="user_login">
				    <form id = "frmLogin">
				        <label>Email / Username</label> <input name="email" id="email" type="text"><br>
				        <label>Password</label> <input type="password" name="password" id="password"><br>
				        <div class="action_btns">
				            <div class="one_half">
				                <button type="submit" class="btnLM btnLM_red">Login</button>
				            </div>
				        </div>
				    </form>
				    <a class="forgot_password" href="#">Forgot password?</a>
				</div>
		    </section>
		</div>
		<div id="forecastInfo">
			<ul>
				<li><a href="#fc-tabs-1">Flood Forecast Information</a></li>
				<li><a href="#fc-tabs-2">Gage Details</a></li>
				<li><a href="#fc-tabs-3">1% Flood Demo</a></li>
				<li><a href="#fc-tabs-4">ALERT Me</a></li>
				<!-- todo add slide down/up button functionality to hide tabbed pane -->
				<!-- <li style="margin-left:50px;">Test</li> -->
			</ul>
			<div id="fc-tabs-1" style="white-space: nowrap;">
					<div id="fcPlot">
					</div>
			</div>
			<div id="fc-tabs-2">
				<div id="fcGageInfo">
				</div> 
			</div>
			<div id="fc-tabs-3">
				<div class="row">
					<div class="col-md-12" style="display:inline;">
						<div id="demoControls" style="display:inline;">
							<p><strong>Please Select Flood Event</strong></p>
							<select id ="floodDemoSelect" class="form-control" style="width:200px;display:inline;">
								<option value="default" selected="selected" disabled="disabled">Choose...</option>
								<option value="2year">50% (2 year)</option>
								<option value="5year">20% (5 year)</option>
								<option value="10year">10% (10 year)</option>
								<option value="25year">4% (25 year)</option>
								<option value="50year">2% (50 year)</option>
								<option value="100year">1% (100 year)</option>
							</select>
						</div>
						<button class="btn btn-primary" id="btnClearDemoSpill" disabled style="display:inline;margin-left:20px;margin-bottom:5px;">Clear Spill Layer</button>
					</div>
				</div>
			</div>
			<div id="fc-tabs-4">
				<?php if($loggedIn == false){ ?>
					<p><strong>Please login or register to receive text/email flood alerts for this flood zone.</strong></p>
					<hr/>
				<!-- 		<div class="row">
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
						</div> -->
						<div class="row" style="padding-top:20px;padding-left:20px;">
							<a id="" href="#modal" class="btn btn-primary modal_trigger">Login</a>
							<a href="views/registration_uc.html"><button class="btn btn-info">Register</button></a>
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

		<script src="assets/js/plots/flowData.js"></script>
		<script src= "assets/js/jquery.leanModal.min.js"></script>
		<script src="assets/js/map.js"></script>
		<script src="assets/js/Gage_Spill_Plot_Init.js"></script>
		<!-- // <script src="assets/js/app.min.js"></script> -->
		<script src="assets/js/alertMe.js"></script>
		<script>
			//Globals
			var stationNumber = null; //currently selected station number
			var selectedStation = null;
			var previousStation = null; //previously selected station, for switching off spill layers
			$(document).ready(function () {
				//display alert upon site entrance
				<?php if($loggedIn == false){ ?>
    				alert("The flood forecasts and predicted inundation areas are generated by the Santa Clara Water District using data collected from multiple other sources, including the National Weather Service. As with all weather forecasts, information is not guaranteed to be accurate, current or complete, and the tools used to predict the flooding areas are not guaranteed to be accurate either. Therefore, this website is designed as a informational tool to aid in disaster preparation. Information is provided as-is, and the use of the data provided by this website is solely at your own risk." +
    						"\n\nRecommended browsers: Google Chrome, Mozilla Firefox");
				<?php } ?>
			 	$(".modal_trigger").leanModal({top : 200, overlay : 0.6, closeButton: ".modal_close" });
				//disable sign in buttons
			  	// $("button[type=submit]").attr("disabled", "disabled");
			  	// $('.signIn').on("click", function(){
			  	// 	alert("sign in clicked!");
			  	// 	$('#signInWrapper').css('visibility', 'visible');
			  	// });
				// $('#btnDownloadKML').on("click", function(){
				// 	alert("downloadKMLbtn Clicked");
				// 	// $('#linkKMLDownload').trigger('click');
				// });

				// $("#linkKMLDownload").click(function(event){
				// 	alert("kml download link clicked");
				// 	event.preventDefault();
				// 	selectedStation.downloadKML();
				// });
	
				//TODO consolidate sign in validation for both forms
				//navbar sign-in validation
				$("#frmLogin").validate({
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
			});
		</script>
	</body>
</html>