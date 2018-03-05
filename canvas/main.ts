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
    dt:number;
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
        this.low=new Array();
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
            mna.drawImage(this.img,this.low[0],this.low[1],this.low[2],this.low[3]);
        }
    }
}
class Word extends Base{
    public text:string;
    public font:string;

    constructor(x:number,y:number,text:string,font:string,size:number){
        super(x,y,0,size);
        this.text=text;
        this.font=font;
    }

    precalc(){
        this.low=[calx(this.x),caly(this.y),calh(this.h)];
    }

    draw():void{
        // console.log(this.low[2]);
        mna.font=this.low[2]+"px "+this.font;
        mna.textAlign="center";
        mna.fillText(this.text,this.low[0],this.low[1]);
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
        }
    }
}
class Drop extends Base{
    private start:number;

    constructor(radius:number){
        super(0,0,radius*2,radius*2);
        this.start= -1;
    }

    public startDrop(x:number,y:number):void{
        this.start=cnv.dt;//Date.now();
        this.x=x;
        this.y=y;
    }

    draw():void{
        let a:number=(cnv.dt-this.start);
        if(a<151){
            mna.beginPath();
            mna.strokeStyle="#efefef";
            mna.lineWidth=2;
            mna.arc(this.x,this.y,this.w*a/(150+a),0,2*Math.PI);
            mna.stroke();
        }
    }
}
class Power extends Base{
    private grd:CanvasGradient;
    private time:number;
    private lowc:number[];

    constructor(x:number,y:number,w:number,h:number){
        super(x,y,w,h);
        this.time=0;
    }

    precalc():void{
        super.precalc();
        this.lowc=[calx(this.x),caly(this.y),this.low[2]/2+300];
    }

    draw():void{
        let a:number=cnv.dt%3001,k:number=1-(2*a/(3000+a));
        this.grd=mna.createRadialGradient(this.lowc[0],this.lowc[1],this.lowc[2]*k,this.lowc[0],this.lowc[1],(this.lowc[2]*k-200>0)?this.lowc[2]*k-200:0);
        this.grd.addColorStop(0.000,"#1b1464");
        this.grd.addColorStop(0.500,"#003ce3");
        this.grd.addColorStop(1.000,"#1b1464");

        mna.beginPath();
        mna.fillStyle=this.grd;
        mna.fillRect(this.low[0],this.low[1],this.low[2],this.low[3]);
    }
}
class Roll{
    private low:number[];

    constructor(){
        this.low=new Array(15);
    }

    public precalc():void{
        for(let i:number=0; i<15; i++){
            this.low[i]=Math.round(cnv.width*(i+1)/16)+0.5;
        }
    }

    public draw():void{
        mna.beginPath();
        mna.strokeStyle="#ffffff";
        mna.lineWidth=1;
        for(let i:number=0; i<15; i++){
            mna.moveTo(this.low[i],0);
            mna.lineTo(this.low[i],cnv.height);
            mna.stroke();
        }
    }
}
class Note{
    private score:[Word,number,number,number][];

    constructor(){
        this.score=new Array(8);
        let dt=Date.now();
        for(let i:number=0;i<8;i++){
            this.score[i]=[new Word(0,0,"DO","arame",50),0,0,dt];
            //random();
            this.score[i][0].setX(((Math.random()*14 | 0)+1)*cnv.w/15);
            this.score[i][1]=(((Math.random()*5) | 0)+1)*1000;
            this.score[i][2]=(Math.random()*cnv.h) | 0;
            console.log(this.score[i][1]+" "+this.score[i][2]+" "+this.score[i][3]);
        }

    }

    precalc():void{
        for(let i:number=0;i<8;i++){
            this.score[i][0].precalc();
        }
    }

    draw():void{
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
    // console.log("calc: offsetx="+cnv.ox+", offsety="+cnv.oy+", unitw="+cnv.uw+", unith="+cnv.uh);
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
    new Roll(),
    new Note(),
    new Rectangle(0,0,1620,1000),
    new Circle(0,-155,50,5),
    new Rectangle(0,-192,47,70),
    new Word(0,0,"space 1966","arame",50),
    new Drop(20)
];
// list[1].visible=false;
// list[2].visible=false;
// list[3].visible=false;
// list[4].visible=false;

list[4].setStroke("rgba(0,0,0,0)",0);
list[4].filled=true;
list[4].setFill("rgba(0,30,40,0.1)");

list[5].filled=true;
list[5].setStroke("#ffffff");
list[5].setFill("rgba(255,20,20,0.6)");

list[6].filled=true;
list[6].setStroke("#ffffff");
list[6].setFill("rgba(255,20,20,0.6)");


// list[5].setStroke("#efefef",2);

calc();
refresh();

//EVENTS
window.onresize=calc;
document.onmousedown=function(event){
    list[list.length-1].startDrop(event.pageX,event.pageY);
};

//REFRESH
function refresh(){
    requestAnimationFrame(refresh);

    cnv.dt=Date.now();
    for(let i:number=0,max:number=list.length; i<max; i++){
        list[i].draw();
    }
}