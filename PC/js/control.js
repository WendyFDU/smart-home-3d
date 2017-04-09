var bgStates = 0;
var bigLightStates = 0;
var windowOBJ;
var watchID = null; 
var roomLightStates = 0;
var roomLight;
var roomGeometry;
var ctrlConfig = {
  lightctrl: true,
  temperature: 12,
  humidity: 60,
  noise: 30,
  light: 2000,
};
var textureLoader = new THREE.TextureLoader();
function changeLight() {
	if(groupCount == 0) {
		if (bigLightStates == 0) {
			bigLight.color.setHSL( 0xFFffff, 1, 0 );
			bigLightStates = 1;
		}
		else if (bigLightStates == 1) {
			bigLight.color.setHSL( 0xFFffff, 1, 50 );
			bigLightStates = 0;
		}
	}
	else if(groupCount == 1) {
		if (roomLightStates == 0) {
			roomLight.color.setHSL( 0xFFffff, 1, 0 );
			roomLightStates = 1;
		}
		else if (roomLightStates == 1) {
			roomLight.color.setHSL( 0xFFffff, 1, 50 );
			roomLightStates = 0;
		}
	}
}
var roomGroup;
var groupCount = 0;
function initRoomGroup() {
	roomGroup = new THREE.Group();

  // GROOUND TEXTURES 
  var textureSquares = textureLoader.load( "textures/mu.jpg" );
  textureSquares.repeat.set( 50, 50 );
  textureSquares.wrapS = textureSquares.wrapT = THREE.RepeatWrapping;
  textureSquares.magFilter = THREE.NearestFilter;
  textureSquares.format = THREE.RGBFormat;
  // GROUND
  var groundMaterial = new THREE.MeshPhongMaterial( {
    shininess: 80,
    color: 0xffffff,
    specular: 0xffffff,
    map: textureSquares
  } );

  //WALL
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

  var ground2 = new THREE.Mesh( planeGeometry, groundMaterial );
  ground2.position.set( 0, 0, 0 );
  ground2.rotation.x = - Math.PI / 2;
  ground2.scale.set( 1000, 1000, 1000 );
  ground2.receiveShadow = true;
  roomGroup.add( ground2 );
  //WALL
  var wallLeft = new THREE.Mesh( wallGeometry, wallMaterial );
  wallLeft.position.set( -300, 0, 0 );
  wallLeft.scale.set( 10, 10, 10 );
  wallLeft.receiveShadow = true;
  roomGroup.add( wallLeft );
  var wallRight = new THREE.Mesh( wallGeometry, wallMaterial );
  wallRight.position.set( 200, 0, 0 );
  wallRight.scale.set( 10, 10, 10 );
  wallRight.receiveShadow = true;
  roomGroup.add( wallRight );

  addComponent(scene);
}
initRoomGroup();
function changeScene() {
	if(groupCount == 0) {
		groupCount = 1;
		scene.remove(group);
		scene.add(roomGroup);
		renderer.setClearColor(0xebebeb);
	} 
	else if (groupCount == 1) {
		groupCount = 0;
		scene.remove(roomGroup);
		scene.add(group);
		renderer.setClearColor(0x000000);
	}
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
function addComponent ( scene ) {
	loader = new THREE.OBJLoader();
 	var ambient = new THREE.AmbientLight( 0x404040 );
 	roomGroup.add( ambient );
  //LIGHTS
  roomLight = new THREE.PointLight( 0xffaa00, 0.5, 1000);
  roomLight.position.set( 0, 800, 100 );
  roomLight.castShadow = true;
  roomGroup.add( roomLight );
  roomGroup.add( new THREE.PointLightHelper( roomLight, 5 ) );

  sunLight = new THREE.DirectionalLight( 0xffffff, 0.5);
  sunLight.position.set( 0, 1000, 2000 );
  sunLight.castShadow = true;
  // sunLight.castShadow = true;
  roomGroup.add(sunLight);

  //MODELS
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

	loadOBJ('obj/bed1.obj',materialBed, 1, -150, 0, 0, 0, Math.PI/2, 0, -1 );
	loadOBJ('obj/mirror+chair.obj', materialSofa, 1.2, -170, 70, 150, 0, Math.PI/2, 0, -1);
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
	loadOBJ('obj/curtains-poll.obj', humiMaterial, 2, 10, 120, -80, 0, 0, 0, 4);
	loadOBJ('obj/curtains.obj', materialSofa, 2, 10, 120, -80, 0, 0, 0, 5);
	addSprite();
  snowSprite();
  // GUI
  gui = new dat.GUI( { width: 250 } );
  var controlGUI = gui.addFolder( "室内状态" );
  controlGUI.add( ctrlConfig, 'lightctrl' ).onChange( function() {
    if(ctrlConfig.lightctrl == true) {
      roomLight.intensity = 1;
    } else {
      roomLight.intensity = 0;
    }
    // shadowCameraHelper.visible = shadowConfig.shadowCameraVisible;
  });
  controlGUI.add( ctrlConfig, 'temperature', -10, 40 ).onChange( function() {
    console.log(ctrlConfig.temperature);
    if(ctrlConfig.temperature <= 16) {
      showSnowSprites();
      fallSpeed = 1 + (16 - ctrlConfig.temperature)*0.1;
    }
    if( ctrlConfig.temperature >= 26) {
      showSunSprites();
      fallSpeed = -1 - (ctrlConfig.temperature - 26)*0.2;

    }
    if( ctrlConfig.temperature > 16 && ctrlConfig.temperature < 26) {
      showWaterSprites();
      fallSpeed = (ctrlConfig.temperature - 16)*0.05;
    }
    console.log("speed:" + fallSpeed);
  });
  controlGUI.add( ctrlConfig, 'humidity', 20, 100 ).onChange( function() {
    var spriteNum;
    var humidity = ctrlConfig.humidity;
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
  });
  controlGUI.add( ctrlConfig, 'noise', 0, 100 ).onChange( function() {
    console.log(ctrlConfig.temperature);
  });
  controlGUI.add( ctrlConfig, 'light', 1, 3000 ).onChange( function() {
    sunLight.intensity = (ctrlConfig.light / 3000) * 0.8;
  });
  controlGUI.open();

	// update();

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
    object.castShadow = true;
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
}

function startWatch() { 
    var options = { frequency: 40 };  
    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);     
} 

