import os
from flask import *
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from speech import *
from lib.utils import recognizeResponseToDict, cleanup
from flask_cors import CORS

load_dotenv()


UPLOAD_FOLDER = '/files'
ALLOWED_EXTENSIONS = {'mp4', 'mp3', 'wav'}

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = app.root_path + UPLOAD_FOLDER

def allowed_file_type(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
	if request.method == 'POST':
		# check if the post request has the file part
		print(request.files)
		if 'file' not in request.files:
			print('GET /: No Files!')
			return redirect(request.url)
		else:
			print('GET /: Files!')

		file = request.files['file']
		if file.filename == '':
			print('GET /: No File Name!')
			return make_response(jsonify({'error': 'No ilename'}), 400)
		elif not allowed_file_type(file.filename):
			print('GET /: Not Allowed File Type!', file.filename)
			return make_response(jsonify({'error': 'File type not allowed'}), 400)
		else:
			filename = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

			name = file.filename

			# Convert file
			originalFilePath = os.path.join(app.config['UPLOAD_FOLDER'], name)
			print(f'GET /processed/{name}: Retrieving filepath {originalFilePath}')
			unBoomifiedFile, res = get_text_from_audio(originalFilePath)

			if (res == 'No speech detected'):
				return make_response(jsonify({'error': 'No speech detected'}), 200)

			if (isinstance(res, str)):
				return make_response(res, 200)

			boomified, triggerword_count, length = add_vine_booms(unBoomifiedFile, res)
			response_data = recognizeResponseToDict(res)
			response_data['count'] = triggerword_count
			response_data['length'] = length

			# removes files, except for boomified file
			# also renames boomified file
			cdnFileName = cleanup(originalFilePath, unBoomifiedFile)
			response_data['file_name'] = cdnFileName.split('/')[-1]

			return make_response(jsonify(response_data), 200)
	else:
		return'''
		<!doctype html>
		<title>Upload new File</title>
		<h1>Upload new File</h1>
		<form method=post enctype=multipart/form-data>
		<input type=file name=file>
		<input type=submit value=Upload>
		</form>
		'''


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
