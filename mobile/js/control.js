var bgStates = 0;
var windowOBJ;
var watchID = null; 
var roomLight;
var acGeometry;
var ctrlConfig = {
  light: false,
  humidity: false,
  AC_on: false,
  AC_temperature: 26,
};
// 传给场景的参数
var temperature = 28;
var humidity = 50;
var light = 1000;
var textureLoader = new THREE.TextureLoader();

var container, stats;
var materials = [];


var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight * 0.85 / 2;

var sunLight, sunLight2, sunLight3, bigLight;

var group;

var raycaster;
var mouse = new THREE.Vector2();
var snowSpritePoints;
var fallSpeed = 1;


init();
animate();

function init() {
  var canvasdiv = document.getElementById("canvas");

  container = document.createElement( 'div' );
  canvasdiv.appendChild( container );

  scene = new THREE.Scene();
  group = new THREE.Group();

  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / (window.innerHeight), 2, 10000 );
  // camera.position.z = 45;
  // camera.position.y = 0;
  camera.position.set( -150, 120, 450 );

  camera.up.x = 0;//设置相机的上为「x」轴方向
  camera.up.y = 1;//设置相机的上为「y」轴方向
  camera.up.z = 0;//设置相机的上为「z」轴方向
  // camera.position.set(0,15,40);
  camera.lookAt(scene.position); 


  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000); // white background colour
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight * 0.85);
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );

  // stats = new Stats();
  // container.appendChild( stats.dom );

  var controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  initRoomGroup();
  scene.add(roomGroup);


}
var roomGroup;
function initRoomGroup() {
  roomGroup = new THREE.Group();

  //  TEXTURES_FLOOR
  var textureSquares = textureLoader.load( "textures/mu.jpg" );
  textureSquares.repeat.set( 50, 50 );
  textureSquares.wrapS = textureSquares.wrapT = THREE.RepeatWrapping;
  textureSquares.magFilter = THREE.NearestFilter;
  textureSquares.format = THREE.RGBFormat;
  // GROUND
  var groundMaterial = new THREE.MeshPhongMaterial( {
    shininess: 0,
    color: 0xffffff,
    specular: 0xffffff,
    map: textureSquares
  } );

  // TEXTURES_WALL
  var textureWall = textureLoader.load( "textures/wall.jpg" );
  textureWall.repeat.set( 20, 20 );
  textureWall.wrapS = textureWall.wrapT = THREE.RepeatWrapping;
  textureWall.magFilter = THREE.NearestFilter;
  textureWall.format = THREE.RGBFormat;
  // WALL
  var wallMaterial = new THREE.MeshPhongMaterial( {
    shininess: 80,
    color: 0xffffff,
    specular: 0xffffff,
    map: textureWall
  } );

  var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100 );
  var wallGeometry = new THREE.BoxGeometry(10,100,100);  

  var opaqueGroundMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2});
  var ground2 = new THREE.Mesh( planeGeometry, groundMaterial );
  ground2.position.set( 0, 0, 0 );
  ground2.rotation.x = - Math.PI / 2;
  ground2.scale.set( 1000, 1000, 1000 );
  ground2.receiveShadow = true;
  roomGroup.add( ground2 );

  var wallLeft = new THREE.Mesh( wallGeometry, wallMaterial );
  wallLeft.position.set( -300, 0, 0 );
  wallLeft.scale.set( 10, 10, 10 );
  wallLeft.receiveShadow = true;
  // roomGroup.add( wallLeft );
  var wallRight = new THREE.Mesh( wallGeometry, wallMaterial );
  wallRight.position.set( 200, 0, 0 );
  wallRight.scale.set( 10, 10, 10 );
  wallRight.receiveShadow = true;
  // roomGroup.add( wallRight );

  

  addComponent(scene);

  if(temperature <= 16) {
    showSnowSprites();
    fallSpeed = 1 + (16 - temperature)*0.1;
  }
  if( temperature >= 26) {
    showSunSprites();
    fallSpeed = -1 - (temperature - 26)*0.2;
  }
  if( temperature > 16 && temperature < 26) {
    showWaterSprites();
    fallSpeed = (temperature - 16)*0.05;
  }
  var spriteNum;
  if( humidity <= 45) {
    spriteNum = (humidity - 20) * 10;
  }
  else if( humidity > 45 && humidity < 75 ) {
    spriteNum = 250 + (humidity - 45) * 40;
  }
  else if( humidity > 75) {
    spriteNum = 1450 + (humidity - 75) * 10;
  }
  spriteNum = Math.floor(spriteNum);
  changeOpacity(spriteNum);

  

}

