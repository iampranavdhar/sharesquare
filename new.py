import os
import random
import string
import smtplib
from email.mime.text import MIMEText
from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']
        filename = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        file.save(filename)
        otp = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        url = f'http://localhost:5000/{filename}?otp={otp}'
        send_email(url)
        return f'<html><body><h1>File uploaded successfully!</h1><p>Shareable URL: <a href="{url}">{url}</a></p></body></html>'
    else:
        return '''
            <html>
                <body>
                    <form method="post" enctype="multipart/form-data">
                        <input type="file" name="file">
                        <input type="submit" value="Start Sharing">
                    </form>
                </body>
            </html>
        '''

def send_email(url):
    sender_email = 'youremail@gmail.com'
    receiver_email = 'recipientemail@gmail.com'
    password = 'yourpassword'
    message = MIMEText(f'Shareable URL: {url}')
    message['Subject'] = 'File sharing URL'
    message['From'] = sender_email
    message['To'] = receiver_email
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, password)
    server.sendmail(sender_email, receiver_email, message.as_string())
    server.quit()

if __name__ == '__main__':
    app.run()