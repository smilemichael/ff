<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST'){
		//connect to DB
		require_once("db_connect.php");
			
		$firstName = $_POST['first_name'];
		$lastName = $_POST['last_name'];
		$streetAddress = $_POST['street_address'];
		$city = $_POST['city_select'];
		$zipCode = $_POST['zip_code'];
		$email =  $_POST['email'];
		$phone = $_POST['phone'];
		$carrier = $_POST['carrier_select'];
		$password = $_POST['password'];

		// Get the hash for the password, letting the salt be automatically generated
		//TODO BETTER ENCRYPTION ALGORITHM

		$salt = "salt";
		$hash = crypt($password, $salt);

		/* Prepared statement, stage 1: prepare */
	 	$query = "INSERT INTO scvwd.users(first_name, last_name, street_address, city, zip_code, email, phone, password, cell_carrier) VALUES" . "('$firstName' , '$lastName' , '$streetAddress' , '$city', '$zipCode', '$email', '$phone', '$hash', '$carrier')";
		if (!($stmt = $mysqli->prepare($query))) {
    		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
		}

		// $userTextFile = "newUsers.txt";
		// $file = fopen( $userTextFile, "a+" );
		// if( $file == false )
		// {
		//    echo ( "Error in opening new file" );
		//    exit();
		// }
		// fwrite( $file, $firstName . "\t" . $lastName . "\t" . $streetAddress . "\t" . $city . "\t" . $zipCode . "\t" . $email . "\t" . $phone . "\n");
		// fclose( $file );


		if (!$stmt->execute()) {
  			echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
		}

		//create user_gages tuple
		//get user_id
		//TODO: add more AND arguments for select

	 	// $query = "SELECT id FROM scvwd.users WHERE first_name = '" . $firstName . "' AND last_name = '" . $last_name . "'";
	 	// $res = $mysqli->query($query);
	 	// $row = $res->fetch_array();
	  	//  $id = $row['id'];

	    //create tuple in user_gages with user id
	 	// $query = "INSERT INTO scvwd.user_gages(user_id) VALUES" . "('$id')";
	 	$query = "INSERT INTO scvwd.user_gages(user_id) VALUES (LAST_INSERT_ID())";

	 	if (!($stmt = $mysqli->prepare($query))) {
    		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
		}
		if (!$stmt->execute()) {
  			echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
		}
		header("Location: ff.php");
		exit;
	}

?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>Registration with JQuery Validate</title>
	<link rel="stylesheet" href="assets/css/cmxform.css">
	<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="assets/css/registration.css">

