/**
 * case-studies.js
 * High-depth technical case study drawer for Haroon Rasheed's flagship projects.
 * Supports deep architecture blueprints, failure-mode analysis, trade-off comparisons,
 * benchmark telemetry, and verified code walkthroughs.
 */

import { FLAGSHIP_PROJECTS } from './projects-data.js';

export class CaseStudyDrawer {
  constructor(playSound) {
    this.playSound = playSound || (() => {});
    this.activeProject = null;
    this.activeTab = 'architecture';
    this.isOpen = false;

    this.createDrawerDOM();
    this.bindGlobalEvents();
  }

  createDrawerDOM() {
    const el = document.createElement('div');
    el.id = 'case-study-modal';
    el.className = 'cs-modal-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="cs-backdrop" id="cs-backdrop"></div>
      <div class="cs-drawer" id="cs-drawer" tabindex="-1">
        <!-- Content will be rendered dynamically -->
      </div>
    `;
    document.body.appendChild(el);
    this.modalEl = el;
    this.drawerEl = el.querySelector('#cs-drawer');
    this.backdropEl = el.querySelector('#cs-backdrop');
  }

  bindGlobalEvents() {
    // Backdrop click
    this.backdropEl.addEventListener('click', () => this.close());

    // ESC key listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Hash change routing for deep links
    window.addEventListener('hashchange', () => {
      this.checkHash();
    });
  }

  checkHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#case-study/')) {
      const id = hash.replace('#case-study/', '');
      const project = FLAGSHIP_PROJECTS.find(p => p.id === id);
      if (project) {
        this.open(project);
      }
    } else if (this.isOpen && !hash.startsWith('#case-study/')) {
      this.close(false);
    }
  }

  open(project) {
    this.activeProject = project;
    this.activeTab = 'architecture';
    this.isOpen = true;
    this.playSound('click');

    // Update URL hash without jumping
    if (window.location.hash !== `#case-study/${project.id}`) {
      history.pushState(null, '', `#case-study/${project.id}`);
    }

    document.body.classList.add('modal-open');
    this.modalEl.setAttribute('aria-hidden', 'false');
    this.modalEl.classList.add('open');

