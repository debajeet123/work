// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Load Earth texture and create globe
const loader = new THREE.TextureLoader();
loader.load(
  "https://raw.githubusercontent.com/josephsurin/earth-globe-threejs/main/textures/earthmap1k.jpg",
  function (texture) {
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Lights
    scene.add(new THREE.AmbientLight(0x888888));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();
  }
);

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
