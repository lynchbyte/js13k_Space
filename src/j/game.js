import * as THREE from 'https://unpkg.com/three@0.131.1/build/three.module.js';
import { mkTri, mkDrp, group3, mkLvl } from './mk.js';
import { scene, drp, drpClear, circPhan, curWinValX } from './script.js';
//import { zzfx } from '../a/ZzFXMicro.min.js'

let currRow = 0  //y position of first row

//for rotating star
let prevTime = 0;
const axis = new THREE.Vector3(0, 0, 1).normalize();
const ang = 0.01;

export const curLvlArr = [1, 2, 3, 4, 5, 6];

let hasWon = false;

export const clock = new THREE.Clock();

let winIM;
const amount = 250;
let matrix = new THREE.Matrix4();
let position = new THREE.Vector3();
let rotation = new THREE.Euler();

const ringArr = []

export function gameStart() {

    //number of circles on bottom row
    let qty = curLvlArr[0] + 2;

    //create phantom circles
    mkTri(qty);

    updateWinValsX();

    //create the drop ball
    drp.pop();
    mkDrp(curLvlArr[0] + 4);

}

function nextRow() {

    //max level is 6  
    if (curLvlArr.length === 0) {

        runOnce();
        return;
    }

    currRow++;

    updateWinValsX();

}

function nextLevel() {

    zzfx(...[1.09, , 117, .06, .47, .49, 1, 1.57, 1.5, , -752, .09, .09, .1, , , , .95, .09, .2]);//level up

    //update Level UI - add circle to finished level
    let cUI = scene.getObjectByName(`LvlCirc` + curLvlArr[0]);
    const gR = new THREE.RingGeometry(0.1, 0.2, 32);
    const mR = new THREE.MeshBasicMaterial({ color: 0xaaf47c });
    const ring = new THREE.Mesh(gR, mR);
    ring.position.copy(cUI.position);
    ring.name = 'Ring';
    group3.add(ring);
    ringArr.push(ring);

    //move arrow down to next level
    let arw = scene.getObjectByName('AH');
    arw.position.y += -0.5;

    //modify array
    curLvlArr.shift()//delete first value in array

    currRow = 0;

    //delete all dropped stars,   
    drpClear.forEach(function (item) {
        scene.remove(item);
    });

    //make tri correct qty,
    mkTri(curLvlArr[0] + 2);

    updateWinValsX();

    drp.pop();
    mkDrp();

}

function updateWinValsX() {

    //create & updates an array of Correct X values for current row
    curWinValX.pop();

    //create array of circle phantom based on current row number
    let filt = circPhan.filter(function (i) {
        return i.userData.row == currRow;
    });

    //create array of filt phantom circle position X values
    filt.forEach(function (item) {
        curWinValX.push(item.position.x);
    });

    filt.pop();

}

