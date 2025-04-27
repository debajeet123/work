// Constants
const GLOBE_RADIUS = 1;
const ROTATION_SPEED = 0.003;
const TEXTURE_URL = 'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 500/500, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(500, 500);
renderer.setClearColor(0x000000, 0);
document.getElementById('cornerGlobe').appendChild(renderer.domElement);

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
loader.load(TEXTURE_URL, (texture) => {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    emissive: 0x222222,
    emissiveIntensity: 1.5
  });

  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Add event listeners for user interaction
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
  });

  controls.addEventListener('end', () => {
    controls.autoRotate = true;
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}, undefined, (error) => {
  console.error('Error loading Earth texture:', error);
});

// Handle window resize
function handleResize() {
  const container = document.getElementById('cornerGlobe');
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