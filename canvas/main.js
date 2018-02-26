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
    function Base(x, y) {
        this.x = x;
        this.y = y;
        this.stroke = ["#000000", 1];
        this.fill = ["#000000"];
        this.visible = true;
        this.filled = false;
    }
    Base.prototype.setStroke = function (val1, val2) {
        if (typeof val1 == "string") {
            this.stroke[0] = val1;
        }
        else {
            this.stroke[1] = val1;
        }
        if (val2 != null) {
            this.stroke[1] = val2;
        }
    };
    Base.prototype.setFill = function (color) {
        this.fill = [color];
    };
    return Base;
}());
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, radius) {
        var _this = _super.call(this, x, y) || this;
        _this.radius = radius;
        return _this;
    }
    Circle.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.strokeStyle = this.stroke[0];
            mna.lineWidth = this.stroke[1];
            mna.arc(calx(this.x), caly(this.y), this.radius, 0, 2 * Math.PI);
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
    function Rectangle(x, y, width, height) {
        var _this = _super.call(this, x, y) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Rectangle.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.strokeStyle = this.stroke[0];
            mna.lineWidth = this.stroke[1];
            mna.rect(calx(this.x), caly(this.y), this.width, this.height);
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
    function Texture(img, imgw, imgh, x, y, width, height) {
        var _this = _super.call(this, x, y) || this;
        _this.width = width;
        _this.height = height;
        _this.img = new Image();
        _this.img.src = img;
        _this.imgw = imgw;
        _this.imgh = imgh;
        console.log(_this.w + "," + _this.h);
        return _this;
    }
    Texture.prototype.draw = function () {
        if (this.visible) {
            mna.beginPath();
            mna.drawImage(this.img, calx(this.x), caly(this.y), this.width, this.height);
            mna.stroke();
            console.log(this.w + "," + this.h);
        }
    };
    return Texture;
}(Base));
//CALCULATE
function calc() {
    mna.canvas.width = mna.canvas.clientWidth;
    mna.canvas.height = mna.canvas.clientHeight;
    cnv.width = mna.canvas.width;
    cnv.height = mna.canvas.height;
    cnv.w = cnv.width / 1000;
    cnv.h = cnv.height / 1000;
    cnv.cx = cnv.width / cnv.w / 2;
    cnv.cy = cnv.height / cnv.h / 2;
    var iw = 81, ih = 50;
    var w = cnv.width, h = cnv.height;
    var x = 0, y = 0;
    if (iw * h < ih * w) {
        iw = (h * iw) / ih;
        x += (w - iw) / 2;
        w = iw;
    }
    else {
        ih = (w * ih) / iw;
        y += (h - ih) / 2;
        h = ih;
    }
    console.log("canvas: size " + cnv.w + "," + cnv.h);
}
function calx(x) {
    // console.log("("+x+"+"+cnv.cx+")*"+cnv.w+"="+((x+cnv.cx)*cnv.w))
    return (x + cnv.cx) * cnv.w;
}
function caly(y) {
    // console.log("("+y+"+"+cnv.cy+")*"+cnv.h+"="+((y+cnv.cy)*cnv.h))
    return (y + cnv.cy) * cnv.h;
}
//START
var cnv = {};
calc();
var c1;
var r1;
var img1;
c1 = new Circle(1, 0, 20);
r1 = new Rectangle(0, 0, 50, 70);
img1 = new Texture("https://upload.wikimedia.org/wikipedia/commons/6/61/Caspar_David_Friedrich_-_Der_Wanderer_%C3%BCber_dem_Nebelmeer.jpg", -500, -500, 0, 0);
c1.filled = true;
r1.filled = true;
r1.setStroke("#032397", 5);
r1.setFill("#3e9a00");
c1.setFill("rgba(255,20,20,0.6)");
refresh();
//EVENTS
window.onresize = function () {
    calc();
};
//REFRESH
function refresh() {
    requestAnimationFrame(refresh);
    mna.fillStyle = "#d6cdd3";
    mna.fillRect(0, 0, cnv.width, cnv.height);
    r1.draw();
    c1.draw();
    img1.width = cnv.width;
    img1.height = cnv.height;
    img1.draw();
}
