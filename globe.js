
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cornerGlobe");
  if (!container) {
    console.error("❌ cornerGlobe container not found!");
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x888888, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = ''; // Enable CORS for GitHub Pages

  loader.load(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Night_map.png/1024px-Night_map.png",
    texture => {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 1,
        emissive: 0x111111,
        emissiveIntensity: 0.3,
      });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.0015;
        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    err => {
      console.error("❌ Failed to load Earth texture:", err);
    }
  );

  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
});

