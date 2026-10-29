/**
 * pipeline-sim.js
 * Interactive Neural & Systems Execution Simulator for Haroon Rasheed's Portfolio.
 * Demonstrates real pipeline processing with live state transitions, latency counters,
 * and JSON payload inspection across three real-world architectures.
 */

export const SIMULATION_PRESETS = [
  {
    id: "logiscan",
    name: "01. HaeirLens OCR Pipeline",
    badge: "Enterprise OCR · OpenVINO",
    benchmark: "304s → 15-20s (0.26s / region)",
    description: "HaeirLens multi-page industrial delivery note extraction for major appliance manufacturer.",
    payloadSummary: "Delivery_Note_Scan_78912.pdf (3 pages, 300 DPI, skewed carbon copy)",
    stages: [
      {
        id: "ingest",
        name: "Ingest & De-Skew",
        tech: "OpenCV + PyMuPDF",
        latency: "120ms",
        status: "idle",
        detail: "Streaming PDF rasterization, Otsu binarization, Hough line transform deskewing (corrected -3.4° tilt).",
        jsonSnippet: {
          file_name: "Delivery_Note_Scan_78912.pdf",
          file_size_bytes: 4892110,
          detected_skew_angle: -3.42,
          resolution_dpi: 300,
          color_space: "grayscale_normalized"
        }
      },
      {
        id: "segment",
        name: "Region Proposal",
        tech: "Morphological Contours",
        latency: "85ms",
        status: "idle",
        detail: "Segments tabular grid lines, vendor header block, and gate pass authorization stamps into 14 distinct bounding boxes.",
        jsonSnippet: {
          regions_detected: 14,
          table_bounding_boxes: [
            { x: 42, y: 180, w: 910, h: 540, type: "line_items_table" },
            { x: 42, y: 740, w: 420, h: 120, type: "tax_summary" }
          ],
          confidence_contour: 0.982
        }
      },
      {
        id: "infer",
        name: "OpenVINO HPI Inference",
        tech: "PaddleOCR + INT8 HPI",
        latency: "264ms",
        status: "idle",
        detail: "Asynchronous parallel inference on CPU with OpenVINO High Performance Inference engine. Processing 14 regions at ~0.26s each.",
        jsonSnippet: {
          engine: "OpenVINO_2025_HPI",
          precision: "INT8_QUANTIZED",
          throughput_mode: "BATCH_ASYNCHRONOUS",
          avg_region_latency_sec: 0.264,
          extracted_text_confidence: 0.984
        }
      },
      {
        id: "validate",
        name: "Pydantic Schema Guard",
        tech: "Pydantic v2 + Regex",
        latency: "18ms",
        status: "idle",
        detail: "Levenshtein distance matching against appliance SKU inventory. Tax calculation sanity checks pass with zero discrepancies.",
        jsonSnippet: {
          sku_matches: 8,
          fuzzy_corrected_codes: ["WM-INV-8001", "AC-COMP-410A"],
          arithmetic_validation: "PASSED_100_PERCENT",
          validation_error_count: 0
        }
      },
      {
        id: "dispatch",
        name: "ERP Sync & Notification",
        tech: "FastAPI + Webhook",
        latency: "42ms",
        status: "idle",
        detail: "Transactional database write and dispatch to warehouse management ERP. Warehouse supervisor alerted via Telegram webhook.",
        jsonSnippet: {
          erp_target: "SAP_Business_One",
          transaction_id: "TX-2026-98104",
          total_line_items_created: 8,
          processing_status: "SUCCESS_DISPATCHED",
          total_pipeline_time: "529ms"
        }
      }
    ]
  },
  {
    id: "m365_exec",
    name: "02. M365 AI Executive Assistant",
    badge: "Meeting Intelligence · Local RAG",
    benchmark: "100% On-Prem · <120ms RAG",
    description: "Executive Teams meeting transcription, diarization, and pgvector semantic briefing.",
    payloadSummary: "Teams_Executive_Sync_Oct29.m4a (48 mins, multi-speaker boardroom call)",
    stages: [
      {
        id: "m365_hook",
        name: "Graph Webhook Trigger",
        tech: "Microsoft Graph API",
        latency: "65ms",
        status: "idle",
        detail: "Graph webhook captures Teams recording availability, acquires secure OAuth 2.0 token, and streams audio to internal VPS.",
        jsonSnippet: {
          event_type: "onlineMeeting.recordingAvailable",
          organizer: "Managing Director",
          participants_count: 7,
          audio_stream_url: "internal://m365/recordings/meeting_8891.m4a"
        }
      },
      {
        id: "transcribe",
        name: "Local Whisper Diarization",
        tech: "Faster-Whisper (INT8)",
        latency: "1.2s",
        status: "idle",
        detail: "Transcribes audio locally without cloud data transfer; extracts speaker timestamps and speaker turns with 97.4% word accuracy.",
        jsonSnippet: {
          model: "faster-whisper-medium-int8",
          device: "CUDA_OR_CPU_AVX512",
          speakers_identified: ["Speaker_1 (Director)", "Speaker_2 (CFO)", "Speaker_3 (Ops)"],
          total_words: 6140
        }
      },
      {
        id: "vector_index",
        name: "pgvector HNSW Embedding",
        tech: "FastEmbed + PostgreSQL",
        latency: "115ms",
        status: "idle",
        detail: "Recursive text chunking into 512-token segments with 64-token overlap, embedded with cosine distance HNSW index.",
        jsonSnippet: {
          vector_store: "PostgreSQL_pgvector",
          index_type: "HNSW_m16_efConstruction64",
          chunks_generated: 18,
          search_latency_ms: 18.4
        }
      },
      {
        id: "llm_briefing",
        name: "Action Item Synthesis",
        tech: "LangChain + LLM",
        latency: "410ms",
        status: "idle",
        detail: "Extracts key decisions, deadlines, financial commitments, and unresolved blockers into executive bullet brief.",
        jsonSnippet: {
          key_decisions: 4,
          action_items_assigned: [
            { owner: "Lead AI Engineer", task: "Deploy OpenVINO HPI container by Friday", deadline: "2026-10-31" },
            { owner: "CFO", task: "Approve QBO Stripe reconciliation run", deadline: "2026-11-02" }
          ]
        }
      },
      {
        id: "notify_exec",
        name: "Daily Digest Dispatch",
        tech: "Internal Dashboard + Email",
        latency: "35ms",
        status: "idle",
        detail: "Executive morning briefing synthesized and published to private on-premise dashboard with 1-click calendar sync.",
        jsonSnippet: {
          digest_status: "PUBLISHED_SECURE",
          encryption: "AES-256_ON_PREMISE",
          delivery_channel: "REST_DASHBOARD_AND_INBOX"
        }
      }
    ]
  },
  {
    id: "n8n_qbo",
    name: "03. n8n Enterprise Bookkeeping Suite",
    badge: "Financial Automation · Human-in-the-Loop",
    benchmark: "40% Workload Cut · 94.2% Auto-Match",
    description: "Autonomous financial transaction categorization with GAAP confidence gating for US accounting firm.",
    payloadSummary: "Batch_NBKC_BankFeed_2026_10.json (45 pending raw bank transaction lines)",
    stages: [
      {
        id: "feed_ingest",
        name: "Multi-Bank Ingestion",
        tech: "n8n Webhook / SFTP",
        latency: "45ms",
        status: "idle",
        detail: "Normalizes raw statements across NBKC Bank, Elan Credit, and Stripe into standardized transaction JSON records.",
        jsonSnippet: {
          batch_size: 45,
          source: "NBKC_Bank_Feed_Production",
          currency: "USD",
          raw_sample: "POS DEBIT - AWS CLOUD SERVICES SEATTLE WA 10/28"
        }
      },
      {
        id: "idempotency",
        name: "SHA-256 Deduplication",
        tech: "Custom JavaScript Node",
        latency: "12ms",
        status: "idle",
        detail: "Computes deterministic hash from transaction date + amount + sanitized vendor string. Prevents double-posting during retries.",
        jsonSnippet: {
          hash_algorithm: "SHA-256",
          idempotency_key: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          duplicate_detected: false
        }
      },
      {
        id: "llm_categorize",
        name: "GAAP LLM Classification",
        tech: "OpenAI API (JSON Schema)",
        latency: "380ms",
        status: "idle",
        detail: "Analyzes ambiguous vendor descriptions against the firm's standard Chart of Accounts with strict JSON schema compliance.",
        jsonSnippet: {
          suggested_account: "6300 · Software & Cloud Subscriptions",
          tax_code: "TAX_EXEMPT_OPERATIONAL",
          confidence_score: 0.965,
          threshold_required: 0.90
        }
      },
      {
        id: "gate_check",
        name: "Confidence Gate (0.90)",
        tech: "Conditional Router",
        latency: "5ms",
        status: "idle",
        detail: "Confidence is 0.965 (>= 0.90 threshold). Qualified for autonomous direct ledger posting without manual operator intervention.",
        jsonSnippet: {
          gate_result: "AUTO_APPROVE",
          routing_destination: "POST_DIRECT_TO_QBO",
          human_review_flag: false
        }
      },
      {
        id: "qbo_sync",
        name: "QuickBooks Ledger Post",
        tech: "QuickBooks Online REST v3",
        latency: "140ms",
        status: "idle",
        detail: "Transaction ledger entry posted atomically into QuickBooks Online with vendor ID correlation and audit reference.",
        jsonSnippet: {
          qbo_journal_entry_id: "JE-904128",
          sync_timestamp: "2026-10-29T12:54:10Z",
          status: "RECONCILED_SUCCESS"
        }
      }
    ]
  }
];

