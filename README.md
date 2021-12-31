![cryptalk](/screenshot.png)

![Node.js CI](https://github.com/Hexagon/cryptalk/workflows/Node.js%20CI/badge.svg?branch=master)
[![npm version](https://badge.fury.io/js/cryptalk.svg)](https://badge.fury.io/js/cryptalk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/753ef40cec1747c2b5025f834635375b)](https://www.codacy.com/gh/Hexagon/cryptalk/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Hexagon/cryptalk&amp;utm_campaign=Badge_Grade)

# Cryptalk

Cyptalk is a HTML5/Node.js based, client side (E2EE) encrypted instant chat

## Features

*   Client side AES-256-CBC encryption/decryption (the server is just a messenger)
*   256 bit key derived from your passphrase using PBKDF2
*   Messages torched after a configurable delay, default is 600s.
*   Simple setup using npm, Docker or Heroku
*   Notification sounds (mutable)
*   Native popup notifications
*   Configurable page title
*   Nicknames, optional.
*   Quick-links using http://server/#Room:Passphrase, optional and insecure

## Installing

### Docker setup

To run latest cryptalk with docker, exposed on host port 80, simply run the following command to pull it from docker hub

```bash
sudo docker run -d --restart=always -p 80:8080 hexagon/cryptalk
```

### Heroku setup 

Click the button below

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hexagon/cryptalk)

### Docker setup without using docker hub

Clone this repo, enter the new directory.

Build image
```bash
docker build . --tag="hexagon/cryptalk"
```

Run container, enable start on boot, expose to port 80 at host
```bash
sudo docker run -d --restart=always -p 80:8080 hexagon/cryptalk
```

Browse to ```http://<ip-of-server>/```

Done!

### npm setup

Install node.js, exact procedure is dependant on platform and distribution.

Install the app from npm
```bash
npm install cryptalk -g
````

Then issue the following to start the app

```bash
cryptalk
```

Browse to ```http://localhost:8080```

Done!

## Usage

```

Available commands:

Client:                                                    			
	/key		StrongPassphrase	Sets encryption key                 
	/nick		NickName			Sets an optional nick                   
	/mute  							Audio on									
	/unmute  						Audio off									
	/clear							Clear on-screen buffer                      
	/help							This                                        
	/title							Set your local page title					
	/torch		AfterSeconds		Console messages are torched  		
									after this amount of seconds 					
									(default 600).									

Room:                                                    				
	/join		RoomId				Join a room	                            
	/leave							Leave the room                              
	/count							Count participants                          

Host:  		                                                                		
	/connect						Connect to host               	
	/disconnect						Disconnect from host    			        

You can select any of the five last commands/messages with up/down key.

Due to security reasons, /key command is not saved, and command         
history is  automatically cleared after one minute of inactivity.       

It is highly recommended to use incognito mode while chatting, 
to prevent browsers from keeping history or cache.            


```

## Development

Install node.js (development require >=12.0), exact procedure is dependant on platform and distribution.

Clone this repo
```bash
git clone https://github.com/Hexagon/cryptalk.git
cd cryptalk
```

Pull dependencies from npm
```bash
npm install
```

Start server
```bash
npm run start
```

Browse to ```http://localhost:8080```

To work on the JavaScript, edit the code in ```client/source/```. To test the changes, first run ```npm run build``` to lint, build and minify the code. Then restart the server.
