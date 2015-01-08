#SFTP script start
# Automatically abort script on errors 
option batch abort 
# Disable overwrite confirmations that conflict with the previous 
option confirm off 
# Connect to SFTP server 
open sftp://ec2-user@54.173.207.47 -privatekey="C:\xampp\security\scvwd-key-pair.ppk"
# Upload file 
put C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\js\plots\flowData.js /var/www/html/ff/ff/assets/js/plots/flowData.js
put C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\js\plots\rainData.js /var/www/html/ff/ff/assets/js/plots/rainData.js

# Disconnect 
close
exit
#SFTP script end
