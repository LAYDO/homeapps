import psycopg2

conn = psycopg2.connect(database="db-homeapps",
                        user='db-homeapps', password='AVNS_kpxHjdjfUrcAUAXdtXS', 
                        host='app-d5b8f5dc-2445-442e-8922-2f65c211bcb1-do-user-12113309-0.b.db.ondigitalocean.com', port='25060'
)

conn.autocommit = True
cursor = conn.cursor()

# sql0 = '''DROP TABLE allergies;'''

# cursor.execute(sql0)

sql = '''CREATE TABLE allergies(id serial primary key, level int, category varchar(20), food varchar(50));'''

cursor.execute(sql)


with open('/home/laydo/homeapps/allergies/test1.csv', 'rb') as this_file:
    sql2 = '''COPY allergies(level, category, food) FROM STDIN WITH CSV HEADER;'''
    cursor.copy_expert(sql2, this_file)

sql4 = '''CREATE INDEX allergies_food on allergies(food);'''
cursor.execute(sql4)

sql3 = '''SELECT * FROM allergies LIMIT 10;'''
cursor.execute(sql3)
for i in cursor.fetchall():
    print(i)
    
conn.commit()
conn.close()