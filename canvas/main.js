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
        this.low = new Array();
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
        var _this = _super.call(this, x, y, 0, size) || this;
        _this.text = text;
        _this.font = font;
        return _this;
    }
    Word.prototype.precalc = function () {
        this.low = [calx(this.x), caly(this.y), calh(this.h)];
    };
    Word.prototype.draw = function () {
        // console.log(this.low[2]);
        mna.font = this.low[2] + "px " + this.font;
        mna.textAlign = "center";
        mna.fillText(this.text, this.low[0], this.low[1]);
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
var Drop = /** @class */ (function (_super) {
    __extends(Drop, _super);
    function Drop(radius) {
        var _this = _super.call(this, 0, 0, radius * 2, radius * 2) || this;
        _this.start = -1;
        return _this;
    }
    Drop.prototype.startDrop = function (x, y) {
        this.start = cnv.dt; //Date.now();
        this.x = x;
        this.y = y;
    };
    Drop.prototype.draw = function () {
        var a = (cnv.dt - this.start);
        if (a < 151) {
            mna.beginPath();
            mna.strokeStyle = "#efefef";
            mna.lineWidth = 2;
            mna.arc(this.x, this.y, this.w * a / (150 + a), 0, 2 * Math.PI);
            mna.stroke();
        }
    };
    return Drop;
}(Base));
var Power = /** @class */ (function (_super) {
    __extends(Power, _super);
    function Power(x, y, w, h) {
        var _this = _super.call(this, x, y, w, h) || this;
        _this.time = 0;
        return _this;
    }
    Power.prototype.precalc = function () {
        _super.prototype.precalc.call(this);
        this.lowc = [calx(this.x), caly(this.y), this.low[2] / 2 + 300];
    };
    Power.prototype.draw = function () {
        var a = cnv.dt % 3001, k = 1 - (2 * a / (3000 + a));
        this.grd = mna.createRadialGradient(this.lowc[0], this.lowc[1], this.lowc[2] * k, this.lowc[0], this.lowc[1], (this.lowc[2] * k - 200 > 0) ? this.lowc[2] * k - 200 : 0);
        this.grd.addColorStop(0.000, "#1b1464");
        this.grd.addColorStop(0.500, "#003ce3");
        this.grd.addColorStop(1.000, "#1b1464");
        mna.beginPath();
        mna.fillStyle = this.grd;
        mna.fillRect(this.low[0], this.low[1], this.low[2], this.low[3]);
    };
    return Power;
}(Base));
var Roll = /** @class */ (function () {
    function Roll() {
        this.low = new Array(15);
    }
    Roll.prototype.precalc = function () {
        for (var i = 0; i < 15; i++) {
            this.low[i] = Math.round(cnv.width * (i + 1) / 16) + 0.5;
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
var Note = /** @class */ (function () {
    function Note() {
        this.score = new Array(8);
        var dt = Date.now();
        for (var i = 0; i < 8; i++) {
            this.score[i] = [new Word(0, 0, "DO", "arame", 50), 0, 0, dt];
            //random();
            this.score[i][0].setX(((Math.random() * 14 | 0) + 1) * cnv.w / 15);
            this.score[i][1] = (((Math.random() * 5) | 0) + 1) * 1000;
            this.score[i][2] = (Math.random() * cnv.h) | 0;
            console.log(this.score[i][1] + " " + this.score[i][2] + " " + this.score[i][3]);
        }
    }
    Note.prototype.precalc = function () {
        for (var i = 0; i < 8; i++) {
            this.score[i][0].precalc();
        }
    };
    Note.prototype.draw = function () {
        // //VARIABILI CHE ANDRANNO RIVISTE POI
        // const trt:number=7000;//transition time
        //
        // for(let i:number=0;i<8;i++){
        //     let note:Word=this.score[i][0],idle:number=this.score[i][1],stall:number=this.score[i][2],ct:number=cnv.dt-this.score[i][3];
        //
        //     if(ct>stall){
        //         if(ct<idle+trt){
        //             note.setY((ct-idle)/trt*stall);//qua metteremo l'ease
        //             console.log(this.score[i][1]+" "+this.score[i][2]+" "+this.score[i][3]+" AAA");
        //         }else {
        //             if(ct>(2*idle)+trt){
        //                 note.setY(((ct-(2*idle)+trt)/trt*(1000-stall))+stall);
        //                 console.log(this.score[i][1]+" "+this.score[i][2]+" "+this.score[i][3]+" BBB");
        //             }else{
        //                 /*(Math.random() * 6 | 0) + 1
        //                 ~~(Math.random() * 6) + 1*/
        //                 //Double Tilde ~~a and Bitwise OR (a | 0) are faster ways to write Math.floor(a) – edi9999
        //                 //a | 0 is also the fastest and most optimized way to convert a string to an integer.
        //                 // It only works with strings containing integers ("444" and "-444"), i.e. no floats/fractions.
        //                 // It yields a 0 for everything that fails. It is one of the main optimizations behind asm.js
        //                 note.setX(((Math.random()*14 | 0)+1)*cnv.w/16);
        //                 stall=(Math.random()*cnv.h) | 0;
        //                 idle=(((Math.random()*5) | 0)+1)*1000;
        //                 this.score[i][3]=cnv.dt;
        //                 console.log(this.score[i][1]+" "+this.score[i][2]+" "+this.score[i][3]+" CCC");
        //             }
        //         }
        //         note.draw();
        //     }else{
        //         console.log(this.score[i][1]+" "+this.score[i][2]+" "+this.score[i][3]+" BBB");
        //     }
        //     this.score[i][1]=idle;
        //     this.score[i][2]=stall;
        // }
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
list = [new Power(0, 0, 1, 1),
    new Texture("resources/background.png", 0, 0, 16, 9),
    new Roll(),
    new Note(),
    new Rectangle(0, 0, 1620, 1000),
    new Circle(0, -155, 50, 5),
    new Rectangle(0, -192, 47, 70),
    new Word(0, 0, "space 1966", "arame", 50),
    new Drop(20)
];
// list[1].visible=false;
// list[2].visible=false;
// list[3].visible=false;
// list[4].visible=false;
list[4].setStroke("rgba(0,0,0,0)", 0);
list[4].filled = true;
list[4].setFill("rgba(0,30,40,0.1)");
list[5].filled = true;
list[5].setStroke("#ffffff");
list[5].setFill("rgba(255,20,20,0.6)");
list[6].filled = true;
list[6].setStroke("#ffffff");
list[6].setFill("rgba(255,20,20,0.6)");
// list[5].setStroke("#efefef",2);
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
    cnv.dt = Date.now();
    for (var i = 0, max = list.length; i < max; i++) {
        list[i].draw();
    }
}
