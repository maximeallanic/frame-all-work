/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 19/11/2018
 */

const $q = require('q');
const $lodash = require('lodash');

var workingDirectory = __dirname + '/..';
var srcController = workingDirectory + '/app';

module.exports.load = (path, method) => {
    const deferred = $q.defer();

    try {
        var controllers = require(srcController + path);
        var currentController = controllers[ method ] || controllers[ $lodash.toLower(method) ];
        if (!currentController)
            throw new Error('not found');
        deferred.resolve(currentController)
    } catch (e) {
        deferred.reject(e);
    }

    return deferred.promise;
};