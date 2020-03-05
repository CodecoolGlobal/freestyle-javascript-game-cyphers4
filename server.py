from flask import Flask, render_template, jsonify, request
import datamanager


app = Flask(__name__)


@app.route("/")
def main():
    return render_template('index.html')


@app.route("/showscores", methods=['GET', 'POST'])
def get_scores():
    if request.method == 'POST':
        username = request.form['username']
        score = request.form['score']
        datamanager.write_score(username, score)
    return jsonify(datamanager.get_scores())


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True,
    )
