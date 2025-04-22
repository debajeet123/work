const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
document.getElementById("cornerGlobe").appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
loader.load("https://unpkg.com/three-globe/example/img/earth-night.jpg", function (texture) {
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  scene.add(new THREE.AmbientLight(0x888888));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.002;
    renderer.render(scene, camera);
  }
  animate();
});

window.addEventListener("resize", () => {
  renderer.setSize(300, 300);
});
function openTab(evt, tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const links = document.querySelectorAll(".tab-link");
  tabs.forEach(tab => tab.classList.remove("active"));
  links.forEach(link => link.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

window.addEventListener('scroll', () => {
  const wavelet = document.querySelector('.ricker-wavelet');
  const scrollTop = window.scrollY;
  wavelet.style.transform = `scaleY(${1 + scrollTop / 500})`;
});

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(eq => {
      const [lon, lat] = eq.geometry.coordinates;
      const magnitude = eq.properties.mag;
      ...
      scene.add(marker);
      animateMarker(marker);
    });
  });



