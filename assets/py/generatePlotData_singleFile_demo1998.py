import MySQLdb as mdb
import sys, fileinput, os, string
import time
import xlrd
from datetime import datetime, timedelta

import sgmllib
import urllib, sgmllib
import re

##STATION 51############
try:
    ##output file
    fout = open("C:\\xampp\\htdocs\\scvwd\\app_beta_ALERTC_config\\ff\\assets\\js\\plots\\flowData.js","w")
    ##sta51 historic flow data
    print>> fout,"//station 51 flow data"
    print>>fout, "var sta51_histFlow = ["
    con = mdb.connect('10.25.5.112', 'root', 'datawise', 'datawise');
    cur = con.cursor()
    sql = "Select * From s2058_rated Where T_TIME > DATE_ADD(now(),INTERVAL -2 DAY) ORDER BY T_TIME ASC"
    cur.execute(sql)
    results = cur.fetchall()
    result_count = cur.rowcount
    i = 0
    for row in results:
        date = row[0]
        year = str(date.year)
        month = str(date.month-1) ##-1 for js month formatting
        day = str(date.day)
        hour = str(date.hour)
        minute = str(date.minute)
        flowrate = str(row[1])
        datastamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+")," + flowrate + "]"
        if i<result_count-1:
            datastamp += ","
        print>>fout,datastamp
        i = i+1
    print>>fout,"];"
except mdb.Error, e:
    print "Error %d: %s" % (e.args[0],e.args[1])
    sys.exit(1)

##get forecast flow and spill data for station 51
##open workbook with spill/flow data
##flow data
wrkFlow = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGIS.xls")
shtFlow = wrkFlow.sheet_by_index(0)

c = 2 ##column number for sta51 forecast flow data

##fout = open(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\\js\\plots\\sta51\\"+flname,"w")
print>>fout, "var sta51_fcFlow = ["

nowUTC = datetime.utcnow()
nowPST = nowUTC - timedelta(hours=8)
numTimePoints = 0; ##192 timepoints for 48 hour forecast

for r in range(7, shtFlow.nrows):
    ##date_value may used as x argument for highcharts plot
    ##get date from excel sheet
    date_value = xlrd.xldate_as_tuple(shtFlow.cell(r,1).value,wrkFlow.datemode)
    ##make python datetime object from excel date
    date_value_DT = datetime(*date_value)
    if date_value_DT >= nowPST and numTimePoints < 192:
        dv_tuple = date_value_DT.timetuple()
        #months are from 0-11 in highcharts, so subract 1 from month value in date_value
        #to modify date tuple, date_value must be turned into a list
        dv_lst = list(dv_tuple)
        year = str(dv_lst[0])
        month = str(dv_lst[1]-1) ##hc format
        day = str(dv_lst[2])
        hour = str(dv_lst[3])
        minute = str(dv_lst[4])
        dataStamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtFlow.cell_value(r,c),2)) + "]"
        if numTimePoints < 191:
            dataStamp += ","
        print>>fout, dataStamp
        numTimePoints += 1
print>>fout, "];"

####Generate spill variables
###spill data
wrkSpill = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGISSpillFlow.xls")
shtSpill = wrkSpill.sheet_by_index(0)
cherry_c = 2 ##column with Cherry spill data
jarvis_c = 3 ##column with Jarvis spill data

for c in range(2, 4):
    numTimePoints = 0;
    if c == 2:
        spillZone = "Cherry"
    else:
        spillZone = "Jarvis"

    print>>fout, "var " + spillZone + " = ["

    for r in range(7, shtSpill.nrows):
        date_value = xlrd.xldate_as_tuple(shtSpill.cell(r,1).value,wrkSpill.datemode)
        date_value_DT = datetime(*date_value)
        
        if date_value_DT >= nowPST and numTimePoints < 192:
            dv_tuple = date_value_DT.timetuple()
            #months are from 0-11 in highcharts, so subract 1 from month value in date_value
            #to modify date tuple, date_value must be turned into a list
            dv_lst = list(dv_tuple)
            year = str(dv_lst[0])
            month = str(dv_lst[1]-1) ##hc format
            day = str(dv_lst[2])
            hour = str(dv_lst[3])
            minute = str(dv_lst[4])
            dataStamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtSpill.cell_value(r,c),2)) + "]"
            if numTimePoints < 191:
                dataStamp += ","
            print>>fout, dataStamp
            numTimePoints += 1
    print>>fout, "];"

#######STATION 93############

