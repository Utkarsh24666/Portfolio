import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const GOLD = "#c6a875";
const CORE_GRID = [-90, -60, -30, 0, 30, 60, 90];
const ROAD_GRID = [-75, -45, -15, 15, 45, 75];
const ROUTE_ANCHORS = [
  { id: "arrival", x: 30, z: 30, height: 92, shape: "stepped" },
  { id: "finance", x: -60, z: -30, height: 104, shape: "tapered" },
  { id: "data", x: 60, z: -30, height: 82, shape: "crown" },
  { id: "strategy", x: 60, z: 60, height: 88, shape: "spire" },
  { id: "creative", x: -60, z: 60, height: 73, shape: "round" },
  { id: "journey", x: 30, z: -90, height: 78, shape: "stepped" },
  { id: "archive", x: 90, z: 30, height: 70, shape: "tapered" },
  { id: "connection", x: -90, z: -30, height: 84, shape: "crown" },
];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function tint(random, hueBase = 0.55) {
  return new THREE.Color().setHSL(
    hueBase + (random() - 0.5) * 0.065,
    0.13 + random() * 0.13,
    0.16 + random() * 0.1,
  ).getStyle();
}

function makeCoreBuildings() {
  const random = seededRandom(841);
  const ordinaryShapes = ["straight", "stepped", "crown", "tapered", "round"];
  const buildings = [];
  for (const x of CORE_GRID) {
    for (const z of CORE_GRID) {
      if (x === 0 && z === 0) continue;
      const route = ROUTE_ANCHORS.find((anchor) => anchor.x === x && anchor.z === z);
      buildings.push({
        x,
        z,
        width: route ? 19 + random() * 3 : 16 + random() * 7,
        depth: route ? 19 + random() * 3 : 16 + random() * 7,
        height: route ? route.height : 24 + random() * 53,
        shape: route ? route.shape : ordinaryShapes[Math.floor(random() * ordinaryShapes.length)],
        color: tint(random, route ? 0.56 : 0.54),
        routeId: route?.id,
      });
    }
  }
  return buildings;
}

function makeDistantBuildings() {
  const random = seededRandom(9182);
  const buildings = [];
  for (let x = -270; x <= 270; x += 27) {
    for (let z = -270; z <= 270; z += 27) {
      if (Math.max(Math.abs(x), Math.abs(z)) < 135 || random() < 0.22) continue;
      const height = 22 + random() * 82;
      buildings.push({
        position: [x + (random() - 0.5) * 9, height / 2, z + (random() - 0.5) * 9],
        scale: [10 + random() * 12, height, 10 + random() * 12],
        color: tint(random, 0.57),
      });
    }
  }
  return buildings;
}

function InstancedField({ items, geometry, material, castShadow = false, receiveShadow = false }) {
  const mesh = useRef(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const transform = new THREE.Object3D();
    const color = new THREE.Color();
    items.forEach((item, index) => {
      transform.position.set(...item.position);
      transform.scale.set(...item.scale);
      transform.rotation.set(...(item.rotation || [0, 0, 0]));
      transform.updateMatrix();
      mesh.current.setMatrixAt(index, transform.matrix);
      if (item.color) mesh.current.setColorAt(index, color.set(item.color));
    });
    mesh.current.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [items]);

  if (!items.length) return null;
  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, items.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
}

