// -----------------------------------------------------------------------------
// Animated thumbnails - pure SVG/CSS loops, one per publication/project.
// Each is a 160×100 abstract "visual fingerprint" you can tie to a paper.
// -----------------------------------------------------------------------------
const { useEffect, useRef, useState } = React;

// shared hook: animation frame clock, returns seconds since mount
function useClock(paused = false) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (paused) return;
    let raf, start;
    const loop = (now) => {
      if (!start) start = now;
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);
  return t;
}

const W = 160;
const H = 100;

const ThumbFrame = ({ children, hover }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    width={W}
    height={H}
    className="thumb-svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="0" y="0" width={W} height={H} fill="var(--thumb-bg)" />
    {children}
    <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="var(--hairline)" />
  </svg>
);

// field: drifting scalar field (great for "self-supervised representations")
function FieldThumb() {
  const t = useClock();
  const cells = [];
  const N = 16, M = 10;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const x = (i + 0.5) * (W / N);
      const y = (j + 0.5) * (H / M);
      const v = Math.sin(i * 0.6 + t * 0.8) * Math.cos(j * 0.5 - t * 0.6);
      const a = 0.12 + 0.55 * (0.5 + 0.5 * v);
      cells.push(
        <circle key={`${i}-${j}`} cx={x} cy={y} r={1.4 + 1.2 * (0.5 + 0.5 * v)} fill="var(--accent)" opacity={a} />
      );
    }
  }
  return <ThumbFrame>{cells}</ThumbFrame>;
}

// graph: nodes and edges wiggling
function GraphThumb() {
  const t = useClock();
  const nodes = [
    [30, 30], [70, 20], [110, 35], [135, 65],
    [95, 75], [55, 70], [20, 60], [80, 50],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[7,1],[7,4],[7,5],[2,7]];
  const pos = nodes.map(([x,y], i) => [
    x + Math.sin(t * 0.9 + i) * 2.5,
    y + Math.cos(t * 0.7 + i * 1.3) * 2.5,
  ]);
  return (
    <ThumbFrame>
      {edges.map(([a,b], k) => (
        <line key={k} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]}
              stroke="var(--muted-2)" strokeWidth="0.8" />
      ))}
      {pos.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 7 ? 3.5 : 2.4}
                fill={i === 7 ? "var(--accent)" : "var(--ink)"} />
      ))}
    </ThumbFrame>
  );
}

// wave: interference pattern (good for "crack segmentation")
function WaveThumb() {
  const t = useClock();
  const paths = [];
  for (let k = 0; k < 5; k++) {
    const pts = [];
    for (let x = 0; x <= W; x += 4) {
      const y = H/2 + Math.sin(x * 0.08 + t * (0.6 + k*0.1) + k) * (6 + k*2);
      pts.push(`${x},${y}`);
    }
    paths.push(
      <polyline key={k} points={pts.join(" ")} fill="none"
                stroke="var(--ink)" strokeOpacity={0.18 + k*0.12} strokeWidth="0.9" />
    );
  }
  return <ThumbFrame>{paths}</ThumbFrame>;
}

// histogram: bars breathing
function HistogramThumb() {
  const t = useClock();
  const N = 18;
  const bars = [];
  for (let i = 0; i < N; i++) {
    const base = Math.exp(-Math.pow((i - N/2) / 4, 2));
    const h = 10 + base * 60 + Math.sin(t * 0.8 + i * 0.3) * 6;
    const x = 10 + i * ((W - 20) / N);
    bars.push(
      <rect key={i} x={x} y={H - 12 - h} width={(W - 20) / N - 2} height={h}
            fill={i === Math.floor(N/2) ? "var(--accent)" : "var(--ink)"}
            opacity={i === Math.floor(N/2) ? 0.9 : 0.55} />
    );
  }
  return (
    <ThumbFrame>
      {bars}
      <line x1="6" y1={H-12} x2={W-6} y2={H-12} stroke="var(--muted-2)" strokeWidth="0.6" />
    </ThumbFrame>
  );
}

// cluster: points orbiting 3 centers
function ClusterThumb() {
  const t = useClock();
  const centers = [[45, 40], [110, 35], [80, 75]];
  const colors = ["var(--accent)", "var(--ink)", "var(--muted-2)"];
  const out = [];
  centers.forEach(([cx, cy], ci) => {
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2 + t * 0.25 * (ci%2 ? 1 : -1);
      const r = 8 + (i % 3) * 3 + Math.sin(t + i) * 1.5;
      out.push(
        <circle key={`${ci}-${i}`} cx={cx + Math.cos(ang) * r} cy={cy + Math.sin(ang) * r}
                r={1.6} fill={colors[ci]} opacity={ci === 0 ? 0.9 : 0.55} />
      );
    }
    out.push(<circle key={`c${ci}`} cx={cx} cy={cy} r="1.2" fill={colors[ci]} />);
  });
  return <ThumbFrame>{out}</ThumbFrame>;
}

// curve: loss curve descending
function CurveThumb() {
  const t = useClock();
  const pts = [];
  for (let x = 0; x <= W-10; x += 2) {
    const prog = x / (W-10);
    const noise = Math.sin(x * 0.4 + t * 2) * (1 - prog) * 6;
    const y = 20 + (1 - prog) * 55 + noise;
    pts.push(`${x+5},${y}`);
  }
  return (
    <ThumbFrame>
      <polyline points={pts.join(" ")} fill="none" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="5" y1="85" x2={W-5} y2="85" stroke="var(--muted-2)" strokeWidth="0.6" />
      <line x1="5" y1="85" x2="5" y2="15" stroke="var(--muted-2)" strokeWidth="0.6" />
    </ThumbFrame>
  );
}

// tokens: text-like LM stream
function TokensThumb() {
  const t = useClock();
  const rows = 5;
  const out = [];
  for (let r = 0; r < rows; r++) {
    let x = 10;
    const seed = r * 7;
    let i = 0;
    while (x < W - 10) {
      const w = 6 + ((seed + i * 3) % 14);
      const active = Math.floor(t * 2 + r) % 7 === i % 7;
      out.push(
        <rect key={`${r}-${i}`} x={x} y={15 + r * 14} width={w} height={5}
              fill={active ? "var(--accent)" : "var(--ink)"} opacity={active ? 0.9 : 0.35} rx="1" />
      );
      x += w + 3;
      i++;
    }
  }
  return <ThumbFrame>{out}</ThumbFrame>;
}

// pulse: ECG-ish sensor pulse
function PulseThumb() {
  const t = useClock();
  const pts = [];
  for (let x = 0; x <= W; x += 1) {
    const phase = (x + (t * 60) % W) % W;
    let y = H/2;
    const local = phase % 40;
    if (local > 18 && local < 22) y -= 20;
    else if (local >= 22 && local < 24) y += 10;
    else if (local >= 24 && local < 26) y -= 4;
    pts.push(`${x},${y}`);
  }
  return (
    <ThumbFrame>
      <polyline points={pts.join(" ")} fill="none" stroke="var(--accent)" strokeWidth="1.2" />
    </ThumbFrame>
  );
}

// tiles: multi-view grid flipping
function TilesThumb() {
  const t = useClock();
  const out = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      const k = i * 3 + j;
      const flip = (Math.sin(t * 0.9 + k) + 1) / 2;
      out.push(
        <rect key={k} x={8 + i * 37} y={8 + j * 29} width={32} height={24}
              fill="var(--ink)" opacity={0.15 + flip * 0.55} />
      );
    }
  }
  return <ThumbFrame>{out}</ThumbFrame>;
}

// contour: concentric topography
function ContourThumb() {
  const t = useClock();
  const rings = [];
  for (let r = 0; r < 7; r++) {
    const rad = 8 + r * 8 + Math.sin(t + r * 0.5) * 1.5;
    rings.push(
      <ellipse key={r} cx={W/2} cy={H/2} rx={rad * 1.4} ry={rad * 0.9}
               fill="none" stroke="var(--ink)" strokeWidth="0.7" strokeOpacity={0.7 - r * 0.08} />
    );
  }
  return <ThumbFrame>{rings}</ThumbFrame>;
}

// noise: animated denoising (half noise, half clean)
function NoiseThumb() {
  const t = useClock();
  const dots = [];
  const N = 240;
  for (let i = 0; i < N; i++) {
    const x = (i * 997) % W;
    const y = (i * 613) % H;
    const prog = (Math.sin(t * 0.8) + 1) / 2;
    const keep = x / W > prog;
    if (!keep) continue;
    dots.push(<rect key={i} x={x} y={y} width="1" height="1" fill="var(--ink)" opacity="0.7" />);
  }
  return (
    <ThumbFrame>
      {dots}
      <line x1={(Math.sin(t * 0.8) + 1) / 2 * W} y1="0"
            x2={(Math.sin(t * 0.8) + 1) / 2 * W} y2={H}
            stroke="var(--accent)" strokeWidth="1" />
    </ThumbFrame>
  );
}

// orbit: meta-learning - tasks orbiting a central model
function OrbitThumb() {
  const t = useClock();
  const out = [];
  const cx = W/2, cy = H/2;
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + t * 0.4;
    const r = 30 + (i % 2) * 8;
    out.push(
      <circle key={i} cx={cx + Math.cos(ang) * r * 1.3} cy={cy + Math.sin(ang) * r * 0.7}
              r="3" fill="var(--ink)" opacity={0.7} />
    );
  }
  out.push(<circle key="c" cx={cx} cy={cy} r="5" fill="var(--accent)" />);
  return <ThumbFrame>{out}</ThumbFrame>;
}

// scan: detection sweep
function ScanThumb() {
  const t = useClock();
  const scan = ((t * 0.35) % 1) * W;
  const boxes = [
    [20, 20, 28, 18],
    [65, 45, 22, 22],
    [110, 30, 26, 16],
    [90, 72, 20, 14],
  ];
  return (
    <ThumbFrame>
      {boxes.map(([x, y, w, h], i) => {
        const hit = Math.abs(scan - (x + w/2)) < 14;
        return (
          <rect key={i} x={x} y={y} width={w} height={h} fill="none"
                stroke={hit ? "var(--accent)" : "var(--muted-2)"}
                strokeWidth={hit ? 1.3 : 0.7} />
        );
      })}
      <line x1={scan} y1="5" x2={scan} y2={H-5} stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="0.8" />
    </ThumbFrame>
  );
}

// split: labeled vs unlabeled split
function SplitThumb() {
  const t = useClock();
  const out = [];
  for (let i = 0; i < 60; i++) {
    const x = 10 + (i * 13) % (W - 20);
    const y = 12 + ((i * 29) % (H - 24));
    const wobble = Math.sin(t + i) * 1.2;
    const labeled = (i % 5 === 0);
    out.push(
      <circle key={i} cx={x + wobble} cy={y} r={labeled ? 2.2 : 1.4}
              fill={labeled ? "var(--accent)" : "var(--muted-2)"}
              opacity={labeled ? 0.95 : 0.55} />
    );
  }
  return <ThumbFrame>{out}</ThumbFrame>;
}

// grid: attention heatmap
function GridThumb() {
  const t = useClock();
  const N = 10, M = 7;
  const cells = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const v = 0.5 + 0.5 * Math.sin(i * 0.5 + j * 0.8 + t);
      cells.push(
        <rect key={`${i}-${j}`} x={8 + i * 14.5} y={8 + j * 12.5} width={13} height={11}
              fill="var(--accent)" opacity={v * 0.85} />
      );
    }
  }
  return <ThumbFrame>{cells}</ThumbFrame>;
}

// ripple: distillation - big model → small model (two concentric ripples)
function RippleThumb() {
  const t = useClock();
  const rings = [];
  for (let r = 0; r < 4; r++) {
    const phase = (t * 0.6 + r * 0.25) % 1;
    rings.push(
      <circle key={r} cx={W/2} cy={H/2} r={8 + phase * 50} fill="none"
              stroke="var(--accent)" strokeWidth="0.9" strokeOpacity={1 - phase} />
    );
  }
  return (
    <ThumbFrame>
      {rings}
      <circle cx={W/2} cy={H/2} r="4" fill="var(--ink)" />
    </ThumbFrame>
  );
}

// series: time-series forecast with forecast cone
function SeriesThumb() {
  const t = useClock();
  const pts = [];
  for (let x = 0; x < W * 0.65; x += 3) {
    pts.push(`${x},${50 + Math.sin(x * 0.1 + t) * 12 + Math.sin(x * 0.05) * 8}`);
  }
  const lastX = W * 0.65;
  const lastY = 50 + Math.sin(lastX * 0.1 + t) * 12 + Math.sin(lastX * 0.05) * 8;
  const cone = `M${lastX},${lastY} L${W-5},${lastY-15} L${W-5},${lastY+15} Z`;
  return (
    <ThumbFrame>
      <path d={cone} fill="var(--accent)" opacity="0.15" />
      <polyline points={pts.join(" ")} fill="none" stroke="var(--ink)" strokeWidth="1.1" />
      <line x1={lastX} y1={lastY} x2={W-5} y2={lastY} stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" />
    </ThumbFrame>
  );
}

// map: country-like shapes shifting hue
function MapThumb() {
  const t = useClock();
  const shapes = [
    "M20,30 L55,20 L65,45 L40,55 Z",
    "M70,25 L100,30 L95,60 L70,55 Z",
    "M105,35 L140,28 L145,70 L115,72 Z",
    "M25,60 L60,65 L55,90 L22,82 Z",
    "M65,65 L100,65 L100,88 L67,85 Z",
    "M105,78 L145,80 L140,95 L108,93 Z",
  ];
  return (
    <ThumbFrame>
      {shapes.map((d, i) => (
        <path key={i} d={d} fill="var(--ink)"
              opacity={0.25 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.7 + i))} />
      ))}
    </ThumbFrame>
  );
}

