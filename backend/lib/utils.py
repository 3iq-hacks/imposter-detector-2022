from typing import Dict
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import storage
import os
import datetime
from pathlib import Path


def recognizeResponseToDict(res: speech.RecognizeResponse) -> Dict[str, any]:
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

# https://cloud.google.com/storage/docs/uploading-objects#storage-upload-object-code-sample
def upload_blob(bucket_name, source_file_name, blob_name) -> str:
    """Uploads a file to the bucket, making sure to prepend the datetime and stuff
    Returns the destination file name."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # blob_name = "storage-object-name" (will be prepended with the datetime)

    day = datetime.datetime.now().strftime("%Y-%m-%d")
    time = datetime.datetime.now().strftime("%H_%M_%S")
    destination_blob_name = f'{day}/{time}_{blob_name}'

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(
        "File {} uploaded to {}.".format(
            source_file_name, destination_blob_name
        )
    )

    return destination_blob_name


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"

    # The ID of your GCS object
    # source_blob_name = "storage-object-name"

    # The path to which the file should be downloaded
    # destination_file_name = "local/path/to/file"

    storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)

    # Construct a client side representation of a blob.
    # Note `Bucket.blob` differs from `Bucket.get_blob` as it doesn't retrieve
    # any content from Google Cloud Storage. As we don't need additional data,
    # using `Bucket.blob` is preferred here.
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

    print(
        "Downloaded storage object {} from bucket {} to local file {}.".format(
            source_blob_name, bucket_name, destination_file_name
        )
    )
