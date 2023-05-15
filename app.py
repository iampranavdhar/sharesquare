from flask import Flask, request, render_template, session, send_from_directory
import smtplib
import os
import random
import socket
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/share")
def share():
    return render_template("share.html")


@app.route("/sendEmail", methods=["POST"])
def send_email():
    recipient_email = request.form["email"]
    shareable_url = request.form["room_id"]

    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    recipient_email = recipient_email
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(sender_email, sender_password)
    message = f"Subject: File sharing\n\nHere is the room link: {shareable_url}"
    server.sendmail(sender_email, recipient_email, message)
    server.quit()
    return "Email sent successfully"


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(host='0.0.0.0', port=4000)