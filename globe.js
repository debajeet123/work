document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 3;

  const container = document.getElementById("cornerGlobe");
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0x888888); scene.add(light);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1); dirLight.position.set(5, 3, 5); scene.add(dirLight);

  const loader = new THREE.TextureLoader();
  loader.load("https://raw.githubusercontent.com/ajayns/earth-js/master/images/earth-night.jpg", (texture) => {
    const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshPhongMaterial({ map: texture }));
    scene.add(globe);
    function animate() {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      renderer.render(scene, camera);
    }
    animate();
  });

  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
});

window.openTab = function (evt, tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const links = document.querySelectorAll(".tab-link");
  tabs.forEach(tab => tab.classList.remove("active"));
  links.forEach(link => link.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
};
