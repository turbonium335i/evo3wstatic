# i = 1
# rayBox = []

# for x in range(45):
#     print('"{0}":"C",'.format(x))


cities = "Seoul, Busan, Daegu, Incheon, Gwangju, Daejeon, Ulsan, Sejong, Gyeonggi-do, Gangwon-do, Chungcheongbuk-do, Chungcheongnam-do, Jeollabuk-do, Jeollanam-do, Gyeongsangbuk-do, Gyeongsangnam-do, Jeju-do"

chunks = cities.split(',')

print(chunks)

citylist =['Seoul', ' Busan', ' Daegu', ' Incheon', ' Gwangju', ' Daejeon', ' Ulsan', ' Sejong', ' Gyeonggi-do', ' Gangwon-do', ' Chungcheongbuk-do', ' Chungcheongnam-do', ' Jeollabuk-do', ' Jeollanam-do', ' Gyeongsangbuk-do', ' Gyeongsangnam-do', ' Jeju-do']

for c in citylist:
    a = tuple(c, c)
    print(a)