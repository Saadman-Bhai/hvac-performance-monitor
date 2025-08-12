from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import io

app = Flask(__name__)
CORS(app)  # enable CORS

def detect_anomaly(sensor_df):
    """
    Simple AI model to detect anomalies:
    - Check if temperature or humidity goes outside normal ranges
    - Calculate efficiency drop based on energy consumption spikes
    """
    anomalies = []
    for idx, row in sensor_df.iterrows():
        temp = row['temperature']
        humidity = row['humidity']
        airflow = row['airflow']
        energy = row['energy_consumption']
        
        if temp < 16 or temp > 30:
            anomalies.append(f'Temperature anomaly at row {idx+1}: {temp}°C')
        if humidity < 20 or humidity > 70:
            anomalies.append(f'Humidity anomaly at row {idx+1}: {humidity}%')
        if airflow < 200 or airflow > 800:
            anomalies.append(f'Airflow anomaly at row {idx+1}: {airflow} CFM')
        # energy spike detection (simple heuristic)
        if energy > sensor_df['energy_consumption'].mean() * 1.5:
            anomalies.append(f'High energy consumption at row {idx+1}: {energy} kW')
    
    efficiency_score = max(0, 100 - len(anomalies)*5)
    return anomalies, efficiency_score

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        data = file.read().decode('utf-8')
        df = pd.read_csv(io.StringIO(data))
        required_cols = ['temperature', 'humidity', 'airflow', 'energy_consumption']
        if not all(col in df.columns for col in required_cols):
            return jsonify({'error': f'Missing columns. Required: {required_cols}'}), 400
        
        anomalies, efficiency = detect_anomaly(df)
        
        return jsonify({
            'anomalies': anomalies,
            'efficiency_score': efficiency
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