var loader;
function addModel (path, scale, poX, poY, poZ, roX, roY, roZ) {
  loader.load(
   path,
    // Function when resource is loaded
    function ( object ) {
      object.scale.x = object.scale.y = object.scale.z = scale;
      object.position.y = poY;
      object.position.z = poZ;
      object.position.x = poX;
      object.rotation.y = roY;
      roomGroup.add(object);
    }
    );

}
// add lights and models
function addComponent ( scene ) {
  loader = new THREE.OBJLoader();
  var ambient = new THREE.AmbientLight( 0x404040 );
  roomGroup.add( ambient );

  roomLight = new THREE.PointLight( 0xffaa00, 0, 1000);
  roomLight.position.set( 0, 800, 100 );
  roomGroup.add( roomLight );
  roomGroup.add( new THREE.PointLightHelper( roomLight, 5 ) );

  sunLight = new THREE.DirectionalLight( 0xffffff, 0.5);
  sunLight.position.set( 0, 1000, 2000 );
  // sunLight.castShadow = true;
  roomGroup.add(sunLight);

  var textureSofa = textureLoader.load( "textures/sofa.jpg" );
  textureSofa.repeat.set( 6, 2 );
  textureSofa.wrapS = textureSofa.wrapT = THREE.RepeatWrapping;
  textureSofa.format = THREE.RGBFormat;

  var materialSofa = new THREE.MeshPhongMaterial( { shininess:5, color: 0xffffff, specular: 0xFFffff, map: textureSofa } );
  // var humiMaterial = new THREE.MeshBasicMaterial({color: 0xD1EEEE, transparent: false});

  var textureBed = textureLoader.load( "textures/bed.jpg" );
  textureBed.repeat.set( 6, 2 );
  textureBed.wrapS = textureSofa.wrapT = THREE.RepeatWrapping;
  textureBed.format = THREE.RGBFormat;
  var materialBed = new THREE.MeshPhongMaterial( { shininess:5, color: 0xffffff, specular: 0xFFffff, map: textureBed } );

  var textureHumi = textureLoader.load( "textures/jiashiqi.jpg" );
  textureHumi.repeat.set( 6, 2 );
  textureHumi.wrapS = textureSofa.wrapT = THREE.RepeatWrapping;
  textureHumi.format = THREE.RGBFormat;
  var humiMaterial = new THREE.MeshPhongMaterial( { shininess:5, color: 0xffffff, specular: 0xFFffff, map: textureHumi } );


  // addmodel是不带材质 loadobj是带材质 可以改改把addmodle删掉
  loadOBJ('obj/bed1.obj',materialBed, 0.9, -100, 0, 0, 0, Math.PI/2, 0, -1 );
  loadOBJ('obj/mirror.obj', materialSofa, 0.09, -170, 0, 180, 0, Math.PI/2, 0, -1);
  loadOBJ('obj/sofa1.obj', materialSofa, 0.6, 80, 35, 150, 0, -Math.PI/2, 0, -1);
  loadOBJ('obj/sofa1.obj', materialSofa, 0.6, 80, 35, 200, 0, -Math.PI/2, 0, -1);
  loadOBJ('obj/humidifier.obj',humiMaterial, 3, -170, 0, 270, 0, Math.PI/2, 0, -1);
  addModel('obj/air-con1.obj', 0.01, 100, 0, 0, 0, 0, 0);
  loadOBJ('obj/light.obj', materialBed, 0.2, 0, 200, 100, 0, 0, 0, -1);
  // LOAD WINDOW MODEL
  var windowMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
  loadOBJ('obj/window-frame.obj', humiMaterial, 0.08, 10, 150, -80, 0, 0, 0, 0);
  loadOBJ('obj/window-right.obj', windowMaterial, 0.08, 10, 150, -80, 0, 0, 0, 1);
  loadOBJ('obj/window-left.obj', windowMaterial, 0.08, 10, 150, -80, 0, 0, 0, 2);
  loadOBJ('obj/curtains-poll.obj', humiMaterial, 2, 10, 140, -90, 0, 0, 0, 4);
  loadOBJ('obj/curtains.obj', materialSofa, 2.5, 10, 160, -90, 0, 0, 0, 5);
  addSprite();
  snowSprite();
  humiSprite();

  update();
  /* ACCELOROMETER PART */  
  document.addEventListener("deviceready", onDeviceReady, false);  
}

