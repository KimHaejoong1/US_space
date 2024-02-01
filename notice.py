#학과 공지사항
import requests
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
url = "https://cse.pusan.ac.kr/cse/14651/subview.do"
res = requests.get(url)
res.raise_for_status()
soup = BeautifulSoup(res.text,"lxml")

f = open("notice.txt","w",encoding = 'utf-8')

articles = soup.find_all("td",attrs={"class":"_artclTdTitle"})
for article in articles:
    if (article.find_previous_sibling("td").get_text().isdigit()):
        dict = {}
        title = article.strong.get_text()
        date = article.find_next_sibling("td").find_next_sibling("td").get_text()
        f.write( date + "," + title + "\n")

f.close()