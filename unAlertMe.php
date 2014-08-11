<?php
	//connect to DB
	require_once("db_connect.php");
	session_start();

	$station = $_GET['sta'];
	// $query = "UPDATE scvwd.user_gages SET col_51='T' WHERE user_id='".$_SESSION['id']."'"; WORKS
	// $query = "UPDATE scvwd.user_gages SET col_".$station."='T' WHERE user_id='8'"; WORKS
	// $query = "UPDATE scvwd.user_gages SET col_51='T' WHERE user_id='8'";	WORKS

	$query = "UPDATE scvwd.user_gages SET col_".$station."='F' WHERE user_id='".$_SESSION['id']."'";
	if (!($stmt = $mysqli->prepare($query))) {
    		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
		}
	if (!$stmt->execute()) {
  			echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
	}
?>