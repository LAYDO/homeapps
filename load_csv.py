import psycopg2

conn = psycopg2.connect(database="homeapps",
                        user='laydo', password='drew758Met340^', 
                        host='localhost', port=''
)

conn.autocommit = True
cursor = conn.cursor()

sql0 = '''DROP TABLE rplace_tile;'''

cursor.execute(sql0)

sql = '''CREATE TABLE rplace_tile(id serial primary key, timestamp timestamp, user_id varchar(88), pixel_color varchar(7), coordinate varchar(21));'''

cursor.execute(sql)


with open('/home/laydo/homeapps/rplace/data/2022_place_canvas_history.csv', 'rb') as this_file:
    sql2 = '''COPY rplace_tile(timestamp, user_id, pixel_color, coordinate) FROM STDIN WITH CSV HEADER;'''
    cursor.copy_expert(sql2, this_file)

sql4 = '''CREATE INDEX rplace_timestamp on rplace_tile(timestamp);'''
cursor.execute(sql4)

sql3 = '''SELECT * FROM rplace_tile LIMIT 10;'''
cursor.execute(sql3)
for i in cursor.fetchall():
    print(i)
    
conn.commit()
conn.close()

# timestamp -   UTC time of tile placement                  date
# user_id -     hashed id of each user placing a tile       varchar(88)
# pixel_color - the hex code of the tile placed             varchar(7)
# coordinate - "x,y" (0,0 1999,1999)                        varchar(21)



# ALGO FOR SORTING LARGE DATA QUERIES


# current_max_id = RplaceTile.objects.latest('id').id
# current_min_id = RplaceTile.objects.earliest('id').id

# working_id = current_min_id

# to_loop = range(current_min_id, current_max_id, 10000000)

# print(r_start + duration)
# for count, item in enumerate(to_loop):
#     if count > 0:
#        # Do something here
#         tiles = list(RplaceTile.objects.filter(timestamp__gte=r_start,timestamp__lt=r_start + duration).all().values()) # id__gte=working_id,id__lt=item,
#         if (len(tiles) > 0):
#             print(tiles)
#             temp.append(tiles)
#         # update the global min so that the query above cycles in chunks
#         working_id += 10000000