function buildingParts(buildings) {
  const boxes = [];
  const tapered = [];
  const cylinders = [];
  const windows = [];
  const mullions = [];
  const anchors = [];

  buildings.forEach((building) => {
    const { x, z, width, depth, height, shape, color, routeId } = building;
    boxes.push({ position: [x, 1, z], scale: [width + 2.4, 2, depth + 2.4], color: "#34383a" });

    if (shape === "tapered") {
      tapered.push({ position: [x, height / 2 + 1, z], scale: [width, height, depth], color });
    } else if (shape === "round") {
      cylinders.push({ position: [x, height / 2 + 1, z], scale: [width / 1.65, height, depth / 1.65], color });
    } else if (shape === "stepped") {
      const tiers = [
        { fraction: 0.54, width: 1, start: 0 },
        { fraction: 0.27, width: 0.82, start: 0.54 },
        { fraction: 0.19, width: 0.62, start: 0.81 },
      ];
      tiers.forEach((tier) => {
        const tierHeight = height * tier.fraction;
        boxes.push({
          position: [x, tier.start * height + tierHeight / 2 + 2, z],
          scale: [width * tier.width, tierHeight, depth * tier.width],
          color,
        });
      });
    } else {
      const mainHeight = shape === "crown" || shape === "spire" ? height * 0.84 : height;
      boxes.push({
        position: [x, mainHeight / 2 + 2, z],
        scale: [width, mainHeight, depth],
        color,
      });
      if (shape === "crown") {
        boxes.push({
          position: [x, height * 0.93 + 2, z],
          scale: [width * 0.66, height * 0.16, depth * 0.66],
          color: "#839295",
        });
      }
      if (shape === "spire") {
        boxes.push({
          position: [x, height * 0.91 + 2, z],
          scale: [width * 0.64, height * 0.16, depth * 0.64],
          color: "#798689",
        });
        tapered.push({
          position: [x, height + 12, z],
          scale: [2.4, 22, 2.4],
          color: "#a89570",
        });
      }
    }

    if (routeId) {
      anchors.push({ ...building, roofHeight: height + (shape === "spire" ? 22 : 0) + 2 });
      boxes.push({
        position: [x, 4, z],
        scale: [width * 0.54, 4, depth * 0.54],
        color: "#414647",
      });
    }

    if (shape === "round") return;
    const columns = Math.max(4, Math.floor(width / 2.75));
    const glazedHeight = shape === "crown" || shape === "spire" ? height * 0.84 : height;
    const floors = Math.floor((glazedHeight - 5) / 4.1);
    for (let floor = 0; floor < floors; floor += 1) {
      const y = 4 + floor * 4.1;
      const inset = shape === "stepped" && y > height * 0.54
        ? y > height * 0.81 ? 0.62 : 0.82
        : 1;
      for (let column = 0; column < columns; column += 1) {
        if ((column * 7 + floor * 3 + Math.round(x + z)) % 5 === 0) continue;
        const offsetX = -width * inset / 2 + ((column + 0.5) * width * inset) / columns;
        const warm = (column + floor + Math.round(x * 2 - z)) % 4 === 0;
        const color = warm ? "#d9bd86" : "#b2c4c6";
        const window = (position, rotation) => windows.push({
          position,
          scale: [0.92, 1.48, 0.075],
          rotation: [0, rotation, 0],
          color,
        });
        window([x + offsetX, y, z + depth * inset / 2 + 0.06], 0);
        window([x + offsetX, y, z - depth * inset / 2 - 0.06], Math.PI);

        const offsetZ = -depth * inset / 2 + ((column + 0.5) * depth * inset) / columns;
        window([x + width * inset / 2 + 0.06, y, z + offsetZ], Math.PI / 2);
        window([x - width * inset / 2 - 0.06, y, z + offsetZ], -Math.PI / 2);
      }
    }

    const finCount = Math.max(3, Math.floor(width / 5));
    for (let fin = 0; fin <= finCount; fin += 1) {
      const offsetX = -width / 2 + (fin * width) / finCount;
      mullions.push({
        position: [x + offsetX, height / 2 + 1, z + depth / 2 + 0.1],
        scale: [0.13, height - 2, 0.12],
        color: "#7b898a",
      });
    }
  });

  return { boxes, tapered, cylinders, windows, mullions, anchors };
}

