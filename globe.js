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
loader.load("https://unpkg.com/three-globe/example/img/earth-night.jpg", function (texture) {
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  scene.add(new THREE.AmbientLight(0x888888));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  // ✅ Fetch and plot earthquakes
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch earthquake data");
      return res.json();
    })
    .then(data => {
      console.log(`Fetched ${data.features.length} earthquakes`);

      data.features.forEach(eq => {
        const [lon, lat, depth] = eq.geometry.coordinates;
        const mag = eq.properties.mag;

        // Debug print
        console.log(`EQ: M${mag} at [${lat.toFixed(2)}, ${lon.toFixed(2)}]`);

        // Convert lon/lat → 3D coords
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const radius = 5;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        // Marker
        const markerGeometry = new THREE.SphereGeometry(0.1 * mag, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5500 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, y, z);
        scene.add(marker);

        // Pulse animation
        new TWEEN.Tween(marker.scale)
          .to({ x: 2, y: 2, z: 2 }, 800)
          .yoyo(true)
          .repeat(Infinity)
          .start();
      });
    })
    .catch(err => console.error("Earthquake fetch error:", err));
});

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


