import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../hooks/useStore";

/**
 * Dữ liệu nội dung cho 3 giai đoạn lịch sử.
 * Mỗi stage có: tiêu đề, mô tả ngắn, danh sách đặc điểm, màu sắc chủ đạo.
 */
const STAGES = [
  {
    id: 0,
    era: "GIAI ĐOẠN 1",
    title: "Nông nghiệp & Thủ công",
    description: "Sản xuất nhỏ lẻ, phân tán, phụ thuộc thiên nhiên.",
    bullets: [
      "Công cụ thủ công, sức người là chính",
      "Năng suất lao động rất thấp",
      "Tâm lý tiểu nông, manh mún",
      "Giai cấp công nhân chưa hình thành",
    ],
    hint: "Click vào mô hình 3D để xem chi tiết",
    accent: "bg-orange-500",
    cardStyle: "bg-amber-950/60 border-orange-400/50 text-amber-50",
    eraColor: "text-orange-400",
    dotActive: "bg-orange-500 shadow-orange-500/50",
    progressColor: "bg-orange-500",
  },
  {
    id: 1,
    era: "GIAI ĐOẠN 2",
    title: "Công nghiệp hoá sơ kỳ",
    description: "Máy móc thay thế sức người, nhà máy hình thành.",
    bullets: [
      "Cơ khí hoá, dây chuyền sản xuất",
      "Kỷ luật lao động công nghiệp",
      "Giai cấp công nhân xuất hiện & lớn mạnh",
      "Năng suất tăng nhưng điều kiện còn khắc nghiệt",
    ],
    hint: "Click vào nhà máy để xem chi tiết",
    accent: "bg-slate-400",
    cardStyle: "bg-slate-800/70 border-slate-400/50 text-slate-100",
    eraColor: "text-slate-300",
    dotActive: "bg-slate-400 shadow-slate-400/50",
    progressColor: "bg-slate-400",
  },
  {
    id: 2,
    era: "GIAI ĐOẠN 3",
    title: "Nhà máy thông minh 4.0",
    description: "Tự động hoá, AI, công nhân tri thức hoá, làm chủ KH-CN.",
    bullets: [
      "Robot & AI thay thế lao động đơn giản",
      "Công nhân vận hành hệ thống số",
      "Làm chủ khoa học – công nghệ",
      "Năng suất vượt bậc, chất lượng sản phẩm cao",
    ],
    hint: "Click vào server để xem chi tiết",
    accent: "bg-cyan-500",
    cardStyle:
      "bg-black/70 border-cyan-500/60 text-white shadow-[0_0_30px_rgba(6,182,212,0.25)]",
    eraColor: "text-cyan-400",
    dotActive: "bg-cyan-500 shadow-cyan-500/60",
    progressColor: "bg-cyan-500",
  },
];

// ── Stage Info Card (top-left) ─────────────────────────────────────────────
function StageInfoCard({ stage }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.4 }}
        className={`backdrop-blur-xl border rounded-2xl p-4 md:p-5 shadow-2xl max-w-xs md:max-w-sm ${stage.cardStyle}`}
      >
        {/* Era label */}
        <span
          className={`text-xs font-bold tracking-widest uppercase ${stage.eraColor}`}
        >
          {stage.era}
        </span>

        {/* Title */}
        <h2 className="text-base md:text-xl font-bold mt-1 mb-2 leading-tight">
          {stage.title}
        </h2>

        {/* Description */}
        <p className="text-xs md:text-sm leading-relaxed opacity-80 mb-3">
          {stage.description}
        </p>

        {/* Bullet points đặc trưng giai đoạn */}
        <ul className="space-y-1">
          {stage.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs md:text-sm opacity-90"
            >
              <span
                className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${stage.accent}`}
              />
              {b}
            </li>
          ))}
        </ul>

        {/* Hint click hotspot */}
        <p className="mt-3 text-[10px] opacity-40 italic">↗ {stage.hint}</p>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Timeline Stepper (bottom-center) ──────────────────────────────────────
function TimelineStepper({ stages, currentStage, setCurrentStage }) {
  return (
    <div className="w-full max-w-sm md:max-w-lg mx-auto pointer-events-auto pb-4 md:pb-0">
      <div className="backdrop-blur-md bg-black/50 border border-white/10 rounded-full px-4 py-2 flex justify-between items-center relative">
        {/* Progress track */}
        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gray-700 -translate-y-1/2 -z-10 rounded-full overflow-hidden">
          <motion.div
            className={stages[currentStage].progressColor}
            style={{ height: "100%" }}
            animate={{
              width: `${(currentStage / (stages.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {stages.map((stage) => {
          const isActive = currentStage === stage.id;
          const isPast = currentStage > stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => setCurrentStage(stage.id)}
              title={stage.title}
              className={`
                flex flex-col items-center gap-0.5 transition-all duration-300
              `}
            >
              <span
                className={`
                  w-9 h-9 md:w-12 md:h-12 rounded-full font-bold text-sm
                  flex items-center justify-center
                  transition-all duration-300
                  ${
                    isActive
                      ? `${stage.dotActive} text-white scale-110 shadow-lg`
                      : isPast
                        ? "bg-gray-600 text-gray-300"
                        : "bg-gray-800 text-gray-500"
                  }
                `}
              >
                {stage.id + 1}
              </span>
              <span
                className={`text-[9px] md:text-[10px] font-medium transition-opacity duration-300 text-center leading-tight max-w-[60px] ${isActive ? "opacity-100 text-white" : "opacity-0"}`}
              >
                {stage.era.replace("GIAI ĐOẠN ", "GĐ ")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Overlay ───────────────────────────────────────────────────────────
export default function OverlayUI() {
  const { currentStage, setCurrentStage } = useStore();
  const stage = STAGES[currentStage];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 md:p-10 pt-24 md:pt-28">
      {/* Stage info card — top-left, dưới Header */}
      <div className="self-start">
        <StageInfoCard stage={stage} />
      </div>

      {/* Timeline stepper — bottom-center */}
      <TimelineStepper
        stages={STAGES}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
      />
    </div>
  );
}
