import pandas as pd
import requests
import urllib.request
import time
from bs4 import BeautifulSoup

url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSc_2y5N0I67wDU38DjDh35IZSIS30rQf7_NYZhtYYGU1jJYT6_kDx4YpF-qw0LSlGsBYP8pqM_a1Pd/pubhtml#'
response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")


menu_list = soup.find("ul", {"id": "sheet-menu"})
aaa = menu_list.findAll("a")
sheet_names = []
for aa in aaa:
    sheet_names.append(aa.text)


tables = soup.findAll('table')
print(len(tables))

count = 0
for table in tables:
    rows = table.findAll("tr")
    rdata = []
    for tr in rows[1:]:
        td = tr.findAll("td")
        row = [tr.text for tr in td]
        rdata.append(row)
    df = pd.DataFrame(rdata)
    df.to_csv("data/{}.csv".format(sheet_names[count]))
    count += 1
    print("{} saved".format(count))
