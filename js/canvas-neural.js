/**
 * canvas-neural.js
 * Dynamic, animated background engine with warm organic generative flow,
 * floating data nodes, interactive mouse ripples, and section transition waves.
 * Theme: Warm Editorial Studio (Parchment, Terracotta, Soft Amber, and Sage).
 */

export class NeuralCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.nodes = [];
    this.packets = [];
    this.ripples = [];
    this.orbs = [];
    this.pointer = { x: -9999, y: -9999, isHovering: false, prevX: -9999, prevY: -9999, speed: 0 };
    this.animationFrameId = null;
    this.isVisible = true;
    this.time = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    this.createOrbs();
    this.createNodes();
    this.bindEvents();
    if (!this.reducedMotion) {
      this.start();
    } else {
      this.drawStaticFrame();
    }
  }

  resize() {
    this.width = this.canvas.parentElement ? this.canvas.parentElement.offsetWidth : window.innerWidth;
    this.height = this.canvas.parentElement ? this.canvas.parentElement.offsetHeight : window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createOrbs() {
    this.orbs = [
      { x: this.width * 0.2, y: this.height * 0.25, r: 240, color: 'rgba(217, 180, 142, 0.16)', vx: 0.15, vy: 0.1, phase: 0 },
      { x: this.width * 0.8, y: this.height * 0.45, r: 300, color: 'rgba(167, 93, 40, 0.12)', vx: -0.12, vy: 0.15, phase: Math.PI },
      { x: this.width * 0.5, y: this.height * 0.8, r: 260, color: 'rgba(180, 195, 180, 0.18)', vx: 0.1, vy: -0.12, phase: Math.PI * 0.5 }
    ];
  }

  createNodes() {
    this.nodes = [];
    this.packets = [];
    const isMobile = this.width < 768;
    const count = isMobile ? 24 : 48;

    const colors = [
      '#A75D28', // Terracotta
      '#B45309', // Warm Amber
      '#386641', // Sage Green
      '#78736B'  // Muted Graphite
    ];

    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.4 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseVal: Math.random() * Math.PI * 2
      });
    }
  }

  triggerSectionWave(x = null, y = null) {
    const originX = x !== null ? x : this.width / 2;
    const originY = y !== null ? y : this.height / 3;
    
    // Multi-tier shockwave pulses
    this.ripples.push({
      x: originX,
      y: originY,
      radius: 4,
      maxRadius: Math.max(this.width, this.height) * 0.75,
      alpha: 0.65,
      speed: 4.8,
      color: '#A75D28'
    });

    setTimeout(() => {
      this.ripples.push({
        x: originX,
        y: originY,
        radius: 8,
        maxRadius: Math.max(this.width, this.height) * 0.6,
        alpha: 0.45,
        speed: 4.0,
        color: '#B45309'
      });
    }, 120);

    // Impart kinetic impulse on nearby nodes
    this.nodes.forEach(node => {
      const dx = node.x - originX;
      const dy = node.y - originY;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.min(2.5, 320 / dist);
      node.vx += (dx / dist) * force * 0.35;
      node.vy += (dy / dist) * force * 0.35;
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createOrbs();
      this.createNodes();
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      if (delta > 25 && Math.random() < 0.25) {
        this.nodes.forEach(n => {
          n.vx += (Math.random() - 0.5) * 0.2;
          n.vy += (Math.random() - 0.5) * 0.2;
        });
      }
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      if (this.pointer.isHovering) {
        const dx = newX - this.pointer.x;
        const dy = newY - this.pointer.y;
        this.pointer.speed = Math.hypot(dx, dy);

        // Spawn a gentle micro-ripple if moving with good velocity
        if (this.pointer.speed > 25 && Math.random() < 0.2 && this.ripples.length < 8) {
          this.ripples.push({
            x: newX,
            y: newY,
            radius: 8,
            maxRadius: 110,
            alpha: 0.35,
            color: '#A75D28'
          });
        }
      }

      this.pointer.x = newX;
      this.pointer.y = newY;
      this.pointer.isHovering = true;
    });

    window.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 10,
        maxRadius: 220,
        alpha: 0.6,
        color: '#A75D28'
      });
    });

    window.addEventListener('mouseleave', () => {
      this.pointer.isHovering = false;
      this.pointer.x = -9999;
      this.pointer.y = -9999;
    });

    // Observer to pause when scrolled out of view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.animationFrameId && !this.reducedMotion) {
            this.start();
          } else if (!this.isVisible && this.animationFrameId) {
            this.stop();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(this.canvas);
    }

    // Tab visibility handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (this.isVisible && !this.reducedMotion) {
        this.start();
      }
    });

    // Reduced motion change listener
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.stop();
        this.drawStaticFrame();
      } else {
        this.start();
      }
    });
  }

  start() {
    if (this.animationFrameId) return;
    const loop = () => {
      this.update();
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  update() {
    this.time += 0.015;
    const maxDistance = this.width < 768 ? 95 : 140;
    const pointerRadius = 160;

    // Update ambient orbs
    for (const orb of this.orbs) {
      orb.phase += 0.01;
      orb.x += orb.vx + Math.sin(orb.phase) * 0.2;
      orb.y += orb.vy + Math.cos(orb.phase) * 0.2;
      if (orb.x < -100 || orb.x > this.width + 100) orb.vx *= -1;
      if (orb.y < -100 || orb.y > this.height + 100) orb.vy *= -1;
    }

    // Periodically spawn data packets along connections
    if (Math.random() < 0.04 && this.packets.length < 10) {
      const nodeA = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      let closestNode = null;
      let closestDist = maxDistance;
      for (const nodeB of this.nodes) {
        if (nodeA === nodeB) continue;
        const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
        if (dist < closestDist) {
          closestDist = dist;
          closestNode = nodeB;
        }
      }
      if (closestNode) {
        this.packets.push({
          from: nodeA,
          to: closestNode,
          progress: 0,
          speed: Math.random() * 0.025 + 0.015,
          color: '#A75D28'
        });
      }
    }

    // Update nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;
      node.pulseVal += node.pulseSpeed;

      // Bounce boundaries
      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;

      // Pointer magnetism
      if (this.pointer.isHovering) {
        const pdx = this.pointer.x - node.x;
        const pdy = this.pointer.y - node.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < pointerRadius) {
          const force = (1 - pdist / pointerRadius) * 0.09;
          node.x += pdx * force;
          node.y += pdy * force;
        }
      }
    }

    // Update packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const pkt = this.packets[i];
      pkt.progress += pkt.speed;
      if (pkt.progress >= 1) {
        this.packets.splice(i, 1);
      }
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 3.2;
      r.alpha *= 0.96;
      if (r.alpha <= 0.01 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
  }

  isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const dark = this.isDark();
    const terracottaColor = dark ? '#C87A3E' : '#A75D28';
    const terracottaRgba = dark ? 'rgba(200, 122, 62, ' : 'rgba(167, 93, 40, ';

    // 1. Draw warm ambient gradient orbs
    for (const orb of this.orbs) {
      const grad = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
      grad.addColorStop(0, dark ? (orb.color.replace('0.16', '0.08').replace('0.12', '0.07').replace('0.18', '0.06')) : orb.color);
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Draw organic generative wave curves
    this.drawGenerativeWaves(terracottaRgba);

    // 3. Draw ripples
    for (const r of this.ripples) {
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `${terracottaRgba}${r.alpha})`;
      this.ctx.lineWidth = 1.4;
      this.ctx.stroke();
    }

    const maxDistance = this.width < 768 ? 95 : 140;

    // 4. Draw synaptic connection lines
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const na = this.nodes[i];
        const nb = this.nodes[j];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * (dark ? 0.22 : 0.18);
          this.ctx.beginPath();
          this.ctx.moveTo(na.x, na.y);
          this.ctx.lineTo(nb.x, nb.y);
          this.ctx.strokeStyle = `${terracottaRgba}${alpha})`;
          this.ctx.lineWidth = 0.9;
          this.ctx.stroke();
        }
      }
    }

    // 5. Draw packets
    for (const pkt of this.packets) {
      const px = pkt.from.x + (pkt.to.x - pkt.from.x) * pkt.progress;
      const py = pkt.from.y + (pkt.to.y - pkt.from.y) * pkt.progress;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.6, 0, Math.PI * 2);
      this.ctx.fillStyle = terracottaColor;
      this.ctx.shadowColor = terracottaColor;
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 6. Draw nodes
    for (const node of this.nodes) {
      const alpha = node.baseAlpha + Math.sin(node.pulseVal) * 0.16;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = (node.color === '#A75D28' && dark) ? '#C87A3E' : node.color;
      this.ctx.globalAlpha = Math.max(0.15, Math.min(alpha, 0.85));
      this.ctx.fill();

      // Subtle halo around warm terracotta nodes
      if (node.color === '#A75D28' || node.color === '#C87A3E') {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `${terracottaRgba}0.12)`;
        this.ctx.fill();
      }
    }
    this.ctx.globalAlpha = 1.0;
  }

  drawGenerativeWaves(terracottaRgba = 'rgba(167, 93, 40, ') {
    this.ctx.save();
    this.ctx.strokeStyle = `${terracottaRgba}0.07)`;
    this.ctx.lineWidth = 1.3;

    const waveCount = 2;
    for (let w = 0; w < waveCount; w++) {
      this.ctx.beginPath();
      const baseY = this.height * (0.35 + w * 0.25);
      const freq = 0.0025 + w * 0.001;
      const speed = this.time * (0.8 + w * 0.4);

      for (let x = 0; x <= this.width; x += 15) {
        const y = baseY + Math.sin(x * freq + speed) * 35 + Math.cos(x * 0.0015 - speed * 0.5) * 20;
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawStaticFrame() {
    this.draw();
  }
}
