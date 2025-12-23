import { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Background = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const particles: Particle[] = [];
      const numParticles = 50;

      class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        color: { r: number; g: number; b: number };

        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.size = p.random(2, 6);
          this.speedX = p.random(-0.3, 0.3);
          this.speedY = p.random(-0.3, 0.3);
          this.opacity = p.random(30, 80);
          // Gold/amber colors
          this.color = {
            r: p.random(200, 220),
            g: p.random(160, 180),
            b: p.random(80, 120)
          };
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          // Wrap around edges
          if (this.x > p.width) this.x = 0;
          if (this.x < 0) this.x = p.width;
          if (this.y > p.height) this.y = 0;
          if (this.y < 0) this.y = p.height;
        }

        draw() {
          p.noStroke();
          p.fill(this.color.r, this.color.g, this.color.b, this.opacity);
          p.ellipse(this.x, this.y, this.size);
        }

        connect(others: Particle[]) {
          others.forEach(other => {
            const d = p.dist(this.x, this.y, other.x, other.y);
            if (d < 150) {
              p.stroke(this.color.r, this.color.g, this.color.b, p.map(d, 0, 150, 40, 0));
              p.strokeWeight(0.5);
              p.line(this.x, this.y, other.x, other.y);
            }
          });
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        canvas.style('pointer-events', 'none');

        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        p.clear();
        
        // Draw floating particles
        particles.forEach(particle => {
          particle.update();
          particle.draw();
          particle.connect(particles);
        });

        // Draw subtle wave effect at bottom
        p.noFill();
        for (let i = 0; i < 3; i++) {
          p.stroke(200, 170, 100, 15 - i * 4);
          p.strokeWeight(1);
          p.beginShape();
          for (let x = 0; x <= p.width; x += 20) {
            const y = p.height - 100 + p.sin((x + p.frameCount * 0.5 + i * 30) * 0.01) * 30;
            p.vertex(x, y);
          }
          p.endShape();
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      p5InstanceRef.current?.remove();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default P5Background;
