# curate(me)
A music curator

# Installation
These instructions assume that you already have node installed on your system. If not, you can install the latest version from the NodeJS website.

After navigating to the app directory, use the following command to install the necessary node dependencies before running:

    npm install

After installing the requisite files, you will need to register an app with the Spotify Platform in order to receive your personalized client ID and client secret. Follow the below steps to incorporate those into the app's code.

## Client Info
Client authentication through Spotify is needed to use this curator. It is contained in the file specified in the curate.js route. The format is [client id]:[client secret], not including brackets. Please note the colon in between the two, and ensure that these are all on one line, and are the only thing in the client information file. There is an example file with old data in it for reference.

## Installing Client Dependencies
Once you have performed the above steps, navigate into the client folder from a terminal and (once more) install the node dependencies. These dependencies are for the client platform (the website you will be interacting with):

    npm install

# Run the app
After following the installation steps above, navigate to the root directory of the app from a terminal, and run the following command:

    npm start

You will now be able to access the app by going [here](http://localhost:3000/).

# How to use
Simply type in a song, artist or album and let the app curate a list of recommended songs for you! Have fun!

# Settings
The default port is 3000 for the client, and 3001 for the server. You can change the server port by editing bin/www, line 15. To edit the port that the client interacts with to make calls to the server, adjust the proxy address in client/package.json.
