import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// ─────────────────────────────────────────────────────────────────────────────
// HumanFigures.jsx — Nhân vật con người hoạt động cho từng giai đoạn
//
// Mỗi nhân vật được dựng từ primitive (sphere, box, cylinder) với
// refs gắn vào từng chi để animate bằng useFrame.
//
// Stage 0: Farmer (cuốc đất) + FarmerCarrying (gánh gạo, đi lại)
// Stage 1: FactoryWorker (kéo cần gạt) + FactoryPatrol (đi tuần tra)
// Stage 2: TechTyping (gõ bàn phím) + TechPointing (chỉ hologram)
// ─────────────────────────────────────────────────────────────────────────────

// ── Màu chung ─────────────────────────────────────────────────────────────────
const C = {
  skin: "#c8834a",
  hair: "#2c1810",
  // Stage 0
  ao_ba_ba: "#6b7c5c",
  quan_toi: "#3d2b1f",
  non_la: "#ddd09a",
  hoe: "#7c4a1e",
  // Stage 1
  dong_phuc: "#4a5568",
  helmet: "#f6ad55",
  lever: "#718096",
  // Stage 2
  ao_trang: "#e2e8f0",
  quan_xam: "#4a5568",
  tablet: "#1a202c",
  screen_gl: "#00ffff",
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 0 — Nông dân #1: Đứng cuốc đất
//   Tay phải cầm cuốc swing lên xuống, người hơi cúi theo nhịp
// ─────────────────────────────────────────────────────────────────────────────
export function Farmer({ position, rotationY = 0, phase = 0 }) {
  const rArmRef = useRef();
  const lArmRef = useRef();
  const bodyPivot = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    const s = Math.sin(t * 2.4);
    if (rArmRef.current) rArmRef.current.rotation.x = s * 1.05 - 0.25; // cuốc xuống / kéo lên
    if (lArmRef.current) lArmRef.current.rotation.x = -s * 0.25 - 0.1; // tay trái đỡ
    if (bodyPivot.current) bodyPivot.current.rotation.x = s * 0.1 + 0.08; // người cúi theo
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={0.92}>
      {/* ĐẦU */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={C.skin} />
      </mesh>
      {/* Nón lá */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.15, 0.12, 12]} />
        <meshStandardMaterial color={C.non_la} />
      </mesh>

      {/* THÂN (pivot để người cúi khi cuốc) */}
      <group ref={bodyPivot}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.22, 0.28, 0.13]} />
          <meshStandardMaterial color={C.ao_ba_ba} />
        </mesh>

        {/* TAY TRÁI */}
        <group ref={lArmRef} position={[-0.15, 0.62, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <boxGeometry args={[0.07, 0.26, 0.08]} />
            <meshStandardMaterial color={C.ao_ba_ba} />
          </mesh>
          {/* Bàn tay trái */}
          <mesh position={[0, -0.27, 0]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
        </group>

        {/* TAY PHẢI + CUỐC */}
        <group ref={rArmRef} position={[0.15, 0.62, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <boxGeometry args={[0.07, 0.26, 0.08]} />
            <meshStandardMaterial color={C.ao_ba_ba} />
          </mesh>
          <mesh position={[0, -0.27, 0]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
          {/* Cán cuốc */}
          <mesh position={[0, -0.52, 0.04]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.48, 6]} />
            <meshStandardMaterial color={C.hoe} />
          </mesh>
          {/* Lưỡi cuốc */}
          <mesh
            position={[0.04, -0.78, 0.04]}
            rotation={[0.4, 0, 0.3]}
            castShadow
          >
            <boxGeometry args={[0.2, 0.05, 0.06]} />
            <meshStandardMaterial
              color="#888"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* CHÂN TRÁI */}
      <mesh position={[-0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color={C.quan_toi} />
      </mesh>
      {/* CHÂN PHẢI */}
      <mesh position={[0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color={C.quan_toi} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 0 — Nông dân #2: VÁC BAO LÚA TRÊN VAI PHẢI, đi bộ
//   Vai phải đỡ bao, tay phải giơ lên giữ, tay trái vung tự nhiên
//   Người hơi nghiêng sang phải do trọng tải
// ─────────────────────────────────────────────────────────────────────────────
export function FarmerCarrying({ position, rotationY = 0, phase = 0 }) {
  const lLegRef = useRef();
  const rLegRef = useRef();
  const lArmRef = useRef(); // vung tự nhiên
  const rArmRef = useRef(); // giơ lên đỡ bao
  const rootRef = useRef();
  const bodyRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    const walk = Math.sin(t * 2.6);

    // Chân đi bộ
    if (lLegRef.current) lLegRef.current.rotation.x = walk * 0.42;
    if (rLegRef.current) rLegRef.current.rotation.x = -walk * 0.42;

    // Tay trái vung theo bước chân (tự nhiên)
    if (lArmRef.current) lArmRef.current.rotation.x = -walk * 0.3;

    // Tay phải giơ lên vai, hơi siết để giữ bao — rung nhẹ theo bước
    if (rArmRef.current) {
      rArmRef.current.rotation.x = -1.5 + walk * 0.06; // giơ cao, hơi nhúc nhích
      rArmRef.current.rotation.z = -0.15; // hơi mở ra ôm bao
    }

    // Người nghiêng sang phải (phía vai vác), chòng chành nhẹ theo bước
    if (bodyRef.current) {
      bodyRef.current.rotation.z = -0.08 + walk * 0.04;
    }

    // Nhấp nhô nhẹ theo bước chân
    if (rootRef.current) rootRef.current.position.y = Math.abs(walk) * 0.014;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={0.92}>
      <group ref={rootRef}>
        {/* ĐẦU */}
        <mesh position={[0, 0.78, 0]} castShadow>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
        {/* Nón lá */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <coneGeometry args={[0.15, 0.12, 12]} />
          <meshStandardMaterial color={C.non_la} />
        </mesh>

        <group ref={bodyRef}>
          {/* THÂN */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.22, 0.28, 0.13]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>

          {/* TAY TRÁI — vung tự nhiên khi đi */}
          <group ref={lArmRef} position={[-0.15, 0.63, 0]}>
            <mesh position={[0, -0.13, 0]} castShadow>
              <boxGeometry args={[0.07, 0.26, 0.08]} />
              <meshStandardMaterial color="#8b7355" />
            </mesh>
            <mesh position={[0, -0.27, 0]} castShadow>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshStandardMaterial color={C.skin} />
            </mesh>
          </group>

          {/* TAY PHẢI — giơ lên đỡ bao trên vai */}
          <group ref={rArmRef} position={[0.15, 0.63, 0]}>
            <mesh position={[0, -0.1, 0]} castShadow>
              <boxGeometry args={[0.07, 0.2, 0.08]} />
              <meshStandardMaterial color="#8b7355" />
            </mesh>
            <mesh position={[0, -0.21, 0]} castShadow>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshStandardMaterial color={C.skin} />
            </mesh>
          </group>

          {/*
            BAO LÚA — đặt trên vai phải, là điểm neo (không theo arm ref
            mà theo body để nó đứng yên trên vai, chỉ chòng chành nhẹ theo body)
          */}
          <group position={[0.18, 0.82, 0]} rotation={[0.15, 0, 0.12]}>
            {/* Thân bao (bao tải vải thô) */}
            <mesh castShadow>
              <cylinderGeometry args={[0.11, 0.13, 0.38, 8]} />
              <meshStandardMaterial color="#c8a96e" roughness={1} />
            </mesh>
            {/* Đầu bao thắt lại */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color="#b8935a" roughness={1} />
            </mesh>
            {/* Dây buộc bao */}
            <mesh position={[0, 0.18, 0]} castShadow>
              <torusGeometry args={[0.09, 0.012, 6, 12]} />
              <meshStandardMaterial color="#5c3d1e" />
            </mesh>
          </group>
        </group>

        {/* CHÂN TRÁI */}
        <group ref={lLegRef} position={[-0.07, 0.32, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.09, 0.3, 0.1]} />
            <meshStandardMaterial color={C.quan_toi} />
          </mesh>
        </group>
        {/* CHÂN PHẢI */}
        <group ref={rLegRef} position={[0.07, 0.32, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.09, 0.3, 0.1]} />
            <meshStandardMaterial color={C.quan_toi} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 1 — Công nhân #1: Kéo cần gạt máy móc
//   Tay phải kéo lever lên xuống, tay trái chống hông
// ─────────────────────────────────────────────────────────────────────────────
export function FactoryWorker({ position, rotationY = 0, phase = 0 }) {
  const rArmRef = useRef();
  const lArmRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    const s = Math.sin(t * 1.8);
    if (rArmRef.current) rArmRef.current.rotation.x = s * 0.9 - 0.4; // kéo lever
    if (lArmRef.current) lArmRef.current.rotation.z = 0.5; // tay chống hông
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={0.95}>
      {/* ĐẦU + MŨ BẢO HỘ */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={C.skin} />
      </mesh>
      {/* Mũ bảo hộ (helmet) */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.13, 0.1, 12]} />
        <meshStandardMaterial color={C.helmet} />
      </mesh>
      <mesh position={[0, 0.845, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.028, 12]} />
        <meshStandardMaterial color={C.helmet} />
      </mesh>

      {/* THÂN */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.23, 0.29, 0.14]} />
        <meshStandardMaterial color={C.dong_phuc} />
      </mesh>

      {/* TAY TRÁI — chống hông */}
      <group ref={lArmRef} position={[-0.16, 0.62, 0]}>
        <mesh position={[0, -0.13, 0]} castShadow>
          <boxGeometry args={[0.07, 0.26, 0.08]} />
          <meshStandardMaterial color={C.dong_phuc} />
        </mesh>
        <mesh position={[0, -0.27, 0]} castShadow>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
      </group>

      {/* TAY PHẢI + CẦN GẠT */}
      <group ref={rArmRef} position={[0.16, 0.65, 0]}>
        <mesh position={[0, -0.13, 0]} castShadow>
          <boxGeometry args={[0.07, 0.26, 0.08]} />
          <meshStandardMaterial color={C.dong_phuc} />
        </mesh>
        <mesh position={[0, -0.27, 0]} castShadow>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
        {/* Cần gạt (lever) */}
        <mesh position={[0.04, -0.46, 0]} rotation={[0, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.38, 6]} />
          <meshStandardMaterial
            color={C.lever}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Tay nắm lever */}
        <mesh position={[0.06, -0.66, 0]} castShadow>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>
      </group>

      {/* CHÂN */}
      <mesh position={[-0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      <mesh position={[0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 1 — Công nhân #2: Đi tuần tra kiểm tra dây chuyền
//   Hai chân đi bộ, tay trái cầm clipboard ghi chép
// ─────────────────────────────────────────────────────────────────────────────
export function FactoryPatrol({ position, rotationY = 0, phase = 0 }) {
  const lLegRef = useRef();
  const rLegRef = useRef();
  const lArmRef = useRef();
  const rArmRef = useRef();
  const rootRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    const walk = Math.sin(t * 3.2);

    if (lLegRef.current) lLegRef.current.rotation.x = walk * 0.5;
    if (rLegRef.current) rLegRef.current.rotation.x = -walk * 0.5;
    // Tay phải vung theo bước chân
    if (rArmRef.current) rArmRef.current.rotation.x = walk * 0.35;
    // Tay trái giữ clipboard — gần như cố định, hơi vung nhẹ
    if (lArmRef.current) {
      lArmRef.current.rotation.x = -Math.PI / 3 + walk * 0.1;
    }
    if (rootRef.current) rootRef.current.position.y = Math.abs(walk) * 0.01;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={0.95}>
      <group ref={rootRef}>
        {/* ĐẦU + MŨ */}
        <mesh position={[0, 0.78, 0]} castShadow>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
        <mesh position={[0, 0.88, 0]} castShadow>
          <cylinderGeometry args={[0.115, 0.13, 0.1, 12]} />
          <meshStandardMaterial color="#fc8181" />
        </mesh>
        <mesh position={[0, 0.845, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.028, 12]} />
          <meshStandardMaterial color="#fc8181" />
        </mesh>

        {/* THÂN */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.23, 0.29, 0.14]} />
          <meshStandardMaterial color="#718096" />
        </mesh>

        {/* TAY TRÁI — giữ clipboard */}
        <group ref={lArmRef} position={[-0.16, 0.63, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <boxGeometry args={[0.07, 0.26, 0.08]} />
            <meshStandardMaterial color="#718096" />
          </mesh>
          {/* Clipboard */}
          <mesh
            position={[-0.04, -0.28, 0.06]}
            rotation={[0.3, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.16, 0.2, 0.02]} />
            <meshStandardMaterial color="#f7fafc" />
          </mesh>
          {/* Kẹp clipboard */}
          <mesh position={[-0.04, -0.18, 0.07]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.025]} />
            <meshStandardMaterial color="#718096" metalness={0.7} />
          </mesh>
        </group>

        {/* TAY PHẢI — vung tự nhiên */}
        <group ref={rArmRef} position={[0.16, 0.63, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <boxGeometry args={[0.07, 0.26, 0.08]} />
            <meshStandardMaterial color="#718096" />
          </mesh>
          <mesh position={[0, -0.27, 0]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
        </group>

        {/* CHÂN */}
        <group ref={lLegRef} position={[-0.07, 0.32, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.09, 0.3, 0.1]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
        </group>
        <group ref={rLegRef} position={[0.07, 0.32, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.09, 0.3, 0.1]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2 — Kỹ sư #1: Đứng trước bàn, gõ bàn phím, màn hình đứng thẳng trước mặt
//
//  Sơ đồ (nhìn từ trên, person hướng +Z):
//
//    body(z=0─0.07) ← arms reach → keyboard(z=0.42─0.54) | screen(z=0.35, đứng thẳng)
//
//  Màn hình đứng thẳng tại z=0.35, mặt kính quay về -Z (phía người) → rotation.y=Math.PI
//  Bàn tại z=0.52. Tay: upper arm rotation.x=-1.05, elbow thêm +0.80 → tay chạm phím
// ─────────────────────────────────────────────────────────────────────────────
export function TechWorkerTyping({ position, rotationY = 0, phase = 0 }) {
  const lHandRef = useRef(); // bàn tay trái nhấp phím
  const rHandRef = useRef(); // bàn tay phải nhấp phím
  const headRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    // Bàn tay nhấp nhẹ xuống lên xen kẽ — gõ phím
    if (lHandRef.current)
      lHandRef.current.position.y = -0.21 + Math.sin(t * 7.0) * 0.018;
    if (rHandRef.current)
      rHandRef.current.position.y = -0.21 - Math.sin(t * 7.0) * 0.018;
    // Đầu hơi ngước nhìn màn hình, lắc rất nhẹ khi đọc
    if (headRef.current) {
      headRef.current.rotation.x = -0.14 + Math.sin(t * 0.8) * 0.03;
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={0.95}>
      {/* ĐẦU */}
      <group ref={headRef} position={[0, 0.78, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
        <mesh position={[0, 0.07, -0.01]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </group>

      {/* THÂN */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.23, 0.29, 0.14]} />
        <meshStandardMaterial color={C.ao_trang} />
      </mesh>

      {/*
        TAY TRÁI:
          • Vai    : position=[-0.14, 0.63, 0]
          • Bắp tay: rotation.x=-1.05 → khuỷu hướng ra trước ~z=+0.20, y=0.51
          • Cẳng tay: rotation.x=+0.80 tại khuỷu → bàn tay xuống chạm bàn phím
      */}
      {/* TAY TRÁI: upper arm x=-1.40 ⇒ khuỷu ra trước; elbow +0.50 ⇒ tay chạm bàn phím tại z≈0.39, y≈0.46 */}
      <group position={[-0.14, 0.63, 0]} rotation={[-1.4, 0, 0.08]}>
        {/* Bắp tay */}
        <mesh position={[0, -0.11, 0]} castShadow>
          <boxGeometry args={[0.07, 0.22, 0.08]} />
          <meshStandardMaterial color={C.ao_trang} />
        </mesh>
        {/* Khuỷu tay */}
        <mesh position={[0, -0.23, 0]} castShadow>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
        {/* Cẳng tay */}
        <group position={[0, -0.23, 0]} rotation={[0.5, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <boxGeometry args={[0.065, 0.2, 0.07]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
          {/* Bàn tay — gắn ref để nhấp gõ phím */}
          <mesh ref={lHandRef} position={[0, -0.21, 0]} castShadow>
            <boxGeometry args={[0.08, 0.035, 0.085]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
        </group>
      </group>

      {/* TAY PHẢI — đối xứng */}
      <group position={[0.14, 0.63, 0]} rotation={[-1.4, 0, -0.08]}>
        <mesh position={[0, -0.11, 0]} castShadow>
          <boxGeometry args={[0.07, 0.22, 0.08]} />
          <meshStandardMaterial color={C.ao_trang} />
        </mesh>
        <mesh position={[0, -0.23, 0]} castShadow>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
        <group position={[0, -0.23, 0]} rotation={[0.5, 0, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <boxGeometry args={[0.065, 0.2, 0.07]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
          <mesh ref={rHandRef} position={[0, -0.21, 0]} castShadow>
            <boxGeometry args={[0.08, 0.035, 0.085]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
        </group>
      </group>

      {/*
        ═══ BÀN LÀM VIỆC ═══
        Tay tính toán đến: y≈0.573, z≈0.40 (body-local)
        Bàn top tại y=0.553 (keyboard top y=0.571 khớp tay)
        Bàn tại z=0.52 (giữa cảnh), keyboard tại z=0.40
      */}
      {/* Mặt bàn — hạ xuống khớp chiều cao tay (tay chạm y≈0.46) */}
      <mesh position={[0, 0.428, 0.52]} castShadow>
        <boxGeometry args={[0.62, 0.028, 0.44]} />
        <meshStandardMaterial color="#1e2a3a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Chân bàn trái */}
      <mesh position={[-0.28, 0.207, 0.52]} castShadow>
        <boxGeometry args={[0.028, 0.414, 0.028]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {/* Chân bàn phải */}
      <mesh position={[0.28, 0.207, 0.52]} castShadow>
        <boxGeometry args={[0.028, 0.414, 0.028]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/*
        ═══ LAPTOP ═══
        Tay với: upper arm x=-1.40 + elbow +0.50 ⇒ tay tại z≈0.39, y≈0.460
        Bàn phím top y=0.460 khớp đúng tay ✓
      */}
      {/* Bàn phím */}
      <mesh position={[0, 0.451, 0.39]} castShadow>
        <boxGeometry args={[0.38, 0.018, 0.24]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      {/* Vùng phím */}
      <mesh position={[0, 0.461, 0.39]}>
        <boxGeometry args={[0.31, 0.002, 0.17]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, 0.462, 0.3]} castShadow>
        <boxGeometry args={[0.13, 0.004, 0.07]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} />
      </mesh>
      {/* Khớp bản lề */}
      <mesh position={[0, 0.44, 0.52]} castShadow>
        <boxGeometry args={[0.36, 0.025, 0.025]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* Khung màn hình — đứng thẳng tại mép sau bàn */}
      <mesh position={[0, 0.589, 0.528]} castShadow>
        <boxGeometry args={[0.38, 0.3, 0.016]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.85}
          roughness={0.1}
        />
      </mesh>
      {/* Mặt kính phát sáng, quay về người */}
      <mesh position={[0, 0.589, 0.521]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.32, 0.24]} />
        <meshStandardMaterial
          color="#001a33"
          emissive="#00aadd"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {/* Dòng code giả #1 */}
      <mesh position={[0, 0.634, 0.52]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.22, 0.018]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>
      {/* Dòng code giả #2 */}
      <mesh position={[-0.04, 0.595, 0.52]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.14, 0.014]} />
        <meshStandardMaterial
          color="#80ffff"
          emissive="#80ffff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      {/* Dòng code giả #3 */}
      <mesh position={[0.03, 0.557, 0.52]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.18, 0.014]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* CHÂN */}
      <mesh position={[-0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color={C.quan_xam} />
      </mesh>
      <mesh position={[0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color={C.quan_xam} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2 — Kỹ sư #2: Giơ tay chỉ / tương tác hologram
//   Tay phải giơ lên xoay nhẹ, đầu nghiêng ngắm hologram
// ─────────────────────────────────────────────────────────────────────────────
export function TechWorkerPointing({ position, rotationY = 0, phase = 0 }) {
  const rArmRef = useRef();
  const lArmRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    // Tay phải chỉ thẳng về phía robot, dao động nhẹ như ra hiệu
    if (rArmRef.current) {
      rArmRef.current.rotation.x = -0.55 + Math.sin(t * 1.5) * 0.12;
      rArmRef.current.rotation.z = -0.35 + Math.sin(t * 0.8) * 0.08;
    }
    // Tay trái ở tư thế tự nhiên
    if (lArmRef.current) lArmRef.current.rotation.x = 0.3;
    // Đầu nhìn thẳng về phía robot, nghiêng nhẹ
    if (headRef.current) {
      headRef.current.rotation.x = -0.08 + Math.sin(t * 1.2) * 0.04;
      headRef.current.rotation.y = Math.sin(t * 0.7) * 0.06;
    }
    // Người hơi nghiêng nhẹ
    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 0.9) * 0.03;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={0.95}>
      {/* ĐẦU */}
      <group ref={headRef} position={[0, 0.78, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={C.skin} />
        </mesh>
        <mesh position={[0, 0.07, -0.01]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color="#2c1810" />
        </mesh>
      </group>

      <group ref={bodyRef}>
        {/* THÂN */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.23, 0.29, 0.14]} />
          <meshStandardMaterial color="#2b6cb0" />
        </mesh>

        {/* TAY TRÁI */}
        <group ref={lArmRef} position={[-0.16, 0.63, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <boxGeometry args={[0.07, 0.26, 0.08]} />
            <meshStandardMaterial color="#2b6cb0" />
          </mesh>
          <mesh position={[0, -0.27, 0]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
        </group>

        {/* TAY PHẢI — chỉ hologram */}
        <group ref={rArmRef} position={[0.16, 0.63, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <boxGeometry args={[0.07, 0.26, 0.08]} />
            <meshStandardMaterial color="#2b6cb0" />
          </mesh>
          <mesh position={[0, -0.27, 0]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
          {/* Ngón tay trỏ */}
          <mesh position={[0, -0.32, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.014, 0.12, 5]} />
            <meshStandardMaterial color={C.skin} />
          </mesh>
        </group>
      </group>

      {/* CHÂN */}
      <mesh position={[-0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color={C.quan_xam} />
      </mesh>
      <mesh position={[0.07, 0.17, 0]} castShadow>
        <boxGeometry args={[0.09, 0.3, 0.1]} />
        <meshStandardMaterial color={C.quan_xam} />
      </mesh>
    </group>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2 — Robot công nghiệp 4.0
//   Thân kim loại + mắt LED cyan + màn hình ngực + cánh tay duỗi về phía
//   kỹ sư (cánh tay duỗi theo trục +Z local, robot xoay hướng về người)
//   Đầu quét ngang, đỉnh ăng-ten nhấp nháy đỏ
// ─────────────────────────────────────────────────────────────────────────────
export function Robot({ position, rotationY = 0, phase = 0 }) {
  const headRef = useRef();
  const armRef = useRef();
  const antRef = useRef();
  const eyeLRef = useRef();
  const eyeRRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;

    // Đầu quét ngang chậm + gật nhẹ
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.7) * 0.35;
      headRef.current.rotation.x = Math.sin(t * 0.4) * 0.06;
    }
    // Cánh tay phản hồi người chỉ — dao động nhẹ
    if (armRef.current) {
      armRef.current.rotation.x = -0.25 + Math.sin(t * 1.6 + 0.4) * 0.14;
      armRef.current.rotation.z = Math.sin(t * 1.1) * 0.08;
    }
    // Ăng-ten nhấp nháy
    if (antRef.current) {
      antRef.current.material.emissiveIntensity =
        3 + Math.abs(Math.sin(t * 4)) * 5;
    }
    // Mắt LED pulse
    const eyeI = 4 + Math.sin(t * 2.5) * 1.5;
    if (eyeLRef.current) eyeLRef.current.material.emissiveIntensity = eyeI;
    if (eyeRRef.current) eyeRRef.current.material.emissiveIntensity = eyeI;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ═══ ĐẾ / PLATFORM ═══ */}
      <mesh position={[0, 0.055, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.11, 0.38]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {/* Đường viền đèn đế */}
      <mesh position={[0, 0.112, 0]}>
        <boxGeometry args={[0.46, 0.006, 0.4]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      {/* Bánh xe trái */}
      <mesh
        position={[-0.2, 0.055, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.055, 0.055, 0.07, 14]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Bánh xe phải */}
      <mesh
        position={[0.2, 0.055, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.055, 0.055, 0.07, 14]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ═══ THÂN (torso) ═══ */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.32, 0.42, 0.24]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.75}
          roughness={0.2}
        />
      </mesh>
      {/* Viền vai */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.36, 0.03, 0.28]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* Màn hình ngực */}
      <mesh position={[0, 0.4, 0.122]}>
        <planeGeometry args={[0.18, 0.22]} />
        <meshStandardMaterial
          color="#001a33"
          emissive="#00aadd"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.5, 0.123]}>
        <planeGeometry args={[0.13, 0.015]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.02, 0.46, 0.123]}>
        <planeGeometry args={[0.09, 0.012]} />
        <meshStandardMaterial
          color="#80ffff"
          emissive="#80ffff"
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.02, 0.42, 0.123]}>
        <planeGeometry args={[0.11, 0.012]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.38, 0.123]}>
        <planeGeometry args={[0.07, 0.01]} />
        <meshStandardMaterial
          color="#40ffff"
          emissive="#40ffff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* ═══ TAY TRÁI — gripper đứng yên ═══ */}
      <mesh position={[-0.22, 0.5, 0]} castShadow>
        <boxGeometry args={[0.09, 0.22, 0.09]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.75}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.22, 0.365, 0]} castShadow>
        <boxGeometry args={[0.075, 0.18, 0.075]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[-0.22, 0.265, 0]} castShadow>
        <boxGeometry args={[0.095, 0.05, 0.09]} />
        <meshStandardMaterial color="#111827" metalness={0.9} />
      </mesh>

      {/* ═══ TAY PHẢI — duỗi tương tác, sensor tip phát sáng ═══ */}
      <group position={[0.22, 0.56, 0]}>
        <group ref={armRef}>
          {/* Khớp vai */}
          <mesh castShadow>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial
              color="#4a5568"
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>
          {/* Bắp tay — góc ra phía trước */}
          <mesh position={[0, -0.1, 0.1]} rotation={[-0.9, 0, 0]} castShadow>
            <boxGeometry args={[0.075, 0.22, 0.08]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.75}
              roughness={0.2}
            />
          </mesh>
          {/* Khớp khuỷu */}
          <mesh position={[0, -0.14, 0.24]} castShadow>
            <sphereGeometry args={[0.042, 8, 8]} />
            <meshStandardMaterial
              color="#4a5568"
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>
          {/* Cẳng tay duỗi ra */}
          <mesh position={[0, -0.1, 0.38]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.065, 0.065, 0.28]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.75}
              roughness={0.22}
            />
          </mesh>
          {/* Sensor tip phát sáng */}
          <mesh position={[0, -0.06, 0.55]}>
            <sphereGeometry args={[0.038, 10, 10]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={7}
              toneMapped={false}
            />
          </mesh>
          {/* Beam tia sáng */}
          <mesh position={[0, -0.06, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.018, 0.22, 6]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* ═══ ĐẦU ═══ */}
      <group ref={headRef} position={[0, 0.73, 0]}>
        {/* Hộp đầu */}
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.24, 0.24]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.8}
            roughness={0.12}
          />
        </mesh>
        {/* Visor kính */}
        <mesh position={[0, 0.01, 0.121]}>
          <planeGeometry args={[0.22, 0.14]} />
          <meshStandardMaterial
            color="#001a33"
            emissive="#003355"
            emissiveIntensity={1.5}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Mắt LED trái */}
        <mesh ref={eyeLRef} position={[-0.065, 0.02, 0.123]}>
          <boxGeometry args={[0.065, 0.032, 0.004]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>
        {/* Mắt LED phải */}
        <mesh ref={eyeRRef} position={[0.065, 0.02, 0.123]}>
          <boxGeometry args={[0.065, 0.032, 0.004]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>
        {/* Status bar miệng xanh lá */}
        <mesh position={[0, -0.046, 0.123]}>
          <boxGeometry args={[0.1, 0.013, 0.004]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={4}
            toneMapped={false}
          />
        </mesh>
        {/* Tai trang trí */}
        <mesh position={[-0.148, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.1, 0.08]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        <mesh position={[0.148, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.1, 0.08]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        {/* Ăng-ten */}
        <mesh position={[0.07, 0.178, 0]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, 0.16, 6]} />
          <meshStandardMaterial color="#4a5568" metalness={0.9} />
        </mesh>
        <mesh ref={antRef} position={[0.07, 0.265, 0]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff4444"
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
