## ShareSquare 🔗

ShareSquare is a file sharing website which uses the concept of Sockets to share files between two devices. The application is built using Flask, Firebase , HTML, CSS and Javascript. File is shared between two directly without any need of uploading the file to the server.

<img width="1470" alt="image" src="https://github.com/iampranavdhar/campusmind/assets/73348574/f361d43d-9e28-4ae0-b27e-33fa13896f8c">

Show some ❤️ and 🌟 the repo to support the project

## Index ✏️

- [ShareSquare 🔗](#sharesquare-)
- [Index ✏️](#index-️)
- [Process Of Sharing 🚀](#process-of-sharing-)
- [Setup 🍧](#setup-)
- [Technologies 🛠](#technologies-)
- [Author 📝](#author-)
- [Connect Me On 🌍](#connect-me-on-)
- [License 🏆](#license-)

## Process Of Sharing 🚀

- Click on the Start Sharing button to join the room.
- Enter the email of the person you want to share the files with.
- Once the person opens the link, the connection is established and is shown in the right side of the screen.
- Click on the upload button to upload the files/Or drag and drop the files to the screen.
- Click on the send button to send the files to the other person.
- Progress of the file transfer is shown in the progress bar.
- Once the file is sent, the file is shown in the right side of the screen.
- Click on the file to download the file.

## Setup 🍧

1. Fork the Repo

2. Clone the repo to your local machine
   `git clone https://github.com/iampranavdhar/sharesquare`

3. Get into the directory
   `cd sharesquare`

4. Create a env file and add the following variables

   ```env
   FIREBASE_API_KEY=
   FIREBASE_AUTH_DOMAIN=
   FIREBASE_PROJECT_ID=
   FIREBASE_STORAGE_BUCKET=
   FIREBASE_MESSAGING_SENDER_ID=
   FIREBASE_APP_ID=
   FIREBASE_MEASUREMENT_ID=
   ```

5. Go to the share.html in template and change the firebase config to your firebase config. For easy navigation, search for `@FirebaseChangeHere` in the share.html file
6. python3 app.py

7. Go to localhost:4000 to see the app running

## Technologies 🛠

- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [Firebase](https://firebase.google.com/)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Author 📝

- [@iampranavdhar](https://www.github.com/iampranavdhar)

## Connect Me On 🌍

[![twitter badge](https://img.shields.io/badge/twitter-Pranavdhar-0077b5?style=social&logo=twitter)](https://twitter.com/iampranavdhar)<br/>
[![linkedin badge](https://img.shields.io/badge/linkedin-Pranavdhar-0077b5?style=social&logo=linkedin)](https://in.linkedin.com/in/sai-pranavdhar-reddy-nalamalapu-038104206)

## License 🏆

This repository is licensed under MIT License. Find [LICENSE](LICENSE) to know more
