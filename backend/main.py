import os
from flask import *
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from speech import *
from lib.utils import recognizeResponseToDict, cleanup

load_dotenv()


UPLOAD_FOLDER = '/files'
ALLOWED_EXTENSIONS = {'mp4', 'mp3', 'wav'}

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = app.root_path + UPLOAD_FOLDER

def allowed_file_type(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
	if request.method == 'POST':
		# check if the post request has the file part
		if 'file' not in request.files:
			return redirect(request.url)
		file = request.files['file']
		if file.filename == '':
			return redirect(request.url)
		if file and allowed_file_type(file.filename):
			filename = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			return redirect(url_for('download_file', name=secure_filename(file.filename)))
	return'''
	<!doctype html>
	<title>Upload new File</title>
	<h1>Upload new File</h1>
	<form method=post enctype=multipart/form-data>
	  <input type=file name=file>
	  <input type=submit value=Upload>
	</form>
	'''


@app.route('/processed/<name>')
def download_file(name):
	originalFilePath = os.path.join(app.config['UPLOAD_FOLDER'], name)
	print(f'GET /processed/{name}: Retrieving filepath {originalFilePath}')
	unBoomifiedFile, res = get_text_from_audio(originalFilePath)

	if (isinstance(res, str)):
		return make_response(res, 200)

	boomified = add_vine_booms(unBoomifiedFile, res)
	response_data = recognizeResponseToDict(res)

	# removes files, except for boomified file
	# also renames boomified file
	cdnFileName = cleanup(originalFilePath, unBoomifiedFile)
	response_data['file_name'] = cdnFileName.split('/')[-1]

	return make_response(jsonify(response_data), 200)


# basically a CDN to deliver the files
@app.route('/cdn/<name>')
def deliver_file(name):
	filePath = os.path.join(app.config['UPLOAD_FOLDER'], name)
	print(f'GET /cdn/{name}: Sending file {filePath}')

	return send_file(filePath, as_attachment=False)


if __name__ == '__main__':
	# This is used when running locally only. When deploying to Google App
	# Engine, a webserver process such as Gunicorn will serve the app. This
	# can be configured by adding an `entrypoint` to app.yaml.
	# Flask's development server will automatically serve static files in
	# the "static" directory. See:
	# http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
	# App Engine itself will serve those files as configured in app.yaml.
	app.run(host='127.0.0.1', port=8080, debug=True)