// LOAD OBJECT
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot, modelIndex) {
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
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    roomGroup.add(object);
    if (modelIndex == 0) {
      windowFrameOBJ = object;
    }
    else if (modelIndex == 1) {
      windowRightOBJ = object;
    }
    else if (modelIndex == 2) {
      windowLeftOBJ = object;
    } 
    else if (modelIndex == 4) {
      curtainPollOBJ = object;
    }
    else if (modelIndex == 5) {
      curtainOBJ = object;
      curtainOBJ.scale.set(scale, 1.5, scale);
    } 

  }, onProgress, onError);
}

// SETUP UPDATE CALL-BACK
function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

function onDeviceReady() {  
  startWatch(); 
  // Connect to server
  socket = io('http://192.168.0.100:8000');

  socket.on('server to mobile', function (data) {
    // Receive sensor data from PC
    temperature = data.temperature;
    humidity = data.humidity;
    noise = data.noise;
    light = data.light;
    modifySensorStat();

    if (data.withMsg) {
      alert(data.msg);
    }
  });
}

function modifySensorStat() {
  // Modify environment according to emperature and humidity
  if(temperature <= 16) {
    showSnowSprites();
    fallSpeed = 1 + (16 - temperature)*0.1;
  }
  if( temperature >= 26) {
    showSunSprites();
    fallSpeed = -1 - (temperature - 26)*0.2;
  }
  if( temperature > 16 && temperature < 26) {
    showWaterSprites();
    fallSpeed = (temperature - 16)*0.05;
  }
  var spriteNum;
  if( humidity <= 45) {
    spriteNum = (humidity - 20) * 10;
  }
  else if( humidity > 45 && humidity < 75 ) {
    spriteNum = 250 + (humidity - 45) * 40;
  }
  else if( humidity > 75) {
    spriteNum = 1450 + (humidity - 75) * 10;
  }
  spriteNum = Math.floor(spriteNum);
  changeOpacity(spriteNum);

  // Modify light
  sunLight.intensity = light / 3000 * 0.8;
}

function startWatch() { 
  var options = { frequency: 100 };  
  watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);     
} 

function stopWatch() {         
  if (watchID) { 
    navigator.accelerometer.clearWatch(watchID); 
    watchID = null;         
  }     
}  

function onSuccess(acceleration) {
    if (moveMode != 0 && accRec == false) {
        relaX = acceleration.x;
        relaY = acceleration.y;
        relaZ = acceleration.z;
        accRec = true;
    }
    
    if (moveMode == 1) {
        // Move window
        windowLeftOBJ.position.x -= (acceleration.x - relaX) / 1.8;
        if (windowLeftOBJ.position.x < 10) {
          windowLeftOBJ.position.x = 10;
        }
        if (windowLeftOBJ.position.x > 80) {
          windowLeftOBJ.position.x = 80;
        }
        windowStat = 1 - (windowLeftOBJ.position.x - 10) / 70;
    }

    else if (moveMode == 2) {
        // Rotate window
        windowRightOBJ.rotation.y += (acceleration.z - relaZ) / 80;
        if (windowRightOBJ.rotation.y > Math.PI / 2) {
          windowRightOBJ.rotation.y = Math.PI / 2;
        }
        else if (windowRightOBJ.rotation.y < 0) {
          windowRightOBJ.rotation.y = 0;
        }
    }

    else if (moveMode == 3) {
        // Draw curtains
        curtainOBJ.scale.x += (acceleration.x - relaX) / 60.0;
        curtainOBJ.position.x -= (acceleration.x - relaX) / 2;
        if (curtainOBJ.scale.x > 2.5) {
          curtainOBJ.scale.x = 2.5;
        }
        if (curtainOBJ.scale.x < 0) {
          curtainOBJ.scale.x = 0;
        }

        if (curtainOBJ.position.x > 85) {
          curtainOBJ.position.x = 85;
        }
        if (curtainOBJ.position.x < 10) {
          curtainOBJ.position.x = 10;
        }
        curtainStat = curtainOBJ.scale.x / 2.5;
    }

    socket.emit('mobile to server', { 
        windowStat: windowStat,
        curtainStat: curtainStat,
        lightStat: lightStat,
        airconStat: airconStat,
        humidifierStat: humidifierStat
    });
}
function onError(accelerometerError) {
  alert('Accelerometer Error: ' + accelerometerError.code);
}