try:
    print>>fout, "var sta93_histFlow = ["
    cur = con.cursor()
    sql = "Select * From s1543_rated Where T_TIME > DATE_ADD(now(),INTERVAL -2 DAY) ORDER BY T_TIME ASC"
    cur.execute(sql)
    results = cur.fetchall()
    result_count = cur.rowcount
    print result_count
    i = 0
    for row in results:
        date = row[0]
        year = str(date.year)
        month = str(date.month-1) ##-1 for js month formatting
        day = str(date.day)
        hour = str(date.hour)
        minute = str(date.minute)
        flowrate = str(row[1])
        datastamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+")," + flowrate + "]"
        if i<result_count-1:
            datastamp += ","
        print>>fout,datastamp
        i = i+1
    print>>fout,"];"
except mdb.Error, e:
    print "Error %d: %s" % (e.args[0],e.args[1])
    sys.exit(1)

c = 3 ##column number for sta93 forecast flow data

print>>fout, "var sta93_fcFlow = ["
numTimePoints = 0; ##192 timepoints for 48 hour forecast
for r in range(7, shtFlow.nrows):
    ##date_value may used as x argument for highcharts plot
    ##get date from excel sheet
    date_value = xlrd.xldate_as_tuple(shtFlow.cell(r,1).value,wrkFlow.datemode)
    ##make python datetime object from excel date
    date_value_DT = datetime(*date_value)
    if date_value_DT >= nowPST and numTimePoints < 192:
        dv_tuple = date_value_DT.timetuple()
        #months are from 0-11 in highcharts, so subract 1 from month value in date_value
        #to modify date tuple, date_value must be turned into a list
        dv_lst = list(dv_tuple)
        year = str(dv_lst[0])
        month = str(dv_lst[1]-1) ##hc format
        day = str(dv_lst[2])
        hour = str(dv_lst[3])
        minute = str(dv_lst[4])
        dataStamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtFlow.cell_value(r,c),2)) + "]"
        if numTimePoints < 191:
            dataStamp += ","
        print>>fout, dataStamp
        numTimePoints += 1
print>>fout, "];"

###spill data sta93
rossl_c = 4 
rossr_c = 5 
ross1_c = 6
ross2_c = 7
for c in range(4, 8):
    print c
    numTimePoints = 0;
    if c == 4:
        spillZone = "RossL"
    if c == 5:
        spillZone = "RossR"
    if c==6:
        spillZone = "Ross1"
    if c == 7:
        spillZone = "Ross2"

    print>>fout, "var " + spillZone + " = ["

    for r in range(7, shtSpill.nrows):
        date_value = xlrd.xldate_as_tuple(shtSpill.cell(r,1).value,wrkSpill.datemode)
        date_value_DT = datetime(*date_value)
        
        if date_value_DT >= nowPST and numTimePoints < 192:
            dv_tuple = date_value_DT.timetuple()
            #months are from 0-11 in highcharts, so subract 1 from month value in date_value
            #to modify date tuple, date_value must be turned into a list
            dv_lst = list(dv_tuple)
            year = str(dv_lst[0])
            month = str(dv_lst[1]-1) ##hc format
            day = str(dv_lst[2])
            hour = str(dv_lst[3])
            minute = str(dv_lst[4])
            dataStamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtSpill.cell_value(r,c),2)) + "]"
            if numTimePoints < 191:
                dataStamp += ","
            print>>fout, dataStamp
            numTimePoints += 1
    print>>fout, "];"

#####station 117
##historic flow
try:
    print>>fout, "var sta117_histFlow = ["
    cur = con.cursor()
    sql = "Select * From s1467_rated Where T_TIME > DATE_ADD(now(),INTERVAL -2 DAY) ORDER BY T_TIME ASC"
    cur.execute(sql)
    results = cur.fetchall()
    result_count = cur.rowcount
    print result_count
    i = 0
    for row in results:
        date = row[0]
        year = str(date.year)
        month = str(date.month-1) ##-1 for js month formatting
        day = str(date.day)
        hour = str(date.hour)
        minute = str(date.minute)
        flowrate = str(row[1])
        datastamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+")," + flowrate + "]"
        if i<result_count-1:
            datastamp += ","
        print>>fout,datastamp
        i = i+1
    print>>fout,"];"
except mdb.Error, e:
    print "Error %d: %s" % (e.args[0],e.args[1])
    sys.exit(1)

