
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const container = document.getElementById("cornerGlobe");
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 3, 3);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const geometry = new THREE.IcosahedronGeometry(1, 5);
const material = new THREE.MeshStandardMaterial({
  color: 0x8855ff,
  wireframe: false,
  roughness: 0.5,
  metalness: 0.6
});
const rock = new THREE.Mesh(geometry, material);
scene.add(rock);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  rock.rotation.x += 0.005;
  rock.rotation.y += 0.01;

  // Create a dynamic distortion effect
  rock.geometry.vertices.forEach(v => {
    v.normalize().multiplyScalar(1 + 0.1 * Math.sin(t * 5 + v.x * 10));
  });
  rock.geometry.verticesNeedUpdate = true;

  renderer.render(scene, camera);
}
animate();
