/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 19/11/2018
 */

const $process = require('process');
const $getFunctionArguments = require('./node_modules/get-function-arguments');

var workingDirectory = __dirname + '/..';
var srcService = workingDirectory + '/service';

var services = {};

module.exports.invoke = (fn, additionalServices) => {
    var args = $getFunctionArguments(fn);

    args = args.map((arg) => {
        if (additionalServices && additionalServices[ arg ])
            return module.exports.invoke(additionalServices[ arg ]);
        return module.exports.get(arg);
    });
    return fn.apply(null, args);
};

module.exports.get = (serviceName) => {
    var matcher = serviceName.match(/^\$(.*)$/);

    serviceName = matcher[ 1 ];
    if (!services[ serviceName ]) {
        var service = require(srcService + '/' + serviceName);
        services[ serviceName ] = module.exports.invoke(service);
    }
    return services[ serviceName ];
};