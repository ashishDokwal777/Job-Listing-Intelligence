def generate_insights(df, total_jobs, top_skills, highest_location):
    insights = []
    
    insights.append(f"Analyzed a total of {total_jobs} job postings in the market.")
    
    if top_skills and len(top_skills) > 0:
        top_skill = top_skills[0]
        percentage = round((top_skill[1] / total_jobs) * 100) if total_jobs > 0 else 0
        if percentage > 50:
            insights.append(f"{top_skill[0]} is highly dominant, appearing in {percentage}% of all job listings.")
        else:
            insights.append(f"{top_skill[0]} is the most requested skill, required in {percentage}% of jobs.")
            
    if highest_location:
        insights.append(f"{highest_location} currently has the highest number of job openings.")
        
    if 'experience' in df.columns:
        most_common_exp = df['experience'].mode()
        if not most_common_exp.empty:
            insights.append(f"{most_common_exp.iloc[0]} roles dominate the current job market.")
            
    if 'salary' in df.columns:
        avg_salary = df['salary'].mean()
        if avg_salary > 0:
            insights.append(f"The average market salary across all roles is ${avg_salary:,.0f}.")
            
    return insights
