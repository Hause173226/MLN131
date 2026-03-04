import { useRef } from "react";
import { useStore } from "../../hooks/useStore";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Float, ContactShadows } from "@react-three/drei";
import Hotspot from "./Hotspot";
import {
  Farmer,
  FarmerCarrying,
  FactoryWorker,
  FactoryPatrol,
  TechWorkerTyping,
  TechWorkerPointing,
  Robot,
} from "./HumanFigures";
// ─────────────────────────────────────────────────────────────────────────────
// GIAI ĐOẠN 0 — Nông nghiệp & Thủ công
//   Mô hình: Nhà tranh, cây đa, vựa lúa nhỏ
//   Click vào nhà tranh → SidePanel giải thích lao động thủ công
// ─────────────────────────────────────────────────────────────────────────────
function Stage0_ThucongNongnghiep({ visible }) {
  const { scale } = useSpring({
    scale: visible ? 1 : 0,
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.group position={[-4, 0, 0]} scale={scale}>
      {/* Nhà tranh — clickable Hotspot */}
      <Hotspot
        position={[0, 0, 0]}
        active={visible}
        info={{
          title: "🏚 Nhà tranh — Lao động Thủ công",
          content:
            "Đơn vị sản xuất là hộ gia đình nhỏ lẻ. Công cụ hoàn toàn thủ công (cuốc, liềm, cày). Năng suất phụ thuộc sức người và điều kiện thời tiết. Tâm lý tiểu nông còn nặng nề.",
        }}
        cameraTargetPos={{ position: [-4, 5, 8], target: [-4, 0.5, 0] }}
      >
        {(hovered) => (
          <group>
            {/* Thân nhà */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[1.8, 1, 1.4]} />
              <meshStandardMaterial color={hovered ? "#e8b96e" : "#d4a373"} />
            </mesh>
            {/* Mái tranh */}
            <mesh
              position={[0, 1.35, 0]}
              rotation={[0, Math.PI / 4, 0]}
              castShadow
            >
              <coneGeometry args={[1.55, 0.9, 4]} />
              <meshStandardMaterial color={hovered ? "#d4843a" : "#bc6c25"} />
            </mesh>
          </group>
        )}
      </Hotspot>

      {/* Cây đa */}
      <group position={[2.2, 0, 0.8]}>
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 2]} />
          <meshStandardMaterial color="#582f0e" />
        </mesh>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.9, 16, 16]} />
            <meshStandardMaterial color="#2d6a4f" roughness={1} />
          </mesh>
        </Float>
      </group>
      {/* Nông dân cuốc đất — khu ruộng xa góc trái, đủ xa mọi vật thể */}
      <Farmer position={[-3.2, 0, 0.4]} rotationY={-Math.PI * 0.3} phase={0} />

      {/* Nông dân vác lúa — khu vực trống trải, tránh xa nhà */}
      <FarmerCarrying
        position={[1.8, 0, 2.2]}
        rotationY={Math.PI * 1.1}
        phase={1.2}
      />
      {/* Đống lúa / vựa nhỏ */}
      <Hotspot
        position={[-1.8, 0, 1.2]}
        active={visible}
        info={{
          title: "🌾 Vựa lúa — Nông sản thô",
          content:
            "Sản phẩm là lúa gạo, hoa màu được thu hoạch theo mùa vụ. Không có kho bảo quản hiện đại. Trao đổi hàng hoá chủ yếu ở chợ làng xã.",
        }}
        cameraTargetPos={{ position: [-6, 4, 7], target: [-5.5, 0, 1] }}
      >
        {(hovered) => (
          <group>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.6, 0.4, 8]} />
              <meshStandardMaterial color={hovered ? "#f5d97f" : "#e9c46a"} />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
              <coneGeometry args={[0.5, 0.5, 8]} />
              <meshStandardMaterial color={hovered ? "#f4c842" : "#e9c46a"} />
            </mesh>
          </group>
        )}
      </Hotspot>
    </animated.group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GIAI ĐOẠN 1 — Công nghiệp hoá sơ kỳ
