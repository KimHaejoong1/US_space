from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from time import sleep

def get_SELON_notice():
    #usb_descriptir error 해결
    options = webdriver.ChromeOptions()
    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    #크롬 드라이버 생성
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(3)
    
    #노션 접속하기
    driver.get(url = 'https://pnucse2024.notion.site/pnucse2024/5df7c0d47d984f569928f8e98a05a7f7?v=169c894696944fd8b4a6daa2a10c177e')
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="notion-app"]/div/div[1]/div/div[1]/main/div/div/div[5]/div/div/div[1]/div[3]/div[2]')))
    
    #학생회 공지사항 처리
    notice_data = []
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    
    #부모 div 찾기
    parent_div = soup.find_all('div', class_="notion-selectable notion-page-block notion-collection-item")

    if parent_div:
        for div in parent_div[0:7]:
            notice = {
                "title" : div.find_all('span')[0].get_text(),
                "type" : div.find_all('span')[1].get_text(),
                "status" : div.find_all('span')[2].get_text(), 
            }
            notice_data.append(notice)

    return notice_data

if __name__ == '__main__':
    print(get_SELON_notice())