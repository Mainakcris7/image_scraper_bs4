import requests
from bs4 import BeautifulSoup
from urllib.request import urlretrieve
import os
import shutil
from flask import Flask, redirect, request, render_template, url_for, jsonify

app = Flask(__name__)

# This part sends request to the url, and returns the response


def search_images(url, headers):
    result = requests.get(url, headers=headers)
    return result.text


headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}


@app.route("/", methods=['GET', "POST"])
def home():
    if (request.method == 'GET'):
        return render_template("index.html")
    else:
        try:
            topic = request.json['query']
            # Create directory
            os.makedirs(f"./static/images/{topic}", exist_ok=True)
            data = search_images(
                url=f"https://unsplash.com/s/photos/{topic}", headers=headers)
            # Parse the response so that it can be scrapped
            soup = BeautifulSoup(data, 'html.parser')
            # Select all the images from the response
            images = soup.select("img")
            # Save the images to the directory
            i = 0
            for image in images:
                img_src = image.get("src")
                if "data:image" not in img_src and "profile" not in img_src:
                    urlretrieve(
                        img_src, f"./static/images/{topic}/{topic}-img-{i}.jpg")
                    i += 1
            # Create archive file
            shutil.make_archive(
                f"./static/images-archived", format='zip', root_dir=f'./static/images/{topic}')
            return jsonify({"topic": topic, "total": i})
        except Exception as e:
            print(e)
            return jsonify("error")


if __name__ == '__main__':
    app.run(port=8080, debug=False)