//双击canvas改变背景色
$('canvas').dblclick(function () {
  if (bgStates == 0) {
    bgStates = 1;
    renderer.setClearColor(new THREE.Color(0xebebeb));
	// document.getElementById("btn_change_bg").innerHTM = "关灯";
  }
  else if (bgStates == 1) {
  	bgStates = 0;
  	renderer.setClearColor(0x000000);
  	// document.getElementById("btn_change_bg").innerHTM = "开灯";
  }
  renderer.render( scene, camera );
})
//添加空调的粒子系统
var roomColdSpriteTetr;
var roomWarmSpriteTetr;
var roomColdParticles;
function addSprite() {
  temp = 0.01;
  rad = 0;
  acGeometry = new THREE.Geometry();
  var coldSpriteGroup = new THREE.Group();
  coldSpriteGroup.name = "coldSprite";
  roomColdSpriteTetr = textureLoader.load( "textures/cold.png" );
  roomWarmSpriteTetr = textureLoader.load( "textures/sun.png" );
  for ( i = 0; i < 200; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random()*30+70;
    vertex.y = Math.random()*30+120;
    vertex.z = Math.random()*20+15;
    acGeometry.vertices.push( vertex );
  }
  parameters = [
  [ [1, 1, 1], roomColdSpriteTetr, 3 ],
  ];
  for ( i = 0; i < parameters.length; i ++ ) {
    color  = parameters[i][0];
    sprite = parameters[i][1];
    size   = parameters[i][2];
    materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true ,opacity:0.6} );
    materials[i].color.setHSL( color[0], color[1], color[2] );
    roomColdParticles = new THREE.Points( acGeometry, materials[i] );
    coldSpriteGroup.name = "ac";
    coldSpriteGroup.add( roomColdParticles );
  }

  roomGroup.add(coldSpriteGroup);
  removeACSprite();
}
function acColdSprite() {
  roomColdParticles.material.setValues({map: roomColdSpriteTetr});
}
function acWarmSprite() {
  roomColdParticles.material.setValues({map: roomWarmSpriteTetr});
}
function removeACSprite() {
  roomColdParticles.position.set(0,1000,0);

  // roomColdParticles.geometry.vertices.forEach(function (v) {
  //   v.y = 1000;
  // });
  acGeometry.verticesNeedUpdate = true;

}
function readdACSprite() {
  roomColdParticles.position.set(0,0,0);
  acGeometry.verticesNeedUpdate = true;
}
function removeHumiSprite() {
  humiSpritePoints.position.set(0,1000,0);
  humiGeometry.verticesNeedUpdate = true;
}
function readdHumiSprite() {
  humiSpritePoints.position.set(0,0,0);
  humiGeometry.verticesNeedUpdate = true;
}
//添加雪花的粒子系统 室内温度和湿度

var snowGeometry;
var snowSpritePoints;
var sunTexture;
var snowTexture;
var waterTexture;

