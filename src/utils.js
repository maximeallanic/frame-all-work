/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 19/11/2018
 */

var isDev = false;

module.exports.isDev = () => {
    return isDev;
};

module.exports.setDev = (flag) => {
    isDev = flag;
};