function CityBuildings({ activeId, onSelect }) {
  const buildings = useMemo(makeCoreBuildings, []);
  const parts = useMemo(() => buildingParts(buildings), [buildings]);
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const taperGeometry = useMemo(() => new THREE.CylinderGeometry(0.52, 0.76, 1, 8, 1), []);
  const roundGeometry = useMemo(() => new THREE.CylinderGeometry(0.5, 0.62, 1, 20, 1), []);
  const windowGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const finGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const shellMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.72,
      roughness: 0.27,
      clearcoat: 0.82,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.25,
    }),
    [],
  );
  const windowMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ffffff",
      emissiveIntensity: 0.72,
      roughness: 0.28,
      metalness: 0.18,
    }),
    [],
  );
  const finMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#758385",
      metalness: 0.78,
      roughness: 0.24,
      envMapIntensity: 1.4,
    }),
    [],
  );

  return (
    <>
      <InstancedField items={parts.boxes} geometry={boxGeometry} material={shellMaterial} castShadow receiveShadow />
      <InstancedField items={parts.tapered} geometry={taperGeometry} material={shellMaterial} castShadow receiveShadow />
      <InstancedField items={parts.cylinders} geometry={roundGeometry} material={shellMaterial} castShadow receiveShadow />
      <InstancedField items={parts.windows} geometry={windowGeometry} material={windowMaterial} />
      <InstancedField items={parts.mullions} geometry={finGeometry} material={finMaterial} />
      {parts.anchors.map((anchor) => (
        <Landmark key={anchor.routeId} anchor={anchor} active={activeId === anchor.routeId} onSelect={onSelect} />
      ))}
    </>
  );
}

function Landmark({ anchor, active, onSelect }) {
  return (
    <group
      position={[anchor.x, anchor.roofHeight, anchor.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(anchor.routeId);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.14, 0.24, 6.4, 8]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={active ? 1.7 : 0.8} metalness={0.72} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.09, 6, 20]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.82} />
      </mesh>
      {active && <pointLight position={[0, 2, 0]} color={GOLD} intensity={16} distance={45} decay={2} />}
    </group>
  );
}

function makeDistantGeometry() {
  const buildings = makeDistantBuildings();
  return { buildings, geometry: new THREE.BoxGeometry(1, 1, 1) };
}

function DistantSkyline() {
  const { buildings, geometry } = useMemo(makeDistantGeometry, []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#ffffff",
      metalness: 0.48,
      roughness: 0.52,
      envMapIntensity: 0.55,
    }),
    [],
  );
  return <InstancedField items={buildings} geometry={geometry} material={material} />;
}

function EnvironmentMap() {
  const scene = useThree((state) => state.scene);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    const sky = context.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#05070b");
    sky.addColorStop(0.42, "#14202a");
    sky.addColorStop(0.63, "#344047");
    sky.addColorStop(0.72, "#242624");
    sky.addColorStop(1, "#050708");
    context.fillStyle = sky;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const random = seededRandom(2217);
    for (let index = 0; index < 280; index += 1) {
      const x = random() * canvas.width;
      const y = 304 + random() * 124;
      const width = 2 + random() * 8;
      const height = 6 + random() * 40;
      context.fillStyle = `rgba(8, 12, 14, ${0.42 + random() * 0.42})`;
      context.fillRect(x, y, width, height);
      for (let row = y + 6; row < y + height - 4; row += 7) {
        if (random() < 0.22) continue;
        context.fillStyle = random() < 0.77
          ? "rgba(214, 181, 120, .72)"
          : "rgba(187, 211, 221, .58)";
        context.fillRect(x + 2, row, Math.max(1, width - 4), 2);
      }
    }

    const glow = context.createRadialGradient(512, 333, 6, 512, 333, 210);
    glow.addColorStop(0, "rgba(198, 168, 117, .26)");
    glow.addColorStop(1, "rgba(198, 168, 117, 0)");
    context.fillStyle = glow;
    context.fillRect(300, 150, 424, 340);

    const environment = new THREE.CanvasTexture(canvas);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    environment.needsUpdate = true;
    return environment;
  }, []);

  useEffect(() => {
    const previousEnvironment = scene.environment;
    scene.environment = texture;
    scene.environmentIntensity = 1.1;
    return () => {
      scene.environment = previousEnvironment;
    };
  }, [scene, texture]);

  return null;
}

function createAsphaltTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.fillStyle = "#252a2c";
  context.fillRect(0, 0, 256, 256);
  const random = seededRandom(571);
  for (let index = 0; index < 1800; index += 1) {
    const shade = Math.floor(35 + random() * 38);
    context.fillStyle = `rgba(${shade}, ${shade + 4}, ${shade + 5}, ${random() * 0.34})`;
    context.fillRect(random() * 256, random() * 256, 1 + random() * 3, 1 + random() * 2);
  }
  for (let index = 0; index < 30; index += 1) {
    context.strokeStyle = `rgba(171, 183, 181, ${random() * 0.12})`;
    context.lineWidth = 1;
    context.beginPath();
    const x = random() * 256;
    const y = random() * 256;
    context.moveTo(x, y);
    context.lineTo(x + random() * 70, y + random() * 10);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 18);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function RoadNetwork() {
  const asphalt = useMemo(createAsphaltTexture, []);
  const roadMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#9da8aa",
      map: asphalt,
      metalness: 0.48,
      roughness: 0.27,
      envMapIntensity: 1.35,
    }),
    [asphalt],
  );
  const edgeMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#4b5252", metalness: 0.45, roughness: 0.38 }),
    [],
  );
  const roadPieces = [];
  const markings = [];
  ROAD_GRID.forEach((lane) => {
    roadPieces.push(
      <mesh key={`vertical-road-${lane}`} rotation={[-Math.PI / 2, 0, 0]} position={[lane, 0.12, 0]} receiveShadow>
        <planeGeometry args={[8.4, 230]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>,
      <mesh key={`horizontal-road-${lane}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.13, lane]} receiveShadow>
        <planeGeometry args={[230, 8.4]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>,
    );
    for (let distance = -108; distance <= 108; distance += 18) {
      markings.push(
        { position: [distance, 0.15, lane], scale: [5.2, 0.035, 0.2], color: "#b8b2a1" },
        { position: [lane, 0.16, distance], scale: [5.2, 0.035, 0.2], rotation: [0, Math.PI / 2, 0], color: "#b8b2a1" },
      );
    }
  });

  const dashGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const dashMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#514b3d", emissiveIntensity: 0.22, roughness: 0.46 }),
    [],
  );

  return (
    <group>
      {roadPieces}
      <InstancedField items={markings} geometry={dashGeometry} material={dashMaterial} />
      {ROAD_GRID.map((lane) => (
        <group key={`curb-${lane}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[lane + 5.2, 0.08, 0]}>
            <planeGeometry args={[0.72, 230]} />
            <primitive object={edgeMaterial} attach="material" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, lane + 5.2]}>
            <planeGeometry args={[230, 0.72]} />
            <primitive object={edgeMaterial} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ElevatedHighways() {
  const supportGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const supportMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#41484a", metalness: 0.72, roughness: 0.3 }),
    [],
  );
  const deckMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#394145", metalness: 0.58, roughness: 0.28, envMapIntensity: 1.2 }),
    [],
  );
  const railMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#8c8066", metalness: 0.8, roughness: 0.23 }),
    [],
  );
  const supports = [];
  for (let distance = -105; distance <= 105; distance += 30) {
    if (Math.abs(distance) > 10) {
      supports.push({ position: [distance, 6, -15], scale: [1.8, 12, 1.8] });
    }
    supports.push({ position: [15, 4.25, distance], scale: [1.8, 8.5, 1.8] });
  }

  return (
    <group>
      <InstancedField items={supports} geometry={supportGeometry} material={supportMaterial} castShadow />
      <mesh position={[0, 12, -15]} castShadow receiveShadow>
        <boxGeometry args={[230, 0.85, 12]} />
        <primitive object={deckMaterial} attach="material" />
      </mesh>
      <mesh position={[15, 8.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 0.85, 210]} />
        <primitive object={deckMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 12.52, -20.8]}>
        <boxGeometry args={[230, 0.65, 0.32]} />
        <primitive object={railMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 12.52, -9.2]}>
        <boxGeometry args={[230, 0.65, 0.32]} />
        <primitive object={railMaterial} attach="material" />
      </mesh>
      <mesh position={[-82, 6, -15]} rotation={[0, 0, 0.27]} castShadow>
        <boxGeometry args={[45, 0.72, 10]} />
        <primitive object={deckMaterial} attach="material" />
      </mesh>
      <mesh position={[82, 6, -15]} rotation={[0, 0, -0.27]} castShadow>
        <boxGeometry args={[45, 0.72, 10]} />
        <primitive object={deckMaterial} attach="material" />
      </mesh>
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={index}
          position={[0, 12.46, -18.2 + index * 2.15]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[220, 0.08]} />
          <meshBasicMaterial color={index === 0 || index === 3 ? GOLD : "#b9b8ac"} transparent opacity={0.42} />
        </mesh>
      ))}
      <mesh position={[9.2, 8.97, 0]}>
        <boxGeometry args={[0.35, 0.42, 210]} />
        <primitive object={railMaterial} attach="material" />
      </mesh>
      <mesh position={[20.8, 8.97, 0]}>
        <boxGeometry args={[0.35, 0.42, 210]} />
        <primitive object={railMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function StreetLights() {
  const lights = useMemo(() => {
    const poles = [];
    const arms = [];
    const bulbs = [];
    ROAD_GRID.forEach((lane) => {
      for (let distance = -90; distance <= 90; distance += 45) {
        for (const side of [-1, 1]) {
          const x = lane + side * 5.2;
          const z = distance;
          poles.push({ position: [x, 3.8, z], scale: [0.2, 7.6, 0.2] });
          arms.push({ position: [lane + side * 4.5, 7.35, z], scale: [1.4, 0.13, 0.14] });
          bulbs.push({ position: [lane + side * 3.9, 7.15, z], scale: [0.42, 0.18, 0.18] });

          const hz = lane + side * 5.2;
          const hx = distance;
          poles.push({ position: [hx, 3.8, hz], scale: [0.2, 7.6, 0.2] });
          arms.push({ position: [hx, 7.35, lane + side * 4.5], scale: [0.14, 0.13, 1.4] });
          bulbs.push({ position: [hx, 7.15, lane + side * 3.9], scale: [0.18, 0.18, 0.42] });
        }
      }
    });
    return { poles, arms, bulbs };
  }, []);
  const poleGeometry = useMemo(() => new THREE.CylinderGeometry(0.5, 0.7, 1, 7), []);
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const bulbGeometry = useMemo(() => new THREE.SphereGeometry(0.5, 8, 6), []);
  const poleMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#404849", metalness: 0.76, roughness: 0.28 }),
    [],
  );
  const bulbMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#f0d7a4", toneMapped: false }),
    [],
  );

  return (
    <>
      <InstancedField items={lights.poles} geometry={poleGeometry} material={poleMaterial} />
      <InstancedField items={lights.arms} geometry={boxGeometry} material={poleMaterial} />
      <InstancedField items={lights.bulbs} geometry={bulbGeometry} material={bulbMaterial} />
      <pointLight position={[-42, 8, -15]} color="#c6a875" intensity={32} distance={62} decay={2} />
      <pointLight position={[42, 8, 45]} color="#c6a875" intensity={24} distance={56} decay={2} />
      <pointLight position={[0, 8, -75]} color="#94aeb9" intensity={26} distance={65} decay={2} />
    </>
  );
}

