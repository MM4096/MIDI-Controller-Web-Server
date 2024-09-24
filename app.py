import argparse
import multiprocessing

import platformdirs
from flask import Flask, render_template, request, abort, redirect, url_for

from modules.file_listener import run_watcher
from modules.file_manager import get_output_file_path, get_user_data_dir, append_to_commands_file
from modules.error_text import FORBIDDEN_MESSAGES, NOT_FOUND_MESSAGES

flask_port = 8090

app = Flask(__name__)


approved_ips: list = ["empty string to make the functions happy"]
allowed_endpoints: list = ["login", "static"]
show_login_page_endpoints: list = ["index"]
login_info = {
	"username": "",
	"password": "",
}

@app.errorhandler(403)
def forbidden(e):
	return render_template("errors/403.html", message=random.choice(FORBIDDEN_MESSAGES)), 403

@app.errorhandler(404)
def page_not_found(e):
	return render_template("errors/404.html", message=random.choice(NOT_FOUND_MESSAGES)), 404

@app.before_request
def limit_remote_addr():
	if login_info["username"] == "":
		pass
	elif approved_ips:
		client_ip = request.remote_addr
		if not request.endpoint in allowed_endpoints and client_ip not in approved_ips:
			if request.endpoint in show_login_page_endpoints:
				return redirect(url_for('login'))
			return abort(403)

@app.route('/')
def index():
	return render_template("index.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		ip = request.remote_addr
		if ip:
			username = request.form.get('username')
			password = request.form.get('password')

			if username == login_info["username"] and password == login_info["password"]:
				approved_ips.append(ip)
				return redirect(url_for('index'))
			else:
				return render_template("login.html", error="Invalid username or password")

	return render_template("login.html")

#region sending commands
@app.route('/command/<this_command>', methods=['POST'])
def command(this_command):
	if this_command != "":
		append_to_commands_file(this_command)
	return "Command sent"
#endregion

#region receiving commands
def get_queue_data(queue: multiprocessing.Queue) -> list:
	data = []
	while not queue.empty():
		data.append(queue.get())
	return data

@app.route('/get_commands', methods=['GET'])
def get_commands():
	return get_queue_data(file_change_queue)

@app.route("/get_all_commands", methods=['GET'])
def get_all_commands():
	with open(get_output_file_path(), "r") as f:
		return [i.rstrip() for i in f.readlines()]
#endregion


started_running = False
if __name__ == '__main__':
	#region run_args
	parser = argparse.ArgumentParser(description="Run the MIDI-Controller server")
	parser.add_argument("--port", type=int, help=f"The port to run the server on (default: {flask_port})",
						default=flask_port)
	parser.add_argument("--debug", type=int, help="Run the server in debug mode (0 or 1)", default=0)
	parser.add_argument("--username", type=str, help="The username to use for the server. "
													 "If empty, authentication is disabled.", default="")
	parser.add_argument("--password", type=str, help="The password to use for the server. "
													 "Defaults to a random string that is printed on server start", default="")

	args = parser.parse_args()
	flask_port = args.port
	#endregion

	file_listener_thread = None
	if not started_running:
		file_change_manager = multiprocessing.Manager()
		file_change_queue = file_change_manager.Queue()

		file_listener_thread = multiprocessing.Process(target=run_watcher, args=(
			file_change_queue,
			get_user_data_dir(),
		))
		file_listener_thread.start()
		started_running = True

	login_info["username"] = args.username
	if args.username == "":
		login_info["password"] = ""
		print("Authentication disabled")
	elif args.password == "":
		import random
		import string
		args.password = ''.join(random.choices(string.ascii_uppercase + string.digits, k=16))
		print(f"Generated password: {args.password}")
	login_info["password"] = args.password

	app.run(debug=args.debug == 1, port=flask_port, host="0.0.0.0", use_reloader=False)

	file_listener_thread.terminate()
	file_listener_thread.join()
