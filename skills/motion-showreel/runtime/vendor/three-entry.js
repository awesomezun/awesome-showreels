import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
window.THREE = Object.assign({}, THREE, { addons: { RoundedBoxGeometry, RoomEnvironment, SVGLoader, Reflector, BufferGeometryUtils } });
