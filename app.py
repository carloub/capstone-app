from flask import Flask, request, jsonify
import time
from datetime import datetime

app = Flask(__name__)


@app.route('/')
def hello_world():
   return "<p>Hello, World! </p>"


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/form', methods=['POST'])
def submit():
    data = request.json

    print(f"Received form data: {data}")
    # Extract data
    birth_date = data.get('birthDate', '')
    sex = data.get('sex', '')
    smoke = data.get('smoke', '')

    # Calculate Life Expectancy
    if sex.lower() == 'male':
        expected_age = 75
    elif sex.lower() == 'female':
        expected_age = 80
    else:
        return jsonify({'status': 'error', 'message': 'Invalid sex value'})
    
    #Calculate Age
    birth_datetime_obj = datetime.strptime(birth_date.split('T')[0], '%Y-%m-%d')  # Parse string to datetime object
    current_age_sec = (datetime.now() - birth_datetime_obj).total_seconds()
    current_age_year = datetime.now().year- birth_datetime_obj.year
    
    if smoke.lower() == 'yes':
        if current_age_year < 34:
            expected_age -= 10
        elif current_age_year < 44:
            expected_age -= 9
        else:
            expected_age -=6

    

    #Calculate TLTL
    remainingSeconds = (expected_age*365*24*60*60) - current_age_sec

    #30 year old smoker expect 35 more years
    #30 year old non smoker expect 53 more years
    #smokers die ten more years than non-smokers

    message = f"Form submitted successfully with data: {data}"
    response = {
        'status': 'success',
        'message': message,
        'remainingSeconds': remainingSeconds
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
