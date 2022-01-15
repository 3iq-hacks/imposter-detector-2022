import speech_recognition # Speech recognition library
from moviepy.editor import * # Video editing library

GOOGLE_SPEECH_API_KEY = None # todo Get Google Speech Recognition API key (it'll still work without)


def convert_video_to_audio(filepath, newfilepath):
	VideoFileClip(filepath).audio.write_audiofile(newfilepath)

def get_text_from_audio(filepath):
	# Speech to text
	speechRecognizer = speech_recognition.Recognizer()
	with speech_recognition.AudioFile(filepath) as source:
		try:
			text = speechRecognizer.recognize_google(speechRecognizer.record(source), key = GOOGLE_SPEECH_API_KEY)
		except speech_recognition.UnknownValueError as no_speech:
			return "No speech detected"
		return text
