import LeftHUD from "@/components/LeftHUD";
import OfficeCanvas from "@/components/OfficeCanvas";
import PollingDriver from "@/components/PollingDriver";
import RightChat from "@/components/RightChat";

export default function Page() {
  return (
    <main style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <div className="hud">Yume Creative Lab · Faz 3</div>
      <OfficeCanvas />
      <LeftHUD />
      <RightChat />
      <PollingDriver />
    </main>
  );
}
