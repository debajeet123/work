
// globe.js

// 1. Setup Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 4;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 3;

  // 2. Renderer
  const container = document.getElementById("cornerGlobe");
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 3. Lighting
  const ambientLight = new THREE.AmbientLight(0x888888, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // 4. Load dark Earth texture
  const loader = new THREE.TextureLoader();
  loader.load(
    "https://raw.githubusercontent.com/ajayns/earth-js/master/images/earth-night.jpg",
    function (texture) {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 1,
        emissive: 0x111111,
        emissiveIntensity: 0.3,
      });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      // Animate rotation
      function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.0015;
        renderer.render(scene, camera);
      }
      animate();
    }
  );

  // 5. Resize responsiveness
  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
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




