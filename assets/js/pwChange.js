$("#btnCancel").on("click", function(){
	$('#btnEdit').removeAttr('disabled');
	$("#formCell").empty();
	$("#btnPWChange").css("visibility", "visible");
});

$("#changePasswordForm").validate({
	rules: {
		newPassword: {
			required: true
		},
		newPasswordConfirm: {
			required: true,
			equalTo: "#newPassword"
		}
	},
	invalidHandler: function(form, validator) {
		
	},
 	submitHandler: function(form) {
 		var password= $('#newPassword').val();
 		$.ajax({
			type: "POST",
			url: "changePassword.php",
			datatype: "string",
			data: {newPassword: password},
			success: function(data, textStatus, jqXHR) {
				// if($.trim(data)=="1"){
				// 	alert("valid credentials");
				// 	form.submit();
				// }else{
				// 	alert("Invalid email and/or password.");
				// }
				$("#formCell").empty();
				$("#btnPWChange").css("visibility", "visible");
				alert("Password has been changed.");
				$('#btnEdit').removeAttr('disabled');
			}
		});
	}
});
