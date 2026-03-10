/**
 * Generate a 3D extruded GLB from the RacknRoll SVG logo.
 * Follows the 3d-logo skill pattern: svgPathToShapes() wrapping individual
 * d="" strings in minimal SVGs for reliable parsing.
 *
 * Usage: node scripts/generate-logo-glb.mjs
 */

import { JSDOM } from 'jsdom';

// DOM globals needed by SVGLoader
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
const LAYER_DEPTH = 10;
const ACCENT_DEPTH = 5;

const LAYERS_CONFIG = {
  st2: { name: 'cream',  color: [0.91, 0.96, 0.91], depth: ACCENT_DEPTH },
  st1: { name: 'green',  color: [0.13, 0.77, 0.37], depth: LAYER_DEPTH },
  st0: { name: 'dark',   color: [0.10, 0.10, 0.10], depth: LAYER_DEPTH },
};

// ── SVG PATH → THREE.js SHAPES (skill pattern) ──
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

// Convert polygon points="x1 y1 x2 y2 ..." to a path d string
function polygonPointsToD(points) {
  const nums = points.trim().split(/[\s,]+/).map(Number);
  const pairs = [];
  for (let i = 0; i < nums.length; i += 2) {
    pairs.push([nums[i], nums[i + 1]]);
  }
  if (pairs.length === 0) return '';
  let d = `M ${pairs[0][0]} ${pairs[0][1]}`;
  for (let i = 1; i < pairs.length; i++) {
    d += ` L ${pairs[i][0]} ${pairs[i][1]}`;
  }
  d += ' Z';
  return d;
}

// ── READ & PARSE SVG ──
const svgFilePath = path.resolve('public/logo.svg');
const svgText = fs.readFileSync(svgFilePath, 'utf-8');

// Extract all path d="" values grouped by class
const pathsByClass = {};
const pathRegex = /<path\s+class="(\w+)"\s+d="([^"]+)"/g;
let m;
while ((m = pathRegex.exec(svgText)) !== null) {
  const cls = m[1];
  const d = m[2];
  if (!pathsByClass[cls]) pathsByClass[cls] = [];
  pathsByClass[cls].push(d);
}

// Extract polygon points grouped by class
const polyRegex = /<polygon\s+class="(\w+)"\s+points="([^"]+)"/g;
while ((m = polyRegex.exec(svgText)) !== null) {
  const cls = m[1];
  const d = polygonPointsToD(m[2]);
  if (d) {
    if (!pathsByClass[cls]) pathsByClass[cls] = [];
    pathsByClass[cls].push(d);
  }
}

console.log('Extracted SVG elements:');
for (const [cls, paths] of Object.entries(pathsByClass)) {
  console.log(`  ${cls}: ${paths.length} elements`);
}

// ── BUILD LAYERS ──
const LAYERS = Object.entries(LAYERS_CONFIG).map(([cls, config]) => ({
  ...config,
  paths: pathsByClass[cls] || [],
}));

// ── BUILD GEOMETRY FOR ONE LAYER (skill pattern) ──
function buildLayerGeometry(layer) {
  const geometries = [];
  let skipped = 0;

  for (const d of layer.paths) {
    try {
      const shapes = svgPathToShapes(d);
      if (shapes.length === 0) { skipped++; continue; }

      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth: layer.depth,
        bevelEnabled: true,
        bevelThickness: 1.5,
        bevelSize: 1,
        bevelSegments: 2,
      });

      // Ensure indexed
      if (!geom.index) {
        const count = geom.attributes.position.count;
        const indices = new Uint32Array(count);
        for (let j = 0; j < count; j++) indices[j] = j;
        geom.setIndex(new THREE.BufferAttribute(indices, 1));
      }

      if (geom.attributes.position.count > 0) {
        geometries.push(geom);
      }
    } catch {
      skipped++;
    }
  }

  if (geometries.length === 0) return null;
  console.log(`  Extruded ${geometries.length}/${layer.paths.length} (${skipped} skipped)`);

  // Merge and deduplicate
  const rawMerged = mergeGeometries(geometries, false);
  const merged = mergeVertices(rawMerged, 0.01);

  // Center
  merged.computeBoundingBox();
  const bb = merged.boundingBox;
  const cx = (bb.max.x + bb.min.x) / 2;
  const cy = (bb.max.y + bb.min.y) / 2;
  const cz = (bb.max.z + bb.min.z) / 2;
  merged.translate(-cx, -cy, -cz);

  // Flip Y (SVG top-down → 3D bottom-up)
  const pos = merged.attributes.position.array;
  for (let i = 0; i < pos.length; i += 3) pos[i + 1] *= -1;

  // Recompute normals after flip
  merged.computeVertexNormals();

  // Clean up individual geometries
  geometries.forEach(g => g.dispose());

  return merged;
}

// ── EXPORT TO GLB ──
const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene();
const rootNode = doc.createNode('Logo');
scene.addChild(rootNode);

for (const layer of LAYERS) {
  if (layer.paths.length === 0) continue;
  console.log(`Building ${layer.name} (${layer.paths.length} paths, depth ${layer.depth})...`);

  const geom = buildLayerGeometry(layer);
  if (!geom) { console.warn(`  Failed: ${layer.name}`); continue; }

  const pos = geom.attributes.position.array;
  const norm = geom.attributes.normal.array;
  const idx = geom.index.array;

  const mesh = doc.createMesh(layer.name);
  const prim = doc.createPrimitive()
    .setAttribute('POSITION',
      doc.createAccessor().setArray(new Float32Array(pos)).setType('VEC3').setBuffer(buffer))
    .setAttribute('NORMAL',
      doc.createAccessor().setArray(new Float32Array(norm)).setType('VEC3').setBuffer(buffer))
    .setIndices(
      doc.createAccessor().setArray(new Uint32Array(idx)).setType('SCALAR').setBuffer(buffer))
    .setMaterial(
      doc.createMaterial(layer.name)
        .setBaseColorFactor([...layer.color, 1])
        .setMetallicFactor(1.0)
        .setRoughnessFactor(0.05));

  mesh.addPrimitive(prim);
  rootNode.addChild(doc.createNode(layer.name).setMesh(mesh));
  console.log(`  ✓ ${layer.name}: ${pos.length / 3} verts, ${idx.length / 3} tris`);
}

const io = new NodeIO();
const glb = await io.writeBinary(doc);
const outPath = path.resolve('public/images/logo.glb');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(glb));
console.log(`\n✓ Wrote ${outPath} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
