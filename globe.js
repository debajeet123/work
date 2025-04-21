const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
document.getElementById("cornerGlobe").appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
loader.load("https://unpkg.com/three-globe/example/img/earth-night.jpg", function (texture) {
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  scene.add(new THREE.AmbientLight(0x888888));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.002;
    renderer.render(scene, camera);
  }
  animate();
});

window.addEventListener("resize", () => {
  renderer.setSize(300, 300);
});
function openTab(evt, tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const links = document.querySelectorAll(".tab-link");
  tabs.forEach(tab => tab.classList.remove("active"));
  links.forEach(link => link.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

window.addEventListener('scroll', () => {
  const wavelet = document.querySelector('.ricker-wavelet');
  const scrollTop = window.scrollY;
  wavelet.style.transform = `scaleY(${1 + scrollTop / 500})`;
});

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('rickerCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 80;
    canvas.height = window.innerHeight;

    let tOffset = 0;
    let direction = 1;

    function rickerWavelet(t, f = 2, phase = 0) {
      const pi2f2 = Math.PI * Math.PI * f * f;
      const term = pi2f2 * (t - phase) * (t - phase);
      return (1 - 2 * term) * Math.exp(-term);
    }

    function drawWave(phase = 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "#00ffe1";
      ctx.lineWidth = 2;

      const centerX = canvas.width / 2;
      const scaleY = 10;

      for (let y = 0; y < canvas.height; y++) {
        const t = (y - canvas.height / 2) / 50;
        const x = centerX + rickerWavelet(t, 6, phase) * scaleY;
        if (y === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    function animatePulse() {
      tOffset += direction * 0.01;
      if (Math.abs(tOffset) > 0.4) direction *= -1;
      drawWave(tOffset);
      requestAnimationFrame(animatePulse);
    }

    animatePulse();
  }
});



