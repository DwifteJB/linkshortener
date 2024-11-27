import { PropsWithChildren, useEffect, useRef, useState } from "react";


interface Dot {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

// background canvas will have the amount of links created to be the dots, will pregenerate 200 using code for random websites... (as dots) velocity will be how many times its been clicked!

const BackgroundCanvas = ({children}: PropsWithChildren<object>) => {
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        handleResize();

        let resizeTimer: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        };

        window.addEventListener('resize', debouncedResize);

        return () => {
            window.removeEventListener('resize', debouncedResize);
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


        const dots: Dot[] = [];
        const numDots = 1000;
        const dotRadius = 2;

        for (let i = 0; i < numDots; i++) {
            dots.push({
                x: Math.random() * (dimensions.width),
                y: Math.random() * dimensions.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
            });
        }

        const draw = () => {
            context.clearRect(0, 0, dimensions.width, dimensions.height);
            context.fillStyle = "#C22DC2";

            dots.forEach(dot => {
                dot.x += dot.vx;
                dot.y += dot.vy;

                if (dot.x < 0 || dot.x > dimensions.width) dot.vx *= -1;
                if (dot.y < 0 || dot.y > dimensions.height) dot.vy *= -1;

                context.beginPath();
                context.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
                context.fill();

            });

            animationFrameRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [dimensions.width, dimensions.height]);

    return (
        <div className="background-canvas bg-[#101010] w-screen h-screen">
            <canvas 
                ref={canvasRef} 
                id="background-canvas" 
                width={dimensions.width} 
                height={dimensions.height}
                className="w-full h-full absolute top-0 left-0 "
            />
            <div className="relative z-10">
                {children}
            </div>

        </div>
    )
}

export default BackgroundCanvas;