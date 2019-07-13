/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 19/11/2018
 */

module.exports = () => {
    const $chokidar = require('chokidar');

    var watcher = $chokidar.watch(srcController);

    var workingDirectory = __dirname + '/..';
    var srcService = workingDirectory + '/service';
    var srcController = workingDirectory + '/app';
    var srcMatcher = new RegExp(`^(${ srcService }|${ srcController })`);

    watcher.on('ready', function () {
        watcher.on('all', function () {
            Object.keys(require.cache).forEach(function (id) {
                if (srcMatcher.test(id))
                    delete require.cache[ id ]
            });
        });
    });
};