function snowSprite() {
  snowGeometry = new THREE.Geometry();
  // var snowSpriteGroup = new THREE.Group();
  var textureLoader = new THREE.TextureLoader();
  snowTexture = textureLoader.load( "textures/cold.png" );
  var range = 800;
  for ( i = 0; i < 1700; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random()*range-400;
      vertex.y = Math.random()*500;
      vertex.z = Math.random()*500-200;
      snowGeometry.vertices.push( vertex );
  }
  var sprMaterial = new THREE.PointsMaterial({
      size: 3,
      transparent: true,
      opacity: 0.8,
      map: snowTexture,
      blending: THREE.AdditiveBlending,
      depthTest: false, 
  });
  sunTexture = textureLoader.load( "textures/sun.png" );
  waterTexture = textureLoader.load( "textures/water.png" );

  snowSpritePoints = new THREE.Points(snowGeometry, sprMaterial);
  snowSpritePoints.position.set(0,0,0);
  
  // snowSpritePoints.rotation.z = -Math.PI/5;
  roomGroup.add(snowSpritePoints);

}
function showSnowSprites() {
  snowSpritePoints.material.setValues({map: snowTexture});
  // if (snowSprStatus == false) {
  //   roomGroup.add(snowSpritePoints);
  //   snowSprStatus = true;
  // }
}
function showSunSprites() {
  snowSpritePoints.material.setValues({map: sunTexture});
}
function showWaterSprites() {
  snowSpritePoints.material.setValues({map: waterTexture});
}
var SUM = 1700;
var previousNum = SUM;
function changeOpacity( num ) {
  var n;
  if ( num < previousNum) {
    for( n = num; n < previousNum; n++) {
      snowSpritePoints.geometry.vertices[n].y = 1000;
    }
  }
  else if( num > previousNum) {
    for( n = previousNum; n < num; n++) {
      snowSpritePoints.geometry.vertices[n].y = Math.random() * 500;
    }
  }
  previousNum = num;
  snowGeometry.verticesNeedUpdate = true;
}

var humiSpritePoints;
function humiSprite() {
  humiGeometry = new THREE.Geometry();
  // var snowSpriteGroup = new THREE.Group();
  var textureLoader = new THREE.TextureLoader();
  humiTexture = textureLoader.load( "textures/water.png" );
  for ( i = 0; i < 500; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random()*15-176;
      vertex.y = Math.random()*15+135;
      vertex.z = Math.random()*15+275;
      humiGeometry.vertices.push( vertex );
  }
  var humiMaterial = new THREE.PointsMaterial({
      size: 1,
      transparent: true,
      opacity: 0.3,
      map: humiTexture,
      blending: THREE.AdditiveBlending,
      depthTest: false, 
  });
  humiSpritePoints = new THREE.Points(humiGeometry, humiMaterial);
  // humiSpritePoints.position.set(-180,130,275);
  var humiSpriteGroup = new THREE.Group();
  humiSpriteGroup.add(humiSpritePoints)
  humiSpriteGroup.name = "humi";
  roomGroup.add(humiSpriteGroup);
  removeHumiSprite();
}

function animate() {

  requestAnimationFrame( animate );
  // stats.begin();
  render();
  // stats.end();
}
var rotateAxis = new THREE.Vector3(100,50,0)
var radIncrement;
var rad;

