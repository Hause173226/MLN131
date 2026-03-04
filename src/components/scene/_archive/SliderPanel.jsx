import { useStore } from '../../hooks/useStore';

export default function SliderPanel() {
  const { sliderValue, setSliderValue } = useStore();

  const getDescription = (value) => {
    if (value <= 30) {
      return "Sản xuất nhỏ lẻ, công cụ thủ công, năng suất thấp.";
    } else if (value <= 70) {
      return "Bắt đầu cơ khí hóa, quy mô mở rộng, kỷ luật lao động hình thành.";
    } else {
      return "Nhà máy thông minh, công nhân tri thức hóa, làm chủ khoa học công nghệ.";
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl z-10">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl p-6 transition-all duration-300">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <label className="text-white text-sm md:text-base font-semibold tracking-wider uppercase">
              Tiến trình chuyển đổi
            </label>
            <span className="text-cyan-400 font-bold text-lg">{sliderValue}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
          />
        </div>
        <div className="text-gray-200 text-sm md:text-base leading-relaxed text-center font-medium min-h-[40px] flex items-center justify-center">
          <p>{getDescription(sliderValue)}</p>
        </div>
      </div>
    </div>
  );
}
