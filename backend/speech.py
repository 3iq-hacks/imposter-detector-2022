from typing import Tuple, Union
from lib.utils import recognizeResponseToDict
import lib.speech_recognition as speech_recognition # Speech recognition library
from google.cloud import speech_v1p1beta1 as speech
from moviepy.editor import * # Video editing library
from pydub import AudioSegment
import os


def convert_video_to_audio(filepath:str, newfilepath:str):
	VideoFileClip(filepath).audio.write_audiofile(newfilepath, codec = "pcm_s32le")



# Speech to text
# returns (converted_filepath, response)
def get_text_from_audio(filepath: str) -> Tuple[str, Union[str, speech.RecognizeResponse]]:
	"""
	Converts an audio file to text using Google Speech Recognition.
	:param filepath: The path to the audio file to convert.
	:return: The converted filepath and the response from Google Speech Recognition.
	"""

	actualFilepath = filepath

	if '.mp3' in filepath:
		# Converts mp3 to wav
		filepath = os.path.normcase(filepath)
		print(f'Converting {filepath} to wav')
		sound = AudioSegment.from_mp3(filepath)
		sound.export(f'{filepath}.converted.wav', format="wav")
		actualFilepath = f'{filepath}.converted.wav'

	speechRecognizer = speech_recognition.Recognizer()
	with speech_recognition.AudioFile(actualFilepath) as source:
		try:
			# Don't need the credentials_json because GOOGLE_APPLICATION_CREDNETIALS is set
			response = speechRecognizer.recognize_google_cloud(
				speechRecognizer.record(source),
				# Boost recognition for the sake of this demo
				# https://cloud.google.com/speech-to-text/docs/speech-adaptation
				speech_contexts = [{
					"phrases": ['sus', 'sussy', 'among us', 'among', 'amogus', 'amog'],
					"boost": 19.99
				}, {
					"phrases": ['sauce', 'amigos'],
					"boost": 0.01
				}],
				show_all=True
			)
		except speech_recognition.UnknownValueError as no_speech:
			response = "No speech detected"
			return actualFilepath, response

		print('Response: ' + str(recognizeResponseToDict(response)))

		alternative = response.results[0].alternatives[0] # only select the first alternative
		print("Transcript: {}".format(alternative.transcript))
		print("Confidence: {}".format(alternative.confidence))
		print('\n\nAlternative transcript:\n', alternative.transcript)

		for word_info in alternative.words:
			word = word_info.word
			start_time = word_info.start_time
			end_time = word_info.end_time

			print(f"Word: {word}, start_time: {start_time.total_seconds()}, end_time: {end_time.total_seconds()}")

		return actualFilepath, response


# add vine booms to the beginning of every word that's "sus"
# returns the filepath of the boomified file
def add_vine_booms(filepath:str, response: speech.RecognizeResponse) -> str:
	"""
	add vine booms to the beginning of every word that's "sus"
	returns the filepath of the boomified file

	:param filepath: the filepath of the audio file
	:param response: the response from the speech to text api
	:param returns: the filepath of the boomified file
	:return the filepath of the boomified file
	"""
	# Add the vine booms
	original_file = AudioSegment.from_file(filepath)
	vine_boom = AudioSegment.from_file('assets/vine_boom.wav').apply_gain(-1)

	for word in response.results[0].alternatives[0].words:
		if word.word == 'sus':
			original_file = original_file.overlay(vine_boom, position = ((word.start_time + word.end_time * 2) / 3).total_seconds() * 1000)

	original_file.export(f'{filepath}.boomified.wav', format="wav")
	return f'{filepath}.boomified.wav'
