/**
 * cmdk.js
 * High-speed Command Palette (Ctrl+K / Cmd+K) for instant navigation,
 * project lookup, resume retrieval, and interaction mode switching.
 */

export class CommandPalette {
  constructor(options = {}) {
    this.playSound = options.playSound || (() => {});
    this.onSelectCaseStudy = options.onSelectCaseStudy || (() => {});
    this.onToggleMode = options.onToggleMode || (() => {});
    this.onToggleAudio = options.onToggleAudio || (() => {});
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredItems = [];

    this.commands = [
      // Quick Nav
      { id: 'nav-hero', category: 'Navigation', title: 'Home · Executive Overview', action: () => this.jumpTo('#hero') },
      { id: 'nav-sim', category: 'Systems Simulator', title: 'Interactive Neural & Systems Simulator', action: () => this.jumpTo('#simulator') },
      { id: 'nav-flagship', category: 'Projects', title: 'Featured Enterprise Case Studies', action: () => this.jumpTo('#flagship') },
      { id: 'nav-all', category: 'Projects', title: 'Complete 24+ Project & GitHub Archive', action: () => this.jumpTo('#all-projects') },
      { id: 'nav-skills', category: 'Credibility', title: 'Technical Stack with Verified Evidence', action: () => this.jumpTo('#stack-matrix') },
      { id: 'nav-experience', category: 'Career', title: 'Work Experience & Production Impact', action: () => this.jumpTo('#experience') },
      { id: 'nav-contact', category: 'Contact', title: 'Direct Contact & Inquiries', action: () => this.jumpTo('#contact') },

      // Deep Case Studies
      { id: 'cs-logiscan', category: 'Case Studies', title: 'HaeirLens (304s → 15-20s OCR Pipeline)', action: () => this.onSelectCaseStudy('logiscan-idp') },
      { id: 'cs-m365', category: 'Case Studies', title: 'AI Executive Assistant (M365 On-Prem pgvector)', action: () => this.onSelectCaseStudy('ai-exec-assistant') },
      { id: 'cs-n8n', category: 'Case Studies', title: 'n8n Bookkeeping Automation Suite (40% Cut)', action: () => this.onSelectCaseStudy('n8n-bookkeeping') },
      { id: 'cs-glasses', category: 'Case Studies', title: 'AI Smart Glasses for Visually Impaired (YOLOv8 Edge)', action: () => this.onSelectCaseStudy('ai-smart-glasses') },
      { id: 'cs-po', category: 'Case Studies', title: 'Bilingual Purchase Order Extractor (3-Tier Fallback)', action: () => this.onSelectCaseStudy('bilingual-po-extractor') },
      { id: 'cs-leadintel', category: 'Case Studies', title: 'LeadIntel.AI (B2B ERP Footprint Intelligence)', action: () => this.onSelectCaseStudy('leadintel-ai') },
      { id: 'cs-pulsepoint', category: 'Case Studies', title: 'PulsePoint (Anti-Spoofing Attendance API)', action: () => this.onSelectCaseStudy('pulsepoint-attendance') },
      { id: 'cs-sap', category: 'Case Studies', title: 'SAP Telegram Approvals (ERP Bot Integration)', action: () => this.onSelectCaseStudy('sap-telegram-approvals') },

      // Actions
      { id: 'act-resume', category: 'Action', title: 'Download Verified Resume (PDF)', action: () => this.downloadResume() },
      { id: 'act-email', category: 'Action', title: 'Copy Email (haroon5253rasheed@gmail.com)', action: () => this.copyEmail() },
      { id: 'act-mode', category: 'Action', title: 'Toggle Recruiter Fast Mode / Deep Engineer Mode', action: () => this.onToggleMode() },
      { id: 'act-audio', category: 'Action', title: 'Toggle Tactical Audio Clicks (Web Audio API)', action: () => this.onToggleAudio() },
      { id: 'act-github', category: 'External', title: 'Open GitHub Profile (HaroonRasheed-ui)', action: () => window.open('https://github.com/HaroonRasheed-ui', '_blank') },
      { id: 'act-linkedin', category: 'External', title: 'Open LinkedIn Profile', action: () => window.open('https://www.linkedin.com/in/haroon-rasheed-383768375', '_blank') }
    ];

    this.createDOM();
    this.bindEvents();
  }

