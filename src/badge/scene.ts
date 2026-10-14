import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BADGE, createBadge, createFabricTexture } from './model';

const FIXED = { x: 0, y: 4.4, z: 0 };
const PENDULUM_LENGTH = 6 * 0.39 + BADGE.anchorY;
const GRAVITY = 9.81;
const DAMPING = 0.62;
const STRIP_STEPS = 80;
const TIME_STEP = 1 / 120;

type Drag = { pointerId: number; targetAngle: number; offsetX: number; plane: THREE.Plane };
type Ribbon = { mesh: THREE.Mesh; positions: Float32Array };

function ribbon(material: THREE.Material): Ribbon {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array((STRIP_STEPS + 1) * 6);
    const uv = new Float32Array((STRIP_STEPS + 1) * 4);
    const index: number[] = [];
    for (let i = 0; i <= STRIP_STEPS; i++) {
        uv.set([0, i / STRIP_STEPS, 1, i / STRIP_STEPS], i * 4);
        if (i < STRIP_STEPS) index.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geometry.setIndex(index);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return { mesh, positions };
}

export async function mountBadge(host: HTMLElement): Promise<void> {
    const canvas = host.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) throw new Error('The badge canvas is missing');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.max(2, Math.min(window.devicePixelRatio, 2.5)));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 40);
    camera.position.set(0, 0.85, 10.5);
    camera.lookAt(0, 0.85, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentScene = new RoomEnvironment();
    const environment = pmrem.fromScene(environmentScene, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.45;
    environmentScene.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight('#fffaf1', '#c6bba9', 0.8));
    const key = new THREE.DirectionalLight('#fff4dc', 1.8);
    key.position.set(-4, 6, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -5;
    key.shadow.camera.right = key.shadow.camera.top = 5;
    key.shadow.normalBias = 0.025;
    key.shadow.bias = -0.00025;
    key.shadow.radius = 4;
    scene.add(key);
    const fill = new THREE.DirectionalLight('#e8efff', 0.55);
    fill.position.set(5, 1, 5);
    scene.add(fill);

    const loader = new THREE.TextureLoader();
    const base = new URL('../../models/badge/', import.meta.url);
    const [front, back] = await Promise.all([loader.loadAsync(new URL('front.png', base).href), loader.loadAsync(new URL('back.png', base).href)]);
    for (const texture of [front, back]) {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    }
    const badge = createBadge(front, back);
    scene.add(badge);
    const fabric = createFabricTexture();
    const fabricMaterial = new THREE.MeshPhysicalMaterial({ map: fabric, bumpMap: fabric, bumpScale: 0.02, color: '#b47850', roughness: 0.82, metalness: 0.02, sheen: 0.2, sheenColor: new THREE.Color('#b97948'), side: THREE.DoubleSide });
    const ribbons = [ribbon(fabricMaterial), ribbon(fabricMaterial)];
    ribbons.forEach((strip, i) => { strip.mesh.name = i === 0 ? 'Copper woven strap — left' : 'Copper woven strap — right'; scene.add(strip.mesh); });
    // One angular degree of freedom: the suspension length never changes.
    // theta'' = -(g/L) sin(theta) - damping * theta'.
    let angle = 0;
    let angularVelocity = 0;
    let maximumAngle = 0.3;

    const raycaster = new THREE.Raycaster();
    const cursor = new THREE.Vector2();
    const hitPoint = new THREE.Vector3();
    const attachment = new THREE.Vector3();
    const up = new THREE.Vector3(0, 0, 1);
    let drag: Drag | undefined;
    let paused = reduced.matches;
    let visible = true;
    let previousTime = performance.now();
    let accumulator = 0;
    let request = 0;
    let destroyed = false;
    let needsRender = true;
    const pauseButton = host.querySelector<HTMLButtonElement>('[data-badge-pause]');
    const live = host.querySelector<HTMLElement>('[data-badge-status]');
    const announce = (message: string): void => { if (live) live.textContent = message; };

    function setCursor(event: PointerEvent): void {
        const rect = canvas!.getBoundingClientRect();
        cursor.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        raycaster.setFromCamera(cursor, camera);
    }
    function release(): void {
        if (!drag) return;
        if (canvas!.hasPointerCapture(drag.pointerId)) canvas!.releasePointerCapture(drag.pointerId);
        angularVelocity *= 0.7;
        boundVelocity();
        drag = undefined;
        host.classList.remove('is-dragging');
        announce('Released. The card is swinging under gravity.');
    }
    function setPaused(value: boolean): void {
        release();
        paused = value;
        needsRender = true;
        if (pauseButton) {
            pauseButton.setAttribute('aria-pressed', String(paused));
            pauseButton.textContent = paused ? 'Resume' : 'Pause';
        }
        announce(paused ? 'Motion paused.' : 'Motion resumed.');
    }
    function kick(amount: number): void {
        setPaused(false);
        angularVelocity = THREE.MathUtils.clamp(angularVelocity + amount * 2, -0.8, 0.8);
        boundVelocity();
    }
    function boundVelocity(): void {
        // Limit kinetic energy so free motion cannot exceed the visible angular arc.
        const availableEnergy = Math.max(0, Math.cos(angle) - Math.cos(maximumAngle));
        const limit = Math.min(0.8, Math.sqrt(2 * GRAVITY / PENDULUM_LENGTH * availableEnergy) * 0.95);
        angularVelocity = THREE.MathUtils.clamp(angularVelocity, -limit, limit);
    }
    function reset(): void {
        release();
        angle = 0;
        angularVelocity = 0;
        accumulator = 0;
        needsRender = true;
        announce('The card has returned to its starting position.');
    }
    function pointerDown(event: PointerEvent): void {
        if (event.button !== 0 || drag) return;
        setCursor(event);
        const hit = raycaster.intersectObject(badge, true)[0];
        if (!hit) return;
        event.preventDefault();
        setPaused(false);
        canvas!.focus({ preventScroll: true });
        drag = { pointerId: event.pointerId, targetAngle: angle, offsetX: hit.point.x - badge.position.x, plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), -hit.point.z) };
        angularVelocity = 0;
        canvas!.setPointerCapture(event.pointerId);
        host.classList.add('is-dragging');
        announce('Card grabbed. Drag and release to swing.');
    }
    function pointerMove(event: PointerEvent): void {
        setCursor(event);
        if (drag) {
            if (event.pointerId !== drag.pointerId) return;
            if (raycaster.ray.intersectPlane(drag.plane, hitPoint)) {
                // Horizontal movement chooses an angle on the same fixed-radius arc.
                // Vertical pointer movement cannot lift, stretch or compress the strap.
                const horizontalLimit = PENDULUM_LENGTH * Math.sin(maximumAngle * 0.85);
                const x = THREE.MathUtils.clamp(hitPoint.x - drag.offsetX - FIXED.x, -horizontalLimit, horizontalLimit);
                drag.targetAngle = Math.asin(x / PENDULUM_LENGTH);

            }
        } else {
            canvas!.style.cursor = raycaster.intersectObject(badge, true).length ? 'grab' : 'default';
        }
    }
    function keyDown(event: KeyboardEvent): void {
        const impulses: Record<string, number> = { ArrowLeft: -0.2, ArrowRight: 0.2, ArrowUp: -0.12, ArrowDown: 0.12 };
        const impulse = impulses[event.key];
        if (impulse) { event.preventDefault(); kick(impulse); }
        else if (event.key === ' ') { event.preventDefault(); setPaused(!paused); }
        else if (event.key.toLowerCase() === 'r') { event.preventDefault(); reset(); }
    }
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('lostpointercapture', release);
    canvas.addEventListener('keydown', keyDown);
    host.querySelector('[data-badge-swing]')?.addEventListener('click', () => kick(0.24));
    host.querySelector('[data-badge-reset]')?.addEventListener('click', reset);
    pauseButton?.addEventListener('click', () => setPaused(!paused));
    setPaused(paused);

    function updateVisuals(): void {
        badge.position.set(FIXED.x + PENDULUM_LENGTH * Math.sin(angle), FIXED.y - PENDULUM_LENGTH * Math.cos(angle), FIXED.z);
        badge.rotation.set(0, 0, angle);
        badge.updateMatrixWorld();
        attachment.set(0, BADGE.anchorY + 0.15, 0.05).applyQuaternion(badge.quaternion).add(badge.position);
        const suspension = new THREE.Vector3(FIXED.x, FIXED.y, FIXED.z);
        const points = Array.from({ length: 8 }, (_, i) => suspension.clone().lerp(attachment, i / 7));
        const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
        const endNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(badge.quaternion);
        ribbons.forEach((strip, stripIndex) => {
            const direction = stripIndex === 0 ? -1 : 1;
            for (let i = 0; i <= STRIP_STEPS; i++) {
                const t = i / STRIP_STEPS;
                const point = curve.getPoint(t);
                const tangent = curve.getTangent(t);
                const normal = up.clone().lerp(endNormal, Math.pow(t, 3)).normalize();
                const side = new THREE.Vector3().crossVectors(tangent, normal).normalize();
                const offset = direction * (0.075 + 0.4 * Math.pow(1 - t, 1.3));
                point.addScaledVector(side, offset);
                const left = point.clone().addScaledVector(side, -0.105);
                const right = point.clone().addScaledVector(side, 0.105);
                strip.positions.set([left.x, left.y, left.z, right.x, right.y, right.z], i * 6);
            }
            strip.mesh.geometry.getAttribute('position').needsUpdate = true;
            strip.mesh.geometry.computeVertexNormals();
        });
        host.dataset.badgeX = badge.position.x.toFixed(3);
        host.dataset.badgeY = badge.position.y.toFixed(3);
        host.dataset.badgeSpeed = (Math.abs(angularVelocity) * PENDULUM_LENGTH).toFixed(3);
        host.dataset.badgeRadius = badge.position.distanceTo(suspension).toFixed(6);
        host.dataset.badgeAngle = angle.toFixed(6);
        host.dataset.badgeLimit = maximumAngle.toFixed(6);
    }
    function render(now: number): void {
        if (destroyed) return;
        const elapsed = Math.min((now - previousTime) / 1000, 0.05);
        previousTime = now;
        if (visible && !document.hidden) {
            if (!paused) {
                accumulator += elapsed;
                while (accumulator >= TIME_STEP) {
                    if (drag) {
                        const previousAngle = angle;
                        angle += (drag.targetAngle - angle) * (1 - Math.exp(-18 * TIME_STEP));
                        angularVelocity = (angle - previousAngle) / TIME_STEP;
                    } else {
                        const acceleration = -(GRAVITY / PENDULUM_LENGTH) * Math.sin(angle) - DAMPING * angularVelocity;
                        angularVelocity += acceleration * TIME_STEP;
                        angle += angularVelocity * TIME_STEP;
                        if (Math.abs(angle) < 0.0001 && Math.abs(angularVelocity) < 0.0001) {
                            angle = 0;
                            angularVelocity = 0;
                        }
                    }
                    accumulator -= TIME_STEP;
                }
            }
            if (!paused || needsRender) {
                updateVisuals();
                renderer.render(scene, camera);
                needsRender = false;
            }
        }
        request = requestAnimationFrame(render);
    }
    function resize(): void {
        const width = host.clientWidth;
        const height = canvas!.clientHeight;
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width / height < 0.63 ? 12 : 10.5;
        camera.updateProjectionMatrix();
        const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
        let low = 0;
        let high = 0.55;
        for (let i = 0; i < 24; i++) {
            const candidate = (low + high) / 2;
            const extent = (PENDULUM_LENGTH + BADGE.anchorY + 0.18) * Math.sin(candidate) + BADGE.width / 2 * Math.cos(candidate);
            if (extent < halfWidth - 0.16) low = candidate; else high = candidate;
        }
        maximumAngle = Math.max(0.015, low);
        angle = THREE.MathUtils.clamp(angle, -maximumAngle, maximumAngle);
        boundVelocity();
        needsRender = true;
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; previousTime = performance.now(); if (!visible) release(); }, { threshold: 0.01 });
    visibilityObserver.observe(host);
    reduced.addEventListener('change', event => setPaused(event.matches));
    resize();
    reset();
    if (!paused) kick(0.07);
    updateVisuals();
    renderer.render(scene, camera);
    host.dataset.badgeState = 'ready';
    host.classList.add('is-ready');
    announce('3D badge ready. Drag to swing, or use the arrow keys.');
    request = requestAnimationFrame(render);

    async function exportModel(): Promise<void> {
        const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js');
        const model = new THREE.Group();
        model.name = 'Nattapart physics badge';
        model.add(badge.clone());
        ribbons.forEach(strip => {
            const strap = strip.mesh.clone();
            strap.geometry = strip.mesh.geometry.clone();
            model.add(strap);
        });
        model.position.set(-badge.position.x, -badge.position.y, -badge.position.z);
        const buffer = await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: true });
        if (!(buffer instanceof ArrayBuffer)) return;
        const url = URL.createObjectURL(new Blob([buffer], { type: 'model/gltf-binary' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'nattapart-badge.glb';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        announce('Badge model exported with the real photo embedded.');
    }
    host.querySelector('[data-badge-export]')?.addEventListener('click', () => { void exportModel(); });
    host.addEventListener('badge-export', () => { void exportModel(); });
    window.addEventListener('pagehide', () => {
        destroyed = true;
        cancelAnimationFrame(request);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        renderer.dispose();
        environment.dispose();
        [front, back, fabric].forEach(texture => texture.dispose());
    }, { once: true });
}
