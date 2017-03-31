var bgStates = 0;
var bigLightStates = 0;
var windowOBJ;
var watchID = null; 
var roomLightStates = 0;
var roomLight;
var roomGeometry;
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
	var geometry = new THREE.PlaneGeometry( 60, 25, 1, 1 );
	var material = new THREE.MeshBasicMaterial( {color: 0xD4D4D4, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( geometry, material );
	// plane.rotation.x = Math.PI / 2;
	plane.rotation.x = -45;
	plane.position.y = -20;
	roomGroup.add(plane);
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
   	var ambient = new THREE.AmbientLight( 0x444444 );
   	roomGroup.add( ambient );
 	// var directionalLight = new THRE
    roomLight = new THREE.PointLight( 0xFFffff,1,100);
    roomLight.position.set( 0, 10, -10 );
    roomGroup.add( roomLight );
    roomGroup.add( new THREE.PointLightHelper( roomLight, 5 ) );
	addModel('obj/bed1.obj', 0.12, -10, -15, -10, 0, Math.PI/2, 0);
	addModel('obj/mirror+chair.obj', 0.1, -10, -5, 10, 0, Math.PI/2, 0);
	addModel('obj/sofa1.obj', 0.08, 15, -10, 15, 0, -Math.PI/2, 0);
	addModel('obj/humidifier.obj', 0.4, -15, -15, 17, 0, Math.PI/2, 0);
	addModel('obj/air-con1.obj', 0.0015, 22, -15, 0, 0, 0, 0);
	addModel('obj/light.obj', 0.01, 0, 10, -10, 0, 0, 0);
    // LOAD WINDOW MODEL
	var windowMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: false, opacity: 1});
	loadOBJ('obj/window-frame.obj', windowMaterial, 0.008, 10, 5, 0, 0, 0, 0, 0);
	loadOBJ('obj/window-right.obj', windowMaterial, 0.008, 10, 5, 0, 0, 0, 0, 1);
	loadOBJ('obj/window-left.obj', windowMaterial, 0.008, 10, 5, 0, 0, 0, 0, 2);
	loadOBJ('obj/curtains-poll.obj', windowMaterial, 0.12, 10, -5, 0, 0, 0, 0, 4);
	loadOBJ('obj/curtains.obj', windowMaterial, 0.12, 10, -5, 0, 0, 0, 0, 5);
	addSprite();
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
    // object.traverse(function(child) {
    //   if (child instanceof THREE.Mesh) {
    //     child.material = material;
    //   }
    // });

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
	roomGeometry = new THREE.Geometry();
	var coldSpriteGroup = new THREE.Group();
    var textureLoader = new THREE.TextureLoader();
    var roomColdSprite = textureLoader.load( "textures/cold.png" );
    for ( i = 0; i < 30; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random(0,1)*5-15;
        vertex.y = Math.random(0,1)*10+5;
        vertex.z = Math.random(0,1)*5;
        roomGeometry.vertices.push( vertex );
    }
    parameters = [
         [ [1, 1, 1], roomColdSprite, 1 ],
    ];
    console.log("hi 240")
    for ( i = 0; i < parameters.length; i ++ ) {
        color  = parameters[i][0];
        sprite = parameters[i][1];
        size   = parameters[i][2];
        materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
        materials[i].color.setHSL( color[0], color[1], color[2] );
        var roomColdParticles = new THREE.Points( roomGeometry, materials[i] );
        roomColdParticles.rotation.x = Math.random() * 6;
        roomColdParticles.rotation.y = Math.random() * 6;
        roomColdParticles.rotation.z = Math.random() * 6;
        coldSpriteGroup.add( roomColdParticles );
    }
    roomGroup.add(coldSpriteGroup);
    // roomGroup.remove(coldSpriteGroup);
}
// function removesprites() {
//   for ( var i = group.children.length-1; i>=0 ; i-- ) {
//       var sprite = group.children[ i ];
//       console.log("removing");
//       group.remove(sprite);
//   }
// }
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



