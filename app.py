from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cakes')
def cakes():
    return 'Yummy cakes!'

@app.route('/auth/code=<code>')
def auth(code):
    return render_template('auth.html', code=code)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
