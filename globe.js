document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 3;

  const container = document.getElementById("cornerGlobe");
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 3, 5);
  scene.add(new THREE.AmbientLight(0x555555));
  scene.add(light);

  new THREE.TextureLoader().load(
    "https://raw.githubusercontent.com/ajayns/earth-js/master/images/earth-night.jpg",
    texture => {
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshPhongMaterial({ map: texture })
      );
      scene.add(globe);

      function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.0015;
        renderer.render(scene, camera);
      }
      animate();
    }
  );
});
