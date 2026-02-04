from flask import Flask, render_template, request, jsonify
from calculator import DEFAULT_SETTINGS, calculate_score, calculate_monthly_cost, calculate_weighted_score
import os

app = Flask(__name__)

@app.route('/')

def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    room_data = data.get('room_data', {})
    user_settings = data.get('settings', DEFAULT_SETTINGS)
    
    weights = user_settings.get('weights', DEFAULT_SETTINGS['weights'])
    budget = user_settings.get('budget', DEFAULT_SETTINGS['budget'])
    
    scores = calculate_score(room_data, weights)
    total_score = calculate_weighted_score(scores, weights)
    monthly_cost = calculate_monthly_cost(room_data, scores, budget)
    
    return jsonify({
        'scores': scores,
        'total_score': total_score,
        'monthly_cost': monthly_cost
    })

def open_browser():
    webbrowser.open('http://localhost:5000')

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🏠 ระบบวิเคราะห์คะแนนห้องพัก")
    print("="*60)
    print("\n✅ เซิร์ฟเวอร์กำลังเริ่มต้น...")
    print("🌐 เปิด browser ที่: http://localhost:5000")
    print("\n💡 กด Ctrl+C เพื่อหยุดโปรแกรม\n")
    
    # เปิด browser อัตโนมัติหลังจาก 1.5 วินาที
    Timer(1.5, open_browser).start()
    
    # รัน Flask app
    app.run(debug=False, port=5000)
    # สำหรับรันเทสในเครื่องตัวเอง
    # app.run(debug=True)