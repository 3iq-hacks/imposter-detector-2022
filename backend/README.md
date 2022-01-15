# Backend

Backend build with Flask, hosted on Google App Engine.
Using [This blog](https://cloud.google.com/appengine/docs/standard/python3/building-app/writing-web-service) as reference.

## Installation

This app uses Python 3.9.9, so you need to either use that or use the virtual environment.
Follow virtual env steps in the [GCloud blog](https://cloud.google.com/appengine/docs/standard/python3/building-app/writing-web-service).

```bash
$ python -V # check python version - should be 3.9.9. If not, use pyenv or change it?? lol.
$ python -m venv env
$ source env/bin/activate
env $ python -V # should be 3.9.9
env $ pip install -r requirements.txt
env $ python main.py
```
