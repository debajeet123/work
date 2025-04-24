
document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 3;

  const container = document.getElementById("cornerGlobe");
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
  loader.load(
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Night_map.png/1024px-Night_map.png",
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
    function animate() {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      renderer.render(scene, camera);
    }
    animate();
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
