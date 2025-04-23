
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Earth texture from online (no local file needed)
const loader = new THREE.TextureLoader();
const earthTexture = loader.load(
  "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg"
);

// Create the globe
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sphereMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

// Animate the globe
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0015;
  renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


  // Tab handling
  window.openTab = function (evt, tabId) {
    const tabs = document.querySelectorAll(".tab-content");
    const links = document.querySelectorAll(".tab-link");
    tabs.forEach(tab => tab.classList.remove("active"));
    links.forEach(link => link.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
  };

  // Scroll effect
  window.addEventListener('scroll', () => {
    const wavelet = document.querySelector('.ricker-wavelet');
    const scrollTop = window.scrollY;
    if (wavelet) wavelet.style.transform = `scaleY(${1 + scrollTop / 500})`;
  });
});