function render() {
  radIncrement = 0.0001;
  rad = 0;
  var time = Date.now() * 0.00005;

  // camera.position.x += ( mouseX - camera.position.x ) ;
  // camera.position.y += ( - mouseY - camera.position.y ) ;
  // camera.updateMatrixWorld();

  //没有搞定的raycaster
  // raycaster.setFromCamera( mouse, camera );
  // // calculate objects intersecting the picking ray
  // var intersects = raycaster.intersectObjects( scene.children );
  // for ( var i = 0; i < intersects.length; i++ ) {
  //   console.log("get 344 "+i)
  //   console.log(intersects[i])
  //   // intersects[ i ].object.material.color.set( 0xff0000 );
  // }

  // camera.lookAt( scene.position );
  
  // 空调粒子系统的旋转效果
  for ( i = 0; i < scene.children.length; i ++ ) {
    var object = scene.children[ i ];
    if ( object instanceof THREE.Group ) {
      for ( j = 0; j < object.children.length; j ++ ) {
        var object2 = object.children[ j ];
        if(object2 instanceof THREE.Group) {
          if(object2.name == "ac") {
            for (var k = 0; k < object2.children.length; k++) {
              var object3 = object2.children[ k ];
              if(object3 instanceof THREE.Points) {
                var vertices = object3.geometry.vertices;
                var bias = Math.random()*10+90;
                vertices.forEach(function (v) {
                  if(v.z < bias) {
                    v.z = v.z + 1;
                  }
                  if (v.z >= bias) v.z = Math.random()*30+15;
                });
                acGeometry.verticesNeedUpdate = true;
                // var vertices = object3.geometry.vertices;
                // vertices.forEach(function (v) {
                //   rad += radIncrement;
                //   v.rotateOnAxis(new THREE.Vector3(-400,-200,-200).normalize(), 0.075)
                // });
                // snowGeometry.verticesNeedUpdate = true;

                // rad += radIncrement;
                // object2.rotateOnAxis(new THREE.Vector3(70,130,60).normalize(), 0.075)
                // object3.rotation.x = time*10
              }
            }
          }
          if(object2.name == "humi") {
            for (var k = 0; k < object2.children.length; k++) {
              var object3 = object2.children[ k ];
              if(object3 instanceof THREE.Points) {
                var vertices = object3.geometry.vertices;
                var bias = Math.random()*10+160;
                vertices.forEach(function (v) {
                  if(v.y < bias) {
                    v.y = v.y + 1;
                  }
                  if (v.y >= bias) v.y = Math.random()*15+135;
                });
                humiGeometry.verticesNeedUpdate = true;

                // object3.rotation.x = time*10
              }
            }
          }
          
          // object2.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }

      }

    }
  }

  // var vertices = snowSpritePoints.geometry.vertices;
  //      vertices.forEach(function (v) {
  //         v.y = v.y - (v.velocityY);
  //         v.x = v.x - (v.velocityX);

  //         if (v.y <= 0) v.y = 3000;
  //         if (v.x <= -1000 || v.x >= 1000) v.x = 0;
  //     });

  for (var i = 0; i < scene.children.length; i++) {
    var object = scene.children[i];
    if(object instanceof THREE.Group) {
      for ( j = 0; j < object.children.length; j ++ ) {
        var object2 = object.children[ j ];
        if(object2 instanceof THREE.Points) {
          var vertices = object2.geometry.vertices;
          vertices.forEach(function (v) {
            if(0 < v.y && v.y < 500) {
              v.y = v.y - fallSpeed;
            }
            if ((v.y < 0 && v.y > -100) || (v.y > 500 && v.y < 600)) v.y = Math.random()*500 - 50;
          });
          snowGeometry.verticesNeedUpdate = true;
          // humiGeometry.verticesNeedUpdate = true;
          // object2.position.y -= fallSpeed;
          // if(object2.position.y == 0) {
          //   object2.position.y = 500;
          // }
        }
      }
    }
  };

//之前的example里来的..我也不知道这段代码干啥的
  // for ( i = 0; i < materials.length; i ++ ) {
  //   color = parameters[i][0];
  //   h = ( 360 * ( color[0] + time ) % 360 ) / 360;
  //   materials[i].color.setHSL( h, color[1], color[2] );
  // }
  renderer.render( scene, camera );
}
/* SERVER PART */
var socket = null;


/* ACCELOROMETER PART */
var watchID = null;   
var moveMode = 0;

// Device status
var windowStat = 1.0;
var curtainStat = 1.0;
var lightStat = 0;
var airconStat = 0;
var humidifierStat = 0;

// Relative accelerometer status
var accRec = false; // If relative accelerometer status has been recorded
var relaX = 0;
var relaY = 0;
var relaZ = 0;
/* Button events */
function ctrlSlidingWindow() {
    btSWindow = document.getElementById('ctrl-sliding-window');
    if (moveMode == 0) {
        moveMode = 1;
        btSWindow.src = 'img/bt-sliding-window-on.png';
        btSWindow.style.border = '3px solid #fdefca';
    }
    else if (moveMode == 1) {
        moveMode = 0;
        btSWindow.src = 'img/bt-sliding-window-off.png';
        btSWindow.style.border = '3px dotted #eeeeee';
        accRec = false;
    }
}

function ctrlCasementWindow() {
    btCWindow = document.getElementById('ctrl-casement-window');
    if (moveMode == 0) {
        moveMode = 2;
        btCWindow.src = 'img/bt-casement-window-on.png';
        btCWindow.style.border = '3px solid #fdefca';
    }
    else if (moveMode == 2) {
        moveMode = 0;
        btCWindow.src = 'img/bt-casement-window-off.png';
        btCWindow.style.border = '3px dotted #eeeeee';
        accRec = false;
    }
}

function ctrlCurtains() {
    btCurtains = document.getElementById('ctrl-curtains');
    if (moveMode == 0) {
        moveMode = 3;
        btCurtains.src = 'img/bt-curtains-on.png';
        btCurtains.style.border = '3px solid #fdefca';
    }
    else if (moveMode == 3) {
        moveMode = 0;
        btCurtains.src = 'img/bt-curtains-off.png';
        btCurtains.style.border = '3px dotted #eeeeee';
        accRec = false;
    }
}

function ctrlLight() {
    btLight = document.getElementById('ctrl-light');
    if (lightStat == 0) {
        lightStat = 1;
        roomLight.intensity = 1;
        btLight.src = 'img/bt-light-on.png';
        btLight.style.border = '3px solid #fdefca';
    }
    else if (lightStat == 1) {
        lightStat = 0;
        roomLight.intensity = 0;
        btLight.src = 'img/bt-light-off.png';
        btLight.style.border = '3px dotted #eeeeee';
    }

    socket.emit('mobile to server', { 
        windowStat: windowStat,
        curtainStat: curtainStat,
        lightStat: lightStat,
        airconStat: airconStat,
        humidifierStat: humidifierStat
    });
}

function ctrlAircon() {
    btAircon = document.getElementById('ctrl-aircon');
    if (airconStat == 0) {
        airconStat = 1;
        readdACSprite();
        btAircon.src = 'img/bt-aircon-on.png';
        btAircon.style.border = '3px solid #fdefca';
    }
    else if (airconStat == 1) {
        airconStat = 0;
        removeACSprite();
        btAircon.src = 'img/bt-aircon-off.png';
        btAircon.style.border = '3px dotted #eeeeee';
    }

    socket.emit('mobile to server', { 
        windowStat: windowStat,
        curtainStat: curtainStat,
        lightStat: lightStat,
        airconStat: airconStat,
        humidifierStat: humidifierStat
    });
}

function ctrlHumidifier() {
    btHumidifier = document.getElementById('ctrl-humidifier');
    if (humidifierStat == 0) {
        humidifierStat = 1;
        readdHumiSprite();
        btHumidifier.src = 'img/bt-humidifier-on.png';
        btHumidifier.style.border = '3px solid #fdefca';
    }
    else if (humidifierStat == 1) {
        humidifierStat = 0;
        removeHumiSprite();
        btHumidifier.src = 'img/bt-humidifier-off.png';
        btHumidifier.style.border = '3px dotted #eeeeee';
    }

    socket.emit('mobile to server', { 
        windowStat: windowStat,
        curtainStat: curtainStat,
        lightStat: lightStat,
        airconStat: airconStat,
        humidifierStat: humidifierStat
    });
}
// function removesprites() {
//   for ( var i = group.children.length-1; i>=0 ; i-- ) {
//       var sprite = group.children[ i ];
//       console.log("removing");
//       group.remove(sprite);
//   }
// }
// 获取天气接口
// $.getJSON("http://api.avatardata.cn/Weather/Query?key=8a5fe12b90ae44ef891477f7f15cdde2&cityname=武汉&callback=?", function(result){
// 	console.log(result.parseJSON())
//  });

// var key = "qseddvbyxufowkli";
// var key = "qseddvbyxufowkli";
// var time = Math.round(new Date().getTime()/1000);
// var args="ts="+time+"&ttl=8000&uid=U141B601D2";
// console.log("time:"+time);
// var sig = CryptoJS.HmacSHA1(args, key);
// var base64 = CryptoJS.enc.Base64.stringify(sig); 
// var urlencode = encodeURIComponent(base64);
// console.log(urlencode);
// // var sig = CryptoJS.createHmac('sha1', key).update(args).digest().toString('base64');
// console.log(urlencode)
// time:1490606867
// i9nziH8nE7qJxNly%2F4%2BIvKNoPrY%3D



