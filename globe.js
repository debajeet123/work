
// globe.js

// 1. Set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  1,    // placeholder, will update to container aspect
  0.1,
  1000
);
camera.position.z = 4;

// 2. Create renderer and attach to the cornerGlobe container
const container = document.getElementById("cornerGlobe");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // transparent
container.appendChild(renderer.domElement);

// 3. Update camera aspect based on container
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

// 4. Load Earth textures (color + bump)
const textureLoader = new THREE.TextureLoader();
const earthMap = textureLoader.load("https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg");
const bumpMap = textureLoader.load("https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthbump1k.jpg");
const specularMap = textureLoader.load("https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthspec1k.jpg");

// 5. Create geoid shape — slight flattening to mimic Earth’s real oblateness
const geoidGeometry = new THREE.SphereGeometry(1.0, 64, 64);
geoidGeometry.scale(1, 0.99, 1);  // Slight vertical squish for geoid realism

const geoidMaterial = new THREE.MeshPhongMaterial({
  map: earthMap,
  bumpMap: bumpMap,
  bumpScale: 0.05,
  specularMap: specularMap,
  specular: new THREE.Color("grey"),
  shininess: 10
});

const geoid = new THREE.Mesh(geoidGeometry, geoidMaterial);
scene.add(geoid);

// 6. Add lighting
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 2, 5);
scene.add(directionalLight);

// 7. Animate
function animate() {
  requestAnimationFrame(animate);
  geoid.rotation.y += 0.0015;
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




