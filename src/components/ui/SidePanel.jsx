import { useStore } from "../../hooks/useStore";
import { X } from "lucide-react";

/**
 * SidePanel — hiển thị thông tin chi tiết khi người dùng click vào Hotspot 3D.
 * Slide từ phải vào khi `activeInfo` có giá trị, slide ra khi đóng.
 * Đóng panel cũng reset camera về vị trí mặc định của stage hiện tại.
 */
export default function SidePanel() {
  const { activeInfo, setActiveInfo, setCameraTarget } = useStore();

  const handleClose = () => {
    setActiveInfo(null);
    setCameraTarget(null); // reset camera về góc nhìn stage (xem CameraRig)
  };

  return (
    <div
      className={`
        absolute top-0 right-0 h-full w-80 md:w-96 z-20
        transition-transform duration-500 ease-in-out
        ${activeInfo ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="h-full backdrop-blur-xl bg-black/50 border-l border-white/10 shadow-[-15px_0_40px_rgba(0,0,0,0.6)] rounded-l-3xl p-6 flex flex-col pt-28 relative">
        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          <X size={20} />
        </button>

        {activeInfo && (
          <div className="text-white">
            {/* Label */}
            <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full mb-4 border border-cyan-500/30 tracking-wider uppercase">
              Chi tiết
            </span>

            {/* Title */}
            <h2 className="text-xl font-bold mb-3 leading-snug">
              {activeInfo.title}
            </h2>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent mb-4" />

            {/* Content */}
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {activeInfo.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
