var canva = document.getElementById("screen");
var ctx = canva.getContext("2d");

function degreeToRadian(degree) {
    return degree * 3.14159265359 / 180.0;
}




function setColor(c){
    ctx.fillStyle = c;
}
function clear(){
    setColor("white")
    ctx.fillRect(0,0,100,100);
}
function drawTri(x1,y1,x2,y2,x3,y3,c="black"){
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
}

class point{
    x = 0;
    y = 0;
    constructor(x=(Math.random()*1000)%100,y=(Math.random()*1000)%100){
        this.x = x;
        this.y = y;
    }
}

function calc(p = new point(0,0),rotation=0,offSet = new point(0,0),scale = 1){
    var rad = degreeToRadian(rotation);
    //rotaing, scaling and moving
    var afterCalc = new point(0,0);
    afterCalc.x = (((scale)*p.x)*Math.cos(rad) - ((scale)*p.y)*Math.sin(rad)) + offSet.x;
    afterCalc.y = (((scale)*p.x)*Math.sin(rad) + ((scale)*p.y)*Math.cos(rad)) + offSet.y;
    return afterCalc;
}
class shape{
    type = 0;
    points = [0];
    color = "black";
    constructor(type,points = [0]){

    }
    static triangle(p1,p2,p3,c){
        var out = new shape;
        out.type = 1;
        out.points[0] = p1;
        out.points[1] = p2;
        out.points[2] = p3;
        out.color = c;
        return out;
    }
    static circle(p,r,c){
        var out = new shape;
        out.type = 3;
        out.points[0] = p;
        out.points[1] = r;
        out.color = c;
        return out;
    }
    static line(p1,p2,thickness){
        var out = new shape;
        out.type = 2;
        out.points[0] = p1;
        out.points[1] = p2;
        out.color = c;
        return out;
    }
    draw(prevPoints,nowPoints){
        switch (this.type){
            case 1:
                var points = [];
                try{
                    for(var i = 0;i<3;i++){
                        if(this.points[i]&0b10000000){
                            points[i] = prevPoints[this.points[i]&0b01111111];
                        }else{
                            points[i] = nowPoints[this.points[i]&0b01111111];
                        }
                    }
                    drawTri(points[0].x,points[0].y,points[1].x,points[1].y,points[2].x,points[2].y,this.color);
                }catch{
                    console.log("corupted shape");
                }
                
            break;
            case 2:
                //to-do
            break;
            case 3:
                //to-do
            break;
        }
    }
}
var dabug = true;
class object{
    points = [new point(0,0)];
    pointsAfterCalc = [new point(0,0)];
    shapes = [new shape(0)];
    position = new point(0,0);
    rotation = 0;
    scale = 1;
    subObjects = [];
    constructor(){
        this.points = [];
        this.pointsAfterCalc = [];
        this.shapes = [];
    }
    draw(prev = undefined,offSet = new point(0,0),rotation=0){//outpoint = offset+pos+Calc(point)
        offSet.x += this.position.x;
        offSet.y += this.position.y;
        this.points.forEach((p,i)=>{
            this.pointsAfterCalc[i] = calc(p,rotation+this.rotation,offSet,this.scale);
        })
        this.shapes.forEach(s=>{
            if(prev==undefined)s.draw(undefined,this.pointsAfterCalc);
            else s.draw(prev.pointsAfterCalc,this.pointsAfterCalc);
        })
        this.subObjects.forEach(so=>{
            so.draw(this,offSet,this.rotation)//to do
        })
        if(dabug){
            ctx.fillStyle = "red";
            ctx.fillRect(offSet.x-2,offSet.y-2,4,4);
        }
    };
}

function getPrev(id){
    return id|0b10000000;
}

var test = new object();

test.position = new point(30,30);
test.points.push(new point(10,0));
test.points.push(new point(0,0));
test.points.push(new point(0,10));
test.shapes.push(shape.triangle(0,1,2,"black"));
test.scale = 3;
test.subObjects.push(new object());
test.subObjects[0].points.push(new point(10,10));
test.subObjects[0].shapes.push(shape.triangle(0,getPrev(0),getPrev(2)));
setInterval(() => {
    clear();
    test.rotation += 3;
    test.draw();
    
}, 33);