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
    }
    Base.prototype.setX = function (x) {
        this.x = x;
        this.low[0] = calx(this.x - this.w / 2);
    };
    Base.prototype.setY = function (y) {
        this.y = y;
        this.low[1] = caly(y - this.h / 2);
    };
    Base.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x - this.w / 2);
        this.low[1] = caly(y - this.h / 2);
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
        this.low = [calx(this.x - this.w / 2), caly(this.y - this.h / 2), calw(this.w), calh(this.h)];
    };
    return Base;
}());
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
        this.low = [calx(this.x), caly(this.y), calw(this.w), calh(this.h)];
    };
    Circle.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.strokeStyle = this.stroke[0];
            mna.lineWidth = this.stroke[1];
            mna.ellipse(this.low[0], this.low[1], this.low[2] / 2, this.low[3] / 2, 0, 0, 2 * Math.PI);
            // mna.arc(this.low[0],this.low[1],this.low[2]/2,0,2*Math.PI);
            if (this.filled) {
                mna.fillStyle = this.fill[0];
                mna.fill();
            }
            mna.stroke();
        }
    };
    return Circle;
}(Base));
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
            if (this.filled) {
                mna.fillStyle = this.fill[0];
                mna.fill();
            }
            mna.stroke();
        }
    };
    return Rectangle;
}(Base));
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    function Texture(img /*imgw:number,imgh:number,*/, x, y, w, h) {
        var _this = this;
        if (w && h) {
            _this = _super.call(this, x, y, w, h) || this;
        }
        else {
            _this = _super.call(this, x, y, 0, 0) || this;
        }
        _this.img = new Image();
        _this.img.src = img;
        return _this;
    }
    Texture.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.drawImage(this.img, this.low[0], this.low[1], this.low[2], this.low[3]);
            mna.stroke();
        }
    };
    return Texture;
}(Base));
var Drop = /** @class */ (function (_super) {
    __extends(Drop, _super);
    function Drop(radiusX, radiusY) {
        var _this = _super.call(this, 0, 0, radiusX, radiusY) || this;
        _this.time = 0;
        return _this;
    }
    Drop.prototype.startDrop = function (x, y) {
        this.time = Date.now();
        this.x = 0;
        this.y = 0;
        this.low[0] = x;
        this.low[1] = y;
    };
    Drop.prototype.precalc = function () {
        this.low = [this.x, this.y, calw(this.w), calh(this.h)];
    };
    Drop.prototype.draw = function () {
        var dt = (Date.now() - this.time);
        if (dt < 100) {
            //console.log(dt);
            if (this.visible) {
                mna.beginPath();
                mna.strokeStyle = this.stroke[0];
                mna.lineWidth = this.stroke[1];
                mna.ellipse(this.low[0], this.low[1], this.low[2] / 2 * dt / 100, this.low[3] / 2 * dt / 100, 0, 0, 2 * Math.PI);
                if (this.filled) {
                    mna.fillStyle = this.fill[0];
                    mna.fill();
                }
                mna.stroke();
            }
        }
    };
    return Drop;
}(Circle));
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
    list[0].cals(cnv.width / cnv.uw, cnv.height / cnv.uh, false);
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var o = list_1[_i];
        o.precalc();
    }
    console.log("calc: offsetx=" + cnv.ox + ", offsety=" + cnv.oy + ", unitw=" + cnv.uw + ", unith=" + cnv.uh);
}
function calx(x) {
    return (x + 810) * cnv.uw + cnv.ox;
}
function caly(y) {
    return (y + 500) * cnv.uh + cnv.oy;
}
function calw(w) {
    return w * cnv.uw;
}
function calh(h) {
    return h * cnv.uh;
}
//START
var cnv = {};
var list;
list = [new Texture("resources/background.png", 0, 0, 1920, 1080),
    new Drop(50, 50),
    new Rectangle(0, 0, 1620, 1000)
];
list[2].filled = true;
list[2].setFill("#ffffff");
list[2].visible = false;
calc();
refresh();
//EVENTS
window.onresize = calc;
document.onmousedown = function (event) {
    //console.log(Date.now());
    //console.log(event.pageX+" "+event.pageY);
    list[1].startDrop(event.pageX, event.pageY);
};
//REFRESH
function refresh() {
    requestAnimationFrame(refresh);
    mna.fillStyle = "#0b00ff";
    mna.fillRect(0, 0, cnv.width, cnv.height);
    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
        var o = list_2[_i];
        o.draw();
    }
}
