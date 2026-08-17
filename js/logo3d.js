/* ==========================================================================
   BA AGENCY — Insignia 3D del hero
   --------------------------------------------------------------------------
   Este módulo solo se descarga si logo3d-loader.js decide que vale la pena
   (ver ahí los criterios). Three.js está auto-alojado en /vendor/three, así
   que la carga no toca ningún CDN externo.

   El .glb es un modelo estático —no trae animaciones— así que todo el
   movimiento se genera acá: balanceo, flotación y reacción al puntero.
   ========================================================================== */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MODEL_URL = 'assets/models/ba-logo.glb';

/** Monta la insignia 3D dentro de `mount`. Devuelve una función de limpieza. */
export function mountLogo3D(mount) {
  /* ---- Escena ----------------------------------------------------------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearAlpha(0); // fondo transparente: se ve el degradado del hero
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  /* ---- Iluminación ------------------------------------------------------ */
  // RoomEnvironment genera los reflejos PBR por código: no descarga ningún HDR.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 3, 4);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x8a87c2, 3);
  rim.position.set(-3, -1, -2);
  scene.add(rim);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  /* ---- Modelo ----------------------------------------------------------- */
  const pivot = new THREE.Group(); // balanceo
  const floater = new THREE.Group(); // flotación vertical
  floater.add(pivot);
  scene.add(floater);

  let model = null;
  let loaded = false;

  const loader = new GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      model = gltf.scene;

      // Centrar y normalizar: así el encuadre no depende de las unidades
      // con las que se haya exportado el modelo.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      model.scale.setScalar(1 / Math.max(size.x, size.y, size.z));

      pivot.add(model);
      loaded = true;
      resize();
      mount.classList.add('is-ready');
    },
    undefined,
    () => {
      // Si el modelo falla, se descarta el canvas y queda el logo plano.
      destroy();
    }
  );

  /* ---- Encuadre y tamaño ------------------------------------------------- */
  function resize() {
    const rect = mount.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    camera.aspect = w / h;

    // El modelo normalizado mide 1 unidad en su eje mayor; se le deja aire.
    const fitHeight = 1.55;
    const fit = Math.max(fitHeight, fitHeight / camera.aspect);
    camera.position.z = fit / (2 * Math.tan((camera.fov * Math.PI) / 360));
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  resize();

  /* ---- Reacción al puntero ----------------------------------------------- */
  const pointer = { x: 0, y: 0 };
  const targetPointer = { x: 0, y: 0 };

  function onPointerMove(event) {
    targetPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetPointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });

  /* ---- Bucle de render ---------------------------------------------------- */
  // Se pausa cuando el hero sale de pantalla para no gastar GPU de fondo.
  let onScreen = true;
  const visibility = new IntersectionObserver(
    (entries) => entries.forEach((e) => (onScreen = e.isIntersecting)),
    { threshold: 0 }
  );
  visibility.observe(mount);

  const clock = new THREE.Clock();
  let frame = 0;
  let alive = true;

  function tick() {
    if (!alive) return;
    frame = requestAnimationFrame(tick);
    if (!loaded || !onScreen || document.hidden) return;

    const t = clock.getElapsedTime();

    // Balanceo, no giro completo: la insignia es casi plana (0.018 de
    // profundidad contra 0.15 de ancho), así que rotar 360° la deja de
    // canto —reducida a una línea— durante buena parte del ciclo.
    const swing = Math.sin(t * 0.5) * 0.6;

    floater.position.y = Math.sin(t * 1.1) * 0.045;

    // Interpolado para que no salte con el movimiento del mouse.
    pointer.x += (targetPointer.x - pointer.x) * 0.05;
    pointer.y += (targetPointer.y - pointer.y) * 0.05;

    pivot.rotation.y = swing + pointer.x * 0.35;
    pivot.rotation.x = pointer.y * 0.22;

    renderer.render(scene, camera);
  }

  tick();

  /* ---- Limpieza ---------------------------------------------------------- */
  function destroy() {
    alive = false;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibility.disconnect();
    window.removeEventListener('pointermove', onPointerMove);

    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((m) => m.dispose());
      }
    });

    envRT.texture.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    mount.classList.remove('is-ready');
  }

  return destroy;
}
