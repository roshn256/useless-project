import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import chocoMeme from "@/assets/choco-meme.png";
import { toast } from "sonner";
import { getRandomQuote } from "@/components/quotes";

function clamp(n: number, min = 0, max = 100) { return Math.max(min, Math.min(max, n)); }

function computeHangryScore(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const { data } = ctx.getImageData(0, 0, w, h);
  let sum = 0, sumSq = 0;
  for (let i = 0; i < data.length; i += 4) {
    // Perceived luminance
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    sum += l;
    sumSq += l * l;
  }
  const n = data.length / 4;
  const mean = sum / n; // 0..255
  const variance = sumSq / n - mean * mean;
  const std = Math.sqrt(Math.max(variance, 0));

  const meanNorm = mean / 255; // brighter -> less hangry? maybe
  const stdNorm = std / 128;   // higher contrast -> more hangry
  const raw = (stdNorm * 0.7 + (1 - meanNorm) * 0.5) * 100;
  return clamp(Math.round(raw));
}

const thresholds = [
  { max: 35, label: "Chill — snack optional" },
  { max: 65, label: "Mild Visham — time for a bite" },
  { max: 85, label: "Strong Visham — proceed with chocolate" },
  { max: 100, label: "🔥 Visham Detected — Ningal Allandakum!" },
];

export default function HungryDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [label, setLabel] = useState<string>("");
  const [quote, setQuote] = useState<string>(getRandomQuote());

  // Derived label
  const computedLabel = useMemo(() => {
    if (score === null) return "";
    return thresholds.find(t => score <= t.max)?.label ?? thresholds[thresholds.length - 1].label;
  }, [score]);

  useEffect(() => {
    if (score !== null) setLabel(computedLabel);
  }, [score, computedLabel]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      console.error(e);
      toast.error("Camera permission denied. Try uploading a selfie.");
    }
  }

  function stopCamera() {
    const video = videoRef.current;
    const stream = (video?.srcObject as MediaStream) || null;
    stream?.getTracks().forEach(t => t.stop());
    if (video) video.srcObject = null;
    setStreaming(false);
  }

  function loadImageToCanvas(src: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      const { width, height } = img;
      // cover
      const scale = Math.max(256 / width, 256 / height);
      const dw = width * scale;
      const dh = height * scale;
      const dx = (256 - dw) / 2;
      const dy = (256 - dh) / 2;
      ctx.clearRect(0, 0, 256, 256);
      ctx.drawImage(img, dx, dy, dw, dh);
      const s = computeHangryScore(ctx, 256, 256);
      setScore(s);
      setQuote(getRandomQuote());
      toast.success(`Score: ${s}% — ${thresholds.find(t => s <= t.max)?.label}`);
    };
    img.src = src;
  }

  function captureFromVideo() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 256; canvas.height = 256;
    const vw = video.videoWidth, vh = video.videoHeight;
    const scale = Math.max(256 / vw, 256 / vh);
    const dw = vw * scale, dh = vh * scale;
    const dx = (256 - dw) / 2, dy = (256 - dh) / 2;
    ctx.clearRect(0, 0, 256, 256);
    ctx.drawImage(video, dx, dy, dw, dh);
    const s = computeHangryScore(ctx, 256, 256);
    setScore(s);
    setQuote(getRandomQuote());
    toast.success(`Score: ${s}% — ${thresholds.find(t => s <= t.max)?.label}`);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      setImageSrc(dataUrl);
    } catch { /* ignore */ }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      setImageSrc(src);
      loadImageToCanvas(src);
    };
    reader.readAsDataURL(file);
  }

  function shareResult() {
    if (navigator.share && imageSrc) {
      navigator.share({ title: "Vishanal Mood Detector", text: `${score}% — ${label}`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${score}% — ${label} :: ${window.location.href}`).then(() => toast.success("Copied link to clipboard"));
    }
  }

  return (
    <section id="detector" className="mx-auto mt-12 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Hungry-Angry Detector</CardTitle>
          <CardDescription>Use your webcam or upload a selfie. All processing is on-device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera">Webcam</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                <video ref={videoRef} className="aspect-video w-full max-w-xl rounded-lg border" playsInline muted />
                <div className="flex gap-3">
                  {!streaming ? (
                    <Button variant="hero" onClick={startCamera}>Start camera</Button>
                  ) : (
                    <Button variant="destructive" onClick={stopCamera}>Stop</Button>
                  )}
                  <Button variant="choco" onClick={captureFromVideo} disabled={!streaming}>Analyze</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                <input type="file" accept="image/*" onChange={onFileChange} aria-label="Upload selfie" />
                {imageSrc && (
                  <img src={imageSrc} alt="Uploaded selfie preview" className="max-h-64 rounded-md border" />
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Hidden canvas used for analysis */}
          <canvas ref={canvasRef} className="hidden" width={256} height={256} />

          {score !== null && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">Result</h3>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                <div className="mt-4">
                  <Progress value={score} aria-label="Hungry-Angry score" />
                  <div className="mt-2 text-sm font-medium">{score}% Visham</div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="choco" onClick={() => setQuote(getRandomQuote())}>Another roast</Button>
                  <Button variant="hero" onClick={shareResult}>Share</Button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <img src={chocoMeme} alt="Chocolate meme reminder" className="w-full max-w-xs rounded-lg border shadow-sm" loading="lazy" />
                <p className="mt-3 text-center text-sm italic text-muted-foreground">{quote}</p>
              </div>
            </div>
          )}

          {score === null && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Pro tip: better lighting helps the AI judge your mood (kindly).
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
