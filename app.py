from flask import Flask, request, jsonify, make_response
import requests

app = Flask(__name__)

# 手动添加CORS头部的函数
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# 注册after_request处理器来添加CORS头部
@app.after_request
def after_request(response):
    return add_cors_headers(response)

# 设置静态文件目录
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/weather')
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': '请提供城市名称'}), 400
    
    try:
        # 调用wttr.in的API获取天气数据
        response = requests.get(f'https://wttr.in/{city}?format=j1', timeout=10)
        response.raise_for_status()  # 如果请求失败，抛出异常
        
        weather_data = response.json()
        
        # 提取需要的天气信息
        current_condition = weather_data.get('current_condition', [{}])[0]
        nearest_area = weather_data.get('nearest_area', [{}])[0]
        
        # 构建返回的数据结构
        result = {
            'location': nearest_area.get('areaName', [{}])[0].get('value'),
            'country': nearest_area.get('country', [{}])[0].get('value'),
            'temperature': current_condition.get('temp_C'),
            'feels_like': current_condition.get('FeelsLikeC'),
            'weather_description': current_condition.get('weatherDesc', [{}])[0].get('value'),
            'humidity': current_condition.get('humidity'),
            'wind_speed': current_condition.get('windspeedKmph'),
            'wind_direction': current_condition.get('winddir16Point')
        }
        
        return jsonify(result)
    
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'获取天气数据失败: {str(e)}'}), 500
    except ValueError as e:
        return jsonify({'error': f'解析天气数据失败: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'发生未知错误: {str(e)}'}), 500

if __name__ == '__main__':
    # 设置静态文件目录为当前目录，这样可以直接访问index.html
    app.static_folder = '.'
    # 启动Flask应用，host设为0.0.0.0使其可以从外部访问
    app.run(host='0.0.0.0', port=5000, debug=True)