<?php
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){
		// Load Config Database File
		require_once("config_database_reg.php");

		// Make a MySQL Connection
		$mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
	    if ($mysqli->connect_errno) {
	        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	    }
			
		$firstName = $_POST['firstName'];
		$lastName = $_POST['lastName'];
		$streetAddress = $_POST['streetAddress'];
		$city = $_POST['city'];
		$zipCode = $_POST['zipCode'];
		$email =  $_POST['email'];
		$phone = $_POST['phone'];
		$carrier = $_POST['carrier'];
		$password = $_POST['password'];

		// Get the hash for the password, letting the salt be automatically generated
		$hash = crypt($password);
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

	}
?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="assets/css/registration.css">

	</head>
	<body style="background-color:#66FFFF;">
		<div id="bg"><img src="assets/images/rainbg.jpg" width="100%" height="100%" alt=""></div>
		<div id="content">
		<div class="container" style="margin-top:50px; width:640px;">
			<div class="panel panel-primary">
				<div class="panel-heading">Sign up for email/text flood alerts</div>
		  			<div class="panel-body">
						<form role="form" id="alertRegistrationForm">
							<table>
								<tr>
									<td class="nameField formField">
										<div class="form-group">
											<label for="inputFirstName" class="control-label">First Name</label>
											<input type="text" class="form-control" id="firstNameField" name="firstName" placeholder="first name">
											<div id="firstNameErrorMessage" class="errorMsg"></div>
										</div>
									</td>
									<td class="nameField formField">
										<div class="form-group">
											<label for="inputLastName" class="control-label">Last Name</label>
											<input type="text" class="form-control" id="lastNameField" name="lastName" placeholder="last name">
											<div id="lastNameErrorMessage" class="errorMsg"></div>
										</div>
									</td>
								</tr>
								<tr>
									<td colspan="2" class="formField">
										<div class="form-group streetAddress">
											<label for="inputStreetAddress">Street Address</label>
												<input type="text" class="form-control" id="streetAddressField" name="streetAddress" placeholder="street address">
												<div id="streetAddressErrorMessage" class="errorMsg"></div>
										</div>
									</td>
								</tr>
								<tr>
									<td class="citySelect formField">
										<div class="form-group">
											<label for="selectCity">City</label>
											<select class="form-control" name="carrier" id="citySelect">
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
											<div id="cityErrorMessage" class="errorMsg"></div>
										</div>
									</td>
									<td class="zipCodeField formField">
										<div class="form-group">
											<label for="inputZipCode">Zip Code</label>
											<input type="text" class="form-control" id="zipCodeField" name="zipCode" placeholder="zip code">
											<div id="zipCodeErrorMessage" class="errorMsg"></div>
										</div>
									</td>
								</tr>
								<tr>
									<td colspan="2" class="formField">
										<div class="form-group">
											<label for="inputEmail">Email Address</label>
											<input type="email" class="form-control" id="emailField" name="email" placeholder="ex: foo@bar.com">
											<div id="emailErrorMessage" class="errorMsg"></div>
										</div>
									</td>
								</tr>
								<tr>
									<td colspan="2" class="formField">
										<div class="form-group">
											<label for="confirmInputEmail">Confirm Email Address</label>
											<input type="email" class="form-control" id="confirmEmailField" placeholder="confirm email">
											<div id="confirmEmailErrorMessage" class="errorMsg"></div>
										</div>
									</td>
								</tr>
								<tr>
									<td class="phoneField">
										<div class="form-group" style="display:inline-block">
											<label for="inputPhone">Cell Phone Number</label>
											<input type="text" class="form-control" id="phoneField" name="phone" style="width:125px;"placeholder="ex: 1234567891">
											<div id="phoneErrorMessage" class="errorMsg"></div>
										</div>
										<div class="form-group" style="display:inline-block;padding-left:10px;">	
											<label for="confirmInputPhone">Confirm Cell</label>
											<input type="text" class="form-control" id="confirmPhoneField" style="width:125px;" placeholder="confirm cell">
											<div id="confirmPhoneErrorMessage" class="errorMsg"></div>
										</div>
									</td>
									<td>
										<div class="form-group" style="display:inline-block;">
											<label for="inputCarrier">Cell Carrier</label>
											<select class="form-control" name="carrier" id="carrierSelect">
												<option selected="selected" value="default">Select Cell Carrier</option>
												<option value="verizon">Verizon</option>
												<option value="att">AT&T</option>
												<option value="sprint">Sprint</option>
												<option value="tmobile">T-Mobile</option>
											</select>
										<div id="carrierErrorMessage" class="errorMsg"></div>
										</div>
									</td>
								</tr>
								<tr>
									<td class="passwordField">
										<div class="form-group">
											<label for="inputPassword">Password</label>
											<input type="password" class="form-control" id="passwordField" name="password" placeholder="password">
											<div id="passwordErrorMessage" class="errorMsg"></div>
										</div>
									</td>
									<td class="passwordField">
										<div class="form-group">
											<label for="confirmInputPassword">Confirm Password</label>
											<input type="password" class="form-control" id="confirmPasswordField" placeholder="confirm password">
											<div id="confirmPasswordErrorMessage" class="errorMsg"></div>
										</div>
									</td>
								</tr>
							</table>
							<!-- <div class="form-group">
								<label for="exampleInputFile">File input</label>
								<input type="file" id="exampleInputFile">
								<p class="help-block">Example block-level help text here.</p>
							</div> -->
							<button type="submit" class="btn btn-success" id="btnSubmit">Submit</button>
						</form>
					</div>
				</div>
			</div>
		</div>
		<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
		<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		<script>
			$(document).ready(function(){

				$('#firstNameField').keyup(function () { 
					if($('#firstNameErrorMessage').html()!=""){
						$('#firstNameErrorMessage').html("");
					}
				});

				$('#lastNameField').keyup(function () { 
					if($('#lastNameErrorMessage').html()!=""){
						$('#lastNameErrorMessage').html("");
					}
				});

				$('#streetAddressField').keyup(function () { 
					if($('#streetAddressErrorMessage').html()!=""){
						$('#streetAddressErrorMessage').html("");
					}
				});

				$('#citySelect').change(function(){
					if( $('#citySelect').val() !="default" && $('#cityErrorMessage').html()!=""){
						$('#cityErrorMessage').html("");
					}
				});
				// $('#btnSubmit').on("click", function(event){
				// 	//REGISTRATION FORM INPUT VALIDATION 
				// 	//first make sure all fields have been filled out
				// 	event.preventDefault();
				// 	inputFieldsFilled();
				// 	// //make sure name and city fields contain only letters	
				// 	// validateLettersOnly($('#firstNameField').val(), "firstName");
				// 	// validateLettersOnly($('#lastNameField').val(), "lastName");
				// 	//POST REQUEST
				// 	// $.post( "registration.php", $( "#alertRegistrationForm" ).serialize());
				// });
					//variable to hold request
					var request;
					// bind to the submit event of our form
					$("#alertRegistrationForm").submit(function(event){
					    // abort any pending request
					    if (request) {
					        request.abort();
					    }
					    // setup some local variables
					    var $form = $(this);
					    // let's select and cache all the fields
					    var $inputs = $form.find("input, select");
					    // serialize the data in the form
					    var serializedData = $form.serialize();

					    // let's disable the inputs for the duration of the ajax request
					    // Note: we disable elements AFTER the form data has been serialized.
					    // Disabled form elements will not be serialized.
					    $inputs.prop("disabled", true);

					    // fire off the request to /form.php
					    request = $.ajax({
					        url: "registration.php",
					        type: "post",
					        data: serializedData
					    });

					    // callback handler that will be called on success
					    request.done(function (response, textStatus, jqXHR){
					        // log a message to the console
					        console.log("Hooray, it worked!");

					        // similar behavior as an HTTP redirect
							window.location.replace("http://alertc/scvwd/ff/ff.html");

					    });

					    // callback handler that will be called on failure
					    request.fail(function (jqXHR, textStatus, errorThrown){
					        // log the error to the console
					        console.error(
					            "The following error occured: "+
					            textStatus, errorThrown
					        );
					    });

					    // callback handler that will be called regardless
					    // if the request failed or succeeded
					    request.always(function () {
					        // reenable the inputs
					        $inputs.prop("disabled", false);
					    });

					    // prevent default posting of form
					    event.preventDefault();
					    /* Redirect browser */
					});
				// });

			});


			function inputFieldsFilled(){
				if($('#firstNameField').val().trim() ===""){
					$("#firstNameErrorMessage").html("Please enter first name.");
				}

				if($('#lastNameField').val().trim() ===""){
					$("#lastNameErrorMessage").html("Please enter last name.");
				}

				if($('#streetAddressField').val().trim() ===""){
					$("#streetAddressErrorMessage").html("Please enter address.");
				}

				if($('#citySelect').val() ==="default"){
					$("#cityErrorMessage").html("Please select city.");
				}

				if($('#zipCodeField').val().trim() ===""){
					$("#zipCodeErrorMessage").html("Please enter zip code.");
				}

				if($('#emailField').val().trim() ===""){
					$("#emailErrorMessage").html("Please enter email address");
				}

				if($('#confirmEmailField').val().trim() ===""){
					$("#confirmEmailErrorMessage").html("Please confirm email");
				}

				if($('#phoneField').val().trim() ===""){
					$("#phoneErrorMessage").html("Enter cell number.");
				}

				if($('#confirmPhoneField').val().trim() ===""){
					$("#confirmPhoneErrorMessage").html("Confirm cell number.");
				}

				if($('#carrierSelect').val()==="default"){
					$("#carrierErrorMessage").html("Please select cell carrier.");
				}


				if($('#passwordField').val().trim() ===""){
					$("#passwordErrorMessage").html("Please enter password.");
				}

				if($('#confirmPasswordField').val().trim() ===""){
					$("#confirmPasswordErrorMessage").html("Please confirm password.");
				}
			}

			function validateLettersOnly(str, type){

				//var patt = ^[a-zA-Z]+$;
				if(!/^[a-zA-Z]+$/.test(str)){
					$("#firstNameField").focus()
					switch(type){
						case "firstName": 	$("#firstNameErrorMessage").html("Name fields can only characters!");
										break;
						case "lastName": 	$("#lastNameErrorMessage").html("Name fields can only characters!");
										break;

					}
				}
				//alert(/^[a-zA-Z]+$/.test(name));
			}
		</script>
	</body>
</html>