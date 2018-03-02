const mna=(<HTMLCanvasElement>document.getElementById("mna")).getContext("2d");

//TYPES
type Tcnv={
    width:number;
    height:number;
    w:number;
    h:number;
    uw:number;
    uh:number;
    ox:number
    oy:number
}
abstract class Base{
    protected x:number;
    protected y:number;
    protected w:number;
    protected h:number;
    public visible:boolean;
    public filled:boolean;
    protected stroke:[string,number];
    protected fill:[string];
    protected low:number[];

    constructor(x:number,y:number,w:number,h:number){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.stroke=["#000000",1];
        this.fill=["#000000"];
        this.visible=true;
        this.filled=false;
    }

    public setX(x:number):void{
        this.x=x;
        this.low[0]=calx(this.x-this.w/2);
    }
    public setY(y:number):void{
        this.y=y;
        this.low[1]=caly(y-this.h/2);
    }
    public setXY(x:number,y:number):void{
        this.x=x;
        this.y=y;
        this.low[0]=calx(x-this.w/2);
        this.low[1]=caly(y-this.h/2);
    }
    public setW(w:number):void{
        this.w=w;
        this.low[2]=calw(w);
    }
    public setH(h:number):void{
        this.h=h;
        this.low[3]=calh(h);
    }
    public setWH(w:number,h:number):void{
        this.w=w;
        this.h=h;
        this.low[2]=calw(w);
        this.low[3]=calh(h);
    }

    public setStroke(color:string,width:number):void;
    public setStroke(color:string):void;
    public setStroke(width:number):void;
    public setStroke(val1:string|number,val2?:number):void{
        if(typeof val1=="string"){
            this.stroke[0]=val1;
        }
        else{
            this.stroke[1]=val1;
        }
        if(val2){
            this.stroke[1]=val2;

        }
    }

    public setFill(color:string):void{
        this.fill=[color];
    }

    public cals(w:number,h:number,inside:boolean):void{
        let iw:number=this.w,ih:number=this.h;

        if(inside){
            if(iw*h<ih*w){
                this.w=(h*iw)/ih;
                this.h=h;
            }else{
                this.w=w;
                this.h=(w*ih)/iw;
            }
        }else{
            if(iw*h<ih*w){
                this.w=w;
                this.h=(w*ih)/iw;
            }else{
                this.w=(h*iw)/ih;
                this.h=h;
            }
        }
    }

    public precalc():void{
        this.low=[calx(this.x-this.w/2),caly(this.y-this.h/2),calw(this.w),calh(this.h)];
    }

    public abstract draw():void;
}
class Rectangle extends Base{
    constructor(x:number,y:number,w:number,h:number){
        super(x,y,w,h);
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.strokeStyle=this.stroke[0];
            mna.lineWidth=this.stroke[1];
            mna.rect(this.low[0],this.low[1],this.low[2],this.low[3]);
            mna.stroke();
            if(this.filled){
                mna.fillStyle=this.fill[0];
                mna.fill();
            }
            mna.closePath();
        }
    }
}
class Texture extends Base{
    public img;

    constructor(img:string,x:number,y:number,w:number,h:number){
        super(x,y,w,h);
        this.img=new Image();
        this.img.src=img;
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.drawImage(this.img,this.low[0],this.low[1],this.low[2],this.low[3]);
            mna.closePath();
        }
    }
}
class Circle extends Base{
    constructor(x:number,y:number,radiusX:number,radiusY:number){
        super(x,y,radiusX*2,radiusY*2);
    }

    setX(x:number):void{
        this.x=x;
        this.low[0]=calx(x);
    }
    setY(y:number):void{
        this.y=y;
        this.low[1]=caly(y);
    }
    setXY(x:number,y:number):void{
        this.x=x;
        this.y=y;
        this.low[0]=calx(x);
        this.low[1]=caly(y);
    }

    precalc():void{
        this.low=[calx(this.x),caly(this.y),calw(this.w)/2,calh(this.h)/2];
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.strokeStyle=this.stroke[0];
            mna.lineWidth=this.stroke[1];
            mna.ellipse(this.low[0],this.low[1],this.low[2],this.low[3],0,0,2*Math.PI);
            mna.stroke();
            if(this.filled){
                mna.fillStyle=this.fill[0];
                mna.fill();
            }
            mna.closePath();
        }
    }
}
class Drop extends Circle{
    private time:number;

    constructor(radiusX:number,radiusY:number){
        super(0,0,radiusX,radiusY);
        this.time=0;
    }

