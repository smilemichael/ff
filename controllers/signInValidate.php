

<?php
	// Validate users login credentials
	require_once("../assets/php/db/db_connect.php");

	//salt for cryptographic hash function
    $salt ="salt";
    
    //find user email in db
    $email = $_GET["email"];
	$query = "SELECT * FROM scvwd.users WHERE email = '" . $email . "'";
	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
 	$row = $res->fetch_array();
    $email = $row['email'];
    $id=$row['id'];
	if($row["password"] == crypt($_GET["password"], $salt)){
		session_start();
		$_SESSION['id'] = $row['id'];
		$_SESSION['email'] = $row['email'];
    	$_SESSION['first_name'] = $row['first_name'];
    	$_SESSION['logged_in'] = true;
    	echo "1";
	}else{
		echo "0";
	}
?>