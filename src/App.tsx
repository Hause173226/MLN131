import Scene3D from "./components/scene/Scene3D";
import Header from "./components/ui/Header";
import OverlayUI from "./components/OverlayUI";
import SidePanel from "./components/ui/SidePanel";

/**
 * Root layout:
 *  ┌──────────────────────────────┐
 *  │  Header (tiêu đề + học viên) │  ← absolute top
 *  │  Scene3D (3D canvas)         │  ← fill toàn màn hình
 *  │  OverlayUI (stage info +     │  ← absolute overlay
 *  │            timeline stepper) │
 *  │  SidePanel (chi tiết hotspot)│  ← absolute right, slide-in
 *  └──────────────────────────────┘
 */
function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      <Scene3D />
      <Header />
      <OverlayUI />
      <SidePanel />
    </div>
  );
}

export default App;
