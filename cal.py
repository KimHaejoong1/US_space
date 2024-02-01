from calendar import monthrange
from time import localtime

def get_index(): # 주 인덱스, 요일 인덱스 반환
    current = localtime()
    y = current.tm_year
    m = current.tm_mon
    d = current.tm_mday

    # calendar.monthrange를 사용하여 해당 달의 첫 번째 요일과 일수를 구함
    first_weekday, days_in_month = monthrange(y, m)

    # 주 인덱스와 요일 인덱스 계산
    # 첫 번째 요일로부터 오늘까지의 총 일수 계산
    total_days = first_weekday + d
    # 주 인덱스는 총 일수를 7로 나눈 몫
    week_index = total_days // 7 + 1
    # 요일 인덱스는 총 일수를 7로 나눈 나머지
    day_index = total_days % 7 + 1

    return week_index, day_index

if __name__ == '__main__':
    print(get_index())
