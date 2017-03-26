        scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

        geometry = new THREE.Geometry();

        var textureLoader = new THREE.TextureLoader();

        sprite1 = textureLoader.load( "textures/cold.png" );
        // sprite2 = textureLoader.load( "textures/snowflake2.png" );

        for ( i = 0; i < 100; i ++ ) {

          var vertex = new THREE.Vector3();
          vertex.x = Math.random(0,1)*5+5;
          vertex.y = Math.random(0,1)*10+5;
          vertex.z = Math.random(0,1)*5+10;

          geometry.vertices.push( vertex );

        }

        parameters = [
          // [ [0.95, 0.1, 0.5], sprite3, 15  ],
          [ [0.90, 0.05, 0.5], sprite1, 2 ],
          // [ [0.85, 0, 0.5], sprite5, 8 ],
          // [ [0.80, 0, 0.5], sprite4, 5 ]
        ];

        for ( i = 0; i < parameters.length; i ++ ) {

          color  = parameters[i][0];
          sprite = parameters[i][1];
          size   = parameters[i][2];
          var materials = [];
          materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
          materials[i].color.setHSL( color[0], color[1], color[2] );

          particles = new THREE.Points( geometry, materials[i] );

          particles.rotation.x = Math.random() * 6;
          particles.rotation.y = Math.random() * 6;
          particles.rotation.z = Math.random() * 6;
// 
// particles.parent = worldFrame;
          scene.add( particles );

        }
        render();