# MIDI-Controller-Web-Server
## Overview
This project serves to provide an intranet web server that can be used to control the `textual` port of [`Midi-Controller`](https://github.com/MM4096/Midi-Controller)

## Installation
### Pre-requisites
- [`Midi-Controller - textual`](https://github.com/MM4096/Midi-Controller) (version >= v0.5, THIS IS STILL A PRE-RELEASE VERSION!)

#### For Development
- `python3 (version >= 3.6)`
- `pip3`

### Installation
1. Go to the [releases](https://github.com/MM4096/MIDI-Controller-Web-Server/releases) page and download the latest release (or go to the [latest release](https://github.com/MM4096/MIDI-Controller-Web-Server/releases/latest)).
2. Extract the contents of the zip file to a directory of your choice.
3. Open a terminal and navigate to the directory where you extracted the contents.
4. Execute the executable with `./[app name here]`.
5. If the executable does not run, you may need to give it executable permissions with `chmod +x [app name here]`.

### Development
1. Clone the repository with `git clone https://github.com/MM4096/MIDI-Controller-Web-Server.git`.
2. Install the required dependencies with `pip3 install -r requirements.txt`.
3. Run the server with `python3 app.py`.


## Usage
The default port is `8090`.

Run the application with `./[app name here]`, with the following optional parameters:
- `--port PORT`: Runs the app on `PORT` (default: 8090)
- `--debug DEBUG`: Either `0` or `1` (default: 0), whether the app should run in debug mode or not.
- `--username USERNAME`: The username for the web server (if not provided, no authentication is required)
- `--password PASSWORD`: The password for the web server (if not provided and a username is given, a password is randomly generated and printed)

Then, you should see the following output:
```
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8089
 * Running on http://[ip]:8089
```
You can navigate to the last line's address to access the web server, on any device, as long as they are connected to the same network.

You *need* to start `Performance Mode` on the `Midi-Controller` application to start the webserver view.

Then, you are able to use the buttons on the bottom of the page to control the `Midi-Controller` application, as well as pressing the sound list to change to that patch.

## To-Do
- [ ] Fix latency
- [ ] Comments list and extended navigation
- [ ] Fix a bug with only one connection being stable
