#!/usr/bin/env node
/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 19/11/2018
*/

'use strict';

const $utils = require('./src/utils');

$utils.setDev(true);

const Framework = require('./src');

var $framework = new Framework();

if (!$utils.isDev())
    $framework.enableHttpsRedirection();
else
    $framework.run(process.env.PORT);

module.exports = $framework.exportApp();