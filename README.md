# HackED 2022 Team 3IQ - 2022 Imposter Detector

By Aneeljyot Alagh, Curtis Kan, Joshua Ji, Pratham Arura, Vedant Vyas, and William Tran.

This project uses Google's App Engine to convert speech to text and detect sus audio. Pydub adds a funni vine boom sound effect every time there is a sus trigger word.

## Libraries Used

### Frontend

- [React-animation](https://formidable.com/open-source/react-animations/#:~:text=A%20collection%20of%20animations%20that,css) to animate the _Among Us_ figures (or, alternatively, to trap the _Among Us_ players forever).
- [Styled-components](https://styled-components.com/) for styling.
- [React-icons](https://react-icons.github.io/react-icons/) for the record button.
- [React-bootstrap](https://react-bootstrap.github.io/) for styling.
- [React-audio-player](https://www.npmjs.com/package/react-audio-player) for the website audio player.
- [mic-recorder-to-mp3](https://www.npmjs.com/package/mic-recorder-to-mp3) to save recorded audio to a file for upload.
- [Axios](https://www.npmjs.com/package/axios) for HTTP requests.

### Backend

- [Flask](https://flask.palletsprojects.com/en/2.0.x/) for the backend server.
- [Google Cloud Speech](https://cloud.google.com/speech-to-text), along with the Python [speech_recognition library](https://pypi.org/project/SpeechRecognition/).
- [Google Cloud Storage](https://cloud.google.com/storage) to store the audio files.
- [Google App Engine](https://cloud.google.com/appengine)) to run the backend server.
- [PyDub](https://github.com/jiaaro/pydub) to manipulate the audio files.

## Pictures/gifs References

- [Red Among Us PNG](https://www.graphicpie.com/wp-content/uploads/2020/11/red-among-us-png.png)
- [Among Us Character Green](https://www.enjpg.com/img/2020/among-us-character-14.png)
- [Rock Nodding](https://c.tenor.com/X24lJCALrgEAAAAd/rock-nodding.gif)
- [Rock sus](https://c.tenor.com/iVv-SN7A168AAAAM/the-rock-dwayne-johnson.gif)

## Screenshots

The website uses ReactJS and records audio, processes it, and returns the sussified audio clip.
![Screenshot (4)](https://user-images.githubusercontent.com/68800077/149674192-9374424b-9855-490b-b73c-a6293415dd5a.png)

It also has some animated crewmate flare and pictures of the Rock to reinforce the sus detector.
![Screenshot (5)](https://user-images.githubusercontent.com/68800077/149674223-4ef752f8-bbe2-436e-b592-d8e845504a5e.png)
