![cryptalk](/docs/screenshot.png)

Cyptalk is a HTML5/Node.js based encrypted instant chat

Features
========

  * Client side AES-256-CBC encryption/decryption (the server is just a messenger)
  * 256 bit key derived from your passphrase using PBKDF2
  * Optional nicknames
  * Random (UUID v4) channel name generation för less guessability
  * Quick-links (not recommended) using http://server/#Room:Passphrase
  * Super simple setup
  * ~~Flashing title on new messages~~


Setup
========

Install node.js, exact procedure is dependant on platform and distribution.

Clone this repo
```bash
git clone https://github.com/Hexagon/cryptalk.git
cd cryptalk
```

Pull express.io and node-uuid from npm.
```bash
npm install node-uuid express.io
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
    /generate 				         Generate random room                        
	/join		RoomId			     Join a room	                            
	/count					         Count participants of room                  
	/nick		NickName		     Sets an optional nick                   
	/key		OurStrongPassphrase	 Sets encryption key                 
	/leave					         Leave the room                              
	/clear					         Clear on-screen buffer                      
	/help					         This                                        
```
