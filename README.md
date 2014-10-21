![cryptalk](/docs/screenshot.png)

![Build](https://travis-ci.org/Hexagon/cryptalk.svg)

Cyptalk is a HTML5/Node.js based, client side (E2EE) encrypted instant chat

Features
========

  * Client side AES-256-CBC encryption/decryption (the server is just a messenger)
  * 256 bit key derived from your passphrase using PBKDF2
  * Optional nicknames
  * Random (UUID v4) channel name generation for less guessability
  * Quick-links (not recommended) using http://server/#Room:Passphrase
  * Super simple setup
  * Notification sounds (mutable)
  * Native popup notifications
  * Configurable page title
  * Heroku support



Heroku setup 
========

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hexagon/cryptalk)


Regular setup
========

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


Developer setup
========

Install node.js, exact procedure is dependant on platform and distribution.

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
node server.js
```

Browse to ```http://localhost:8080```

Usage
========

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
                                                                       
Room:                                                    	     
	/join		RoomId				Join a room	         
	/leave							Leave the room          
	/count							Count participants 
                                                                       
Host:  		                                                    	
	/hosts							List available hosts   
	/connect	HostIndex			Connect to selected host    
	/disconnect						Disconnect from host         
                                                                       
You can select any of the five last commands/messages with up/down key.
                                                                       
Due to security reasons, /key command is not saved, and command        
history is  automatically cleared after one minute of inactivity.      

```
