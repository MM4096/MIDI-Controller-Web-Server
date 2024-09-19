#!/bin/bash

cd "$(dirname "$0")"
source .venv/bin/activate
pyinstaller -F app.py --add-data modules:modules --add-data static:static --add-data templates:templates
