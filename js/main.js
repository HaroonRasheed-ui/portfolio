/**
 * main.js
 * Core application controller for Haroon Rasheed's 2026 Personal Portfolio.
 * Orchestrates dual-track recruiter/engineer modes, interactive filters,
 * command palette, case study drawer, and real-time systems telemetry.
 */

import { FLAGSHIP_PROJECTS, ALL_PROJECTS, TECH_EVIDENCE_MAP, WORK_EXPERIENCE, EDUCATION_RESEARCH } from './projects-data.js';
import { NeuralCanvas } from './canvas-neural.js';
import { PipelineSimulator } from './pipeline-sim.js';
import { CaseStudyDrawer } from './case-studies.js';
import { CommandPalette } from './cmdk.js';
import { SoundFX } from './audio.js';

class PortfolioApp {
  constructor() {
    this.audio = new SoundFX();
    this.caseStudies = new CaseStudyDrawer(this.audio.play.bind(this.audio));
    this.activeFilterCategory = 'all';
    this.activeTechEvidenceTag = null;
    this.searchQuery = '';
    this.isRecruiterMode = localStorage.getItem('haroon_recruiter_mode') === 'true';
    this.currentTheme = localStorage.getItem('haroon_theme') || 'light';

    this.init();
  }

  init() {
    // Initialize Theme
    this.initTheme();

    // Canvas background
    const canvasEl = document.getElementById('neural-canvas');
    if (canvasEl) {
      this.neuralCanvas = new NeuralCanvas(canvasEl);
    }

    // Interactive Systems Simulator
    const simContainer = document.getElementById('pipeline-simulator-container');
    if (simContainer) {
      this.simulator = new PipelineSimulator(
        simContainer, 
        (node) => {
          // On node select callback
        },
        this.audio.play.bind(this.audio)
      );
    }

    // Command Palette
    this.cmdk = new CommandPalette({
      playSound: this.audio.play.bind(this.audio),
      onSelectCaseStudy: (id) => {
        const p = FLAGSHIP_PROJECTS.find(item => item.id === id);
        if (p) this.caseStudies.open(p);
      },
      onToggleMode: () => this.toggleRecruiterMode(),
      onToggleAudio: () => this.toggleAudio()
    });

    // Render data-driven sections
    this.renderFlagshipProjects();
    this.renderTechMatrix();
    this.renderExperience();
    this.renderAllProjects();

    // Check deep link hash for case study drawer
    this.caseStudies.checkHash();

    // Bind UI controls & observers
    this.bindHeaderControls();
    this.bindNavScrollSpy();
    this.bindHeroScrollMotion();
    this.bindProjectFilters();
    this.bindTerminalWidget();
    this.initSectionObserver();
    this.applyRecruiterMode(this.isRecruiterMode, false);
    this.updateAudioButtonState();
  }

  // ----------------------------------------------------
  // THEME MANAGEMENT (Light Travertine vs Dark Espresso)
  // ----------------------------------------------------
  initTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('haroon_theme', this.currentTheme);
    this.audio.play('switch');
    if (this.neuralCanvas) this.neuralCanvas.triggerSectionWave();

