// Constants
const GLOBE_RADIUS = 1;
const ROTATION_SPEED = 0.003;
const DAY_TEXTURE_URL = 'https://cdn.jsdelivr.net/gh/Chalarangelo/static-hosted-assets/earthmap1k.jpg';
const NIGHT_TEXTURE_URL = 'https://cdn.jsdelivr.net/gh/Chalarangelo/static-hosted-assets/earthlights1k.jpg';
const MAX_FPS = 60;
const FRAME_TIME = 1000 / MAX_FPS;

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
const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
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
controls.autoRotateSpeed = 0.7;

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
const loadingManager = new THREE.LoadingManager(
  // onLoad
  () => {
    console.log('Textures loaded successfully');
  },
  // onProgress
  (url, loaded, total) => {
    console.log(`Loading textures: ${Math.round((loaded/total) * 100)}%`);
  },
  // onError
  (url) => {
    console.error('Error loading texture:', url);
  }
);

loader.setManager(loadingManager);

let globe;
let animationFrameId;
let lastTime = 0;
let isUserInteracting = false;

// Handle window resize
function handleResize() {
  const container = document.getElementById('cornerGlobe');
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// Load both day and night textures
Promise.all([
  new Promise((resolve) => loader.load(DAY_TEXTURE_URL, resolve)),
  new Promise((resolve) => loader.load(NIGHT_TEXTURE_URL, resolve))
]).then(([dayTexture, nightTexture]) => {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: dayTexture,
    emissiveMap: nightTexture,
    emissive: 0x888888,
    emissiveIntensity: 3.5,
    specular: new THREE.Color(0x333333),
    shininess: 5
  });

  globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Add event listeners for user interaction
  controls.addEventListener('start', () => {
    isUserInteracting = true;
    controls.autoRotate = false;
  });

  controls.addEventListener('end', () => {
    isUserInteracting = false;
    controls.autoRotate = true;
  });

  function animate(currentTime) {
    animationFrameId = requestAnimationFrame(animate);
    
    // Frame rate limiting
    const deltaTime = currentTime - lastTime;
    if (deltaTime < FRAME_TIME) return;
    lastTime = currentTime;

    if (globe && !isUserInteracting) {
      globe.rotation.y += ROTATION_SPEED;
    }
    controls.update();
    renderer.render(scene, camera);
  }

  animate(0);
}).catch((error) => {
  console.error('Error loading textures:', error);
});

// Tab functionality
document.addEventListener('DOMContentLoaded', () => {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabSections = document.querySelectorAll('.tab-section');

  // Show home section by default
  document.querySelector('#home').classList.add('active');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      
      // Hide all sections
      tabSections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Show target section
      document.getElementById(targetId).classList.add('active');
    });
  });
});

// Ricker Wavelet Canvas
const rickerCanvas = document.getElementById('rickerCanvas');
const ctx = rickerCanvas.getContext('2d');
rickerCanvas.width = 300;
rickerCanvas.height = 150;

function rickerWavelet(t, f) {
  const x = Math.PI * f * t;
  return (1 - 2 * x * x) * Math.exp(-x * x);
}

function drawRickerWavelet() {
  ctx.clearRect(0, 0, rickerCanvas.width, rickerCanvas.height);
  ctx.strokeStyle = '#0ff';
  ctx.lineWidth = 2;
  ctx.beginPath();

  const frequency = 0.1;
  const amplitude = 50;
  const offset = rickerCanvas.height / 2;

  for (let x = 0; x < rickerCanvas.width; x++) {
    const t = (x - rickerCanvas.width / 2) / 30;
    const y = offset - rickerWavelet(t, frequency) * amplitude;
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}

drawRickerWavelet();

// Cleanup function
const cleanup = () => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
  
  if (globe) {
    scene.remove(globe);
    globe.geometry.dispose();
    globe.material.dispose();
  }
  
  controls.dispose();
  renderer.dispose();
};

// Add event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('unload', cleanup);
window.addEventListener('beforeunload', cleanup); 