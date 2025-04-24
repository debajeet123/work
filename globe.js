
// globe.js

// 1. Setup Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 4;

// 2. Renderer
const container = document.getElementById("cornerGlobe");
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);  // Transparent background
container.appendChild(renderer.domElement);

// 3. Resize Handling
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

window.addEventListener("resize", () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});

// 4. Load Night Texture
const loader = new THREE.TextureLoader();
const texture = loader.load("https://raw.githubusercontent.com/ajayns/earth-js/master/images/earth-night.jpg");

// 5. Create Geoid Sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);
geometry.scale(1, 0.99, 1);  // Slight vertical flattening for realism

const material = new THREE.MeshPhongMaterial({
  map: texture,
  shininess: 2,
  emissive: new THREE.Color(0x222222),
  emissiveIntensity: 0.4,
});

const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// 6. Ambient & Directional Lighting
const ambientLight = new THREE.AmbientLight(0x333333);  // low glow
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x00ffff, 1); // cyan-blueish space light
dirLight.position.set(-2, 2, 5);
scene.add(dirLight);

// 7. Animate
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();


// 8. Resize handler
window.addEventListener("resize", () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});

// 9. Tab handling
window.openTab = function (evt, tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const links = document.querySelectorAll(".tab-link");
  tabs.forEach(tab => tab.classList.remove("active"));
  links.forEach(link => link.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
};

// 10. Scroll animation (Ricker wavelet stretch)
window.addEventListener("scroll", () => {
  const wavelet = document.querySelector('.ricker-wavelet');
  const scrollTop = window.scrollY;
  if (wavelet) wavelet.style.transform = `scaleY(${1 + scrollTop / 500})`;
});




