
copy Z:\Upper_Guad_RAS_Model\ToGIS.xls C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py
copy Z:\Upper_Guad_RAS_Model\ToGIS_Grid.xls C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py
copy Z:\Upper_Guad_RAS_Model\ToGISSpillFlow.xls C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py
copy Z:\Upper_Guad_RAS_Model\ToGISSpillFlow_GRID.xls C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py

C:\Python24\python.exe C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\generatePlotData_singleFile.py
copy C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\js\plots\flowData.js Y:\Apache2.2\htdocs\scvwd\ff\assets\js\plots

timeout /t 5
timeout /t 5
timeout /t 5