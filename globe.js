
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
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// 3. Update camera aspect based on container
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

// 4. Load Earth texture
const loader = new THREE.TextureLoader();
const earthTexture = loader.load(
  "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg"
);

// 5. Create the globe mesh
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sphereMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

// 6. Animation loop
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();

// 7. Handle window resize
window.addEventListener("resize", () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
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


