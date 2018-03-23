const mna=(<HTMLCanvasElement>document.getElementById("mna")).getContext("2d");

//TYPES
type Tcnv={
    width:number;   //pixel width
    height:number;  //pixel height
    w:number;       //unit width
    h:number;       //unit haight
    uw:number;      //width unit pixel width
    uh:number;      //height unit pixel height
    ox:number       //-810 width unit pixel offset
    oy:number       //-500 height unit pixel offset
    //1620x1000
    // dt:number;
}
abstract class Base{
    public visible:boolean;
    public filled:boolean;
    protected low:number[];
    protected y:number;
    protected x:number;
    protected w:number;
    protected h:number;
    protected stroke:[string,number];
    protected fill:[string];
    constructor(x:number,y:number,w:number,h:number){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.stroke=["#000000",1];
        this.fill=["#000000"];
        this.visible=true;
        this.filled=false;
        // this.low=[];
    }
    get getX():number{
        return this.x;
    }
    get getY():number{
        return this.y;
    }
    get getLow():number[]{
        return this.low;
    }
    public setX(x:number):void{
        this.x=x;
        this.low[0]=calx(x-this.w/2);
    }
    public setY(y:number):void{
        this.y=y;
        this.low[1]=caly(y+this.h/2);
    }
    public setXY(x:number,y:number):void{
        this.x=x;
        this.y=y;
        this.low[0]=calx(x-this.w/2);
        this.low[1]=caly(y+this.h/2);
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
        this.low=[calx(this.x-this.w/2),caly(this.y+this.h/2),calw(this.w),calh(this.h)];
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
        super(x,y,size,0);
        this.text=text;
        this.font=font;
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

    precalc(){
        this.low=[calx(this.x),caly(this.y),calh(this.w)];
    }

    draw():void{
        if(this.visible){
            mna.beginPath();
            mna.fillStyle=this.fill[0];
            mna.font=this.low[2]+"px "+this.font;
            mna.textBaseline='middle';
            mna.textAlign="center";
            mna.fillText(this.text,this.low[0],this.low[1]);
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
        }
    }
}
class Power extends Base{
    private grd:CanvasGradient;
    private step:number;

    constructor(){
        super(0,0,1,1);
        this.step=0;
    }

    precalc():void{
        this.low=[calx(this.x),caly(this.y),calw(this.w)/2+400];
    }

    draw():void{
        let k:number=1-(2*this.step/(180+this.step));
        this.step=(this.step+1)%181;
        this.grd=mna.createRadialGradient(this.low[0],this.low[1],this.low[2]*k,this.low[0],this.low[1],(this.low[2]*k-200>0)?this.low[2]*k-200:0);
        this.grd.addColorStop(0.000,"#1b1464");
        this.grd.addColorStop(0.500,"#2d75ff");//"#003ce3"
        this.grd.addColorStop(1.000,"#1b1464");
        mna.beginPath();
        mna.fillStyle=this.grd;
        mna.fillRect(0,0,cnv.width,cnv.height);
    }
}
class Drop{
    private radius:number;
    private drops:[/*x*/number,/*y*/number,/*start*/number][];

    constructor(radius:number){
        this.radius=radius;
        this.drops=[];
    }

    public startDrop(x:number,y:number):void{
        this.drops.push([x,y,0]);
        if(this.drops.length>16){
            this.drops.shift();
        }
    }

    draw():void{
        let step:number;
        for(let i:number=0; i<this.drops.length; i++){
            step=this.drops[i][2];
            this.drops[i][2]++;
            if(step<401){
                step=2*step/(400+step);
                mna.beginPath();
                mna.strokeStyle="rgba(239,239,239,"+(1-step)+")";
                mna.lineWidth=2;
                mna.arc(this.drops[i][0],this.drops[i][1],this.radius*step,0,2*Math.PI);
                mna.stroke();
            }
            else{
                this.drops.shift();
            }
        }
    }
}
class Roll{
    private low:number[];

