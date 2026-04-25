from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    """Render the home page."""
    return render_template("home.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Render the login page and handle login form submission."""
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        print(f"[LOGIN] Email: {email} | Password: {password}")
    return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """Render the signup page and handle signup form submission."""
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        print(f"[SIGNUP] Name: {name} | Email: {email} | Password: {password}")
    return render_template("signup.html")


@app.route("/about-flask")
def about_flask():
    """Render the page describing Flask framework."""
    return render_template("about_flask.html")
@app.route("/about")
def about():
    """Render the about page."""
    return render_template("about.html")



if __name__ == "__main__":
    app.run(debug=True)
