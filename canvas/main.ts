const mna=(<HTMLCanvasElement>document.getElementById("mna")).getContext("2d");

//TYPES
type Tcnv={
    width:number;
    height:number;
    uw:number;
    uh:number;
    ox:number
    oy:number
}
abstract class Base{
    public x:number;
    public y:number;
    public w:number;
    public h:number;
    public visible:boolean;
    public filled:boolean;
    protected stroke:[string,number];
    protected fill:[string];
    protected low:number[];

    public constructor(x:number,y:number,w:number,h:number){
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
class Circle extends Base{
    public constructor(x:number,y:number,radiusX:number,radiusY:number){
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
        this.low=[calx(this.x),caly(this.y),calw(this.w),calh(this.h)];
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.strokeStyle=this.stroke[0];
            mna.lineWidth=this.stroke[1];
            mna.ellipse(this.low[0],this.low[1],this.low[2]/2,this.low[3]/2,0,0,2*Math.PI)
            // mna.arc(this.low[0],this.low[1],this.low[2]/2,0,2*Math.PI);
            if(this.filled){
                mna.fillStyle=this.fill[0];
                mna.fill();
            }
            mna.stroke();
        }
    }
}
class Rectangle extends Base{
    public constructor(x:number,y:number,w:number,h:number){
        super(x,y,w,h);
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.strokeStyle=this.stroke[0];
            mna.lineWidth=this.stroke[1];
            mna.rect(this.low[0],this.low[1],this.low[2],this.low[3]);
            if(this.filled){
                mna.fillStyle=this.fill[0];
                mna.fill();
            }
            mna.stroke();
        }
    }
}
class Texture extends Base{
    public img;

    public constructor(img:string/*imgw:number,imgh:number,*/,x:number,y:number,w:number,h:number){
        if(w&&h){
            super(x,y,w,h);
        }
        else{
            super(x,y,0,0);
        }
        this.img=new Image();
        this.img.src=img;
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.drawImage(this.img,this.low[0],this.low[1],this.low[2],this.low[3]);
            mna.stroke();
        }
    }
}
class Drop extends Circle{
    public time:number;

    constructor(radiusX:number,radiusY:number){
        super(0,0,radiusX,radiusY);
        this.time=0;
    }

    public startDrop(x:number,y:number):void{
        this.time=Date.now();
        this.x=0;
        this.y=0;
        this.low[0]=x;
        this.low[1]=y;
    }

    precalc():void{
        this.low=[this.x,this.y,calw(this.w),calh(this.h)];
    }

    draw():void{
        let dt=(Date.now()-this.time);
        if(dt<100){
            //console.log(dt);
            if(this.visible){
                mna.beginPath();
                mna.strokeStyle=this.stroke[0];
                mna.lineWidth=this.stroke[1];
                mna.ellipse(this.low[0],this.low[1],this.low[2]/2*dt/100,this.low[3]/2*dt/100,0,0,2*Math.PI)
                if(this.filled){
                    mna.fillStyle=this.fill[0];
                    mna.fill();
                }
                mna.stroke();
            }
        }
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

    list[0].cals(cnv.width/cnv.uw,cnv.height/cnv.uh,false);

    for(let o of list){
        o.precalc();
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
let list:Base[];

list=[new Texture("resources/background.png",0,0,1920,1080),
    new Drop(50,50),
    new Rectangle(0,0,1620,1000)
];

list[2].filled=true;
list[2].setFill("#ffffff");
list[2].visible=false;

calc();
refresh();

//EVENTS
window.onresize=calc;
document.onmousedown=function(event){
    //console.log(Date.now());
    //console.log(event.pageX+" "+event.pageY);
    (list[1] as Drop).startDrop(event.pageX,event.pageY);
};

//REFRESH
function refresh(){
    requestAnimationFrame(refresh);
    mna.fillStyle="#0b00ff";
    mna.fillRect(0,0,cnv.width,cnv.height);


    for(let o of list){
        o.draw();
    }
}