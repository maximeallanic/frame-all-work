/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 20/11/2018
 */

const $moment = require('moment');
const $lodash = require('lodash');

function Logger(prefix) {
    var self = function () {
        var args = Array.from(arguments);
        if (self.prefix)
            args.unshift(self.prefix());
        args.unshift($moment().format('DD-MM-YY HH:mm:ss '));
        console.log.apply(console, args);
    };
    self.log = self;

    self.info = self.log;

    self.error = function () {
        var args = Array.from(arguments);
        if (self.prefix)
            args.unshift(self.prefix());
        console.log('\u0007');
        args.unshift($moment().format('DD-MM-YY HH:mm:ss '));
        console.error.apply(console, args);
    };

    self.newGroup = function (prefix) {
        if (!$lodash.isFunction(prefix) && !$lodash.isNil(prefix)) {
            var oldPrefix = prefix;
            prefix = () => $lodash.padEnd(oldPrefix, 24);
        }
        return new Logger(() => {
            if (self.prefix)
                return self.prefix() + '\t' + $lodash.padEnd(prefix(), 23);
            return $lodash.padEnd(prefix(), 23);
        });
    };

    self.prefix = prefix;

    return self;
};

module.exports = new Logger();