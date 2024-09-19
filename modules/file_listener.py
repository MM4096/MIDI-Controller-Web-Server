import multiprocessing
import os
import time

from modules import file_manager


def run_watcher(queue: multiprocessing.Queue, path: str):
	cached_lines = []
	while True:
		if os.path.exists(file_manager.get_output_file_path()):
			with open(file_manager.get_output_file_path(), "r") as f:
				lines = [i.rstrip() for i in f.readlines()]
				if not lines:
					cached_lines = []
					continue
				elif lines == cached_lines:
					continue

				different_lines = []
				difference_found = False
				for index in range(len(lines)):
					if index >= len(cached_lines):
						different_lines.append(lines[index])
						difference_found = True
					elif difference_found:
						different_lines.append(lines[index])
					elif lines[index] != cached_lines[index]:
						different_lines.append(lines[index])
						difference_found = True

				cached_lines = lines
				for line in different_lines:
					queue.put(line)
		else:
			cached_lines = []

		time.sleep(0.1)