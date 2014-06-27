#!C:/Python27/python.exe 

#import mysql
#import MySQLdb

import xlrd
from xlrd import open_workbook,xldate_as_tuple
import re
# # import arcgisscripting, sys, fileinput, os, string
import sys, fileinput, os, string
from datetime import datetime


#wrk = xlrd.open_workbook(r"Y:\Upper_Guad_RAS_Model\ToGIS.xls")
wrk = xlrd.open_workbook(r"ToGIS.xls")

sht = wrk.sheet_by_index(0)

def reformat (date_value):
	if (date_value < 10):
		return "0"+str(date_value)
	else:
		return date_value
	    
month = {1:'Jan', 2:'Feb', 3:'Mar', 4:'Apr', 5:'May', 6:'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}

#Newfolder  = str(datetime.now().strftime('%Y'))+"-"+str(int(datetime.now().strftime('%m')))+"-"+str(datetime.now().strftime('%d'))+"-"+str(datetime.now().strftime('%H'))
#os.chdir("c://Upper_Guad_RAS_Model")
#if not os.path.exists(Newfolder): os.makedirs(Newfolder)

datetimestamp_temp = []
flow_temp =[]

for c in range(2, sht.ncols):
    flname =  sht.cell_value(1,c)
    print sht.cell_value(1,c)
    if "SF5093" in sht.cell_value(1,c):
            flname =  "93"
    
    if flname == "CI Z ROSS GAGE 51 @CHERRY":
            flname =  "51"
	
    flname = re.sub('[^a-zA-Z0-9\n\.]',"",flname)
    #fout = open(r"z:\\"+flname+".js","w")
    fout = open(r""+flname+".js","w")
#    fout1 = open(r"c:\\Upper_Guad_RAS_Model\\"+Newfolder+"\\"+flname+".js","w")
    
    print>>fout, "var FlowAndTime = ["
#    print>>fout1, "var FlowAndTime = ["
    for r in range(7, sht.nrows-1):
        date_value =xldate_as_tuple(sht.cell(r,1).value,wrk.datemode)
        mon = str(date_value[1])
        day = str(reformat(date_value[2]))
        yer = str(date_value[0])
        datetimestamp_temp.append(" ")
        hour = str(reformat(date_value[3]))
        minute = str(reformat(date_value[4]))
        #print yer[2:4], yer[0:4]
        datetimestamp = "{\"y\":"+str(round(sht.cell_value(r,c),2))+","+"\"x\":\""+mon+"/"+day+"/"+yer[0:4]+" "+hour+":"+minute+"\"},"
        print>>fout, datetimestamp
#        print>>fout1, datetimestamp
        #print r, datetimestamp
        #print>>fout, "{","\"y\":","\"", round(sht.cell_value(r,c),2), "\"", ",", "\"x\":", "\"", datetimestamp,"\"}"
    
    date_value =xldate_as_tuple(sht.cell(r+1,1).value,wrk.datemode)
    mon = str(date_value[1])
    day = str(reformat(date_value[2]))
    yer = str(date_value[0])
    datetimestamp_temp.append(" ")
    hour = str(reformat(date_value[3]))
    minute = str(reformat(date_value[4]))
    datetimestamp = "{\"y\":"+str(round(sht.cell_value(r,c),2))+","+"\"x\":\""+mon+"/"+day+"/"+yer[0:4]+" "+hour+":"+minute+"\"}"
    print>>fout, datetimestamp
#    print>>fout1, datetimestamp
    #print r, datetimestamp

    print>>fout, "]"		
#    print>>fout1, "]"


# # Open database connection
# db = MySQLdb.connect("127.0.0.1","root","DiamondIce","TESTDB" )

# # prepare a cursor object using cursor() method
# cursor = db.cursor()

# # execute SQL query using execute() method.
# cursor.execute("SELECT VERSION()")

# # Fetch a single row using fetchone() method.
# data = cursor.fetchone()

# print "Database version : %s " % data

# # disconnect from server
# db.close()
		
	
