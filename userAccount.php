<?php
	require_once("db_connect.php");
	session_start();
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){
		$firstNameEdit = $_POST['firstNameEdit'];
		$lastNameEdit = $_POST['lastNameEdit'];

		$query = "UPDATE scvwd.users SET first_name='$firstNameEdit', last_name='$lastNameEdit' WHERE id='".$_SESSION['id']."'";
		if (!($stmt = $mysqli->prepare($query))) {
	    		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
			}
		if (!$stmt->execute()) {
	  			echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
		}

	}
	// $id = $_GET['id'];
 	$query = "SELECT * FROM scvwd.users WHERE id = '" . $_SESSION['id'] . "'";
 	if (!($stmt = $mysqli->prepare($query))) {
		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
	}
	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
 	$row = $res->fetch_array();
 	$query = "SELECT * FROM scvwd.user_gages WHERE user_id='".$_SESSION['id']."'";
	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
 	$row_gages = $res->fetch_array();
 
?>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="assets/css/userAccount.css">
		<title>SCVWD User Account</title>
	<head>
	<body style="background-color:#99FFCC;">
		<div style="width:600px;margin:0 auto;">
			<h3>Account Settings</h3>
			<!-- <button class="btn btn-primary">Reset Password</button> -->
			<form action="userAccount.php?id=<?php echo $_SESSION['id']?>" method="post">
				<table class="table table-hover table-bordered" style="background-color:white;;">
					<tr>
						<td class="dataField"><strong>First Name:</strong></td>
						<td id="firstNameField"><?php echo $row['first_name']?></td>
					</tr>
					<tr>
						<td><strong>Last Name:</strong></td>
						<td id="lastNameField"><?php echo $row['last_name']?></td>
					</tr>
					<tr>
						<td><strong>Street Address:</strong></td>
						<td><?php echo $row['street_address']?></td>
					</tr>
					<tr>
						<td><strong>City:</strong></td>
						<td><?php echo $row['city']?></td>
					</tr>
					<tr>
						<td><strong>Zip Code:</strong></td>
						<td><?php echo $row['zip_code']?></td>
					</tr>

					<tr>
						<td><strong>Email:</strong></td>
						<td><?php echo $row['email']?></td>
					</tr>
					<tr>
						<td><strong>Cell Phone:</strong></td>
						<td><?php echo $row['phone']?></td>
					</tr>
					<tr>
						<td><strong>Cell Carrier:</strong></td>
						<td><?php echo $row['cell_carrier']?></td>
					</tr>
					<tr>
						<td id="accountEdit"><button class="btn btn-primary" id="btnEdit">Edit Information</button></td>
					</tr>
				</table>
			</form>
			<table class="table table-hover table-bordered" style="background-color:white;">
				<tr>
					<th colspan="2">ALERT Me</th>
				</tr>
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
	</body>
	<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
	<script>
		$(document).ready(function(){
			$('#btnEdit').on("click", function(){
				var firstName = $('#firstNameField').html();
				var lastName = $('#lastNameField').html();

				//enable form input
				$('#firstNameField').html("<input type='text' id='firstNameFieldInput' name='firstNameEdit'>");
				$('#lastNameField').html("<input type='text' id='lastNameFieldInput' name='lastNameEdit'>");
				
				//put current user info into form fields
				$('#firstNameFieldInput').val(firstName);
				$('#lastNameFieldInput').val(lastName);

				$('#accountEdit').html("<button class='btn btn-primary' type='submit'>Save</button>");
				var editing = true; //user is has clicked editing button


				// alert($('#firstNameField').html());
			})
		})
	</script>
</html>