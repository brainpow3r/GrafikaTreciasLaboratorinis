$(function () {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(0xa1a1a1, 1);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;
  
    camera.position.x = -30;
    camera.position.y = 200;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  
    $("#WebGL-output").append(webGLRenderer.domElement);
    camControl = new THREE.TrackballControls(camera, webGLRenderer.domElement);
  
    const texture = new THREE.TextureLoader().load('https://i.imgur.com/WS6X5M3.png', (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    });
  
    const material = new THREE.MeshBasicMaterial({ map: texture });
  
    var step = 0;
    var shapePointsGroup;
    var torusMesh;
    var r_bigger = 25;
    var r_smaller = 10;
    var pointsToGenerate = 1000;
  
    createShapePoints(material);
  
    function redraw(propr_bigger, propr_smaller, points) {
      r_bigger = propr_bigger;
      r_smaller = propr_smaller;
      pointsToGenerate = points;
      scene.remove(shapePointsGroup);
      scene.remove(torusMesh);
      createShapePoints(material);
    }
  
    const props = { r_bigger, r_smaller, pointsToGenerate }
  
    const gui = new dat.GUI();
    gui.add(props, 'r_bigger', 25, 50)
      .step(1)
      .name('r_bigger')
      .onFinishChange(() => redraw(props.r_bigger, props.r_smaller, props.pointsToGenerate));
    gui.add(props, 'r_smaller', 10, 20)
      .step(1)
      .name('r_smaller')
      .onFinishChange(() => redraw(props.r_bigger, props.r_smaller, props.pointsToGenerate));
    gui.add(props, 'pointsToGenerate', 1000, 4000)
      .step(250)
      .name('Points generated')
      .onFinishChange(() => redraw(props.r_bigger, props.r_smaller, props.pointsToGenerate));
  
  
    render();
  
    function generateRandomNumber() {
      const number = Math.random() * (r_bigger + r_bigger * 1.5);
      return number * (Math.random() < 0.5 ? -1 : 1);
    }

    function getX(vertex) {
      const teta = Math.atan2(vertex.x, vertex.z);
      return teta / (2 * Math.PI) + 0.5;
    }
  
    function getY(vertex) {
        const teta = Math.atan2(vertex.x, vertex.z);
        const w = (vertex.x / Math.sin(teta)) - r_bigger;
        const fi = Math.atan2(vertex.y, w);
        return fi / Math.PI + 0.5;
    }

    function fixTexture(face1, face2) {
      const dif = 0.9;
      if (Math.abs(face1.x - face2.x) > dif) {
          const faceToAdjust = face1.x > face2.x ? face1 : face2;
          faceToAdjust.x = 0;
      }
    }
  
    function isThorusShape(x, y, z, smaller_radius, bigger_radius, epsilon) {
      let result;
      let xyz_squared_sum = Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2);
      let firstPart = Math.pow(xyz_squared_sum - Math.pow(smaller_radius, 2), 2);
      let secondPart = 4 * Math.pow(bigger_radius, 2) * (Math.pow(x, 2) + Math.pow(z, 2));
      result = firstPart - secondPart;
      return result <= epsilon;
    }
  
    function createShapePoints(texture) {
      var points = [];
      const epsilon = 0.1;
      var count = 0;
      shapePointsGroup = new THREE.Group();
      const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false });
  
      while (pointsToGenerate > count) {
        const v = count / pointsToGenerate;

        const theta = generateRandomNumber();
        const fi = Math.PI * (v - 0.5);
  
        const X = (r_bigger + r_smaller * Math.cos(fi)) * Math.sin(theta);
        const Y = r_smaller * Math.sin(fi);
        const Z = (r_bigger + r_smaller * Math.cos(fi)) * Math.cos(theta);

        if (isThorusShape(X, Y, Z, r_smaller, r_bigger, epsilon)) {
          points.push(new THREE.Vector3(X, Y, Z));
          const spGeom = new THREE.SphereGeometry(0.4);
          const spMesh = new THREE.Mesh(spGeom, pointMaterial);
          spMesh.position.set(X, Y, Z);
          shapePointsGroup.add(spMesh);
          count++;
        }
      }
  
      scene.add(shapePointsGroup);
  
      const torusGeometry = new THREE.ConvexGeometry(points);
      const upperLayerFaces2d = torusGeometry.faceVertexUvs[0];
  
      var upperLayerFace;
      var index = 0;
      torusGeometry.faces.forEach((face, index) => {
        var verticeX = torusGeometry.vertices[face.a];
        var verticeY = torusGeometry.vertices[face.b];
        var verticeZ = torusGeometry.vertices[face.c];

        upperLayerFace = upperLayerFaces2d[index];
  
        upperLayerFace[0].x = getX(verticeX);
        upperLayerFace[0].y = getY(verticeX);
        upperLayerFace[1].x = getX(verticeY);
        upperLayerFace[1].y = getY(verticeY);
        upperLayerFace[2].x = getX(verticeZ);
        upperLayerFace[2].y = getY(verticeZ);

        fixTexture(upperLayerFace[0], upperLayerFace[1]);
        fixTexture(upperLayerFace[1], upperLayerFace[2]);
        fixTexture(upperLayerFace[2], upperLayerFace[0]);
        index++;
      });
  
      torusGeometry.uvsNeedUpdate = true;
  
      torusMesh = new THREE.Mesh(torusGeometry, texture);
      scene.add(torusMesh);
    }
  
    function render() {
  
      shapePointsGroup.rotation.y = step;
      camControl.update();
  
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
  });