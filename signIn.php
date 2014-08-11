<?php
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

		echo $email;
		if($row["password"] == crypt($_POST["passwordInput"], $salt)){
			echo "\npassword correct";
			//TODO START SESSION AND WRITE COOKIES TO CLIENT SIDE
			echo "<br/><a href='userAccount.php?id=$id'>Account Settings</a>";
		}else{
			echo "password incorrect\n"; 
			echo "\ndb: " . $row["password"] . "\n";
			echo "\ninput: " . crypt($_POST["passwordInput"], "salt");
		}
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" href="assets/css/signIn.css">
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
	<head>
	<body>
		<div id="signInForm">
			<h3>Please sign in</h3>
			<form class="form" action="signIn.php" method="post">
				<div class="form-group">
					<label for="emailInput">Email address</label>
					<input type="email" class="form-control" placeholder="Enter email" name="emailInput">
				</div>
				<div class="form-group">
					<label for="passwordInput">Password</label>
					<input type="password" class="form-control" placeholder="Password" name="passwordInput">
				</div>
				<button class="btn btn-primary" type="submit">submit</button>
			</form>
		</div>
	</body>
</html>