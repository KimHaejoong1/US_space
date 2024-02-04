from tableList import get_tableList
from cal import get_index
from noticeCSE import get_CSE_notice
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from json import dumps

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인에서의 접근을 허용합니다. 실제 운영 환경에서는 필요한 도메인만 명시하세요.
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드를 허용합니다.
    allow_headers=["*"],  # 모든 HTTP 헤더를 허용합니다.
)

@app.get("/USspace/")
def get_json(id: str,pw: str):
    loc = {'동아리실A':'14676',
           '동아리실B':'14677',
           '회의실A':'14678',
           '회의실B':'49497'}
    try:
        week_index, day_index = get_index()
        list_data = get_tableList(id,pw,week_index,day_index,loc)
    except HTTPException as e:
        raise HTTPException(status_code=500,detail=str(e))
    
    return list_data

@app.get("/CSE/")
def get_CSE():
    try:
        CSE_data = get_CSE_notice()
    except HTTPException as e:
        raise HTTPException(status_code=500,detail=str(e))
    
    return CSE_data

if __name__ == '__main__':
    choice = int(input("1 예약현황 불러오기\n2 학과 공지사항 불러오기\n: "))
    if choice == 1:
        loc = {'동아리실A':'14676',
               '동아리실B':'14677',
                '회의실A':'14678',
                '회의실B':'49497'}
        ID = input("ID: ")
        PW = input("PW: ")
        week_index, day_index = get_index()
        list_data = get_tableList(ID,PW,week_index,day_index,loc)
        json_data = dumps(list_data, indent=4,ensure_ascii=False)
        with open('USspace.json','w',encoding='utf-8') as file:
            file.write(json_data)
    elif choice == 2:
        notice_data = get_CSE_notice()
        json_data = dumps(notice_data, indent=4,ensure_ascii=False)
        with open('noticeCSE.json','w',encoding='utf-8') as file:
            file.write(str(json_data))