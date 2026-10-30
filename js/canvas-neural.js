/**
 * canvas-neural.js
 * High-performance, full-viewport dynamic animated background engine.
 * Features organic generative wave flow, floating neural network data nodes,
 * kinetic scroll physics, mouse interaction ripples, and section transition shockwaves.
 * Supports: Warm Editorial Studio (Travertine Paper & Roasted Espresso Obsidian).
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
    this.time = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scrollVelocity = 0;

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
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  createOrbs() {
    this.orbs = [
      { x: this.width * 0.15, y: this.height * 0.25, r: 280, color: 'rgba(217, 180, 142, 0.20)', vx: 0.18, vy: 0.12, phase: 0 },
      { x: this.width * 0.85, y: this.height * 0.40, r: 340, color: 'rgba(167, 93, 40, 0.16)', vx: -0.15, vy: 0.16, phase: Math.PI },
      { x: this.width * 0.50, y: this.height * 0.80, r: 300, color: 'rgba(180, 195, 180, 0.20)', vx: 0.12, vy: -0.14, phase: Math.PI * 0.5 }
    ];
  }

  createNodes() {
    this.nodes = [];
    this.packets = [];
    const isMobile = this.width < 768;
    const count = isMobile ? 32 : 62;

    const colorsLight = ['#A75D28', '#B45309', '#2E7D32', '#78736B'];
    const colorsDark = ['#C87A3E', '#F59E0B', '#4ADE80', '#A8A29E'];
    const colors = this.isDark() ? colorsDark : colorsLight;

    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.6 + 1.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.45 + 0.35,
        pulseSpeed: Math.random() * 0.035 + 0.015,
        pulseVal: Math.random() * Math.PI * 2
      });
    }
  }

  spawnRandomPacket() {
    if (this.nodes.length < 2) return;
    const maxDistance = this.width < 768 ? 110 : 160;
    const idxA = Math.floor(Math.random() * this.nodes.length);
    const nodeA = this.nodes[idxA];

    for (let j = 0; j < this.nodes.length; j++) {
      if (idxA === j) continue;
      const nodeB = this.nodes[j];
      const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
      if (dist < maxDistance) {
        this.packets.push({
          from: nodeA,
          to: nodeB,
          progress: 0,
          speed: 0.03 + Math.random() * 0.04
        });
        break;
      }
    }
  }

  triggerSectionWave(x = null, y = null) {
    const originX = x !== null ? x : this.width / 2;
    const originY = y !== null ? y : this.height * 0.38;
    const dark = this.isDark();
    
    const c1 = dark ? '#C87A3E' : '#A75D28';
    const c2 = dark ? '#F59E0B' : '#B45309';
    const c3 = dark ? '#4ADE80' : '#2E7D32';

    // Concentric shockwave pulses
    this.ripples.push({
      x: originX,
      y: originY,
      radius: 6,
      maxRadius: Math.max(this.width, this.height) * 0.95,
      alpha: 0.8,
      speed: 6.8,
      color: c1
    });

    setTimeout(() => {
      this.ripples.push({
        x: originX,
        y: originY,
        radius: 12,
        maxRadius: Math.max(this.width, this.height) * 0.8,
        alpha: 0.6,
        speed: 5.6,
        color: c2
      });
    }, 90);

    setTimeout(() => {
      this.ripples.push({
        x: originX,
        y: originY,
        radius: 18,
        maxRadius: Math.max(this.width, this.height) * 0.65,
        alpha: 0.45,
        speed: 4.8,
        color: c3
      });
    }, 180);

    // Dynamic kinetic impulse on all nodes radiating from origin
    this.nodes.forEach(node => {
      const dx = node.x - originX;
      const dy = node.y - originY;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.min(5.2, 500 / dist);
      node.vx += (dx / dist) * force * 0.7;
      node.vy += (dy / dist) * force * 0.7;
      node.pulseVal += Math.PI * 0.5;
    });

    // Fire an energetic burst of signal packets
    for (let k = 0; k < 8; k++) {
      this.spawnRandomPacket();
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createOrbs();
      this.createNodes();
    });

    // Scroll kinetics: background reacts dynamically to scroll velocity and direction
    let lastScrollY = window.scrollY;
    let scrollTimer = null;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const absDelta = Math.abs(delta);
      lastScrollY = currentScrollY;

      if (absDelta > 1) {
        const dir = delta > 0 ? 1 : -1;
        const impulse = Math.min(absDelta * 0.09, 4.5);
        this.scrollVelocity = dir * impulse;

        this.nodes.forEach(n => {
          n.vy -= dir * (impulse * 0.38 + (Math.random() - 0.5) * 0.4);
          n.vx += (Math.random() - 0.5) * 0.35;
        });

        // Spawn dynamic packets while scrolling
        if (Math.random() < 0.35 && this.packets.length < 20) {
          this.spawnRandomPacket();
        }

        // Fast scroll generates fluid wake ripples
        if (absDelta > 26 && Math.random() < 0.3 && this.ripples.length < 8) {
          this.ripples.push({
            x: Math.random() * this.width,
            y: dir > 0 ? this.height * 0.85 : this.height * 0.15,
            radius: 10,
            maxRadius: 200,
            alpha: 0.45,
            speed: 4.2,
            color: this.isDark() ? '#C87A3E' : '#A75D28'
          });
        }

        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          this.scrollVelocity = 0;
        }, 120);
      }
    }, { passive: true });

    // Pointer movement
    window.addEventListener('mousemove', (e) => {
      const newX = e.clientX;
      const newY = e.clientY;

      if (this.pointer.isHovering) {
        const dx = newX - this.pointer.x;
        const dy = newY - this.pointer.y;
        this.pointer.speed = Math.hypot(dx, dy);

        // Spawn gentle interactive micro-ripples on brisk pointer moves
        if (this.pointer.speed > 28 && Math.random() < 0.22 && this.ripples.length < 8) {
          this.ripples.push({
            x: newX,
            y: newY,
            radius: 8,
            maxRadius: 130,
            alpha: 0.4,
            speed: 3.6,
            color: this.isDark() ? '#C87A3E' : '#A75D28'
          });
        }
      }

      this.pointer.x = newX;
      this.pointer.y = newY;
      this.pointer.isHovering = true;
    });

    window.addEventListener('click', (e) => {
      this.ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 240,
        alpha: 0.65,
        speed: 4.8,
        color: this.isDark() ? '#C87A3E' : '#A75D28'
      });
      for (let k = 0; k < 3; k++) this.spawnRandomPacket();
    });

    window.addEventListener('mouseleave', () => {
      this.pointer.isHovering = false;
      this.pointer.x = -9999;
      this.pointer.y = -9999;
    });

    // Tab visibility handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (!this.reducedMotion) {
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
    this.time += 0.016;
    const maxDistance = this.width < 768 ? 110 : 160;
    const pointerRadius = 180;

    // Update ambient orbs
    for (const orb of this.orbs) {
      orb.phase += 0.012;
      orb.x += orb.vx + Math.sin(orb.phase) * 0.25;
      orb.y += orb.vy + Math.cos(orb.phase) * 0.25;
      if (orb.x < -100 || orb.x > this.width + 100) orb.vx *= -1;
      if (orb.y < -100 || orb.y > this.height + 100) orb.vy *= -1;
    }

    // Update nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;
      node.pulseVal += node.pulseSpeed;

      // Friction damping back to gentle ambient drift
      node.vx *= 0.985;
      node.vy *= 0.985;
      if (Math.abs(node.vx) < 0.12) node.vx += (Math.random() - 0.5) * 0.12;
      if (Math.abs(node.vy) < 0.12) node.vy += (Math.random() - 0.5) * 0.12;

      // Screen boundaries wrap / bounce
      if (node.x < 0) { node.x = 0; node.vx *= -1; }
      if (node.x > this.width) { node.x = this.width; node.vx *= -1; }
      if (node.y < 0) { node.y = 0; node.vy *= -1; }
      if (node.y > this.height) { node.y = this.height; node.vy *= -1; }

      // Pointer magnetism
      if (this.pointer.isHovering) {
        const pdx = this.pointer.x - node.x;
        const pdy = this.pointer.y - node.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < pointerRadius) {
          const force = (1 - pdist / pointerRadius) * 0.12;
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
      r.radius += r.speed || 3.5;
      r.alpha *= 0.965;
      if (r.alpha <= 0.015 || r.radius >= r.maxRadius) {
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
      grad.addColorStop(0, dark ? (orb.color.replace('0.20', '0.10').replace('0.16', '0.08')) : orb.color);
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Draw organic generative wave curves
    this.drawGenerativeWaves(terracottaRgba);

    // 3. Draw shockwave ripples
    for (const r of this.ripples) {
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = r.color ? `${r.color}${Math.floor(r.alpha * 255).toString(16).padStart(2, '0')}` : `${terracottaRgba}${r.alpha})`;
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();
    }

    const maxDistance = this.width < 768 ? 110 : 160;

    // 4. Draw synaptic connection lines
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const na = this.nodes[i];
        const nb = this.nodes[j];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * (dark ? 0.28 : 0.22);
          this.ctx.beginPath();
          this.ctx.moveTo(na.x, na.y);
          this.ctx.lineTo(nb.x, nb.y);
          this.ctx.strokeStyle = `${terracottaRgba}${alpha})`;
          this.ctx.lineWidth = 1.0;
          this.ctx.stroke();
        }
      }
    }

    // 5. Draw signal packets
    for (const pkt of this.packets) {
      const px = pkt.from.x + (pkt.to.x - pkt.from.x) * pkt.progress;
      const py = pkt.from.y + (pkt.to.y - pkt.from.y) * pkt.progress;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.8, 0, Math.PI * 2);
      this.ctx.fillStyle = terracottaColor;
      this.ctx.shadowColor = terracottaColor;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 6. Draw neural nodes
    for (const node of this.nodes) {
      const alpha = node.baseAlpha + Math.sin(node.pulseVal) * 0.18;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = (node.color === '#A75D28' && dark) ? '#C87A3E' : node.color;
      this.ctx.globalAlpha = Math.max(0.18, Math.min(alpha, 0.9));
      this.ctx.fill();

      // Halo on accent nodes
      if (node.color === '#A75D28' || node.color === '#C87A3E') {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 2.4, 0, Math.PI * 2);
        this.ctx.fillStyle = `${terracottaRgba}0.14)`;
        this.ctx.fill();
      }
    }
    this.ctx.globalAlpha = 1.0;
  }

  drawGenerativeWaves(terracottaRgba = 'rgba(167, 93, 40, ') {
    this.ctx.save();
    this.ctx.strokeStyle = `${terracottaRgba}0.09)`;
    this.ctx.lineWidth = 1.4;

    const waveCount = 2;
    for (let w = 0; w < waveCount; w++) {
      this.ctx.beginPath();
      const baseY = this.height * (0.35 + w * 0.3);
      const freq = 0.0022 + w * 0.001;
      const speed = this.time * (0.8 + w * 0.4);

      for (let x = 0; x <= this.width; x += 15) {
        const y = baseY + Math.sin(x * freq + speed) * 38 + Math.cos(x * 0.0015 - speed * 0.5) * 22;
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
