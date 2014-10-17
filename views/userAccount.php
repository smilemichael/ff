<?php
	require_once("../assets/php/db/db_connect.php");
	session_start();

	#POST request handler for updating user account information 
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){
		$firstNameEdit = $_POST['firstNameFieldInput'];
		//update session variable for welcome message
		$_SESSION["first_name"] = $_POST['firstNameFieldInput'];
		$lastNameEdit = $_POST['lastNameFieldInput'];
		$emailEdit = $_POST['emailFieldInput'];
		$phoneEdit = $_POST['phoneFieldInput'];
		$streetAddressEdit = $_POST['streetAddressFieldInput'];
		$zipCodeEdit = $_POST['zipCodeFieldInput'];
		$cityEdit = $_POST['cityFieldInput'];
		$carrierEdit = $_POST['carrierFieldInput'];

		#save updated information fields to DB
		$query = "UPDATE scvwd.users SET first_name='$firstNameEdit', last_name='$lastNameEdit', email='$emailEdit', phone='$phoneEdit', street_address='$streetAddressEdit', city='$cityEdit', zip_code='$zipCodeEdit', cell_carrier='$carrierEdit' WHERE id='".$_SESSION['id']."'";
		if (!($stmt = $mysqli->prepare($query))) {
	    		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
			}
		if (!$stmt->execute()) {
	  			echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
		}

	}

	#Get user account information from DB for placement on account page
 	$query = "SELECT * FROM scvwd.users WHERE id = '" . $_SESSION['id'] . "'";
 	if (!($stmt = $mysqli->prepare($query))) {
		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
	}
	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
 	$row = $res->fetch_array();
 	//assign returned data to variables
 	$firstName = $row['first_name'];
 	$lastName = $row['last_name'];

 	$query = "SELECT * FROM scvwd.user_gages WHERE user_id='".$_SESSION['id']."'";
	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
 	$row_gages = $res->fetch_array();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="css/userAccount.css">
		<title>SCVWD User Account</title>
	<head>
	<body style="background-color:#CCFFFF;">
		<div class="navbar-outer">
			<nav class="navbar navbar-default navbar-fixed-top"  style="background-color:white!important;" role="navigation">
					<div class="navbar-header">
						<a class="navbar-brand">Account Settings - <?php echo $firstName . " " . $lastName; ?> </a>
					</div>
					<a class="navbar-text pull-right" href="../index.php">Return to App</a>
			</nav>
		</div>
		<div class="container" style="position:absolute;padding-top:80px;padding-bottom:80px;width:700px;margin: 0 auto;">
			<!-- <button class="btn btn-primary">Reset Password</button> -->
			<div class="panel panel-primary" style="top:80px;">
  				<div class="panel-heading">
  					<h4 style="display:inline;">Account Information</h4>
  					<div style="display:inline;" id="accountEdit">
						&nbsp&nbsp<button class="btn btn-default" id="btnEdit">Edit Information</button> 
						&nbsp&nbsp<button class="btn btn-danger" id="btnUnsubscribe">Unsubscribe</button>
					</div>
  				</div>
  					<div class="panel-body">
						<form id="accountEditForm" action="userAccount.php" method="post">
							<table class="table table-bordered" style="background-color:white;">
								<tr>
									<td class="dataLabel"><strong>First Name:</strong></td>
									<td id="firstNameField"><?php echo $row['first_name']?></td>
								</tr>
								<tr>
									<td><strong>Last Name:</strong></td>
									<td id="lastNameField"><?php echo $row['last_name']?></td>
								</tr>
								<tr>
									<td><strong>Street Address:</strong></td>
									<td id="streetAddressField"><?php echo $row['street_address']?></td>
								</tr>
								<tr>
									<td><strong>City:</strong></td>
									<td id="cityField"><?php echo $row['city']?></td>
								</tr>
								<tr>
									<td><strong>Zip Code:</strong></td>
									<td id="zipCodeField"><?php echo $row['zip_code']?></td>
								</tr>

								<tr>
									<td><strong>Email:</strong></td>
									<td id="emailField"><?php echo $row['email']?></td>
								</tr>
								<tr>
									<td><strong>Cell Phone:</strong></td>
									<td id="phoneField"><?php echo $row['phone']?></td>
								</tr>
								<tr>
									<td><strong>Cell Carrier:</strong></td>
									<td id="carrierField"><?php echo $row['cell_carrier']?></td>
								</tr>
								<tr>
									<button class="btn btn-primary" style="visibility:hidden" type="submit" id="btnSubmit">Submit/button> 
								</tr>
							</table>
						</form>
					</div>
				</div>
			<!-- AlertMe table shows alert gage subscription states -->
			<div class="panel panel-primary">
  				<div class="panel-heading"><h4>ALERT Me</h4></div>
					<div class="panel-body">
					<table class="table table-bordered" style="background-color:white;">
						<tr>
							<td>Guadalupe R above Almaden Expwy</td><!--23.2-->
							<?php if($row_gages["col_23"] == "T"){ ?>
								<td>Registered</td>
							<?php } else { ?> 
								<td>Not Registered</td>
							<?php } ?>
						</tr>
						<tr>
							<td>Ross Creek at Cherry Ave.</td><!--51-->
							<?php if($row_gages["col_51"] == "T"){ ?>
								<td>Registered</td>
							<?php } else { ?> 
								<td>Not Registered</td>
							<?php } ?>
						</tr>
						<tr>
							<td>Guadalupe R above Branham Ln</td><!--93-->
							<?php if($row_gages["col_93"] == "T"){ ?>
								<td>Registered</td>
							<?php } else { ?> 
								<td>Not Registered</td>
							<?php } ?>
						</tr>
						<tr>
							<td>West Little Llagas blw Edmundson Ave</td><!--117-->
							<?php if($row_gages["col_117"] == "T"){ ?>
								<td>Registered</td>
							<?php } else { ?> 
								<td>Not Registered</td>
							<?php } ?>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</body>
	<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
	<script src="http://jqueryvalidation.org/files/dist/jquery.validate.min.js"></script>
	<script src="http://jqueryvalidation.org/files/dist/additional-methods.min.js"></script>
	<script>
		$(document).ready(function(){

			$('#btnUnsubscribe').on("click", function(){
				var unsubscribe = confirm("Are you sure you want to unsubscribe from the flood forecast system?");
				if (unsubscribe == true) {
					//TODO unsubscribe via ajax to not expose controllers urls
				    window.location.href = "../controllers/unsubscribe.php?id=<?php echo $_SESSION['id'];?>";
				} 
			});

			$('#btnEdit').on("click", function(){
				//get initial data fields from account info table
				var firstName = $('#firstNameField').html();
				var lastName = $('#lastNameField').html();
				var email = $('#emailField').html();
				var phone = $('#phoneField').html();
				var streetAddress = $('#streetAddressField').html();
				var city = $('#cityField').html();
				var zipCode = $('#zipCodeField').html();
				var carrier = $('#carrierField').html();

				//enable form input
				$('#firstNameField').html("<input class='form-control' type='text' id='firstNameFieldInput' name='firstNameFieldInput'>");
				$('#lastNameField').html("<input class='form-control' type='text' id='lastNameFieldInput' name='lastNameFieldInput'>");
				$('#emailField').html("<input class='form-control' type='text' id='emailFieldInput' name='emailFieldInput'>");
				$('#phoneField').html("<input class='form-control' type='text' id='phoneFieldInput' name='phoneFieldInput'>");
				$('#streetAddressField').html("<input class='form-control' type='text' id='streetAddressFieldInput' name='streetAddressFieldInput'>");
				$('#cityField').html("<input class='form-control' type='text' id='cityFieldInput' name='cityFieldInput'>");
				$('#zipCodeField').html("<input class='form-control' type='text' id='zipCodeFieldInput' name='zipCodeFieldInput'>");
				$('#carrierField').html("<select class='form-control' name='carrierFieldInput' id='carrierFieldInput'>" +
											'<option value="">Choose...</option>' +
											'<option value="Verizon">Verizon</option>' +
											'<option value="ATT">AT&T</option>' +
											'<option value="Sprint">Sprint</option>' +
											'<option value="T-Mobile">T-Mobile</option>' +
										'</select>');

				
				//put current user info into form fields
				$('#firstNameFieldInput').val(firstName);
				$('#lastNameFieldInput').val(lastName);
				$('#emailFieldInput').val(email);
				$('#phoneFieldInput').val(phone);
				$('#streetAddressFieldInput').val(streetAddress);
				$('#cityFieldInput').val(city);
				$('#zipCodeFieldInput').val(zipCode);
				$('option[value=' + carrier +']').attr('selected', 'selected');


				//replace edit button with save button
				$('#accountEdit').html("&nbsp&nbsp<button class='btn btn-success' id='btnSave' type='submit'>Save</button>" +
					"<script>$('#btnSave').on('click',function(){"+
						"$('#btnSubmit').click();" +
			  			"$('#btnPWChange').removeAttr('disabled');" +
					"});<\/script>"
				);
				 $.validator.addMethod("alpha", function(value, element) {
				    return this.optional(element) || value == value.match(/^[a-zA-Z]+$/);
				 });
				//validate form input
				$("#accountEditForm").validate({
					rules: {
						firstNameFieldInput: {
							required: true,
							alpha: true
						},
						lastNameFieldInput: {
							required: true
						},
						streetAddressFieldInput: {
							required: false
						},
						cityFieldInput: {
							required: false
						},
						zipCodeFieldInput: {
							required: false,
							minlength: 5,
                    		maxlength: 5,
                    		digits: true
						},
						phoneFieldInput: {
							required: true,
							phoneUS: true
						},
						emailFieldInput: {
							required: true,
							email: true
						},
						carrierFieldInput: {
							required: true
						}
					},
					messages: {
						carrierFieldInput: "Please Select...",
						firstNameFieldInput: "Name fields may only contain letters."
					},
					invalidHandler: function(form, validator) {
						var errors = validator.numberOfInvalids();
						if (errors) {
							alert("Invalid form fields. Please Correct.");
						}
					},
				 	submitHandler: function(form) {
						form.submit();
					}
				});

				
			});
		});
	</script>
</html>