    const toast = document.getElementById('mode-toast');
    if (toast) {
      toast.textContent = this.currentTheme === 'dark' 
        ? '🌙 Switched to Dark Roasted Espresso Theme' 
        : '☀️ Switched to Warm Travertine Paper Theme';
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 2800);
    }
  }

  // ----------------------------------------------------
  // DYNAMIC SECTION ENTRANCE OBSERVER
  // ----------------------------------------------------
  initSectionObserver() {
    const sections = document.querySelectorAll('.content-section');
    if (!('IntersectionObserver' in window)) {
      sections.forEach(s => s.classList.add('section-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(s => observer.observe(s));
  }

  // ----------------------------------------------------
  // DUAL-TRACK MODE: Recruiter (Fast) vs Engineer (Deep)
  // ----------------------------------------------------
  toggleRecruiterMode() {
    this.isRecruiterMode = !this.isRecruiterMode;
    localStorage.setItem('haroon_recruiter_mode', this.isRecruiterMode ? 'true' : 'false');
    this.applyRecruiterMode(this.isRecruiterMode, true);
    this.audio.play('switch');
  }

  applyRecruiterMode(isFast, showToast = false) {
    const root = document.documentElement;
    const modeToggleBtn = document.getElementById('mode-toggle-btn');
    const toast = document.getElementById('mode-toast');

    if (isFast) {
      root.classList.add('recruiter-mode-active');
      if (modeToggleBtn) {
        modeToggleBtn.innerHTML = `
          <span class="mode-pill fast-active">⚡ Recruiter</span>
        `;
        modeToggleBtn.setAttribute('title', 'Click to switch to Deep Engineering Mode');
      }
      if (showToast && toast) {
        toast.textContent = '⚡ Switched to Recruiter Fast Track (Highlighting Impact & Verification)';
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3200);
      }
    } else {
      root.classList.remove('recruiter-mode-active');
      if (modeToggleBtn) {
        modeToggleBtn.innerHTML = `
          <span class="mode-pill deep-active">🔬 Deep Mode</span>
        `;
        modeToggleBtn.setAttribute('title', 'Click to switch to Recruiter Fast Mode');
      }
      if (showToast && toast) {
        toast.textContent = '🔬 Switched to Deep Engineering Mode (Full Architecture & Telemetry)';
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3200);
      }
    }
  }

  toggleAudio() {
    const isNowEnabled = this.audio.toggle();
    this.updateAudioButtonState();
  }

  updateAudioButtonState() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      if (this.audio.enabled) {
        audioBtn.classList.add('active');
        audioBtn.setAttribute('aria-label', 'Sound Effects ON');
        audioBtn.setAttribute('title', 'Sound is ON (tactile clicks enabled). Click to mute.');
        audioBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <span class="audio-label">FX: ON</span>
        `;
      } else {
        audioBtn.classList.remove('active');
        audioBtn.setAttribute('aria-label', 'Sound Effects Muted');
        audioBtn.setAttribute('title', 'Sound is MUTED. Click to enable tactile mechanical audio clicks.');
        audioBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          <span class="audio-label">FX: Muted</span>
        `;
      }
    }
  }

  // ----------------------------------------------------
  // FLAGSHIP PROJECTS RENDERING
  // ----------------------------------------------------
  renderFlagshipProjects() {
    const container = document.getElementById('flagship-projects-grid');
    if (!container) return;

    container.innerHTML = FLAGSHIP_PROJECTS.map((p, idx) => `
      <article class="flagship-card" data-project-id="${p.id}">
        <div class="card-edge-glow"></div>
        <div class="card-header">
          <div class="card-meta">
            <span class="card-badge">${p.badge}</span>
            <span class="card-client font-mono">${p.client}</span>
          </div>
          <div class="card-metric-highlight font-mono">
            <span class="m-val">${p.highlightMetric}</span>
            <span class="m-lbl">${p.highlightMetricLabel}</span>
          </div>
        </div>

        <div class="card-main">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-subtitle">${p.subtitle}</p>
          <p class="card-summary">${p.summary}</p>

          <!-- QUICK BENCHMARK STRIP -->
          <div class="card-benchmarks">
            ${p.quickStats.slice(0, 3).map(stat => `
              <div class="benchmark-chip">
                <span class="b-lbl">${stat.label}</span>
                <span class="b-val">${stat.value}</span>
              </div>
            `).join('')}
          </div>

          <!-- TECH STACK PILLS -->
          <div class="card-tags">
            ${p.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div class="card-footer">
          <button class="btn btn-deep-dive" data-action="open-case-study" data-id="${p.id}">
            <span>Inspect System Architecture</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          ${p.githubUrl ? `
            <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="card-git-link" title="View Source on GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          ` : `
            <span class="card-git-lock font-mono" title="Deployed in Private Enterprise Infrastructure">🔒 Enterprise</span>
          `}
        </div>
      </article>
    `).join('');

    // Bind click events on buttons
    container.querySelectorAll('[data-action="open-case-study"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const project = FLAGSHIP_PROJECTS.find(p => p.id === id);
        if (project) {
          this.caseStudies.open(project);
        }
      });
    });
  }

  // ----------------------------------------------------
  // INTERACTIVE TECHNOLOGY MATRIX WITH REAL EVIDENCE
  // ----------------------------------------------------
  renderTechMatrix() {
    const container = document.getElementById('tech-matrix-container');
    if (!container) return;

    container.innerHTML = TECH_EVIDENCE_MAP.map(category => `
      <div class="tech-category-card">
        <h4 class="category-title font-mono">${category.category}</h4>
        <div class="skills-evidence-grid">
          ${category.skills.map(skill => `
            <div class="skill-evidence-node ${this.activeTechEvidenceTag === skill.name ? 'active-filtered' : ''}" data-skill="${skill.name}">
              <div class="sen-head">
                <span class="sen-name">${skill.name}</span>
                <span class="sen-level font-mono">${skill.level}</span>
              </div>
              <div class="sen-evidence">
                <span class="sen-label font-mono">DEPLOYED IN:</span>
                <span class="sen-proof">${skill.evidence}</span>
              </div>
              <p class="sen-impact">${skill.impact}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Bind click on skill nodes to filter projects
    container.querySelectorAll('.skill-evidence-node').forEach(node => {
      node.addEventListener('click', (e) => {
        const skillName = e.currentTarget.getAttribute('data-skill');
        this.filterByTech(skillName);
        this.audio.play('tick');
      });
    });
  }

  filterByTech(skillName) {
    if (this.activeTechEvidenceTag === skillName) {
      this.activeTechEvidenceTag = null;
    } else {
      this.activeTechEvidenceTag = skillName;
    }
    this.renderTechMatrix();

    // Scroll smoothly to project archive and apply search
    const archiveSection = document.getElementById('all-projects');
    const searchInput = document.getElementById('project-search-input');
    
    // Reset category filter to 'all' so that tech search searches across ALL systems
    this.activeFilterCategory = 'all';
    const catPills = document.querySelectorAll('.category-chip');
    catPills.forEach(p => {
      if (p.getAttribute('data-cat') === 'all') {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (this.activeTechEvidenceTag) {
      // Find searchKey if specified or simplify skill name
      let query = this.activeTechEvidenceTag;
      if (query === 'Docker & Linux') query = 'Docker';
      else if (query === 'OpenVINO (Intel)') query = 'OpenVINO';
      else if (query === 'QuickBooks Online (QBO)') query = 'QuickBooks';
      else if (query === 'RAG & Vector Search') query = 'pgvector';
      else if (query === 'Gemini 2.0 Flash') query = 'Gemini';

      if (searchInput) searchInput.value = query;
      this.searchQuery = query;
      this.renderAllProjects();
      if (archiveSection) {
        archiveSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (searchInput) searchInput.value = '';
      this.searchQuery = '';
      this.renderAllProjects();
    }
    if (this.neuralCanvas) this.neuralCanvas.triggerSectionWave();
  }

  // ----------------------------------------------------
  // COMPLETE 24+ PROJECTS ARCHIVE & SEARCH
  // ----------------------------------------------------
  renderAllProjects() {
    const container = document.getElementById('all-projects-grid');
    const countBadge = document.getElementById('project-count-badge');
    if (!container) return;

    let filtered = ALL_PROJECTS;

    // Filter by Category
    if (this.activeFilterCategory && this.activeFilterCategory !== 'all') {
      const catKey = this.activeFilterCategory.toLowerCase().trim();
      filtered = filtered.filter(p => {
        if (!p.category) return false;
        const pCat = p.category.toLowerCase();
        if (catKey === 'llm') return pCat.includes('llm') || pCat.includes('conversational');
        if (catKey === 'workflow') return pCat.includes('workflow') || pCat.includes('automation');
        if (catKey === 'vision') return pCat.includes('vision') || pCat.includes('audio') || pCat.includes('ocr');
        if (catKey === 'classical') return pCat.includes('classical');
        if (catKey === 'applied ml') return pCat.includes('applied') || pCat.includes('data science');
        return pCat.includes(catKey);
      });
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      const tokens = q.split(/[\s,&]+/).filter(tok => tok.length > 1);
      filtered = filtered.filter(p => {
        const title = p.title.toLowerCase();
        const subtitle = (p.subtitle || '').toLowerCase();
        const summary = (p.summary || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const tags = (p.tags || []).map(t => t.toLowerCase());

        return title.includes(q) ||
               subtitle.includes(q) ||
               summary.includes(q) ||
               category.includes(q) ||
               tags.some(t => t.includes(q) || q.includes(t)) ||
               (tokens.length > 0 && tokens.some(tok => tags.includes(tok) || title.includes(tok)));
      });
    }

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Projects`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-projects font-mono">
          <p>No projects found matching "${this.searchQuery || this.activeFilterCategory}".</p>
          <button class="btn btn-sm btn-outline" id="clear-search-btn">Reset All Filters</button>
        </div>
      `;
      const clearBtn = container.querySelector('#clear-search-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.searchQuery = '';
          this.activeFilterCategory = 'all';
          this.activeTechEvidenceTag = null;
          const input = document.getElementById('project-search-input');
          if (input) input.value = '';
          const catPills = document.querySelectorAll('.category-chip');
          catPills.forEach(p => {
            if (p.getAttribute('data-cat') === 'all') p.classList.add('active');
            else p.classList.remove('active');
          });
          this.renderAllProjects();
          this.renderTechMatrix();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(p => {
      const isFlagship = FLAGSHIP_PROJECTS.some(f => f.id === p.id);
      return `
        <div class="archive-project-card ${isFlagship ? 'is-flagship-item' : ''}">
          <div class="apc-top">
            <span class="apc-status font-mono ${p.status === 'Production' ? 'prod' : 'oss'}">${p.status || 'Active'}</span>
            ${p.githubUrl ? `
              <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="apc-git" title="View on GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            ` : `<span class="apc-git locked" title="Enterprise Private Repo">🔒</span>`}
          </div>

          <h4 class="apc-title">${p.title}</h4>
          <p class="apc-sub font-mono">${p.subtitle || ''}</p>
          <p class="apc-desc">${p.summary || ''}</p>

          <div class="apc-tags">
            ${(p.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>

          ${isFlagship ? `
            <button class="apc-deep-dive-btn" data-action="open-case-study" data-id="${p.id}">
              Inspect Blueprint →
            </button>
          ` : ''}
        </div>
      `;
    }).join('');

    // Re-bind deep dive buttons inside archive
    container.querySelectorAll('[data-action="open-case-study"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const project = FLAGSHIP_PROJECTS.find(p => p.id === id);
        if (project) this.caseStudies.open(project);
      });
    });
  }

  // ----------------------------------------------------
  // WORK EXPERIENCE & VERIFIED EVIDENCE TIMELINE
  // ----------------------------------------------------
  renderExperience() {
    const container = document.getElementById('experience-timeline-container');
    if (!container) return;

    container.innerHTML = WORK_EXPERIENCE.map(job => `
      <div class="timeline-item">
        <div class="timeline-indicator">
          <span class="tl-dot"></span>
          <span class="tl-line"></span>
        </div>
        <div class="timeline-card">
          <div class="tl-header">
            <div>
              <h3 class="tl-role">${job.role}</h3>
              <div class="tl-company-row">
                <span class="tl-company">${job.company}</span>
                <span class="tl-loc font-mono">📍 ${job.location}</span>
              </div>
            </div>
            <div class="tl-badge-col">
              <span class="tl-tag font-mono">${job.tag}</span>
              <span class="tl-period font-mono">${job.period}</span>
            </div>
          </div>
          <ul class="tl-bullets">
            ${job.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  // ----------------------------------------------------
  // INTERACTION BINDINGS
  // ----------------------------------------------------
  bindHeaderControls() {
    // Theme toggle (Light Travertine vs Dark Roasted Espresso)
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Mode toggle
    const modeBtn = document.getElementById('mode-toggle-btn');
    if (modeBtn) {
      modeBtn.addEventListener('click', () => this.toggleRecruiterMode());
    }

    // Audio toggle
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => this.toggleAudio());
    }

    // Command palette triggers
    const cmdkTrigger = document.getElementById('cmdk-trigger-btn');
    if (cmdkTrigger) {
      cmdkTrigger.addEventListener('click', () => this.cmdk.open());
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileNavDrawer.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        this.audio.play('click');
      });

      mobileNavDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNavDrawer.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Quick Copy Email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('haroon5253rasheed@gmail.com').then(() => {
          this.audio.play('success');
          const original = copyEmailBtn.innerHTML;
          copyEmailBtn.innerHTML = `<span>✓ Copied!</span>`;
          setTimeout(() => { copyEmailBtn.innerHTML = original; }, 2000);
        });
      });
    }
  }

  bindNavScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = Array.from(navLinks).map(link => {
      const id = link.getAttribute('href');
      return document.querySelector(id);
    }).filter(Boolean);

    let lastActiveId = null;
    const progressBar = document.getElementById('scroll-progress-fill');

    // Add click ripple and wave trigger on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (this.neuralCanvas) this.neuralCanvas.triggerSectionWave();
        this.audio.play('click');
      });
    });

    window.addEventListener('scroll', () => {
      // Update reading progress bar
      if (progressBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / (docHeight || 1)) * 100;
        progressBar.style.width = `${progress}%`;
      }

      // ScrollSpy
      const scrollPos = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.offsetTop <= scrollPos) {
          const id = '#' + sec.id;
          if (lastActiveId !== id) {
            lastActiveId = id;
            if (this.neuralCanvas) this.neuralCanvas.triggerSectionWave();
          }
          navLinks.forEach(l => {
            if (l.getAttribute('href') === id) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });
          break;
        }
      }
    }, { passive: true });
  }

  bindHeroScrollMotion() {
    const heroWrap = document.querySelector('.hero-content-wrap');
    if (!heroWrap) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < 900) {
            const translateY = -(scrollY * 0.22);
            const opacity = Math.max(0.15, 1 - (scrollY / 720));
            heroWrap.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
            heroWrap.style.opacity = opacity.toFixed(2);
          } else if (heroWrap.style.transform !== 'none') {
            heroWrap.style.transform = 'none';
            heroWrap.style.opacity = '1';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  bindTerminalWidget() {
    const pillsContainer = document.getElementById('terminal-pills');
    const convoContainer = document.getElementById('terminal-conversation');
    if (!pillsContainer || !convoContainer) return;

    const conversations = {
      n8n: [
        { role: 'user', text: 'Can you automate our onboarding flow?' },
        { role: 'ai', text: 'Connecting your CRM, email, and Slack with n8n. Done in minutes.' },
        { role: 'user', text: 'What about a 24/7 support chatbot?' },
        { role: 'ai', text: 'Built with LangChain and the OpenAI API. Ready to ship.' }
      ],
      langchain: [
        { role: 'user', text: 'How do you prevent hallucinations in enterprise chatbots?' },
        { role: 'ai', text: 'LangChain RAG pipeline grounded in pgvector similarity with zero drift.' },
        { role: 'user', text: 'Can it cite original source PDFs?' },
        { role: 'ai', text: 'Yes, precise page-numbered citations and timestamped chunk metadata.' }
      ],
      fastapi: [
        { role: 'user', text: 'How fast is your document OCR inference?' },
        { role: 'ai', text: 'HaeirLens processes multi-page scans in 15 to 20 seconds (~0.26s/region).' },
        { role: 'user', text: 'Does it support asynchronous high-throughput queues?' },
        { role: 'ai', text: 'FastAPI async workers with pre-allocated OpenVINO inference requests.' }
      ],
      openai: [
        { role: 'user', text: 'How do you guarantee valid JSON from LLMs?' },
        { role: 'ai', text: 'OpenAI JSON Schema mode validated with strict Pydantic v2 schemas.' },
        { role: 'user', text: 'What if confidence drops below 90%?' },
        { role: 'ai', text: 'Automated human-in-the-loop exception routing dispatches to operators.' }
      ],
      python: [
        { role: 'user', text: 'What backend systems do you architect in Python?' },
        { role: 'ai', text: 'FastAPI, PyTorch, PaddleOCR, OpenVINO HPI, and Docker containers.' },
        { role: 'user', text: 'Are these running live in production?' },
        { role: 'ai', text: 'Yes, handling thousands of corporate transactions every week.' }
      ],
      rag: [
        { role: 'user', text: 'Can we run private meeting copilots on-premise?' },
        { role: 'ai', text: '100% on-premises with local Faster-Whisper and pgvector HNSW.' },
        { role: 'user', text: 'Any data sent to external cloud APIs?' },
        { role: 'ai', text: 'Zero external data egress. Completely private and air-gapped.' }
      ]
    };

    pillsContainer.querySelectorAll('.term-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        pillsContainer.querySelectorAll('.term-tag-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const tag = e.currentTarget.getAttribute('data-tag');
        const dialogue = conversations[tag] || conversations.n8n;

        this.audio.play('tick');
        if (this.neuralCanvas) this.neuralCanvas.triggerSectionWave();

        convoContainer.innerHTML = dialogue.map(msg => `
          <div class="chat-bubble ${msg.role === 'user' ? 'user-msg' : 'ai-msg'} font-mono">
            ${msg.text}
          </div>
        `).join('');
      });
    });
  }

  bindProjectFilters() {
    // Search input
    const searchInput = document.getElementById('project-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderAllProjects();
      });
    }

    // Category pills
    const catPills = document.querySelectorAll('.category-chip');
    catPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        catPills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeFilterCategory = e.currentTarget.getAttribute('data-cat');
        // Clear previous search and tech matrix filter so category displays immediately
        this.activeTechEvidenceTag = null;
        this.renderTechMatrix();
        const searchInput = document.getElementById('project-search-input');
        if (searchInput) searchInput.value = '';
        this.searchQuery = '';
        this.audio.play('click');
        if (this.neuralCanvas) this.neuralCanvas.triggerSectionWave();
        this.renderAllProjects();
      });
    });
  }
}

// Instantiate reliably regardless of document readyState
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.__portfolioApp = new PortfolioApp();
  });
} else {
  window.__portfolioApp = new PortfolioApp();
}

