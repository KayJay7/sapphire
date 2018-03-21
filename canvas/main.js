var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mna = document.getElementById("mna").getContext("2d");
var Base = /** @class */ (function () {
    function Base(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.stroke = ["#000000", 1];
        this.fill = ["#000000"];
        this.visible = true;
        this.filled = false;
        // this.low=[];
    }
    Base.prototype.setX = function (x) {
        this.x = x;
        this.low[0] = calx(x - this.w / 2);
    };
    Base.prototype.setY = function (y) {
        this.y = y;
        this.low[1] = caly(y + this.h / 2);
    };
    Base.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x - this.w / 2);
        this.low[1] = caly(y + this.h / 2);
    };
    Base.prototype.setW = function (w) {
        this.w = w;
        this.low[2] = calw(w);
    };
    Base.prototype.setH = function (h) {
        this.h = h;
        this.low[3] = calh(h);
    };
    Base.prototype.setWH = function (w, h) {
        this.w = w;
        this.h = h;
        this.low[2] = calw(w);
        this.low[3] = calh(h);
    };
    Object.defineProperty(Base.prototype, "getX", {
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "getY", {
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "getLow", {
        get: function () {
            return this.low;
        },
        enumerable: true,
        configurable: true
    });
    Base.prototype.setStroke = function (val1, val2) {
        if (typeof val1 == "string") {
            this.stroke[0] = val1;
        }
        else {
            this.stroke[1] = val1;
        }
        if (val2) {
            this.stroke[1] = val2;
        }
    };
    Base.prototype.setFill = function (color) {
        this.fill = [color];
    };
    Base.prototype.cals = function (w, h, inside) {
        var iw = this.w, ih = this.h;
        if (inside) {
            if (iw * h < ih * w) {
                this.w = (h * iw) / ih;
                this.h = h;
            }
            else {
                this.w = w;
                this.h = (w * ih) / iw;
            }
        }
        else {
            if (iw * h < ih * w) {
                this.w = w;
                this.h = (w * ih) / iw;
            }
            else {
                this.w = (h * iw) / ih;
                this.h = h;
            }
        }
    };
    Base.prototype.precalc = function () {
        this.low = [calx(this.x - this.w / 2), caly(this.y + this.h / 2), calw(this.w), calh(this.h)];
    };
    return Base;
}());
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, w, h) {
        return _super.call(this, x, y, w, h) || this;
    }
    Rectangle.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.strokeStyle = this.stroke[0];
            mna.lineWidth = this.stroke[1];
            mna.rect(this.low[0], this.low[1], this.low[2], this.low[3]);
            mna.stroke();
            if (this.filled) {
                mna.fillStyle = this.fill[0];
                mna.fill();
            }
        }
    };
    return Rectangle;
}(Base));
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    function Texture(img, x, y, w, h) {
        var _this = _super.call(this, x, y, w, h) || this;
        _this.img = new Image();
        _this.img.src = img;
        return _this;
    }
    Texture.prototype.draw = function () {
        if (this.visible) {
            mna.drawImage(this.img, this.low[0], this.low[1], this.low[2], this.low[3]);
        }
    };
    return Texture;
}(Base));
var Word = /** @class */ (function (_super) {
    __extends(Word, _super);
    function Word(x, y, text, font, size) {
        var _this = _super.call(this, x, y, size, 0) || this;
        _this.text = text;
        _this.font = font;
        return _this;
    }
    Word.prototype.setX = function (x) {
        this.x = x;
        this.low[0] = calx(x);
    };
    Word.prototype.setY = function (y) {
        this.y = y;
        this.low[1] = caly(y);
    };
    Word.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x);
        this.low[1] = caly(y);
    };
    Word.prototype.precalc = function () {
        this.low = [calx(this.x), caly(this.y), calh(this.w)];
    };
    Word.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.fillStyle = this.fill[0];
            mna.font = this.low[2] + "px " + this.font;
            mna.textBaseline = 'middle';
            mna.textAlign = "center";
            mna.fillText(this.text, this.low[0], this.low[1]);
        }
    };
    return Word;
}(Base));
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, radiusX, radiusY) {
        return _super.call(this, x, y, radiusX * 2, radiusY * 2) || this;
    }
    Circle.prototype.setX = function (x) {
        this.x = x;
        this.low[0] = calx(x);
    };
    Circle.prototype.setY = function (y) {
        this.y = y;
        this.low[1] = caly(y);
    };
    Circle.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x);
        this.low[1] = caly(y);
    };
    Circle.prototype.precalc = function () {
        this.low = [calx(this.x), caly(this.y), calw(this.w) / 2, calh(this.h) / 2];
    };
    Circle.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.strokeStyle = this.stroke[0];
            mna.lineWidth = this.stroke[1];
            mna.ellipse(this.low[0], this.low[1], this.low[2], this.low[3], 0, 0, 2 * Math.PI);
            mna.stroke();
            if (this.filled) {
                mna.fillStyle = this.fill[0];
                mna.fill();
            }
        }
    };
    return Circle;
}(Base));
var Power = /** @class */ (function (_super) {
    __extends(Power, _super);
    function Power() {
        var _this = _super.call(this, 0, 0, 1, 1) || this;
        _this.step = 0;
        return _this;
    }
    Power.prototype.precalc = function () {
        this.low = [calx(this.x), caly(this.y), calw(this.w) / 2 + 400];
    };
    Power.prototype.draw = function () {
        var k = 1 - (2 * this.step / (180 + this.step));
        this.step = (this.step + 1) % 181;
        this.grd = mna.createRadialGradient(this.low[0], this.low[1], this.low[2] * k, this.low[0], this.low[1], (this.low[2] * k - 200 > 0) ? this.low[2] * k - 200 : 0);
        this.grd.addColorStop(0.000, "#1b1464");
        this.grd.addColorStop(0.500, "#2d75ff"); //"#003ce3"
        this.grd.addColorStop(1.000, "#1b1464");
        mna.beginPath();
        mna.fillStyle = this.grd;
        mna.fillRect(0, 0, cnv.width, cnv.height);
    };
    return Power;
}(Base));
var Drop = /** @class */ (function () {
    function Drop(radius) {
        this.radius = radius;
        this.drops = [];
    }
    Drop.prototype.startDrop = function (x, y) {
        this.drops.push([x, y, 0]);
        if (this.drops.length > 16) {
            this.drops.shift();
        }
    };
    Drop.prototype.draw = function () {
        var step;
        for (var i = 0; i < this.drops.length; i++) {
            step = this.drops[i][2];
            this.drops[i][2]++;
            if (step < 501) {
                step = 2 * step / (500 + step);
                mna.beginPath();
                mna.strokeStyle = "rgba(239,239,239," + (1 - step) + ")";
                mna.lineWidth = 2;
                mna.arc(this.drops[i][0], this.drops[i][1], this.radius * step, 0, 2 * Math.PI);
                mna.stroke();
            }
            else {
                this.drops.shift();
            }
        }
    };
    return Drop;
}());
var Roll = /** @class */ (function () {
    function Roll() {
        this.low = new Array(15);
    }
    Roll.prototype.precalc = function () {
        for (var i = 0; i < 15; i++) {
            this.low[i] = Math.round(cnv.width / 16 * (i + 1)) + 0.5;
        }
    };
    Roll.prototype.draw = function () {
        mna.beginPath();
        mna.strokeStyle = "#ffffff";
        mna.lineWidth = 1;
        for (var i = 0; i < 15; i++) {
            mna.moveTo(this.low[i], 0);
            mna.lineTo(this.low[i], cnv.height);
            mna.stroke();
        }
    };
    return Roll;
}());
var LineBetweenWords = /** @class */ (function () {
    function LineBetweenWords(w1, w2) {
        this.w1 = w1;
        this.w2 = w2;
    }
    LineBetweenWords.prototype.draw = function () {
        if (this.w1.visible && this.w2.visible) {
            mna.beginPath();
            mna.strokeStyle = "rgba(255,255,255," + Math.abs(1 - (Math.max(Math.abs(this.w1.getY), Math.abs(this.w2.getY)) / (Note.limit))) + ")";
            mna.lineWidth = 1;
            mna.moveTo(this.w1.getLow[0], this.w1.getLow[1]);
            mna.lineTo(this.w2.getLow[0], this.w2.getLow[1]);
            mna.stroke();
        }
    };
    return LineBetweenWords;
}());
var Note = /** @class */ (function () {
    function Note() {
        this.transitionTime = 60;
        this.score = new Array(8);
        this.lines = new Array(28);
        for (var i = 0; i < 8; i++) {
            this.score[i] = [new Word(0, 0, "", "arame", 50), 0, 0, 0, 0, 0, 0];
            this.score[i][0].setFill("#ffffff");
        }
        for (var i = 0, k = 1, j = 0; i < 28; i++, j++) {
            if (j == k) {
                j = 0;
                k++;
            }
            this.lines[i] = new LineBetweenWords(this.score[k][0], this.score[j][0]);
        }
    }
    Note.prototype.precalc = function () {
        for (var i = 0; i < 8; i++) {
            this.score[i][0].precalc();
        }
        Note.limit = cnv.h / 2 + 50;
    };
    Note.prototype.draw = function () {
        for (var i = 0; i < 8; i++) {
            var note = this.score[i][0];
            var position = this.score[i][1], height = this.score[i][2], wait = this.score[i][3], stall = this.score[i][4], phase = this.score[i][5], step = this.score[i][6];
            switch (phase) {
                case 0:
                    position = ((Math.random() * (14 + 14 + 1)) | 0) - 14; //da -14 a 14
                    height = ((Math.random() * (500 + 500 + 1)) | 0) - 500; //da -500 a 500
                    wait = ((Math.random() * (150 - 50 + 1)) | 0) + 50; //da 50 a 150
                    stall = ((Math.random() * (150 - 50 + 1)) | 0) + 50; //da 50 a 150
                    // console.log("position="+position+"\r\n"+"height="+height+"\r\n"+"wait="+wait+"\r\n"+"stall="+stall+"\r\n");
                    note.visible = false;
                    note.text = "do";
                    note.setX(cnv.w / 32 * position);
                    note.setY(-Note.limit);
                    phase++;
                    step = 0;
                    break;
                case 1:
                    if (step < wait) {
                        step++;
                    }
                    else {
                        note.visible = true;
                        phase++;
                        step = 0;
                    }
                    break;
                case 2:
                    if (step < this.transitionTime) {
                        note.setY((EasingFunctions.easeInOutCubic(step / this.transitionTime) * (height + Note.limit + 1)) - Note.limit);
                        step++;
                    }
                    else {
                        phase++;
                        step = 0;
                    }
                    break;
                case 3:
                    if (step < stall) {
                        step++;
                    }
                    else {
                        phase++;
                        step = 0;
                    }
                    break;
                case 4:
                    if (step < this.transitionTime) {
                        note.setY((EasingFunctions.easeInOutCubic(step / this.transitionTime) * (Note.limit - height + 1)) + height);
                        step++;
                    }
                    else {
                        phase = 0;
                        step = 0;
                    }
                    break;
            }
            this.score[i][1] = position;
            this.score[i][2] = height;
            this.score[i][3] = wait;
            this.score[i][4] = stall;
            this.score[i][5] = phase;
            this.score[i][6] = step;
            note.draw();
        }
        for (var i = 0; i < 28; i++) {
            this.lines[i].draw();
        }
    };
    return Note;
}());
//CALCULATE
function calc() {
    mna.canvas.width = mna.canvas.clientWidth;
    mna.canvas.height = mna.canvas.clientHeight;
    cnv.width = mna.canvas.width;
    cnv.height = mna.canvas.height;
    var iw = 81, ih = 50;
    var w = cnv.width, h = cnv.height;
    if (iw * h < ih * w) {
        iw = (h * iw) / ih;
        cnv.ox = (w - iw) / 2;
        cnv.oy = 0;
        cnv.uw = iw / 1620;
        cnv.uh = h / 1000;
    }
    else {
        ih = (w * ih) / iw;
        cnv.ox = 0;
        cnv.oy = (h - ih) / 2;
        cnv.uw = w / 1620;
        cnv.uh = ih / 1000;
    }
    cnv.w = cnv.width / cnv.uw;
    cnv.h = cnv.height / cnv.uh;
    list[0].cals(cnv.w, cnv.h, false);
    list[1].cals(cnv.w, cnv.h, false);
    for (var i = 0, max = list.length - 1; i < max; i++) {
        list[i].precalc();
    }
    // console.log("calc: offsetx="+cnv.ox+", offsety="+cnv.oy+", unitw="+cnv.uw+", unith="+cnv.uh);
}
function calx(x) {
    return (x + 810) * cnv.uw + cnv.ox;
}
function caly(y) {
    return (-y + 500) * cnv.uh + cnv.oy;
}
function calw(w) {
    return w * cnv.uw;
}
function calh(h) {
    return h * cnv.uh;
}
var EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) {
        return t;
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
        return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
        return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function (t) {
        return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function (t) {
        return (--t) * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function (t) {
        return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
        return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
        return 1 + (--t) * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
};
//START
var cnv = {};
var list;
list = [new Power(),
    new Texture("resources/background.png", 0, 0, 16, 9),
    new Roll(),
    new Note(),
    new Rectangle(0, 0, 1620, 1000),
    new Circle(0, -155, 50, 5),
    new Rectangle(0, -192, 47, 70),
    new Word(0, 0, "space 1966", "arame", 50),
    new Drop(300)
];
// list[1].visible=false;
list[4].visible = false;
list[4].setStroke("rgba(0,0,0,0)", 0);
list[4].filled = true;
list[4].setFill("#00ff0e");
list[5].filled = true;
list[5].setStroke("#ffffff");
list[5].setFill("rgba(255,20,20,0.6)");
list[6].filled = true;
list[6].setStroke("#ffffff");
list[6].setFill("rgba(255,20,20,0.6)");
list[7].setFill("#ff0026");
calc();
refresh();
//EVENTS
window.onresize = calc;
document.onmousedown = function (event) {
    list[list.length - 1].startDrop(event.pageX, event.pageY);
};
//REFRESH
function refresh() {
    requestAnimationFrame(refresh);
    // cnv.dt=Date.now();
    for (var i = 0, max = list.length; i < max; i++) {
        list[i].draw();
    }
}
