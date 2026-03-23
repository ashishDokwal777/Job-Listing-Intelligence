import pandas as pd
import numpy as np
import re

def clean_salary(salary_str):
    """
    Parses a string like '$50k - $80k' and returns the numeric average (e.g., 65000).
    If it cannot be parsed, returns np.nan.
    """
    if pd.isna(salary_str):
        return np.nan
    
    # Extract all numbers from the string
    numbers = re.findall(r'\d+', str(salary_str).replace(',', ''))
    if not numbers:
        return np.nan
        
    num_list = [float(n) for n in numbers]
    
    # Simple heuristic to scale e.g. "50" in text as 50,000 if it features 'k'
    if 'k' in str(salary_str).lower():
        num_list = [n * 1000 for n in num_list]
        
    return sum(num_list) / len(num_list)

def clean_data(df, skills_list):
    """
    Executes the standard data cleaning pipeline.
    """
    # 1. Remove duplicates
    df = df.drop_duplicates()
    
    # 2. Standardize column names
    df.columns = [c.lower().strip() for c in df.columns]
    
    # 3. Handle skills extraction if 'skills' column exists
    if 'skills' in df.columns:
        df['skills'] = df['skills'].fillna('').astype(str).str.lower()
        for skill in skills_list:
            df[skill] = df['skills'].str.contains(skill.lower(), na=False).astype(int)
            
    return df
