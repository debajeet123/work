const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
document.getElementById("cornerGlobe").appendChild(renderer.domElement);

let globe; // define in outer scope

const loader = new THREE.TextureLoader();
loader.load(
  "https://unpkg.com/three-globe/example/img/earth-night.jpg",
  function (texture) {
    console.log("✅ Texture loaded!");
 const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  globe = new THREE.Mesh(geometry, material); // ✅ no `const`

  scene.add(globe);

  scene.add(new THREE.AmbientLight(0x888888));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  
  

// ✅ Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (globe) globe.rotation.y += 0.002;
  TWEEN.update();
  renderer.render(scene, camera);
}

// Start animation no matter what
animate();

// Resize fix
window.addEventListener("resize", () => {
  renderer.setSize(300, 300);
});

// Tab handling
function openTab(evt, tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const links = document.querySelectorAll(".tab-link");
  tabs.forEach(tab => tab.classList.remove("active"));
  links.forEach(link => link.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Scroll effect
window.addEventListener('scroll', () => {
  const wavelet = document.querySelector('.ricker-wavelet');
  const scrollTop = window.scrollY;
  if (wavelet) wavelet.style.transform = `scaleY(${1 + scrollTop / 500})`;
});


