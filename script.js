// 1. ค่าเริ่มต้น (เทียบเท่า DEFAULT_SETTINGS ใน Python)
const DEFAULT_SETTINGS = {
    budget: 9000,
    water_units_default: 10,
    electric_units_default: 100,
    laundry_times_default: 4,
    weights: {
        price: 10, water_cost: 8, electric_cost: 8, mrt_distance: 9,
        safety: 10, convenience: 9, laundry: 8, room_type: 10,
        elevator: 9, appliances: 10, water_heater: 8, aircon: 9,
        cooking: 10, workspace: 10, room_size: 8, review: 7,
        lighting: 3, contract: 7
    }
};

// 2. ฟังก์ชันคำนวณคะแนนแต่ละเกณฑ์ (เทียบเท่า calculate_score)
function calculateScore(roomData, weights) {
    let scores = {};
    
    // 1. ราคาห้อง
    let price = parseFloat(roomData.price || 0);
    scores['price'] = Math.max(0, (10000 - price) / 1000);
    
    // 2. ค่าน้ำ
    let waterCost = parseFloat(roomData.water_cost || 0);
    scores['water_cost'] = Math.max(0, (25 - waterCost) / 5);
    
    // 3. ค่าไฟ
    let electricCost = parseFloat(roomData.electric_cost || 0);
    scores['electric_cost'] = Math.max(0, (10 - electricCost) / 2);
    
    // 4. ระยะ MRT
    let mrtDistance = parseFloat(roomData.mrt_distance || 0);
    scores['mrt_distance'] = Math.max(0, (1000 - mrtDistance) / 100);
    
    // 5. ความปลอดภัย
    scores['safety'] = parseFloat(roomData.safety || 0);
    
    // 6. ร้านสะดวกซื้อ
    let convenience = parseFloat(roomData.convenience || 0);
    scores['convenience'] = Math.max(0, (500 - convenience) / 50);
    
    // 7. ซักผ้า
    let laundryCost = parseFloat(roomData.laundry_cost || 0);
    let laundryDistance = parseFloat(roomData.laundry_distance || 0);
    scores['laundry'] = Math.max(0, (80 - laundryCost) / 10 + (200 - laundryDistance) / 50);
    
    // 8-18. เกณฑ์แบบให้คะแนนโดยตรง
    const directKeys = ['room_type', 'elevator', 'appliances', 'water_heater', 
                        'aircon', 'cooking', 'workspace', 'review', 'lighting', 'contract'];
    directKeys.forEach(key => {
        scores[key] = parseFloat(roomData[key] || 0);
    });
    
    // 15. ขนาดห้อง
    let roomSize = parseFloat(roomData.room_size || 0);
    scores['room_size'] = Math.min(10, roomSize / 3);
    
    return scores;
}

// 3. ฟังก์ชันคำนวณค่าใช้จ่ายรายเดือน (เทียบเท่า calculate_monthly_cost)
function calculateMonthlyCost(roomData, budget) {
    let price = parseFloat(roomData.price || 0);
    
    let electricCost = parseFloat(roomData.electric_cost || 0);
    let electricUnits = parseFloat(roomData.electric_units || 0);
    let electricMonthly = electricCost * electricUnits;
    
    let waterCost = parseFloat(roomData.water_cost || 0);
    let waterUnits = parseFloat(roomData.water_units || 0);
    let waterMonthly = waterCost * waterUnits;
    
    let laundryCost = parseFloat(roomData.laundry_cost || 0);
    let laundryTimes = parseFloat(roomData.laundry_times || 0);
    let laundryMonthly = laundryCost * laundryTimes;
    
    let internet = parseFloat(roomData.internet || 0);
    let other = parseFloat(roomData.other_cost || 0);
    
    let total = price + electricMonthly + waterMonthly + laundryMonthly + internet + other;
    
    return {
        rent: price,
        electric: electricMonthly,
        electric_detail: `${electricUnits.toFixed(0)} หน่วย × ${electricCost.toFixed(1)} บาท`,
        water: waterMonthly,
        water_detail: `${waterUnits.toFixed(0)} หน่วย × ${waterCost.toFixed(1)} บาท`,
        laundry: laundryMonthly,
        laundry_detail: `${laundryTimes.toFixed(0)} ครั้ง × ${laundryCost.toFixed(1)} บาท`,
        internet: internet,
        other: other,
        total: total,
        over_budget: Math.max(0, total - budget)
    };
}

