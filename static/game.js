let score = 0;
let pause = true;
let arrayOfEnemies = [];
let missiles = [];
let enemies = [];
let table = document.getElementById('score-table');


let hero = {
    left: 575,
    top: 700,
    "hp": 3
};


function createEnemies(array) {
    for (let i = 200; i <= 900; i += 100) {
        array.push({left: i, top: 100});
        array.push({left: i, top: 175})
    }
}


function generateMoreEnemies() {
    let arrayOfEnemiesCopy = Object.assign([], []);
    createEnemies(arrayOfEnemiesCopy);
    enemies.push(...arrayOfEnemiesCopy);
}


createEnemies(arrayOfEnemies);
let move_left = false;
let move_right = false;


setInterval(function () {
    if (move_left) hero.left = hero.left - 1;
    if (move_right) hero.left = hero.left + 1;
    drawHero();
}, 1);


buttonHandler(document.getElementById('exit'), 'pause-menu');
buttonHandler(document.getElementById('start'), 'menu');


function submitHandler() {
    let username = document.getElementById('username').value;
    fetchscores(`${username}`, `${score}`);
    document.getElementById('username').style.display = 'none';
    document.getElementById('submit').style.display = 'none';
    document.getElementById('score-table').style.display = 'table';
}


// document.getElementById('restart').addEventListener('click', function () {
//     score = 0;
//     document.getElementById('game-over').style.display = 'none';
//     document.getElementById('score-table').style.display = 'none';
//     document.getElementById('username').style.display = 'inline-block';
//     document.getElementById('submit').style.display = 'inline-block';
//     pause = false;
//     score = 0;
//     arrayOfEnemies = [];
//     missiles = [];
//     enemies = [];
//     hero = {
//         left: 575,
//         top: 700,
//         "hp": 3
//     };
//     for (let i = 1; i < 3; i++) {
//         table.deleteRow(1);
//     }
//     gameLoop();
// });


function buttonHandler(button, menuType) {
    button.addEventListener('click', function () {
        pause = false;
        gameLoop();
        document.getElementById(`${menuType}`).style.display = 'none';
    });
}


document.onkeydown = function (e) {
    e = e || window.event;
    if (pause !== true) {
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
            case 80:
                document.getElementById('pause-menu').style.display = 'block';
                pause = true;
                break;
            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    }
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
    if (hero.left > 1150) {
        hero.left--;
    } else if (hero.left < 0) {
        hero.left++;
    }
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
                document.getElementById('game-over').style.display = 'block';
                document.getElementById('score-menu').innerText = score;
                document.getElementById('submit').addEventListener('click', submitHandler);
                pause = true;
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
                score += 1;
                printScore();
            }
        }
    }
}

function printScore() {
    document.getElementById('score').innerText = score;
}

function printHealth() {
    document.getElementById('hearts').innerHTML = "";
    for (let i = 0; i < hero.hp; i++) {
        document.getElementById('hearts').innerHTML += `<div class='hp' style='left:${i * 50}px; top:5px'></div>`;
    }
}

function life() {
    hero.hp -= 1;
}

function checkGameOver() {
    return hero.hp === 0;
}


function outOfBoundsDetectionMissile() {
    for (let missile = 0; missile < missiles.length; missile++) {
        if (
            missiles[missile].top <= 10
        ) {
            missiles.splice(missile, 1);
        }
    }
}


let turnCounter = 0;
let enemy_spawn_rate = 200;
let enemy_spawn_rate_dif = 0;

function gameLoop() {
    if (pause !== true) {
        if (turnCounter % 300 === 0) {
            generateMoreEnemies();
        }
        printHealth();
        printScore();
        setTimeout(gameLoop, 0 - (turnCounter / 300));
        moveMissiles();
        drawMissiles();
        moveEnemies();
        drawEnemies();
        collisionDetection();
        outOfBoundsDetectionMissile();
        turnCounter += 1;
    }
}

gameLoop();


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
                for (let i = 0; i < data.length; i++) {
                    let row = table.insertRow(i + 1);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    cell1.innerText = data[i].username;
                    cell2.innerText = data[i].score;
                }
            }
        )
}