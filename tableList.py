from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from time import sleep

def get_tableList(ID,PW,week,day,space):
    meeting_info_list = []

    #usb_descriptir error 해결
    options = webdriver.ChromeOptions()
    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    #창 자동 꺼짐 방지
    options.add_experimental_option("detach", True)
    #크롬 드라이버 생성
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(3)

    #사이트 접속하기
    driver.get(url='https://cse.pusan.ac.kr/cse/14680/subview.do?enc=Zm5jdDF8QEB8JTJGc3ViTG9naW4lMkZjc2UlMkZ2aWV3LmRvJTNG')
    driver.maximize_window()

    #로그인
    driver.find_element(By.XPATH,'//*[@id="userId"]').send_keys(ID)
    driver.find_element(By.XPATH,'//*[@id="userPwd"]').send_keys(PW)
    driver.find_element(By.XPATH,'//*[@id="_UlgnS_basic"]/form/div/input').click()
    
    for room, room_code in space.items():
        driver.get(url=f'https://cse.pusan.ac.kr/cse/{room_code}/subview.do')

        #오늘 날짜 클릭
        driver.find_element(By.XPATH, f'//*[@id="schdulWrap"]/table/tbody/tr[{week}]/td[{day}]/a').click()

        try: 
            table_list = driver.find_element(By.XPATH, '//*[@id="timeTableList"]')
        except NoSuchElementException:
            table_list = None

        print(room,end="\n\n")

        if table_list is not None:
            #예약이 있을때
            lis_count = len(table_list.find_elements(By.TAG_NAME, 'li'))

            for i in range(lis_count):
                t = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="timeTableList"]')))
                li = WebDriverWait(t, 10).until(EC.presence_of_all_elements_located((By.TAG_NAME, 'li')))[i]

                #리스트 클릭
                WebDriverWait(li, 10).until(EC.element_to_be_clickable((By.TAG_NAME, 'a'))).click()
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="layer_planner"]/table')))
                sleep(1) #사이트의 팝업에 있는 문제 우회

                liTitle   = driver.find_element(By.XPATH,'//*[@id="layer_planner"]/table/tbody/tr[1]/td').text
                liTime    = driver.find_element(By.XPATH,'//*[@id="layer_planner"]/table/tbody/tr[2]/td').text
                liContent = driver.find_element(By.XPATH,'//*[@id="layer_planner"]/table/tbody/tr[3]/td').text
                print(f'Title\t: {liTitle}')
                print(f'Time\t: {liTime}')
                print(f'Content\t: {liContent}')
                print('\n- - - - - - - - - - - - - - - - - - - - - - - - - -\n')

                meeting_info = {
                    "name" : room,
                    "title" : liTitle,
                    "time" : liTime,
                    "content" : liContent
                }
                meeting_info_list.append(meeting_info)
    
                li.find_element(By.XPATH,'//*[@id="layer_planner"]/button').click()
        else:
            #예약이 없을 때
            print('no data')
            print('\n- - - - - - - - - - - - - - - - - - - - - - - - - -\n')
            meeting_info = {
                "name" : room,
                "title" : '0',
                "time" : '0',
                "content" : '0'
            }
            meeting_info_list.append(meeting_info)

    return meeting_info_list

if __name__ == '__main__':
    week_index = 1
    day_index = 5
    ID = input("ID: ")
    PW = input("PW: ")
    get_tableList(ID,PW,week_index,day_index,{'동아리실A':'14676'})
    