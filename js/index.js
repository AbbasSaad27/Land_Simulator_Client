'use strict';

// selecting elements
var buyBuildingOneBtn = document.getElementById("buy-building-1-btn");
var buyBuildingTwoBtn = document.getElementById("buy-building-2-btn");
var buySwordBtn = document.getElementById("buy-sword-btn");
var buildingContainer = document.getElementById("building-div");
var monsterContainer = document.getElementById("monster-div");
var lifeBarIndicator = document.getElementById("life-bar-indicator");

var healthCount = document.getElementById("health-count");
var metalCount = document.getElementById("metal-count");
var woodCount = document.getElementById("wood-count");
var buildingCount = document.getElementById("building-count");
var damageCount = document.getElementById("damage-count");

// init game details
var playerHealth = 300;
var wood = 0;
var metal = 0;
var damage = 10;
var buildings = 0;
var clicked = {
    treeOne: 0,
    treeTwo: 0,
    treeThree: 0
}
var bigBuildingPlaced = 0;
var smallBuildingPlaced = 0;

// game constants
var points = {
    wood: 25,
    metal: 10
}
var items = {
    buildingOne: [50, 10],
    buildingTwo: [150, 30],
    sword: 200,
}
var monsters = [];
var monstersAppeared = false;

// monster appearing function

setInterval(function() {
    var chance = Math.floor(Math.random() * 5);
    if(chance === 2 && monsterContainer.children.length === 0) {
        monsters = [];
        monstersAppeared = true;
        var count = Math.floor(Math.random() * 3) + 1;
        for(var i = 0; i < count; i++) {
            var monsterimg = document.createElement("img");
            monsterimg.src = "images/cute-wolfman.png";
            monsterimg.id = "monster-" + (i+1);
            monsterContainer.appendChild(monsterimg);
            monsters.push({monsterEl: monsterimg, health: 40})
        }
    }
}, 10000)

window.onclick = function(e) {
    var el = e.target;
    var elId = el.id;
    // wood collecting
    if(elId.includes('tree') && !monstersAppeared) {
        switch(elId) {
            case "tree-1":
                clicked.treeOne += 1
                if(clicked.treeOne === 10) {
                    el.style.display = "none"
                }
                break;
            case "tree-2":
                clicked.treeTwo += 1
                if(clicked.treeTwo === 10) {
                    el.style.display = "none"
                }
                break;
            case "tree-3":
                clicked.treeThree += 1
                if(clicked.treeThree === 10) {
                    el.style.display = "none"
                }
                break;
            default:
                break;
        }
        woodCount.innerHTML = wood += points.wood;
    }

    // metal collecting
    if(elId.includes("metal") && !monstersAppeared) {
        metalCount.innerHTML = metal += points.metal
    }

    // buying sword
    if(elId.includes("sword") && !monstersAppeared) {
        if(metal >= 200) {
            alert("Sword brought!");
            metalCount.innerHTML = metal -= 200;
            damageCount.innerHTML = damage += 30;
            el.disabled = true;
            el.style.opacity = 0.5;
        } else {
            alert("not enough metal!")
        }
    }

    // monster slaying 
    if(elId.includes("monster")) {
        monsters.forEach(function(obj) {
            if(obj.monsterEl === el) {
                var monsterStrike = Math.floor(Math.random() * 10) + 1;
                obj.health -= damage;
                healthCount.innerHTML = playerHealth -=monsterStrike

                lifeBarIndicator.style.width = (100 - (((300 - playerHealth) / 300) * 100)) + "%"

                if(obj.health <= 0) {
                    monsterContainer.removeChild(obj.monsterEl);
                }
            }
        })
        if(monsterContainer.children.length === 0) {
            monstersAppeared = false;
        }
    }

    // buildings 
    if(elId.includes("building") && !monstersAppeared) {
        var imgLink = el.getElementsByTagName("img")[0].src;
        var index = imgLink.indexOf("images");
        var imgSrc = imgLink.substr(index)
        var imgNo = Number(imgSrc.match(/(\d+)/)[0])
        var units;
        if(imgNo === 1) {
            units = items.buildingOne;
        } else {
            units = items.buildingTwo
        }

        if(wood >= units[0] && metal >= units[1]) {
            var building = document.createElement("img")
            building.src = imgSrc;
            building.id = "building-" + (buildings + 1);
            buildings += 1;
            imgNo === 1 ? smallBuildingPlaced += 1 : bigBuildingPlaced += 1;

            if(smallBuildingPlaced === 9 && imgNo === 1) {
                el.disabled = true;
                el.style.opacity = 0.5;
            }
            if(bigBuildingPlaced === 2 && imgNo === 2) {
                el.disabled = true;
                el.style.opacity = 0.5;
            }

            buildingContainer.appendChild(building)

            woodCount.innerHTML = wood -= units[0];
            metalCount.innerHTML = metal -= units[1];
            buildingCount.innerHTML = buildings;
        } else {
            alert("not enough material!!")
        }
    }
}