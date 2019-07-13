// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');

const $bodyParser = require("body-parser");
const $q = require('q');

const $controller = require('./controller');
const $utils = require('./utils');
const $service = require('./service');
const $watcher = require('./watcher');

const Resource = require('./wrapper/resource');
const Request = require('./wrapper/request');


module.exports = class Framework {
    constructor () {
        this._app = express();

        this._app.set('trust proxy', true);

        // Enable static file
        this._app.use(express.static('src'));

        this._app.use($bodyParser.urlencoded({
            extended: true
        }));

        this._app.use($bodyParser.json());

        var provider = this.getProvider();

        this._app.use((req, res, next) => {
            $controller.load(req.originalUrl, req.method)
                .then((controller) => {
                    return $q($service.invoke(controller, {
                        $request: () => {
                            return new Request(req, provider);
                        },
                        $resource: () => {
                            return new Resource(res, provider);
                        }
                    }))
                        .then((content) => {
                            console.log(content);
                            res.send(content);
                        }, (error) => {
                            console.error(error);
                            res.send(error);
                        });
                }, (error) => {
                    next();
                })
                .catch(console.error);
        });
    }

    getProvider() {
        return 'gcloud';
    }

    setNodeModule() {
        // Enable static node_modules
        [
            'bootstrap/dist/css/bootstrap.min.css'
        ].forEach((nodeModule) => {
            var nodePath = `node_modules/${ nodeModule }`;

            app.get('/' + nodePath, (req, res) => {
                res.sendFile(__dirname + '/' + nodePath);
            });
        });
    }

    enableHttpsRedirection() {
        // Enable https redirection
        this._app.use(function (req, res, next) {
            if (req.get('X-FORWARDED-PROTO') === 'https')
                // request was via https, so do no special handling
                next();
            else
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        });
    }

    deploy() {
        var $deployer = require('./wrapper/deployer');
        return $deployer.deploy(this.getPlatform());
    }

    run(port) {
        if ($utils.isDev())
            // Start the server
            var server = this._app.listen(port || 8090, () => {
                var port = server.address().port;
                console.log(`App listening on port ${ port }`);
                $watcher();
            });
    }

    exportApp() {
        return this._app;
    }
};
