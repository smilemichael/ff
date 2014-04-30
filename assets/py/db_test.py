#!C:/Python27/python.exe 

import MySQLdb

# Open database connection
db = MySQLdb.connect("127.0.0.1","root","DiamondIce","TESTDB" )

# prepare a cursor object using cursor() method
cursor = db.cursor()

# execute SQL query using execute() method.
cursor.execute("SELECT VERSION()")

# Fetch a single row using fetchone() method.
data = cursor.fetchone()

print "Database version : %s " % data

# disconnect from server
db.close()
