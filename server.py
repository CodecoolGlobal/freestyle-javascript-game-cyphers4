from flask import Flask, render_template, jsonify, request
import datamanager


app = Flask(__name__)


@app.route("/")
def main():
    return render_template('index.html')


@app.route("/showscores", methods=['GET', 'POST'])
def get_scores():
    data = request.get_json()
    datamanager.write_score(data['username'], data['score'])
    return jsonify(datamanager.get_scores())


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True,
    )