    public startDrop(x:number,y:number):void{
        this.time=Date.now();
        this.x=x;
        this.y=y;
    }

    draw():void{
        let dt=(Date.now()-this.time);
        if(dt<100){
            mna.beginPath();
            mna.strokeStyle=this.stroke[0];
            mna.lineWidth=this.stroke[1];
            mna.ellipse(this.x,this.y,this.w*dt/(100+dt),this.h*dt/(100+dt),0,0,2*Math.PI);
            mna.stroke();
            mna.closePath();
        }
    }
}
class Power extends Base{
    private grd:CanvasGradient;

    constructor(x:number,y:number,w:number,h:number){
        super(x,y,w,h);
    }

    precalc():void{
        this.low=[calx(this.x),caly(this.y),calw(this.w)/2,calh(this.h)/2];
        this.grd=mna.createRadialGradient(this.low[0],this.low[1],this.low[2],this.low[0],this.low[1],this.low[2]-100);
        this.grd.addColorStop(0.200, "#1b1464");
        this.grd.addColorStop(0.500, "#3a2bd5");
        this.grd.addColorStop(0.800, "#1b1464");
    }

    draw():void{
        Date.now()%5000
        mna.beginPath();
        mna.strokeStyle=this.stroke[0];
        mna.lineWidth=this.stroke[1];
        mna.arc(this.low[0],this.low[1], this.low[2], 0, 2 * Math.PI, false);
        mna.arc(this.low[0],this.low[1], this.low[2]-100, 0, 2 * Math.PI, true);
        mna.fillStyle=this.grd;
        mna.fill();
        mna.closePath();
    }
}

//CALCULATE
function calc():void{
    mna.canvas.width=mna.canvas.clientWidth;
    mna.canvas.height=mna.canvas.clientHeight;

    cnv.width=mna.canvas.width;
    cnv.height=mna.canvas.height;

    let iw:number=81,ih:number=50;
    let w:number=cnv.width,h:number=cnv.height;
    if(iw*h<ih*w){
        iw=(h*iw)/ih;
        cnv.ox=(w-iw)/2;
        cnv.oy=0;
        cnv.uw=iw/1620;
        cnv.uh=h/1000;
    }else{
        ih=(w*ih)/iw;
        cnv.ox=0;
        cnv.oy=(h-ih)/2;
        cnv.uw=w/1620;
        cnv.uh=ih/1000;
    }

    cnv.w=cnv.width/cnv.uw;
    cnv.h=cnv.height/cnv.uh;

    list[0].cals(cnv.w,cnv.h,false);
    list[1].cals(cnv.w,cnv.h,false);

    for(let i:number=0,max:number=list.length-1; i<max; i++){
        list[i].precalc();
    }
    console.log("calc: offsetx="+cnv.ox+", offsety="+cnv.oy+", unitw="+cnv.uw+", unith="+cnv.uh);
}
function calx(x:number):number{
    return (x+810)*cnv.uw+cnv.ox;
}
function caly(y:number):number{
    return (y+500)*cnv.uh+cnv.oy;
}
function calw(w:number):number{
    return w*cnv.uw;
}
function calh(h:number):number{
    return h*cnv.uh;
}

//START
let cnv:Tcnv={} as Tcnv;
let list:any[];

list=[new Power(0,0,1,1),
    new Texture("resources/background.png",0,0,16,9),
    new Rectangle(0,0,1620,1000),
    new Circle(0,-155,50,5),
    new Rectangle(0,-192,47,70),
    new Drop(20,20)
];
// list[1].visible=false;
// list[2].visible=false;
// list[3].visible=false;
// list[4].visible=false;

list[2].filled=true;
list[2].setFill("rgba(167,167,167,0.6)");

list[3].filled=true;
list[3].setStroke("#5eef0c");
list[3].setFill("rgba(255,20,20,0.6)");

list[4].filled=true;
list[4].setStroke("#5eef0c");
list[4].setFill("rgba(255,20,20,0.6)");


list[5].setStroke("#efefef",2);

calc();
refresh();

//EVENTS
window.onresize=calc;
document.onmousedown=function(event){
    list[5].startDrop(event.pageX,event.pageY);
};

//REFRESH
function refresh(){
    requestAnimationFrame(refresh);
    mna.fillStyle="#1b1464";
    mna.fillRect(0,0,cnv.width,cnv.height);

    for(let i:number=0,max:number=list.length; i<max;i++){
        list[i].draw();
    }
}