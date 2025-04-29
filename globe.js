// Constants - Adjust these values to modify the globe appearance
const GLOBE_RADIUS = 1;                  // Size of the globe
const ROTATION_SPEED = 0.002;           // Speed of rotation

// Texture URLs
const DAY_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const NIGHT_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_night_2048.jpg';
const CLOUDS_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png';
const BUMP_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg';
const SPECULAR_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg';

document.addEventListener('DOMContentLoaded', () => {
    createGlobe('topRightGlobe', 300); // Initialize the globe inside the given div

    // Tab behavior
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabSections = document.querySelectorAll('.tab-section');
    window.location.hash = "#home";
    document.querySelector('.tab-link[href="#home"]').classList.add('active');

    tabLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            tabLinks.forEach(tab => tab.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Slider behavior
    const slider = document.getElementById('design-slider');
    if (slider) {
        slider.addEventListener('input', function() {
            let sliderValue = this.value;
            // Update the CSS variable for height based on slider position
            document.documentElement.style.setProperty('--strata-size', `${50 + sliderValue / 2}% ${120}%`);
            document.documentElement.style.setProperty('--strata-position-y', `${sliderValue * 8}px`);
            // Optional: Adjust horizontal position if needed
            // document.documentElement.style.setProperty('--strata-position-x', `${sliderValue * 5}px`);
        });
    }
});
function createGlobe(containerId, size) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  document.getElementById(containerId).appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const loader = new THREE.TextureLoader();
  loader.load(DAY_TEXTURE_URL, function (tex) {
    const geo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const mat = new THREE.MeshPhongMaterial({ map: tex });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // 🌍 Earthquake markers
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      .then(response => response.json())
      .then(data => {
        console.log('Earthquake data loaded:', data);
        const earthquakes = data.features.slice(0, 10);
        earthquakes.forEach(eq => {
          if (eq.geometry && eq.geometry.coordinates && eq.geometry.coordinates.length >= 2) {
            const lon = eq.geometry.coordinates[0];
            const lat = eq.geometry.coordinates[1];
            const pos = latLonToVector3(lat, lon, GLOBE_RADIUS + 0.05);

            const markerGeo = new THREE.SphereGeometry(0.03, 12, 12);
            const markerMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
            const marker = new THREE.Mesh(markerGeo, markerMat);
            marker.position.copy(pos);
            mesh.add(marker);
            console.log(`Marker plotted at lat: ${lat}, lon: ${lon}`);
          }
        });
      })
      .catch(err => {
        console.error('Error fetching earthquake data:', err);
      });

    // Animate globe
    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += ROTATION_SPEED;
      renderer.render(scene, camera);
    }
    animate();
  });

  // Resize handling
  window.addEventListener('resize', () => {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

// Helper: Convert lat/lon to 3D coordinates
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}