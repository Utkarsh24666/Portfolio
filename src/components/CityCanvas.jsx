import { Component, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera, useProgress } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { cameraStops, destinations } from "../data/portfolio";
import { CityWorld } from "./CityWorld";

function SceneLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="scene-loader" role="status">
        <span className="loader-mark">UC</span>
        <span>BUILDING THE CITY · {Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

function CameraRig({ activeId }) {
  const camera = useThree((state) => state.camera);
  const point = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3(...cameraStops[0].target));
  const reducedMotion = useReducedMotion();
  const stop = useMemo(
    () => cameraStops[destinations.findIndex((destination) => destination.id === activeId)] || cameraStops[0],
    [activeId],
  );
  useFrame((_, delta) => {
    const easing = 1 - Math.exp(-delta * 0.72);
    point.current.set(...stop.position);
    if (reducedMotion) {
      camera.position.copy(point.current);
      lookAt.current.set(...stop.target);
    } else {
      camera.position.lerp(point.current, easing);
      point.current.set(...stop.target);
      lookAt.current.lerp(point.current, easing);
    }
    camera.lookAt(lookAt.current);
  });
  return null;
}

class SceneErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("The 3D city could not be rendered.", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="scene-fallback" role="status">
          <span className="scene-fallback__grid" />
          <p>THE CITY IS RESTING</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function CityCanvas({ activeId, onSelect }) {
  return (
    <SceneErrorBoundary>
      <Canvas
        className="city-canvas"
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        fallback={
          <div className="scene-fallback" role="status">
            <span className="scene-fallback__grid" />
            <p>THE CITY IS RESTING</p>
          </div>
        }
      >
        <PerspectiveCamera makeDefault position={cameraStops[0].position} fov={52} />
        <Suspense fallback={<SceneLoader />}>
          <CameraRig activeId={activeId} />
          <CityWorld activeId={activeId} onSelect={onSelect} />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  );
}
