/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 19/11/2018
 */
const $nodemailer = require('nodemailer');
const { google } = require('googleapis');
let privatekey = require("../../private.json");
const $q = require('q');

function makeBody(from, to, subject, message) {
    var btoa = require('btoa');
    var str = [ "Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');
    return btoa(str);
}

module.exports = () => {
    return function (from, to, subject, body) {
        let jwtClient = new google.auth.JWT(
            privatekey.client_email,
            null,
            privatekey.private_key,
            [ 'https://mail.google.com/',
                'https://www.googleapis.com/auth/gmail.modify',
                'https://www.googleapis.com/auth/gmail.compose',
                'https://www.googleapis.com/auth/gmail.send' ], 'pierre.toussaint@horasis.fr');
        //authenticate request
        const deferred = $q.defer();
        try {
            jwtClient.authorize(function (error, tokens) {
                if (error)
                    return deferred.reject(error);

                var gmail = google.gmail({ version: 'v1', auth: jwtClient })

                var raw = makeBody(from, to, subject, body);

                gmail.users.messages.send({
                    auth: jwtClient,
                    userId: 'me',
                    resource: {
                        raw: raw
                    }
                }, (error, result) => {
                    if (error)
                        return deferred.reject(error);
                    return deferred.resolve(result);
                });
            });
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }
}