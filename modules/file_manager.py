import platformdirs


def get_user_data_dir() -> str:
	return platformdirs.user_data_dir("MIDI-Controller", "mm4096")

def get_output_file_path() -> str:
	return get_user_data_dir() + "/output.txt"

def get_input_file_path() -> str:
	return get_user_data_dir() + "/commands.txt"

def append_to_commands_file(command: str):
	with open(get_input_file_path(), "a") as f:
		f.write(command + "\n")
