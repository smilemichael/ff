<?php
	//TODO http referer must be from user account page
	require_once("../assets/php/db/db_connect.php");
	session_start();
	$query = "DELETE FROM scvwd.users WHERE id = '" . $_GET['id'] . "'";
 	if (!($stmt = $mysqli->prepare($query))) {
		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
	}
	$res = $mysqli->query($query) or trigger_error($mysqli->error."[$sql]");
	session_destroy();
?>
<html>
	<head>

	</head>
	<body>
		<p>You have successfully unsubscribed from the flood forecast system.</p>
		<p><a href="../index.php">Return to flood forecast system</a> 
	</body>
</html>