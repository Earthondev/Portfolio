import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

interface StudioControl {
  update: (progress: number) => void;
  dispose: () => void;
}
const PAPER = "#fbf8f2",
  INK = "#211f1b",
  COPPER = "#97412c",
  SOFT = "#e9e0d1";
function material(
  color: string,
  metalness = 0,
  roughness = 0.55,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}
function box(
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  r = 0.03,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 4, h / 4, d / 4)),
    mat,
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color = INK,
): void {
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px Sarabun, sans-serif`;
  ctx.fillText(text, x, y);
}
function sheetTexture(
  title: string,
  lines: string[],
  kind = "EXAMPLE",
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1400;
  c.height = 1800;
  const x = c.getContext("2d");
  if (!x) throw new Error("Canvas unavailable");
  x.fillStyle = PAPER;
  x.fillRect(0, 0, 1400, 1800);
  x.fillStyle = COPPER;
  x.fillRect(90, 100, 80, 8);
  drawText(x, kind, 90, 190, 30, COPPER);
  drawText(x, title, 90, 350, 72);
  x.strokeStyle = "#d6cbbc";
  x.lineWidth = 3;
  x.beginPath();
  x.moveTo(90, 420);
  x.lineTo(1310, 420);
  x.stroke();
  lines.forEach((line, i) =>
    drawText(x, line, 90, 560 + i * 125, 42, i === 0 ? INK : "#635c53"),
  );
  drawText(x, "ตัวอย่างประกอบการเรียน", 90, 1660, 32, COPPER);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
function printPlane(w: number, h: number, texture: THREE.Texture): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
  );
}
function note(title: string, lines: string[], kind: string): THREE.Group {
  const group = new THREE.Group();
  group.add(box(2.05, 2.64, 0.035, material(PAPER), 0.025));
  const front = printPlane(1.99, 2.57, sheetTexture(title, lines, kind));
  front.position.z = 0.021;
  group.add(front);
  return group;
}
function tube(
  points: THREE.Vector3[],
  radius: number,
  mat: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      32,
      radius,
      8,
      false,
    ),
    mat,
  );
  mesh.castShadow = true;
  return mesh;
}
function browserTexture(
  img: HTMLImageElement,
  name: string,
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1360;
  const x = c.getContext("2d");
  if (!x) throw new Error("Canvas unavailable");
  x.fillStyle = "#f1eee7";
  x.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 3; i++) {
    x.fillStyle = ["#c47862", "#ccb77c", "#8e9f87"][i] || COPPER;
    x.beginPath();
    x.arc(35 + i * 29, 30, 7, 0, Math.PI * 2);
    x.fill();
  }
  drawText(x, name, 160, 42, 22, "#5b554b");
  x.drawImage(
    img,
    0,
    0,
    img.width,
    Math.min(img.height, (img.width * 1300) / 2048),
    0,
    60,
    2048,
    1300,
  );
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export async function mountStudio(host: HTMLElement): Promise<StudioControl> {
  const targetCanvas = host.querySelector<HTMLCanvasElement>("canvas");
  if (!targetCanvas) throw new Error("Missing studio canvas");
  const canvas: HTMLCanvasElement = targetCanvas;
  await document.fonts.ready;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const environmentGenerator = new THREE.PMREMGenerator(renderer),
    environmentScene = new RoomEnvironment(),
    environment = environmentGenerator.fromScene(environmentScene, 0.08);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  environmentScene.dispose();
  environmentGenerator.dispose();
  scene.add(new THREE.HemisphereLight("#fffaf0", "#a89983", 2));
  const light = new THREE.DirectionalLight("#fff3dd", 3.3);
  light.position.set(-3, 9, 7);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -12;
  light.shadow.camera.right = 12;
  light.shadow.camera.top = 8;
  light.shadow.camera.bottom = -8;
  light.shadow.normalBias = 0.035;
  scene.add(light);
  const fill = new THREE.DirectionalLight("#e3ecff", 1);
  fill.position.set(8, 4, -2);
  scene.add(fill);
  const graphite = material("#343733", 0.65, 0.34),
    silver = material("#b4b6af", 0.85, 0.3),
    keys = material("#292d29", 0.18, 0.5),
    copper = material("#ab6446", 0.7, 0.35),
    paper = material(PAPER),
    desk = box(20, 0.22, 6, material("#dfd4c1", 0.05, 0.65), 0.1);
  desk.position.set(4.2, -1.15, 0);
  scene.add(desk);
  // Machined laptop: recessed keyboard, trackpad, hinge and a true image display.
  const laptop = new THREE.Group();
  laptop.position.set(-1, -0.96, 0.35);
  laptop.rotation.y = -0.15;
  const base = box(5.25, 0.12, 3.25, silver, 0.06);
  laptop.add(base);
  const deck = box(4.85, 0.025, 2.0, graphite, 0.04);
  deck.position.set(0, 0.073, -0.38);
  laptop.add(deck);
  const caps = new THREE.InstancedMesh(
    new RoundedBoxGeometry(0.285, 0.038, 0.25, 2, 0.014),
    keys,
    70,
  );
  caps.castShadow = true;
  caps.receiveShadow = true;
  const marks = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.06, 0.002, 0.011),
    material("#959d91"),
    48,
  );
  const matrix = new THREE.Matrix4();
  let capIndex = 0,
    markIndex = 0;
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 14; col++) {
      if (row === 4 && col >= 5 && col <= 8) continue;
      const x = -2.16 + col * 0.333,
        z = -1.13 + row * 0.31;
      matrix.makeTranslation(x, 0.105, z);
      caps.setMatrixAt(capIndex++, matrix);
      if (row < 4 && col > 0 && col < 13) {
        matrix.makeTranslation(x, 0.126, z);
        marks.setMatrixAt(markIndex++, matrix);
      }
    }
  caps.count = capIndex;
  marks.count = markIndex;
  laptop.add(caps, marks);
  const space = box(1.55, 0.038, 0.25, keys, 0.018);
  space.position.set(0.005, 0.105, 0.11);
  laptop.add(space);
  const track = box(1.6, 0.008, 0.72, material("#92968e", 0.8, 0.35), 0.035);
  track.position.set(0, 0.07, 1.02);
  laptop.add(track);
  const lip = box(0.9, 0.009, 0.04, graphite, 0.015);
  lip.position.set(0, 0.06, 1.61);
  laptop.add(lip);
  for (const side of [-1, 1]) {
    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.105, 0.8, 16),
      silver,
    );
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(side * 1.8, 0.1, -1.5);
    laptop.add(hinge);
    for (let i = 0; i < 22; i++) {
      const slot = box(0.1, 0.004, 0.014, keys, 0.002);
      slot.position.set(side * 2.48, 0.071, -1.15 + i * 0.09);
      laptop.add(slot);
    }
  }
  const lid = new THREE.Group();
  lid.position.set(0, 0.12, -1.5);
  lid.rotation.x = -0.13;
  const bezel = box(5.25, 3.53, 0.14, graphite, 0.07);
  bezel.position.y = 1.765;
  lid.add(bezel);
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(4.98, 3.31),
    new THREE.MeshBasicMaterial({ color: "#f1eee7", toneMapped: false }),
  );
  display.position.set(0, 1.79, 0.079);
  lid.add(display);
  const webcam = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 10, 8),
    material("#050908", 0.5, 0.15),
  );
  webcam.position.set(0, 3.455, 0.08);
  lid.add(webcam);
  laptop.add(lid);
  scene.add(laptop);
  const loader = new THREE.ImageLoader();
  const sources = [
    ["chaianan", "chaianan.com"],
    ["goldenland", "goldenlandseniorcare.com"],
    ["jae-noi-pork-shop", "jaenoishop.com"],
  ] as const;
  const textures = await Promise.all(
    sources.map(async ([id, name]) =>
      browserTexture(
        await loader.loadAsync(
          new URL(`../../projects/${id}/live-home.webp`, import.meta.url).href,
        ),
        name,
      ),
    ),
  ).catch((error: unknown) => {
    environment.dispose();
    renderer.dispose();
    throw error;
  });
  textures.forEach(
    (t) =>
      (t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())),
  );
  const displayMaterial = display.material as THREE.MeshBasicMaterial;
  displayMaterial.map = textures[0] || null;
  displayMaterial.needsUpdate = true;
  // A paper-based teaching workspace, labelled as an example throughout.
  const learning = new THREE.Group();
  learning.position.set(4.15, -0.94, -0.3);
  learning.rotation.y = -0.28;
  const stand = box(6.3, 0.08, 1.6, copper, 0.04);
  stand.position.set(0.9, 0, 0.3);
  learning.add(stand);
  const doc = note(
    "บันทึกประชุม",
    [
      "ปรับหน้าเว็บไซต์",
      "เพิ่มผลงานจริง",
      "นัดทบทวนวันศุกร์",
      "ผู้รับผิดชอบ: ยังไม่ระบุ",
    ],
    "SOURCE DOCUMENT",
  );
  doc.position.set(-1.18, 1.37, -0.15);
  doc.rotation.y = 0.14;
  learning.add(doc);
  const prompt = note(
    "ถามให้ชัด",
    [
      "สรุปเฉพาะข้อมูลที่มี",
      "แยกงาน / คน / วันส่ง",
      "ส่วนที่ไม่รู้ ให้บอกว่าไม่รู้",
      "ตรวจเทียบกับต้นฉบับ",
    ],
    "PROMPT & REVIEW",
  );
  prompt.position.set(1, 1.5, 0.2);
  prompt.rotation.y = -0.12;
  learning.add(prompt);
  const reviewed = note(
    "ตรวจคำตอบ",
    [
      "งาน: เพิ่มผลงานจริง",
      "ผู้รับผิดชอบ: ยังไม่ระบุ",
      "กำหนดส่ง: ยังไม่ระบุ",
      "นัดทบทวน: วันศุกร์",
    ],
    "REVIEWED EXAMPLE",
  );
  reviewed.position.set(3.1, 1.37, 0.05);
  reviewed.rotation.y = -0.2;
  learning.add(reviewed);
  scene.add(learning);
  // A real workflow diagram printed on a physical desk display; no simulated AI response.
  const flow = new THREE.Group();
  flow.position.set(11.7, -0.92, -0.2);
  flow.rotation.y = -0.35;
  const frame = box(4.65, 2.95, 0.12, graphite, 0.06);
  frame.position.y = 1.55;
  flow.add(frame);
  const flowCanvas = document.createElement("canvas");
  flowCanvas.width = 2048;
  flowCanvas.height = 1280;
  const f = flowCanvas.getContext("2d");
  if (!f) throw new Error("Canvas unavailable");
  f.fillStyle = PAPER;
  f.fillRect(0, 0, 2048, 1280);
  drawText(f, "จากไฟล์ในแชต สู่โฟลเดอร์ที่เป็นระเบียบ", 120, 180, 64);
  drawText(
    f,
    "ตัวอย่างขั้นตอนจากงาน Slack → Google Drive",
    120,
    280,
    39,
    "#635c53",
  );
  const steps = ["รับไฟล์", "ตั้งชื่อไฟล์", "ตรวจ Log", "จัดเก็บ"];
  steps.forEach((s, i) => {
    const x = 130 + i * 485;
    f.fillStyle = i === 2 ? "#e8d1be" : SOFT;
    f.fillRect(x, 430, 365, 260);
    drawText(f, s, x + 36, 580, 52);
    if (i < 3) {
      f.strokeStyle = COPPER;
      f.lineWidth = 8;
      f.beginPath();
      f.moveTo(x + 395, 560);
      f.lineTo(x + 460, 560);
      f.lineTo(x + 442, 545);
      f.moveTo(x + 460, 560);
      f.lineTo(x + 442, 575);
      f.stroke();
    }
  });
  drawText(f, "Python · Slack API · Google Drive API", 130, 900, 45);
  drawText(f, "กำหนดขั้นตอนและจุดตรวจ ก่อนเชื่อมระบบ", 130, 1040, 43, COPPER);
  const flowTexture = new THREE.CanvasTexture(flowCanvas);
  flowTexture.colorSpace = THREE.SRGBColorSpace;
  const diagram = printPlane(4.43, 2.77, flowTexture);
  diagram.position.set(0, 1.55, 0.07);
  flow.add(diagram);
  const foot = box(1.65, 0.07, 1, copper);
  flow.add(foot);
  scene.add(flow);
  // A weighted desk lamp, cable and pencil cup provide a physical setting.
  const lamp = new THREE.Group();
  lamp.position.set(-4, -0.97, -1.4);
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.5, 0.09, 32),
    graphite,
  );
  lamp.add(lampBase);
  lamp.add(
    tube(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 2.4, -0.1),
        new THREE.Vector3(0.7, 3, -0.1),
        new THREE.Vector3(1.1, 2.9, 0.1),
      ],
      0.04,
      copper,
    ),
  );
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.38, 0.45, 24, 1, true),
    graphite,
  );
  shade.rotation.z = -0.7;
  shade.position.set(1.1, 2.75, 0.1);
  lamp.add(shade);
  scene.add(lamp);
  const cable = tube(
    [
      new THREE.Vector3(-3.5, -0.96, -1.1),
      new THREE.Vector3(-4.1, -1, -0.6),
      new THREE.Vector3(-4.3, -1, 0.5),
      new THREE.Vector3(-5, -1, 1),
    ],
    0.018,
    keys,
  );
  scene.add(cable);
  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.22, 0.7, 24, 1, true),
    copper,
  );
  cup.position.set(9.1, -0.7, -1.3);
  scene.add(cup);
  for (let i = 0; i < 3; i++) {
    const pencil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 1.25, 6),
      material(i === 0 ? "#b95736" : "#555c50"),
    );
    pencil.position.set(9.02 + i * 0.08, -0.3, -1.3);
    pencil.rotation.z = (i - 1) * 0.12;
    scene.add(pencil);
  }
  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 13),
    new THREE.ShadowMaterial({ opacity: 0.13 }),
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = -1.28;
  contactShadow.receiveShadow = true;
  scene.add(contactShadow);
  let targetProgress = 0,
    progress = 0,
    active = false,
    frameId = 0,
    previous = 0,
    disposed = false,
    selected = -1;
  let width = 1,
    height = 1;
  const points = [
    { p: 0, pos: [1.7, 3.2, 10.8], look: [-1, 0.55, 0] },
    { p: 0.42, pos: [0.3, 2.0, 7.8], look: [-1, 0.75, -0.3] },
    { p: 0.64, pos: [7.3, 2.6, 12.5], look: [5.3, 0.7, 0] },
    { p: 0.85, pos: [12.9, 2.1, 8.8], look: [11.7, 0.65, 0] },
    { p: 1, pos: [7.1, 6.8, 26.8], look: [4.8, 0.2, 0] },
  ];
  const eye = new THREE.Vector3(),
    look = new THREE.Vector3();
  function render(time: number): void {
    frameId = 0;
    if (disposed || !active || document.hidden) return;
    const dt = Math.min((time - previous) / 1000, 0.06);
    previous = time;
    progress = THREE.MathUtils.lerp(
      progress,
      targetProgress,
      1 - Math.exp(-dt * 10),
    );
    if (Math.abs(progress - targetProgress) < 0.0002) progress = targetProgress;
    let i = 0;
    while (i < points.length - 2 && progress > (points[i + 1]?.p || 1)) i++;
    const a = points[i],
      b = points[i + 1];
    if (!a || !b) return;
    const t = THREE.MathUtils.smoothstep(progress, a.p, b.p);
    eye
      .set(a.pos[0] || 0, a.pos[1] || 0, a.pos[2] || 1)
      .lerp(new THREE.Vector3(b.pos[0], b.pos[1], b.pos[2]), t);
    look
      .set(a.look[0] || 0, a.look[1] || 0, a.look[2] || 0)
      .lerp(new THREE.Vector3(b.look[0], b.look[1], b.look[2]), t);
    if (width < 600) {
      eye.z += 1.1;
      eye.y += 0.4;
      const span =
        progress > 0.9
          ? THREE.MathUtils.lerp(7.2, 20, (progress - 0.9) / 0.1)
          : 7.2;
      const distance =
        span /
        (2 *
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
          camera.aspect);
      const direction = eye.clone().sub(look);
      if (direction.length() < distance)
        eye.copy(look).add(direction.setLength(distance));
    }
    camera.position.copy(eye);
    camera.lookAt(look);
    const index = progress < 0.145 ? 0 : progress < 0.29 ? 1 : 2;
    if (index !== selected) {
      selected = index;
      displayMaterial.map = textures[index] || null;
      displayMaterial.needsUpdate = true;
    }
    renderer.render(scene, camera);
    host.dataset.studioDrawCalls = String(renderer.info.render.calls);
    host.dataset.studioProgress = progress.toFixed(4);
    host.dataset.studioWebsite = String(index);
    if (progress !== targetProgress) request();
  }
  function request(): void {
    if (!frameId && active && !document.hidden && !disposed) {
      previous = performance.now();
      frameId = requestAnimationFrame(render);
    }
  }
  function resize(): void {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 600 ? 1.5 : 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    request();
  }
  const resizer = new ResizeObserver(resize);
  resizer.observe(canvas);
  const visibility = new IntersectionObserver(
    (entries) => {
      active = Boolean(entries[0]?.isIntersecting);
      if (active) request();
    },
    { threshold: 0 },
  );
  visibility.observe(host);
  const onVisibility = (): void => {
    if (!document.hidden) request();
  };
  document.addEventListener("visibilitychange", onVisibility);
  resize();
  canvas.addEventListener(
    "webglcontextlost",
    () => {
      host.dataset.studioState = "fallback";
    },
    { once: true },
  );
  host.dataset.studioState = "ready";
  return {
    update(value) {
      targetProgress = THREE.MathUtils.clamp(value, 0, 1);
      request();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((m) => m.dispose());
        }
      });
      const ownedTextures = new Set<THREE.Texture>(textures);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const list = Array.isArray(object.material)
            ? object.material
            : [object.material];
          list.forEach((mat) => {
            if ("map" in mat && mat.map instanceof THREE.Texture)
              ownedTextures.add(mat.map);
          });
        }
      });
      ownedTextures.forEach((t) => t.dispose());
      environment.dispose();
      renderer.dispose();
    },
  };
}
