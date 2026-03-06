import { useStore } from "../../hooks/useStore";

/** Màu accent thay đổi theo từng giai đoạn để đồng bộ với scene 3D */
const STAGE_ACCENT = {
  0: "border-orange-400/40",
  1: "border-slate-400/40",
  2: "border-cyan-500/60",
};

export default function Header() {
  const currentStage = useStore((state) => state.currentStage);

  return (
    <header
      className={`
        absolute top-4 left-1/2 -translate-x-1/2 z-10
        py-3 px-8 text-center rounded-2xl
        backdrop-blur-md bg-black/30 border shadow-lg
        w-11/12 max-w-3xl
        transition-all duration-500
        ${STAGE_ACCENT[currentStage]}
      `}
    >
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
        MLN131 — Chủ nghĩa Mác-Lênin
      </p>
      <h1
        className="text-base md:text-xl font-bold text-white tracking-wide leading-tight"
        style={{ textShadow: "0px 2px 6px rgba(0,0,0,0.6)" }}
      >
        Giai Cấp Công Nhân Việt Nam trong Thời Kỳ CNH-HĐH
      </h1>
    </header>
  );
}
