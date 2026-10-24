import {
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const STORE = "__pfioSceneDestroy";

export function initScene(container: HTMLElement): void {
  const host = window as Window & { [STORE]?: () => void };
  host[STORE]?.();

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.pointerEvents = "none";
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 20);
  camera.position.set(0, 0, 5.2);

  try {
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  } catch {
    // Direct lights still describe the form if the environment map fails.
  }

  scene.add(new AmbientLight(0xffffff, 0.55));
  const key = new DirectionalLight(0xffffff, 2.5);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new DirectionalLight(0xb7bec8, 1.5);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  const geometry = new TorusKnotGeometry(1, 0.3, 140, 16);
  const solid = new Mesh(
    geometry,
    new MeshStandardMaterial({
      color: 0xc5c9ce,
      metalness: 1,
      roughness: 0.18,
    }),
  );
  const wire = new Mesh(
    geometry,
    new MeshBasicMaterial({
      color: 0xe8e4dc,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    }),
  );
  wire.scale.setScalar(1.03);

  const group = new Group();
  group.add(solid, wire);
  scene.add(group);

  let frame = 0;
  let running = false;
  const started = performance.now();

  const draw = (time: number) => {
    if (!reduce) {
      const t = (time - started) / 1000;
      group.rotation.y = t * 0.35;
      group.rotation.x = Math.sin(t * 0.25) * 0.25;
      group.position.y = Math.sin(t * 0.7) * 0.08;
    }
    renderer.render(scene, camera);
  };

  const loop = (time: number) => {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    draw(time);
  };

  const start = () => {
    if (running || reduce) return;
    running = true;
    frame = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (width < 2 || height < 2) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw(performance.now());
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.05 },
  );
  intersectionObserver.observe(container);

  const onVisibility = () => {
    if (document.hidden) {
      stop();
      return;
    }
    const box = container.getBoundingClientRect();
    if (box.bottom > 0 && box.top < window.innerHeight) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  if (reduce) draw(performance.now());

  host[STORE] = () => {
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    geometry.dispose();
    solid.material.dispose();
    wire.material.dispose();
    scene.environment?.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export function initHeroScene(): void {
  const mount = document.querySelector<HTMLElement>("#three-canvas-mount");
  if (mount) initScene(mount);
}
