define('highscore',["require", "exports"], function (require, exports) {
    "use strict";
    var Highscore = (function () {
        function Highscore() {
            this.high = +(localStorage.getItem('highscore') || 0);
        }
        Highscore.prototype.update = function (score) {
            if (score > this.high) {
                this.high = score;
                localStorage.setItem('highscore', '' + score);
            }
            return this.high;
        };
        return Highscore;
    }());
    exports.Highscore = Highscore;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", 'aurelia-framework', './highscore'], function (require, exports, aurelia_framework_1, highscore_1) {
    "use strict";
    var App = (function () {
        function App(highscore) {
            this.highscore = highscore;
            this.boardSize = 8;
            this.init();
        }
        App.prototype.init = function () {
            this.message = 'Good Luck!';
            this.moves = 0;
            this.visited = {};
            for (var x_1 = 0; x_1 < this.boardSize; x_1++) {
                this.visited[x_1] = {};
                for (var y_1 = 0; y_1 < this.boardSize; y_1++) {
                    this.visited[x_1][y_1] = false;
                }
            }
            var x = Math.floor(Math.random() * this.boardSize);
            var y = Math.floor(Math.random() * this.boardSize);
            this.set(x, y);
        };
        App.prototype.set = function (x, y) {
            this.knight = { x: x, y: y };
            this.visit(x, y, true);
            this.moves++;
            this.high = this.highscore.update(this.moves);
        };
        App.prototype.sizeChanged = function () {
            this.init();
        };
        App.prototype.visit = function (x, y, visited) {
            this.visited[x][y] = visited;
        };
        App.prototype.isVisited = function (x, y) {
            return this.visited[x][y];
        };
        App.prototype.moveTo = function (x, y) {
            this.message = '';
            if (this.visited[x][y]) {
                return;
            }
            var dx = Math.abs(x - this.knight.x);
            var dy = Math.abs(y - this.knight.y);
            if ((dx == 1 || dx == 2) && dx + dy == 3) {
                this.set(x, y);
            }
            if (this.validMoves() === 0) {
                this.message = (this.moves === this.boardSize * this.boardSize ? 'Congratulations!' : 'Game over!');
            }
        };
        App.prototype.validMoves = function () {
            return this.validMove(2, 1) + this.validMove(1, 2) + this.validMove(-2, 1) + this.validMove(-1, 2) +
                this.validMove(2, -1) + this.validMove(1, -2) + this.validMove(-2, -1) + this.validMove(-1, -2);
        };
        App.prototype.hint = function () {
            var instance = this;
            var min = 10;
            var bestDx, bestDy;
            test(2, 1);
            test(1, 2);
            test(-2, 1);
            test(-1, 2);
            test(2, -1);
            test(1, -2);
            test(-2, -1);
            test(-1, -2);
            this.moveTo(this.knight.x + bestDx, this.knight.y + bestDy);
            function test(dx, dy) {
                var pa = instance.validMovesAfter(dx, dy);
                if (pa === 0) {
                    pa = 9;
                }
                if (pa > 0 && pa < min) {
                    min = pa;
                    bestDx = dx;
                    bestDy = dy;
                }
            }
        };
        App.prototype.validMovesAfter = function (dx, dy) {
            if (this.validMove(dx, dy) === 0) {
                return -1;
            }
            this.knight = { x: this.knight.x + dx, y: this.knight.y + dy };
            this.visit(this.knight.x, this.knight.y, true);
            var result = this.validMoves();
            this.visit(this.knight.x, this.knight.y, false);
            this.knight = { x: this.knight.x - dx, y: this.knight.y - dy };
            return result;
        };
        App.prototype.validMove = function (dx, dy) {
            var x = this.knight.x + dx;
            var y = this.knight.y + dy;
            return (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && !this.isVisited(x, y)) ? 1 : 0;
        };
        App = __decorate([
            aurelia_framework_1.inject(highscore_1.Highscore), 
            __metadata('design:paramtypes', [highscore_1.Highscore])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('numeric-format',["require", "exports"], function (require, exports) {
    "use strict";
    var NumericFormatValueConverter = (function () {
        function NumericFormatValueConverter() {
        }
        NumericFormatValueConverter.prototype.fromView = function (value) {
            var p = parseInt(value);
            return p >= 4 && p <= 12 ? p : 8;
        };
        return NumericFormatValueConverter;
    }());
    exports.NumericFormatValueConverter = NumericFormatValueConverter;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./style.css\"></require>\n  <require from=\"./numeric-format\"></require>\n\n  <div class=\"control\">\n    <h1>${message} &nbsp;</h1>\n\n    <div class=\"line\">\n      <label>Moves:</label>\n      <span class=\"data\">${moves}</span>\n    </div>\n    <div class=\"line\">\n      <label>Highscore:</label>\n      <span class=\"data\">${high}</span>\n    </div>\n    <div class=\"line\">\n      <label>Size:</label>\n      <input class=\"data\" type=\"number\" max=\"12\" min=\"3\" change.trigger=\"sizeChanged()\"\n             value.bind=\"boardSize | numericFormat\">\n    </div>\n\n    <div class=\"line\">\n      <button click.trigger=\"init()\">New Game</button>\n      <button click.trigger=\"hint()\">Hint</button>\n    </div>\n  </div>\n\n  <div class=\"field-container\">\n    <div class=\"field\">\n      <div repeat.for=\"x of boardSize\">\n        <div repeat.for=\"y of boardSize\" click.trigger=\"moveTo(x,y)\"\n             class=\"${(x+y)%2==0 ? 'black' : 'white'} ${x==knight.x && y==knight.y ? 'knight': ''} ${visited[x][y] ? 'visited':''}\">\n        </div>\n      </div>\n    </div>\n  </div>\n\n</template>\n"; });
define('text!style.css', ['module'], function(module) { module.exports = "html {\n  height: 100%;\n}\n\nbody {\n  height: 100%;\n  margin: 0;\n}\n\nlabel {\n  font-weight: bold;\n  float: left;\n}\n\n.line {\n  width: 15em;\n  height: 1em;\n  margin: auto;\n  clear: both;\n}\n\n.data {\n  float: right;\n}\n\n.control {\n  text-align: center;\n}\n\n.field-container {\n  top: 0;\n  position: absolute;\n  margin-top: 10em;\n  height: 100%;\n  width: 100%;\n}\n\n.field {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.field > div {\n  text-align: center;\n  height: 38px;\n}\n\n.field > div > div {\n  height: 30px;\n  width: 30px;\n  display: inline-block;\n}\n\n.black {\n  background-color: #666;\n  border: 4px solid #666;\n}\n\n.white {\n  background-color: #aaa;\n  border: 4px solid #aaa;\n}\n\n.visited {\n  background-image: url('src/cross.png');\n  background-size: contain;\n  background-repeat: no-repeat;\n}\n\n.knight {\n  background-image: url('src/knight.png');\n  background-size: contain;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map