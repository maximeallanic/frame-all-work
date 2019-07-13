/*
 * Copyright 2018 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic <maxime@allanic.me> at 19/11/2018
 */

module.exports = class GcloudResource {
    constructor (content) {
        this._content = content;
    }

    get(name) {
        return this._content.body[ name ];
    }
};