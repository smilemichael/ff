<?php
	require_once("config_database_local.php");

	// Make a MySQL Connection
	$mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
?>	