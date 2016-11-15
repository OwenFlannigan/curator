# curator
A music curator

# Installation
After navigating to the app direcory, use the following command to install the necessary node dependencies before running:

    npm install

After installing the requisite files, you will need to register an app with the Spotify Platform in order to recieve your personalized client ID and client secret. Follow the below steps to incorporate those into the app's code.

## Client Info
Client authentication through spotify is needed to use this curator. It is contained in the file specified in the curate.js route. The format is [client id]:[client secret], not including brackets. Please note the colon in between the two, and ensure that these are all on one line, and are the only thing in the client information file. There is an example file with old data in it for reference.

# How to use
Simply type in a song, artist or album and let the app curate a list of recommended songs for you!