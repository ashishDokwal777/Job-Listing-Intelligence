from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import io

from data_cleaning import clean_data, clean_salary
from analysis import analyze_top_skills, analyze_salary, analyze_job_counts, analyze_experience
from insights import generate_insights
from model import train_salary_model

app = Flask(__name__)
CORS(app)

# In-memory storage for the latest uploaded dataset
current_data = {
    "df": None,
    "skills_list": ["python", "sql", "excel", "power bi", "tableau", "aws", "azure", "machine learning", "r", "spark"]
}

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    try:
        # Read CSV
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        df = pd.read_csv(stream)
        
        # Clean data
        df = clean_data(df, current_data['skills_list'])
        
        # Parse salaries if exists
        if 'salary' in df.columns:
            df['salary'] = df['salary'].apply(clean_salary)
            
        current_data['df'] = df
        return jsonify({"message": "File uploaded and processed successfully", "rows": len(df)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/summary', methods=['GET'])
def get_summary():
    df = current_data['df']
    if df is None:
        return jsonify({"error": "No data available"}), 400
        
    total_jobs = len(df)
    salary_stats = analyze_salary(df)
    top_skills = analyze_top_skills(df, current_data['skills_list'])
    top_skill_name = top_skills[0][0].title() if top_skills else "N/A"
    
    return jsonify({
        "total_jobs": total_jobs,
        "average_salary": salary_stats.get("average", 0),
        "top_skill": top_skill_name
    })

@app.route('/skills', methods=['GET'])
def get_skills():
    df = current_data['df']
    if df is None:
        return jsonify({"error": "No data available"}), 400
        
    skills = analyze_top_skills(df, current_data['skills_list'])
    skills_data = [{"skill": k.title(), "count": int(v)} for k, v in skills]
    return jsonify(skills_data)

@app.route('/salary', methods=['GET'])
def get_salary_info():
    df = current_data['df']
    if df is None:
        return jsonify({"error": "No data available"}), 400
        
    stats = analyze_salary(df)
    
    by_location = [{"location": k, "salary": v} for k, v in stats.get("by_location", {}).items()]
    by_role = [{"role": k, "salary": v} for k, v in stats.get("by_role", {}).items()]
    
    return jsonify({
        "by_location": by_location,
        "by_role": by_role
    })

@app.route('/jobs_location', methods=['GET'])
def get_jobs_location():
    df = current_data['df']
    if df is None:
        return jsonify({"error": "No data available"}), 400
        
    counts = analyze_job_counts(df)
    data = [{"location": str(k).title(), "count": int(v)} for k, v in counts.items()]
    return jsonify(data)

@app.route('/insights', methods=['GET'])
def get_insights_route():
    df = current_data['df']
    if df is None:
        return jsonify({"error": "No data available"}), 400
        
    total_jobs = len(df)
    top_skills = analyze_top_skills(df, current_data['skills_list'])
    
    counts = analyze_job_counts(df)
    highest_location = max(counts, key=counts.get) if counts else None
    
    insights = generate_insights(df, total_jobs, top_skills, highest_location)
    
    model, msg = train_salary_model(df)
    if model:
        insights.append(f"ML Salary Prediction Engine: {msg}")
        
    return jsonify({"insights": insights})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
