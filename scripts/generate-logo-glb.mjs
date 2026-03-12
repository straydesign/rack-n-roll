/**
 * Generate a 3D extruded GLB from the RacknRoll SVG logo.
 *
 * Usage: node scripts/generate-logo-glb.mjs
 */

import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;
globalThis.self = globalThis;

const THREE = await import('three');
const { SVGLoader } = await import('three/examples/jsm/loaders/SVGLoader.js');
const { mergeGeometries, mergeVertices } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
const { Document, NodeIO } = await import('@gltf-transform/core');

import fs from 'fs';
import path from 'path';

// ── CONFIG ──
// All layers same depth — stacked via zOffset so nothing clips
const DEPTH = 12;
const GREEN = [0.05, 0.39, 0.25];
const LAYERS_CONFIG = {
  st0: { name: 'logo', color: GREEN, depth: DEPTH, zOffset: 0, metallic: 1.0, roughness: 0.05 },
};

// ── SVG PATH → THREE.js SHAPES ──
function svgPathToShapes(d) {
  const loader = new SVGLoader();
  const paths = loader.parse(
    `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`
  ).paths;
  const shapes = [];
  for (const p of paths) {
    shapes.push(...p.toShapes(false));
  }
  return shapes;
}

function polygonPointsToD(points) {
  const nums = points.trim().split(/[\s,]+/).map(Number);
  const pairs = [];
  for (let i = 0; i < nums.length; i += 2) pairs.push([nums[i], nums[i + 1]]);
  if (!pairs.length) return '';
  return `M ${pairs[0][0]} ${pairs[0][1]}` +
    pairs.slice(1).map(([x, y]) => ` L ${x} ${y}`).join('') + ' Z';
}

// ── READ SVG ──
const svgFilePath = path.resolve('public/logo.svg');
const svgText = fs.readFileSync(svgFilePath, 'utf-8');

const pathsByClass = {};
let m;

const pathRegex = /<path\s+class="(\w+)"\s+d="([^"]+)"/g;
while ((m = pathRegex.exec(svgText)) !== null) {
  if (!pathsByClass[m[1]]) pathsByClass[m[1]] = [];
  // Strip the 825x825 border box if present (it's the SVG artboard outline)
  const d = m[2].replace(/^M825,0v825H0V0h825Z/, '');
  pathsByClass[m[1]].push(d);
}

const polyRegex = /<polygon\s+class="(\w+)"\s+points="([^"]+)"/g;
while ((m = polyRegex.exec(svgText)) !== null) {
  const d = polygonPointsToD(m[2]);
  if (d) {
    if (!pathsByClass[m[1]]) pathsByClass[m[1]] = [];
    pathsByClass[m[1]].push(d);
  }
}

console.log('SVG elements:');
for (const [cls, paths] of Object.entries(pathsByClass))
  console.log(`  ${cls}: ${paths.length}`);

// ── BUILD LAYER GEOMETRY (no centering — done globally later) ──
function buildLayerGeometry(paths, depth) {
  const geometries = [];
  let skipped = 0;

  for (const d of paths) {
    try {
      const shapes = svgPathToShapes(d);
      if (!shapes.length) { skipped++; continue; }

      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth,
        bevelEnabled: true,
        bevelThickness: 1.5,
        bevelSize: 1,
        bevelSegments: 2,
      });

      if (!geom.index) {
        const count = geom.attributes.position.count;
        const indices = new Uint32Array(count);
        for (let j = 0; j < count; j++) indices[j] = j;
        geom.setIndex(new THREE.BufferAttribute(indices, 1));
      }

      if (geom.attributes.position.count > 0) geometries.push(geom);
    } catch {
      skipped++;
    }
  }

  if (!geometries.length) return null;
  console.log(`  Extruded ${geometries.length}/${paths.length} (${skipped} skipped)`);

  const rawMerged = mergeGeometries(geometries, false);
  const merged = mergeVertices(rawMerged, 0.01);
  geometries.forEach(g => g.dispose());
  return merged;
}

// ── BUILD ALL LAYERS ──
const layerResults = [];

for (const [cls, config] of Object.entries(LAYERS_CONFIG)) {
  const paths = pathsByClass[cls] || [];
  if (!paths.length) continue;
  console.log(`Building ${config.name} (${paths.length} paths, depth ${config.depth})...`);

  const geom = buildLayerGeometry(paths, config.depth);
  if (!geom) { console.warn(`  Failed: ${config.name}`); continue; }

  layerResults.push({ geom, config });
  console.log(`  ✓ ${config.name}: ${geom.attributes.position.count} verts`);
}

// ── GLOBAL CENTER + Y-FLIP (all layers share the same transform) ──
// Compute global bounding box across ALL layers
const globalBox = new THREE.Box3();
for (const { geom } of layerResults) {
  geom.computeBoundingBox();
  globalBox.union(geom.boundingBox);
}

const cx = (globalBox.max.x + globalBox.min.x) / 2;
const cy = (globalBox.max.y + globalBox.min.y) / 2;
const cz = (globalBox.max.z + globalBox.min.z) / 2;
console.log(`\nGlobal center: (${cx.toFixed(1)}, ${cy.toFixed(1)}, ${cz.toFixed(1)})`);

for (const { geom, config } of layerResults) {
  // Center
  geom.translate(-cx, -cy, -cz);

  // Flip Y (SVG top-down → 3D bottom-up)
  const pos = geom.attributes.position.array;
  for (let i = 0; i < pos.length; i += 3) pos[i + 1] *= -1;

  // Apply Z-offset so layers stack front-to-back
  if (config.zOffset) {
    for (let i = 0; i < pos.length; i += 3) pos[i + 2] += config.zOffset;
  }

  // Recompute normals
  geom.computeVertexNormals();
}

// ── EXPORT TO GLB ──
const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene();
const rootNode = doc.createNode('Logo');
scene.addChild(rootNode);

for (const { geom, config } of layerResults) {
  const pos = geom.attributes.position.array;
  const norm = geom.attributes.normal.array;
  const idx = geom.index.array;

  const mesh = doc.createMesh(config.name);
  const prim = doc.createPrimitive()
    .setAttribute('POSITION',
      doc.createAccessor().setArray(new Float32Array(pos)).setType('VEC3').setBuffer(buffer))
    .setAttribute('NORMAL',
      doc.createAccessor().setArray(new Float32Array(norm)).setType('VEC3').setBuffer(buffer))
    .setIndices(
      doc.createAccessor().setArray(new Uint32Array(idx)).setType('SCALAR').setBuffer(buffer))
    .setMaterial(
      doc.createMaterial(config.name)
        .setBaseColorFactor([...config.color, 1])
        .setMetallicFactor(config.metallic)
        .setRoughnessFactor(config.roughness));

  mesh.addPrimitive(prim);
  rootNode.addChild(doc.createNode(config.name).setMesh(mesh));
  console.log(`  → ${config.name}: ${idx.length / 3} tris`);
}

const io = new NodeIO();
const glb = await io.writeBinary(doc);
const outPath = path.resolve('public/images/logo.glb');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(glb));
console.log(`\n✓ ${outPath} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
