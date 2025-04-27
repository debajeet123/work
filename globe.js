// Constants
const GLOBE_RADIUS = 1;
const ROTATION_SPEED = 0.002;
const DAY_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const NIGHT_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_night_2048.jpg';
const CLOUDS_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png';
const BUMP_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg';
const SPECULAR_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg';

// Create a function to initialize a globe
function createGlobe(containerId, size) {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, size/size, 0.1, 1000);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  document.getElementById(containerId).appendChild(renderer.domElement);

  // Lighting setup for dramatic shadows
  const ambientLight = new THREE.AmbientLight(0x111111, 0.2); // Very dim ambient light
  scene.add(ambientLight);

  // Main directional light for shadows
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  // Secondary light for subtle highlights
  const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.3);
  secondaryLight.position.set(-5, -5, -5);
  scene.add(secondaryLight);

  // Texture loading
  const loader = new THREE.TextureLoader();
  Promise.all([
    new Promise((resolve) => loader.load(DAY_TEXTURE_URL, resolve)),
    new Promise((resolve) => loader.load(NIGHT_TEXTURE_URL, resolve)),
    new Promise((resolve) => loader.load(CLOUDS_TEXTURE_URL, resolve)),
    new Promise((resolve) => loader.load(BUMP_TEXTURE_URL, resolve)),
    new Promise((resolve) => loader.load(SPECULAR_TEXTURE_URL, resolve))
  ]).then(([dayTexture, nightTexture, cloudsTexture, bumpTexture, specularTexture]) => {
    // Create Earth sphere with enhanced terrain
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 128);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: dayTexture,
      emissiveMap: nightTexture,
      emissive: 0x111111,
      emissiveIntensity: 0.5,
      bumpMap: bumpTexture,
      bumpScale: 0.1, // Increased bump scale for more dramatic terrain
      specularMap: specularTexture,
      specular: new THREE.Color(0x111111),
      shininess: 5
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Create clouds sphere
    const cloudsGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.01, 128, 128);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.maxPolarAngle = Math.PI;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    function animate() {
      requestAnimationFrame(animate);
      
      // Rotate Earth and clouds
      earth.rotation.y += ROTATION_SPEED;
      clouds.rotation.y += ROTATION_SPEED * 1.1;
      
      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }).catch((error) => {
    console.error('Error loading textures:', error);
  });

  // Handle window resize
  function handleResize() {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  // Add event listeners
  window.addEventListener('resize', handleResize);

  // Cleanup function
  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    controls.dispose();
    renderer.dispose();
  };

  window.addEventListener('unload', cleanup);
  window.addEventListener('beforeunload', cleanup);
}

// Initialize globe
createGlobe('topRightGlobe', 300); // Top right globe