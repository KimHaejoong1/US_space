import requests
from bs4 import BeautifulSoup
from json import dumps


def get_CSE_notice():
    #학과 공지사항 파싱
    url = 'https://cse.pusan.ac.kr/cse/14651/subview.do'
    response = requests.get(url)

    notice_data = []
    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        tr = soup.find_all('tr')

        # 중요공지 1개와 최근 공지사항 처리
        filtered_rows = [tr[1]]
        for row in tr:
            td_num = row.find('td', class_='_artclTdNum')
            if td_num and not td_num.find('span', class_='_artclNotice _artclNnotice'):
                filtered_rows.append(row)

        #필터링된 공지사항 처리
        for content in filtered_rows:
            title = content.find('strong').get_text()
            notice = {
                "title" : title,
                "new" : bool(content.find(class_='newArtcl'))
            }
            notice_data.append(notice)

    else:
        print(f'Error: {response.status_code}')

    return notice_data

if __name__ == '__main__':
    print(get_CSE_notice())