function MovingCar({ index }) {
  const group = useRef(null);
  const direction = index % 2 === 0 ? 1 : -1;
  const horizontal = index >= 6;
  const lane = [-75, -45, -15, 15, 45, 75][index % 6];
  const speed = 5 + (index % 3) * 1.6;
  const bodyColor = ["#9f8358", "#51646a", "#465052", "#8d8a80"][index % 4];

  useFrame(({ clock }) => {
    if (!group.current) return;
    const coordinate = ((clock.elapsedTime * speed * direction + index * 37 + 115) % 230) - 115;
    group.current.position.set(
      horizontal ? coordinate : lane + (index % 2 ? 1.55 : -1.55),
      0.76,
      horizontal ? lane + (index % 2 ? 1.55 : -1.55) : coordinate,
    );
  });

  return (
    <group ref={group} rotation={[0, (horizontal ? Math.PI / 2 : 0) + (direction < 0 ? Math.PI : 0), 0]}>
      <mesh castShadow>
        <boxGeometry args={[2, 0.68, 4.1]} />
        <meshPhysicalMaterial color={bodyColor} metalness={0.72} roughness={0.24} clearcoat={0.9} />
      </mesh>
      <mesh position={[0, 0.48, -0.16]} castShadow>
        <boxGeometry args={[1.58, 0.58, 1.95]} />
        <meshPhysicalMaterial color="#263338" metalness={0.56} roughness={0.16} clearcoat={1} />
      </mesh>
      {[-0.66, 0.66].map((x) => [-1.32, 1.32].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, -0.18, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.43, 0.43, 0.26, 12]} />
          <meshStandardMaterial color="#111415" metalness={0.45} roughness={0.66} />
        </mesh>
      )))}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.05, 2.07]}>
          <boxGeometry args={[0.28, 0.12, 0.045]} />
          <meshBasicMaterial color="#f5e1b5" toneMapped={false} />
        </mesh>
      ))}
      {[-0.62, 0.62].map((x) => (
        <mesh key={`rear-${x}`} position={[x, 0.05, -2.07]}>
          <boxGeometry args={[0.28, 0.12, 0.045]} />
          <meshBasicMaterial color="#a44f37" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Skybridges() {
  const material = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: "#53646a",
      metalness: 0.66,
      roughness: 0.19,
      clearcoat: 0.95,
      transparent: true,
      opacity: 0.84,
      envMapIntensity: 1.7,
    }),
    [],
  );
  const bridges = [
    { position: [-45, 36, -60], scale: [15, 2.8, 5] },
    { position: [45, 41, 60], scale: [15, 2.8, 5] },
    { position: [30, 30, -45], scale: [5, 2.4, 15] },
    { position: [-30, 33, 45], scale: [5, 2.4, 15] },
  ];
  return bridges.map((bridge, index) => (
    <mesh key={index} position={bridge.position} scale={bridge.scale} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  ));
}

