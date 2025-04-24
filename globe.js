
document.addEventListener("DOMContentLoaded", () => {
  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 3;

  // Renderer
  const container = document.getElementById("cornerGlobe");
  container.style.width = "300px";
  container.style.height = "300px";

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(300, 300);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  camera.aspect = 1;
  camera.updateProjectionMatrix();

  // Lights
  const ambientLight = new THREE.AmbientLight(0x888888, 1);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 3, 5);
  scene.add(ambientLight);
  scene.add(dirLight);

  // Load texture
  const loader = new THREE.TextureLoader();
  loader.load(
    "https://unpkg.com/three-globe/example/img/earth-night.jpg",
    function (texture) {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 1,
        emissive: 0x111111,
        emissiveIntensity: 0.3
      });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.0015;
        renderer.render(scene, camera);
      }
      animate();
    }
  );

  // Resize handler
  window.addEventListener("resize", () => {
    renderer.setSize(300, 300);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  });
});