//   Mô hình: Nhà máy, ống khói, bánh răng quay
//   Click vào nhà máy → SidePanel giải thích công nghiệp hoá
// ─────────────────────────────────────────────────────────────────────────────
function Stage1_Congnghiephoa({ visible }) {
  const { scale } = useSpring({ scale: visible ? 1 : 0 });
  const gearRef = useRef();

  // Bánh răng quay liên tục — đặc trưng máy móc công nghiệp
  useFrame((_, delta) => {
    if (gearRef.current) gearRef.current.rotation.z += delta * 1.2;
  });

  return (
    <animated.group position={[0, 0, 0]} scale={scale}>
      {/* Nhà máy chính — clickable */}
      <Hotspot
        position={[0, 0, 0]}
        markerOffset={[0, 2.2, 0]}
        active={visible}
        info={{
          title: "🏭 Nhà máy — Công nghiệp hoá",
          content:
            "Nhà máy tập trung đông đảo công nhân. Máy hơi nước và cơ khí thay thế sức người. Kỷ luật lao động công nghiệp bắt đầu hình thành, ca kíp xuất hiện. Giai cấp công nhân dần lớn mạnh về số lượng.",
        }}
        cameraTargetPos={{ position: [0, 6, 9], target: [0, 1, 0] }}
      >
        {(hovered) => (
          <group>
            {/* Thân nhà máy */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <boxGeometry args={[3, 1.5, 2.2]} />
              <meshStandardMaterial
                color={hovered ? "#7f8c8d" : "#6c757d"}
                metalness={0.5}
              />
            </mesh>
            {/* Mái bằng */}
            <mesh position={[0, 1.6, 0]} castShadow>
              <boxGeometry args={[3.2, 0.2, 2.4]} />
              <meshStandardMaterial color="#5a6268" metalness={0.6} />
            </mesh>
          </group>
        )}
      </Hotspot>

      {/* Ống khói — biểu tượng công nghiệp hoá */}
      <mesh position={[-0.7, 2.2, -0.6]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 1.8]} />
        <meshStandardMaterial color="#343a40" />
      </mesh>
      <mesh position={[0.7, 2.0, -0.6]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 1.3]} />
        <meshStandardMaterial color="#495057" />
      </mesh>

      {/* Công nhân vận hành cần gạt — đứng bên trái nhà máy */}
      <FactoryWorker position={[-2.2, 0, 1.1]} rotationY={0.3} phase={0} />

      {/* Công nhân tuần tra — phía bên phải nhà máy */}
      <FactoryPatrol
        position={[2.0, 0, 1.0]}
        rotationY={Math.PI + 0.2}
        phase={0.8}
      />

      {/* Bánh răng đang quay */}
      <Hotspot
        position={[0, 1, 1.2]}
        markerOffset={[1.4, 0.8, 0]}
        active={visible}
        info={{
          title: "⚙ Bánh răng — Cơ khí hoá",
          content:
            "Bánh răng, trục truyền động là trái tim của nhà máy cơ khí. Máy móc lần đầu tiên nhân lên sức mạnh của con người, tạo ra năng suất vượt lao động thủ công hàng chục lần.",
        }}
        cameraTargetPos={{ position: [0, 4, 7], target: [0, 1, 1] }}
      >
        {(hovered) => (
          <mesh ref={gearRef} castShadow>
            <torusGeometry args={[0.65, 0.18, 8, 10]} />
            <meshStandardMaterial
              color={hovered ? "#ced4da" : "#adb5bd"}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        )}
      </Hotspot>
    </animated.group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GIAI ĐOẠN 2 — Nhà máy thông minh 4.0
//   Mô hình: Server tower, ring hologram, lưới wireframe
//   Click vào server → SidePanel giải thích tri thức hoá
// ─────────────────────────────────────────────────────────────────────────────
function Stage2_Nhamay4dot0({ visible }) {
  const { scale } = useSpring({ scale: visible ? 1 : 0 });

  return (
    <animated.group position={[4, 0, 0]} scale={scale}>
      {/* Server / Data tower — clickable */}
      <Hotspot
        position={[0, 0, 0]}
        markerOffset={[-1.6, 1.8, 0]}
        active={visible}
        info={{
          title: "🖥 Máy chủ dữ liệu — Nền tảng số",
          content:
            "Trung tâm dữ liệu (Data Center) là xương sống của nhà máy thông minh. AI phân tích dữ liệu sản xuất theo thời gian thực. Công nhân chuyển từ lao động tay chân sang vận hành, giám sát hệ thống tự động.",
        }}
        cameraTargetPos={{ position: [4, 6, 8], target: [4, 1.5, 0] }}
      >
        {(hovered) => (
          <group>
            {/* Thân server */}
            <mesh position={[0, 1.3, 0]} castShadow>
              <boxGeometry args={[1.3, 2.6, 1.3]} />
              <meshStandardMaterial
                color={hovered ? "#1a1a2e" : "#0f0f1a"}
                metalness={1}
                roughness={0.05}
              />
            </mesh>
            {/* Dải đèn neon (emissive) */}
            <mesh position={[0, 1.3, 0.66]}>
              <planeGeometry args={[0.9, 2.2]} />
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={hovered ? 4 : 2}
                toneMapped={false}
              />
            </mesh>
          </group>
        )}
      </Hotspot>

      {/* Ring hologram xoay — biểu tượng AI / dữ liệu */}
      <Hotspot
        position={[0, 2.8, 0]}
        markerOffset={[1.6, 0.4, 0]}
        active={visible}
        info={{
          title: "🔮 Hologram AI — Trí tuệ nhân tạo",
          content:
            "Trí tuệ nhân tạo (AI) và IoT kết nối toàn bộ dây chuyền sản xuất. Robot học hỏi, tự điều chỉnh quy trình. Công nhân tri thức hoá: từ người thực hiện → người quản lý & lập trình máy.",
        }}
        cameraTargetPos={{ position: [4, 7, 7], target: [4, 2.8, 0] }}
      >
        {(hovered) => (
          <Float speed={5} rotationIntensity={2} floatIntensity={1}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.3, 0.025, 16, 100]} />
              <meshStandardMaterial
                color="#ff00ff"
                emissive="#ff00ff"
                emissiveIntensity={hovered ? 8 : 5}
                toneMapped={false}
              />
            </mesh>
          </Float>
        )}
      </Hotspot>

      {/* Kỹ sư gõ phím — đứng trước server */}
      <TechWorkerTyping position={[-1.6, 0, 0.9]} rotationY={0.1} phase={0} />

      {/* Kỹ sư xanh — tương tác với robot, quay mặt về phía robot */}
      <TechWorkerPointing
        position={[0.4, 0, 1.8]}
        rotationY={1.93}
        phase={1.5}
      />

      {/* Robot công nghiệp 4.0 — cánh tay hướng về kỹ sư */}
      <Robot position={[2.0, 0, 1.2]} rotationY={-1.21} phase={0.8} />

      {/* Lưới wireframe — giả lập không gian số */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
    </animated.group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Diorama — ghép 3 stage vào một scene, nền đất đổi màu theo stage
// ─────────────────────────────────────────────────────────────────────────────
export default function Diorama() {
  const currentStage = useStore((state) => state.currentStage);

  const { groundColor } = useSpring({
    groundColor:
      currentStage === 0
        ? "#606c38"
        : currentStage === 1
          ? "#adb5bd"
          : "#020617",
  });

  return (
    <group>
      {/* Nền đất — màu thay đổi mượt mà theo stage */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <circleGeometry args={[14, 64]} />
        <animated.meshStandardMaterial color={groundColor} />
      </mesh>

      {/* Bóng mềm */}
      <ContactShadows opacity={0.4} scale={22} blur={2.5} far={5} />

      {/* Ba giai đoạn — chỉ stage hiện tại mới scale=1, còn lại scale=0 */}
      <Stage0_ThucongNongnghiep visible={currentStage === 0} />
      <Stage1_Congnghiephoa visible={currentStage === 1} />
      <Stage2_Nhamay4dot0 visible={currentStage === 2} />
    </group>
  );
}
