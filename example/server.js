(function($process) {

    "use strict";

    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var axios = require('axios');

    app.use(express.static(__dirname));
    app.get('/weather', function (request, response) {

        axios.get('http://marsweather.ingenology.com/v1/latest/').then(model => {
            response.send(model.data);
        });

    });

    server.listen($process.env.PORT || 5000);

})(process);
