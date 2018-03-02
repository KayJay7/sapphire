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
    function Texture(img, x, y, w, h) {
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
            if (this.filled) {
                mna.fillStyle = this.fill[0];
                mna.fill();
            }
            mna.stroke();
        }
    };
    return Circle;
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
        this.x = x;
        this.y = y;
    };
    Drop.prototype.draw = function () {
        var dt = (Date.now() - this.time);
        if (dt < 100) {
            if (this.visible) {
                mna.beginPath();
                mna.strokeStyle = this.stroke[0];
                mna.lineWidth = this.stroke[1];
                mna.ellipse(this.x, this.y, this.w * dt / (100 + dt), this.h * dt / (100 + dt), 0, 0, 2 * Math.PI);
                console.log(this.w * dt / (100 + dt) + "x" + this.h * dt / (100 + dt));
                // if(this.filled){
                //     mna.fillStyle=this.fill[0];
                //     mna.fill();
                // }
                mna.stroke();
            }
        }
    };
    return Drop;
}(Circle));
var Power = /** @class */ (function () {
    function Power() {
    }
    Power.prototype.precalc = function () {
        this.low = [calx(this.x - this.w / 2), caly(this.y - this.h / 2), calw(this.w), calh(this.h)];
    };
    Power.prototype.draw = function () {
    };
    return Power;
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
    for (var i = 0, max = list.length - 1; i < max; i++) {
        list[i].precalc();
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
    new Rectangle(0, 0, 1620, 1000),
    new Circle(0, -155, 50, 5),
    new Rectangle(0, -192, 47, 70),
    new Drop(20, 20)
];
list[1].filled = true;
list[1].setFill("rgba(167,167,167,0.6)");
list[1].visible = false;
list[2].filled = true;
list[2].setFill("rgba(255,20,20,0.6)");
list[3].filled = true;
list[3].setFill("rgba(255,20,20,0.6)");
list[4].setStroke("#efefef", 2);
calc();
refresh();
//EVENTS
window.onresize = calc;
document.onmousedown = function (event) {
    list[4].startDrop(event.pageX, event.pageY);
};
//REFRESH
function refresh() {
    requestAnimationFrame(refresh);
    // Create gradient
    var grd = mna.createRadialGradient(150.000, 150.000, 0.000, 150.000, 150.000, 150.000);
    // Add colors
    grd.addColorStop(0.002, 'rgba(27, 20, 100, 1.000)');
    grd.addColorStop(0.350, 'rgba(27, 20, 100, 1.000)');
    grd.addColorStop(0.500, 'rgba(58, 43, 213, 1.000)');
    grd.addColorStop(0.650, 'rgba(27, 20, 100, 1.000)');
    grd.addColorStop(1.000, 'rgba(27, 20, 100, 1.000)');
    // Fill with gradient
    mna.fillStyle = grd;
    mna.fillRect(0, 0, cnv.width, cnv.height);
    for (var i = 0, max = list.length; i < max; i++) {
        list[i].draw();
    }
}
