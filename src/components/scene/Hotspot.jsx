import { useState } from "react";
import { Html } from "@react-three/drei";
import { useStore } from "../../hooks/useStore";

/**
 * Hotspot — wrapper để tạo điểm tương tác trong scene 3D.
 *
 * Props:
 *  position        : [x, y, z] vị trí trong 3D
 *  markerOffset    : [x, y, z] offset của Html marker so với position (default [0,1.5,0])
 *  info            : { title, content } hiển thị trong SidePanel khi click
 *  cameraTargetPos : { position, target } camera bay tới khi click
 *  active          : boolean — chỉ render Html marker khi stage đang hiển thị
 *  children        : render prop nhận `hovered` boolean
 */
export default function Hotspot({
  position,
  markerOffset = [0, 1.5, 0],
  info,
  cameraTargetPos,
  active = true,
  children,
}) {
  const [hovered, setHovered] = useState(false);
  const { setActiveInfo, setCameraTarget } = useStore();

  const handleClick = (e) => {
    e.stopPropagation();
    setActiveInfo(info);
    if (cameraTargetPos) setCameraTarget(cameraTargetPos);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group position={position}>
      {/* Model 3D có thể hover / click */}
      <group
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {children(hovered)}
      </group>

      {/*
        Html marker chỉ mount khi stage đang active.
        Khi stage khác đang hiển thị (scale=0), không render Html
        → tránh marker hiện ra ở các stage khác.
      */}
      {active && (
        <Html position={markerOffset} center zIndexRange={[100, 0]}>
          <div
            onClick={handleClick}
            title={info?.title}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: hovered
                ? "rgba(6,182,212,0.9)"
                : "rgba(255,255,255,0.75)",
              border: "2px solid white",
              cursor: "pointer",
              boxShadow: hovered
                ? "0 0 14px #00ffff"
                : "0 0 6px rgba(255,255,255,0.5)",
              animation: hovered ? "none" : "pulse 2s infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: "bold",
              color: "#000",
              transition: "all 0.2s",
              userSelect: "none",
            }}
          >
            +
          </div>
        </Html>
      )}
    </group>
  );
}
