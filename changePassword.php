<?php
	require_once("db_connect.php");
	session_start();

	#POST request handler for updating user account information 
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){
		$salt = "salt";
		$encryptedPW = crypt($_POST["newPassword"], $salt);
		#save updated information fields to DB
		$query = "UPDATE scvwd.users SET password='$encryptedPW' WHERE id='".$_SESSION['id']."'";
		if (!($stmt = $mysqli->prepare($query))) {
	    		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
			}
		if (!$stmt->execute()) {
	  			echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
		}
	}
?>