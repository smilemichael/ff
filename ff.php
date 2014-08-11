<?php
	$loggedIn = false;
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){
	    	//connect to DB
	    	require_once("db_connect.php");
		    $salt ="salt";
		    //find user email in db
		    $email = $_POST["emailInput"];
		    // $password = crypt($_POST["passwordInput"]);
	    	$query = "SELECT * FROM scvwd.users WHERE email = '" . $email . "'";
	    	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
		 	$row = $res->fetch_array();
		    $email = $row['email'];
		    $id=$row['id'];
			if($row["password"] == crypt($_POST["passwordInput"], $salt)){
				$loggedIn=true;
				session_start();
				$_SESSION['id'] = $id;
				//TODO set session variables for gage subscription and session resumption
				//js variable for gage registration states
				$query = "SELECT * FROM scvwd.user_gages WHERE user_id='".$_SESSION['id']."'";
				$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
			 	$row_gages = $res->fetch_array();
			 	echo "<script>var gages = {'gage_51':'".$row_gages['col_51']."', 'gage_93':'".$row_gages['col_93']."', 'gage_23':'".$row_gages['col_23']."', 'gage_117':'".$row_gages['col_117']."'};</script>";
				//set session variables for gage subscribtion states
				// $_SESSION['gage_23'] = $row_gages['col_23'];
				// $_SESSION['gage_51'] = $row_gages['col_51'];
				// $_SESSION['gage_93'] = $row_gages['col_93'];
				// $_SESSION['gage_117'] = $row_gages['col_117'];
			}else{
				$loggedIn=false;
				// echo "password incorrect\n"; 
				// echo "\ndb: " . $row["password"] . "\n";
				// echo "\ninput: " . crypt($_POST["passwordInput"], "salt");
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
		<nav id="navBar" class="navbar navbar-default navbar-static-top" role="navigation">
			<div class="container">
				<!-- Brand and toggle get grouped for better mobile display -->
				
					<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<div class="navbar-left" id="userLogIn">
						<?php if($loggedIn == true){ ?>
								<p class="navbar-text">Welcome, <?php echo $row['first_name']?>:&nbsp
								<a href='userAccount.php?id= <?php echo $row['id'] ?>' target="_blank">My Account&nbsp</a>|
								<a href = "logout.php">&nbspLog out</a></label></p>
						<?php	}else{ ?>
							<form class="navbar-form navbar-left" role="search" action="ff.php" method="post">
                                <div class="form-group">
                                    <input type="text" name="emailInput" class="form-control" placeholder="email">
                                    <input type="password" name="passwordInput" class="form-control" placeholder="password">
                                </div>
                                <button type="submit" class="btn btn-default btn-sm">Sign In</button>&nbspOr&nbsp<a class="btn btn-default btn-sm" href="registration.php">Register</a>
                            </form>
						<?php } ?>
						
					</div>

					<div class="navbar-right">
						<div id="controls" style="display:inline-block;">
						<div class="btn-group" id="signInNavBar">
							<button type="button" class="btn btn-warning navbar-btn dropdown-toggle" data-toggle="dropdown">
								View Select&nbsp<span class="caret"></span>
							</button>
							<ul class="dropdown-menu" role="menu">
								<li><a id="countyView"><strong>County</strong></a></li>
							</ul>
						</div>
						<div class="btn-group">
							<button type="button" data-toggle="dropdown" class="btn btn-warning navbar-btn dropdown-toggle">
								Gage Select&nbsp<span class="caret"></span>
							</button>
							<ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
								
								<li class="dropdown-submenu">
									<a tabindex="-1" href="#">Flood Forecast</a>
									<ul class="dropdown-menu" id="forecastMenu">
										<li id="2058"><a tabindex="-1" href="#">Ross Ck at Cherry Ave</a></li>
										<li id="1543"><a>Guadalupe R above Branham Ln</a></li>
										<li id="1535"><a>Guadalupe R above Almaden Expwy</a></li>
										<li id="1481" ><a>West Little Llagas blw Edmundson Ave</a></li>
									</ul>
								</li>
								
							</ul>
						</div>
					</div>
						<button type="submit" id="btnControls" class="btn btn-default navbar-btn">
							<span class="glyphicon glyphicon-cog"></span>&nbsp Controls
						</button>
						<button type="submit" id="btnLegend" class="btn btn-default navbar-btn">
							<span class="glyphicon glyphicon-th-large"></span>&nbsp Legend
						</button>
						<a href="help.html" target="_blank">
							<button  type="submit" id="btnHelp" class="btn btn-info navbar-btn">
							<span class="glyphicon glyphicon-info-sign"></span>&nbsp Help
						</button>
						</a>
					</div>
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		<!--end navbar-->
		<div id="map"></div>
		<!--flood forecast gage information -->
		<div id="forecastInfo">
			<ul>
				<li><a href="#fc-tabs-1">Flood Forecast Information</a></li>
				<li><a href="#fc-tabs-2">Gage Details</a></li>
				<li><a href="#fc-tabs-3">1% Flood Simulation</a></li>
				<li><a href="#fc-tabs-4">ALERT Me</a></li>

			</ul>
			<div id="fc-tabs-1">
				<div id="fcGagePlot">
				</div>
			</div>
			<div id="fc-tabs-2">
				<div id="fcGageInfo">
				</div> 
			</div>
			<div id="fc-tabs-3">
				<div id="fcFloodSimulation" class="container">
					<div class="row">
						<div id="simInfo" class="col-md-5">
							A one-hundred-year flood is a flood event that has a 1% probability of occurring in any given year. Click the flood animation button to simulate this type of flood event. 
						</div>
						<div class="col-md-4">
							<div id="slider" style="width:250px;margin:10px;"></div>
							<!-- <div id="sliderValueLabel"><a id="flowRate">0</a> cfs</div> -->
							<div id="animationControls">
								<button class="btn btn-primary" id="btnFloodAnimation">Flood Animation</button>	
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="fc-tabs-4">
				<!-- <div class="container">
					<p>Please sign in or register to receive text/email flood alerts for this flood zone</p>
					<div class="row">
						<div class="col-md-4" id="signIn">
							<h4>Sign In</h4>
							<form action="ff.php" method="post">
								<div class="form-group">
									<label for="signInEmail" class="control-label">Email</label>
									<input type="text" class="form-control" id="signInEmailField" name="email" placeholder="email">
								</div>
								<div class="form-group">
									<label for="signInPassword" class="control-label">Password</label>
									<input type="password" class="form-control" id="signInPassword" name="password" placeholder="password">
								</div>
								<button type="submit" class="btn btn-primary">Sign In</button>
							</form>
						</div>
						<div class="col-md-4">
							<h4>Register</h4>
							<a href="registration.php"><button class="btn btn-success">Register</button></a>
						</div>
					</div>
				</div> -->
				<?php if($loggedIn == false){ ?>
					<p>Please sign in or register to receive text/email flood alerts for this flood zone</p>
					<div class="container">
						<div class="row">
							<h4>Sign In</h4>
							<form class="form-inline" role="form" action="ff.php" method="post">
								<div class="form-group">
									<label>Email address</label>
									<input type="email" class="form-control" name="emailInput" placeholder="Enter email">
								</div>
								<div class="form-group">
									<label>Password</label>
									<input type="password" class="form-control" name="passwordInput" placeholder="Password">
								</div>
								<button type="submit" class="btn btn-default">Sign in</button>
							</form>
						</div>
						<div class="row" style="padding-top:20px;">
							<h4> Register Now</h4>
							<a href="registration.php"><button class="btn btn-success">Register</button></a>
						</div>
					</div>
				<?php	} else{ ?>
					<div id="alertMe">
					</div>
				<?php } ?>
			</div>

		</div>
		<!--******LEGEND DIV********-->
		<div id="legend">
			<table>
				<tr>
					<td><img src="assets/images/fcLegendIcon.png"/></td>
					<td>Flood Forecast Gage</td>
				</tr>
			<table>
		</div>
		<!--******END LEGEND DIV********-->
		<!-- footer -->
		
		<nav class="navbar navbar-default navbar-fixed-bottom" role="navigation">
		  <div class="container">
		  	<div class="navbar-header">
				<a class="navbar-brand" href="#">SCVWD Flood Forecast System</a>
			</div>
		  </div>
		</nav>

		<!--load scripts at end of page -->
		<!--google maps, openlayers, proj4js -->
		<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false&amp;key=AIzaSyB7Ndq60bsM6G2DvKY7SGEbf7vsSa_2Eg8"></script>
		<script src="assets/OpenLayers/OpenLayers.js"></script>
    	<script src="assets/OpenLayers/proj4js/lib/proj4js-combined.js"></script>

    	<!--jQuery, jQueryUI, bootstrap-->
		<!--<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>-->
		<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
		<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
		
		<script src="assets/js/ff.js"></script>
		<script src="assets/Highcharts/js/highcharts.js"></script>
	</body>
</html>