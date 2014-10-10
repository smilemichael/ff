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

##open excel workbook with  sta 112 forcasted flow data
wrkFlow = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGIS_Grid.xls")
shtFlow = wrkFlow.sheet_by_index(0)

flname = "sta112_fcFlowTimeSeries.js"
#excel column with flow data
col_usgs = 5
#process flow data
fout = open("C:\\xampp\\htdocs\\scvwd\\app_beta_ALERTC_config\\ff\\assets\\py\\"+flname, "w")
print>>fout, "var sta112_fcFlow = ["
for r in range(7, shtFlow.nrows):
    #date_value may used as x argument for highcharts plot
    date_value = xldate_as_tuple(shtFlow.cell(r,1).value,wrkFlow.datemode)
    #months are from 0-11 in highcharts, so subract 1 from month value in date_value
    #to modify date tuple, date_value must be turned into a list
    dv_lst = list(date_value)
    #subtract 1 from month
    dv_lst[1] = date_value[1]-1
    #turn list back into a tuple
    date_value = tuple(dv_lst)
    dataStamp = "[Date.UTC" + str(date_value) + ", " + str(round(shtFlow.cell_value(r,5),2)) + "]"
    if r < shtFlow.nrows-1:
        dataStamp += ","
    print>>fout, dataStamp 
print>>fout, "];"
fout.close()
