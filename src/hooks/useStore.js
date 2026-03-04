import { create } from "zustand";

/**
 * Global state cho toàn bộ ứng dụng chuyển đổi công nghiệp.
 *
 * currentStage  : giai đoạn hiện tại (0=Thủ công, 1=Công nghiệp, 2=4.0)
 * activeInfo    : thông tin chi tiết đang được hiển thị trong SidePanel
 * cameraTarget  : vị trí camera muốn di chuyển tới (đặt từ Hotspot)
 */
export const useStore = create((set) => ({
  // ── Stage navigation ──────────────────────────────────────────
  currentStage: 0,
  setCurrentStage: (stage) => set({ currentStage: stage }),

  // ── Side-panel info (mở ra khi click Hotspot) ─────────────────
  activeInfo: null,
  setActiveInfo: (info) => set({ activeInfo: info }),

  // ── Camera target (Hotspot → CameraRig) ───────────────────────
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
