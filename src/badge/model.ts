import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const BADGE = { width: 2.32, height: 3.5, anchorY: 2.04 } as const;

/** Actual modeled parts: holder, printed card, transparent cover and metal clasp. */
export function createBadge(front?: THREE.Texture, back?: THREE.Texture): THREE.Group {
    const badge = new THREE.Group();
    badge.name = 'Nattapart ID badge';
    const graphite = new THREE.MeshStandardMaterial({ color: '#3d4141', roughness: 0.56, metalness: 0.2 });
    const edge = new THREE.MeshStandardMaterial({ color: '#232929', roughness: 0.46, metalness: 0.22 });
    const chrome = new THREE.MeshStandardMaterial({ color: '#e2e4e0', roughness: 0.22, metalness: 0.96 });
    const holder = new THREE.Mesh(new RoundedBoxGeometry(BADGE.width, BADGE.height, 0.145, 4, 0.12), graphite);
    holder.name = 'Rounded graphite holder';
    holder.castShadow = true;
    holder.receiveShadow = true;
    badge.add(holder);

    const innerLip = new THREE.Mesh(new RoundedBoxGeometry(2.14, 3.16, 0.07, 3, 0.08), edge);
    innerLip.position.set(0, -0.075, 0.084);
    innerLip.name = 'Inset black lip';
    badge.add(innerLip);

    const print = new THREE.Mesh(new THREE.PlaneGeometry(2.015, 3.02), new THREE.MeshBasicMaterial({ map: front ?? null, color: '#ffffff', toneMapped: false }));
    print.position.set(0, -0.075, 0.124);
    print.name = 'Front print — exact original photo crop';
    badge.add(print);
    const rear = new THREE.Mesh(new THREE.PlaneGeometry(2.09, 3.16), new THREE.MeshBasicMaterial({ map: back ?? null, color: '#ffffff', toneMapped: false }));
    rear.rotation.y = Math.PI;
    rear.position.set(0, -0.05, -0.079);
    rear.name = 'Back print';
    badge.add(rear);

    const clear = new THREE.Mesh(new RoundedBoxGeometry(2.1, 3.12, 0.012, 3, 0.065), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.025, roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, depthWrite: false }));
    clear.position.set(0, -0.075, 0.138);
    clear.name = 'Clear plastic cover';
    badge.add(clear);

    const slot = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.125, 0.03, 3, 0.04), edge);
    slot.position.set(0, 1.57, 0.082);
    slot.name = 'Lanyard slot';
    badge.add(slot);

    const clip = new THREE.Mesh(new RoundedBoxGeometry(0.265, 0.63, 0.065, 3, 0.038), chrome);
    clip.position.set(0, 1.82, 0.13);
    clip.rotation.x = -0.16;
    clip.name = 'Chrome spring clasp';
    clip.castShadow = true;
    badge.add(clip);
    const clipSeam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.01), edge);
    clipSeam.position.set(0, 1.64, 0.167);
    badge.add(clipSeam);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.026, 10, 36), chrome);
    ring.position.set(0, 2.145, 0.05);
    ring.scale.y = 0.82;
    ring.name = 'Metal lanyard ring';
    ring.castShadow = true;
    badge.add(ring);
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.049, 16, 12), chrome);
    rivet.position.set(0, 2.03, 0.176);
    rivet.scale.z = 0.45;
    badge.add(rivet);
    return badge;
}

export function createFabricTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas texture is unavailable');
    ctx.fillStyle = '#ae633b';
    ctx.fillRect(0, 0, 128, 256);
    for (let y = 0; y < 256; y += 4) {
        ctx.fillStyle = y % 8 === 0 ? '#c98552' : '#96532f';
        ctx.fillRect(0, y, 128, 1);
    }
    for (let x = 0; x < 128; x += 3) {
        ctx.fillStyle = 'rgba(60,27,12,.15)';
        ctx.fillRect(x, 0, 1, 256);
    }
    ctx.fillStyle = '#6f381e';
    ctx.fillRect(5, 0, 2, 256);
    ctx.fillRect(120, 0, 2, 256);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 3);
    texture.anisotropy = 8;
    return texture;
}
