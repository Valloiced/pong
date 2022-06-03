"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clackSound = new Audio('clack.wav');

/* Screen */
const width = Math.floor((window.innerWidth - 20) / 20) * 20;
const height = Math.floor((window.innerHeight - 20) / 20) * 20;


window.addEventListener('load', () => {
    if(window.innerHeight % 20 != 0 || window.innerWidth % 20 != 0){
        canvas.height = height;
        canvas.width = width;
    } else {
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight - 20;    
    }
})

/* PLAYER 1 CONTROLS*/
let mousePosY = null;
window.addEventListener('mousemove', (e) => {
    mousePosY = Math.floor(e.y / 10) * 10 ;
})

class Player {
    constructor(x, y, length, size, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.length = length;
        this.size = size * 10;
        this.score = 0;
    }
    
    draw(){
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y - (this.length / 2), this.size, this.length);
    }
    
    control(){
        if(mousePosY < this.y ){
            this.y -= this.speed;
        }
        else if(mousePosY > this.y){
            this.y += this.speed;
        }
    }

    auto(x, y){
        if(this.x - (width / 2) < x){
            if(y < this.y){
                this.y -= this.speed;
            }
            else if(y > this.y){
                this.y += this.speed;
            }
        }
    }
}

class Ball{
    constructor(x, y, size, speed){
        this.x = x;
        this.y = y;
        this.startX = this.x;
        this.startY = this.y;
        this.size = size;
        this.speed = speed;
        this.moveX = 0;
        this.moveY = 0;
    }

    draw(){
        ctx.moveTo(this.x, this.y);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size ,0, Math.PI*2, false);
        ctx.closePath();
        ctx.fillStyle = "yellow";
        ctx.fill();
    }

    move(){
        if(this.moveX == 0 && this.moveY == 0){
            this.x += this.speed;
            this.y += this.speed;
        } else if(this.moveX == 1 && this.moveY == 0){
            this.x -= this.speed;
            this.y += this.speed;
        } else if(this.moveX == 0 && this.moveY == 1){
            this.x += this.speed;
            this.y -= this.speed;
        } else if(this.moveX == 1 && this.moveY == 1){
            this.x -= this.speed;
            this.y -= this.speed;
        }
    }

    collision(player1Pos, player2Pos){
        if(
            this.y >= player2Pos[0] 
            && this.y <= player2Pos[1] 
            && (this.x >= player2Pos[2]
	    &&  this.x <= player2Pos[2] + 20))
        {
            this.moveX = 1;
	    clackSound.play();
        } else if(
            this.y >= player1Pos[0] 
            && this.y <= player1Pos[1] 
            && (this.x <= player1Pos[2]
	    &&  this.x >= player1Pos[2] - 20))
        {
            this.moveX = 0;
  	    clackSound.play();
        } else if(this.y > height){
            this.moveY = 1;
	    clackSound.play();
        } else if(this.y < 0){
            this.moveY = 0;
	    clackSound.play();
        }
    }

    score(){
        if(this.x < 0 || this.x > width){
            if(this.x < 0){
                player2.score += 1;
            } 
            if(this.x > width){
                player1.score += 1;
            }

            this.x = this.startX;
            this.y = this.startY;
        }
    }
}

let player1;
let player2;
let ball;

/* Responsiveness*/
if(width < 700){
    player1 = new Player(30, 30, 80, 1, 15);
    player2 = new Player(width - 10, 30, 80, 1, 15);
    ball = new Ball(
        Math.floor((width / 2) / 5) * 5,
        Math.floor((height / 2) / 5) * 5, 
        5,
        5
        );
} else {
    player1 = new Player(50, 30, 100, 2, 10);
    player2 = new Player(width - 100, 30, 100, 2, 10)
    ball = new Ball(
        Math.floor((width / 2) / 5) * 5,
        Math.floor((height / 2) / 5) * 5, 
        10,
        10
        );
}



let score = () => {
    ctx.font = "300px Arial";
    ctx.fillStyle = "rgb(255, 255, 255, 0.3)";
    ctx.fillText(`${player1.score}`, width / 6, height / 2);
    ctx.fillText(`${player2.score}`, (width / 2) + (width / 6), height / 2);
}

let isMulti = false;

let toggle = (e) => {
    isMulti = e;

    /* PLAYER 2 CONTROLS */
    if(isMulti){
        window.addEventListener('keydown', (e) => {
            if(e.key == 'w' && player2.y >= 0){
                player2.y -= 30;
            } else if(e.key == 's' && player2.y <= height){
                player2.y += 30;
            }
        })
    }
}

let animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!isMulti){
        player2.auto(ball.x, ball.y);
    }
    if(isMulti){
        score();
    }
    player1.draw();
    player2.draw();
    player1.control();
    ball.draw();
    ball.score();
    ball.move();
    ball.collision([
        player1.y - (player1.length / 2), // Since I offset'ed the y position of the platform to center to the cursor (from Player class, draw() method)
        player1.y + (player1.length / 2), // I passed an adjusted version of position y to fit the collision box
        player1.x + player1.size
    ], [
        player2.y - (player2.length / 2), 
        player2.y + (player2.length / 2),
        player2.x
    ]);

    requestAnimationFrame(animate);
}

animate();