export class PipelineSimulator {
  constructor(containerElement, onNodeSelect, playSound) {
    this.container = containerElement;
    this.onNodeSelect = onNodeSelect || (() => {});
    this.playSound = playSound || (() => {});
    this.activePresetIndex = 0;
    this.activeNodeIndex = 0;
    this.isRunning = false;
    this.animationTimer = null;
    this.presets = SIMULATION_PRESETS;

    this.render();
  }

  getCurrentPreset() {
    return this.presets[this.activePresetIndex];
  }

  selectPreset(index) {
    if (this.isRunning) this.stop();
    this.activePresetIndex = index;
    this.activeNodeIndex = 0;
    const preset = this.getCurrentPreset();
    preset.stages.forEach(s => s.status = "idle");
    this.render();
    this.playSound("switch");
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.activeNodeIndex = 0;
    const preset = this.getCurrentPreset();
    preset.stages.forEach(s => s.status = "idle");
    this.updateUI();
    this.playSound("execute");

    const runNextStage = () => {
      if (!this.isRunning) return;
      if (this.activeNodeIndex < preset.stages.length) {
        // Mark current running
        preset.stages[this.activeNodeIndex].status = "running";
        this.updateUI();
        this.playSound("tick");

        const delay = parseInt(preset.stages[this.activeNodeIndex].latency) || 350;
        const normalizedDelay = Math.min(Math.max(delay * 1.5, 400), 1200);

        this.animationTimer = setTimeout(() => {
          if (!this.isRunning) return;
          preset.stages[this.activeNodeIndex].status = "completed";
          this.activeNodeIndex++;
          this.updateUI();
          if (this.activeNodeIndex < preset.stages.length) {
            runNextStage();
          } else {
            this.isRunning = false;
            this.playSound("success");
            this.updateUI();
          }
        }, normalizedDelay);
      }
    };

    runNextStage();
  }

