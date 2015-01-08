import MySQLdb as mdb
import sys, fileinput, os, string
import time
import xlrd
from datetime import datetime, timedelta

import sgmllib
import urllib, sgmllib
import re

##open workbook with rainfall data
##rainfall data
wrkRain = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGISRainfall.xls")

shtRain = wrkRain.sheet_by_index(0)

c = 2 ##column number for sta2065

fout = open(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\js\plots\rainData.js","w")


####nowUTC = datetime.utcnow()
####nowPST = nowUTC - timedelta(hours=8)
numTimePoints = 0; ##288 timepoints for 72 hour forecast

##for r in range(7, shtFlow.nrows):
##    ##date_value may used as x argument for highcharts plot
##    ##get date from excel sheet
##    date_value = xlrd.xldate_as_tuple(shtFlow.cell(r,1).value,wrkFlow.datemode)
##    ##make python datetime object from excel date
##    date_value_DT = datetime(*date_value)
##    if date_value_DT >= nowPST and numTimePoints < 288:
##        #print numTimePoints
##        dv_tuple = date_value_DT.timetuple()
##        #months are from 0-11 in highcharts, so subract 1 from month value in date_value
##        #to modify date tuple, date_value must be turned into a list
##        dv_lst = list(dv_tuple)
##        year = str(dv_lst[0])
##        month = str(dv_lst[1]-1) ##hc format
##        day = str(dv_lst[2])
##        hour = str(dv_lst[3])
##        minute = str(dv_lst[4])
##        dataStamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtFlow.cell_value(r,c),2)) + "]"
##        if numTimePoints < 287:
##            dataStamp += ","
##        print>>fout, dataStamp
##        numTimePoints += 1
##print>>fout, "];"
for c in range(2,3):
    numTimePoints = 0;
    if c == 2:
        print>>fout, "var sta2065_Rain = ["
    if c == 3:
        print>>fout, "var sta1528_Rain = ["
    if c == 4:
        print>>fout, "var sta1890_Rain = ["
    for r in range(7, shtRain.nrows):
        ##date_value may used as x argument for highcharts plot
        ##get date from excel sheet
        date_value = xlrd.xldate_as_tuple(shtRain.cell(r,1).value,wrkRain.datemode)
        ##make python datetime object from excel date
        date_value_DT = datetime(*date_value)
        #print numTimePoints
        dv_tuple = date_value_DT.timetuple()
        #months are from 0-11 in highcharts, so subract 1 from month value in date_value
        #to modify date tuple, date_value must be turned into a list
        dv_lst = list(dv_tuple)
        year = str(dv_lst[0])
        month = str(dv_lst[1]-1) ##hc format
        day = str(dv_lst[2])
        hour = str(dv_lst[3])
        minute = str(dv_lst[4])
        dataStamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtRain.cell_value(r,c),2)) + "]"
        if numTimePoints < shtRain.nrows-8:
            dataStamp += ","
        print>>fout, dataStamp
        numTimePoints += 1
    print>>fout, "];"
