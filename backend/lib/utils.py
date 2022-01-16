from typing import Dict
from google.cloud import speech_v1p1beta1 as speech
import os

def recognizeResponseToDict(res: speech.RecognizeResponse) -> dict[str, any]:
    output = {
        'transcript': '',
        'confidence': 0.0,
        'words': []
    }

    alternative = res.results[0].alternatives[0] # only select the first alternative
    output['transcript'] = alternative.transcript
    output['confidence'] = alternative.confidence

    for word_info in alternative.words:
        word = word_info.word
        start_time = word_info.start_time
        end_time = word_info.end_time

        output['words'] += [{
            'word': word,
            'start_time': start_time.total_seconds(),
            'end_time': end_time.total_seconds()
        }]

    return output

def cleanup(og: str, unboomified: str) -> str:
    """
    Removes files
    """
    new_name = og + '.boomified.wav'
    os.remove(og)
    os.remove(unboomified)
    os.rename(unboomified + '.boomified.wav', new_name)
    return new_name
