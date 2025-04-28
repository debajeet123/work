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
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  document.getElementById(containerId).appendChild(renderer.domElement);

  // Lighting setup
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Texture loading
  const loader = new THREE.TextureLoader();
  loader.load(DAY_TEXTURE_URL, function(tex) {
    const geo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const mat = new THREE.MeshPhongMaterial({ map: tex });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += ROTATION_SPEED;
      renderer.render(scene, camera);
    }

    animate();
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

  window.addEventListener('resize', handleResize);
}

// Initialize the globe
createGlobe('topRightGlobe', 300); // Size in pixels