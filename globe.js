
document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 3;

  const container = document.getElementById("cornerGlobe");
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x888888));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 3, 5);
  scene.add(light);

  const loader = new THREE.TextureLoader();
  loader.load("https://raw.githubusercontent.com/ajayns/earth-js/master/images/earth-night.jpg", texture => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const mat = new THREE.MeshPhongMaterial({ map: texture, emissive: 0x111111, emissiveIntensity: 0.4 });
    const globe = new THREE.Mesh(geo, mat);
    scene.add(globe);
    function animate() {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    animate();
  });

  window.addEventListener("resize", () => {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
});
