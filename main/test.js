const colorRotation = ['#f3f3ff', '#F5FFFC']; // Define your color rotation
const colorRotation_deco = ['#8488FF', '#20CA9A']; // Define your color rotation
// "#FFEEEF"
// "#F3557C"
document.addEventListener('DOMContentLoaded', function() {
    function get_reserv_element() {
        fetch('http://127.0.0.1:8000/USspace/?id=202355663&pw=**cse202355663')
            .then(response => response.json())  
            .then(data => {
                // Remove existing reservation elements
                document.querySelectorAll('.reservation_element').forEach(el => el.remove());
    
                // Process the data and create reservation elements
                data.forEach((item, index) => {
                    try { 
                        console.log(index)
                        const roomID = getRoomID(item.name);
                        const today = new Date();
                        if (item.order !== 0) {
        
                            const res_startTime = item.startTime;
                            const res_start_hour = parseInt(res_startTime.substr(0, 2));
                            const res_start_min = parseInt(res_startTime.substr(3, 5));
                            const res_endTime = item.endTime;

                            const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(item.startTime.substr(0, 2)), parseInt(item.startTime.substr(3, 5)));
                            const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(item.endTime.substr(0, 2)), parseInt(item.endTime.substr(3, 5))); 
                            const diffInMinutes = (end - start) / (1000 * 60);
                            console.log(today);
                            console.log(start);
                            console.log(end);

                            const height = diffInMinutes * (3/5);
                            const top = (res_start_hour - 9) * (36) + res_start_min * (3/5);
        
                            // Determine color based on the color rotation array
                            const color = colorRotation[index % colorRotation.length];
                            const color_deco = colorRotation_deco[index % colorRotation.length];
                            
                            // Create reservation element
                           // Create reservation element
                            const reservationElementDeco = document.createElement('div');
                            reservationElementDeco.classList.add('reservation_element_deco');
                            reservationElementDeco.style.cssText = `
                                left: 1%;
                                width: 2%;
                                position: absolute;
                                border-radius: 4px 0px 0px 4px;
                                top: ${top}px;
                                height: ${height}px;
                                background: ${color_deco}; /* Conflict check */
                                z-index: ${1}; /* Conflict check */
                            `;
                            const reservationElement = document.createElement('div');
                            reservationElement.classList.add('reservation_element');
                            reservationElement.id = item.order; // Use order as the id
                            reservationElement.style.cssText = `
                                left: 3%;
                                width: 97%;
                                position: absolute;
                                text-align: left;
                                font-size: 13px;
                                padding: 5px;
                                overflow: hidden;
                                top: ${top}px;
                                height: ${height}px;
                                background: ${color}; /* Conflict check */
                                z-index: ${1}; /* Conflict check */
                            `;

                            
                           // 예약 정보 작성
                         
                            reservationElement.innerHTML = `
                                ${diffInMinutes <= 60 ?
                                    `<p class="roboto-thin">${item.title.length > 12 ? item.title.slice(0, 12) + '...' : item.title} - ${item.startTime} ~ ${item.endTime}</p>` :
                                    diffInMinutes <= 90 ?
                                        `<p class="roboto-thin">${item.title.length > 12 ? item.title.slice(0, 12) + '...' : item.title} - ${item.startTime} ~ ${item.endTime}</p>` :
                                        `<p class="roboto-thin">${item.title}</p>
                                        <p>${item.startTime} ~ ${item.endTime}</p>`
                                }
                                ${diffInMinutes > 60 ? `<p class="roboto-thin">${item.content.length > 20 ? item.content.slice(0, 20) + '...' : item.content}</p>` : ''}
                            `;
                            

                       
                       



                        
        
                            // Append reservation element to the room
                            document.getElementById(roomID).appendChild(reservationElement);
                            document.getElementById(roomID).appendChild(reservationElementDeco);

                            if (today >= start && today <= end) {
                                console.log(`case1 : Room ${item.name} is currently in use.`);
                                stateCSS(`state_${roomID}`, "occupied", today, start, end);
                            } else {
                                
                                console.log(`case2 : Room ${item.name} is available for reservation.`);
                                stateCSS(`state_${roomID}`, 'available', today, start, end);
                            }
                            
                            if ( 0 < today - end && today - end < 60000) {
                                
                                setTimeout(function(){
                                    location.reload(true);
                                    console.log("시간이 같아요");
                                }, 30000);
                            }
                            console.log(today - end);

                        }
                        else {
                            console.log(`case3 : Room ${item.name} is available for reservation.`);
                            stateCSS(`state_${roomID}`, 'available', today);
                        }
                    }
                    catch(err) {
                        console.log(err)
                    }  
                });
            })
            .catch(error => console.error('Error fetching data:', error));
        }
    function getRoomID(roomName) {
        // Map room names to corresponding IDs
        const roomMap = {
            '동아리실A': 'roomA',
            '동아리실B': 'roomB',
            '회의실A': 'meeting_roomA',
            '회의실B': 'meeting_roomB'
        };
        return roomMap[roomName] || '';
    }

    weeks = {
        1: "월",
        2: "화",
        3: "수",
        4: "목",
        5: "금",
        6: "토",
        7: "일"
    }
    function updateClock() {
        const today = new Date();
        const year = today.getFullYear(); // 년도
        const month = today.getMonth() + 1;  // 월
        const date = today.getDate();  // 날짜
        const week = today.getDay();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        const time = `${year}.${month < 10 ? '0' : ''}${month}.${date < 10 ? '0' : ''}${date} ${hours < 10 ? '0' : ''}(${weeks[week]}) ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // 현재 시각 update
        const now_time = document.getElementById('clock_time');
        if (now_time) {
            now_time.innerText = `${time}`;
        }
        hour_bg_color(hours)
        return today;
        
    }

    // 현재 시각의 row에 bg color 지정하기
    function hour_bg_color(hours) {
        var time_bg_color = document.getElementsByClassName('time_division');

        
        for(var i = 0; i < time_bg_color.length; i++) {
            time_bg_color[i].style.backgroundColor = '';
        }   
        
        const now_bg_color = document.getElementById(`h${hours}`);
        if (hours == parseInt(now_bg_color.id.slice(1))) {
            now_bg_color.style.backgroundColor = 'rgba(233, 181, 255, 0.271)';
        }
    }

    // 시간이 겹칠 때
    function overlab_time() {
// start Time, end Time 1
// start Time, end Time 2
// 겹치면 - > order가 더 큰 것을 빨간색으로 변하게 만들기 content : 

    }
    // 사용중과 예약가능 state의 css 선택
    function stateCSS(id, status, today, startDateTime, endDateTime) {
        const element = document.getElementById(id);
        const element_class = element.className;
        console.log("element_class :", element_class);
        if (element_class !== "state occupied"){
            if (status === "occupied") {
                // Set styles for 'in-use'
                console.log("occupied");
                element.innerHTML = "사용중"
                element.className = "state occupied";
            } else {
                // Set styles for 'available'
                console.log("available");
                element.innerHTML = "예약가능"
                element.className = "state available";
            }
        }
        console.log(element);
    }

    function fecth_notice_cse() {
        fetch('http://127.0.0.1:8000/CSE/')
            .then(response => response.json())
            .then(data => {
                const noticeList = document.getElementById('notice_cse');
                for (let i = 0; i < 5; i++) {
                    const content = document.createElement('li');
                    content.textContent = data[i].title;
                    noticeList.appendChild(content);
                }
            }
        )
        .catch(error => console.error('Error fetching data:', error));
    }

    function fecth_notice_selon() {
        fetch('noticeSELON.json')
            .then(response => response.json())
            .then(data => {
                const noticeList = document.getElementById('notice_selon');
                for (let i = 0; i < 5; i++) {
                    const content = document.createElement('li');
                    content.textContent = data[i].title;
                    noticeList.appendChild(content);
                }
            }
        )
        .catch(error => console.error('Error fetching data:', error));
    }
    // Initial load
    get_reserv_element();
    updateClock();
    fecth_notice_cse();
    fecth_notice_selon();

    setInterval(get_reserv_element, 60000);
    setInterval(updateClock, 700);
});

