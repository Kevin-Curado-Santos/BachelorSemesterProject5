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



BASE_DIR = Path(os.path.dirname(__file__))        # /app
DATA_DIR = BASE_DIR / "data"                      # /app/data
TEXT_DIR = DATA_DIR / "text"                      # /app/data/text
AUDIO_DIR = DATA_DIR / "audio"                    # /app/data/audio
USER_DATA_DIR = DATA_DIR / "user_char"            # /app/data/user_char
LOG_MEDIA_DIR = DATA_DIR / "media_logs"           # /app/data/media_logs



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


@app.route("/api/logRound", methods=["POST"])
def log_round():
    data = request.json
    anon = data.get("anonId", "unknown")

    LOG_DIR = Path("data/round_logs")
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    out_path = LOG_DIR / f"{anon}_rounds.jsonl"

    # append json line
    with open(out_path, "a") as f:
        f.write(json.dumps(data) + "\n")

    return json.jsonify({"status": "ok"})


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
    domain = request.args.get("domain", "landscapes")  # "landscape" from frontend

    # map logical domain to actual folder name
    folder_domain = "landscapes" if domain == "landscape" else domain

    base_dir = os.path.join(
        os.path.dirname(__file__), "data", "images", folder_domain
    )

    if not os.path.isdir(base_dir):
        return json.jsonify({"error": "unknown domain", "domain": domain}), 400

    if domain == "landscapes":  # still use logical name here
        human_dir = os.path.join(base_dir, "human")
        human_files = (
            [f for f in os.listdir(human_dir) if not f.startswith(".")]
            if os.path.isdir(human_dir)
            else []
        )

        model_dirs = [
            d
            for d in os.listdir(base_dir)
            if os.path.isdir(os.path.join(base_dir, d)) and d != "human"
        ]

        models = {}
        for m in model_dirs:
          m_dir = os.path.join(base_dir, m)
          m_files = [
              f for f in os.listdir(m_dir) if not f.startswith(".")
          ]
          models[m] = [
              f"/api/image/{domain}/{m}/{fname}" for fname in m_files
          ]

        human_urls = [
            f"/api/image/{domain}/human/{fname}" for fname in human_files
        ]

        return json.jsonify(
            {
                "domain": domain,
                "human": human_urls,
                "models": models,
            }
        )

    if domain == "celeb":
        fake_dir = os.path.join(base_dir, "fake")
        human_dir = os.path.join(base_dir, "human")

        fake_files = (
            [f for f in os.listdir(fake_dir) if not f.startswith(".")]
            if os.path.isdir(fake_dir)
            else []
        )
        human_files = (
            [f for f in os.listdir(human_dir) if not f.startswith(".")]
            if os.path.isdir(human_dir)
            else []
        )

        fake_urls = [
            f"/api/image/{domain}/fake/{fname}" for fname in fake_files
        ]
        human_urls = [
            f"/api/image/{domain}/human/{fname}" for fname in human_files
        ]

        return json.jsonify(
            {
                "domain": domain,
                "fake": fake_urls,
                "human": human_urls,
            }
        )

    return json.jsonify({"error": "unsupported domain", "domain": domain}), 400



@app.route("/api/image/<domain>/<category>/<filename>", methods=["GET"])
def serve_image_domain(domain, category, filename):
    folder_domain = "landscapes" if domain == "landscapes" else domain
    base_dir = os.path.join(
        os.path.dirname(__file__), "data", "images", folder_domain, category
    )
    return send_from_directory(base_dir, filename)





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