// latent: latent space clouds blending
function LatentThumb() {
  const t = useClock();
  const pts = [];
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * Math.PI * 2;
    const r = 20 + Math.sin(t + i * 0.3) * 10;
    const x = W/2 + Math.cos(a) * r * 1.5;
    const y = H/2 + Math.sin(a * 2 + t * 0.5) * r * 0.6;
    pts.push(<circle key={i} cx={x} cy={y} r="1.2" fill="var(--accent)" opacity="0.6" />);
  }
  return <ThumbFrame>{pts}</ThumbFrame>;
}

// progress: bar filling across
function ProgressThumb() {
  const t = useClock();
  const p = (Math.sin(t * 0.4) + 1) / 2;
  return (
    <ThumbFrame>
      <rect x="10" y="42" width={W-20} height="16" fill="none" stroke="var(--muted-2)" strokeWidth="0.7" />
      <rect x="10" y="42" width={(W-20) * p} height="16" fill="var(--accent)" opacity="0.85" />
      {[0, 0.25, 0.5, 0.75, 1].map((m, i) => (
        <line key={i} x1={10 + (W-20)*m} y1="36" x2={10 + (W-20)*m} y2="40"
              stroke="var(--muted-2)" strokeWidth="0.6" />
      ))}
    </ThumbFrame>
  );
}

// career-guidance: paper-themed (IEEE SIST 2022) - AI determining career
// guidance for a future university student. A central "student" node
// (ring + accent core) is surrounded by 7 career-option nodes arranged
// in an ellipse. Different shapes (circles/squares/triangles) hint at
// different career categories. Connection lines from student → each
// career encode match-score weight; the AI cycles through, briefly
// recommending one career at a time in accent. Centered both axes.
function CareerGuidanceThumb() {
  const t = useClock();
  const cx = W / 2;
  const cy = H / 2;

  const numCareers = 7;
  const orbitRx = 50;
  const orbitRy = 28;

  const careers = [];
  for (let i = 0; i < numCareers; i++) {
    const angle = -Math.PI / 2 + (i / numCareers) * Math.PI * 2;
    careers.push({
      x: cx + Math.cos(angle) * orbitRx,
      y: cy + Math.sin(angle) * orbitRy,
    });
  }

  const baseScores = [0.4, 0.55, 0.35, 0.6, 0.45, 0.5, 0.42];

  const cyclePeriod = 1.3;
  const recIdx = Math.floor(t / cyclePeriod) % numCareers;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.2;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  return (
    <ThumbFrame>
      {/* student → career match lines */}
      {careers.map((c, i) => {
        const isRec = i === recIdx;
        const baseOp = 0.28 + baseScores[i] * 0.3;
        const op = isRec ? Math.min(1, baseOp + 0.5 * focus) : baseOp;
        const sw = isRec ? 1.0 : 0.5;
        const color = isRec ? "var(--accent)" : "var(--muted-2)";
        return (
          <line key={`l-${i}`}
                x1={cx} y1={cy} x2={c.x} y2={c.y}
                stroke={color} strokeWidth={sw} strokeOpacity={op} />
        );
      })}

      {/* career-option nodes - heterogeneous shapes */}
      {careers.map((c, i) => {
        const isRec = i === recIdx;
        const op = isRec ? 0.6 + 0.35 * focus : 0.55;
        const r = isRec ? 3.2 : 2.4;
        const color = isRec ? "var(--accent)" : "var(--ink)";
        const shapeType = i % 3;
        if (shapeType === 0) {
          return (
            <circle key={`c-${i}`} cx={c.x} cy={c.y} r={r}
                    fill={color} opacity={op} />
          );
        }
        if (shapeType === 1) {
          return (
            <rect key={`c-${i}`}
                  x={c.x - r} y={c.y - r}
                  width={r * 2} height={r * 2}
                  fill={color} opacity={op} rx="0.5" />
          );
        }
        return (
          <polygon key={`c-${i}`}
                   points={`${c.x},${c.y - r - 0.5} ${c.x - r - 0.3},${c.y + r - 0.3} ${c.x + r + 0.3},${c.y + r - 0.3}`}
                   fill={color} opacity={op} />
        );
      })}

      {/* central student profile (ring + accent core) */}
      <circle cx={cx} cy={cy} r="3.6"
              fill="none" stroke="var(--ink)" strokeWidth="1"
              strokeOpacity="0.7" />
      <circle cx={cx} cy={cy} r="1.7"
              fill="var(--accent)" opacity="0.95" />
    </ThumbFrame>
  );
}

// object-detect: paper-themed (CEUR ITTAP 2022) - digital object detection
// on a construction site, top-down view. A site boundary holds an interior
// BIM building footprint and several detected items (rect/circle/triangle
// shapes - vehicles, equipment, materials, workers). Each item is wrapped
// in YOLO-style corner brackets; a vertical AI scan line sweeps left→right
// and intensifies items + brackets as it passes over them. Centered both axes.
function ObjectDetectThumb() {
  const t = useClock();
  const cx = W / 2;
  const cy = H / 2;

  const siteW = 130;
  const siteH = 56;
  const siteX = cx - siteW / 2;     // 15
  const siteY = cy - siteH / 2;     // 22

  // Interior BIM building footprint
  const bldX = siteX + 14;
  const bldY = siteY + 10;
  const bldW = 50;
  const bldH = 36;

  const items = [
    { dx: 80,  dy: 12, shape: "rect",     w: 8, h: 5 },
    { dx: 100, dy: 30, shape: "circle",   r: 3.5 },
    { dx: 110, dy: 46, shape: "triangle", s: 4 },
    { dx: 24,  dy: 20, shape: "rect",     w: 6, h: 4 },
    { dx: 40,  dy: 38, shape: "circle",   r: 2.5 },
  ];

  const scanT = (t * 0.18) % 1;
  const scanX = siteX + scanT * siteW;

  const drawShape = (item, color, opacity) => {
    const x = siteX + item.dx;
    const y = siteY + item.dy;
    if (item.shape === "rect") {
      return <rect x={x - item.w / 2} y={y - item.h / 2}
                   width={item.w} height={item.h}
                   fill={color} opacity={opacity} />;
    }
    if (item.shape === "circle") {
      return <circle cx={x} cy={y} r={item.r}
                     fill={color} opacity={opacity} />;
    }
    return (
      <polygon
        points={`${x},${y - item.s} ${x - item.s},${y + item.s - 1} ${x + item.s},${y + item.s - 1}`}
        fill={color} opacity={opacity} />
    );
  };

  const drawCornerBox = (item, color, opacity, sw) => {
    const x = siteX + item.dx;
    const y = siteY + item.dy;
    const half =
      item.shape === "rect"   ? Math.max(item.w, item.h) / 2 :
      item.shape === "circle" ? item.r :
      item.s;
    const bw = (half + 2) * 2;
    const bh = (half + 2) * 2;
    const bx = x - bw / 2;
    const by = y - bh / 2;
    const L = 2.5;
    return (
      <g fill="none" stroke={color} strokeWidth={sw} strokeOpacity={opacity}>
        <polyline points={`${bx},${by + L} ${bx},${by} ${bx + L},${by}`} />
        <polyline points={`${bx + bw - L},${by} ${bx + bw},${by} ${bx + bw},${by + L}`} />
        <polyline points={`${bx},${by + bh - L} ${bx},${by + bh} ${bx + L},${by + bh}`} />
        <polyline points={`${bx + bw - L},${by + bh} ${bx + bw},${by + bh} ${bx + bw},${by + bh - L}`} />
      </g>
    );
  };

  return (
    <ThumbFrame>
      {/* site boundary (top-down) */}
      <rect x={siteX} y={siteY} width={siteW} height={siteH}
            fill="none" stroke="var(--muted-2)" strokeWidth="0.6"
            strokeOpacity="0.55" />

      {/* interior BIM building footprint */}
      <rect x={bldX} y={bldY} width={bldW} height={bldH}
            fill="none" stroke="var(--muted-2)" strokeWidth="0.5"
            strokeOpacity="0.6" />
      <line x1={bldX + bldW * 0.5} y1={bldY}
            x2={bldX + bldW * 0.5} y2={bldY + bldH}
            stroke="var(--muted-2)" strokeWidth="0.4" strokeOpacity="0.4" />
      <line x1={bldX} y1={bldY + bldH * 0.5}
            x2={bldX + bldW} y2={bldY + bldH * 0.5}
            stroke="var(--muted-2)" strokeWidth="0.4" strokeOpacity="0.4" />

      {/* detected items - shape + corner brackets, intensify near scan */}
      {items.map((item, i) => {
        const x = siteX + item.dx;
        const dist = Math.abs(x - scanX);
        const intensity = Math.max(0, 1 - dist / 12);
        const isHot = intensity > 0.05;
        const itemColor = isHot ? "var(--accent)" : "var(--ink)";
        const itemOp = 0.55 + intensity * 0.4;
        const bColor = isHot ? "var(--accent)" : "var(--muted-2)";
        const bOp = 0.4 + intensity * 0.5;
        const bSw = isHot ? 0.8 : 0.5;
        return (
          <g key={`i-${i}`}>
            {drawShape(item, itemColor, itemOp)}
            {drawCornerBox(item, bColor, bOp, bSw)}
          </g>
        );
      })}

      {/* vertical AI scan line */}
      <line x1={scanX} y1={siteY - 3}
            x2={scanX} y2={siteY + siteH + 3}
            stroke="var(--accent)" strokeWidth="0.5"
            strokeOpacity="0.5" strokeDasharray="2 2" />
    </ThumbFrame>
  );
}

// twin-mirror: paper-themed (CSIT 2022) - BIM + AI integration as a
// physical-virtual mirror. Top half: solid ink silhouettes (physical
// site objects). Bottom half: their wireframe BIM twins in accent
// (with cross hairlines for the digital model). A horizontal accent
// dashed mirror line separates the two layers; a slow vertical sync
// scanner sweeps left→right, briefly intensifying both an object and
// its twin as it passes - synchronisation between reality and BIM.
function TwinMirrorThumb() {
  const t = useClock();
  const cy = 50;

  const scanT = (t * 0.18) % 1;
  const scanX = 8 + scanT * (W - 16);

  // Construction-site scene: tower crane on the left + building under
  // construction on the right. Drawn twice - physical (above mirror, ink,
  // filled) and BIM digital twin (below mirror, accent wireframe with
  // BIM grid lines). sign=-1 → physical, sign=+1 → twin.
  const drawScene = (sign, color, opacity, isPhysical) => {
    const mastX = 33;
    const cabinY = cy + sign * 26;
    const baseY = cy + sign * 2;
    const jibEndX = mastX + 32;
    const counterEndX = mastX - 10;
    const cableX = jibEndX - 8;
    const cableEndY = cabinY + (-sign) * 12;

    const bldX = 83;
    const bldW = 56;
    const bldNear = cy + sign * 2;
    const bldFar = cy + sign * 22;
    const bldTop = Math.min(bldNear, bldFar);
    const bldH = Math.abs(bldFar - bldNear);
    const cutTop = bldTop;          // missing top-right corner - under construction

    return (
      <g>
        {/* Tower crane - mast */}
        <line x1={mastX} y1={baseY} x2={mastX} y2={cabinY}
              stroke={color} strokeWidth="1.4" strokeOpacity={opacity} />
        {/* Crane base footprint */}
        <rect x={mastX - 4} y={baseY - sign * 2}
              width={8} height={2}
              fill={isPhysical ? color : "none"}
              stroke={isPhysical ? "none" : color}
              strokeWidth={isPhysical ? 0 : 0.5}
              opacity={opacity} />
        {/* Jib (long arm) */}
        <line x1={mastX} y1={cabinY} x2={jibEndX} y2={cabinY}
              stroke={color} strokeWidth="1.2" strokeOpacity={opacity} />
        {/* Counter-jib (short arm opposite) */}
        <line x1={mastX} y1={cabinY} x2={counterEndX} y2={cabinY}
              stroke={color} strokeWidth="1.2" strokeOpacity={opacity} />
        {/* Counter-weight */}
        <rect x={counterEndX - 2.5} y={cabinY - 1.5}
              width={2.5} height={3}
              fill={isPhysical ? color : "none"}
              stroke={isPhysical ? "none" : color}
              strokeWidth={isPhysical ? 0 : 0.5}
              opacity={opacity} />
        {/* Hook cable */}
        <line x1={cableX} y1={cabinY} x2={cableX} y2={cableEndY}
              stroke={color} strokeWidth="0.5" strokeOpacity={opacity * 0.85} />
        {/* Hook */}
        <circle cx={cableX} cy={cableEndY} r="1.3"
                fill={isPhysical ? color : "none"}
                stroke={color} strokeWidth={isPhysical ? 0 : 0.5}
                opacity={opacity} />

        {/* Building under construction */}
        {isPhysical ? (
          <rect x={bldX} y={bldTop} width={bldW} height={bldH}
                fill={color} opacity={opacity * 0.55} />
        ) : (
          <rect x={bldX} y={bldTop} width={bldW} height={bldH}
                fill="none" stroke={color} strokeWidth="0.7"
                strokeOpacity={opacity} />
        )}

        {/* Floor lines (BIM stories) */}
        {[1, 2].map((i) => (
          <line key={`f-${i}`}
                x1={bldX} y1={bldTop + i * (bldH / 3)}
                x2={bldX + bldW} y2={bldTop + i * (bldH / 3)}
                stroke={isPhysical ? "var(--bg)" : color}
                strokeWidth="0.5"
                strokeOpacity={isPhysical ? 0.7 : opacity * 0.55} />
        ))}

        {/* Vertical column lines (BIM grid - twin only) */}
        {!isPhysical &&
          [1, 2, 3].map((i) => (
            <line key={`v-${i}`}
                  x1={bldX + i * (bldW / 4)} y1={bldTop}
                  x2={bldX + i * (bldW / 4)} y2={bldTop + bldH}
                  stroke={color} strokeWidth="0.4"
                  strokeOpacity={opacity * 0.45} />
          ))}

        {/* "Under construction" cue: missing top-right corner on physical bldg */}
        {isPhysical && (
          <rect x={bldX + bldW * 0.55} y={cutTop}
                width={bldW * 0.45} height={3.5}
                fill="var(--bg)" />
        )}
      </g>
    );
  };

  return (
    <ThumbFrame>
      {/* mirror line - physical/digital boundary */}
      <line x1={6} y1={cy} x2={W - 6} y2={cy}
            stroke="var(--accent)" strokeWidth="0.5"
            strokeDasharray="2 1.5" strokeOpacity="0.55" />

      {/* physical site - ink, filled */}
      {drawScene(-1, "var(--ink)", 0.7, true)}

      {/* digital twin - accent, wireframe + BIM grid */}
      {drawScene(+1, "var(--accent)", 0.7, false)}

      {/* sync scanner - vertical accent line bridging the two layers */}
      <line x1={scanX} y1={cy - 32} x2={scanX} y2={cy + 32}
            stroke="var(--accent)" strokeWidth="0.5"
            strokeOpacity="0.4" strokeDasharray="1 1.2" />
    </ThumbFrame>
  );
}