function stopWatch() {         
    if (watchID) { 
        navigator.accelerometer.clearWatch(watchID); 
        watchID = null;         
   }     
}  

function onSuccess(acceleration) {
    // var eleAcce = document.getElementById('acceleration');
    // eleAcce.innerHTML = 'X Axis Acceleration: ' + acceleration.x + '<br />' +
    //     'Y Axis Acceleration: ' + acceleration.y + '<br />' +
    //     'Z Axis Acceleration: ' + acceleration.z;
    
    // Move window
    windowLeftOBJ.position.x -= acceleration.x / 20.0;
    if (windowLeftOBJ.position.x < 0) {
      windowLeftOBJ.position.x = 0;
    }
    if (windowLeftOBJ.position.x > 7.2) {
      windowLeftOBJ.position.x = 7.2;
    }

    // Draw curtains
    curtainOBJ.scale.x += acceleration.x / 500.0;
    curtainOBJ.position.x -= acceleration.x / 18;
    if (curtainOBJ.scale.x > 0.12) {
      curtainOBJ.scale.x = 0.12;
    }
    if (curtainOBJ.scale.x < 0) {
      curtainOBJ.scale.x = 0;
    }

    if (curtainOBJ.position.x > 3.3) {
      curtainOBJ.position.x = 3.3;
    }
    if (curtainOBJ.position.x < 0) {
      curtainOBJ.position.x = 0;
    }
}

function onError(accelerometerError) {
    alert('Accelerometer Error: ' + accelerometerError.code);
}



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
    //双击事件的执行代码
})
function addSprite() {
  temp = 0.01;
  rad = 0;
	roomGeometry = new THREE.Geometry();
	var coldSpriteGroup = new THREE.Group();
  coldSpriteGroup.name = "coldSprite";
  var roomColdSprite = textureLoader.load( "textures/cold.png" );
  for ( i = 0; i < 300; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random()*30+80;
      vertex.y = Math.random()*20+150;
      vertex.z = Math.random()*20+100;
      roomGeometry.vertices.push( vertex );
  }
  parameters = [
       [ [0.5, 0.5, 0.5], roomColdSprite, 2 ],
  ];
  for ( i = 0; i < parameters.length; i ++ ) {
      color  = parameters[i][0];
      sprite = parameters[i][1];
      size   = parameters[i][2];
      materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
      materials[i].color.setHSL( color[0], color[1], color[2] );
      var roomColdParticles = new THREE.Points( roomGeometry, materials[i] );
      // roomColdParticles.rotation.x = Math.random() * 6;
      // roomColdParticles.rotation.y = Math.random() * 6;
      // roomColdParticles.rotation.z = Math.random() * 6;
      coldSpriteGroup.add( roomColdParticles );
  }
}

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
// function removeSnowSprites() {
//   if (snowSprStatus == true) {
//     roomGroup.remove(snowSpritePoints);
//     snowSprStatus = false;
//   }
// }
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



