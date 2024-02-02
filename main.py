from tableList import get_tableList
from cal import get_index
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

@app.get("/")
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

if __name__ == '__main__':
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