// async function fetchApiData() {
//     const apiUrl = 'USspace.json';
    
//     try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();
//         document.querySelectorAll('.reservation_element').forEach(el => el.remove());

        
//         insertDataIntoHTML(data)
//         // Insert data into HTML
       
//     } catch (error) {
//         console.error('Fetching API data failed:', error);
//         document.getElementsByClassName('reservation_element').innerText = 'Error loading API data.';
//     }
// }
// function createReservationElement(reservation) {
//     return `
//     <div class="reservation_element" id="${reservation.order}">
//         <p><strong>Name:</strong> ${reservation.name}</p>
//         <p><strong>Order:</strong> ${reservation.order}</p>
//         <p><strong>Title:</strong> ${reservation.title}</p>
//         <p><strong>StartTime:</strong> ${reservation.startTime}</p>
//         <p><strong>EndTime:</strong> ${reservation.endTime}</p>
//         <p><strong>Content:</strong> ${reservation.content}</p>
//     </div>
// `;
// }
// function insertDataIntoHTML(data) {
//     data.forEach(reservation => {
//         const elementId = reservation.name.toLowerCase().replace(/\s+/g, '');
//         const reservationElement = createReservationElement(reservation);
//         document.getElementById(elementId).innerHTML += reservationElement;
//     });
// }


// function reloadData() {
//     // 예약 정보를 받아올 API 또는 데이터 소스의 URL
//     const dataURL = "your_data_api_url_here";

//     // AJAX 또는 Fetch를 사용하여 데이터를 가져오는 비동기 요청
//     fetch(dataURL)
//         .then(response => response.json())
//         .then(data => {
//             // 기존에 생성된 div 태그 삭제
//             document.querySelectorAll('.reservation_element').forEach(el => el.remove());
//             // 새로운 데이터로 HTML 업데이트
//             insertDataIntoHTML(data);
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }
// initialData = [
   
// ]
// insertDataIntoHTML(initialData);

// // 30초마다 데이터 리로딩
// setInterval(reloadData, 30000);

// // 페이지가 로드될 때 API 데이터를 가져오고, 5초마다 반복하여 실행합니다.
// // window.onload = function() {
// //     fetchApiData();
// //     setInterval(fetchApiData, 30000); // 5초(5000밀리초)마다 fetchApiData를 실행합니다.
// // };

document.addEventListener('DOMContentLoaded', function() {
    function fetch_data() {
        const colorRotation = ['#f3f3ff', '#F5FFFC']; // Define your color rotation
        const colorRotation_deco = ['#8488FF', '#20CA9A']; // Define your color rotation
    
        // Fetch data from the JSON file (Assuming you are using fetch API)
        fetch('USspace.json')
            .then(response => response.json())
            .then(data => {
                // Remove existing reservation elements
                document.querySelectorAll('.reservation_element').forEach(el => el.remove());
    
                // Process the data and create reservation elements
                data.forEach((item, index) => {
                    if (item.order !== 0) {
                        const roomID = getRoomID(item.name);
                        // const reservationElementCount = document.querySelectorAll(`#${roomID} .reservation_element`).length + 1;
                        const startTime = item.startTime;
                        const start_hour = parseInt(startTime.substr(0, 2));
                        const start_min = parseInt(startTime.substr(3, 5));
                        const endTime = item.endTime;

                        const start = new Date(`2024-11-01T${startTime}`);
                        const end = new Date(`2024-11-01T${endTime}`);
                        const diffInMinutes = (end - start) / (1000 * 60);

                        const height = diffInMinutes * (3/5);
                        const top = (start_hour - 9) * (36) + start_min * (3/5);
    
                        // Determine color based on the color rotation array
                        const color = colorRotation[index % colorRotation.length];
                        const color_deco = colorRotation_deco[index % colorRotation.length];
    
                        
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
                            background: ${color_deco};
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
                            background: ${color};
                        `;
    
                        reservationElement.innerHTML = `
                            <p>${item.title}</p>
                            <p>${item.startTime} ~ ${item.endTime}</p>
                            <p>${item.content}</p>
                        `;
    
                        // Append reservation element to the room
                        document.getElementById(roomID).appendChild(reservationElement);
                        document.getElementById(roomID).appendChild(reservationElementDeco);
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));

            
        }
    function getRoomID(roomName) {
        // Map room names to corresponding IDs
        const roomMap = {
            '동아리방A': 'roomA',
            '동아리방B': 'roomB',
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

        // Format the time as HH:MM:SS
        const time = `${year}.${month < 10 ? '0' : ''}${month}.${date < 10 ? '0' : ''}${date} ${hours < 10 ? '0' : ''}(${weeks[week]}) ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // 현재 시각 update
        const now_time = document.getElementById('clock_time');
        if (now_time) {
            now_time.innerText = `${time}`;
            
        }

        // 현재 시각의 row에 bg color 지정하기
        const now_color = document.getElementById(`h${hours}`);
        if (now_color) {
            now_color.style.backgroundColor = 'rgba(233, 181, 255, 0.271';
        }
        
   
    }
    function Reservation_available() {
        const now = new Date();
        
        // Fetch data from the JSON file (Assuming you are using fetch API)
        fetch('USspace.json')
            .then(response => response.json())
            .then(data => {
                data.forEach((item, index) => {
                    try { 
                        
                        console.log(index)
                        const roomID = getRoomID(item.name);
                        if (item.order !== 0) {
                            
                            const today = new Date();
                            const startDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(item.startTime.substr(0, 2)), parseInt(item.startTime.substr(3, 5)));
                            const endDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(item.endTime.substr(0, 2)), parseInt(item.endTime.substr(3, 5))); 
                            // Check if the current time is within the reservation period
                            if (now >= startDateTime && now <= endDateTime) {
                                // The room is currently in use
                                console.log(`1 Room ${item.name} is currently in use.`);
                                stateCSS(`state_${roomID}`, 'occupied');

                            } else {
                                // The room is available for reservation
                                console.log(`2 Room ${item.name} is available for reservation.`);
                                stateCSS(`state_${roomID}`, 'available');
                            }
                        }
                        else {
                            console.log(`3 Room ${item.name} is available for reservation.`);
                            stateCSS(`state_${roomID}`, 'available');
                        }
                    }
                    catch(err) {
                        console.log(err)
                    }
                
                    
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    function stateCSS(id, status) {
        const element = document.getElementById(id);
        const element_class = document.getElementById(id).className;
        console.log(element_class);
        if (element_class !== "state occupied"){
            if (status === 'occupied') {
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
            console.log(element);
        }
    }

    function fecth_notice_cse() {
        fetch('noticeCSE.json')
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
    fetch_data();
    updateClock();
    Reservation_available();
    fecth_notice_cse();
    fecth_notice_selon();

    setInterval(fetch_data, 600000);
    setInterval(updateClock, 100);
    setInterval(Reservation_available, 5000);
});