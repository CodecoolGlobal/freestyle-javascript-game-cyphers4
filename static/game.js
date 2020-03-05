let hero = {
    left: 575,
    top: 700,
    "hp": 3
};

const arrayOfEnemies = [
    {left: 200, top: 100},
    {left: 300, top: 100},
    {left: 400, top: 100},
    {left: 500, top: 100},
    {left: 600, top: 100},
    {left: 700, top: 100},
    {left: 800, top: 100},
    {left: 900, top: 100},
    {left: 200, top: 175},
    {left: 300, top: 175},
    {left: 400, top: 175},
    {left: 500, top: 175},
    {left: 600, top: 175},
    {left: 700, top: 175},
    {left: 800, top: 175},
    {left: 900, top: 175}
];


let missiles = [];
let enemies = [];


function generateMoreEnemies() {
    let arrayOfEnemiesCopy = Object.assign([], [
        {left: 200, top: 100},
        {left: 300, top: 100},
        {left: 400, top: 100},
        {left: 500, top: 100},
        {left: 600, top: 100},
        {left: 700, top: 100},
        {left: 800, top: 100},
        {left: 900, top: 100},
        {left: 200, top: 175},
        {left: 300, top: 175},
        {left: 400, top: 175},
        {left: 500, top: 175},
        {left: 600, top: 175},
        {left: 700, top: 175},
        {left: 800, top: 175},
        {left: 900, top: 175}
    ]);
    enemies.push(...arrayOfEnemiesCopy);
}


let move_left = false;
let move_right = false;


setInterval(function () {
    if (move_left) hero.left = hero.left - 1;
    if (move_right) hero.left = hero.left + 1;
    drawHero();
}, 1);


document.onkeydown = function (e) {
    e = e || window.event;
    switch (e.which || e.keyCode) {
        case 37: // left
            move_left = true;
            break;
        case 39: // right
            move_right = true;
            break;
        case 32:
            if (missiles.length < 10) {
                missiles.push({
                    left: hero.left + 20,
                    top: hero.top - 20
                });
            }
            drawMissiles();
            break;
        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};

document.onkeyup = function (e) {
    e = e || window.event;
    switch (e.which || e.keyCode) {
        case 37: // left
            move_left = false;
            break;
        case 39: // right
            move_right = false;
            break;
    }
};


function drawHero() {
    document.getElementById('hero').style.left = hero.left + 'px';
    document.getElementById('hero').style.top = hero.top + 'px';
}


function drawMissiles() {
    document.getElementById('missiles').innerHTML = "";
    for (let i = 0; i < missiles.length; i++) {
        document.getElementById('missiles').innerHTML += `<div class='missile1' style='left:${missiles[i].left}px; top:${missiles[i].top}px'></div>`;
    }
}


function moveMissiles() {
    for (let missile = 0; missile < missiles.length; missile++) {
        if (missiles[missile].top <= 10) {
            missiles.splice(missile, 1);
        } else {
            missiles[missile].top = missiles[missile].top - 8;
        }
    }
}

function drawEnemies() {
    document.getElementById('enemies').innerHTML = "";
    for (let i = 0; i < enemies.length; i++) {
        document.getElementById('enemies').innerHTML += `<div class='enemy' style='left:${enemies[i].left}px; top:${enemies[i].top}px'></div>`;
    }
}


function moveEnemies() {
    for (let enemy = 0; enemy < enemies.length; enemy++) {
        if (enemies[enemy].top >= 700) {
            enemies.splice(enemy, 1);
            life();
            if (checkGameOver()) {
                alert("Game Over");
                fetchscores();
            }
        } else {
            enemies[enemy].top = enemies[enemy].top + 1;
        }
    }
}

function collisionDetection() {
    for (let enemy = 0; enemy < enemies.length; enemy++) {
        for (let missile = 0; missile < missiles.length; missile++) {
            if (
                missiles[missile].left >= enemies[enemy].left &&
                missiles[missile].left <= (enemies[enemy].left + 50) &&
                missiles[missile].top <= (enemies[enemy].top + 50) &&
                missiles[missile].top >= enemies[enemy].top
            ) {
                enemies.splice(enemy, 1);
                missiles.splice(missile, 1);
            }
        }
    }
}

function life() {
    hero.hp -= 1;
}

function checkGameOver() {
    return hero.hp === 0;
}


let turnCounter = 0;
let enemy_spawn_rate = 200;
let enemy_spawn_rate_dif = 0;

function gameLoop() {
    if (turnCounter % enemy_spawn_rate === 0) {
        enemy_spawn_rate -= enemy_spawn_rate_dif;
        generateMoreEnemies();
    }
    setTimeout(gameLoop, 25);
    moveMissiles();
    drawMissiles();
    moveEnemies();
    drawEnemies();
    collisionDetection();
    turnCounter += 1;
}


gameLoop();

document.querySelector('mybtn').addEventListener('click', fetchscores);

function fetchscores(username, score) {
    fetch('http://0.0.0.0:8000/showscores', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, score: score})
    })
        .then((response) => response.json())
        .then((data) => {
            console.table(data);
        })
}