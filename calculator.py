# ค่าเริ่มต้น
DEFAULT_SETTINGS = {
    'budget': 9000,
    'water_units_default': 10,
    'electric_units_default': 100,
    'laundry_times_default': 4,
    'weights': {
        'price': 10,
        'water_cost': 8,
        'electric_cost': 8,
        'mrt_distance': 9,
        'safety': 10,
        'convenience': 9,
        'laundry': 8,
        'room_type': 10,
        'elevator': 9,
        'appliances': 10,
        'water_heater': 8,
        'aircon': 9,
        'cooking': 10,
        'workspace': 10,
        'room_size': 8,
        'review': 7,
        'lighting': 3,
        'contract': 7,
    }
}

def calculate_score(room_data, weights):
    """คำนวณคะแนนแต่ละเกณฑ์"""
    scores = {}
    
    # 1. ราคาห้อง (ยิ่งถูกยิ่งดี)
    price = float(room_data.get('price', 0))
    scores['price'] = max(0, (10000 - price) / 1000)
    
    # 2. ค่าน้ำ (ยิ่งถูกยิ่งดี)
    water_cost = float(room_data.get('water_cost', 0))
    scores['water_cost'] = max(0, (25 - water_cost) / 5)
    
    # 3. ค่าไฟ (ยิ่งถูกยิ่งดี)
    electric_cost = float(room_data.get('electric_cost', 0))
    scores['electric_cost'] = max(0, (10 - electric_cost) / 2)
    
    # 4. ระยะห่าง MRT (ยิ่งใกล้ยิ่งดี)
    mrt_distance = float(room_data.get('mrt_distance', 0))
    scores['mrt_distance'] = max(0, (1000 - mrt_distance) / 100)
    
    # 5. ทำเลและความปลอดภัย (0-10)
    scores['safety'] = float(room_data.get('safety', 0))
    
    # 6. ร้านสะดวกซื้อ (ยิ่งใกล้ยิ่งดี)
    convenience = float(room_data.get('convenience', 0))
    scores['convenience'] = max(0, (500 - convenience) / 50)
    
    # 7. ค่าซักผ้า + ระยะทาง
    laundry_cost = float(room_data.get('laundry_cost', 0))
    laundry_distance = float(room_data.get('laundry_distance', 0))
    scores['laundry'] = max(0, (80 - laundry_cost) / 10 + (200 - laundry_distance) / 50)
    
    # 8-18. เกณฑ์แบบให้คะแนนโดยตรง (0-10)
    for key in ['room_type', 'elevator', 'appliances', 'water_heater', 
                'aircon', 'cooking', 'workspace', 'review', 'lighting', 'contract']:
        scores[key] = float(room_data.get(key, 0))
    
    # 15. ขนาดห้อง
    room_size = float(room_data.get('room_size', 0))
    scores['room_size'] = min(10, room_size / 3)
    
    return scores

def calculate_monthly_cost(room_data, scores, budget):
    """คำนวณค่าใช้จ่ายรายเดือน"""
    price = float(room_data.get('price', 0))
    
    # ค่าไฟ - ใช้จำนวนหน่วยที่ผู้ใช้กำหนด
    electric_cost = float(room_data.get('electric_cost', 0))
    electric_units = float(room_data.get('electric_units', 0))
    electric_monthly = electric_cost * electric_units
    
    # ค่าน้ำ - ใช้จำนวนหน่วยที่ผู้ใช้กำหนด
    water_cost = float(room_data.get('water_cost', 0))
    water_units = float(room_data.get('water_units', 0))
    water_monthly = water_cost * water_units
    
    # ค่าซักผ้า - ใช้จำนวนครั้งที่ผู้ใช้กำหนด
    laundry_cost = float(room_data.get('laundry_cost', 0))
    laundry_times = float(room_data.get('laundry_times', 0))
    laundry_monthly = laundry_cost * laundry_times
    
    # ค่าเน็ต - คิดเป็นรายห้อง
    internet = float(room_data.get('internet', 0))
    
    # อื่นๆ
    other = float(room_data.get('other_cost', 0))
    
    total = price + electric_monthly + water_monthly + laundry_monthly + internet + other
    
    return {
        'rent': price,
        'electric': electric_monthly,
        'electric_detail': f"{electric_units:.0f} หน่วย × {electric_cost:.1f} บาท",
        'water': water_monthly,
        'water_detail': f"{water_units:.0f} หน่วย × {water_cost:.1f} บาท",
        'laundry': laundry_monthly,
        'laundry_detail': f"{laundry_times:.0f} ครั้ง × {laundry_cost:.1f} บาท",
        'internet': internet,
        'other': other,
        'total': total,
        'over_budget': max(0, total - budget)
    }

def calculate_weighted_score(scores, weights):
    """คำนวณคะแนนรวมถ่วงน้ำหนัก"""
    total_weighted = 0
    total_weight = 0
    
    for key, score in scores.items():
        weight = weights.get(key, 0)
        total_weighted += score * weight
        total_weight += weight
    
    return (total_weighted / total_weight) * 10 if total_weight > 0 else 0