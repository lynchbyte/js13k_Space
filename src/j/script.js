/**
 * @author Shauna Lynch <lynchbyte.com>
 **/


import * as THREE from 'https://unpkg.com/three@0.131.1/build/three.module.js';
import { VRButton } from 'https://unpkg.com/three@0.131.1/examples/jsm/webxr/VRButton.js';

import { mkSkyBox,  mkBtn,  mkStB, mkTt, mkLvl, mkHlp, mkExt } from './mk.js';
import { intersectObjects, cleanIntersected, onSelectStart } from './sel.js';
import { update } from './game.js';

//import { gameStart , gameWin} from './game.js';

//Stats
// const stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

export const drp = [];
export const drpClear = [];
export const lvlClear = [];
export const circPhan = [];
export const curWinValX = [];

export const zPl = -7.5;

//export const winTime = [0, 1];
//export const countPart = 50000;
//export const particlesGeometry = new THREE.BufferGeometry();

//for selecting
export const raycaster = new THREE.Raycaster();
export const intersected = [];
export const tempMatrix = new THREE.Matrix4();
export const clkRm = [];

//Scene
export const scene = new THREE.Scene();

//Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Loaders
export const txtLdr = new THREE.TextureLoader();

//Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 30);
camera.position.set(0, 1.6, 3);

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio, 2);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

document.body.appendChild(VRButton.createButton(renderer));

// controllers
const controller = renderer.xr.getController(0);
scene.add(controller);

// controllers helper
var mC = new THREE.LineBasicMaterial({ color: 0xe65277 });
var gC = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);
var line = new THREE.Line(gC, mC);
line.name = 'line';
line.scale.z = 10;
controller.add(line.clone());

//Lights
const ambLt = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLt);

const lt = new THREE.PointLight(0xffffff, 0.5);
lt.position.set(2, 3, 4);
scene.add(lt);

//add skyBox
mkSkyBox();

//add title
mkTt();

//add start button behind
mkStB();

//add exit button
mkExt();

//Event Listeners
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

renderer.xr.addEventListener('sessionstart', onSesS)
//renderer.xr.addEventListener('sessionend', onSesE)

controller.addEventListener('selectstart', onSelectStart)
//controller.addEventListener('selectend', onSelectEnd)

// document.addEventListener('click', () => {

//     //gameStart();
//     // gameWin();
//     // let start = scene.getObjectByName('Title');
//     // start.visible = false;

// });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onSesS(event) {

    //add arrow buttons
    mkBtn();

    //add instructions
    mkHlp();

    //relocate title
    let title = scene.getObjectByName('Title');
    title.rotation.set(0, -45 * Math.PI / 180, 0);
    title.position.set(3, 2, -2.5);

    //show exit button and move
    let exit = scene.getObjectByName('Exit');
    exit.rotation.set(0, -45 * Math.PI / 180, 0);
    exit.position.set(3, 0.5, -2.5);
    exit.visible = true;

    //show start button
    let stbn = scene.getObjectByName('Start');
    stbn.visible = true;


    //add Level UI
    mkLvl();

}

// function onSesE(event) {

//     //console.log(`vr ended`)

// }

//Animate
const animate = () => {

    // stats.begin();

    //console.log(`Draw Calls`, renderer.info.render.calls);

    //stats.end();

    renderer.setAnimationLoop(render);
}

function render() {

    update(curWinValX);

    cleanIntersected();

    intersectObjects(controller);

    renderer.render(scene, camera);

}

animate();





