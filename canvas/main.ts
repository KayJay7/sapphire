const mna=(<HTMLCanvasElement>document.getElementById("mna")).getContext("2d");

//TYPES
type Tcnv={
    width:number;
    height:number;
    w:number;
    h:number;
    cx:number
    cy:number
}
abstract class Base{
    public x:number;
    public y:number;
    public visible:boolean;
    public filled:boolean;
    protected stroke:[string,number];
    protected fill:[string];

    public constructor(x:number,y:number){
        this.x=x;
        this.y=y;
        this.stroke=["#000000",1];
        this.fill=["#000000"];
        this.visible=true;
        this.filled=false;
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
        if(val2!=null){
            this.stroke[1]=val2;

        }
    }

    public setFill(color:string):void{
        this.fill=[color];
    }

    public abstract draw():void;
}
class Circle extends Base{
    public radius:number;

    public constructor(x:number,y:number,radius:number){
        super(x,y);
        this.radius=radius;
    }

    public draw():void{
        if(this.visible){
            mna.beginPath();
            mna.strokeStyle=this.stroke[0];
            mna.lineWidth=this.stroke[1];
            mna.arc(calx(this.x),caly(this.y),this.radius,0,2*Math.PI);
            if(this.filled){
                mna.fillStyle=this.fill[0];
                mna.fill();
            }
            mna.stroke();
        }
    }
}
class Rectangle extends Base{
    public width:number;
    public height:number;

    public constructor(x:number,y:number,width:number,height:number){
        super(x,y);
        this.width=width;
        this.height=height;
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.strokeStyle=this.stroke[0];
            mna.lineWidth=this.stroke[1];
            mna.rect(calx(this.x),caly(this.y),this.width,this.height);
            if(this.filled){
                mna.fillStyle=this.fill[0];
                mna.fill();
            }
            mna.stroke();
        }
    }
}

class Texture extends Base{
    public width:number;
    public height:number;
    public img;
    public imgw:number;
    public imgh:number;


    public constructor(img:string,imgw:number,imgh:number,x:number,y:number,width:number,height:number){
        super(x,y);
        this.width=width;
        this.height=height;
        this.img=new Image();
        this.img.src=img;
        this.imgw=imgw;
        this.imgh=imgh;
        console.log(this.imgw+","+this.imgh);
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.drawImage(this.img,calx(this.x),caly(this.y),this.width,this.height);
            mna.stroke();
        }
    }
}

//CALCULATE
function calc():void{
    mna.canvas.width=mna.canvas.clientWidth;
    mna.canvas.height=mna.canvas.clientHeight;

    cnv.width=mna.canvas.width;
    cnv.height=mna.canvas.height;
    cnv.w=cnv.width/1000;
    cnv.h=cnv.height/1000;
    cnv.cx=cnv.width/cnv.w/2;
    cnv.cy=cnv.height/cnv.h/2;


    console.log("canvas: size "+cnv.w+","+cnv.h);
}
function calx(x:number):number{
    // console.log("("+x+"+"+cnv.cx+")*"+cnv.w+"="+((x+cnv.cx)*cnv.w))
    return (x+cnv.cx)*cnv.w;
}
function caly(y:number):number{
    // console.log("("+y+"+"+cnv.cy+")*"+cnv.h+"="+((y+cnv.cy)*cnv.h))
    return (y+cnv.cy)*cnv.h;
}
function calimg(iw,ih):[number,number,number,number]{
    let w:number=cnv.width,h:number=cnv.height;
    let x:number=0,y:number=0;

    if(true){
        if(iw*h<ih*w){
            iw=(h*iw)/ih;
            x+=(w-iw)/2;
            w=iw;
        }else{
            ih=(w*ih)/iw;
            y+=(h-ih)/2;
            h=ih;
        }
    }else{
        if(iw*h<ih*w){
            ih=(w*ih)/iw;
            y+=(h-ih)/2;
            h=ih;
        }else{
            iw=(h*iw)/ih;
            x+=(w-iw)/2;
            w=iw;
        }
    }
    return [x,y,w,h];
}

//START
let cnv:Tcnv={} as Tcnv;
calc();

let c1:Circle;
let r1:Rectangle;
let img1;
c1=new Circle(1,0,20);
r1=new Rectangle(0,0,50,70);
img1=new Texture("https://upload.wikimedia.org/wikipedia/commons/6/61/Caspar_David_Friedrich_-_Der_Wanderer_%C3%BCber_dem_Nebelmeer.jpg",1100,1399,-500,-500,200,200);
c1.filled=true;
r1.filled=true;
r1.setStroke("#032397",5);
r1.setFill("#3e9a00");
c1.setFill("rgba(255,20,20,0.6)");

refresh();

//EVENTS
window.onresize=function(){
    calc();
}

//REFRESH
function refresh(){
    // let iw:number=81,ih:number=50;

    requestAnimationFrame(refresh);
    mna.fillStyle="#d6cdd3";
    mna.fillRect(0,0,cnv.width,cnv.height);

    r1.draw();
    c1.draw();
    img1.width=cnv.width;
    img1.height=cnv.height;
    img1.draw();
}