const globe = Globe()
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
  .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
  .showGraticules(true)
  (document.getElementById('globeViz'));

globe.controls().autoRotate = true;
globe.controls().autoRotateSpeed = 0.5;
globe.pointOfView({ altitude: 2.2 });

globe.scene().add(new THREE.AmbientLight(0x888888));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(1, 1, 1);
globe.scene().add(dir);

window.addEventListener('resize', () => {
  globe.width(window.innerWidth).height(window.innerHeight);
});
