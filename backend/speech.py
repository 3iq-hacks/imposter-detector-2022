import speech_recognition # Speech recognition library
from moviepy.editor import * # Video editing library
from pydub import AudioSegment
import os



GOOGLE_SPEECH_API_KEY = None # todo Get Google Speech Recognition API key (it'll still work without)


def convert_video_to_audio(filepath:str, newfilepath:str):
	VideoFileClip(filepath).audio.write_audiofile(newfilepath, codec = "pcm_s32le")

# Speech to text
def get_text_from_audio(filepath:str):
	if '.mp3' in filepath:
		# Converts mp3 to wav
		filepath = os.path.normcase(filepath)
		print(f'Converting {filepath} to wav')
		sound = AudioSegment.from_mp3(filepath)
		sound.export("test.wav", format="wav")

	speechRecognizer = speech_recognition.Recognizer()
	with speech_recognition.AudioFile(filepath) as source:
		try:
			text = speechRecognizer.recognize_google(speechRecognizer.record(source), key = GOOGLE_SPEECH_API_KEY)
		except speech_recognition.UnknownValueError as no_speech:
			return "> No speech detected"
		return text