// bim-scan: paper-themed (IEEE SIST 2023) - multi-stage AI + BIM analysis
// of construction-site objects. A BIM site grid (8×5 cells, hairlines)
// is swept diagonally by an AI scan front. As the front passes over a
// cell, it briefly highlights in accent (active analysis); behind it,
// cells settle into either accent-filled "object detected" or a subtle
// ink-filled "empty" state. The scan cycles continuously. Centered both
// axes; calm sweep - no in-place pulsation.
function BimScanThumb() {
  const t = useClock();
  const cx = W / 2;
  const cy = H / 2;

  const cols = 8, rows = 5;
  const cellSize = 10;
  const gridW = cols * cellSize;       // 80
  const gridH = rows * cellSize;       // 50
  const gridX = cx - gridW / 2;        // 40
  const gridY = cy - gridH / 2;        // 25

  // Cells where the AI eventually identifies an object
  const objectCells = new Set([
    "1-1", "2-1", "1-2",   // building cluster
    "5-0", "5-1",          // tall structure
    "3-3", "4-3",          // ground objects
    "7-2",                 // scattered piece
  ]);

  // Diagonal scan front parameter
  const cyclePeriod = 3.4;
  const cyclePhase = (t / cyclePeriod) % 1;
  // Slightly overshoot so the trailing state holds for a moment before reset
  const scanProgress = Math.min(1, cyclePhase * 1.18);
  const maxFront = cols + rows * 0.6 - 1;
  const scanFront = scanProgress * maxFront;

  const cellState = (c, r) => {
    const pos = c + r * 0.6;
    const lead = scanFront - pos;
    if (lead < -0.45) return { state: "raw", progress: 0 };
    if (lead < 0.45)
      return { state: "active", progress: 1 - Math.abs(lead) / 0.45 };
    return { state: "processed", progress: 1 };
  };

  return (
    <ThumbFrame>
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const { state, progress } = cellState(c, r);
          const isObject = objectCells.has(`${c}-${r}`);
          const x = gridX + c * cellSize + 0.5;
          const y = gridY + r * cellSize + 0.5;
          const w = cellSize - 1;
          const h = cellSize - 1;

          // Always render the BIM hairline grid
          const hairline = (
            <rect x={x} y={y} width={w} height={h}
                  fill="none" stroke="var(--muted-2)"
                  strokeWidth="0.4" strokeOpacity="0.3" />
          );

          let overlay = null;
          if (state === "active") {
            overlay = (
              <rect x={x} y={y} width={w} height={h}
                    fill={isObject ? "var(--accent)" : "none"}
                    fillOpacity={isObject ? 0.45 * progress : 0}
                    stroke="var(--accent)" strokeWidth="0.7"
                    strokeOpacity={0.65 * progress} />
            );
          } else if (state === "processed") {
            overlay = isObject ? (
              <rect x={x} y={y} width={w} height={h}
                    fill="var(--accent)" fillOpacity="0.55" />
            ) : (
              <rect x={x} y={y} width={w} height={h}
                    fill="var(--ink)" fillOpacity="0.1" />
            );
          }

          return (
            <g key={`${c}-${r}`}>
              {hairline}
              {overlay}
            </g>
          );
        })
      )}
    </ThumbFrame>
  );
}

// build-stages: paper-themed (IOP ICSF 2023) - a multi-stage information
// system progressively assembles the model of a building. A 7×6 cell
// grid composes a recognisable house silhouette; cells are added in
// 4 stages (foundation → side walls → interior → roof). Each cycle the
// most-recently-added cells highlight in accent, then the hold-complete
// stage shows the finished structure. Composition centered both axes.
function BuildStagesThumb() {
  const t = useClock();
  const cx = W / 2;
  const cy = H / 2;

  const cellSize = 9;
  const cols = 7, rows = 6;
  const gridW = cols * cellSize;
  const gridH = rows * cellSize;
  const gridX = cx - gridW / 2;
  const gridY = cy - gridH / 2;

  // Map "col-row" → stage index
  const cellStage = {};
  // Stage 0: foundation (bottom row)
  for (let c = 0; c < cols; c++) cellStage[`${c}-5`] = 0;
  // Stage 1: side walls / pillars
  [2, 3, 4].forEach((r) => {
    cellStage[`0-${r}`] = 1;
    cellStage[`6-${r}`] = 1;
  });
  // Stage 2: interior structure (center pillar + floor row)
  cellStage["3-3"] = 2;
  cellStage["2-4"] = 2;
  cellStage["3-4"] = 2;
  cellStage["4-4"] = 2;
  // Stage 3: roof (slope + tip)
  ["1-1", "2-1", "3-1", "4-1", "5-1"].forEach((k) => (cellStage[k] = 3));
  ["2-0", "3-0", "4-0"].forEach((k) => (cellStage[k] = 3));

  // Cycle: stages 0..3 build, stage 4 holds the complete structure
  const cyclePeriod = 1.0;
  const totalSteps = 5;
  const currentStep = Math.floor(t / cyclePeriod) % totalSteps;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.18;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  const highestVisibleStage = Math.min(currentStep, 3);

  return (
    <ThumbFrame>
      {Object.entries(cellStage).map(([key, stage]) => {
        if (stage > highestVisibleStage) return null;
        const [c, r] = key.split("-").map(Number);
        const isJustAdded = stage === currentStep && currentStep <= 3;
        const op = isJustAdded ? 0.45 + 0.45 * focus : 0.6;
        const color = isJustAdded ? "var(--accent)" : "var(--ink)";
        return (
          <rect key={key}
                x={gridX + c * cellSize + 0.5}
                y={gridY + r * cellSize + 0.5}
                width={cellSize - 1}
                height={cellSize - 1}
                fill={color}
                opacity={op} />
        );
      })}
    </ThumbFrame>
  );
}

// vr-tam: paper-themed (CEUR ITPM 2024) - VR adoption mapped onto a
// 3D-perspective tunnel. Four corner rays converge to a vanishing point
// at the canvas center, and 4 nested rectangles sit at progressively
// deeper depths - each representing a stage of the extended Technology
// Acceptance Model (PU → Attitude → Intention → Use). One stage cycles
// in accent (active adoption stage). Composition centered both axes.
function VrTamThumb() {
  const t = useClock();
  const cx = W / 2;
  const cy = 46;     // panels' vertical center; room for TAM dots below

  // Two overlapping rounded "eye panels" - the universal stereoscopic VR
  // motif. Inside each, the same 3D wireframe cube is rendered with a
  // small horizontal stereo offset (left vs right eye view), and the cube
  // slowly rotates. Below the panels, 4 small dots cycle in accent —
  // the 4 stages of the extended Technology Acceptance Model.
  const panelW = 50;
  const panelH = 44;
  const overlap = 16;
  const leftCx = cx - (panelW - overlap) / 2;
  const rightCx = cx + (panelW - overlap) / 2;
  const panelY = cy - panelH / 2;

  // Wireframe cube - 3D rotation around y-axis, with simple perspective
  const angle = t * 0.4;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const cubeSize = 14;
  const cubeDepth = 11;

  const projectCube = (cxLocal, stereoEye) => {
    const s = cubeSize / 2;
    const d = cubeDepth / 2;
    const project = (px, py, pz) => {
      const rx = px * cosA + pz * sinA;
      const rz = -px * sinA + pz * cosA;
      const yShift = -rz * 0.25;
      // Slight stereo parallax: front (rz<0) shifts more than back
      const parallax = stereoEye * (0.55 - rz * 0.045);
      return [cxLocal + rx + parallax, cy + py + yShift];
    };
    return [
      project(-s, -s, -d), project( s, -s, -d),
      project( s,  s, -d), project(-s,  s, -d),
      project(-s, -s,  d), project( s, -s,  d),
      project( s,  s,  d), project(-s,  s,  d),
    ];
  };

  const cubeEdges = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ];

  const drawCube = (verts, color, opacity, key) => (
    <g key={key} stroke={color} fill="none" strokeWidth="0.75"
       strokeOpacity={opacity} strokeLinecap="round">
      {cubeEdges.map(([a, b], k) => (
        <line key={k}
              x1={verts[a][0]} y1={verts[a][1]}
              x2={verts[b][0]} y2={verts[b][1]} />
      ))}
    </g>
  );

  const leftVerts = projectCube(leftCx, -1);
  const rightVerts = projectCube(rightCx, +1);

  // TAM stages indicator
  const tamY = 82;
  const tamSpacing = 12;
  const tamLeft = cx - (3 * tamSpacing) / 2;
  const cyclePeriod = 1.5;
  const activeStage = Math.floor(t / cyclePeriod) % 4;

  return (
    <ThumbFrame>
      {/* Left eye panel */}
      <rect x={leftCx - panelW / 2} y={panelY}
            width={panelW} height={panelH} rx="9"
            fill="none" stroke="var(--muted-2)" strokeWidth="0.7"
            strokeOpacity="0.55" />

      {/* Right eye panel */}
      <rect x={rightCx - panelW / 2} y={panelY}
            width={panelW} height={panelH} rx="9"
            fill="none" stroke="var(--muted-2)" strokeWidth="0.7"
            strokeOpacity="0.55" />

      {/* Wireframe cubes - left in ink, right in accent (stereo content) */}
      {drawCube(leftVerts, "var(--ink)", 0.6, "L")}
      {drawCube(rightVerts, "var(--accent)", 0.75, "R")}

      {/* TAM stage dots - current stage in accent */}
      <line x1={tamLeft - 4} y1={tamY} x2={tamLeft + 3 * tamSpacing + 4} y2={tamY}
            stroke="var(--muted-2)" strokeOpacity="0.3" strokeWidth="0.4" />
      {[0, 1, 2, 3].map((i) => {
        const x = tamLeft + i * tamSpacing;
        const isActive = i === activeStage;
        return (
          <circle key={`tam-${i}`} cx={x} cy={tamY}
                  r={isActive ? 2.2 : 1.4}
                  fill={isActive ? "var(--accent)" : "var(--muted-2)"}
                  opacity={isActive ? 0.95 : 0.5} />
        );
      })}
    </ThumbFrame>
  );
}