</head>
<body>
	<div id="bg"><img src="assets/images/rainbg.jpg" width="100%" height="100%" alt=""></div>
	<div id="content">
	<div class="container" style="margin-top:50px; width:640px;">
		<div class="panel panel-primary">
			<div class="panel-heading">Sign up for email/text flood alerts</div>
	  			<div class="panel-body">
					<form class="cmxform" id='myForm' action="registration_jv.php" method="post">
						<table style="width:100%">
							<tr>
								<td class="formField">
									<div class="form-group">
										<label for="first_name">First Name</label>
										<input id="first_name" class="form-control" name="first_name"/>
									</div>
								</td>
								<td class="formField">
									<div class="form-group">
										<label for="last_name">Last Name</label>
										<input id="last_name" class="form-control"name="last_name"/>
									</div>
								</td>
							</tr>
							<tr>
								<td colspan="2" class="formField">
									<div class="form-group streetAddress">
										<label for="street_address">Street Address</label>
											<input type="text" class="form-control" id="street_address" name="street_address" placeholder="street address">
											<div id="streetAddressErrorMessage" class="errorMsg"></div>
									</div>
								</td>
							</tr>
							<tr>
								<td class="citySelect formField">
									<div class="form-group">
										<label for="city_select">City</label>
										<select class="form-control" name="city_select" id="city_select">
											<option selected="selected" value="default">Select City</option>
											<option value="alviso">Alviso</option>
											<option value="campbell">Campbell</option>
											<option value="cupertino">Cupertino</option>
											<option value="gilroy">Gilroy</option>
											<option value="los altos">Los Altos</option>
											<option value="los altos hills">Los Altos Hills</option>
											<option value="los gatos">Los Gatos</option>
											<option value="milpitas">Milpitas</option>
											<option value="monte sereno">Monte Sereno</option>
											<option value="morgan hill">Morgan Hill</option>
											<option value="mountain view">Mountain View</option>
											<option value="palo alto">Palo Alto</option>
											<option value="san jose">San Jose</option>
											<option value="san martin">San Martin</option>
											<option value="santa clara">Santa Clara</option>
											<option value="saratoga">Saratoga</option>
											<option value="sunnyvale">Sunnyvale</option>
										</select>
									</div>
								</td>
								<td class="zipCodeField formField">
									<div class="form-group">
										<label for="zip_code">Zip Code</label>
										<input type="text" class="form-control" id="zip_code" name="zip_code">
									</div>
								</td>
							</tr>
							<tr>
								<td class="formField">
									<div class="form-group">
										<label for="email">Email: </label>
										<input class="form-control" id="email" name="email"/>
									</div>
								</td>
								<td class="formField">
									<div class="form-group">
										<label for="email_confirm">Confirm Email </label>
										<input class="form-control" id="email_confirm" name="email_confirm" placeholder=""/>
									</div>
								</td>
							</tr>
							<tr>
								<td class="formField">
									<div class="form-group">
										<label for="phone">Cell Phone Number</label>
										<input class="form-control" type="text" class="form-control" name="phone" id="phone">
									</div>
								</td>
								<td class="formField">
									<div class="form-group">	
										<label for="phone_confirm">Confirm Cell</label>
										<input type="text" class="form-control" name="phone_confirm" id="phone_confirm">
									</div>
								</td>
							</tr>
							<tr>
								<td class="formField">
									<div class="form-group">
										<label for="carrier_select">Cell Carrier</label>
										<select class="form-control" name="carrier_select" id="carrier_select">
											<option value="">Choose...</option>
											<option value="verizon">Verizon</option>
											<option value="att">AT&T</option>
											<option value="sprint">Sprint</option>
											<option value="tmobile">T-Mobile</option>
										</select>
									</div>
								</td>
							</tr>
							<tr>
								<td class="passwordField">
									<div class="form-group">
										<label for="inputPassword">Password</label>
										<input type="password" class="form-control" id="password" name="password" placeholder="password">
										<div id="passwordErrorMessage" class="errorMsg"></div>
									</div>
								</td>
								<td class="passwordField">
									<div class="form-group">
										<label for="confirmInputPassword">Confirm Password</label>
										<input type="password" class="form-control" id="password_confirm" name="password_confirm" placeholder="confirm password">
									</div>
								</td>
							</tr>
						</table>
						<br>
						<input type="submit" class="btn btn-primary" value="Submit"/>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
	<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
	<script src="http://jqueryvalidation.org/files/dist/jquery.validate.min.js"></script>
	<script src="http://jqueryvalidation.org/files/dist/additional-methods.min.js"></script>
	<script>

	$(document).ready(function () {

		// just for the demos, avoids form submit
		// jQuery.validator.setDefaults({
		// 	debug: true,
		// 	success: "valid"
		// });

		$("#myForm").validate({
			rules: {
				first_name: "required",
				last_name:"required",
				city:"required",
				email: {
					required: true,
					email: true
				},
			 	email_confirm: {
			 		required: true,
					equalTo: "#email"
				},
				phone: {
					required: true,
					phoneUS: true
				},
				phone_confirm: {
					required: true
				},
				carrier_select: {
					required: true
				},
				password: {
					required: true
				},
				password_confirm: {
					required: true,
					equalTo: "#password"
				}
			},
			messages: {
				carrier_select: "Please Select"
			},
		 	submitHandler: function(form) {
		 		alert("test");
				form.submit();
			}
		});
	});

</script>
</body>
</html>

