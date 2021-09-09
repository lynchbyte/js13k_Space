import { scene, zPl, circPhan, clkRm, drp, drpClear, txtLdr } from './script.js';
import { curLvlArr } from './game.js';
import * as THREE from 'https://unpkg.com/three@0.131.1/build/three.module.js';
//import { zzfx } from '../a/ZzFX.js'

export const group3 = new THREE.Group();
group3.name = `LevelUI`;

export const partArr = [];

export function mkSkyBox() {

    let sBArr = [];
    let tx_ft = txtLdr.load('src/m/sb3.webp');
    let tx_bk = tx_ft;
    let tx_up = txtLdr.load('src/m/sb2.webp');
    let tx_dn = txtLdr.load('src/m/sb1.webp');
    let tx_rt = tx_ft;
    let tx_lf = tx_ft;

    sBArr.push(new THREE.MeshBasicMaterial({ map: tx_ft }));
    sBArr.push(new THREE.MeshBasicMaterial({ map: tx_bk }));
    sBArr.push(new THREE.MeshBasicMaterial({ map: tx_up }));
    sBArr.push(new THREE.MeshBasicMaterial({ map: tx_dn }));
    sBArr.push(new THREE.MeshBasicMaterial({ map: tx_rt }));
    sBArr.push(new THREE.MeshBasicMaterial({ map: tx_lf }));

    for (let i = 0; i < 6; i++)
        sBArr[i].side = THREE.BackSide;

    let sG = new THREE.BoxGeometry(20, 20, 20);
    let skybox = new THREE.Mesh(sG, sBArr);
    scene.add(skybox);

}

export function mkTri(btmQty) {

    circPhan.length = 0;

    let n = btmQty;

    const incrX = 1;
    const incrY = Math.tan(Math.PI / 180 * 60) * (incrX / 2);

    let farX = (-(n / 2 + 0.5));
    let rw = 0;

    const g = new THREE.CircleBufferGeometry(0.4, 6);
    const m = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.2 });

    while (rw < btmQty + 1) {

        const yPos = rw * incrY;

        while (n > 0) {

            const c = new THREE.Mesh(g, m);
            const xPos = farX + ((n) * incrX)
            c.position.set(xPos, yPos, zPl);
            scene.add(c);
            c.name = `C_Row:` + rw + ` PosX:` + c.position.x;
            c.userData.row = rw;
            c.userData.posX = c.position.x;

            circPhan.push(c);

            n--;  //add next circle
        }

        rw++; //go up a row

        n = btmQty - rw; //decrease circle qty for row

        farX = farX + incrX / 2;  //move starting X for each row


    }

}

export function mkTt() {

    const g = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const t = txtLdr.load('src/m/title.webp');
    const tb = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ map: t, transparent: true }));
    tb.position.set(-0, 2, zPl + 8);
    tb.name = "Title";
    scene.add(tb);

}

export function mkBtn() {

    const g2 = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
    const t = txtLdr.load('src/m/arwLft2.webp');

    const b = new THREE.Mesh(g2, new THREE.MeshPhongMaterial({ map: t, transparent: true }));
    b.position.set(-1.5, -2, zPl);
    b.name = "ButLeft";
    scene.add(b);

    const bR = new THREE.Mesh(g2, new THREE.MeshPhongMaterial({ map: t, transparent: true }));
    bR.rotation.set(0, 0, Math.PI / 180 * 180);
    bR.position.set(1.5, -2, zPl);
    bR.name = "ButRight";
    scene.add(bR);

}

export function mkStB() {

    const g = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const t = txtLdr.load('src/m/start.webp');
    const stb = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ map: t, transparent: true }));
    stb.position.set(-0, 2, zPl + 2);
    stb.name = "Start";
    stb.visible = false;
    scene.add(stb);

    clkRm.push(stb);

}

export function mkExt() {

    const g = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1);
    const t = txtLdr.load('src/m/exit.webp');
    const exb = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ map: t, transparent: true }));
    //stb.position.set(-0, 2, zPl + 2);
    exb.name = "Exit";
    scene.add(exb);
    exb.visible = false;

    clkRm.push(exb);

}


export function mkHlp() {

    const g = new THREE.PlaneBufferGeometry(1.5, 1.5, 1, 1);
    const t = txtLdr.load('src/m/help.webp');
    const htb = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ map: t, transparent: true }));
    htb.position.set(-0, 0.75, zPl + 2);
    htb.name = "Help";
    scene.add(htb);

  //  clkRm.push(htb);

}

export function mkDrp(yVal) {

    const pts2 = [], numPts = 5;

    for (let i = 0; i < numPts * 2; i++) {

        const l = i % 2 == 1 ? 10 : 20;

        const a = i / numPts * Math.PI;

        pts2.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));

    }

    const shp = new THREE.Shape(pts2);
    const gS = new THREE.ShapeGeometry(shp);

    const colorArr = [0xf27a00, 0xe67300, 0xff8000, 0xffa040, 0xffb366];
    const rando = Math.floor(Math.random() * 5);
    const color = colorArr[rando];

    const dr = new THREE.Mesh(gS, new THREE.MeshPhongMaterial({ color: color }));

    dr.position.set(0, yVal, zPl + 0.01);
    dr.rotation.set(0, 0, Math.random());
    const s = 0.025
    dr.scale.set(s, s, s);

    scene.add(dr);
    dr.name = "dr";

    scene.add(dr);
    drp.push(dr);
    drpClear.push(dr);

}

export function mkLvl() {

    const lvlX = -2.5;

    //make sign 
    const g = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const t = txtLdr.load('src/m/lvl.webp');
    const lvtBt = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ map: t, transparent: true }));
    lvtBt.position.set(0, 5, -0.05);
    group3.add(lvtBt);

    //make circles
    const g2 = new THREE.CircleBufferGeometry(0.1, 12);
    const m = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2 });

    let lMax = 6

    while (lMax > 0) {

        const lc = new THREE.Mesh(g2, m);
        const xPos = lvlX;
        const yPos = 4.5 - 0.5 * -(lMax - 6);
        lc.position.set(0, yPos, 0);
        group3.add(lc);

        lc.userData.lvl = (6 - lMax + 1);
        lc.name = `LvlCirc` + (lc.userData.lvl);

        lMax--;  //add next circle
    }

    //make arrow
    let lvlA = curLvlArr[0];
    let curCir = scene.getObjectByName('LvlCirc' + lvlA);

    const pointsTri = new THREE.Shape()
        //start at 0,0
        .lineTo(-3, 8)
        .lineTo(0, 6)
        .lineTo(3, 8)
        .lineTo(0, 0); // close path


    const gTri = new THREE.ShapeGeometry(pointsTri);
    const color = 0xff8000

    const ah = new THREE.Mesh(gTri, new THREE.MeshPhongMaterial({ color: color }));

    ah.position.set(-0.2, 4.5, 0);

    ah.rotation.set(0, 0, 90 * Math.PI / 180);
    const s = 0.05
    ah.scale.set(s, s, s);

    ah.name = 'AH';
    group3.add(ah);

    //move group
    group3.rotation.set(0, 45 * Math.PI / 180, 0)
    group3.position.set(lvlX, -2, -2.5);
    scene.add(group3);

}










