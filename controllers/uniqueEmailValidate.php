<?php
	require_once("../assets/php/db/db_connect.php");

	$email = $_GET["email"];
	$query = "SELECT email FROM scvwd.users WHERE email = '" . $email . "'";
	$result = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
 	$row = $result->fetch_array();
 	$length = count($row);
 	echo $length;
	// $lengths = mysql_fetch_lengths($row;
	
?>