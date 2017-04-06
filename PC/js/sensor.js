var snowGeometry;
function showTprt() {
	console.log("sensor in")
	snowGeometry = new THREE.Geometry();
	// var snowSpriteGroup = new THREE.Group();
    var textureLoader = new THREE.TextureLoader();
    var snowTexture = textureLoader.load( "textures/cold.png" );
    var range = 1000;
    for ( i = 0; i < 3000; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random()*range;
        vertex.y = Math.random()*500;
        vertex.z = Math.random()*500;
        tprtGeometry.vertices.push( vertex );
    }

    var material = new THREE.PointsMaterial({
        size: 1,
        transparent: true,
        opacity: 0.8,
        map: snowTexture,
        blending: THREE.AdditiveBlending,
        depthTest: false, 
    });


	var snowSpritePoints = new THREE.Points(geom, material);
    snowSpritePoints.position.set(0,-750,-9000);
    snowSpritePoints.rotation.z = -Math.PI/5;
    roomGroup.add(snowSpritePoints);
}