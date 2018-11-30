import requests
from lxml.html import parse
from io import StringIO
import os, sys
from urllib.request import urlopen 

keyword = sys.argv[1]
url = 'https://www.google.co.kr/search?q='+keyword+'&source=lnms&tbm=isch&sa=X&ved=0ahUKEwic-taB9IXVAhWDHpQKHXOjC14Q_AUIBigB&biw=1842&bih=990'

html = requests.get(url, headers={'user-agent': ':Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'}).text

html_source = StringIO(html)
html_parse = parse(html_source)

doc = html_parse.getroot()


imgs = doc.findall('.//img')

img_list = []
for element in imgs:
    if element.get('data-src') is not None:
        img_list.append(element.get('data-src'))

def downloadImage(url_list, count):
    location = "./public/download_img/search_img/"
    img = urlopen(url_list)
    imgFile = open(location + keyword + '_' + str(count) + '.jpg', 'wb')
    imgFile.write(img.read())
    imgFile.close()


count = 1
for img in img_list:
    downloadImage(img, count)
    print(count)
    count = count + 1