    this.renderContent();
    this.drawerEl.focus();
  }

  close(updateHash = true) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.playSound('click');

    if (updateHash && window.location.hash.startsWith('#case-study/')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }

    this.modalEl.classList.remove('open');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  renderContent() {
    const p = this.activeProject;
    if (!p) return;

    this.drawerEl.innerHTML = `
      <div class="cs-header">
        <div class="cs-header-meta">
          <span class="cs-badge">${p.badge}</span>
          <span class="cs-client font-mono">${p.client} · ${p.role}</span>
        </div>
        <button class="cs-close-btn" id="cs-close" aria-label="Close Case Study">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="cs-title-bar">
        <h2 class="cs-title">${p.title}</h2>
        <p class="cs-subtitle">${p.subtitle}</p>
        <div class="cs-tag-row">
          ${p.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <!-- HIGHLIGHT METRIC HUD -->
      <div class="cs-metric-hud">
        <div class="cs-metric-primary">
          <span class="hud-big-num">${p.highlightMetric}</span>
          <span class="hud-big-label">${p.highlightMetricLabel}</span>
        </div>
        <div class="cs-metric-grid">
          ${p.quickStats.map(stat => `
            <div class="cs-stat-box">
              <span class="cs-stat-v">${stat.value}</span>
              <span class="cs-stat-l">${stat.label}</span>
              <span class="cs-stat-b">${stat.baseline}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB NAVIGATION -->
      <div class="cs-nav-tabs" role="tablist">
        <button class="cs-tab ${this.activeTab === 'architecture' ? 'active' : ''}" data-tab="architecture" role="tab">
          01. Architectural Blueprint
        </button>
        <button class="cs-tab ${this.activeTab === 'tradeoffs' ? 'active' : ''}" data-tab="tradeoffs" role="tab">
          02. Technical Decisions & Trade-Offs
        </button>
        <button class="cs-tab ${this.activeTab === 'failure_modes' ? 'active' : ''}" data-tab="failure_modes" role="tab">
          03. Production Edge Cases & Fixes
        </button>
        <button class="cs-tab ${this.activeTab === 'code' ? 'active' : ''}" data-tab="code" role="tab">
          04. Verified Code Snippet
        </button>
      </div>

      <!-- TAB PANELS -->
      <div class="cs-tab-content">
        ${this.renderActiveTabContent()}
      </div>

      <div class="cs-footer">
        <div class="cs-footer-info">
          ${p.githubUrl ? `
            <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              View Repository on GitHub
            </a>
          ` : `
            <span class="cs-notice font-mono">🔒 Architecture deployed in private enterprise production. Code samples sanitized.</span>
          `}
        </div>
        <button class="btn btn-primary" id="cs-close-bottom">Done Exploring</button>
      </div>
    `;

    // Bind local tab events
    this.drawerEl.querySelectorAll('.cs-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.activeTab = tab;
        this.playSound('switch');
        this.renderContent();
      });
    });

    const closeBtn = this.drawerEl.querySelector('#cs-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const closeBottomBtn = this.drawerEl.querySelector('#cs-close-bottom');
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', () => this.close());

    const copyBtn = this.drawerEl.querySelector('#cs-copy-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const codeText = this.activeProject.architecture.codeSnippet;
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.textContent = '✓ Copied to Clipboard';
          setTimeout(() => { copyBtn.textContent = 'Copy Code'; }, 2000);
          this.playSound('tick');
        });
      });
    }
  }

  renderActiveTabContent() {
    const p = this.activeProject;
    const arch = p.architecture;

    switch (this.activeTab) {
      case 'architecture':
        return `
          <div class="tab-pane">
            <h3 class="pane-title">End-to-End System Blueprint</h3>
            <p class="pane-lead">${p.summary}</p>
            <div class="blueprint-flow">
              ${arch.diagram.map((item, idx) => `
                <div class="flow-card">
                  <div class="flow-step font-mono">${item.step}</div>
                  <div class="flow-body">
                    <div class="flow-head">
                      <h4 class="flow-name">${item.name}</h4>
                      <span class="flow-tech font-mono">${item.tech}</span>
                    </div>
                    <p class="flow-desc">${item.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'tradeoffs':
        return `
          <div class="tab-pane">
            <h3 class="pane-title">Critical Engineering Decisions & Trade-Offs</h3>
            <p class="pane-lead">Every architectural choice involves explicit trade-offs between latency, cloud egress fees, privacy, and system resilience.</p>
            <div class="tradeoffs-list">
              ${arch.tradeoffs.map(item => `
                <div class="tradeoff-card">
                  <h4 class="to-title">${item.title}</h4>
                  <div class="to-row">
                    <span class="to-label">DECISION:</span>
                    <span class="to-val">${item.decision}</span>
                  </div>
                  <div class="to-row">
                    <span class="to-label">RATIONALE:</span>
                    <span class="to-val">${item.reason}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'failure_modes':
        return `
          <div class="tab-pane">
            <h3 class="pane-title">Production Failure Modes & Edge Case Fixes</h3>
            <p class="pane-lead">Real production software differs from toy demos in how it handles crashes, memory degradation, and unpredicted input variance.</p>
            <div class="failures-list">
              ${arch.bottlenecksResolved.map((item, idx) => `
                <div class="failure-card">
                  <span class="f-num font-mono">INCIDENT_0${idx + 1}</span>
                  <p class="f-text">${item}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'code':
        return `
          <div class="tab-pane">
            <div class="code-head">
              <span class="font-mono code-file">production_core_service.py</span>
              <button class="btn btn-sm btn-outline" id="cs-copy-code">Copy Code</button>
            </div>
            <pre class="code-block font-mono"><code>${this.escapeHTML(arch.codeSnippet)}</code></pre>
          </div>
        `;

      default:
        return '';
    }
  }

  escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

