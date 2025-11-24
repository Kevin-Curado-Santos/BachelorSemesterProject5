import sys
from glob import glob
import itertools
import os, random

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, request, json, send_file, send_from_directory
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from pathlib import Path

from helper import get_timestamp


sys.path.append("api")
load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///study.sqlite3"
db = SQLAlchemy(app)


class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=False, nullable=False)
    options = db.Column(db.String(120), unique=False, nullable=False)
    vote = db.Column(db.String(80), unique=False, nullable=False)
    timestamp = db.Column(db.String(80), unique=False, nullable=False)


with app.app_context():
    db.create_all()


DATA_DIR = Path(os.path.dirname(__file__)).parent / "data" / "images"
USER_DATA_DIR = Path(os.path.dirname(__file__)).parent / "data" / "user_char"
AUDIO_DIR = Path(os.path.dirname(__file__)).parent / "data" / "audio"
TEXT_DIR = Path(os.path.dirname(__file__)).parent / "data" / "text"


BASE_DIR = Path(os.path.dirname(__file__))        # /app
DATA_DIR = BASE_DIR / "data"                      # /app/data
TEXT_DIR = DATA_DIR / "text"                      # /app/data/text



@app.route("/api/saveSurvey", methods=["POST"])
def save_survey():
    data = request.json

    os.makedirs("data/user_char", exist_ok=True)

    df = pd.DataFrame.from_dict(data, orient="index").T
    df.to_csv(f"data/user_char/{data['anonId']}.csv", index=False)
    ...

    response = json.jsonify("File received and saved!")
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response



@app.route("/api/saveComparisons", methods=["POST"], strict_slashes=False)
def save_comparisons():
    print(request.json, flush=True)
    uid = request.args.get("uid", type=str)
    
    vote = Vote(
        username=uid,
        options=str(request.json[0]),
        vote=str(request.json[1]),
        timestamp=get_timestamp(),
    )
    db.session.add(vote)
    db.session.commit()
    response = json.jsonify("File received and saved!")
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


@app.route("/api/saveAudio", methods=["POST"], strict_slashes=False)
def save_audio():
    f = request.files["file"]
    
    anonId = request.form.get("anonId", "unknown")
    tag = request.form.get("tag", "audio")

    os.makedirs(AUDIO_DIR, exist_ok=True)

    file_path = os.path.join(AUDIO_DIR, f"{anonId}_{tag}.webm")
    f.save(file_path)

    response = json.jsonify("File received and saved!")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/api/saveText", methods=["POST"], strict_slashes=False)
def save_text():
    f = request.files["file"]
    anonId = request.form.get("anonId", "unknown")
    tag = request.form.get("tag", "text")

    os.makedirs(TEXT_DIR, exist_ok=True)

    file_path = TEXT_DIR / f"{anonId}_{tag}.txt"

    f.save(file_path)

    resp = json.jsonify("Text received and saved!")
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp



@app.route("/api/logMedia", methods=["POST"])
def log_media():
    f = request.files["file"]
    anonId = request.form.get("anonId", "unknown")
    
    os.makedirs(TEXT_DIR, exist_ok=True)
    
    
    file_path = os.path.join(TEXT_DIR, f"{anonId}.txt")
    f.save(file_path)
    
    resp = json.jsonify("Text received and saved!")
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp


audio_flist = glob("data/audio/*_[0-9].webm")
audio_flist = np.array(audio_flist)
np.random.shuffle(audio_flist)
# TODO the number of comparisons 2 should be replaced
# [0, 1]
pairs = sorted(list(itertools.combinations(audio_flist, 2)))

sentinel_pairs = [
    ("link1", "link2"),
    ("link3", "link4"),
    ("link5", "link6"),
    ("link7", "link8"),
]


@app.route("/api/getCandidates")
@cross_origin()
def get_audio_pair(pairs=pairs):
    compare_idx = request.args.get("compare_idx", type=int)
    pair_idx = request.args.get("pair_idx", type=int)
    if compare_idx == len(pairs):
        return "done", 400
    if compare_idx == 0:
        np.random.shuffle(audio_flist)
        pairs = list(itertools.combinations(audio_flist, 2))
        print("shuffling.....", flush=True)

    return send_file(pairs[compare_idx][pair_idx], mimetype="audio/webm")


@app.route("/api/images", methods=["GET"])
def list_images():
    base_dir = os.path.join(os.path.dirname(__file__), "data", "images")
    ai_dir = os.path.join(base_dir, "ai")
    human_dir = os.path.join(base_dir, "human")

    ai_files = os.listdir(ai_dir) if os.path.isdir(ai_dir) else []
    human_files = os.listdir(human_dir) if os.path.isdir(human_dir) else []

    random.shuffle(ai_files)
    random.shuffle(human_files)

    ai_urls = [f"/api/image/ai/{f}" for f in ai_files]
    human_urls = [f"/api/image/human/{f}" for f in human_files]

    return json.jsonify({"ai": ai_urls, "human": human_urls})

@app.route("/api/image/<kind>/<filename>", methods=["GET"])
def serve_image(kind, filename):
    base_dir = os.path.join(os.path.dirname(__file__), "data", "images")
    folder = "ai" if kind == "ai" else "human"
    return send_from_directory(os.path.join(base_dir, folder), filename)


@app.route("/api/videos", methods=["GET"])
def list_videos():
    base_dir = os.path.join(os.path.dirname(__file__), "data", "videos")
    video_files = os.listdir(base_dir) if os.path.isdir(base_dir) else []

    video_urls = [f"/api/video/{f}" for f in video_files]

    return json.jsonify({"videos": video_urls})


@app.route("/api/video/<filename>", methods=["GET"])
def serve_video(filename):
    base_dir = os.path.join(os.path.dirname(__file__), "data", "videos")
    return send_from_directory(base_dir, filename)

