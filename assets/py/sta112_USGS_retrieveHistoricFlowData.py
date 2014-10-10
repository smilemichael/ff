import sgmllib
import urllib, sgmllib
import sys, fileinput, os, string
from datetime import date,datetime
import time
import re

path = "C:\\xampp\\htdocs\\scvwd\\app_beta_ALERTC_config\\ff\\assets\\py\\"
filename = "sta112_histFlowTimeSeries.js"
fullpath = path + filename

numheaderlines = 27
now = datetime.utcnow()
print now.day
end_date = str(now.year) + "-" + str(now.month) + "-" + str(now.day)
begin_date = str(now.year) + "-" + str(now.month) + "-" + str(now.day-2)
url = "http://waterdata.usgs.gov/ca/nwis/uv?cb_00060=on&cb_00065=on&format=rdb&site_no=11164500&period=&begin_date=" + begin_date + "&end_date=" + end_date
res = urllib.urlopen(url)

fout = open(fullpath, 'w');
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
##    print a
    date = a[2]
    flow = a[4]
##    print flow
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
fout.close()

