// Constants - Adjust these values to modify the globe appearance
const GLOBE_RADIUS = 1;                    // Size of the globe (1 = default)
const ROTATION_SPEED = 0.002;              // Speed of rotation (higher = faster)
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
  camera.position.z = 4;                    // Distance from camera (higher = further)

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  document.getElementById(containerId).appendChild(renderer.domElement);

  // Lighting setup - Adjust these values for different shadow effects
  const ambientLight = new THREE.AmbientLight(0x111111, 0.2); // Color, Intensity (0-1)
  scene.add(ambientLight);

  // Main directional light - Position and intensity affect shadows
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);  // Color, Intensity (0-1)
  mainLight.position.set(5, 5, 5);                            // Position (x,y,z)
  scene.add(mainLight);

  // Secondary light for subtle highlights
  const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.3); // Color, Intensity
  secondaryLight.position.set(-5, -5, -5);                          // Position
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
    // Create Earth sphere - Adjust material properties for different effects
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 128); // Radius, WidthSegments, HeightSegments
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: dayTexture,                    // Day texture
      emissiveMap: nightTexture,          // Night texture
      emissive: 0x111111,                 // Night color
      emissiveIntensity: 0.5,             // Night brightness (0-1)
      bumpMap: bumpTexture,               // Terrain texture
      bumpScale: 0.1,                     // Terrain height (higher = more relief)
      specularMap: specularTexture,
      specular: new THREE.Color(0x111111),// Highlight color
      shininess: 5                        // Surface shininess (higher = more glossy)
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Create clouds sphere
    const cloudsGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.01, 128, 128);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.3,                       // Cloud opacity (0-1)
      side: THREE.DoubleSide
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Controls - Adjust these values for different interaction behavior
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;         // Smooth camera movement
    controls.dampingFactor = 0.05;         // Damping speed (higher = slower)
    controls.enablePan = false;            // Disable panning
    controls.minDistance = 2;              // Minimum zoom distance
    controls.maxDistance = 5;              // Maximum zoom distance
    controls.maxPolarAngle = Math.PI;      // Maximum vertical rotation
    controls.autoRotate = true;            // Enable auto-rotation
    controls.autoRotateSpeed = 0.5;        // Auto-rotation speed

    function animate() {
      requestAnimationFrame(animate);
      
      // Rotation speeds - Adjust for different rotation effects
      earth.rotation.y += ROTATION_SPEED;
      clouds.rotation.y += ROTATION_SPEED * 1.1; // Clouds rotate slightly faster
      
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

// Initialize the globe
createGlobe('topRightGlobe', 300); // Size in pixels