copy Z:\Upper_Guad_RAS_Model\ToGIS.xls C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py
copy Z:\Upper_Guad_RAS_Model\ToGISSpillFlow.xls C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py
copy Z:\Upper_Guad_RAS_Model\ToGIS_Grid.xls C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py

C:\Python24\python.exe C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\excel_to_JS.py
timeout /t 5
C:\Python24\python.exe C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\sta112_USGS_retrieveHistoricFlowData.py
timeout /t 5
C:\Python24\python.exe C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\sta112_USGS_retrieveForecastFlowData.py
timeout /t 5
copy C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\sta117_fcFlowTimeSeries.js Y:\Apache2.2\htdocs\scvwd\ff\assets\py
copy C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\sta51_fcFlowTimeSeries.js Y:\Apache2.2\htdocs\scvwd\ff\assets\py
copy C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\sta93_fcFlowTimeSeries.js Y:\Apache2.2\htdocs\scvwd\ff\assets\py
