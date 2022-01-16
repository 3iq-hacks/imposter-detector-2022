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

reanscript =  {
    'transcript': 'sus sus amogus sus sus sus amogus sauce',
    'confidence': 0.9715206027030945,
    'words': [
        {'word': 'sus', 'start_time': 0.7, 'end_time': 1.2},
        {'word': 'sus', 'start_time': 1.2, 'end_time': 1.3},
        {'word': 'amogus', 'start_time': 1.3, 'end_time': 2.0},
        {'word': 'sus', 'start_time': 2.0, 'end_time': 3.2},
        {'word': 'sus', 'start_time': 3.2, 'end_time': 3.3},
        {'word': 'sus', 'start_time': 3.3, 'end_time': 3.8},
        {'word': 'amogus', 'start_time': 3.8, 'end_time': 4.6},
        {'word': 'sauce', 'start_time': 4.6, 'end_time': 5.6}
    ]
}