export function update(winArr) {

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - prevTime;
    const speedUp = 1 + (curLvlArr[0] * 0.1);

    prevTime = elapsedTime;

    //if level 6 completed
    if (winIM !== undefined) {

        for (let i = 0; i < amount; i++) {

            winIM.getMatrixAt(i, matrix);
            position.setFromMatrixPosition(matrix);

            rotation.setFromRotationMatrix(matrix)
            rotation.z += -0.025;

            matrix.makeRotationFromEuler(rotation)

            matrix.setPosition(position);

            winIM.setMatrixAt(i, matrix);

            winIM.instanceMatrix.needsUpdate = true;

        }

    }

    if (drp.length === 0) { return }

    if (drp !== undefined) {

        let drpXNow = drp[0].position.x;
        let drpYNow = drp[0].position.y;

        //drops and spins the star  
        if (drpYNow > (currRow * 0.86)) {

            drp[0].rotateOnAxis(axis, ang * deltaTime * 100);
            drp[0].position.y += -0.002 * (deltaTime * 1000 * speedUp);

        }

        if (winArr == undefined) {
            return
        }

        //correct in X direction
        let sweetSpX = winArr.includes(drpXNow); //boolean

        //win Y value
        let targetY = currRow * 0.866;

        switch (drp[0].position.y > targetY + 0.1) {

            case true:
                //console.log(`still falling`)

                break;

            case false:

                //win star
                if (sweetSpX == true) {
                    console.log(`it's a hit`)
                    
                }
                if (hasWon === false) {
                    zzfx(...[, , 537, .02, .02, .22, 1, 1.59, -6.98, 4.97]);//star win
                }

                //remove phantom circle from scene and array
                let gone = scene.getObjectByName(`C_Row:` + currRow + ` PosX:` + drp[0].position.x);
                if (gone !== undefined) {
                    let index = winArr.indexOf(gone.position.x); // get index if value found otherwise -1

                    if (index > -1) {
                        winArr.splice(index, 1);
                    }

                    scene.remove(gone);

                    circPhan.splice(index, 1);

                    if (circPhan.length == 0) {

                        nextLevel();

                    }


                    if (winArr.length === 0) {

                        nextRow();
                    }

                    drp.pop();

                    setTimeout(() => { mkDrp(curLvlArr[0] + 4) }, 500);

                }

                //lose star
                if (sweetSpX !== true) {

                    if (hasWon === false) {

                        zzfx(...[, , 396, , , .16, 4, 1.32, , , , , , .3, , .3, , .8, .02]);//star loose

                        drp[0].material.color.set(0xFF0000);
                        drp[0].scale.set(0.0125, 0.015, 0.0125);
                        drp[0].position.z += 0.01

                        drp.pop();

                        setTimeout(() => { mkDrp(curLvlArr[0] + 4) }, 500)
                    }
                }

                break;

        }

    }


}

function runOnce() {

    if (!hasWon) {
        hasWon = true;
        gameWin();
    }

}

export function gameWin() {

    drp.pop();

    zzfx(...[1.35, , 687, , .08, .21, , 1.72, , , 176, , .08, , , , .03, .7, .1, .01]);//win time

    const pts2 = [], numPts = 5;

    for (let i = 0; i < numPts * 2; i++) {

        const l = i % 2 == 1 ? 10 : 20;

        const a = i / numPts * Math.PI;

        pts2.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));

    }

    const shp = new THREE.Shape(pts2);
    const gS = new THREE.ShapeGeometry(shp);

    winIM = new THREE.InstancedMesh(gS, new THREE.MeshPhongMaterial({ color: 0xff8000 }), 250);

    winIM.scale.set(0.015, 0.015, 0.015);

    const matrix = new THREE.Matrix4();

    for (let i = 0; i < 250; i++) {

        randoMx(matrix);
        winIM.setMatrixAt(i, matrix);

    }

    winIM.name = 'WinIM';

    scene.add(winIM);

    //hide arrow buttons
    let ob1 = scene.getObjectByName('ButLeft');
    let ob2 = scene.getObjectByName('ButRight');
    ob1.visible = false;
    ob2.visible = false;

    setTimeout(function () {
        replay();
    }, 5000);

}


const randoMx = function () {

    const pos = new THREE.Vector3();
    const rot = new THREE.Euler();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function (matrix) {

        pos.x = Math.random() * 400 - 200;
        pos.y = Math.random() * 400 - 200;
        pos.z = Math.random() * 400 - 600;

        rot.x = Math.random() * 2 * Math.PI;
        rot.y = Math.random() * 2 * Math.PI;
        rot.z = Math.random() * 2 * Math.PI;

        quat.setFromEuler(rot);

        scale.x = scale.y = scale.z = Math.random() * 1;

        matrix.compose(pos, quat, scale);

    };

}();


function replay() {

    drp.pop();

    //remove win stars
    let winStars = scene.getObjectByName('WinIM');
    scene.remove(winStars);


    //show start button
    let start = scene.getObjectByName('Start');
    start.visible = true;

    //reset levels
   currRow = 0
    for (let i = 1; i < 7; i++) {
        curLvlArr.push(i);
    }
   
    //remove Ui
    let group = scene.getObjectByName(`LevelUI`);
    for (var i = group.children.length - 1; i >= 0; --i){
        group.remove(group.children[i]);
    }
    scene.remove(group3)

    scene.children.forEach(child => child.name == "AH" ? scene.remove(child) : null)
   
    //new UI
    mkLvl();

    hasWon = false;

}