export function CityWorld({ activeId, onSelect }) {
  const reducedMotion = useReducedMotion();

  const groundMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#14191b", roughness: 0.88, metalness: 0.12 }),
    [],
  );
  const ground = useMemo(() => new THREE.PlaneGeometry(720, 720), []);

  return (
    <>
      <color attach="background" args={["#080b10"]} />
      <fog attach="fog" args={["#080b10", 135, 360]} />
      <EnvironmentMap />
      <ambientLight intensity={0.56} />
      <hemisphereLight args={["#c1ced0", "#10161a", 0.78]} />
      <directionalLight
        position={[-85, 145, 95]}
        intensity={2.25}
        color="#c7c7bd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={420}
        shadow-camera-left={-210}
        shadow-camera-right={210}
        shadow-camera-top={210}
        shadow-camera-bottom={-210}
      />
      <mesh
        geometry={ground}
        material={groundMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.16, 0]}
        receiveShadow
      />
      <DistantSkyline />
      <RoadNetwork />
      <ElevatedHighways />
      <CityBuildings activeId={activeId} onSelect={onSelect} />
      <Skybridges />
      <StreetLights />
      {!reducedMotion && Array.from({ length: 8 }, (_, index) => <MovingCar key={index} index={index} />)}
      {!reducedMotion && <Sparkles count={85} scale={[360, 55, 360]} size={1.35} speed={0.08} color="#c6a875" opacity={0.27} />}
    </>
  );
}