    constructor(){
        this.low=new Array(31);
    }

    public precalc():void{
        for(let i:number=0; i<31; i++){
            let val=Math.round(cnv.width/32*(i+1))+0.5;
            this.low[i]=val;
            console.log(val);

        }
    }

    public draw():void{
        mna.beginPath();
        mna.strokeStyle="rgba(255,255,255,0.1)";
        mna.lineWidth=1;
        for(let i:number=0; i<31; i++){
            mna.moveTo(this.low[i],0);
            mna.lineTo(this.low[i],cnv.height);
            mna.stroke();
        }
    }
}
class Lines{
    ")";
    id
    99
    console
)+
    id
    "re "
.
    Math
==
    0.5
){
    Math
.
    w1
.
    getY
+
    Math
+
    w2
.
    getYNote
-(
    limit
.
    private
    w1:Word;
.
    private
    w2:Word;
.
    constructor(w1:Word,w2:Word,private id:number){
        this.w1=w1;
        this.w2=w2;
        if(id==99){
            w1.setFill("#f00");
            w2.setFill("#0f0");
        }
    }
.
    draw():void{
        if(this.w1.visible&&this.w2.visible){
            mna.beginPath();
            mna.strokeStyle="rgba(255,255,255,"+/Math.abs(0.5-(Math.max(Math.abs(this.w1.getY),Math.abs(this.w2.getY))/(Note.limit*1.5)
        )
),
    if(this
.
    log(this
.
    abs(
.
    max(Math)
)/(
    abs(this
.
    abs(this
    *1.5
))));
}
mna.lineWidth=1;
mna.moveTo(this.w1.getLow[0],this.w1.getLow[1]);
mna.lineTo(this.w2.getLow[0],this.w2.getLow[1]);
mna.stroke();
}
}
}
class Note{
    public static limit:number;
    private score:[/*note*/Word,/*position*/number,/*height*/number,/*wait*/number,/*stall*/number,/*phase*/number,/*step*/number][];
    private lines:Lines[];
    private transitionTime:number=60;
    private offset:number;

    constructor(){
        this.score=new Array(16);
        this.lines=new Array(120);
        for(let i:number=0; i<16; i++){
            this.score[i]=[new Word(0,0,"","arame",20),0,0,0,0,0,0];
            this.score[i][0].setFill("#ffffff");
        }
        for(let i:number=0,k:number=1,j:number=0; i<120; i++, j++){
            if(j==k){
                j=0;
                k++;
            }
            this.lines[i]=new Lines(this.score[k][0],this.score[j][0],i);
        }
    }

    precalc():void{
        Note.limit=cnv.h/2+50;
        this.offset=cnv.w/64;
        for(let i:number=0; i<16; i++){
            this.score[i][0].precalc();
            this.score[i][0].setX(this.offset*this.score[i][1]);
        }
    }

    draw():void{
        for(let i:number=0; i<16; i++){
            let note:Word=this.score[i][0];
            switch(this.score[i][5]){
                case 0:
                    this.score[i][1]=((Math.random()*(30+30+1))|0)-30;//da -30 a 30
                    this.score[i][2]=((Math.random()*(500+500+1))|0)-500;//da -500 a 500
                    this.score[i][3]=((Math.random()*(200-50+1))|0)+50;//da 50 a 200
                    this.score[i][4]=((Math.random()*(150-50+1))|0)+50;//da 50 a 150
                    switch((this.score[i][1]+30+6)%7){
                        case 0:
                            note.text="do";
                            break;
                        case 1:
                            note.text="re";
                            break;
                        case 2:
                            note.text="mi";
                            break;
                        case 3:
                            note.text="fa";
                            break;
                        case 4:
                            note.text="sol";
                            break;
                        case 5:
                            note.text="la";
                            break;
                        case 6:
                            note.text="si";
                            break;
                    }
                    note.setX(this.offset*this.score[i][1]);
                    note.setY(-Note.limit);
                    note.visible=false;
                    this.score[i][5]++;
                    this.score[i][6]=0;
                    break;
                case 1:
                    if(this.score[i][6]<this.score[i][3]){
                        this.score[i][6]++;
                    }
                    else{
                        note.visible=true;
                        this.score[i][5]++;
                        this.score[i][6]=0;
                    }
                    break;
                case 2:
                    if(this.score[i][6]<this.transitionTime){
                        note.setY((EasingFunctions.easeInOutCubic(this.score[i][6]/this.transitionTime)*(this.score[i][2]+Note.limit+1))-Note.limit);
                        this.score[i][6]++;
                    }
                    else{
                        this.score[i][5]++;
                        this.score[i][6]=0;
                    }
                    break;
                case 3:
                    if(this.score[i][6]<this.score[i][4]){
                        this.score[i][6]++;
                    }
                    else{
                        this.score[i][5]++;
                        this.score[i][6]=0;
                    }
                    break;
                case 4:
                    if(this.score[i][6]<this.transitionTime){
                        note.setY((EasingFunctions.easeInOutCubic(this.score[i][6]/this.transitionTime)*(Note.limit-this.score[i][2]+1))+this.score[i][2]);
                        this.score[i][6]++;
                    }
                    else{
                        this.score[i][5]=0;
                        this.score[i][6]=0;
                    }
                    break;
            }
            note.draw();
        }
        for(let i:number=0; i<120; i++){
            this.lines[i].draw();
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
    return (-y+500)*cnv.uh+cnv.oy;
}
function calw(w:number):number{
    return w*cnv.uw;
}
function calh(h:number):number{
    return h*cnv.uh;
}
let EasingFunctions={
    // no easing, no acceleration
    linear:function(t){
        return t
    },
    // accelerating from zero velocity
    easeInQuad:function(t){
        return t*t
    },
    // decelerating to zero velocity
    easeOutQuad:function(t){
        return t*(2-t)
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad:function(t){
        return t<.5?2*t*t:-1+(4-2*t)*t
    },
    // accelerating from zero velocity
    easeInCubic:function(t){
        return t*t*t
    },
    // decelerating to zero velocity
    easeOutCubic:function(t){
        return (--t)*t*t+1
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic:function(t){
        return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1
    },
    // accelerating from zero velocity
    easeInQuart:function(t){
        return t*t*t*t
    },
    // decelerating to zero velocity
    easeOutQuart:function(t){
        return 1-(--t)*t*t*t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart:function(t){
        return t<.5?8*t*t*t*t:1-8*(--t)*t*t*t
    },
    // accelerating from zero velocity
    easeInQuint:function(t){
        return t*t*t*t*t
    },
    // decelerating to zero velocity
    easeOutQuint:function(t){
        return 1+(--t)*t*t*t*t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint:function(t){
        return t<.5?16*t*t*t*t*t:1+16*(--t)*t*t*t*t
    }
};

//START
let cnv:Tcnv={} as Tcnv;
let list:any[];

list=[new Power(/*0,0,1,1*/),
    new Texture("resources/background.png",0,0,16,9),
    new Roll(),
    new Note(),
    new Rectangle(0,0,1620,1000),
    new Circle(0,-155,50,5),
    new Rectangle(0,-192,47,70),
    new Word(0,0,"space 1966","arame",50),
    new Drop(300)
];

// list[1].visible=false;
list[4].visible=false;

list[4].setStroke("rgba(0,0,0,0)",0);
list[4].filled=true;
list[4].setFill("#00ff0e");

list[5].filled=true;
list[5].setStroke("#ffffff");
list[5].setFill("rgba(255,20,20,0.6)");

list[6].filled=true;
list[6].setStroke("#ffffff");
list[6].setFill("rgba(255,20,20,0.6)");

list[7].setFill("#ff0026");

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

    // cnv.dt=Date.now();
    for(let i:number=0,max:number=list.length; i<max; i++){
        list[i].draw();
    }
}