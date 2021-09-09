import { scene, intersected, tempMatrix, raycaster, clkRm, drp } from './script.js';
import { gameStart } from './game.js';

//import { zzfx } from '../a/ZzFX.js'


export function intersectObjects(controller) {

    // Do not highlight when already selected
    if (controller.userData.selected !== undefined) return;

    var line = controller.getObjectByName('line');
    var intersections = getIntersections(controller);

    if (intersections.length > 0) {

        var intersection = intersections[0];

        var object = intersection.object;
        object.material.emissive.g = 1;
        intersected.push(object);

        line.scale.z = intersection.distance;

    } else {

        line.scale.z = 10;

    }

}

export function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(clkRm, true);

}

export function cleanIntersected() {

    while (intersected.length) {

        var object = intersected.pop();
        object.material.emissive.g = 0;

    }

}

export function onSelectStart(event) {

    //  zzfx(...[-0.1,,1665,,.09,.15,,1.11,,,,,,,,,,.59,.08,.13]); // click

    var controller = event.target;

    var intersections = getIntersections(controller);

    if (intersections.length > 0) {

        var intersection = intersections[0];

        //TO DO - change to; matrixInv.copy( matrix ).invert()
        tempMatrix.getInverse(controller.matrixWorld);

        var object = intersection.object;


        switch (object.name) {

            case 'ButLeft':

                if (drp.length === 0) { return }
                drp[0].position.x += -0.25;

                break;

            case 'ButRight':

                if (drp.length === 0) { return }
                drp[0].position.x += 0.25;

                break;

            case 'Start':

                gameStart();

                //hide start button
                let start = scene.getObjectByName('Start');
                start.visible = false;
                //scene.remove(start);

                let help = scene.getObjectByName('Help');
                // help.visible = false;
                scene.remove(help);


                let ob1 = scene.getObjectByName('ButLeft');
                ob1.visible = true;
                let ob2 = scene.getObjectByName('ButRight');
                clkRm.push(ob1, ob2);
                ob2.visible = true;

                break;

            case 'Exit':
                location.reload();
                break;

        }
    }
}


// export function onSelectEnd(event) {

//     // console.log(`on select end`);

// }