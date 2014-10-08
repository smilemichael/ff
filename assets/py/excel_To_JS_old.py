#!C:/Python27/python.exe 

#this file reads an excel spreadsheet and creates javascript timeseries variables
#that encapsulate channel flow rates for stations 51 and 93
#the excel data is located in ToGIS.xls


#import necessary python modules

import xlrd
import time
from xlrd import open_workbook,xldate_as_tuple
import re
import sys, fileinput, os, string
from datetime import datetime
import time
#get current UTC time
currentTimeUTC = int(round(time.time() * 1000))
print "current time UTC: " + str(currentTimeUTC)
print datetime.utcnow()

#open workbook with spill/flow data
#flow data
wrkFlow = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGIS.xls")
shtFlow = wrkFlow.sheet_by_index(0)

#spill data
wrkSpill = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGISSpillFlow.xls")
shtSpill = wrkSpill.sheet_by_index(0)
#TODO -8hrs from UTC for PST

def unix_time(dt):
    return int(round(time.mktime(dt.timetuple()) * 1000))

#process flow data
for c in range(2, shtFlow.ncols):
    ##numDataStamps is for a 48 hour timeseries period
    numDataStamps = 192
    numStampsWritten = 0;
    foundCurrTime = False
    flname =  shtFlow.cell_value(1,c)

    if "SF5093" in flname:
        station = "sta93"
        flname =  "sta93_fcFlowTimeSeries"
    if flname == "CI Z ROSS GAGE 51 @CHERRY":
        station = "sta51"
        flname =  "sta51_fcFlowTimeSeries"
    if "WLL_OUTLET_GAGE117" in flname:
        station = "sta117"
        flname = "sta117_fcFlowTimeSeries"
    
    fout = open(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\\"+flname+".js","w")
    print>>fout, "var " + station + "_fcFlow = ["
    
    for r in range(7, shtFlow.nrows):
        #date_value may used as x argument for highcharts plot
        date_value = xldate_as_tuple(shtFlow.cell(r,1).value,wrkFlow.datemode)
        #pydate_value used to determine current time
        pydate_value = datetime(date_value[0], date_value[1],date_value[2], date_value[3], date_value[4], date_value[5])

        #months are from 0-11 in highcharts, so subract 1 from month value in date_value
        #to modify date tuple, date_value must be turned into a list
        dv_lst = list(date_value)
        #subtract 1 from month
        dv_lst[1] = date_value[1]-1
        #turn list back into a tuple
        date_value = tuple(dv_lst) 
##        if unix_time(pydate_value) >= currentTimeUTC and foundCurrTime == False:
##            foundCurrTime = True
##        if numStampsWritten >= numDataStamps:
##            break
##        if foundCurrTime:
        currTimeIndex = r
        dataStamp = "[Date.UTC" + str(date_value) + ", " + str(round(shtFlow.cell_value(r,c),2)) + "]"
    ##            numStampsWritten += 1;
    ##            if numStampsWritten<numDataStamps:
        if r < shtFlow.nrows-1:
            dataStamp += ","
        print>>fout, dataStamp 
    print>>fout, "]"		

#todo process spill data	