// 4. ฟังก์ชันคำนวณคะแนนรวมถ่วงน้ำหนัก (เทียบเท่า calculate_weighted_score)
function calculateWeightedScore(scores, weights) {
    let totalWeighted = 0;
    let totalWeight = 0;
    
    for (const [key, score] of Object.entries(scores)) {
        let weight = weights[key] || 0;
        totalWeighted += score * weight;
        totalWeight += weight;
    }
    
    return totalWeight > 0 ? (totalWeighted / totalWeight) * 10 : 0;
}

let roomCount = 0;
        let rooms = {};
        let settings = {
            budget: 9000,
            water_units_default: 10,
            electric_units_default: 100,
            laundry_times_default: 4,
            weights: {
                price: 10,
                water_cost: 8,
                electric_cost: 8,
                mrt_distance: 9,
                safety: 10,
                convenience: 9,
                laundry: 8,
                room_type: 10,
                elevator: 9,
                appliances: 10,
                water_heater: 8,
                aircon: 9,
                cooking: 10,
                workspace: 10,
                room_size: 8,
                review: 7,
                lighting: 3,
                contract: 7
            }
        };
        
        function showNotification(message, isError = false) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = 'notification show' + (isError ? ' error' : '');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        function toggleImportArea() {
            const importArea = document.getElementById('importArea');
            importArea.classList.toggle('active');
        }
        
        function exportRoomData(roomId) {
            const room = rooms[roomId];
            if (!room) return;
            
            const exportData = {
                name: room.name,
                data: room.data
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Copy to clipboard
            navigator.clipboard.writeText(jsonString).then(() => {
                showNotification('✅ คัดลอกข้อมูลห้อง "' + room.name + '" ลงคลิปบอร์ดแล้ว!');
            }).catch(err => {
                showNotification('❌ ไม่สามารถคัดลอกได้: ' + err, true);
            });
        }
        
        function exportAllRooms() {
            if (Object.keys(rooms).length === 0) {
                showNotification('⚠️ ไม่มีข้อมูลห้องให้ส่งออก', true);
                return;
            }
            
            const exportData = {
                settings: settings,
                rooms: Object.keys(rooms).map(roomId => ({
                    name: rooms[roomId].name,
                    data: rooms[roomId].data
                }))
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Copy to clipboard
            navigator.clipboard.writeText(jsonString).then(() => {
                showNotification('✅ คัดลอกข้อมูลทั้งหมด ' + Object.keys(rooms).length + ' ห้อง ลงคลิปบอร์ดแล้ว!');
            }).catch(err => {
                showNotification('❌ ไม่สามารถคัดลอกได้: ' + err, true);
            });
        }
        
        function importRoomData() {
            const textarea = document.getElementById('importTextarea');
            const jsonString = textarea.value.trim();
            
            if (!jsonString) {
                showNotification('⚠️ กรุณาวางข้อมูลที่ต้องการนำเข้า', true);
                return;
            }
            
            try {
                const importData = JSON.parse(jsonString);
                
                // ตรวจสอบว่าเป็นข้อมูลห้องเดียวหรือหลายห้อง
                if (importData.rooms && Array.isArray(importData.rooms)) {
                    // นำเข้าหลายห้องพร้อมการตั้งค่า
                    if (importData.settings) {
                        // อัพเดทการตั้งค่า
                        settings = importData.settings;
                        
                        // อัพเดท UI ของการตั้งค่า
                        document.getElementById('setting_budget').value = settings.budget;
                        document.getElementById('setting_water_units').value = settings.water_units_default;
                        document.getElementById('setting_electric_units').value = settings.electric_units_default;
                        document.getElementById('setting_laundry_times').value = settings.laundry_times_default;
                        
                        // อัพเดทน้ำหนัก
                        Object.keys(settings.weights).forEach(key => {
                            const element = document.getElementById('weight_' + key);
                            if (element) element.value = settings.weights[key];
                        });
                        
                        updateSettings();
                    }
                    
                    // นำเข้าห้องทั้งหมด
                    importData.rooms.forEach(roomData => {
                        addRoomWithData(roomData.name, roomData.data);
                    });
                    
                    showNotification('✅ นำเข้าข้อมูล ' + importData.rooms.length + ' ห้อง สำเร็จ!');
                } else if (importData.name && importData.data) {
                    // นำเข้าห้องเดียว
                    addRoomWithData(importData.name, importData.data);
                    showNotification('✅ นำเข้าข้อมูลห้อง "' + importData.name + '" สำเร็จ!');
                } else {
                    showNotification('❌ รูปแบบข้อมูลไม่ถูกต้อง', true);
                    return;
                }
                
                // ล้างข้อมูลในช่องนำเข้า
                textarea.value = '';
                toggleImportArea();
                
            } catch (error) {
                showNotification('❌ ข้อมูล JSON ไม่ถูกต้อง: ' + error.message, true);
            }
        }
        
        function addRoomWithData(roomName, roomData) {
            roomCount++;
            const roomId = 'room_' + roomCount;
            
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.id = roomId;
            
            roomCard.innerHTML = createRoomHTML(roomId, roomName);
            
            document.getElementById('roomsContainer').appendChild(roomCard);
            rooms[roomId] = {
                name: roomName,
                data: {}
            };
            
            // กรอกข้อมูลลงในฟอร์ม
            const fields = ['price', 'water_cost', 'water_units', 'electric_cost', 'electric_units',
                          'mrt_distance', 'safety', 'convenience', 'laundry_cost', 'laundry_times',
                          'laundry_distance', 'room_type', 'elevator', 'appliances', 'water_heater',
                          'aircon', 'cooking', 'workspace', 'room_size', 'review', 'lighting',
                          'contract', 'internet', 'other_cost'];
            
            fields.forEach(field => {
                const element = document.getElementById(`${roomId}_${field}`);
                if (element && roomData[field] !== undefined) {
                    element.value = roomData[field];
                }
            });
            
            // อัพเดทชื่อห้อง
            const nameInput = roomCard.querySelector('.room-name');
            if (nameInput) nameInput.value = roomName;
            
            // คำนวณคะแนน
            updateRoom(roomId);
        }
        
        function createRoomHTML(roomId, roomName) {
            return `
                <div class="room-header">
                    <input type="text" class="room-name" placeholder="ชื่อห้อง/โครงการ" 
                           value="${roomName}" onchange="updateRoomName('${roomId}', this.value)">
                    <div class="room-actions">
                        <button class="export-room-btn" onclick="exportRoomData('${roomId}')">📋 Copy</button>
                        <button class="delete-btn" onclick="deleteRoom('${roomId}')">🗑️ ลบ</button>
                    </div>
                </div>
                
                <div class="form-grid">
                    <!-- ข้อมูลราคาและค่าใช้จ่าย -->
                    <div class="form-group very-important">
                        <label>💰 ค่าห้อง (บาท/เดือน)</label>
                        <input type="number" id="${roomId}_price" onchange="updateRoom('${roomId}')" placeholder="เช่น 7500">
                        <span class="helper-text">ยิ่งถูกยิ่งดี (น้ำหนัก ${settings.weights.price})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>💧 ค่าน้ำ (บาท/หน่วย)</label>
                        <input type="number" step="0.1" id="${roomId}_water_cost" onchange="updateRoom('${roomId}')" placeholder="เช่น 18">
                        <span class="helper-text">ปกติ 15-25 บาท (น้ำหนัก ${settings.weights.water_cost})</span>
                    </div>
                    
                    <div class="form-group usage-info">
                        <label>💧 จำนวนหน่วยน้ำที่ใช้/เดือน</label>
                        <input type="number" id="${roomId}_water_units" onchange="updateRoom('${roomId}')" placeholder="${settings.water_units_default}" value="${settings.water_units_default}">
                        <span class="helper-text">ประมาณการใช้น้ำต่อเดือน</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>⚡ ค่าไฟ (บาท/หน่วย)</label>
                        <input type="number" step="0.1" id="${roomId}_electric_cost" onchange="updateRoom('${roomId}')" placeholder="เช่น 6">
                        <span class="helper-text">ปกติ 5-8 บาท (น้ำหนัก ${settings.weights.electric_cost})</span>
                    </div>
                    
                    <div class="form-group usage-info">
                        <label>⚡ จำนวนหน่วยไฟที่ใช้/เดือน</label>
                        <input type="number" id="${roomId}_electric_units" onchange="updateRoom('${roomId}')" placeholder="${settings.electric_units_default}" value="${settings.electric_units_default}">
                        <span class="helper-text">ประมาณการใช้ไฟต่อเดือน</span>
                    </div>
                    
                    <!-- ที่ตั้งและระยะทาง -->
                    <div class="form-group very-important">
                        <label>🚇 ระยะห่างจาก MRT (เมตร)</label>
                        <input type="number" id="${roomId}_mrt_distance" onchange="updateRoom('${roomId}')" placeholder="เช่น 300">
                        <span class="helper-text">ยิ่งใกล้ยิ่งดี (น้ำหนัก ${settings.weights.mrt_distance})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>🛡️ ทำเลและความปลอดภัย (0-10)</label>
                        <select id="${roomId}_safety" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - อันตรายมาก</option>
                            <option value="3">3 - ถนนแคบมืด</option>
                            <option value="5">5 - พอใช้</option>
                            <option value="7">7 - ดี</option>
                            <option value="10">10 - ดีมาก ถนนกว้างสว่าง</option>
                        </select>
                        <span class="helper-text">ความปลอดภัยทางเดิน (น้ำหนัก ${settings.weights.safety})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>🏪 ร้านสะดวกซื้อ (เมตร)</label>
                        <input type="number" id="${roomId}_convenience" onchange="updateRoom('${roomId}')" placeholder="เช่น 100">
                        <span class="helper-text">ยิ่งใกล้ยิ่งดี (น้ำหนัก ${settings.weights.convenience})</span>
                    </div>
                    
                    <!-- ซักผ้า -->
                    <div class="form-group very-important">
                        <label>👔 ค่าซักผ้า (บาท/ครั้ง)</label>
                        <input type="number" id="${roomId}_laundry_cost" onchange="updateRoom('${roomId}')" placeholder="เช่น 40">
                        <span class="helper-text">ราคาต่อครั้ง (น้ำหนัก ${settings.weights.laundry})</span>
                    </div>
                    
                    <div class="form-group usage-info">
                        <label>👔 จำนวนครั้งที่ซัก/เดือน</label>
                        <input type="number" id="${roomId}_laundry_times" onchange="updateRoom('${roomId}')" placeholder="${settings.laundry_times_default}" value="${settings.laundry_times_default}">
                        <span class="helper-text">จำนวนครั้งที่คุณซักผ้าต่อเดือน</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>📍 ระยะทางไปซักผ้า (เมตร)</label>
                        <input type="number" id="${roomId}_laundry_distance" onchange="updateRoom('${roomId}')" placeholder="เช่น 100">
                        <span class="helper-text">ระยะทางจากห้อง</span>
                    </div>
                    
                    <!-- ประเภทห้องและสิ่งอำนวยความสะดวก -->
                    <div class="form-group very-important">
                        <label>🏢 ประเภทห้องพัก (0-10)</label>
                        <select id="${roomId}_room_type" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - หอพักธรรมดา</option>
                            <option value="3">3 - อพาร์ทเม้นต์ธรรมดา</option>
                            <option value="7">7 - อพาร์ทเม้นต์ดี มียาม</option>
                            <option value="10">10 - คอนโด ครบครัน</option>
                        </select>
                        <span class="helper-text">ความปลอดภัยและสิ่งอำนวยความสะดวก (น้ำหนัก ${settings.weights.room_type})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>🛗 ลิฟท์และชั้น (0-10)</label>
                        <select id="${roomId}_elevator" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - ไม่มีลิฟต์ ชั้นสูง</option>
                            <option value="3">3 - ไม่มีลิฟต์ ชั้นต่ำ</option>
                            <option value="7">7 - มีลิฟต์ ชั้นกลาง</option>
                            <option value="10">10 - มีลิฟต์ ชั้นต่ำ</option>
                        </select>
                        <span class="helper-text">ความสะดวกในการขึ้น-ลง (น้ำหนัก ${settings.weights.elevator})</span>
                    </div>
                    
                    <!-- อุปกรณ์และเครื่องใช้ -->
                    <div class="form-group very-important">
                        <label>📺 อุปกรณ์ไฟฟ้า (0-10)</label>
                        <select id="${roomId}_appliances" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - ไม่มีเลย</option>
                            <option value="3">3 - มี 1 อย่าง</option>
                            <option value="5">5 - มี 2 อย่าง</option>
                            <option value="7">7 - มี 3 อย่าง</option>
                            <option value="10">10 - ครบทั้ง ทีวี/ตู้เย็น/ไมโครเวฟ</option>
                        </select>
                        <span class="helper-text">ทีวี/ตู้เย็น/ไมโครเวฟ (น้ำหนัก ${settings.weights.appliances})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>🚿 เครื่องทำน้ำอุ่น (0-10)</label>
                        <select id="${roomId}_water_heater" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - ไม่มี</option>
                            <option value="10">10 - มี</option>
                        </select>
                        <span class="helper-text">สำคัญสำหรับการอาบน้ำ (น้ำหนัก ${settings.weights.water_heater})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>❄️ แอร์ (0-10)</label>
                        <select id="${roomId}_aircon" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - ไม่มี</option>
                            <option value="10">10 - มี</option>
                        </select>
                        <span class="helper-text">สำคัญมาก (น้ำหนัก ${settings.weights.aircon})</span>
                    </div>
                    
                    <!-- การใช้งาน -->
                    <div class="form-group very-important">
                        <label>🍳 เหมาะทำอาหาร (0-10)</label>
                        <select id="${roomId}_cooking" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - ห้ามทำอาหาร</option>
                            <option value="3">3 - ทำได้แต่ยาก</option>
                            <option value="7">7 - ทำได้สะดวก</option>
                            <option value="10">10 - เหมาะมาก มีครัว</option>
                        </select>
                        <span class="helper-text">ความสะดวกในการทำอาหาร (น้ำหนัก ${settings.weights.cooking})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>💼 แยกพื้นที่ทำงาน WFH (0-10)</label>
                        <select id="${roomId}_workspace" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - แยกไม่ได้เลย</option>
                            <option value="5">5 - แยกได้แต่คับแคบ</option>
                            <option value="10">10 - แยกได้สะดวก</option>
                        </select>
                        <span class="helper-text">สำคัญมากสำหรับ WFH (น้ำหนัก ${settings.weights.workspace})</span>
                    </div>
                    
                    <div class="form-group very-important">
                        <label>📐 ขนาดห้อง (ตร.ม.)</label>
                        <input type="number" id="${roomId}_room_size" onchange="updateRoom('${roomId}')" placeholder="เช่น 25">
                        <span class="helper-text">ยิ่งใหญ่ยิ่งดี (น้ำหนัก ${settings.weights.room_size})</span>
                    </div>
                    
                    <!-- ข้อมูลเพิ่มเติม -->
                    <div class="form-group important">
                        <label>⭐ รีวิวในเน็ต (0-10)</label>
                        <select id="${roomId}_review" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - รีวิวแย่มาก</option>
                            <option value="3">3 - ไม่มีรีวิว</option>
                            <option value="5">5 - รีวิวปานกลาง</option>
                            <option value="7">7 - รีวิวดี</option>
                            <option value="10">10 - รีวิวดีมาก</option>
                        </select>
                        <span class="helper-text">ความน่าเชื่อถือ (น้ำหนัก ${settings.weights.review})</span>
                    </div>
                    
                    <div class="form-group">
                        <label>💡 แสงสว่างรอบข้าง (0-10)</label>
                        <select id="${roomId}_lighting" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - มืดมาก</option>
                            <option value="5">5 - พอใช้</option>
                            <option value="10">10 - สว่างดี</option>
                        </select>
                        <span class="helper-text">ไม่สำคัญมาก (น้ำหนัก ${settings.weights.lighting})</span>
                    </div>
                    
                    <div class="form-group important">
                        <label>📋 ระยะเวลาสัญญา (0-10)</label>
                        <select id="${roomId}_contract" onchange="updateRoom('${roomId}')">
                            <option value="0">0 - 1 ปีขึ้นไป</option>
                            <option value="5">5 - 6 เดือน</option>
                            <option value="10">10 - รายเดือนหรือ 3 เดือน</option>
                        </select>
                        <span class="helper-text">ความยืดหยุ่นในการย้าย (น้ำหนัก ${settings.weights.contract})</span>
                    </div>
                    
                    <!-- ค่าใช้จ่ายเพิ่มเติม -->
                    <div class="form-group usage-info">
                        <label>🌐 ค่าเน็ต (บาท/เดือน)</label>
                        <input type="number" id="${roomId}_internet" onchange="updateRoom('${roomId}')" placeholder="เช่น 300">
                        <span class="helper-text">ใส่ 0 ถ้ารวมในค่าห้อง</span>
                    </div>
                    
                    <div class="form-group">
                        <label>💵 ค่าใช้จ่ายอื่นๆ (บาท/เดือน)</label>
                        <input type="number" id="${roomId}_other_cost" onchange="updateRoom('${roomId}')" placeholder="เช่น 200">
                        <span class="helper-text">ค่าใช้จ่ายเพิ่มเติม</span>
                    </div>
                </div>
                
                <div class="results" id="${roomId}_results" style="display: none;">
                    <div class="score-summary" id="${roomId}_score_summary"></div>
                    <div class="cost-breakdown" id="${roomId}_cost_breakdown"></div>
                </div>
            `;
        }
        
        function toggleSettings() {
            const content = document.getElementById('settingsContent');
            content.classList.toggle('collapsed');
        }
        
        function updateSettings() {
            settings.budget = parseFloat(document.getElementById('setting_budget').value) || 9000;
            settings.water_units_default = parseFloat(document.getElementById('setting_water_units').value) || 10;
            settings.electric_units_default = parseFloat(document.getElementById('setting_electric_units').value) || 100;
            settings.laundry_times_default = parseFloat(document.getElementById('setting_laundry_times').value) || 4;
            
            // Update weights
            const weightFields = ['price', 'water_cost', 'electric_cost', 'mrt_distance', 'safety',
                                'convenience', 'laundry', 'room_type', 'elevator', 'appliances',
                                'water_heater', 'aircon', 'cooking', 'workspace', 'room_size',
                                'review', 'lighting', 'contract'];
            
            weightFields.forEach(field => {
                const value = parseFloat(document.getElementById('weight_' + field).value);
                if (!isNaN(value)) {
                    settings.weights[field] = value;
                }
            });
            
            // Update budget display
            document.getElementById('budgetDisplay').textContent = 
                `งบไม่เกิน ${settings.budget.toLocaleString()} บาท/เดือน`;
            
            // Recalculate all rooms
            Object.keys(rooms).forEach(roomId => {
                if (rooms[roomId].data.price) {
                    updateRoom(roomId);
                }
            });
        }
        
        function addRoom() {
            roomCount++;
            const roomId = 'room_' + roomCount;
            const roomName = `ห้องที่ ${roomCount}`;
            
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.id = roomId;
            
            roomCard.innerHTML = createRoomHTML(roomId, roomName);
            
            document.getElementById('roomsContainer').appendChild(roomCard);
            rooms[roomId] = {
                name: roomName,
                data: {}
            };
        }
        
        function updateRoomName(roomId, name) {
            rooms[roomId].name = name;
            updateComparison();
        }
        
        function deleteRoom(roomId) {
            if (confirm('ต้องการลบห้องนี้ใช่ไหม?')) {
                document.getElementById(roomId).remove();
                delete rooms[roomId];
                updateComparison();
            }
        }
        
        function updateRoom(roomId) {
        const data = {};
        const fields = ['price', 'water_cost', 'water_units', 'electric_cost', 'electric_units',
                    'mrt_distance', 'safety', 'convenience', 'laundry_cost', 'laundry_times',
                    'laundry_distance', 'room_type', 'elevator', 'appliances', 'water_heater',
                    'aircon', 'cooking', 'workspace', 'room_size', 'review', 'lighting',
                    'contract', 'internet', 'other_cost'];
        
        fields.forEach(field => {
            const element = document.getElementById(`${roomId}_${field}`);
            data[field] = element ? (element.value || 0) : 0;
        });
        
        rooms[roomId].data = data;

        // --- ส่วนที่เปลี่ยน: ไม่ใช้ fetch แล้ว แต่คำนวณสดๆ ตรงนี้เลย ---
        const scores = calculateScore(data, settings.weights);
        const totalScore = calculateWeightedScore(scores, settings.weights);
        const monthlyCost = calculateMonthlyCost(data, settings.budget);
        
        const result = {
            scores: scores,
            total_score: totalScore,
            monthly_cost: monthlyCost
        };

        displayResults(roomId, result);
        updateComparison();
    }
        
        function displayResults(roomId, result) {
            const resultsDiv = document.getElementById(`${roomId}_results`);
            resultsDiv.style.display = 'block';
            
            // คะแนนรวม
            const scoreSummary = document.getElementById(`${roomId}_score_summary`);
            scoreSummary.innerHTML = `
                <div class="score-card">
                    <h3>คะแนนรวม</h3>
                    <div class="value">${result.total_score.toFixed(2)}</div>
                    <small>เต็ม 10.00</small>
                </div>
                <div class="score-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <h3>ค่าใช้จ่ายรวม</h3>
                    <div class="value">${result.monthly_cost.total.toLocaleString()}</div>
                    <small>บาท/เดือน</small>
                </div>
            `;
            
            // รายละเอียดค่าใช้จ่าย
            const costBreakdown = document.getElementById(`${roomId}_cost_breakdown`);
            const cost = result.monthly_cost;
            costBreakdown.innerHTML = `
                <h3 style="margin-bottom: 10px;">💰 รายละเอียดค่าใช้จ่าย</h3>
                <div class="cost-item">
                    <span>ค่าห้อง</span>
                    <span>${cost.rent.toLocaleString()} บาท</span>
                </div>
                <div class="cost-item">
                    <span>ค่าไฟ <span class="cost-detail">(${cost.electric_detail})</span></span>
                    <span>${cost.electric.toLocaleString()} บาท</span>
                </div>
                <div class="cost-item">
                    <span>ค่าน้ำ <span class="cost-detail">(${cost.water_detail})</span></span>
                    <span>${cost.water.toLocaleString()} บาท</span>
                </div>
                <div class="cost-item">
                    <span>ค่าซักผ้า <span class="cost-detail">(${cost.laundry_detail})</span></span>
                    <span>${cost.laundry.toLocaleString()} บาท</span>
                </div>
                <div class="cost-item">
                    <span>ค่าเน็ต</span>
                    <span>${cost.internet.toLocaleString()} บาท</span>
                </div>
                <div class="cost-item">
                    <span>อื่นๆ</span>
                    <span>${cost.other.toLocaleString()} บาท</span>
                </div>
                <div class="cost-item">
                    <span>รวมทั้งหมด</span>
                    <span>${cost.total.toLocaleString()} บาท</span>
                </div>
                ${cost.over_budget > 0 ? 
                    `<div class="over-budget">⚠️ เกินงบ ${cost.over_budget.toLocaleString()} บาท</div>` :
                    `<div class="in-budget">✅ อยู่ในงบ ${settings.budget.toLocaleString()} บาท</div>`
                }
            `;
        }
        
        function updateComparison() {
        const roomList = Object.keys(rooms);
        if (roomList.length === 0) {
            document.getElementById('comparison').style.display = 'none';
            return;
        }
        
        // คำนวณคะแนนสดๆ ใน JS สำหรับทุกห้อง
        const results = [];
        roomList.forEach(roomId => {
            const data = rooms[roomId].data;
            if (data && data.price) {  
                const scores = calculateScore(data, settings.weights);
                const totalScore = calculateWeightedScore(scores, settings.weights);
                const monthlyCost = calculateMonthlyCost(data, settings.budget);
                
                results.push({
                    id: roomId,
                    name: rooms[roomId].name,
                    score: totalScore,
                    cost: monthlyCost.total,
                    over_budget: monthlyCost.over_budget
                });
            }
        });

        // เรียงอันดับคะแนนจากมากไปน้อย
        results.sort((a, b) => b.score - a.score);
        
        const grid = document.getElementById('comparisonGrid');
        grid.innerHTML = '';
        
        results.forEach((room, index) => {
            const rankClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : '';
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            
            grid.innerHTML += `
                <div class="rank-card ${rankClass}">
                    <div class="rank-number">${medal} อันดับ ${index + 1}</div>
                    <div class="rank-name">${room.name}</div>
                    <div class="rank-score">${room.score.toFixed(2)} คะแนน</div>
                    <div style="margin-top: 10px; font-size: 0.95em;">
                        <div>💰 ${room.cost.toLocaleString()} บาท/เดือน</div>
                        ${room.over_budget > 0 ? 
                            `<div style="color: #c62828;">⚠️ เกินงบ ${room.over_budget.toLocaleString()} บาท</div>` :
                            `<div style="color: #2e7d32;">✅ อยู่ในงบ</div>`
                        }
                    </div>
                </div>
            `;
        });
        
        if (results.length > 0) {
            document.getElementById('comparison').style.display = 'block';
        }
    }
        
        // เพิ่มห้องตัวอย่างตอนเริ่มต้น
        addRoom();