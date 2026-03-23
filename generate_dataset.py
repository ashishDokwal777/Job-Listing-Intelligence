import csv
import random

titles = [
    'Data Analyst', 'Data Analyst', 'Data Analyst',
    'Senior Data Analyst', 'Senior Data Analyst', 
    'Data Scientist', 'Data Scientist', 
    'Senior Data Scientist', 
    'Data Engineer', 'Data Engineer', 
    'Analytics Engineer', 'BI Developer', 'BI Developer',
    'Machine Learning Engineer', 'Lead Data Analyst'
]

locations = [
    'Remote', 'Remote', 'Remote', 'Remote', 
    'New York', 'San Francisco', 'Chicago', 
    'Austin', 'Seattle', 'Boston', 'Los Angeles', 'Denver', 'Atlanta'
]

skills_list = ['python', 'sql', 'excel', 'power bi', 'tableau', 'aws', 'azure', 'machine learning', 'r', 'spark']
experiences = ['0-2 years', '2-4 years', '3-5 years', '5+ years', '7+ years']

def get_salary(title, exp_str, loc):
    # Base salary by title
    bases = {
        'Data Analyst': 70,
        'Senior Data Analyst': 95,
        'Data Scientist': 110,
        'Senior Data Scientist': 140,
        'Data Engineer': 115,
        'Analytics Engineer': 105,
        'BI Developer': 80,
        'Machine Learning Engineer': 130,
        'Lead Data Analyst': 120
    }
    
    # adjustments
    base = bases[title]
    if '5+' in exp_str or '7+' in exp_str:
        base += 30
    elif '0-2' in exp_str:
        base -= 15
        
    if loc in ['San Francisco', 'New York', 'Seattle']:
        base += 20
    elif loc == 'Remote':
        base -= 5
        
    # random jitter
    jitter = random.randint(-10, 10)
    low = base + jitter
    high = low + random.randint(15, 30)
    return f"${low}k - ${high}k"

def get_skills(title):
    num_skills = random.randint(2, 5)
    
    core_skills = []
    if 'Data Analyst' in title or 'BI' in title:
        core_skills = ['sql', random.choice(['excel', 'tableau', 'power bi'])]
        if random.random() > 0.4: core_skills.append('python')
    elif 'Data Scientist' in title or 'Machine' in title:
        core_skills = ['python', 'machine learning', random.choice(['sql', 'r'])]
    elif 'Engineer' in title:
        core_skills = ['sql', 'python', random.choice(['aws', 'azure']), random.choice(['spark', ''])]
        
    core_skills = [s for s in core_skills if s]
    
    # add random ones
    while len(core_skills) < num_skills:
        s = random.choice(skills_list)
        if s not in core_skills:
            core_skills.append(s)
            
    return ", ".join(core_skills).title()

with open('jobs_dataset.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['title', 'location', 'salary', 'skills', 'experience'])
    
    for _ in range(500):
        t = random.choice(titles)
        l = random.choice(locations)
        e = random.choice(experiences)
        
        # fix mismatched title / experience logic slightly
        if 'Senior' in t or 'Lead' in t:
            e = random.choice(['3-5 years', '5+ years', '7+ years'])
        elif 'Junior' in t:
            e = '0-2 years'
            
        s = get_salary(t, e, l)
        sk = get_skills(t)
        
        writer.writerow([t, l, s, sk, e])

print("Generated jobs_dataset.csv with 500 records successfully!")
