import pandas as pd

def analyze_top_skills(df, skills_list):
    """Returns top 10 skills. Assumes skills_list exists in df."""
    skill_counts = {}
    for skill in skills_list:
        if skill in df.columns:
            skill_counts[skill] = df[skill].sum()
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    return sorted_skills[:10]

def analyze_salary(df):
    if 'salary' not in df.columns:
        return {}
    
    by_location = df.groupby('location')['salary'].mean().dropna().astype(int).to_dict() if 'location' in df.columns else {}
    by_role = df.groupby('role')['salary'].mean().dropna().astype(int).to_dict() if 'role' in df.columns else {}
    
    avg_salary_val = df['salary'].mean()
    return {
        "by_location": by_location,
        "by_role": by_role,
        "average": int(avg_salary_val) if pd.notnull(avg_salary_val) else 0
    }

def analyze_job_counts(df):
    if 'location' not in df.columns:
        return {}
    return df['location'].value_counts().to_dict()

def analyze_experience(df):
    if 'experience' not in df.columns:
        return {}
    return df['experience'].value_counts().to_dict()
