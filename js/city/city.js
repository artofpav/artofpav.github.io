
import * as THREE from '../three.module.js';
import { OrbitControls } from '../controls/OrbitControls.js';
import { GLTFLoader } from '../loaders/GLTFLoader.js';


var City = function(cont){
	
	this.container = cont;
	


	var camera, controls, scene, cube, cube2, container;
	var mouse = new THREE.Vector2();
	var raycaster = new THREE.Raycaster();
	var renderer;


	this.init = function (){

		console.log('init');

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xaaaabc );
		scene.fog = new THREE.FogExp2( 0xaaaabc, 0.1);



		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );



		//this.container = document.getElementById( 'surfaceCity' );
		console.log( 'container:', this.container );
		//document.body.appendChild( container );

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

		this.container.appendChild( renderer.domElement );

		window.addEventListener('resize', onWindowResize, false );
		window.addEventListener( 'click', onDocumentMouseClick, false );

		raycaster.setFromCamera( mouse, camera );

		controls = new OrbitControls( camera, renderer.domElement );
		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		controls.dampingFactor = 0.05;

		controls.screenSpacePanning = false;

		controls.minDistance = 1;
		controls.maxDistance = 10;

		controls.maxPolarAngle = Math.PI / 2;
		controls.update();

		scene.add( new THREE.AmbientLight(0xccccdd, 0.7) );

		var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
		light.position.set( 2, 1, 2 ); 			//default; light shining from top
		light.castShadow = true;            // default false
		light.shadowCameraVisible = true;
		scene.add( light );

		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.0001;    // default
		light.shadow.camera.far = 1000;     // default
		light.shadow.bias = -0.0001;

		var boxgeometry = new THREE.CubeGeometry(1, 1, 1);
		var boxmaterial = new THREE.MeshStandardMaterial({
			color: 0x0aeedf
		});
		cube = new THREE.Mesh(boxgeometry, boxmaterial);
		cube.castShadow = true;
		cube.receiveShadow = true; //default
		cube.position.x = 0;
		cube.position.y = 1;
		cube.position.z = 0;
		cube.name = 'cube-1';

		cube2 = new THREE.Mesh(boxgeometry, boxmaterial);
		cube2.castShadow = true;
		cube2.receiveShadow = true; //default
		cube2.position.x = 1;
		cube2.position.y = 1;
		cube2.position.z = 0;
		cube2.name = 'cube-2';

		scene.add(cube);
		scene.add(cube2);


		var loader = new GLTFLoader();
		loader.load('./assets/mesh/scene.glb', function( gltf ){
			gltf.scene.traverse( function( node ) {

				if ( node.isMesh ) { 
					node.castShadow = true; 
					node.receiveShadow = true; 
					//node.material = boxmaterial;
				}

			} );
			scene.add( gltf.scene );

			gltf.animations; // Array<THREE.AnimationClip>
			gltf.scene; // THREE.Group
			gltf.scenes; // Array<THREE.Group>
			gltf.cameras; // Array<THREE.Camera>
			gltf.asset; // Object

		}, undefined, function ( error ) {
			console.error( error );
		});

		scene.add(camera);
		camera.position.z = 50;
	}();

	function onDocumentMouseClick( event ) {

		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( scene.children, true );
		if ( intersects.length > 0 ) {

			var object = intersects[ 0 ].object;
			if(intersects[ 0 ].object.name!= 'Cube'){
				object.scale.x = 2;
			} else {
				document.querySelector('#info').style.display = 'block';
			}
			console.log( 'Intersection:', intersects[ 0 ].object.name );

		}

		renderer.render( scene, camera );
	}

	this.animate = function() {
		requestAnimationFrame( animate );
		controls.update();
		renderer.render( scene, camera );
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	}();

	function onWindowResize(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}
}
export { City};