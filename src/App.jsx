import { useState } from "react";

function App() {
  const [isSharing, setIsSharing] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch("/test.mp4");
      const blob = await response.blob();
      const file = new File([blob], "test.mp4", { type: "video/mp4" });

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        isMobile
      ) {
        await navigator.share({
          title: "Membagikan..",
          text: "Cek video ini!",
          files: [file],
        });
      } else {
        alert("Perangkat ini tidak mendukung share video.");
      }
    } catch (error) {
      console.error("Gagal share:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-2">Share Video via Share API</h1>
      <video
        src="/test.mp4"
        width="300"
        controls
      />
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? "Membagikan..." : "Share ke HP"}
      </button>
    </div>
  );
}

export default App;
