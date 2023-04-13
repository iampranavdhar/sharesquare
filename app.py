from flask import Flask, request, render_template, session, send_from_directory
import smtplib
import os
import random
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/share", methods=["POST"])
def share():
    file = request.files["file"]
    recipient_email = request.form["email"]
    if not file:
        return "No file uploaded"
    if not recipient_email:
        return "No recipient email"
    file.save(os.path.join("uploads", file.filename))
    shareable_url = generate_shareable_url(file.filename)
    send_email(shareable_url, recipient_email)
    return "File shared successfully!"

# @app.route("/verify_otp/<otp>", methods=["GET", "POST"])
# def verify_otp(otp):
#    if otp == session["otp"]:
#       session.pop("otp", None)
#       return send_from_directory("uploads", session["filename"], as_attachment=True)
#    else:
#       return "Invalid OTP"


@app.route("/verify_otp/<otp>", methods=["GET", "POST"])
def verify_otp(otp):
    if otp == session["otp"]:
        filename = session["filename"]
        file_path = os.path.join("uploads", filename)
        if os.path.exists(file_path):
            return send_from_directory("uploads", filename, as_attachment=True, attachment_filename=filename, mimetype=None)
            # delete file from uploads folder after it has been downloaded
            os.remove(file_path)
        else:
            return "File not found"
    else:
        return "Invalid OTP"


def generate_shareable_url(filename):
    otp = str(random.randint(1000, 9999))
    session["otp"] = otp
    session["filename"] = filename
    shareable_url = f"http://127.0.0.1:4000/verify_otp/{otp}"
    return shareable_url


def send_email(shareable_url, recipient_email):
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    recipient_email = recipient_email
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(sender_email, sender_password)
    message = f"Subject: File sharing\n\nHere is the shareable URL: {shareable_url}"
    server.sendmail(sender_email, recipient_email, message)
    server.quit()


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(host='0.0.0.0', port=4000)
