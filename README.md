# HVAC System Performance Monitor

A web-based application that uses AI-driven analysis to monitor HVAC system performance through simulated sensor data.  
Built with React (frontend) and Python Flask (backend), this project helps detect anomalies, predict system efficiency, and visualize key HVAC metrics.

---

## Features

- Upload CSV files with HVAC sensor data: temperature, humidity, airflow, energy consumption  
- Visualize sensor data in interactive charts  
- AI-based anomaly detection and efficiency scoring  
- User-friendly dashboard with instant feedback  
- Fully web-based; no hardware required initially  

---

## Tech Stack

- **Frontend:** React.js, Chart.js  
- **Backend:** Python Flask, Pandas, Flask-CORS  
- **AI Model:** Simple heuristic-based anomaly detection  

---

## Getting Started

### Prerequisites

- Python 3.x  
- Node.js and npm  

### Backend Setup

```bash
cd backend
python -m venv venv            # Optional but recommended
source venv/bin/activate       # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
