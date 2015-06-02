<?php 
	// if($_SERVER['REQUEST_METHOD'] === 'POST'){
	// 	exec("java -version" ,$output);
	// 	echo $output; 
	// }
	session_start();
	if($_SESSION['login'] != 1){
		header("Location: admin_login.php"); /* Redirect browser */
		exit();
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta name="author" content="Marcian Diamond">
		<title>SCVWD Flood Admin Page</title>
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
		<style type="text/css">
			body{
				background-color: #FFFFCC;
			}
			#mainConsole{
				width: 80%;
				min-width: 600px;
				background-color: #66FFFF;
				margin: 0 auto;
			}
		</style>
	</head>
	<body>
		<nav class="navbar navbar-default">
  			<div class="container-fluid">
    				<div class="navbar-header">
						<a class="navbar-brand" href="#">
						SCVWD Flood Admin - Dashboard
      					</a>
    				</div>
    				<ul class="nav navbar-nav navbar-right">
        				<li><a href="logout.php">Logout</a></li>
  					</ul>
		</nav>
		<div id='mainConsole'>
			<h2>Forecasted Flood Conditions</h2>
			<table class="table table-hover">
				<tr>
					<th>Station Name</th>
					<th>Flood Condition Code</th>
					<th>Actions</th>
				<tr>
					<td>Ross Ck at Cherry Ave.</td>
				</tr>
			</table>
			<form method="post" action="admin.php"> 
				<button id="runJavaTest">test</button>
			</form>
		</div>
		<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
	</body>	
</html>
