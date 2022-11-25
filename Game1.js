var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var mySound;
var myMusic;
var suara = document.querySelector('#volume input');
var volumeslider = 0.5;
var player = document.querySelectorAll('div#player img');
 
//MENGHAPUS DIV TERTENTU
function UI(){
    document.querySelector('#tampilanAwal').style.display = "none";
    document.querySelector('#restart').style.display = "none";
}
//MEMILIH PLAYER
function choose(){
    UI();
    document.getElementById('player').style.display = "";
    
}
for(let i=0; i<player.length; i++){
    player[i].addEventListener('mouseenter',function(e){
        e.target.style.filter = 'drop-shadow(0px 0px 15px black)'
    })
    player[i].addEventListener('mouseleave',function(e){
        e.target.style.filter = ''
    })
    player[i].addEventListener('click', function(){
        iPlayer = i;
        startGame();
    })
}
function pengaturan(){
    UI();
    document.getElementById('volume').style.display= '';
    setTimeout(function(){//MEMBERIKAN JEDA
        document.getElementById('volume').style.animation= 'none';
    },1000)
    suara.addEventListener('input', function(){//MENGATUR VOLUME SUARA DENGAN INPUT RANGE
        volumeslider = suara.value / 100;
    });
}
document.addEventListener('click', function(e){//MENUTUP MENU SETTING
    if(e.target === document.querySelector('#volume h1')){
        document.querySelector('#volume').style.animation = "Avolume 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) reverse";
        setTimeout(function(e){//MEMBERIKAN JEDA
            document.querySelector('#tampilanAwal').style.display = "";
            document.querySelector('#volume').style.display = "none";
            document.querySelector('#volume').style.animation = "Avolume 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        },600);
    }
})
function startGame() {
    myGamePiece = new component(50, 70, "karakter"+iPlayer+".png", 120, 400, "image");
    myBackground = new component(370, 480 ,"Background1.png", 0, 0, "image");
    myScore = new component ("20px", "Monotype", "white", 20, 40, "text");
    mySound = new sound("");
    myMusic = new sound("");
    myGameArea.start();

    UI();
    document.querySelector('#player').style.display = "none";
    document.querySelector('.border').style.display = "none";
    myObstacles.splice(0, myObstacles.length);
    mySound.stop();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 370; //270
        this.canvas.height = 480; //480
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
        myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
        myGameArea.key = false;
        })
        },
    clear : function() {
       this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
        document.getElementById('restart').style.display = "";
        document.getElementById('skor').innerHTML = this.frameNo;
        myObstacles.splice('0',myObstacles.length)
    }    
}

function component (width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        if (type == "image") {
            ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitRight();
        this.hitLeft();
    }
    this.hitRight = function() {
        var rockRight = myGameArea.canvas.width - this.width;
        if (this.x > rockRight) {
            this.x = rockRight;
        }
    }
    this.hitLeft = function() {
        var rockLeft = myGameArea.canvas.width - this.width;
        if (this.y < rockLeft) {
            this.x = rockLeft;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, size, i, random, random1;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();

            myMusic.stop();
            myGameArea.stop();

            document.querySelector('#restart h1').innerHTML = "Game Over";
            document.getElementById('restart').style.display = 'none';
            return;
        } 
    }
    if(myGameArea.frameNo==1000){//ketika skor mencapai 000
        myMusic.stop();
        myGameArea.stop();
        document.querySelector('#restart h1').innerHTML = 'YOU WIN';
        document.getElementById('restart').style.display = '';
        return;
    }
    myGameArea.clear();
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        y = myGameArea.canvas.width;
        pos = Math.floor(Math.random()*13)
        pos1 = Math.floor(Math.random()*135+235);
        minWidth = 120;
        maxWidth = 220;
        width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        minGap = 290;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(110, 50, "0.png", y - width - gap, -1, "image"));
        myObstacles.push(new component (110, 50, "1.png", pos1, 0, "image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();    
    myGamePiece.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 65) {myGamePiece.speedX = -5; }
    if (myGameArea.key && myGameArea.key == 68) {myGamePiece.speedX = 5; }
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload","auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = volumeslider;
    document.body.appendChild(this.sound);

    this.play = function() {
        this.sound.play()
    }
    this.stop = function() {
        this.sound.pause();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
