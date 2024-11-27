import { PropsWithChildren, useEffect, useRef, useState } from "react";

interface DotResponse {
  size: number;
  velocity: number;
  id: string;
  link: string;
  clicks: string;
}
interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;

  id: string;
  link: string;
  clicks: string;
}

// background canvas will have the amount of links created to be the dots, will pregenerate 200 using code for random websites... (as dots) velocity will be how many times its been clicked!

const BackgroundCanvas = ({ children }: PropsWithChildren<object>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const animationFrameRef = useRef<number>();
  const [dots, setDots] = useState<DotResponse[]>([]);
  const [hoveredDot, setHoveredDot] = useState<{
    x: number;
    y: number;
    size: number;
    velocity: number;
    id: string;
    link: string;
    clicks: string;
  } | null>(null);
  const dotsArrayRef = useRef<Dot[]>([]);
  const hoveredDotRef = useRef<number | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });

  /*
        {
  "status": 200,
  "body": {
    "dots": [
      {
        "size": 3,
        "velocity": 6
      },
      {
        "size": 1,
        "velocity": 1
      }
    ]
  }
}
    */

  useEffect(() => {
    fetch("/api/get")
      .then((res) => res.json())
      .then((data) => {
        setDots(data.body.dots);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    dotsArrayRef.current = dots.map((dot) => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: dot.velocity,
      vy: dot.velocity,
      size: dot.size,
      id: dot.id,
      link: dot.link,
      clicks: dot.clicks,
    }));

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      const hoveredIndex = dotsArrayRef.current.findIndex((dot) => {
        const distance = Math.sqrt(
          Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2),
        );
        return distance <= dot.size + 60;
      });

      hoveredDotRef.current = hoveredIndex >= 0 ? hoveredIndex : null;

      if (hoveredIndex >= 0) {
        const dot = dotsArrayRef.current[hoveredIndex];
        setHoveredDot({
          x: dot.x / scaleX,
          y: dot.y / scaleY,
          size: dot.size,
          velocity: Math.sqrt(Math.pow(dot.vx, 2) + Math.pow(dot.vy, 2)),
          clicks: dot.clicks,
          id: dot.id,
          link: dot.link,
        });

        const popupWidth = 200;
        const popupHeight = 80;

        let left = dot.x / scaleX + 10;
        let top = dot.y / scaleY + 10;

        if (left + popupWidth > window.innerWidth) {
          left = dot.x / scaleX - popupWidth - 10;
        }

        if (top + popupHeight > window.innerHeight) {
          top = dot.y / scaleY - popupHeight - 10;
        }

        setPopupPosition({ left, top });
      } else {
        setHoveredDot(null);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      context.clearRect(0, 0, dimensions.width, dimensions.height);
      context.fillStyle = "#C22DC2";

      dotsArrayRef.current.forEach((dot, index) => {
        const isHovered = hoveredDotRef.current === index;

        if (isHovered) {
          dot.x += 0;
          dot.y += 0;
        } else {
          dot.x += dot.vx;
          dot.y += dot.vy;
        }

        if (dot.x < 0 || dot.x > dimensions.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > dimensions.height) dot.vy *= -1;

        context.beginPath();
        context.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dimensions.width, dimensions.height, dots]);

  return (
    <div className="bg-[#101010] w-screen h-screen relative">
      <div className="relative z-[100] pointer-events-none">{children}</div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full fixed top-0 left-0 z-50 pointer-events-auto"
        style={{ touchAction: "none" }}
      />
      {hoveredDot && (
        <div
          className="fixed bg-white/10 backdrop-blur-sm px-2 py-1 rounded-sm text-white text-sm z-[400] inter border-2 border-[#C22DC2] pointer-events-auto"
          style={{
            left: popupPosition.left,
            top: popupPosition.top,
          }}
        >
          <a href={`/u/${hoveredDot.id}`}>Link: {hoveredDot.link}</a>
          <br />
          Clicks: {hoveredDot.clicks}
          <br />
          ID: {hoveredDot.id}
          <br />
        </div>
      )}
    </div>
  );
};

export default BackgroundCanvas;
