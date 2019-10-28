// Tutorial by Bjorn Sandvik -  http://thematicmapping.org
(function () {

    // Insert into HTML id
    var webglEl = document.getElementById('webgl');

    // Toss error for webGL
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage(webglEl);
        return;
    }

    // Tutorial start
    // Set screen width = current window size (Full screen)
    var width = window.innerWidth,
        height = window.innerHeight;

    // setting up new three.js scene
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.z = 1.5;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    scene.add(new THREE.AmbientLight(0x333333));

    // Annotations
    var annotation = document.querySelector('.annotation');
    annotation.style.top = `${height/2}px`;
    annotation.style.left = `${width/2.5}px`;

    // parameters
    var radius = 0.5,
        segments = 32,
        rotation = 6;

    // Lighting
    var light = new THREE.DirectionalLight(0xeeeeee, 1);
    light.position.set(5, 3, 5);
    scene.add(light);

    // Earth Sphere
    var sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation;
    scene.add(sphere)

    // Clouds
    var clouds = createClouds(radius, segments);
    clouds.rotation.y = rotation;
    scene.add(clouds)

    // Stars
    var stars = createStars(90, 60);
    scene.add(stars);

    // TrackballControls.js library
    var controls = new THREE.TrackballControls(camera);

    webglEl.appendChild(renderer.domElement);

    render();

    function render() {
        controls.update();
        sphere.rotation.y += 0.0005;
        clouds.rotation.y += 0.0005;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function createSphere(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
                bumpMap: THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
                bumpScale: 0.005,
                specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
                specular: new THREE.Color('grey')
            })
        );
    }

    function createClouds(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius + 0.003, segments, segments),
            new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
                transparent: true
            })
        );
    }

    function createStars(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
                side: THREE.BackSide
            })
        );
    }

}());
