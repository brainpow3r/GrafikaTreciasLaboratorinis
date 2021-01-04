function createCamera(camScale) {

    var cam_scale = camScale;
    cameraGroup = new THREE.Object3D();
    cameraBox = new THREE.Mesh(new THREE.CubeGeometry(cam_scale, 2*cam_scale, 4*cam_scale), new THREE.MeshLambertMaterial({color: 0x666666}));
    cameraGroup.add(cameraBox);
    cameraBox.position.set(0, 0.5*cam_scale, -2.5*cam_scale);

    cameraCylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(cam_scale, cam_scale, cam_scale), new THREE.MeshLambertMaterial({color: 0x666666}));
    cameraGroup.add(cameraCylinder1);
    cameraCylinder1.rotation.z = Math.PI/2;
    cameraCylinder1.position.set(0, 1.5*cam_scale, -1.5*cam_scale);

    cameraCylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(cam_scale, cam_scale, cam_scale), new THREE.MeshLambertMaterial({color: 0x666666}));
    cameraGroup.add(cameraCylinder2);
    cameraCylinder2.rotation.z = Math.PI/2;
    cameraCylinder2.position.set(0, 1.5*cam_scale, -3.5*cam_scale);

    cameraCylinder3 = new THREE.Mesh(new THREE.CylinderGeometry(0.6*cam_scale, 0.5*cam_scale, cam_scale), new THREE.MeshLambertMaterial({color: 0x777777}));
    cameraGroup.add(cameraCylinder3);
    cameraCylinder3.rotation.x = Math.PI/2;
    cameraCylinder3.position.set(0, 0, 0);

    return cameraGroup;
  }

  $(function () {

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      var renderer = new THREE.WebGLRenderer();
      var whiteColor = 0xffffff;
      var blackColor = 0x000000;
      controls = new THREE.TrackballControls(camera);

      renderer.setClearColor(0x00758f, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMapEnabled = true;

      var size_of_slot = 30;

      var cubeGeometry = new THREE.BoxGeometry(size_of_slot, 4, size_of_slot);
      var cubeMaterialBlack = new THREE.MeshLambertMaterial({color: whiteColor});
      var cubeMaterialWhite = new THREE.MeshLambertMaterial({color: blackColor});

      var p_x = 0;
      var p_y = 0;
      var p_z = -7;
      var white = true;

        for(i = 0; i < 8; i++){
            for(j = 0; j < 8; j++){

                if(white){
                    var plane = new THREE.Mesh(cubeGeometry, cubeMaterialWhite);
                }
                else if(!white){
                    var plane = new THREE.Mesh(cubeGeometry, cubeMaterialBlack);
                }
              white = !white;
                plane.receiveShadow  = true;
                plane.castShadow = true;
                plane.rotation.x=-0.5*Math.PI;
                plane.position.x = p_x;
                plane.position.y = p_y;
                plane.position.z = p_z;
                p_x += size_of_slot;
                scene.add(plane);
            }

            p_x = 0;
            p_y += size_of_slot;
            white = !white;
        }

      camera.position.x = 0;
      camera.position.y = -300;
      camera.position.z = 200;
      camera.rotation.x = 1;
      camera.rotation.y = -0.06;
      camera.lookAt(scene.position);

        var camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 400);
        camera1.position.x = -200;
      camera1.position.y = 100;
      camera1.position.z = 70;
      camera1.lookAt(scene.position);

        camera1.rotation.z = Math.PI;
        camera1.rotation.x = -Math.PI/2;
        camera1.rotation.y = -Math.PI/2;
        scene.add(camera1);
        var helper1 = new THREE.CameraHelper(camera1);
        helper1.visible = false;
        scene.add( helper1 );


      var spotLight = new THREE.SpotLight(0xffffff, 3);
      spotLight.position.set(0, 400, 350);
      spotLight.castShadow = true;
      spotLight.target.position.set(100, 20, 100);

      scene.add(spotLight);

      $("#WebGL-output").append(renderer.domElement);

        var king_x = size_of_slot * 4;
        var king_y = 0;
        var king = createKing(24, king_x, king_y, whiteColor);
        scene.add(king);

        camera1Group = createCamera(4);
        camera1Group.position.set(-200, 100, 70);
        camera1Group.rotation.z = Math.PI/2;
        camera1Group.rotation.y = Math.PI/2;
        scene.add(camera1Group);

        camera2Group = createCamera(4);

        var camx = scene.position.x + size_of_slot*4;
        var camy = scene.position.y + size_of_slot*4;

        camera2Group.position.set(camx, camy, 70);
        camera2Group.lookAt(king.position);
        camera2Group.rotation.z = Math.PI/200;
        scene.add(camera2Group);

        var camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 400);
        camera2.position.x = camx;
      camera2.position.y = camy;
      camera2.position.z = 70;
      camera2.lookAt(king.position);
        camera2.rotation.z = 3.14;
        scene.add(camera2);

        var helper2 = new THREE.CameraHelper(camera2);
        helper2.visible = true;
        scene.add(helper2);

        var currCam = 1;
        var moveBackwards = false;
        var moveFigure = false;
        var zoom = 50;

        var guiControls = new function () {

            this.FOV = 45;

            this.Move = function() {
                moveFigure = !moveFigure;
            }

          this.CAM1 = function() {
              currCam = 1;
          }

          this.CAM2 = function() {
              camera1.updateProjectionMatrix();
              currCam = 2;
          }

          this.CAM3 = function() {
              currCam = 3;
          }

            this.updateC2 = function() {
                camera1.fov = guiControls.FOV;
                camera1.updateProjectionMatrix();
                helper1.update();
            }
        }

        var gui = new dat.GUI();

        gui.add(guiControls, 'Move');
      gui.add(guiControls, 'CAM1');
      gui.add(guiControls, 'CAM2');
      gui.add(guiControls, 'FOV', 45, 140).onChange(guiControls.updateC2);
      gui.add(guiControls, 'CAM3');

        render();

        function createKing(segments, xOffset, yOffset, color) {

          var pointsX = [
              220, 230, 245, 240, 255,
              265, 250, 260, 295, 295,
              290, 295, 285, 290, 300,
              315, 325, 325, 315, 295,
              290, 290, 295, 300, 310,
              315, 340, 345, 340, 340,
              250];
          var pointsY = [
              10, 15, 20, 40, 40,
              60, 61, 76, 86, 96,
              146, 151, 156, 166, 171,
              201, 206, 221, 231, 236,
              236, 296, 341, 366, 376,
              406, 421, 436, 456, 486,
              491];

          var points = [];
          var count = 33;
          for (var i = 0; i < count; i++) {
              points.push(new THREE.Vector3(25-pointsX[i]/10, 0, (1-pointsY[i]+100)/10));
          }

          var latheGeometry = new THREE.LatheGeometry(points, Math.ceil(segments), 0, 2 * Math.PI);
          var latheMesh = createMesh(latheGeometry, color);

          var extrudeSettings = {
              amount : 4,
              steps : 1,
              bevelEnabled: false,
              curveSegments: 24
          };

          var column = new THREE.Object3D();
          var shape = new THREE.Shape();
          shape.moveTo(10,10);
          shape.bezierCurveTo(17, 17, 17, 14, 24, 10);
          shape.lineTo(20, 9);
          shape.bezierCurveTo(18, 16, 16, 13, 9,  9);

          column.add(latheMesh);

          column.position.z = 31;
          column.position.y = yOffset;
          column.position.x = xOffset;

          return column;
      }

      function createMesh(geom, col) {

          var meshMaterial = new THREE.MeshLambertMaterial({color: col});
            meshMaterial.side = THREE.DoubleSide;

          var mesh = new THREE.Mesh(geom, meshMaterial);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.position.y = 5;
            return mesh;
      }

      var timing = 0;
      var position = king.position.y;

      function render() {

          if(moveFigure) {

              if(king.position.y <= size_of_slot*3 && moveBackwards == false){

                  king.position.y += 1;
                  if(king.position.y == position + 30) {
                      moveFigure = false;
                      position += 30;
                  }

                  camera2.lookAt(king.position);
                  camera2Group.lookAt(king.position);
                  camera2.rotation.z = Math.PI;
                  camera2Group.rotation.z = Math.PI*2;

                  if (king.position.y == size_of_slot*7) {
                      moveBackwards = true
                  }
              }
              else if(king.position.y >= size_of_slot && king.position.y <= size_of_slot*5 && moveBackwards == false) {

                  king.position.y += 1;
                  if(king.position.y == position + 30) {
                      moveFigure = false;
                      position += 30;
                  }

                  if(timing > 2.0 * Math.PI) {
                      timing = 0;
                  }
                  timing += 0.0525;

                  camera2.lookAt(king.position);
                  camera2Group.lookAt(king.position);
                  camera2.rotation.z = Math.PI + timing;
                  camera2Group.rotation.z = Math.PI*2 + timing;
              }
              else if(king.position.y >= size_of_slot*5 && king.position.y <= size_of_slot*7 && moveBackwards == false) {

                  king.position.y += 1;
                  if(king.position.y == position + 30) {
                      moveFigure = false;
                      position += 30;
                  }

                  camera2.lookAt(king.position);
                  camera2Group.lookAt(king.position);
                  camera2.rotation.z = Math.PI + timing;
                  camera2Group.rotation.z = Math.PI*2 + timing;

                  if(king.position.y  == size_of_slot*7) {
                      moveBackwards = true;
                  }
              }
              else if(moveBackwards == true && king.position.y >= size_of_slot*5) {

                  king.position.y -= 1;
                  if(king.position.y == position - 30) {
                      moveFigure = false;
                      position -= 30;
                  }

                  camera2.lookAt(king.position);
                  camera2Group.lookAt(king.position);
                  camera2.rotation.z = Math.PI + timing;
                  camera2Group.rotation.z = Math.PI*2 + timing;
              }
              else if(moveBackwards == true && king.position.y <= size_of_slot*5 && king.position.y >= size_of_slot*3){

                  king.position.y -= 1;
                  if(king.position.y == position - 30) {
                      moveFigure = false;
                      position -= 30;
                  }

                  if(timing > 2.0 * Math.PI) {
                      timing = 0;
                  }
                  timing += 0.0525;

                  camera2.lookAt(king.position);
                  camera2Group.lookAt(king.position);
                  camera2.rotation.z = Math.PI + timing;
                  camera2Group.rotation.z = Math.PI*2 + timing;

              }
              else if(moveBackwards == true && king.position.y <= size_of_slot*3 && king.position.y >= 0) {

                  king.position.y -= 1;
                  if(king.position.y == position - 30) {
                      moveFigure = false;
                      position -= 30;
                  }

                  camera2.lookAt(king.position);
                  camera2Group.lookAt(king.position);
                  camera2.rotation.z = Math.PI + timing;
                  camera2Group.rotation.z = Math.PI*2 + timing;
                  if(king.position.y  == 0 ) {
                      timing = 0;
                      moveBackwards = false;
                  }
              }
            }

            if(currCam == 1) {
                controls.enabled = true;
                renderer.render(scene, camera);
                controls.update();
            } else if(currCam == 2) {
              controls.enabled = false;
                renderer.render(scene, camera1);
            } else if(currCam == 3) {
              controls.enabled = false;
                renderer.render(scene, camera2);
            }

            requestAnimationFrame(render);
      }
});