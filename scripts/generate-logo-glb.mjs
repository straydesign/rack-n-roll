/**
 * Generate a 3D extruded GLB from the RacknRoll SVG logo.
 * Front/back faces keep logo colors; side edges get silver chrome.
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
// rack.svg classes: st2=#222020(dark), st3=#116743(green), st4=#fefefe(white)
const DEPTH = 10;
const GREEN = [0.05, 0.39, 0.25];
const LAYERS_CONFIG = {
  st4: { name: 'white',  color: GREEN, depth: DEPTH, zOffset: 0.5,  metallic: 1.0, roughness: 0.05 },
  st3: { name: 'green',  color: GREEN, depth: DEPTH, zOffset: 0,    metallic: 1.0, roughness: 0.05 },
  st2: { name: 'dark',   color: GREEN, depth: DEPTH, zOffset: -0.5, metallic: 1.0, roughness: 0.05 },
};

// Silver chrome for the extruded side edges
const SILVER = { color: [0.85, 0.85, 0.88], metallic: 1.0, roughness: 0.03 };

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
const svgFilePath = path.resolve('public/rack.svg');
const svgText = fs.readFileSync(svgFilePath, 'utf-8');

const pathsByClass = {};
let m;

const pathRegex = /<path\s+class="(\w+)"\s+d="([^"]+)"/g;
while ((m = pathRegex.exec(svgText)) !== null) {
  if (!pathsByClass[m[1]]) pathsByClass[m[1]] = [];
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

// ── SPLIT GEOMETRY BY MATERIAL GROUP ──
// ExtrudeGeometry creates groups: materialIndex 0 = front/back faces, 1 = side edges
function splitByGroup(geom) {
  const pos = geom.attributes.position;
  const norm = geom.attributes.normal;
  const idx = geom.index ? geom.index.array : null;

  const faceIndices = [];
  const sideIndices = [];

  for (const group of geom.groups) {
    const target = group.materialIndex === 0 ? faceIndices : sideIndices;
    for (let i = group.start; i < group.start + group.count; i++) {
      target.push(idx ? idx[i] : i);
    }
  }

  function makeGeomFromIndices(indices) {
    if (!indices.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', pos.clone());
    g.setAttribute('normal', norm.clone());
    g.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    return g;
  }

  return {
    faces: makeGeomFromIndices(faceIndices),
    sides: makeGeomFromIndices(sideIndices),
  };
}

// ── OUTLINE STROKE WIDTH (SVG units) ──
const OUTLINE_WIDTH = 6;

// ── BUILD LAYER GEOMETRIES (faces + sides + outline) ──
function buildLayerGeometries(paths, depth) {
  const faceGeometries = [];
  const sideGeometries = [];
  const outlineGeometries = [];
  let skipped = 0;

  for (const d of paths) {
    try {
      const shapes = svgPathToShapes(d);
      if (!shapes.length) { skipped++; continue; }

      // Main extrusion (green faces + silver sides)
      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1.5,
        bevelSegments: 3,
      });

      if (!geom.index) {
        const count = geom.attributes.position.count;
        const indices = new Uint32Array(count);
        for (let j = 0; j < count; j++) indices[j] = j;
        geom.setIndex(new THREE.BufferAttribute(indices, 1));
      }

      if (geom.attributes.position.count === 0) { skipped++; continue; }

      const { faces, sides } = splitByGroup(geom);
      if (faces) faceGeometries.push(faces);
      if (sides) sideGeometries.push(sides);
      geom.dispose();

      // Silver outline: same shapes but with big bevel, offset behind
      const outlineGeom = new THREE.ExtrudeGeometry(shapes, {
        depth: depth + 2,
        bevelEnabled: true,
        bevelThickness: OUTLINE_WIDTH,
        bevelSize: OUTLINE_WIDTH,
        bevelSegments: 2,
      });

      if (!outlineGeom.index) {
        const count = outlineGeom.attributes.position.count;
        const indices = new Uint32Array(count);
        for (let j = 0; j < count; j++) indices[j] = j;
        outlineGeom.setIndex(new THREE.BufferAttribute(indices, 1));
      }

      // Offset outline behind the main shape
      const oPos = outlineGeom.attributes.position.array;
      for (let i = 0; i < oPos.length; i += 3) oPos[i + 2] -= 1;

      if (outlineGeom.attributes.position.count > 0) {
        outlineGeometries.push(outlineGeom);
      }
    } catch {
      skipped++;
    }
  }

  console.log(`  Extruded ${faceGeometries.length}/${paths.length} (${skipped} skipped)`);

  const mergeParts = (geos) => {
    if (!geos.length) return null;
    const raw = mergeGeometries(geos, false);
    const merged = mergeVertices(raw, 0.01);
    geos.forEach(g => g.dispose());
    return merged;
  };

  return {
    faces: mergeParts(faceGeometries),
    sides: mergeParts(sideGeometries),
    outline: mergeParts(outlineGeometries),
  };
}

// ── BUILD ALL LAYERS ──
const layerResults = [];

for (const [cls, config] of Object.entries(LAYERS_CONFIG)) {
  const paths = pathsByClass[cls] || [];
  if (!paths.length) continue;
  console.log(`Building ${config.name} (${paths.length} paths, depth ${config.depth})...`);

  const { faces, sides, outline } = buildLayerGeometries(paths, config.depth);
  if (!faces && !sides && !outline) { console.warn(`  Failed: ${config.name}`); continue; }

  layerResults.push({ faces, sides, outline, config });
  const fv = faces ? faces.attributes.position.count : 0;
  const sv = sides ? sides.attributes.position.count : 0;
  const ov = outline ? outline.attributes.position.count : 0;
  console.log(`  ✓ ${config.name}: ${fv} face, ${sv} side, ${ov} outline verts`);
}

// ── GLOBAL CENTER + Y-FLIP ──
const globalBox = new THREE.Box3();
for (const { faces, sides, outline } of layerResults) {
  for (const geom of [faces, sides, outline]) {
    if (!geom) continue;
    geom.computeBoundingBox();
    globalBox.union(geom.boundingBox);
  }
}

const cx = (globalBox.max.x + globalBox.min.x) / 2;
const cy = (globalBox.max.y + globalBox.min.y) / 2;
const cz = (globalBox.max.z + globalBox.min.z) / 2;
console.log(`\nGlobal center: (${cx.toFixed(1)}, ${cy.toFixed(1)}, ${cz.toFixed(1)})`);

for (const { faces, sides, outline, config } of layerResults) {
  for (const geom of [faces, sides, outline]) {
    if (!geom) continue;
    geom.translate(-cx, -cy, -cz);

    const pos = geom.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) pos[i + 1] *= -1;

    if (config.zOffset) {
      for (let i = 0; i < pos.length; i += 3) pos[i + 2] += config.zOffset;
    }

    geom.computeVertexNormals();
  }
}

// ── EXPORT TO GLB ──
const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene();
const rootNode = doc.createNode('Logo');
scene.addChild(rootNode);

// Shared silver material for all side edges
const silverMat = doc.createMaterial('silver')
  .setBaseColorFactor([...SILVER.color, 1])
  .setMetallicFactor(SILVER.metallic)
  .setRoughnessFactor(SILVER.roughness);

for (const { faces, sides, outline, config } of layerResults) {
  const mesh = doc.createMesh(config.name);

  const makeAccessor = (arr, type) =>
    doc.createAccessor()
      .setArray(arr instanceof Float32Array ? arr : new Float32Array(arr))
      .setType(type)
      .setBuffer(buffer);

  // Front/back faces — logo color
  if (faces) {
    const pos = faces.attributes.position.array;
    const norm = faces.attributes.normal.array;
    const idx = faces.index.array;

    const facePrim = doc.createPrimitive()
      .setAttribute('POSITION', makeAccessor(pos, 'VEC3'))
      .setAttribute('NORMAL', makeAccessor(norm, 'VEC3'))
      .setIndices(doc.createAccessor().setArray(new Uint32Array(idx)).setType('SCALAR').setBuffer(buffer))
      .setMaterial(
        doc.createMaterial(`${config.name}-face`)
          .setBaseColorFactor([...config.color, 1])
          .setMetallicFactor(config.metallic)
          .setRoughnessFactor(config.roughness));

    mesh.addPrimitive(facePrim);
    console.log(`  → ${config.name} faces: ${idx.length / 3} tris`);
  }

  // Side edges — silver chrome
  if (sides) {
    const pos = sides.attributes.position.array;
    const norm = sides.attributes.normal.array;
    const idx = sides.index.array;

    const sidePrim = doc.createPrimitive()
      .setAttribute('POSITION', makeAccessor(pos, 'VEC3'))
      .setAttribute('NORMAL', makeAccessor(norm, 'VEC3'))
      .setIndices(doc.createAccessor().setArray(new Uint32Array(idx)).setType('SCALAR').setBuffer(buffer))
      .setMaterial(silverMat);

    mesh.addPrimitive(sidePrim);
    console.log(`  → ${config.name} sides: ${idx.length / 3} tris (silver)`);
  }

  // Silver outline behind the shape
  if (outline) {
    const pos = outline.attributes.position.array;
    const norm = outline.attributes.normal.array;
    const idx = outline.index.array;

    const outlinePrim = doc.createPrimitive()
      .setAttribute('POSITION', makeAccessor(pos, 'VEC3'))
      .setAttribute('NORMAL', makeAccessor(norm, 'VEC3'))
      .setIndices(doc.createAccessor().setArray(new Uint32Array(idx)).setType('SCALAR').setBuffer(buffer))
      .setMaterial(silverMat);

    mesh.addPrimitive(outlinePrim);
    console.log(`  → ${config.name} outline: ${idx.length / 3} tris (silver)`);
  }

  rootNode.addChild(doc.createNode(config.name).setMesh(mesh));
}

const io = new NodeIO();
const glb = await io.writeBinary(doc);
const outPath = path.resolve('public/images/logo.glb');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(glb));
console.log(`\n✓ ${outPath} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
