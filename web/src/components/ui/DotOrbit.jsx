import React, { useEffect, useRef } from "react";

const DotOrbit = ({
    speed = 0.1,
    density = 15,
    interaction = "repel",
    interactionRadius = 300,
    interactionStrength = 1.5,
    mode = "orbit",
    alpha = 0.3,
    background = "transparent",
    color = "rgba(99, 102, 241, 0.4)",
    linkColor = "rgba(99, 102, 241, 0.1)",
    linkDistance = 140,
    tracking = "global",
    cursorEase = 15,
    dotSize = 1,
}) => {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const mouseRef = useRef({ targetX: 0, targetY: 0, x: 0, y: 0, inside: false, hasInit: false });

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 1;
        let h = 1;

        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
        const easeToLerp = (ease) => clamp((clamp(ease, 0, 100) / 100) * 0.3, 0, 0.3);

        const resize = () => {
            const r = wrap.getBoundingClientRect();
            w = Math.max(1, Math.floor(r.width));
            h = Math.max(1, Math.floor(r.height));
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const m = mouseRef.current;
            if (!m.hasInit) {
                m.targetX = w * 0.5;
                m.targetY = h * 0.5;
                m.x = m.targetX;
                m.y = m.targetY;
                m.hasInit = true;
            }
        };

        const ro = new ResizeObserver(resize);
        ro.observe(wrap);
        resize();

        const rebuildDots = () => {
            const count = clamp(Math.floor(((w * h) / 12000) * density), 10, 150);
            const cx = w * 0.5;
            const cy = h * 0.45;
            return Array.from({ length: count }).map((_, i) => {
                const r = Math.min(w, h) * (0.2 + Math.random() * 0.55);
                const a = Math.random() * Math.PI * 2;
                return {
                    i,
                    x: cx + Math.cos(a) * r,
                    y: cy + Math.sin(a) * r,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: (Math.random() - 0.5) * 0.6,
                    baseR: r,
                    baseA: a,
                    phase: Math.random() * Math.PI * 2,
                };
            });
        };

        let dots = rebuildDots();
        let lastArea = w * h;

        const onWindowPointerMove = (e) => {
            if (tracking !== "global") return;
            const r = wrap.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const inside = x >= 0 && x <= r.width && y >= 0 && y <= r.height;
            const m = mouseRef.current;
            m.targetX = x;
            m.targetY = y;
            m.inside = inside;
        };

        if (tracking === "global") {
            window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
        }

        let animationFrameId;

        const render = (tMs) => {
            const t = (tMs / 1000);
            const area = w * h;
            if (Math.abs(area - lastArea) / Math.max(1, lastArea) > 0.3) {
                dots = rebuildDots();
                lastArea = area;
            }

            const m = mouseRef.current;
            const lerp = easeToLerp(cursorEase);
            if (lerp > 0) {
                m.x += (m.targetX - m.x) * lerp;
                m.y += (m.targetY - m.y) * lerp;
            } else {
                m.x = m.targetX;
                m.y = m.targetY;
            }

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, w, h);

            const cx = w * 0.5;
            const cy = h * 0.5;
            const interactionEnabled = interaction !== "off";
            const ir2 = interactionRadius * interactionRadius;
            const strength = interactionStrength;

            ctx.fillStyle = color;

            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                if (mode === "orbit") {
                    const a = d.baseA + t * speed * 0.7 + Math.sin(t * 0.6 + d.phase) * 0.15;
                    const rr = d.baseR * (0.92 + 0.08 * Math.sin(t * 1.2 + d.phase));
                    d.x = cx + Math.cos(a) * rr;
                    d.y = cy + Math.sin(a) * rr;
                } else {
                    d.x += d.vx * speed;
                    d.y += d.vy * speed;
                    if (d.x < -20) d.x = w + 20;
                    if (d.x > w + 20) d.x = -20;
                    if (d.y < -20) d.y = h + 20;
                    if (d.y > h + 20) d.y = -20;
                }

                if (interactionEnabled && m.inside) {
                    const dx = d.x - m.x;
                    const dy = d.y - m.y;
                    const dist2 = dx * dx + dy * dy;
                    if (dist2 < ir2) {
                        const dist = Math.sqrt(dist2) || 1;
                        const falloff = 1 - dist / interactionRadius;
                        const sign = interaction === "repel" ? 1 : -1;
                        const push = sign * falloff * falloff * strength;
                        d.x += (dx / dist) * push;
                        d.y += (dy / dist) * push;
                    }
                }
            }

            // Draw Links
            const ld2 = linkDistance * linkDistance;
            for (let i = 0; i < dots.length; i++) {
                const d1 = dots[i];
                for (let j = i + 1; j < dots.length; j++) {
                    const d2 = dots[j];
                    const distSq = (d1.x - d2.x) ** 2 + (d1.y - d2.y) ** 2;
                    if (distSq < ld2) {
                        const opacity = (1 - Math.sqrt(distSq) / linkDistance) * alpha;
                        ctx.beginPath();
                        ctx.strokeStyle = linkColor.replace(/[\d.]+\)$/, `${opacity})`);
                        ctx.lineWidth = 1;
                        ctx.moveTo(d1.x, d1.y);
                        ctx.lineTo(d2.x, d2.y);
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.arc(d1.x, d1.y, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            ro.disconnect();
            window.removeEventListener("pointermove", onWindowPointerMove);
        };
    }, [speed, density, interaction, interactionRadius, interactionStrength, mode, background, color, linkColor, linkDistance, tracking, cursorEase, alpha, dotSize]);

    return (
        <div ref={wrapRef} className="fixed inset-0 pointer-events-none z-0">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default DotOrbit;
