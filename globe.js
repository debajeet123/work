const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
document.getElementById("cornerGlobe").appendChild(renderer.domElement);

let globe;
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

  // 3) Fetch and plot earthquakes **here**:
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
    .then(res => res.json())
    .then(data => {
      data.features.forEach(eq => {
        const [lon, lat, depth] = eq.geometry.coordinates;
        const mag = eq.properties.mag;
        // convert lon/lat → phi/theta → x,y,z exactly like globe
        const phi   = (90 - lat) * Math.PI/180;
        const theta = (lon + 180) * Math.PI/180;
        const r = 5; // globe radius
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);

        // marker
        const geo = new THREE.SphereGeometry(0.1 * mag, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
        const m   = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        scene.add(m);

        // pulse animation
        new TWEEN.Tween(m.scale)
          .to({ x:2, y:2, z:2 }, 800)
          .yoyo(true)
          .repeat(Infinity)
          .start();
      });
    });

  // 4) Start your render loop
  animate();
});

// your animate() function:
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.002;
  TWEEN.update();        // ← tick your tweens every frame
  renderer.render(scene, camera);
}

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





