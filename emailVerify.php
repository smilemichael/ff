<?php
	//email verification
	$to = "marciandmnd@yahoo.com"; // Send email to our user
	$subject = 'Signup | Verification'; // Give the email a subject
	$message = 'signed up?'; // Our message above including the link
	$headers = 'From: noreply@yourwebsite.com' . "\r\n"; // Set from headers
	if(mail($to, $subject, $message, $headers)){
		echo "mail sent";
	}else{
		echo "mail error";
		print_r(error_get_last());
	} // Send our email

?>
<html>
	<head>
	</head>
	<body>
		<p>email verification</p>
	</body>
</html>