  stop() {
    this.isRunning = false;
    if (this.animationTimer) clearTimeout(this.animationTimer);
    this.updateUI();
  }

  selectNode(index) {
    this.activeNodeIndex = index;
    this.updateUI();
    this.playSound("click");
    const node = this.getCurrentPreset().stages[index];
    this.onNodeSelect(node);
  }

  render() {
    const preset = this.getCurrentPreset();
    const activeStage = preset.stages[Math.min(this.activeNodeIndex, preset.stages.length - 1)];

    this.container.innerHTML = `
      <div class="sim-wrapper">
        <!-- SIMULATOR CONTROLS HEADER -->
        <div class="sim-header">
          <div class="sim-preset-tabs" role="tablist">
            ${this.presets.map((p, idx) => `
              <button 
                class="sim-tab ${idx === this.activePresetIndex ? 'active' : ''}" 
                data-preset="${idx}"
                role="tab"
                aria-selected="${idx === this.activePresetIndex}">
                <span class="tab-badge">${p.badge.split('·')[0].trim()}</span>
                <span class="tab-title">${p.name.split('. ')[1] || p.name}</span>
              </button>
            `).join('')}
          </div>
          <div class="sim-action-bar">
            <button class="sim-btn run-btn ${this.isRunning ? 'running' : ''}" id="sim-run-trigger">
              <span class="btn-icon">${this.isRunning ? '⏹' : '▶'}</span>
              <span class="btn-text">${this.isRunning ? 'Halt Execution' : 'Execute Live Pipeline'}</span>
            </button>
          </div>
        </div>

        <!-- TELEMETRY HUD STRIP -->
        <div class="sim-telemetry-hud">
          <div class="hud-item">
            <span class="hud-label">TARGET ARCHITECTURE</span>
            <span class="hud-value highlight">${preset.badge}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">VERIFIED BENCHMARK</span>
            <span class="hud-value green-text">${preset.benchmark}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">INPUT PAYLOAD</span>
            <span class="hud-value font-mono payload-title" title="${preset.payloadSummary}">${preset.payloadSummary}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">PIPELINE STATE</span>
            <span class="hud-value ${this.isRunning ? 'pulse-orange' : 'text-emerald'}">
              ${this.isRunning ? '⚡ EXECUTING PARALLEL STAGES' : (this.activeNodeIndex >= preset.stages.length ? '✔ EXECUTION COMPLETE (200 OK)' : 'READY FOR INGESTION')}
            </span>
          </div>
        </div>

        <!-- INTERACTIVE PIPELINE NODES TRACK -->
        <div class="sim-pipeline-track" id="sim-track">
          <div class="pipeline-progress-rail">
            <div class="pipeline-progress-fill" style="width: ${((this.activeNodeIndex) / preset.stages.length) * 100}%"></div>
          </div>
          <div class="sim-nodes-row">
            ${preset.stages.map((stage, idx) => {
              const isSelected = idx === Math.min(this.activeNodeIndex, preset.stages.length - 1);
              const statusClass = stage.status;
              return `
                <div 
                  class="sim-node ${isSelected ? 'selected' : ''} ${statusClass}" 
                  data-node-index="${idx}"
                  tabindex="0"
                  role="button"
                  aria-label="Stage ${idx + 1}: ${stage.name}">
                  <div class="node-indicator">
                    <span class="node-num">0${idx + 1}</span>
                    <span class="node-status-glow"></span>
                  </div>
                  <div class="node-content">
                    <span class="node-name">${stage.name}</span>
                    <span class="node-tech">${stage.tech}</span>
                    <span class="node-latency">⏱ ${stage.latency}</span>
                  </div>
                  ${idx < preset.stages.length - 1 ? '<div class="node-connector"><span></span></div>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- STAGE INSPECTION TERMINAL / PAYLOAD VIEWER -->
        <div class="sim-inspection-terminal">
          <div class="terminal-header">
            <div class="term-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="term-title font-mono">
              STAGE_INSPECTOR · [0${Math.min(this.activeNodeIndex + 1, preset.stages.length)}] ${activeStage.name.toUpperCase()} (${activeStage.tech})
            </div>
            <div class="term-status-pill font-mono ${activeStage.status}">
              STATUS: ${activeStage.status.toUpperCase()}
            </div>
          </div>
          <div class="terminal-body">
            <div class="terminal-left">
              <div class="term-section-label">ENGINEERING LOGIC & OPERATION</div>
              <p class="term-desc">${activeStage.detail}</p>
              <div class="term-metrics-box">
                <div class="metric-pill">
                  <span class="m-k">LATENCY</span>
                  <span class="m-v">${activeStage.latency}</span>
                </div>
                <div class="metric-pill">
                  <span class="m-k">CONCURRENCY</span>
                  <span class="m-v">Asynchronous Non-Blocking</span>
                </div>
                <div class="metric-pill">
                  <span class="m-k">ALLOCATION</span>
                  <span class="m-v">Zero Memory Leaks</span>
                </div>
              </div>
            </div>
            <div class="terminal-right">
              <div class="term-section-label font-mono">STAGE PAYLOAD OUTPUT (INSPECTABLE JSON)</div>
              <pre class="json-viewer font-mono"><code>${JSON.stringify(activeStage.jsonSnippet, null, 2)}</code></pre>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Preset Tabs
    this.container.querySelectorAll('.sim-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-preset'), 10);
        this.selectPreset(idx);
      });
    });

    // Run Button
    const runBtn = this.container.querySelector('#sim-run-trigger');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        if (this.isRunning) {
          this.stop();
        } else {
          this.start();
        }
      });
    }

    // Node Selection
    this.container.querySelectorAll('.sim-node').forEach(nodeEl => {
      nodeEl.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-node-index'), 10);
        this.selectNode(idx);
      });
      nodeEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(e.currentTarget.getAttribute('data-node-index'), 10);
          this.selectNode(idx);
        }
      });
    });
  }

  updateUI() {
    this.render();
  }
}

