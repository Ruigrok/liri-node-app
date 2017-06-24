
var inquirer = require('inquirer');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

//=======TWITTER============================
var tweetKeys = keys.twitterKeys;

var client = new Twitter({
    consumer_key: tweetKeys["consumer_key"],
    consumer_secret: tweetKeys["consumer_secret"],
    access_token_key: tweetKeys["access_token_key"],
    access_token_secret: tweetKeys["access_token_secret"]
});

//=======SPOTIFY============================
var spotKeys = keys.spotifyKeys;

var spotify = new Spotify({
    id: spotKeys["client_ID"],
    secret: spotKeys["client_secret"]
});

//=======RANDOM============================
var randomArr;

fs.readFile("random.txt", "utf8", function(error, data) {

  if (error) {
    return console.log(error);
  }

  // Then split it by commas (to make it more readable)
  randomArr = data.split(",");
  console.log(randomArr);
});

//=======INQUIRER PROMPTS============================

var startLIRI = function () {
    inquirer.prompt([

        {
            type: "list",
            name: "choose",
            message: "What can Liri help you out with today?",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
        }

    ]).then(function (answers) {

        if (answers.choose === "my-tweets") {

            lookup["my-tweets"]();

        } else if (answers.choose === "spotify-this-song") {

            inquirer.prompt([
                {
                    type: "input",
                    name: "song",
                    message: "What song should we look up?",
                }

            ]).then(function (answers) {
                //console.log(answers.song);
                lookup["spotify-this-song"](answers.song);

            });

        } else if (answers.choose === "movie-this") {

            inquirer.prompt([
                {
                    type: "input",
                    name: "movie",
                    message: "What movie should we look up?",
                }

            ]).then(function (answers) {

                lookup["movie-this"](answers.movie);

            });

        } else if (answers.choose === "do-what-it-says") {

            lookup["do-what-it-says"]();

        }
    });
}


//=======RESTART INQUIRER============================
/*
    inquirer.prompt({
    name: "restart",
    type: "confirm",
    message: "Would you like to make another search?"
}).then(function (answer) {
    if (answer.again === true) {
       
        startLIRI();
    }
    else {
        console.log("That was fun. See you next time!");
    }
});
*/

//=======INITIALIZE CODE============================

startLIRI();

//=======GAME FUNCTIONS============================
var lookup = {

    "my-tweets": function () {
        var params = { screen_name: 'CuTheDog', count: 20 };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                console.log(
                    "=============================="
                    + "\nPrevious 20 Tweets: "
                    + "\n==============================");
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                }
            }
        });
    },

    "spotify-this-song": function (song) {
        spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var songQ = data.tracks.items;

            if (songQ[0] != undefined) {
                var currentName = songQ[0].name;

                var artists = songQ[0].artists;
                var currentArtists = [];

                for (var i = 0; i < artists.length; i++) {
                    currentArtists.push(artists[i].name);
                }

                var url = songQ[0].preview_url;
                var album = songQ[0].album.name;

                console.log(
                    "=============================="
                    + "\nHere's what I found: "
                    + "\nArtist(s): " + currentArtists
                    + "\nSong Name: " + currentName
                    + "\nSong Preview: " + url
                    + "\nAlbum: " + album
                    + "\n==============================");

            } else {
                console.log(
                    "=============================="
                    + "\nSorry, couldn't find that song!, but here's a good one: "
                    + "\nArtist(s): Ace of Base" + "\nSong Name: The Sign" + "\nSong Preview: " + "\nAlbum: Happy Nation");
                + "\n=============================="
            }
        });
    },

    "movie-this": function (movie) {

        var queryUrl = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movie + "&y=&plot=short&tomatoes=true&r=json";

        request(queryUrl, function (error, response, body) {

            if (!error && response.statusCode === 200) {

                body = JSON.parse(body);
                //console.log(body);

                if (body.Title != undefined) {

                    console.log(
                        "=============================="
                        + "\nHere's what I found: "
                        + "\nTitle: " + body.Title
                        + "\nYear: " + body.Year
                        + "\nIMDB Rating: " + body.imdbRating
                        + "\nProduced In: " + body.Country
                        + "\nPlot: " + body.Plot
                        + "\nActors: " + body.Actors
                        + "\nRotten Tomatoes URL: " + body.tomatoURL
                        + "\n==============================");

                } else {
                    var fillerMovie = "Mr. Nobody";
                    var queryUrl = "http://www.omdbapi.com/?apikey=40e9cece&t=" + fillerMovie + "&y=&plot=short&tomatoes=true&r=json";

                    request(queryUrl, function (error, response, body) {
                        if (!error && response.statusCode === 200) {

                            body = JSON.parse(body);

                            console.log(
                                "=============================="
                                + "\nSorry, couldn't find that movie!, but here's a good one: "
                                + "\nTitle: " + body.Title
                                + "\nYear: " + body.Year
                                + "\nIMDB Rating: " + body.imdbRating
                                + "\nProduced In: " + body.Country
                                + "\nPlot: " + body.Plot
                                + "\nActors: " + body.Actors
                                + "\nRotten Tomatoes URL: " + body.tomatoURL
                                + "\n==============================");

                        }
                    })
                }
            }
        })
    },

    "do-what-it-says": function () {

        lookup[randomArr[0]](randomArr[1]);

    }
};