// urban-lora: paper-themed (CEUR ITPM 2024) - LoRa + GAN urban planning.
// A city-block grid (mostly muted ink cells) with a few accent cells
// outlined in dashed accent - "GAN-generated" planning proposals. Four
// LoRa sensor nodes sit at strategic positions, each emitting two
// continuously-expanding accent ping rings (wireless transmissions),
// and a faint dashed mesh links the sensors (LoRa network topology).
// Composition centered both axes; calm continuous motion.
function UrbanLoraThumb() {
  const t = useClock();

  // Centered city-block grid
  const cols = 6, rows = 4;
  const cellW = 18, cellH = 13;
  const gridW = cols * cellW;          // 108
  const gridH = rows * cellH;          // 52
  const gridX = (W - gridW) / 2;       // 26
  const gridY = (H - gridH) / 2;       // 24

  const ganCells = new Set(["1-1", "3-2", "4-1", "2-3"]);

  const sensors = [
    { x: gridX + 1.5 * cellW, y: gridY + 0.7 * cellH, phase: 0.0 },
    { x: gridX + 4.2 * cellW, y: gridY + 1.5 * cellH, phase: 1.6 },
    { x: gridX + 0.6 * cellW, y: gridY + 3.3 * cellH, phase: 3.1 },
    { x: gridX + 4.9 * cellW, y: gridY + 3.4 * cellH, phase: 4.6 },
  ];

  // Continuous LoRa ping rings (two rings per sensor, half-cycle offset)
  const ringPeriod = 2.4;
  const rings = sensors.flatMap((s, si) => {
    const out = [];
    for (let k = 0; k < 2; k++) {
      const phase = ((t / ringPeriod) + s.phase + k * 0.5) % 1;
      const radius = 4 + phase * 18;
      const opacity = (1 - phase) * 0.55;
      out.push(
        <circle key={`r-${si}-${k}`}
                cx={s.x} cy={s.y} r={radius}
                fill="none" stroke="var(--accent)"
                strokeWidth="0.5" strokeOpacity={opacity} />
      );
    }
    return out;
  });

  return (
    <ThumbFrame>
      {/* City-block grid - generic muted cells + accent GAN-generated cells */}
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const isGan = ganCells.has(`${c}-${r}`);
          return (
            <rect key={`${c}-${r}`}
                  x={gridX + c * cellW + 0.5}
                  y={gridY + r * cellH + 0.5}
                  width={cellW - 1} height={cellH - 1}
                  fill={isGan ? "var(--accent)" : "var(--ink)"}
                  opacity={isGan ? 0.45 : 0.12}
                  stroke={isGan ? "var(--accent)" : "var(--muted-2)"}
                  strokeWidth="0.4"
                  strokeOpacity={isGan ? 0.7 : 0.4}
                  strokeDasharray={isGan ? "1.5 1" : "none"} />
          );
        })
      )}

      {/* LoRa mesh - dashed accent links between sensors */}
      {sensors.map((s, i) => {
        const next = sensors[(i + 1) % sensors.length];
        return (
          <line key={`m-${i}`}
                x1={s.x} y1={s.y} x2={next.x} y2={next.y}
                stroke="var(--accent)" strokeWidth="0.4"
                strokeOpacity="0.28" strokeDasharray="2 1.5" />
        );
      })}

      {/* LoRa ping rings */}
      {rings}

      {/* Sensor nodes */}
      {sensors.map((s, i) => (
        <circle key={`s-${i}`} cx={s.x} cy={s.y} r="2"
                fill="var(--accent)" opacity="0.95" />
      ))}
    </ThumbFrame>
  );
}

// threat-detect: paper-themed (IEEE SIST 2024) - neural-network threat
// detection in network-traffic streams. Four horizontal signal channels
// run noisy oscillations (normal traffic). One anomaly spike travels
// across the canvas, hopping between channels each cycle: the affected
// segment turns accent and an attention bracket flags the threat above
// the spike. Composition centered both axes; calm motion.
function ThreatDetectThumb() {
  const t = useClock();

  const channels = [
    { y: 26, freq: 0.18, phase: 0.0 },
    { y: 42, freq: 0.22, phase: 1.5 },
    { y: 58, freq: 0.15, phase: 3.0 },
    { y: 74, freq: 0.20, phase: 4.5 },
  ];

  const xLeft = 12, xRight = W - 12;
  const xRange = xRight - xLeft;

  // Anomaly cycles through channels; within each cycle it sweeps left→right
  const cyclePeriod = 2.5;
  const anomalyChannelIdx = Math.floor(t / cyclePeriod) % channels.length;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const anomalyX = xLeft + 0.1 * xRange + phase * 0.8 * xRange;
  const anomalyVis =
    phase < 0.12 ? phase / 0.12 :
    phase > 0.88 ? (1 - phase) / 0.12 :
    1;

  const signalPath = (ch, ci) => {
    const pts = [];
    for (let x = xLeft; x <= xRight; x += 2) {
      const noise =
        Math.sin(x * ch.freq + t * 0.5 + ch.phase) * 2.6 +
        Math.cos(x * ch.freq * 0.7 + t * 0.3 + ch.phase) * 1.8;
      let spike = 0;
      if (ci === anomalyChannelIdx) {
        const dist = x - anomalyX;
        spike = -8 * Math.exp(-(dist * dist) / 14) * anomalyVis;
      }
      pts.push(`${x},${ch.y + noise + spike}`);
    }
    return pts.join(" ");
  };

  // Active channel signal split: normal segments (ink) + anomaly window (accent)
  const anomalyHalf = 12;

  return (
    <ThumbFrame>
      {/* channel baselines */}
      {channels.map((ch, i) => (
        <line key={`b-${i}`}
              x1={xLeft} y1={ch.y} x2={xRight} y2={ch.y}
              stroke="var(--muted-2)" strokeOpacity="0.2" strokeWidth="0.3" />
      ))}

      {/* normal channels (ink) */}
      {channels.map((ch, i) =>
        i === anomalyChannelIdx ? null : (
          <polyline key={`n-${i}`}
                    points={signalPath(ch, i)}
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="0.9"
                    strokeOpacity="0.45" />
        )
      )}

      {/* active channel - full path in ink first (so accent overlays nicely) */}
      <polyline points={signalPath(channels[anomalyChannelIdx], anomalyChannelIdx)}
                fill="none" stroke="var(--ink)" strokeWidth="0.9"
                strokeOpacity="0.32" />
      {/* accent overlay on the anomaly window only via clipPath-free trick:
          paint the same signal with accent and clip via a stroked line within
          the anomaly window - done with a small filled accent rect mask.
          Simpler: re-render the local segment in accent. */}
      {(() => {
        const ch = channels[anomalyChannelIdx];
        const start = Math.max(xLeft, anomalyX - anomalyHalf);
        const end = Math.min(xRight, anomalyX + anomalyHalf);
        const pts = [];
        for (let x = start; x <= end; x += 1) {
          const noise =
            Math.sin(x * ch.freq + t * 0.5 + ch.phase) * 2.6 +
            Math.cos(x * ch.freq * 0.7 + t * 0.3 + ch.phase) * 1.8;
          const dist = x - anomalyX;
          const spike = -8 * Math.exp(-(dist * dist) / 14) * anomalyVis;
          pts.push(`${x},${ch.y + noise + spike}`);
        }
        return (
          <polyline points={pts.join(" ")} fill="none"
                    stroke="var(--accent)" strokeWidth="1.2"
                    strokeOpacity={0.85 * anomalyVis} />
        );
      })()}

      {/* threat-detection bracket above the anomaly */}
      {(() => {
        const ch = channels[anomalyChannelIdx];
        const bx = anomalyX;
        const bw = 18;
        const by = ch.y - 14;
        const op = anomalyVis * 0.85;
        return (
          <g fill="none" stroke="var(--accent)" strokeWidth="0.8" strokeOpacity={op}>
            <polyline points={`${bx - bw / 2},${by + 3} ${bx - bw / 2},${by} ${bx - bw / 2 + 3},${by}`} />
            <polyline points={`${bx + bw / 2 - 3},${by} ${bx + bw / 2},${by} ${bx + bw / 2},${by + 3}`} />
            <circle cx={bx} cy={by - 1.5} r="1.6" fill="var(--accent)" opacity={op} stroke="none" />
          </g>
        );
      })()}
    </ThumbFrame>
  );
}

// yolo-progression: paper-themed (CEUR ITTAP 2024) - a "study" of YOLOv8,
// YOLOv9, YOLOv10 plotted as a 2D scatter (speed × accuracy). Three model
// points form a clear progression toward the upper-right; a dashed accent
// line traces v8 → v9 → v10. v10 is intrinsically larger and accent (best
// model). A soft cycling halo orbits between the three points to call
// each out in turn. Composition centered both axes; no in-place pulsation.
function YoloProgressionThumb() {
  const t = useClock();

  // Plot bounds - centered on canvas
  const px1 = 30, px2 = 130;     // x range (centered on cx=80)
  const py1 = 76, py2 = 24;      // y range (py1 bottom, py2 top; center=50)

  const models = [
    { rx: 0.28, ry: 0.30, accent: false },  // v8
    { rx: 0.55, ry: 0.58, accent: false },  // v9
    { rx: 0.82, ry: 0.86, accent: true  },  // v10 - best
  ];
  const points = models.map((m) => ({
    ...m,
    x: px1 + m.rx * (px2 - px1),
    y: py1 - m.ry * (py1 - py2),
  }));

  const cyclePeriod = 1.4;
  const activeIdx = Math.floor(t / cyclePeriod) % 3;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.22;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  const active = points[activeIdx];

  return (
    <ThumbFrame>
      {/* axes */}
      <line x1={px1} y1={py1} x2={px2} y2={py1}
            stroke="var(--muted-2)" strokeWidth="0.4" strokeOpacity="0.45" />
      <line x1={px1} y1={py1} x2={px1} y2={py2}
            stroke="var(--muted-2)" strokeWidth="0.4" strokeOpacity="0.45" />

      {/* tick marks */}
      {[0.25, 0.5, 0.75, 1.0].map((m, i) => (
        <g key={`g-${i}`}>
          <line x1={px1 + m * (px2 - px1)} y1={py1}
                x2={px1 + m * (px2 - px1)} y2={py1 + 2}
                stroke="var(--muted-2)" strokeOpacity="0.4" strokeWidth="0.4" />
          <line x1={px1 - 2} y1={py1 - m * (py1 - py2)}
                x2={px1} y2={py1 - m * (py1 - py2)}
                stroke="var(--muted-2)" strokeOpacity="0.4" strokeWidth="0.4" />
        </g>
      ))}

      {/* progression path v8 → v9 → v10 */}
      <polyline points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none" stroke="var(--accent)" strokeWidth="0.7"
                strokeOpacity="0.5" strokeDasharray="2 1.5" />

      {/* halo around currently-active model */}
      <circle cx={active.x} cy={active.y} r={7}
              fill="var(--accent)" opacity={0.16 * focus} />
      <circle cx={active.x} cy={active.y} r={4.5}
              fill="none" stroke="var(--accent)" strokeWidth="0.6"
              strokeOpacity={0.5 * focus} />

      {/* model points (v10 always brighter & larger as the winner) */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y}
                r={p.accent ? 3.3 : 2.7}
                fill={p.accent ? "var(--accent)" : "var(--ink)"}
                opacity={p.accent ? 0.92 : 0.7} />
      ))}
    </ThumbFrame>
  );
}

// yolo-classes: paper-themed (CEUR ITTAP 2024) - YOLOv5 3-class
// recognition (Equipment / Tool / Vehicle) on a construction site.
// Three horizontal "class lanes" carry small items left→right at
// different speeds - squares (equipment), circles (tools), triangles
// (vehicles). A few items per lane render in accent to suggest fresh
// high-confidence detections. Composition centered both axes.
function YoloClassesThumb() {
  const t = useClock();

  const xLeft = 12;
  const xRight = W - 12;
  const xRange = xRight - xLeft;

  const lanes = [
    { y: 30, shape: "square",   count: 5, speed: 0.060, phase: 0.0 },
    { y: 50, shape: "circle",   count: 6, speed: 0.075, phase: 0.35 },
    { y: 70, shape: "triangle", count: 5, speed: 0.050, phase: 0.7 },
  ];

  const items = [];
  lanes.forEach((lane, li) => {
    for (let i = 0; i < lane.count; i++) {
      const fraction =
        ((i / lane.count) + t * lane.speed + lane.phase) % 1;
      const x = xLeft + fraction * xRange;
      const isAccent = i % lane.count === ((li + 1) % lane.count);
      items.push({
        key: `${li}-${i}`, x, y: lane.y, shape: lane.shape, isAccent,
      });
    }
  });

  return (
    <ThumbFrame>
      {/* lane baselines (subtle) */}
      {lanes.map((lane, i) => (
        <line key={`l-${i}`}
              x1={xLeft} y1={lane.y} x2={xRight} y2={lane.y}
              stroke="var(--muted-2)" strokeOpacity="0.22" strokeWidth="0.4" />
      ))}

      {/* class items flowing */}
      {items.map(({ key, x, y, shape, isAccent }) => {
        const color = isAccent ? "var(--accent)" : "var(--ink)";
        const op = isAccent ? 0.92 : 0.65;
        const size = 2.7;
        if (shape === "square") {
          return (
            <rect key={key}
                  x={x - size} y={y - size}
                  width={size * 2} height={size * 2}
                  fill={color} opacity={op} rx="0.4" />
          );
        }
        if (shape === "triangle") {
          return (
            <polygon key={key}
                     points={`${x},${y - size - 0.6} ${x - size - 0.4},${y + size - 0.3} ${x + size + 0.4},${y + size - 0.3}`}
                     fill={color} opacity={op} />
          );
        }
        return (
          <circle key={key} cx={x} cy={y} r={size}
                  fill={color} opacity={op} />
        );
      })}
    </ThumbFrame>
  );
}

