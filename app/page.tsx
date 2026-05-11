import OfficeCanvas from "@/components/OfficeCanvas";

export default function Page() {
  return (
    <main style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <div className="hud">Yume Creative Lab · Faz 2</div>
      <OfficeCanvas />
    </main>
  );
}
