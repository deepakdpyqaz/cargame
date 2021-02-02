// Getting the required objects

let lanes = document.querySelectorAll('.lane');
let mycar = document.querySelector('#my');
let game = document.querySelector('#game');
let scoreboard = document.getElementById('score_board');
let maxheight = parseFloat(getComputedStyle(game).height);
let gameovertext = document.getElementById('gameover');
// setting the gamevariables
let myspeedX = 10;
let myspeedY = 10;
let opponentspeed = 5;
let road_width = parseInt(getComputedStyle(game).width);
let cargentime = 1000;
let carmovtime = 100;
var audio = null;

// Attaching motion to my car

mycar.style.bottom = '10px';
mycar.style.left = '10px';
window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowUp') {
        if (parseFloat(mycar.style.bottom) < 500)
            mycar.style.bottom = parseFloat(mycar.style.bottom) + myspeedY + 'px';
    } else if (e.key == 'ArrowDown') {
        if (parseFloat(mycar.style.bottom) > 10)
            mycar.style.bottom = parseFloat(mycar.style.bottom) - myspeedY + 'px';
    } else if (e.key == 'ArrowLeft') {
        if (parseFloat(mycar.style.left) > 10)
            mycar.style.left = parseFloat(mycar.style.left) - myspeedX + 'px';
    } else if (e.key == 'ArrowRight') {
        if (parseFloat(mycar.style.left) < 490)
            mycar.style.left = parseFloat(mycar.style.left) + myspeedX + 'px';
    }
})


//function for detecting collisions
let car_width = parseFloat(getComputedStyle(mycar).width) / 3;
let car_height = parseFloat(getComputedStyle(mycar).height);
let collisiondistance = Math.sqrt(Math.pow(car_width, 2) + Math.pow(car_height, 2));

function detectCollision(cars) {
    mycarX = parseFloat(getComputedStyle(mycar).left) + car_width / 2;
    mycarY = parseFloat(getComputedStyle(mycar).bottom) + car_height / 2;
    let collision = false;
    for (car of cars) {
        carX = parseFloat(getComputedStyle(car).left) + car_width / 2;
        carY = parseFloat(getComputedStyle(car).bottom) + car_height / 2;
        let distance = Math.sqrt(Math.pow((carX - mycarX), 2) + Math.pow((carY - mycarY), 2));
        if (distance < collisiondistance - 50) collision = true;
    }
    return collision;
}


//function for generating opponent cars
function gencars() {
    let car = document.createElement('div');
    car.classList.add('car');
    car.classList.add('opponent');
    let num = 1 + parseInt(Math.random() * 10) % 5;
    car.innerHTML = `<img src="images/car${num}.png" alt="">`
    let lane = lanes[parseInt(Math.random() * 10) % 4];
    lane.appendChild(car);
}
//function to move opponent cars

function makemovement(cars) {
    for (car of cars) {
        car.style.top = parseFloat(getComputedStyle(car).top) + opponentspeed + 'px';
        if (parseFloat(car.style.top) > maxheight) {
            let par = car.parentNode;
            par.removeChild(car);
        }
    }

}

let cars = Array.from(document.querySelectorAll('.car.opponent'));
for (car of cars) {
    car.style.top = 0 + 'px';
}
let carsold = [];

let gameloop = null;
let gameloop2 = null;

function statgame() {
    // game loop 1 for motion of opponents
    gameloop = setInterval(function() {
        let cars = Array.from(document.querySelectorAll('.car.opponent'));
        for (car of cars) {
            if (!carsold.includes(car))
                car.style.top = 0 + 'px';
        }
        if (detectCollision(cars)) { gameover() };
        makemovement(cars);
        carsold = cars;
    }, carmovtime);


    // gameloop2 for making new opponents and score update
    gameloop2 = setInterval(function() {
        gencars();
        opponentspeed += 1;
        updatescore();
    }, cargentime);
}

//function on gameover
function gameover() {
    clearInterval(gameloop);
    clearInterval(gameloop2);
    gameovertext.style.display = 'flex';
    audio.pause();
    let gameoversound = new Audio('images/gameover.wav');
    gameoversound.play();
}



//To update the score
function updatescore() {
    scoreboard.innerHTML = parseInt(scoreboard.innerHTML) + 10;
}

//play the music
function playMusic() {
    audio = new Audio('images/gamemusic.wav');
    audio.play();
    audio.loop = true;
}
document.getElementById('title').addEventListener('click', function() {
    statgame();
    playMusic();
    this.innerHTML = 'Car Game';
});