// site-yolo: paper-themed (DTESI 2024) - YOLOv5 multi-object detection
// on a construction site for resource + safety analysis. A ground line
// at the bottom anchors a scene; multiple detected objects sit above
// it as YOLO-style corner-bracket bboxes of varying sizes (resources
// in ink, safety alerts in accent). One detection cycles in focus to
// suggest real-time tracking. Composition centered both axes.
function SiteYoloThumb() {
  const t = useClock();

  // Multi-object tracking timeline (Gantt-style): each horizontal lane is
  // one tracked object on the construction site. Solid segments mark when
  // it is present (utilization). Two lanes are "safety" tracks shown in
  // accent, with safety-event dots layered on top. A slow time cursor
  // sweeps left→right (current time). Composition centered both axes.

  const xLeft = 12;
  const xRight = W - 12;
  const xRange = xRight - xLeft;

  const lanes = [
    { y: 22, segments: [[0.05, 0.78]],                events: [],     type: "resource" },
    { y: 33, segments: [[0.12, 0.48], [0.58, 0.95]],  events: [],     type: "resource" },
    { y: 44, segments: [[0.0,  0.92]],                events: [0.65], type: "safety"   },
    { y: 55, segments: [[0.20, 0.96]],                events: [],     type: "resource" },
    { y: 66, segments: [[0.0,  0.36], [0.46, 0.72]],  events: [0.30], type: "safety"   },
    { y: 77, segments: [[0.28, 1.0]],                 events: [],     type: "resource" },
  ];

  const cursorT = (t * 0.15) % 1;
  const cursorX = xLeft + cursorT * xRange;

  return (
    <ThumbFrame>
      {/* lane backgrounds */}
      {lanes.map((lane, i) => (
        <g key={`l-${i}`}>
          <line x1={xLeft} y1={lane.y} x2={xRight} y2={lane.y}
                stroke="var(--muted-2)" strokeWidth="0.4" strokeOpacity="0.28" />
        </g>
      ))}

      {/* presence segments */}
      {lanes.flatMap((lane, i) =>
        lane.segments.map(([s, e], j) => {
          const isSafety = lane.type === "safety";
          return (
            <line key={`s-${i}-${j}`}
                  x1={xLeft + s * xRange} y1={lane.y}
                  x2={xLeft + e * xRange} y2={lane.y}
                  stroke={isSafety ? "var(--accent)" : "var(--ink)"}
                  strokeWidth="2.4"
                  strokeOpacity={isSafety ? 0.85 : 0.5}
                  strokeLinecap="round" />
          );
        })
      )}

      {/* safety-event markers */}
      {lanes.flatMap((lane, i) =>
        lane.events.map((e, j) => (
          <circle key={`e-${i}-${j}`}
                  cx={xLeft + e * xRange} cy={lane.y} r="2.4"
                  fill="var(--accent)" opacity="0.95" />
        ))
      )}

      {/* slow time cursor */}
      <line x1={cursorX} y1={16} x2={cursorX} y2={84}
            stroke="var(--accent)" strokeWidth="0.5"
            strokeOpacity="0.5" strokeDasharray="2 2" />
    </ThumbFrame>
  );
}

// preprocess: paper-themed (MDCS 2025) - image pre-processing for object
// recognition. A single central image grid cycles through 4 stages —
// raw noise → smoothed Gaussian → edge contour → recognized object —
// while a step indicator below tracks the active stage. Trapezoidal
// fade between stages, no in-place pulsation. Centered both axes.
function PreprocessThumb() {
  const t = useClock();
  const cx = W / 2;

  // Image grid (centered)
  const cols = 9, rows = 6;
  const cellSize = 7;
  const gridW = cols * cellSize;     // 63
  const gridH = rows * cellSize;     // 42
  const gridX = cx - gridW / 2;      // 48.5
  const gridY = 22;

  const cyclePeriod = 1.5;
  const stageIdx = Math.floor(t / cyclePeriod) % 4;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.18;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  const cellAppearance = (c, r, stage) => {
    const dx = c - (cols - 1) / 2;
    const dy = r - (rows - 1) / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (stage === 0) {
      const seed = c * 7 + r * 13;
      return {
        intensity: 0.55 * (Math.sin(seed * 17.3) * 0.5 + 0.5),
        useAccent: false,
      };
    }
    if (stage === 1) {
      return {
        intensity: 0.85 * Math.exp(-(dist * dist) / 6),
        useAccent: false,
      };
    }
    if (stage === 2) {
      const ringDist = Math.abs(dist - 2.4);
      return {
        intensity: ringDist < 0.85 ? 0.85 : 0.08,
        useAccent: ringDist < 0.85,
      };
    }
    // stage 3: recognized object - central cluster + dim halo
    return {
      intensity: dist < 1.6 ? 0.9 : dist < 2.7 ? 0.35 : 0.06,
      useAccent: dist < 1.6,
    };
  };

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const app = cellAppearance(c, r, stageIdx);
      cells.push(
        <rect key={`${c}-${r}`}
              x={gridX + c * cellSize + 0.4}
              y={gridY + r * cellSize + 0.4}
              width={cellSize - 0.8}
              height={cellSize - 0.8}
              fill={app.useAccent ? "var(--accent)" : "var(--ink)"}
              opacity={0.06 + app.intensity * 0.7 * focus} />
      );
    }
  }

  // Step indicator (4 dots) below the grid
  const stepY = 76;
  const stepGap = 12;
  const stepLeft = cx - (3 * stepGap) / 2;
  const stepDots = [];
  for (let i = 0; i < 4; i++) {
    const x = stepLeft + i * stepGap;
    const isCurrent = i === stageIdx;
    stepDots.push(
      <circle key={`step-${i}`} cx={x} cy={stepY}
              r={isCurrent ? 2.2 : 1.4}
              fill={isCurrent ? "var(--accent)" : "var(--muted-2)"}
              opacity={isCurrent ? 0.95 : 0.45} />
    );
  }

  return (
    <ThumbFrame>
      {cells}
      {/* image frame */}
      <rect x={gridX - 0.5} y={gridY - 0.5}
            width={gridW + 1} height={gridH + 1}
            fill="none" stroke="var(--muted-2)" strokeWidth="0.4"
            strokeOpacity="0.45" />
      {/* step indicator track */}
      <line x1={stepLeft} y1={stepY} x2={stepLeft + 3 * stepGap} y2={stepY}
            stroke="var(--muted-2)" strokeOpacity="0.3" strokeWidth="0.4" />
      {stepDots}
    </ThumbFrame>
  );
}

// info-protect: paper-themed (MDCS 2025) - defense-in-depth visual for
// regulatory framework around technical information protection. Four
// nested rounded-rectangle layers (outermost = regulatory boundary,
// dashed; innermost = technical control, solid) wrapping a central
// protected data block. One layer cycles in accent to suggest active
// auditing/verification of that control. Centered both axes.
function InfoProtectThumb() {
  const t = useClock();
  const cx = W / 2;
  const cy = H / 2;

  const assetW = 14, assetH = 10;
  const layers = [
    { sx: 5,  sy: 5,  dash: "none"   },   // innermost - technical control
    { sx: 12, sy: 10, dash: "none"   },   // procedural
    { sx: 19, sy: 15, dash: "2 1.5"  },   // policy
    { sx: 28, sy: 21, dash: "3 2"    },   // outer regulatory framework
  ];

  const cyclePeriod = 1.4;
  const activeIdx = Math.floor(t / cyclePeriod) % layers.length;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.2;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  // Asset bounds
  const ax = cx - assetW / 2;
  const ay = cy - assetH / 2;

  return (
    <ThumbFrame>
      {/* Layers - render outermost first so inner ones sit on top */}
      {[...layers].reverse().map((layer, idx) => {
        const i = layers.length - 1 - idx;
        const w = assetW + layer.sx * 2;
        const h = assetH + layer.sy * 2;
        const x = cx - w / 2;
        const y = cy - h / 2;
        const isActive = i === activeIdx;
        const baseOp = 0.32 + i * 0.07;     // inner layers slightly more solid
        const op = isActive ? Math.min(1, baseOp + 0.4 * focus) : baseOp;
        const color = isActive ? "var(--accent)" : "var(--ink)";
        const sw = isActive ? 1.1 : 0.7;
        return (
          <rect key={`L-${i}`}
                x={x} y={y} width={w} height={h} rx="3"
                fill="none"
                stroke={color}
                strokeWidth={sw}
                strokeOpacity={op}
                strokeDasharray={layer.dash} />
        );
      })}

      {/* Central protected data block */}
      <rect x={ax} y={ay} width={assetW} height={assetH} rx="1.5"
            fill="var(--accent)" opacity="0.55" />
      {/* Tiny "document lines" inside the asset */}
      {[0, 1, 2].map((i) => (
        <line key={`dl-${i}`}
              x1={ax + 2} y1={ay + 2.5 + i * 2.2}
              x2={ax + assetW - 2} y2={ay + 2.5 + i * 2.2}
              stroke="var(--bg)" strokeWidth="0.5" strokeOpacity="0.85" />
      ))}
    </ThumbFrame>
  );
}

// grad-cam: paper-themed (CEUR ITTAP 2025) - Grad-CAM heatmap for
// multimodal sentiment analysis of urban revitalization imagery. A
// subtle full-canvas patch grid (the image) with a Grad-CAM-style
// contour heatmap (concentric ellipses + soft fill) that relocates
// between 3 attention zones with a trapezoidal fade - no pulsing in
// place. Composition centered both axes.
function GradCamThumb() {
  const t = useClock();

  // Patch grid background (the image)
  const cols = 14, rows = 8;
  const cellW = 9, cellH = 8;
  const gridW = cols * cellW;       // 126
  const gridH = rows * cellH;       // 64
  const gridX = (W - gridW) / 2;    // 17
  const gridY = (H - gridH) / 2;    // 18

  const patches = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      patches.push(
        <rect key={`p-${c}-${r}`}
              x={gridX + c * cellW + 0.5}
              y={gridY + r * cellH + 0.5}
              width={cellW - 1} height={cellH - 1}
              fill="var(--ink)" opacity="0.08" />
      );
    }
  }

  // Cycle attention between 3 zones (no in-place pulsation)
  const peaks = [
    [80, 38],       // upper-center
    [115, 60],      // lower-right
    [50, 60],       // lower-left
  ];
  const cyclePeriod = 2.5;
  const peakIdx = Math.floor(t / cyclePeriod) % peaks.length;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.2;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  const [peakX, peakY] = peaks[peakIdx];

  // Grad-CAM contour rings (5) around the active peak
  const contours = [];
  for (let r = 0; r < 5; r++) {
    contours.push(
      <ellipse key={`c-${r}`}
               cx={peakX} cy={peakY}
               rx={(5 + r * 6) * 1.4}
               ry={(5 + r * 6) * 0.8}
               fill="none"
               stroke="var(--accent)" strokeWidth="0.7"
               strokeOpacity={(0.7 - r * 0.13) * focus} />
    );
  }

  return (
    <ThumbFrame>
      {patches}
      {/* soft heatmap fill (inner blob) */}
      <ellipse cx={peakX} cy={peakY} rx={12} ry={8}
               fill="var(--accent)" opacity={0.32 * focus} />
      {/* contour lines */}
      {contours}
      {/* peak marker */}
      <circle cx={peakX} cy={peakY} r="1.6"
              fill="var(--accent)" opacity={0.85 * focus} />
    </ThumbFrame>
  );
}

// face-recognition: paper-themed (IEEE SIST 2025) - automated face
// recognition pipeline: a corner-bracket bbox (detection) + 5-point
// landmark mesh (localisation) at the top, with a horizontal embedding
// vector below (the CNN-extracted feature vector used for identity
// matching). Composition centered both axes; one landmark gently cycles
// in accent to suggest active feature extraction.
function FaceRecognitionThumb() {
  const t = useClock();
  const cx = W / 2;
  const cyFace = 43;            // face center; vector sits below

  // 5-point landmarks
  const landmarks = [
    { x: cx - 9, y: cyFace - 9 },   // left eye
    { x: cx + 9, y: cyFace - 9 },   // right eye
    { x: cx,     y: cyFace },       // nose
    { x: cx - 7, y: cyFace + 11 },  // left mouth corner
    { x: cx + 7, y: cyFace + 11 },  // right mouth corner
  ];
  const edges = [
    [0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 4],
  ];

  // Cycle landmark focus
  const cyclePeriod = 0.75;
  const activeIdx = Math.floor(t / cyclePeriod) % landmarks.length;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.25;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  // Bbox around face
  const bboxW = 30, bboxH = 38;
  const bboxX = cx - bboxW / 2;
  const bboxY = cyFace - bboxH / 2;
  const cornerLen = 5;

  // Embedding vector - small varying-height bars below the bbox
  const vecCount = 26;
  const vecW = bboxW;
  const vecBaseY = 75;
  const vecCellW = vecW / vecCount;
  const vecBars = [];
  for (let i = 0; i < vecCount; i++) {
    const seed = i * 1.7;
    const h = 1.5 + 3.5 * (Math.sin(seed * 7.3) * 0.5 + 0.5);
    const drift = Math.sin(t * 0.6 + seed) * 0.4;
    vecBars.push(
      <rect key={`v-${i}`}
            x={bboxX + i * vecCellW + 0.3}
            y={vecBaseY - h - drift}
            width={vecCellW - 0.6}
            height={h}
            fill="var(--accent)" opacity="0.65" />
    );
  }

  return (
    <ThumbFrame>
      {/* face landmark mesh (subtle hairlines) */}
      {edges.map(([a, b], k) => (
        <line key={`e-${k}`}
              x1={landmarks[a].x} y1={landmarks[a].y}
              x2={landmarks[b].x} y2={landmarks[b].y}
              stroke="var(--muted-2)" strokeWidth="0.5"
              strokeOpacity="0.55" />
      ))}

      {/* landmarks (5-point) */}
      {landmarks.map((p, i) => {
        const isActive = i === activeIdx;
        const op = isActive ? 0.55 + 0.4 * focus : 0.65;
        const r = isActive ? 2.3 : 1.7;
        return (
          <circle key={`p-${i}`} cx={p.x} cy={p.y} r={r}
                  fill={isActive ? "var(--accent)" : "var(--ink)"}
                  opacity={op} />
        );
      })}

      {/* face bbox - corner brackets only (YOLO-style) */}
      <g fill="none" stroke="var(--accent)" strokeWidth="0.9" strokeOpacity="0.65">
        <polyline points={`${bboxX},${bboxY + cornerLen} ${bboxX},${bboxY} ${bboxX + cornerLen},${bboxY}`} />
        <polyline points={`${bboxX + bboxW - cornerLen},${bboxY} ${bboxX + bboxW},${bboxY} ${bboxX + bboxW},${bboxY + cornerLen}`} />
        <polyline points={`${bboxX},${bboxY + bboxH - cornerLen} ${bboxX},${bboxY + bboxH} ${bboxX + cornerLen},${bboxY + bboxH}`} />
        <polyline points={`${bboxX + bboxW - cornerLen},${bboxY + bboxH} ${bboxX + bboxW},${bboxY + bboxH} ${bboxX + bboxW},${bboxY + bboxH - cornerLen}`} />
      </g>

      {/* embedding-vector baseline */}
      <line x1={bboxX} y1={vecBaseY + 0.5} x2={bboxX + vecW} y2={vecBaseY + 0.5}
            stroke="var(--muted-2)" strokeOpacity="0.4" strokeWidth="0.4" />

      {/* embedding vector bars (CNN-extracted feature vector) */}
      {vecBars}
    </ThumbFrame>
  );
}

