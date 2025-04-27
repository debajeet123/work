// Constants
const GLOBE_RADIUS = 1;
const ROTATION_SPEED = 0.003;
const DAY_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg';
const NIGHT_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_night_2048.jpg';
const CLOUDS_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png';

// Create a function to initialize a globe
function createGlobe(containerId, size) {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, size/size, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  document.getElementById(containerId).appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // Add subtle atmospheric glow
  const glowGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.1, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x00ffff) },
      viewVector: { value: camera.position }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vPositionNormal), 2.0);
        gl_FragColor = vec4(glowColor, intensity);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glow);

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

  // Mobile touch handling
  let isTouchDevice = 'ontouchstart' in window;
  if (isTouchDevice) {
    controls.enableZoom = false;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
  }

  // Texture loading
  const loader = new THREE.TextureLoader();
  Promise.all([
    new Promise((resolve) => loader.load(DAY_TEXTURE_URL, resolve)),
    new Promise((resolve) => loader.load(NIGHT_TEXTURE_URL, resolve)),
    new Promise((resolve) => loader.load(CLOUDS_TEXTURE_URL, resolve))
  ]).then(([dayTexture, nightTexture, cloudsTexture]) => {
    // Create Earth sphere
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: dayTexture,
      emissiveMap: nightTexture,
      emissive: 0x222222,
      emissiveIntensity: 1.5
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Create clouds sphere
    const cloudsGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.01, 64, 64);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Add event listeners for user interaction
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
    });

    controls.addEventListener('end', () => {
      controls.autoRotate = true;
    });

    function animate() {
      requestAnimationFrame(animate);
      
      // Rotate Earth and clouds
      earth.rotation.y += ROTATION_SPEED;
      clouds.rotation.y += ROTATION_SPEED * 1.1; // Slightly faster rotation for clouds
      
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

// Initialize both globes
createGlobe('cornerGlobe', 500); // Original corner globe
createGlobe('topRightGlobe', 300); // New top right globe 