  createDOM() {
    const el = document.createElement('div');
    el.id = 'cmdk-palette';
    el.className = 'cmdk-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="cmdk-backdrop" id="cmdk-backdrop"></div>
      <div class="cmdk-window">
        <div class="cmdk-search-box">
          <svg class="cmdk-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            class="cmdk-input font-mono" 
            id="cmdk-input" 
            placeholder="Type a command, technology, or project..." 
            autocomplete="off" 
            spellcheck="false" />
          <kbd class="cmdk-esc-kbd">ESC</kbd>
        </div>
        <div class="cmdk-results" id="cmdk-results" role="listbox">
          <!-- Rendered dynamically -->
        </div>
        <div class="cmdk-footer font-mono">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    this.paletteEl = el;
    this.inputEl = el.querySelector('#cmdk-input');
    this.resultsEl = el.querySelector('#cmdk-results');
    this.backdropEl = el.querySelector('#cmdk-backdrop');
  }

  bindEvents() {
    // Keyboard shortcut to open Cmd+K or Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      } else if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveSelection(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveSelection(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelected();
        }
      }
    });

    this.backdropEl.addEventListener('click', () => this.close());

    this.inputEl.addEventListener('input', () => {
      this.filter(this.inputEl.value);
    });
  }

  open() {
    this.isOpen = true;
    this.playSound('click');
    this.paletteEl.classList.add('open');
    this.paletteEl.setAttribute('aria-hidden', 'false');
    this.inputEl.value = '';
    this.filter('');
    setTimeout(() => this.inputEl.focus(), 50);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.paletteEl.classList.remove('open');
    this.paletteEl.setAttribute('aria-hidden', 'true');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  filter(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filteredItems = [...this.commands];
    } else {
      this.filteredItems = this.commands.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      );
    }
    this.selectedIndex = 0;
    this.renderResults();
  }

  moveSelection(delta) {
    if (this.filteredItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex + delta + this.filteredItems.length) % this.filteredItems.length;
    this.playSound('tick');
    this.renderResults();
    this.scrollSelectedIntoView();
  }

  scrollSelectedIntoView() {
    const activeEl = this.resultsEl.querySelector('.cmdk-item.selected');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }

  executeSelected() {
    if (this.filteredItems.length === 0) return;
    const item = this.filteredItems[this.selectedIndex];
    if (item && item.action) {
      this.close();
      this.playSound('execute');
      item.action();
    }
  }

  renderResults() {
    if (this.filteredItems.length === 0) {
      this.resultsEl.innerHTML = `
        <div class="cmdk-empty font-mono">
          No matching commands or projects found for "${this.inputEl.value}".
        </div>
      `;
      return;
    }

    // Group items by category
    const groups = {};
    this.filteredItems.forEach((item, idx) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push({ item, originalIndex: idx });
    });

    let html = '';
    for (const [category, groupItems] of Object.entries(groups)) {
      html += `<div class="cmdk-group-title font-mono">${category.toUpperCase()}</div>`;
      groupItems.forEach(({ item, originalIndex }) => {
        const isSelected = originalIndex === this.selectedIndex;
        html += `
          <div 
            class="cmdk-item ${isSelected ? 'selected' : ''}" 
            data-index="${originalIndex}"
            role="option"
            aria-selected="${isSelected}">
            <span class="cmdk-item-title">${item.title}</span>
            <span class="cmdk-item-cat font-mono">${item.category}</span>
          </div>
        `;
      });
    }

    this.resultsEl.innerHTML = html;

    // Click handler for items
    this.resultsEl.querySelectorAll('.cmdk-item').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        this.selectedIndex = idx;
        this.executeSelected();
      });
    });
  }

  jumpTo(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/Haroon_Rasheed_Resume.pdf';
    link.download = 'Haroon_Rasheed_Resume.pdf';
    link.target = '_blank';
    link.click();
  }

  copyEmail() {
    navigator.clipboard.writeText('haroon5253rasheed@gmail.com').then(() => {
      alert('✓ Haroon\'s email (haroon5253rasheed@gmail.com) copied to clipboard!');
    });
  }
}