// bim-cascade: paper-themed (FRUCT 2024) - multi-stage classification of
// construction-site BIM objects. A 3-stage left-to-right cascade: 1 root
// → 3 broad-category branches → 6 leaves (2 per branch) drawn with
// different shapes (circles/squares/triangles) to suggest heterogeneous
// object classes (equipment / tool / vehicle, etc.). A single active
// classification path cycles through and is highlighted in accent.
function BimCascadeThumb() {
  const t = useClock();

  // Layout - 3 stages, centered on canvas (cx=80)
  const stage0X = 20;
  const stage1X = 80;
  const stage2X = 140;
  const stage1Ys = [25, 50, 75];

  const root = { x: stage0X, y: 50 };
  const stage1Nodes = stage1Ys.map((y) => ({ x: stage1X, y }));
  const stage2Nodes = [];
  stage1Ys.forEach((y, i) => {
    stage2Nodes.push({ x: stage2X, y: y - 8, parent: i });
    stage2Nodes.push({ x: stage2X, y: y + 8, parent: i });
  });

  // Cycle through which leaf is currently being "classified"
  const cyclePeriod = 1.5;
  const activeLeafIdx = Math.floor(t / cyclePeriod) % stage2Nodes.length;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.2;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  const activeBranchIdx = stage2Nodes[activeLeafIdx].parent;

  // Edges
  const edges = [];
  stage1Nodes.forEach((node, i) => {
    edges.push({
      x1: root.x, y1: root.y, x2: node.x, y2: node.y,
      active: i === activeBranchIdx,
    });
  });
  stage2Nodes.forEach((leaf, i) => {
    edges.push({
      x1: stage1Nodes[leaf.parent].x, y1: stage1Nodes[leaf.parent].y,
      x2: leaf.x, y2: leaf.y,
      active: i === activeLeafIdx,
    });
  });

  return (
    <ThumbFrame>
      {/* edges (active path in accent) */}
      {edges.map((e, i) => {
        const op = e.active ? 0.4 + 0.5 * focus : 0.28;
        const color = e.active ? "var(--accent)" : "var(--muted-2)";
        const sw = e.active ? 0.9 : 0.5;
        return (
          <line key={`e-${i}`}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={color} strokeWidth={sw} strokeOpacity={op} />
        );
      })}

      {/* root */}
      <circle cx={root.x} cy={root.y} r="3"
              fill="var(--ink)" opacity="0.85" />

      {/* stage 1 - broad categories */}
      {stage1Nodes.map((node, i) => {
        const active = i === activeBranchIdx;
        return (
          <circle key={`s1-${i}`} cx={node.x} cy={node.y} r="2.7"
                  fill={active ? "var(--accent)" : "var(--ink)"}
                  opacity={active ? 0.7 + 0.25 * focus : 0.55} />
        );
      })}

      {/* stage 2 - leaves with different shapes per branch */}
      {stage2Nodes.map((leaf, i) => {
        const active = i === activeLeafIdx;
        const op = active ? 0.6 + 0.35 * focus : 0.45;
        const fill = active ? "var(--accent)" : "var(--ink)";
        if (leaf.parent === 1) {
          return (
            <rect key={`s2-${i}`}
                  x={leaf.x - 2.1} y={leaf.y - 2.1}
                  width={4.2} height={4.2}
                  fill={fill} opacity={op} />
          );
        }
        if (leaf.parent === 2) {
          return (
            <polygon key={`s2-${i}`}
                     points={`${leaf.x},${leaf.y - 2.6} ${leaf.x - 2.3},${leaf.y + 1.8} ${leaf.x + 2.3},${leaf.y + 1.8}`}
                     fill={fill} opacity={op} />
          );
        }
        return (
          <circle key={`s2-${i}`} cx={leaf.x} cy={leaf.y} r="2.2"
                  fill={fill} opacity={op} />
        );
      })}
    </ThumbFrame>
  );
}

// yolo-compare: paper-themed (DTESI 2024 · Best Paper) - comparative
// analysis of YOLOv8, v9, v10 for vehicle-damage detection. A central
// damage zone (subtle accent fill) sits inside three nested bounding
// boxes drawn with YOLO-style corner brackets: outermost = YOLOv8 (off),
// middle = v9 (closer), innermost = v10 (tightest, accent). A slow focus
// cycles between the three to emphasise the comparison; v10 is always
// brighter to reflect its winning performance.
function YoloCompareThumb() {
  const t = useClock();
  const cx = W / 2;
  // Composition is split into two stacked blocks (bboxes + bars) and the
  // pair is vertically centered on the canvas. v8 outer bbox spans y=18..52
  // and the bars span y=60..80.5 → total content centered on H/2=50.
  const cy = 35;

  const gtW = 24, gtH = 16;
  // outer→inner: v8, v9, v10 (best fit)
  const offsets = [
    { sx: 12, sy: 9 },
    { sx: 6, sy: 4 },
    { sx: 1, sy: 1 },
  ];

  const cyclePeriod = 2.6;
  const focusIdx = Math.floor(t / cyclePeriod) % 3;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.18;
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  const cornerBox = (x, y, w, h, color, opacity, strokeWidth, key) => {
    const len = 4;
    return (
      <g key={key} fill="none" stroke={color} strokeWidth={strokeWidth}
         strokeOpacity={opacity}>
        <polyline points={`${x},${y + len} ${x},${y} ${x + len},${y}`} />
        <polyline points={`${x + w - len},${y} ${x + w},${y} ${x + w},${y + len}`} />
        <polyline points={`${x},${y + h - len} ${x},${y + h} ${x + len},${y + h}`} />
        <polyline points={`${x + w - len},${y + h} ${x + w},${y + h} ${x + w},${y + h - len}`} />
      </g>
    );
  };

  // Performance bars (mAP-style) - v10 wins, accent
  const barLengths = [22, 30, 42];
  const barColors = ["var(--ink)", "var(--ink)", "var(--accent)"];
  const barBaseOps = [0.4, 0.55, 0.85];
  const trackLen = 46;
  const barsLeft = cx - trackLen / 2;  // track centered on cx
  const barsTop = 60;
  const barH = 3.5;
  const barGap = 5;

  return (
    <ThumbFrame>
      {/* damage zone (ground-truth target) */}
      <rect x={cx - gtW / 2} y={cy - gtH / 2} width={gtW} height={gtH}
            fill="var(--accent)" opacity="0.13" />
      <rect x={cx - gtW / 2} y={cy - gtH / 2} width={gtW} height={gtH}
            fill="none" stroke="var(--muted-2)" strokeWidth="0.4"
            strokeOpacity="0.5" strokeDasharray="1 1" />

      {/* three model predictions, outer→inner */}
      {offsets.map((o, i) => {
        const w = gtW + o.sx * 2;
        const h = gtH + o.sy * 2;
        const x = cx - w / 2;
        const y = cy - h / 2;
        const isV10 = i === 2;
        const isFocused = i === focusIdx;
        const baseOp = isV10 ? 0.7 : 0.34 - i * 0.06;
        const op = isFocused ? Math.min(1, baseOp + 0.35 * focus) : baseOp;
        const color = isV10 ? "var(--accent)" : "var(--ink)";
        const sw = isV10 ? 1.0 : 0.8;
        return cornerBox(x, y, w, h, color, op, sw, `b-${i}`);
      })}

      {/* comparative-performance bars (mAP-like) */}
      {[0, 1, 2].map((i) => {
        const y = barsTop + i * (barH + barGap);
        const isFocused = i === focusIdx;
        const op = isFocused
          ? Math.min(1, barBaseOps[i] + 0.2 * focus)
          : barBaseOps[i];
        return (
          <g key={`bar-${i}`}>
            {/* track (subtle) */}
            <rect x={barsLeft} y={y} width={trackLen} height={barH} rx="0.5"
                  fill="var(--muted-2)" opacity="0.18" />
            {/* fill (model score) */}
            <rect x={barsLeft} y={y} width={barLengths[i]} height={barH} rx="0.5"
                  fill={barColors[i]} opacity={op} />
            {/* row anchor dot on the left, brighter when focused */}
            <circle cx={barsLeft - 4} cy={y + barH / 2} r="1.4"
                    fill={i === 2 ? "var(--accent)" : "var(--ink)"}
                    opacity={isFocused ? 0.95 : 0.4} />
          </g>
        );
      })}
    </ThumbFrame>
  );
}

// neuro-phys: paper-themed (Springer LNNS 2025) - NeuroPhysNet hybrid
// neural network for cyber-physical systems. A smooth Lissajous-style
// phase trajectory (the physics-constrained NN prediction, accent dashed),
// noisy ink data points scattered around it (sensor measurements), and a
// moving accent head that traces the current system state. Composition
// centered both axes; calm motion (head sweeps the loop, no pulsation).
function NeuroPhysThumb() {
  const t = useClock();
  const cx = W / 2;        // 80
  const cy = H / 2;        // 50
  const Rx = 38, Ry = 24;
  const a = 3, b = 2;
  const phi = Math.PI / 4;

  // Smooth physics-constrained trajectory (Lissajous a:b = 3:2)
  const numPts = 200;
  const trajPts = [];
  for (let i = 0; i <= numPts; i++) {
    const s = (i / numPts) * Math.PI * 2;
    trajPts.push(
      `${cx + Rx * Math.sin(a * s)},${cy + Ry * Math.sin(b * s + phi)}`
    );
  }

  // Noisy sensor data points scattered around the trajectory
  const numData = 30;
  const dataPts = [];
  for (let i = 0; i < numData; i++) {
    const s = (i / numData) * Math.PI * 2;
    const seed = i * 1.7;
    const nx =
      Math.sin(seed * 13.7) * 1.4 +
      Math.cos(seed * 7.3) * 0.8;
    const ny =
      Math.cos(seed * 19.1) * 1.4 +
      Math.sin(seed * 11.7) * 0.8;
    dataPts.push({
      x: cx + Rx * Math.sin(a * s) + nx,
      y: cy + Ry * Math.sin(b * s + phi) + ny,
    });
  }

  // Moving "system state" head along the trajectory
  const headS = (t * 0.45) % (Math.PI * 2);
  const headX = cx + Rx * Math.sin(a * headS);
  const headY = cy + Ry * Math.sin(b * headS + phi);

  return (
    <ThumbFrame>
      {/* physics-constrained NN trajectory */}
      <polyline points={trajPts.join(" ")} fill="none"
                stroke="var(--accent)" strokeWidth="0.9"
                strokeDasharray="2 1.5" strokeOpacity="0.7" />

      {/* noisy sensor measurements */}
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.3"
                fill="var(--ink)" opacity="0.5" />
      ))}

      {/* origin marker (cyber-physical system center) */}
      <circle cx={cx} cy={cy} r="1.4"
              fill="var(--muted-2)" opacity="0.55" />

      {/* current system state - accent head sweeping the loop */}
      <circle cx={headX} cy={headY} r="2.6"
              fill="var(--accent)" opacity="0.95" />
    </ThumbFrame>
  );
}

