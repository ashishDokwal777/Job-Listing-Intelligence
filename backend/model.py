import pandas as pd
from sklearn.linear_model import LinearRegression

def train_salary_model(df):
    """
    Trains a linear regression model to predict salary based on simple features.
    """
    if 'salary' not in df.columns:
        return None, "Salary data missing."
        
    df_model = df.dropna(subset=['salary']).copy()
    
    features = []
    # If experience exists, try extracting numeric value
    if 'experience' in df_model.columns:
        df_model['exp_num'] = df_model['experience'].astype(str).str.extract(r'(\d+)').astype(float)
        features.append('exp_num')
        
    if not features:
        return None, "Not enough numeric features for regression."
        
    df_model = df_model.dropna(subset=features)
    
    if len(df_model) < 5:
        return None, "Not enough data points to train a reliable model."
        
    X = df_model[features]
    y = df_model['salary']
    
    model = LinearRegression()
    model.fit(X, y)
    
    score = model.score(X, y)
    
    # Just a basic demonstration
    return model, f"Model trained with R^2 score: {score:.2f}."
