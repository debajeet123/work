// Constants
const GLOBE_RADIUS = 1;
const ROTATION_SPEED = 0.002;
const TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';

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

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Texture loading
  const loader = new THREE.TextureLoader();
  loader.load(TEXTURE_URL, function(texture) {
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
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

  // Add event listeners
  window.addEventListener('resize', handleResize);

  // Cleanup function
  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
  };

  window.addEventListener('unload', cleanup);
  window.addEventListener('beforeunload', cleanup);
}

// Initialize both globes
createGlobe('cornerGlobe', 500); // Original corner globe
createGlobe('topRightGlobe', 300); // New top right globe