#forecast/spill data sta117
#forecast and spill data are identical for WLL
c = 4
spillData = "var WLL = [";
fcData = "var sta117_fcFlow = ["
numTimePoints = 0; ##192 timepoints for 48 hour forecast
dataStamp=""
for r in range(7, shtFlow.nrows):
    ##date_value may used as x argument for highcharts plot
    ##get date from excel sheet
    date_value = xlrd.xldate_as_tuple(shtFlow.cell(r,1).value,wrkFlow.datemode)
    ##make python datetime object from excel date
    date_value_DT = datetime(*date_value)
    if date_value_DT >= nowPST and numTimePoints < 192:
        dv_tuple = date_value_DT.timetuple()
        #months are from 0-11 in highcharts, so subract 1 from month value in date_value
        #to modify date tuple, date_value must be turned into a list
        dv_lst = list(dv_tuple)
        year = str(dv_lst[0])
        month = str(dv_lst[1]-1) ##hc format
        day = str(dv_lst[2])
        hour = str(dv_lst[3])
        minute = str(dv_lst[4])
        dataStamp += "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtFlow.cell_value(r,c),2)) + "]"
        if numTimePoints < 191:
            dataStamp += ",\n"
        numTimePoints += 1
spillData += dataStamp + "];"
fcData += dataStamp + "];"
print>>fout, fcData
print>>fout, spillData

###sta112 SFQ

numheaderlines = 27
now = datetime.utcnow()
end_date = str(now.year) + "-" + str(now.month) + "-" + str(now.day)
begin_date = str(now.year) + "-" + str(now.month) + "-" + str(now.day-2)
url = "http://waterdata.usgs.gov/ca/nwis/uv?cb_00060=on&cb_00065=on&format=rdb&site_no=11164500&period=&begin_date=" + begin_date + "&end_date=" + end_date
res = urllib.urlopen(url)

print>>fout, "var sta112_histFlow = ["
##read past document header lines
for i in range(0, numheaderlines):
    res.readline()

##process each data row
linecount = 0;
for line in res:
    if linecount != 0:
        print>>fout, ","    
    a = re.split('\t',line)
    date = a[2]
    flow = a[4]
    t = time.strptime(date, "%Y-%m-%d %H:%M")
    timestamp =  t[0:6]
    dv_lst = list(timestamp)
    #subtract 1 from month
    dv_lst[1] = timestamp[1]-1
    #todo scan row to figure out if PDT or PST is used
    #if PDT is used subtract an hour from timestamp
    #subtract 1 from hour PDT->PST
    dv_lst[3] = dv_lst[3] - 1
    #turn list back into a tuple
    timestamp = tuple(dv_lst)
    print>>fout, "[Date.UTC"+ str(timestamp) + "," + flow + "]",
    linecount += 1
print>>fout, "];"

####sta 112 forecast data
####open excel workbook with  sta 112 forcasted flow data
wrkFlow = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGIS_Grid.xls")
shtFlow = wrkFlow.sheet_by_index(0)
###excel column with flow data
col_usgs = 5
###process flow data
print>>fout, "var sta112_fcFlow = ["
for r in range(7, shtFlow.nrows):
    #date_value may used as x argument for highcharts plot
    date_value = xlrd.xldate_as_tuple(shtFlow.cell(r,1).value,wrkFlow.datemode)
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

####station 112 spill
wrkSpill = xlrd.open_workbook(r"C:\xampp\htdocs\scvwd\app_beta_ALERTC_config\ff\assets\py\ToGISSpillFlow_GRID.xls")
shtSpill = wrkSpill.sheet_by_index(0)
##column values for spill data
middlefieldR_c = 2
middlefieldL_c = 3
pc_R = 4
pc_L = 5
ds101R_c = 6
ds101L_c = 7

for c in range(2, 8):
    numTimePoints = 0;
    if c == 2:
        spillZone = "MiddlefieldR"
    if c == 3:
        spillZone = "MiddlefieldL"
    if c == 4:
        spillZone = "PopeChaucerR"
    if c == 5:
        spillZone = "PopeChaucerL"
    if c == 6:
        spillZone = "DS101R"
    if c == 7:
        spillZone = "DS101L"
        
    print>>fout, "var " + spillZone + " = ["

    for r in range(7, shtSpill.nrows):
        date_value = xlrd.xldate_as_tuple(shtSpill.cell(r,1).value,wrkSpill.datemode)
        date_value_DT = datetime(*date_value)
        
##        if date_value_DT >= nowPST and numTimePoints < 192:
        dv_tuple = date_value_DT.timetuple()
        #months are from 0-11 in highcharts, so subract 1 from month value in date_value
        #to modify date tuple, date_value must be turned into a list
        dv_lst = list(dv_tuple)
        year = str(dv_lst[0])
        month = str(dv_lst[1]-1) ##hc format
        day = str(dv_lst[2])
        hour = str(dv_lst[3])
        minute = str(dv_lst[4])
        dataStamp = "[Date.UTC("+year+","+month+","+day+","+hour+","+minute+"), " + str(round(shtSpill.cell_value(r,c),2)) + "]"
        if r < shtFlow.nrows-1:
            dataStamp += ","
        print>>fout, dataStamp
        numTimePoints += 1
    print>>fout, "];"
fout.close()
con.close()