// pred-vs-obs: paper-themed (Astana IT University Journal 2025) - the
// canonical predicted-vs-observed scatter on a 1:1 diagonal. Many ink dots
// hug the accent dashed diagonal (high R²); a few accent dots stand out
// at higher discharge values; dot radius grows along the diagonal to
// suggest the magnitude range of global GRDC stations. Composition centered.
function PredVsObsThumb() {
  const t = useClock();

  // Centered plot box
  const bx1 = 40, bx2 = 120;
  const by1 = 20, by2 = 80;

  const numDots = 38;
  const dots = [];
  for (let i = 0; i < numDots; i++) {
    const tt = i / (numDots - 1);
    const baseX = bx1 + tt * (bx2 - bx1);
    const baseY = by2 - tt * (by2 - by1);
    const seed = i * 1.7;
    const perpNoise =
      (Math.sin(seed * 13.7) * 0.5 +
       Math.cos(seed * 7.3) * 0.3 +
       Math.sin(seed * 19.1) * 0.2) * 3.5;
    const drift = Math.sin(t * 0.4 + i * 0.5) * 0.4;
    // Project (perpNoise + drift) along the (1,1)/√2 perpendicular to the diagonal
    const offset = (perpNoise + drift) * Math.SQRT1_2;
    const x = baseX + offset;
    const y = baseY + offset;
    const sizeFactor = 0.75 + 0.55 * tt;
    const isHighlight = i % 9 === 0;
    dots.push({
      x, y,
      r: (isHighlight ? 1.8 : 1.4) * sizeFactor,
      isHighlight,
    });
  }

  return (
    <ThumbFrame>
      {/* y-axis */}
      <line x1={bx1} y1={by1} x2={bx1} y2={by2}
            stroke="var(--muted-2)" strokeWidth="0.4" strokeOpacity="0.45" />
      {/* x-axis */}
      <line x1={bx1} y1={by2} x2={bx2} y2={by2}
            stroke="var(--muted-2)" strokeWidth="0.4" strokeOpacity="0.45" />

      {/* tick marks */}
      {[0.25, 0.5, 0.75, 1.0].map((m, i) => (
        <g key={`g-${i}`}>
          <line x1={bx1 + m * (bx2 - bx1)} y1={by2}
                x2={bx1 + m * (bx2 - bx1)} y2={by2 + 2}
                stroke="var(--muted-2)" strokeOpacity="0.45" strokeWidth="0.4" />
          <line x1={bx1 - 2} y1={by2 - m * (by2 - by1)}
                x2={bx1} y2={by2 - m * (by2 - by1)}
                stroke="var(--muted-2)" strokeOpacity="0.45" strokeWidth="0.4" />
        </g>
      ))}

      {/* 1:1 perfect-prediction diagonal */}
      <line x1={bx1} y1={by2} x2={bx2} y2={by1}
            stroke="var(--accent)" strokeWidth="0.9"
            strokeDasharray="2 1.5" strokeOpacity="0.7" />

      {/* Scatter points */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r}
                fill={d.isHighlight ? "var(--accent)" : "var(--ink)"}
                opacity={d.isHighlight ? 0.92 : 0.55} />
      ))}
    </ThumbFrame>
  );
}

// sensor-graph: paper-themed (IEEE SIST 2025) - top: spatial sensor graph
// (GCN side) with one accent-highlighted active sensor; bottom: noisy
// historical traces (multiple sensors) ending at a "now" marker, then a
// clean accent forecast line continuing into a faint forecast cone - the
// LSTM temporal-forecast side. Composition centered both axes.
function SensorGraphThumb() {
  const t = useClock();

  const graphCenterY = 30;
  const seriesY = 72;
  const lastObservedX = 110;

  const nodes = [
    [22, graphCenterY - 8],
    [50, graphCenterY + 4],
    [80, graphCenterY - 8],
    [108, graphCenterY + 6],
    [136, graphCenterY - 4],
    [38, graphCenterY + 10],
    [120, graphCenterY - 12],
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 6], [1, 5], [5, 2], [6, 2], [0, 5]];
  const activeIdx = 2;

  const pos = nodes.map(([x, y], i) => [
    x + Math.sin(t * 0.55 + i) * 1.4,
    y + Math.cos(t * 0.4 + i * 1.3) * 1.4,
  ]);

  const traces = [];
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let x = 6; x <= lastObservedX; x += 2) {
      const noise =
        Math.sin(x * 0.15 + t * 0.7 + k) * 2.5 +
        Math.cos(x * 0.07 + t * 0.4 + k * 1.5) * 1.8;
      const trend = Math.sin(x * 0.04 + 0.3) * 5;
      pts.push(`${x},${seriesY + trend + noise + k * 1.5}`);
    }
    traces.push(
      <polyline key={k} points={pts.join(" ")} fill="none"
                stroke="var(--ink)" strokeOpacity={0.2 + k * 0.05}
                strokeWidth="0.7" />
    );
  }

  const forecastPts = [];
  for (let x = lastObservedX; x <= W - 6; x += 2) {
    const trend = Math.sin(x * 0.04 + 0.3) * 5;
    forecastPts.push(`${x},${seriesY + trend}`);
  }
  const lastY = seriesY + Math.sin(lastObservedX * 0.04 + 0.3) * 5;
  const finalY = seriesY + Math.sin((W - 6) * 0.04 + 0.3) * 5;
  const cone = `M${lastObservedX},${lastY} L${W - 6},${finalY - 8} L${W - 6},${finalY + 8} Z`;

  return (
    <ThumbFrame>
      {edges.map(([a, b], k) => (
        <line key={`e-${k}`}
              x1={pos[a][0]} y1={pos[a][1]}
              x2={pos[b][0]} y2={pos[b][1]}
              stroke="var(--muted-2)" strokeWidth="0.7" strokeOpacity="0.65" />
      ))}
      {pos.map(([x, y], i) => (
        <circle key={`n-${i}`} cx={x} cy={y}
                r={i === activeIdx ? 3.2 : 2.2}
                fill={i === activeIdx ? "var(--accent)" : "var(--ink)"}
                opacity={i === activeIdx ? 0.95 : 0.7} />
      ))}
      <line x1={6} y1={50} x2={W - 6} y2={50}
            stroke="var(--muted-2)" strokeOpacity="0.25" strokeWidth="0.4"
            strokeDasharray="1.5 1.5" />
      <path d={cone} fill="var(--accent)" opacity="0.13" />
      {traces}
      <line x1={lastObservedX} y1={seriesY - 10}
            x2={lastObservedX} y2={seriesY + 10}
            stroke="var(--muted-2)" strokeWidth="0.4"
            strokeOpacity="0.5" strokeDasharray="1 1" />
      <polyline points={forecastPts.join(" ")} fill="none"
                stroke="var(--accent)" strokeWidth="1.3"
                strokeDasharray="2 1.5" />
    </ThumbFrame>
  );
}

// hydro-ensemble: paper-themed (Water 2025) - noisy base learners (XGB/LGBM/
// CatBoost/NN) blending into a clean meta-ensemble prediction, over a row
// of GRDC gauging stations and a forecast cone on the right edge.
function HydroEnsembleThumb() {
  const t = useClock();

  // Composition vertically centered around y = H/2 (50).
  // Content span: trend curves (≈21..59) + station row (≈70..82) → center ≈51.
  // Station row and baseline sit below the curves with symmetric padding.
  const baselineY = H - 18;           // 82  - hairline baseline
  const tickTopY = baselineY - 6;     // 76
  const stationY = baselineY - 8;     // 74  - station circle
  const trendCenterY = 40;            // trend oscillates ±18 around 40 (22..58)

  const trend = (x) =>
    trendCenterY + Math.sin(x * 0.045 + 0.4) * 13 + Math.sin(x * 0.018) * 5;

  // Horizontal layout - already symmetric: curves span [6, 154], stations
  // evenly spaced with 12px margins on both sides.
  const baseLines = [];
  for (let k = 0; k < 4; k++) {
    const seed = k * 1.7;
    const pts = [];
    for (let x = 6; x <= W - 6; x += 2) {
      const noise =
        Math.sin(x * 0.18 + t * 0.7 + seed) * 3.2 +
        Math.cos(x * 0.09 + t * 0.4 + seed * 1.5) * 2.4;
      pts.push(`${x},${trend(x) + noise}`);
    }
    baseLines.push(
      <polyline
        key={k}
        points={pts.join(" ")}
        fill="none"
        stroke="var(--ink)"
        strokeOpacity={0.16 + k * 0.05}
        strokeWidth="0.7"
      />
    );
  }

  const metaPts = [];
  for (let x = 6; x <= W - 6; x += 2) metaPts.push(`${x},${trend(x)}`);

  const stations = [];
  for (let i = 0; i < 9; i++) {
    const x = 12 + i * ((W - 24) / 8);
    const pulse = 0.4 + 0.6 * Math.sin(t * 1.2 + i * 0.7);
    stations.push(
      <g key={i}>
        <line x1={x} y1={baselineY} x2={x} y2={tickTopY}
              stroke="var(--muted-2)" strokeWidth="0.6" />
        <circle cx={x} cy={stationY} r="1.4"
                fill="var(--accent)" opacity={0.3 + 0.55 * pulse} />
      </g>
    );
  }

  const coneStartX = W - 38;
  const coneStartY = trend(coneStartX);
  const lastY = trend(W - 6);
  const cone = `M${coneStartX},${coneStartY} L${W - 4},${lastY - 8} L${W - 4},${lastY + 8} Z`;

  return (
    <ThumbFrame>
      <line x1="5" y1={baselineY} x2={W - 5} y2={baselineY}
            stroke="var(--muted-2)" strokeWidth="0.5" />
      <path d={cone} fill="var(--accent)" opacity="0.14" />
      {baseLines}
      <polyline points={metaPts.join(" ")} fill="none"
                stroke="var(--accent)" strokeWidth="1.5" />
      {stations}
    </ThumbFrame>
  );
}

// xai-multimodal: paper-themed (REKS 2025) - left: text token rows with
// 4 persistent attention highlights; right: ViT patch grid where specific
// patches light up in accent corresponding to the currently focused token.
// A token's "focus" cycles slowly with a trapezoidal hold-fade envelope
// (no pulsing blob), and a cross-modal arc connects the focused token to
// the centroid of its mapped patches.
function XaiMultimodalThumb() {
  const t = useClock();

  // ---- Cycle through 4 highlighted tokens (slow hold + soft fade) ---------
  const cyclePeriod = 2.6;
  const focusIdx = Math.floor(t / cyclePeriod) % 4;
  const phase = (t / cyclePeriod) - Math.floor(t / cyclePeriod);
  const fade = 0.18; // 18% fade-in, 64% hold, 18% fade-out
  let focus;
  if (phase < fade) focus = phase / fade;
  else if (phase > 1 - fade) focus = (1 - phase) / fade;
  else focus = 1;

  // ---- Right panel: ViT patch grid (centered; matches left span of 64) ----
  const cols = 8, rows = 5;
  const cellW = 8, cellH = 8;
  const gridW = cols * cellW;           // 64
  const gridH = rows * cellH;           // 40
  const gridX = W / 2 + 8;              // divider(80) + 8 gap → gridX=88
  const gridY = (H - gridH) / 2;        // 30 - centered vertically

  // Each highlighted token maps to a small cluster of patches it "attends"
  const tokenToPatches = [
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[4, 2], [5, 2], [5, 3]],
    [[3, 3], [4, 3], [3, 4], [2, 3]],
    [[6, 0], [6, 1], [7, 1]],
  ];
  const activeSet = new Set(tokenToPatches[focusIdx].map(([c, r]) => `${c}-${r}`));

  // Centroid of the focused cluster - arc target
  const cluster = tokenToPatches[focusIdx];
  const cx = cluster.reduce((s, [c]) => s + c, 0) / cluster.length;
  const cy = cluster.reduce((s, [, r]) => s + r, 0) / cluster.length;
  const targetX = gridX + (cx + 0.5) * cellW;
  const targetY = gridY + (cy + 0.5) * cellH;

  const patches = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = c - (cols - 1) / 2;
      const dy = r - (rows - 1) / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const importance = Math.exp(-(dist * dist) / 6);
      patches.push({
        x: gridX + c * cellW,
        y: gridY + r * cellH,
        baseOp: 0.18 + importance * 0.32,
        isActive: activeSet.has(`${c}-${r}`),
      });
    }
  }

  // ---- Left panel: text tokens (centered horizontally and vertically) ----
  const numRows = 4;
  const rowGap = 12;
  const rectH = 4.5;
  const leftCenterX = W * 0.25;
  const tokenGap = 2;

  const rowsCenters = Array.from({ length: numRows }, (_, i) =>
    H / 2 - ((numRows - 1) * rowGap) / 2 + i * rowGap
  );

  const highlightMap = { "0-3": 0, "1-1": 1, "2-4": 2, "3-2": 3 };
  const allTokens = [];
  for (let lineIdx = 0; lineIdx < numRows; lineIdx++) {
    const widths = [];
    let total = 0;
    let i = 0;
    // Target: row total up to 64 (mirrors right-side grid width)
    while (total < 60) {
      const w = 5 + ((lineIdx * 7 + i * 5) % 10);
      const next = total + (widths.length > 0 ? tokenGap : 0) + w;
      if (next > 64) break;
      widths.push(w);
      total = next;
      i++;
    }
    const rowStartX = leftCenterX - total / 2;
    let xc = rowStartX;
    widths.forEach((w, idx) => {
      const key = `${lineIdx}-${idx}`;
      const hiIdx = highlightMap[key];
      const isHi = hiIdx !== undefined;
      const isFocused = hiIdx === focusIdx;
      allTokens.push({
        x: xc,
        y: rowsCenters[lineIdx] - rectH / 2,
        w, isHi, isFocused,
      });
      xc += w + tokenGap;
    });
  }
  const focusedToken = allTokens.find((tk) => tk.isFocused);

  return (
    <ThumbFrame>
      {/* divider */}
      <line x1={80} y1={H / 2 - 30} x2={80} y2={H / 2 + 30}
            stroke="var(--muted-2)" strokeWidth="0.4"
            strokeDasharray="1.5 1.5" opacity="0.45" />

      {/* text tokens - non-focused highlights stay dim; focused glows with focus */}
      {allTokens.map((tk, i) => (
        <g key={i}>
          <rect x={tk.x} y={tk.y} width={tk.w} height={rectH} rx="0.8"
                fill="var(--ink)" opacity="0.3" />
          {tk.isHi && (
            <rect x={tk.x - 0.6} y={tk.y - 0.6}
                  width={tk.w + 1.2} height={rectH + 1.2} rx="1"
                  fill="var(--accent)"
                  opacity={tk.isFocused ? 0.3 + 0.65 * focus : 0.3} />
          )}
        </g>
      ))}

      {/* ViT patch grid - active overlay fully tied to focus (0 when fading) */}
      {patches.map((p, i) => (
        <g key={i}>
          <rect x={p.x + 0.6} y={p.y + 0.6}
                width={cellW - 1.2} height={cellH - 1.2}
                fill="var(--ink)" opacity={p.baseOp} />
          {p.isActive && (
            <rect x={p.x + 0.6} y={p.y + 0.6}
                  width={cellW - 1.2} height={cellH - 1.2}
                  fill="var(--accent)" opacity={0.85 * focus} />
          )}
        </g>
      ))}

      {/* cross-modal attention arc - fully proportional to focus */}
      {focusedToken && (() => {
        const sx = focusedToken.x + focusedToken.w + 1;
        const sy = focusedToken.y + rectH / 2;
        const mx = (sx + targetX) / 2;
        const my = Math.min(sy, targetY) - 12;
        return (
          <path d={`M${sx},${sy} Q${mx},${my} ${targetX},${targetY}`}
                fill="none" stroke="var(--accent)" strokeWidth="0.7"
                strokeDasharray="2 1.2" opacity={0.6 * focus} />
        );
      })()}
    </ThumbFrame>
  );
}

