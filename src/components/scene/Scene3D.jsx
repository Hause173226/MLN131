import { useRef, useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useStore } from "../../hooks/useStore";
import Diorama from "./Diorama";

/**
 * CameraRig — điều khiển camera tự động:
 *  - Khi đổi stage → bay tới góc nhìn đặc trưng của từng giai đoạn.
 *  - Khi click Hotspot → bay tới vị trí cụ thể (cameraTarget từ store).
 *  - Sau khi SidePanel đóng (cameraTarget = null) → reset về góc nhìn stage.
 */
function CameraRig() {
  const controlsRef = useRef();
  const currentStage = useStore((state) => state.currentStage);
  const cameraTarget = useStore((state) => state.cameraTarget);
  const { size } = useThree();
  const isMobile = size.width < 768;

  // Vị trí camera mặc định cho mỗi giai đoạn
  const STAGE_CAMERA = {
    0: { pos: [-8, isMobile ? 8 : 6, isMobile ? 18 : 12], target: [-4, 0, 0] },
    1: { pos: [0, isMobile ? 8 : 6, isMobile ? 20 : 14], target: [0, 0, 0] },
    2: { pos: [8, isMobile ? 8 : 6, isMobile ? 18 : 12], target: [4, 1, 0] },
  };

  useEffect(() => {
    if (!controlsRef.current) return;

    if (cameraTarget) {
      // Bay tới hotspot được click
      const { position, target } = cameraTarget;
      controlsRef.current.setLookAt(
        position[0],
        position[1],
        position[2],
        target[0],
        target[1],
        target[2],
        true, // animate
      );
    } else {
      // Reset về góc nhìn mặc định của stage
      const cam = STAGE_CAMERA[currentStage];
      controlsRef.current.setLookAt(
        cam.pos[0],
        cam.pos[1],
        cam.pos[2],
        cam.target[0],
        cam.target[1],
        cam.target[2],
        true,
      );
    }
  }, [currentStage, cameraTarget, isMobile]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={5}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.1}
    />
  );
}

/**
 * LightingAndEnvironment — ánh sáng + bầu trời thay đổi theo giai đoạn.
 * Stage 0 (thủ công): hoàng hôn ấm áp  → môi trường làng quê
 * Stage 1 (công nghiệp): ánh đèn trắng → môi trường đô thị xám
 * Stage 2 (4.0): ánh neon xanh cyan   → môi trường đêm / kỹ thuật số
 */
function LightingAndEnvironment() {
  const currentStage = useStore((state) => state.currentStage);

  return (
    <>
      {currentStage === 0 && (
        <>
          <ambientLight intensity={1.5} color="#ffd1a4" />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
          <Environment preset="sunset" />
          <color attach="background" args={["#2d1a0a"]} />
        </>
      )}

      {currentStage === 1 && (
        <>
          <ambientLight intensity={1} color="#ffffff" />
          <directionalLight position={[0, 15, 10]} intensity={2} castShadow />
          <Environment preset="city" />
          <color attach="background" args={["#495057"]} />
        </>
      )}

      {currentStage === 2 && (
        <>
          <ambientLight intensity={0.2} color="#1a0033" />
          <pointLight position={[0, 10, 0]} intensity={50} color="#00ffff" />
          <Environment preset="night" />
          <color attach="background" args={["#020617"]} />
        </>
      )}
    </>
  );
}

export default function Scene3D() {
  const currentStage = useStore((state) => state.currentStage);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 8, 15], fov: 45 }}
      className="w-full h-full"
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <LightingAndEnvironment />
        <Diorama />
        <CameraRig />

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Preload all />

        {/* Bloom chỉ bật ở stage 4.0 để tạo hiệu ứng neon */}
        {currentStage === 2 && (
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} intensity={1.2} mipmapBlur />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
