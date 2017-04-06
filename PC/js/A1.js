/**
 * UBC CPSC 314, Vsep2015
 * Assignment 1 Template
 */
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10,15,40);
camera.lookAt(scene.position); 
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5) ;
scene.add(worldFrame);

var displayScreenGeometry = new THREE.CylinderGeometry(5, 5, 10, 32);
var displayMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.2});
var displayObject = new THREE.Mesh(displayScreenGeometry,displayMaterial);
displayObject.position.x = 0;
displayObject.position.y = 5;
//scene.add(displayObject);
displayObject.parent = worldFrame;

// FLOOR 
var floorTexture = new THREE.ImageUtils.loadTexture('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1, 1);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
//scene.add(floor);
floor.parent = worldFrame;

// UNIFORMS
var remotePosition = {type: 'v3', value: new THREE.Vector3(0,5,3)};
var tvChannel = {type: 'i', value: 1};

// MATERIALS
var armadilloMaterial = new THREE.ShaderMaterial();
var remoteMaterial = new THREE.ShaderMaterial({
   uniforms: {
    remotePosition: remotePosition,
  },
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/remote.vs.glsl',
  'glsl/remote.fs.glsl'
];

// new THREE.SourceLoader().load(shaderFiles, function(shaders) {
//   armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
//   armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

//   remoteMaterial.vertexShader = shaders['glsl/remote.vs.glsl'];
//   remoteMaterial.fragmentShader = shaders['glsl/remote.fs.glsl'];
// })

// LOAD OBJECT
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = worldFrame;
    scene.add(object);

  }, onProgress, onError);
// model
// var onProgress = function(xhr) {
//     if (xhr.lengthComputable) {
//         var percentComplete = xhr.loaded / xhr.total * 100;
//         console.log(Math.round(percentComplete, 2) + '% downloaded');
//     }
// };
 
// var onError = function(xhr) {};
 
// THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
 
// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.setPath('../obj/');
// mtlLoader.load('OneBedroom_OneLivingRoom.mtl', function(materials) {
 
//     materials.preload();
 
//     var objLoader = new THREE.OBJLoader();
//     objLoader.setMaterials(materials);
//     objLoader.setPath('../obj/');
//     objLoader.load('OneBedroom_OneLivingRoom.obj', function(object) {
 
//         object.position.y = -0.5;
//         object.scale.set(scale,scale,scale);
//         scene.add(object);
 
//     }, onProgress, onError);
 
// });
}

// Load window model
var windowMaterial = new THREE.MeshBasicMaterial({color: 0x999999, transparent: true, opacity: 0.2});
loadOBJ('obj/keting/Changj.obj', windowMaterial, 0.05, 8,0,0, 0,Math.PI,0);

// loadOBJ('obj/OneBedroom_OneLivingRoom.obj', windowMaterial, 0.01, 0,3,0, 0,Math.PI,0);


// CREATE REMOTE CONTROL
var remoteGeometry = new THREE.SphereGeometry(1, 32, 32);
var remote = new THREE.Mesh(remoteGeometry, remoteMaterial);
remote.parent = worldFrame;
//scene.add(remote);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  if (keyboard.pressed("W")){
    console.log("ss")
    remotePosition.value.z -= 0.1;
  }
  else if (keyboard.pressed("S"))
    remotePosition.value.z += 0.1;

  if (keyboard.pressed("A"))
    remotePosition.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    remotePosition.value.x += 0.1;

  if (keyboard.pressed("R"))
    remotePosition.value.y += 0.1;
  else if (keyboard.pressed("F"))
    remotePosition.value.y -= 0.1;

  for (var i=1; i<4; i++)
  {
    if (keyboard.pressed(i.toString()))
    {
      tvChannel.value = i;
      break;
    }
  }
  remoteMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
}
function loadSprite() {
  var textureLoader = new THREE.TextureLoader();
  geometry = new THREE.Geometry();
  sprite1 = textureLoader.load( "../images/snowflake.png" );
  sprite2 = textureLoader.load( "../images/snowflake2.png" );
  // sprite3 = textureLoader.load( "textures/snowflake1.png" );
  // sprite4 = textureLoader.load( "textures/snowflake2.png" );
  // sprite5 = textureLoader.load( "textures/snowflake1.png" );

  for ( i = 0; i < 50; i ++ ) {

    var vertex = new THREE.Vector3();
    // vertex.x = Math.random() * 2000 - 1000;
    // vertex.y = Math.random() * 2000 - 1000;
    // vertex.z = Math.random() * 2000 - 1000;
    vertex.x = Math.random(0,1) * 10;
    vertex.y = Math.random(0,1) * 10;
    vertex.z = Math.random(0,1) * 10;
    geometry.vertices.push( vertex );

  }

  parameters = [
    // [ [1.0, 0.2, 0.5], sprite2, 1 ],
    // [ [0.95, 0.1, 0.5], sprite3, 15  ],
    [ [0.90, 0.05, 0.5], sprite1, 1 ],
    // [ [0.85, 0, 0.5], sprite5, 8 ],
    // [ [0.80, 0, 0.5], sprite4, 5 ]
  ];

  for ( i = 0; i < parameters.length; i ++ ) {

    color  = parameters[i][0];
    sprite = parameters[i][1];
    size   = parameters[i][2];
    var materials = [];
    materials[i] = new THREE.PointsMaterial( { size: size, map: sprite} );
    materials[i].color.setHSL( color[0], color[1], color[2] );

    particles = new THREE.Points( geometry, materials[i] );

    particles.rotation.x = Math.random(0,1) * 6;
    particles.rotation.y = Math.random(0,1) * 6;
    particles.rotation.z = Math.random(0,1) * 6;

    scene.add( particles );
  }
}
loadSprite();

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();