// project-specific variants (larger, more elaborate)
function ProjectFieldThumb() { return <FieldThumb />; }
function ProjectTokensThumb() { return <TokensThumb />; }
function ProjectGridThumb() { return <GridThumb />; }
function ProjectPulseThumb() { return <PulseThumb />; }

// tonality: Multimodal Content Tonality for Territorial Revitalization —
// three horizontally-arranged clusters along an implicit sentiment spectrum
// (negative → neutral → positive). Each cluster mixes circles, squares and
// triangles to imply heterogeneous modalities (text / image / metadata),
// with a dashed axis tying the spectrum together. Composition centered both
// axes; motion is gentle orbital drift, no pulsation.
function TonalityThumb() {
  const t = useClock();

  const cy = H / 2;                                   // 50
  const cxs = [32, 80, 128];                          // negative, neutral, positive
  const colors = ["var(--ink)", "var(--muted-2)", "var(--accent)"];
  const opacities = [0.6, 0.5, 0.85];
  const counts = [9, 7, 11];
  const baseR = 16;

  const items = [];
  cxs.forEach((cx, ci) => {
    const dir = ci % 2 === 0 ? 1 : -1;
    for (let i = 0; i < counts[ci]; i++) {
      const angle = (i / counts[ci]) * Math.PI * 2 + t * 0.3 * dir;
      const orbitR = baseR * (0.35 + 0.55 * ((i % 4) / 4));
      const x = cx + Math.cos(angle) * orbitR;
      const y = cy + Math.sin(angle) * orbitR * 0.7;
      const shape = i % 3 === 0 ? "square" : i % 5 === 0 ? "triangle" : "circle";
      items.push({ x, y, color: colors[ci], op: opacities[ci], shape });
    }
    items.push({ x: cx, y: cy, color: colors[ci], op: 0.95, shape: "anchor" });
  });

  return (
    <ThumbFrame>
      {/* sentiment axis */}
      <line x1={12} y1={cy} x2={W - 12} y2={cy}
            stroke="var(--muted-2)" strokeOpacity="0.32" strokeWidth="0.4"
            strokeDasharray="2 2" />
      {/* tick marks at cluster centers */}
      {cxs.map((cx, i) => (
        <line key={`tk-${i}`} x1={cx} y1={cy - 2} x2={cx} y2={cy + 2}
              stroke="var(--muted-2)" strokeOpacity="0.45" strokeWidth="0.6" />
      ))}

      {/* heterogeneous-modality items */}
      {items.map((it, i) => {
        if (it.shape === "square") {
          return (
            <rect key={i}
                  x={it.x - 1.4} y={it.y - 1.4}
                  width={2.8} height={2.8}
                  fill={it.color} opacity={it.op} />
          );
        }
        if (it.shape === "triangle") {
          return (
            <polygon key={i}
                     points={`${it.x},${it.y - 1.8} ${it.x - 1.6},${it.y + 1.4} ${it.x + 1.6},${it.y + 1.4}`}
                     fill={it.color} opacity={it.op} />
          );
        }
        return (
          <circle key={i} cx={it.x} cy={it.y}
                  r={it.shape === "anchor" ? 1.8 : 1.4}
                  fill={it.color} opacity={it.op} />
        );
      })}
    </ThumbFrame>
  );
}

// digital-twin: AI-Agent-Based Digital Twins for Damaged Infrastructure —
// a centered BIM-like grid (the digital-twin model) with a few pulsing
// accent cells (damage zones detected by CV / point-cloud analysis), and
// 3 collaborative agent dots orbiting on an elliptical path around the
// structure with dashed accent links between them (multi-agent collab).
function DigitalTwinThumb() {
  const t = useClock();

  const cx = W / 2;     // 80
  const cy = H / 2;     // 50

  // BIM model - front facade grid, centered
  const boxW = 64, boxH = 38;
  const fx = cx - boxW / 2;     // 48
  const fy = cy - boxH / 2;     // 31
  const gridCols = 6, gridRows = 4;
  const cellW = boxW / gridCols;
  const cellH = boxH / gridRows;

  // Damage zones (specific cells), gentle pulsation
  const damageCells = [["1", "1"], ["3", "2"], ["4", "0"]];
  const damage = damageCells.map(([cs, rs], k) => {
    const c = +cs, r = +rs;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.1 + c * 0.6 + r * 0.4);
    return (
      <rect key={k}
            x={fx + c * cellW + 0.5}
            y={fy + r * cellH + 0.5}
            width={cellW - 1} height={cellH - 1}
            fill="var(--accent)" opacity={0.42 + 0.22 * pulse} />
    );
  });

  // Multi-agent inspection - 3 dots orbiting the grid on an elliptical path
  const orbitRx = 50, orbitRy = 28;
  const agents = [];
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + t * 0.5;
    agents.push({
      x: cx + Math.cos(angle) * orbitRx,
      y: cy + Math.sin(angle) * orbitRy,
    });
  }

  return (
    <ThumbFrame>
      {/* damage cells (under the grid lines) */}
      {damage}

      {/* BIM front face frame */}
      <rect x={fx} y={fy} width={boxW} height={boxH}
            fill="none" stroke="var(--ink)" strokeWidth="0.7" />

      {/* internal grid lines */}
      {Array.from({ length: gridCols - 1 }, (_, i) => (
        <line key={`v-${i}`}
              x1={fx + (i + 1) * cellW} y1={fy}
              x2={fx + (i + 1) * cellW} y2={fy + boxH}
              stroke="var(--ink)" strokeOpacity="0.32" strokeWidth="0.4" />
      ))}
      {Array.from({ length: gridRows - 1 }, (_, i) => (
        <line key={`h-${i}`}
              x1={fx}        y1={fy + (i + 1) * cellH}
              x2={fx + boxW} y2={fy + (i + 1) * cellH}
              stroke="var(--ink)" strokeOpacity="0.32" strokeWidth="0.4" />
      ))}

      {/* multi-agent collaboration links */}
      {agents.map((a, i) => {
        const next = agents[(i + 1) % agents.length];
        return (
          <line key={`l-${i}`}
                x1={a.x} y1={a.y} x2={next.x} y2={next.y}
                stroke="var(--accent)" strokeWidth="0.4"
                strokeOpacity="0.3" strokeDasharray="1.5 1.2" />
        );
      })}

      {/* agent dots */}
      {agents.map((a, i) => (
        <circle key={`a-${i}`} cx={a.x} cy={a.y} r="2.4"
                fill="var(--accent)" opacity="0.9" />
      ))}
    </ThumbFrame>
  );
}

// budova: BUDOVA project - Building Ukrainian Domain-Specific Open Voice
// & Text Archives. Top: animated speech waveform (voice corpus). Bottom:
// rows of text tokens with periodic NER-style highlights (construction-domain
// annotations). Composition centered both axes.
function BudovaThumb() {
  const t = useClock();

  // ---- Top half: animated speech waveform ---------------------------------
  const waveCenterY = 30;
  const numBars = 38;
  const innerW = W - 16;
  const waveBars = [];
  for (let i = 0; i < numBars; i++) {
    const x = 8 + (i + 0.5) * (innerW / numBars);
    // speech-like envelope: long-period pauses + per-bar amplitude
    const envelope = 0.25 + 0.75 * Math.pow(Math.max(0, Math.sin(i * 0.18 + t * 0.45)), 2);
    const local = 0.4 + 0.6 * (Math.sin(t * 3 + i * 0.7) * 0.5 + 0.5);
    const h = 2 + envelope * local * 13;
    waveBars.push(
      <line key={i}
            x1={x} y1={waveCenterY - h}
            x2={x} y2={waveCenterY + h}
            stroke="var(--accent)" strokeWidth="1.2"
            strokeOpacity="0.85" strokeLinecap="round" />
    );
  }

  // ---- Bottom half: text token rows with NER highlights -------------------
  const numRows = 3;
  const rowGap = 9;
  const rectH = 4;
  const tokenCenterY = 70;
  const rowsY = Array.from({ length: numRows }, (_, i) =>
    tokenCenterY - ((numRows - 1) * rowGap) / 2 + i * rowGap - rectH / 2
  );

  const nerKeys = new Set(["0-2", "1-4", "1-8", "2-1", "2-6"]);
  const tokens = [];
  for (let r = 0; r < numRows; r++) {
    let x = 8;
    let i = 0;
    while (x < W - 8) {
      const w = 5 + ((r * 7 + i * 5) % 11);
      if (x + w > W - 8) break;
      const key = `${r}-${i}`;
      const isNer = nerKeys.has(key);
      const phase = t * 0.85 + r * 0.6 + i * 0.25;
      const nerOp = isNer ? 0.45 + 0.35 * Math.max(0, Math.sin(phase)) : 0;
      tokens.push(
        <g key={key}>
          <rect x={x} y={rowsY[r]} width={w} height={rectH} rx="0.7"
                fill="var(--ink)" opacity="0.32" />
          {isNer && (
            <rect x={x - 0.5} y={rowsY[r] - 0.5}
                  width={w + 1} height={rectH + 1} rx="1"
                  fill="var(--accent)" opacity={nerOp} />
          )}
        </g>
      );
      x += w + 2;
      i++;
    }
  }

  return (
    <ThumbFrame>
      {/* waveform baseline */}
      <line x1="5" y1={waveCenterY} x2={W - 5} y2={waveCenterY}
            stroke="var(--muted-2)" strokeOpacity="0.4" strokeWidth="0.4" />
      {waveBars}

      {/* dashed divider between voice and text panels */}
      <line x1="5" y1={H / 2} x2={W - 5} y2={H / 2}
            stroke="var(--muted-2)" strokeOpacity="0.35" strokeWidth="0.4"
            strokeDasharray="1.5 1.5" />

      {tokens}
    </ThumbFrame>
  );
}

const THUMB_COMPONENTS = {
  field: FieldThumb,
  graph: GraphThumb,
  wave: WaveThumb,
  histogram: HistogramThumb,
  cluster: ClusterThumb,
  curve: CurveThumb,
  tokens: TokensThumb,
  pulse: PulseThumb,
  tiles: TilesThumb,
  contour: ContourThumb,
  noise: NoiseThumb,
  orbit: OrbitThumb,
  scan: ScanThumb,
  split: SplitThumb,
  grid: GridThumb,
  ripple: RippleThumb,
  series: SeriesThumb,
  map: MapThumb,
  latent: LatentThumb,
  progress: ProgressThumb,
  "hydro-ensemble": HydroEnsembleThumb,
  "xai-multimodal": XaiMultimodalThumb,
  "sensor-graph": SensorGraphThumb,
  "pred-vs-obs": PredVsObsThumb,
  "neuro-phys": NeuroPhysThumb,
  "yolo-compare": YoloCompareThumb,
  "bim-cascade": BimCascadeThumb,
  "face-recognition": FaceRecognitionThumb,
  "grad-cam": GradCamThumb,
  "info-protect": InfoProtectThumb,
  "preprocess": PreprocessThumb,
  "site-yolo": SiteYoloThumb,
  "yolo-classes": YoloClassesThumb,
  "yolo-progression": YoloProgressionThumb,
  "threat-detect": ThreatDetectThumb,
  "urban-lora": UrbanLoraThumb,
  "vr-tam": VrTamThumb,
  "build-stages": BuildStagesThumb,
  "bim-scan": BimScanThumb,
  "twin-mirror": TwinMirrorThumb,
  "object-detect": ObjectDetectThumb,
  "career-guidance": CareerGuidanceThumb,
  "project-field": ProjectFieldThumb,
  "project-tokens": ProjectTokensThumb,
  "project-grid": ProjectGridThumb,
  "project-pulse": ProjectPulseThumb,
  budova: BudovaThumb,
  "digital-twin": DigitalTwinThumb,
  tonality: TonalityThumb,
};

function Thumb({ kind }) {
  const Cmp = THUMB_COMPONENTS[kind] || FieldThumb;
  return (
    <div className="thumb">
      <Cmp />
    </div>
  );
}

window.Thumb = Thumb;
