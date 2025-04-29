// Constants - Adjust these values to modify the globe appearance
const GLOBE_RADIUS = 1;                  // Size of the globe
const ROTATION_SPEED = 0.002;             // Speed of rotation

// Texture URLs
const DAY_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const NIGHT_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_night_2048.jpg';
const CLOUDS_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png';
const BUMP_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg';
const SPECULAR_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg';

document.addEventListener('DOMContentLoaded', () => {
  createGlobe('topRightGlobe', 300); // Initialize the globe inside the given div
});

function createGlobe(containerId, size) {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000); // square aspect for now
  camera.position.z = 4;
}
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0); // transparent background
  document.getElementById(containerId).appendChild(renderer.domElement);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Texture loading
  const loader = new THREE.TextureLoader();
  loader.load(DAY_TEXTURE_URL, function (tex) {
    const geo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const mat = new THREE.MeshPhongMaterial({ map: tex });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // 🌎 Fetch Earthquake data and plot on the globe
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      .then(response => response.json())
      .then(data => {
        console.log('Earthquake data loaded:', data);

        const earthquakes = data.features.slice(0, 10); // latest 10 events
        earthquakes.forEach(eq => {
          if (eq.geometry && eq.geometry.coordinates && eq.geometry.coordinates.length >= 2) {
            const lon = eq.geometry.coordinates[0];
            const lat = eq.geometry.coordinates[1];

            const pos = latLonToVector3(lat, lon, GLOBE_RADIUS + 0.05); // Slightly above surface

            const markerGeometry = new THREE.SphereGeometry(0.03, 12, 12);
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);

            marker.position.copy(pos);
            mesh.add(marker); // Attach marker to rotating globe
            console.log(`Marker plotted at lat: ${lat}, lon: ${lon}`);
          }
        });
      })
      .catch(err => {
        console.error('Error fetching earthquake data:', err);
      });

    // Animate
    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += ROTATION_SPEED;
      renderer.render(scene, camera);
    }
    animate();

    document.addEventListener('DOMContentLoaded', () => {
      const tabLinks = document.querySelectorAll('.tab-link');
      const tabSections = document.querySelectorAll('.tab-section');
    
      // Set home section active on load
      window.location.hash = "#home";
      document.querySelector('.tab-link[href="#home"]').classList.add('active');
    
      tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);
    
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
    
          // Update active tab highlight
          tabLinks.forEach(tab => tab.classList.remove('active'));
          link.classList.add('active');
        });
      });
    });
    

// Helper to convert latitude, longitude to 3D coordinates
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}
