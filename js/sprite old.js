container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.z = 1000;

scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

geometry = new THREE.Geometry();

var textureLoader = new THREE.TextureLoader();

sprite1 = textureLoader.load( "../images/snowflake1.png" );
sprite2 = textureLoader.load( "../images/snowflake2.png" );
// sprite3 = textureLoader.load( "textures/snowflake1.png" );
// sprite4 = textureLoader.load( "textures/snowflake2.png" );
// sprite5 = textureLoader.load( "textures/snowflake1.png" );

for ( i = 0; i < 10000; i ++ ) {

	var vertex = new THREE.Vector3();
	vertex.x = Math.random() * 2000 - 1000;
	vertex.y = Math.random() * 2000 - 1000;
	vertex.z = Math.random() * 2000 - 1000;

	geometry.vertices.push( vertex );

}

parameters = [
	[ [1.0, 0.2, 0.5], sprite2, 20 ],
	// [ [0.95, 0.1, 0.5], sprite3, 15  ],
	[ [0.90, 0.05, 0.5], sprite1, 10 ],
	// [ [0.85, 0, 0.5], sprite5, 8 ],
	// [ [0.80, 0, 0.5], sprite4, 5 ]
];

for ( i = 0; i < parameters.length; i ++ ) {

	color  = parameters[i][0];
	sprite = parameters[i][1];
	size   = parameters[i][2];

	materials[i] = new THREE.PointsMaterial( { size: size, map: sprite} );
	materials[i].color.setHSL( color[0], color[1], color[2] );

	particles = new THREE.Points( geometry, materials[i] );

	particles.rotation.x = Math.random() * 6;
	particles.rotation.y = Math.random() * 6;
	particles.rotation.z = Math.random() * 6;

	scene.add( particles );

}