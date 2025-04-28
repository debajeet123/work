// Constants - Adjust these values to modify the globe appearance
const GLOBE_RADIUS = 1;                    // Size of the globe (1 = default)
const ROTATION_SPEED = 0.002;              // Speed of rotation (higher = faster)
const DAY_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg';
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

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Texture loading
  const loader = new THREE.TextureLoader();
  const textures = {
    day: loader.load(DAY_TEXTURE_URL),
    night: loader.load(NIGHT_TEXTURE_URL),
    clouds: loader.load(CLOUDS_TEXTURE_URL),
    bump: loader.load(BUMP_TEXTURE_URL),
    specular: loader.load(SPECULAR_TEXTURE_URL)
  };

  // Create earth mesh
  const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: textures.day,
    bumpMap: textures.bump,
    bumpScale: 0.05,
    specularMap: textures.specular,
    specular: new THREE.Color('grey'),
    shininess: 5
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  // Create clouds mesh
  const cloudsGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.003, 64, 64);
  const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: textures.clouds,
    transparent: true,
    opacity: 0.4
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  scene.add(cloudsMesh);

  // Add atmosphere glow
  const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.1, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
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
  const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphereMesh);

  // Mouse interaction
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };

  const container = document.getElementById(containerId);
  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseup', onMouseUp);
  container.addEventListener('wheel', onMouseWheel);

  function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  function onMouseMove(event) {
    if (!isDragging) return;

    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    targetRotation.y += deltaMove.x * 0.01;
    targetRotation.x += deltaMove.y * 0.01;

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onMouseWheel(event) {
    const delta = event.deltaY * 0.001;
    camera.position.z = Math.max(3, Math.min(6, camera.position.z + delta));
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

    earthMesh.rotation.x = currentRotation.x;
    earthMesh.rotation.y = currentRotation.y;
    cloudsMesh.rotation.x = currentRotation.x;
    cloudsMesh.rotation.y = currentRotation.y;
    atmosphereMesh.rotation.x = currentRotation.x;
    atmosphereMesh.rotation.y = currentRotation.y;

    // Auto-rotation when not dragging
    if (!isDragging) {
      targetRotation.y += ROTATION_SPEED;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  function handleResize() {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', handleResize);
}

// Initialize the globe
createGlobe('topRightGlobe', 300);