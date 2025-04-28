// Constants - Adjust these values to modify the globe appearance
const GLOBE_RADIUS = 1;                    // Size of the globe (1 = default)
const ROTATION_SPEED = 0.002;              // Speed of rotation (higher = faster)
const DAY_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const NIGHT_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_night_2048.jpg';
const CLOUDS_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png';
const BUMP_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg';
const SPECULAR_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg';

// Create a function to initialize a globe
function createGlobe(containerId, size) {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, size / size, 0.1, 1000);
  camera.position.z = 4;

  //fe
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  document.getElementById(containerId).appendChild(renderer.domElement);
  // document.getElementById('earthquakeGlobe').appendChild(renderer.domElement);

  // Lighting setup
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

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += ROTATION_SPEED;
      renderer.render(scene, camera);
    }

    animate();
  });

  // Handle window resize
  function handleResize() {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', handleResize);
}

// Initialize the globe
createGlobe('topRightGlobe', 300);
document.addEventListener("DOMContentLoaded", () => {

  // --- Existing code for the small top-right globe ---
  // (Your current code that creates the small rotating globe in #topRightGlobe)
  createGlobe('topRightGlobe', 300); // Assuming you have a function for this as in your globe.js

  // --- New code for the full-page rotating Earth with earthquake markers ---
  // Check that the earthquakeGlobe container exists
  const earthquakeGlobeContainer = document.getElementById('earthquakeGlobe');
  if (earthquakeGlobeContainer) {
    // Create the scene, camera, and renderer for the full-page Earth
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // CHANGE THIS: Append renderer to the earthquakeGlobe container instead of the body
    earthquakeGlobeContainer.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 0, 5);
    scene.add(directionalLight);

    // Texture loader and URLs
    const loader = new THREE.TextureLoader();
    const DAY_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
    const NIGHT_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_lights_2048.png';
    const CLOUDS_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png';
    const BUMP_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg';
    const SPECULAR_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg';

    Promise.all([
      loader.loadAsync(DAY_TEXTURE_URL),
      loader.loadAsync(NIGHT_TEXTURE_URL),
      loader.loadAsync(CLOUDS_TEXTURE_URL),
      loader.loadAsync(BUMP_TEXTURE_URL),
      loader.loadAsync(SPECULAR_TEXTURE_URL),
    ]).then(([dayTexture, nightTexture, cloudTexture, bumpTexture, specularTexture]) => {

      // Create Earth mesh with Earthquake markers support
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: dayTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.05,
        specularMap: specularTexture,
        specular: new THREE.Color('grey'),
        shininess: 10,
        emissiveMap: nightTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 1.5
      });

      const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Bigger
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Bright yellow
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(pos);
      earth.add(marker);

      // Clouds layer
      const cloudsGeometry = new THREE.SphereGeometry(1.01, 64, 64);
      const cloudsMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
      scene.add(clouds);

      fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
        .then(response => {
          console.log("Fetch Response:", response);
          return response.json();
        })
        .then(data => {
          console.log("Earthquake data:", data);  // 👈 See if data.features exist
          const earthquakes = data.features.slice(0, 10);
          earthquakes.forEach(eq => {
            const [lon, lat] = eq.geometry.coordinates;
            console.log(`Earthquake lat: ${lat}, lon: ${lon}`);  // 👈 See each quake's location
            const pos = latLonToVector3(lat, lon, 1.02);
            const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.copy(pos);
            earth.add(marker);
          });
        })
        .catch(err => {
          console.error('Error fetching earthquake data:', err);
        });



      // Convert lat/long to 3D position on the globe
      function latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
      }

      // Animate the scene
      function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.001;     // Rotate Earth (and markers)
        clouds.rotation.y += 0.0012;   // Rotate clouds slightly faster
        renderer.render(scene, camera);
      }
      animate();

    }).catch(error => {
      console.error('Error loading textures:', error);
    });

    // Responsive handling
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  } // end: if(earthquakeGlobeContainer)
});
