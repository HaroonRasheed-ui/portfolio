/**
 * projects-data.js
 * Source of truth for Haroon Rasheed's portfolio projects, benchmarks, and architectures.
 * Based on verified resume and GitHub repositories (github.com/HaroonRasheed-ui).
 */

export const FLAGSHIP_PROJECTS = [
  {
    id: "logiscan-idp",
    title: "HaeirLens",
    subtitle: "Enterprise Document Intelligence & Accelerated OCR Pipeline",
    category: "Computer Vision & Audio AI",
    client: "Major Appliance Manufacturer",
    role: "Lead AI Engineer",
    period: "2025 - Present",
    status: "Production",
    badge: "Enterprise Production",
    highlightMetric: "15s - 20s",
    highlightMetricLabel: "End-to-End Processing (down from 304s)",
    summary: "High-throughput document intelligence engine extracting structured tabular records from multi-page delivery notes, invoices, and gate passes in 15 to 20 seconds with ~0.26s regional inference.",
    tags: ["FastAPI", "PaddleOCR", "OpenVINO", "OpenCV", "Python", "Docker", "Linux"],
    githubUrl: null,
    liveDemo: null,
    confidential: true,
    quickStats: [
      { label: "End-to-End Time", value: "15-20s", baseline: "was 304s" },
      { label: "Regional Inference", value: "~0.26s", baseline: "OpenVINO HPI" },
      { label: "Extraction Accuracy", value: "98.4%", baseline: "Multi-page tables" },
      { label: "Throughput", value: "10k+ docs/wk", baseline: "Automated" }
    ],
    architecture: {
      diagram: [
        { step: "01", name: "Multi-Page PDF Ingestion", tech: "FastAPI + PyMuPDF", desc: "Streaming payload validation, automated de-skewing, DPI standardization to 300 DPI." },
        { step: "02", name: "Adaptive Region Detection", tech: "OpenCV Bounding Pipeline", desc: "Contour analysis and morphological transforms segmenting tables, headers, and barcode zones." },
        { step: "03", name: "Accelerated Inference", tech: "PaddleOCR + OpenVINO HPI", desc: "Compiled INT8/FP16 models executed on CPU hardware with asynchronous inference queue (~0.26s/region)." },
        { step: "04", name: "Deterministic Schema Validation", tech: "Pydantic v2 + Regex Post-Process", desc: "Levenshtein distance correction on known item codes and fuzzy tax calculation verification." },
        { step: "05", name: "ERP Database Synchronizer", tech: "PostgreSQL + Webhook Dispatcher", desc: "Transactional upsert into company ERP with instant notification to warehouse operations." }
      ],
      tradeoffs: [
        {
          title: "Cloud Vision API vs. On-Premise OpenVINO HPI",
          decision: "Chose OpenVINO-compiled PaddleOCR running on internal hardware rather than cloud vision endpoints (AWS Textract / Google Cloud Vision).",
          reason: "Zero variable API costs, strict data privacy compliance for internal manufacturing documents, and guaranteed predictable latency under 300ms per region."
        },
        {
          title: "Tesseract vs. PaddleOCR",
          decision: "Replaced legacy Tesseract with PP-OCRv4 detection and recognition modules.",
          reason: "Tesseract struggled with degraded carbon-copy delivery notes, low-contrast dot-matrix prints, and rotated tables. PaddleOCR delivered a 28% higher character accuracy on noisy industrial scans."
        }
      ],
      bottlenecksResolved: [
        "Memory leaks during high-concurrency PDF rasterization fixed by implementing process-isolated worker pools with IPC limits.",
        "OpenVINO pipeline warmed up via pre-allocated inference requests, eliminating the initial 1.8s cold-start spike on production batches."
      ],
      codeSnippet: `# Production OpenVINO inference runner excerpt
from openvino.runtime import Core
import numpy as np

class AcceleratedOCRRunner:
    def __init__(self, model_xml: str):
        self.core = Core()
        # Compile model with High Performance Inference (HPI) throughput mode
        self.model = self.core.read_model(model_xml)
        self.compiled_model = self.core.compile_model(
            self.model, 
            device_name="CPU", 
            config={"PERFORMANCE_HINT": "THROUGHPUT"}
        )
        self.infer_queue = self.compiled_model.create_infer_request()

    def infer_region(self, tensor_img: np.ndarray) -> np.ndarray:
        # Region inference latency: ~0.26s average
        results = self.infer_queue.infer({0: tensor_img})
        return next(iter(results.values()))`
    }
  },
  {
    id: "ai-exec-assistant",
    title: "AI Executive Assistant",
    subtitle: "Enterprise Microsoft 365 Copilot & Executive Intelligence",
    category: "LLM & Conversational AI",
    client: "Apex Innovation Technology",
    role: "Sole AI Architect & Backend Developer",
    period: "2025 - Present",
    status: "Internal Product",
    badge: "Proprietary Product",
    highlightMetric: "100% On-Prem",
    highlightMetricLabel: "Zero External Data Leakage Architecture",
    summary: "Multi-user executive assistant deeply wired into Microsoft 365. Automates inbox prioritization, generates daily executive task briefings, and transcribes Teams recordings with local Whisper & pgvector RAG.",
    tags: ["FastAPI", "PostgreSQL", "pgvector", "Whisper Local", "Microsoft Graph API", "LangChain"],
    githubUrl: null,
    liveDemo: null,
    confidential: true,
    quickStats: [
      { label: "Deployment", value: "On-Premises", baseline: "Zero data egress" },
      { label: "Transcription", value: "Local Whisper", baseline: "GPU/CPU optimized" },
      { label: "Search Latency", value: "<120ms", baseline: "pgvector HNSW index" },
      { label: "Time Saved", value: "12 hrs/wk", baseline: "Per executive" }
    ],
    architecture: {
      diagram: [
        { step: "01", name: "M365 Event Hook", tech: "Microsoft Graph Webhooks", desc: "Real-time subscriptions for new priority emails, calendar changes, and recorded Teams meetings." },
        { step: "02", name: "Local Whisper Transcription", tech: "Faster-Whisper (INT8)", desc: "Transcribes multi-speaker hour-long audio files locally, outputting speaker-diarized text transcripts." },
        { step: "03", name: "Semantic Embedding & Indexing", tech: "FastEmbed + PostgreSQL pgvector", desc: "Hierarchical chunking into semantic sections indexed via HNSW cosine similarity." },
        { step: "04", name: "Executive Briefing Synthesis", tech: "LangChain + Local/Private LLM", desc: "Extracts action items, deadlines, key decisions, and categorizes priority action tags." },
        { step: "05", name: "Daily Morning Briefing Delivery", tech: "Email & Internal Web Dashboard", desc: "Delivered at 07:30 AM daily with direct 1-click review and task acknowledgment." }
      ],
      tradeoffs: [
        {
          title: "Public Cloud LLM vs Private pgvector Pipeline",
          decision: "Constructed the vector store entirely within internal PostgreSQL using the official pgvector extension rather than managed vector SaaS.",
          reason: "Strict company governance prohibits executive email transcripts and financial discussions from residing in multi-tenant third-party vector databases."
        }
      ],
      bottlenecksResolved: [
        "Chunking long 90-minute boardroom transcripts without losing context: implemented sliding window summarization with persistent entity graph tracking.",
        "Prevented webhook loss during Microsoft Graph sync bursts using a Redis-backed reliable retry queue with exponential backoff."
      ],
      codeSnippet: `# Semantic search over meeting transcripts with pgvector
from sqlalchemy import text
from typing import List, Dict

async def retrieve_meeting_context(query_embedding: List[float], user_id: str, top_k: int = 5):
    sql = text("""
        SELECT chunk_id, meeting_id, content, speaker, timestamp_start,
               1 - (embedding <=> :query_vec::vector) AS similarity
        FROM meeting_transcript_chunks
        WHERE authorized_user_id = :uid
        ORDER BY embedding <=> :query_vec::vector
        LIMIT :k;
    """)
    async with db_session() as session:
        result = await session.execute(sql, {
            "query_vec": str(query_embedding),
            "uid": user_id,
            "k": top_k
        })
        return [dict(row) for row in result]`
    }
  },
  {
    id: "n8n-bookkeeping",
    title: "n8n Enterprise Bookkeeping Automation Suite",
    subtitle: "End-to-End Autonomous Financial Reconciliation Engine",
    category: "Workflow Automation",
    client: "US Accounting & Tax Firm",
    role: "Senior Automation Engineer",
    period: "2025 - 2026",
    status: "Production",
    badge: "5 Live Production Workflows",
    highlightMetric: "40% Workload Cut",
    highlightMetricLabel: "Manual Data-Processing Time Eliminated",
    summary: "Suite of five production-grade n8n workflows connecting QuickBooks Online (QBO), NBKC Bank, Elan Financial, Stripe, and SV Consulting with LLM categorization and human-in-the-loop exception routing.",
    tags: ["n8n", "OpenAI API", "QuickBooks Online", "Webhooks", "PostgreSQL", "Python", "Docker", "Linux"],
    githubUrl: null,
    liveDemo: null,
    confidential: true,
    quickStats: [
      { label: "Live Workflows", value: "5 Production", baseline: "Continuous execution" },
      { label: "Manual Effort Cut", value: "40%", baseline: "Measured across staff" },
      { label: "Auto-Match Rate", value: "94.2%", baseline: "Transactions resolved" },
      { label: "Exception Routing", value: "Zero Failures", baseline: "Human-in-the-loop fallback" }
    ],
    architecture: {
      diagram: [
        { step: "01", name: "Multi-Source Feed Ingestion", tech: "Bank Feeds & QBO Webhooks", desc: "Ingests raw transaction lines from NBKC, Elan Credit, Stripe, and invoice PDFs." },
        { step: "02", name: "Deterministic Rule Filtering", tech: "Custom JS / Python Nodes", desc: "Immediate exact matching against vendor databases, recurring payroll, and established ledger IDs." },
        { step: "03", name: "Context-Aware LLM Categorization", tech: "OpenAI API (JSON Schema mode)", desc: "Classifies ambiguous vendor memos into GAAP-compliant chart-of-accounts with confidence scores." },
        { step: "04", name: "Confidence Gate & Fallback", tech: "Conditional Branching Logic", desc: "Transactions with confidence < 0.90 are automatically forwarded to an interactive Slack/Email review queue." },
        { step: "05", name: "QuickBooks Online Ledger Sync", tech: "QBO REST API v3", desc: "Atomic batch posting with duplicate transaction idempotency keys." }
      ],
      tradeoffs: [
        {
          title: "Full Autonomous Posting vs. Human-in-the-Loop Thresholding",
          decision: "Enforced a rigid 90% confidence threshold gating automatic posting to production books.",
          reason: "In corporate accounting, hallucinating a single tax account category causes severe year-end audit penalties. Safe delegation with human verification for outliers was strictly superior."
        }
      ],
      bottlenecksResolved: [
        "Eliminated duplicate transaction posting during bank API retry cycles by computing a deterministic SHA-256 hash of date + amount + sanitized vendor string as an idempotency key.",
        "Built automatic OAuth 2.0 token refresher ensuring n8n never drops scheduled nighttime reconciliation jobs."
      ],
      codeSnippet: `// n8n Idempotency & Clean Payload Node (Excerpt)
const crypto = require('crypto');

return items.map(item => {
  const json = item.json;
  const rawString = [
    json.transaction_date,
    parseFloat(json.amount).toFixed(2),
    (json.description || '').trim().toLowerCase()
  ].join('|');

  const idempotencyKey = crypto.createHash('sha256').update(rawString).digest('hex');
  
  return {
    json: {
      ...json,
      idempotency_key: idempotencyKey,
      requires_human_review: json.llm_confidence < 0.90
    }
  };
});`
    }
  },
  {
    id: "ai-smart-glasses",
    title: "AI Smart Glasses for Visually Impaired People",
    subtitle: "Real-Time Embedded Edge Vision, Obstacle Detection & Bilingual Audio",
    category: "Computer Vision & Audio AI",
    client: "Final Year Research Project with M. Muneeb Khan",
    role: "Lead Computer Vision & Embedded AI Developer",
    period: "2024 - 2025",
    status: "Completed / Open Source",
    badge: "Academic Research & Hardware",
    highlightMetric: "28 FPS Edge",
    highlightMetricLabel: "Real-Time Detection on Embedded Hardware",
    summary: "Wearable assistive device combining lightweight YOLOv8 computer vision, OCR text reading, GPS geofencing, and real-time dual-language (Urdu and English) voice feedback for visually impaired navigation.",
    tags: ["YOLOv8", "OpenCV", "Python", "OCR", "GPS Module", "Edge AI", "TTS"],
    githubUrl: "https://github.com/HaroonRasheed-ui/AI-Smart-Glasses-Visually-Impaired-People",
    liveDemo: null,
    confidential: false,
    quickStats: [
      { label: "Inference Speed", value: "28 FPS", baseline: "Optimized YOLOv8 nano" },
      { label: "Detection Range", value: "0.5m - 5.0m", baseline: "Obstacle warning zone" },
      { label: "Supported Languages", value: "Urdu & English", baseline: "Instant voice synthesized" },
      { label: "Hardware Target", value: "Edge SBC + Camera", baseline: "Wearable form factor" }
    ],
    architecture: {
      diagram: [
        { step: "01", name: "High-Speed Video Capture", tech: "Wide-Angle Camera Sensor", desc: "Captures 640x480 video feed optimized for low-latency visual analysis." },
        { step: "02", name: "Edge Obstacle Detection", tech: "YOLOv8n TensorRT / NCNN", desc: "Detects pedestrians, stairs, vehicles, doorways, and low-hanging hazards in real time." },
        { step: "03", name: "Spatial Distance Estimation", tech: "OpenCV Monocular Depth Estimation", desc: "Computes bounding box proportions and relative ground-plane angles to determine urgency." },
        { step: "04", name: "Scene Text Reading", tech: "Tesseract OCR / Edge Text Detector", desc: "Reads shop signs, street names, bus numbers, and currency notes on user trigger." },
        { step: "05", name: "Bilingual Spatial TTS", tech: "eSpeak-NG / Pyttsx3 Urdu Engine", desc: "Generates clear, concise audio cues: 'Obstacle 2 meters ahead' / 'سامنے رکاوٹ ہے'." }
      ],
      tradeoffs: [
        {
          title: "Complex Depth Sensors vs Monocular Edge Neural Network",
          decision: "Chose lightweight camera with optimized YOLOv8 nano over expensive LiDAR or stereo depth rigs.",
          reason: "Drastically reduced battery draw, weight on the user's face, and device cost, enabling deployment in developing countries."
        }
      ],
      bottlenecksResolved: [
        "Audio feedback saturation: designed an intelligent audio throttling priority queue so emergency close-proximity alerts preempt generic text reading.",
        "Overheating and battery drain resolved by dynamically modulating frame rates from 30 FPS down to 10 FPS when user is stationary."
      ],
      codeSnippet: `# Real-time audio priority queue & obstacle evaluation
def evaluate_detections(detections, frame_width):
    critical_alerts = []
    for det in detections:
        cls_name, conf, bbox, distance = det
        if distance < 1.2:  # Danger threshold (< 1.2 meters)
            pos_x = (bbox[0] + bbox[2]) / 2
            direction = "Urdu: سامنے" if abs(pos_x - frame_width/2) < 80 else ("بائیں" if pos_x < frame_width/2 else "دائیں")
            critical_alerts.append(f"خطرہ! {cls_name} {distance:.1f} میٹر {direction}")
    return critical_alerts`
    }
  },
  {
    id: "bilingual-po-extractor",
    title: "Bilingual Purchase Order Extractor",
    subtitle: "Fault-Tolerant Arabic & English Document Understanding",
    category: "Computer Vision & Audio AI",
    client: "Middle East Industrial Client",
    role: "AI Pipeline Engineer",
    period: "2025",
    status: "Production",
    badge: "3-Tier Resilient Architecture",
    highlightMetric: "99.2% Uptime",
    highlightMetricLabel: "Zero-Downtime Multi-Model Fallback Hierarchy",
    summary: "Production document processor capable of parsing complex mixed-language (Arabic and English) purchase orders using an automated three-tier fallback architecture: Gemini Vision → Groq RapidOCR → Offline Formatter.",
    tags: ["Gemini 2.0 Vision", "Groq Llama 3", "RapidOCR", "FastAPI", "Python", "Regex Engine"],
    githubUrl: null,
    liveDemo: null,
    confidential: true,
    quickStats: [
      { label: "Fallback Tiers", value: "3 Dynamic Layers", baseline: "Self-healing" },
      { label: "Arabic Accuracy", value: "96.8%", baseline: "Right-to-left layout" },
      { label: "P95 Cost Per Doc", value: "$0.003", baseline: "Cost-optimized" },
      { label: "Supported Formats", value: "PDF, TIFF, JPEG", baseline: "Multi-resolution" }
    ],
    architecture: {
      diagram: [
        { step: "Tier 1", name: "Primary Vision Ingestion", tech: "Google Gemini 2.0 Flash Vision", desc: "Parses complex multi-column bilingual layouts directly with structured JSON schema output." },
        { step: "Tier 2", name: "High-Speed Fallback", tech: "RapidOCR + Groq Llama-3-70B", desc: "Triggered if Tier 1 times out or hits quota. Local OCR extracted text sent to ultra-fast Groq Llama 3." },
        { step: "Tier 3", name: "Offline Resilient Parser", tech: "PaddleOCR + Heuristic Regex Engine", desc: "Air-gapped emergency parser guaranteeing structured JSON generation even during complete cloud outages." }
      ],
      tradeoffs: [
        {
          title: "Single Model Dependency vs 3-Tier Fallback Mesh",
          decision: "Engineered three independent parsing layers with automatic fallback trigger triggers.",
          reason: "Purchasing departments cannot halt supply chains due to external API outages or rate limits. The 3-tier architecture ensured zero operational downtime."
        }
      ],
      bottlenecksResolved: [
        "Arabic Right-to-Left (RTL) character reversal in bounding boxes solved via bidirectional Unicode normalization before tokenization.",
        "Handled varying date formats (Hijri vs Gregorian) automatically through custom ISO-8601 normalization routines."
      ],
      codeSnippet: `# Resilient Multi-Tier Ingestion Strategy
async def parse_purchase_order(image_bytes: bytes) -> PurchaseOrderSchema:
    try:
        # Tier 1: Gemini 2.0 Flash Vision
        return await gemini_vision_parse(image_bytes, timeout=4.5)
    except (APITimeoutError, RateLimitError) as e:
        logger.warning(f"Tier 1 failed: {e}. Cascading to Tier 2 (Groq + RapidOCR)...")
        try:
            # Tier 2: Groq high-speed token inference over local OCR
            ocr_text = run_rapid_ocr(image_bytes)
            return await groq_extract_schema(ocr_text, timeout=3.0)
        except Exception as e2:
            logger.error(f"Tier 2 failed: {e2}. Falling back to Tier 3 Local Heuristics...")
            # Tier 3: Guaranteed offline heuristic regex extraction
            return offline_heuristic_extractor(image_bytes)`
    }
  },
  {
    id: "leadintel-ai",
    title: "LeadIntel.AI: B2B Lead Enrichment",
    subtitle: "Autonomous Enterprise Software & ERP Footprint Discovery",
    category: "Workflow Automation",
    client: "B2B SaaS Growth Client",
    role: "Full-Stack AI Developer",
    period: "2025",
    status: "Live Client System",
    badge: "Full-Stack AI System",
    highlightMetric: "12x Faster",
    highlightMetricLabel: "Lead Qualification Acceleration",
    summary: "Automated reconnaissance platform that analyzes corporate LinkedIn footprints, careers pages, and public web infrastructure to detect target ERP systems (SAP, NetSuite, Oracle) and enrich sales pipelines.",
    tags: ["FastAPI", "React", "TypeScript", "Gemini API", "Claude Haiku", "Tailwind CSS"],
    githubUrl: "https://github.com/HaroonRasheed-ui/b2b-lead-enrichment-frontend",
    liveDemo: null,
    confidential: false,
    quickStats: [
      { label: "Detection Accuracy", value: "93.5%", baseline: "ERP & CRM stack" },
      { label: "Enrichment Speed", value: "<4.2s", baseline: "Per domain" },
      { label: "Frontend", value: "React + TS", baseline: "Live streaming UI" },
      { label: "Dual LLM Mesh", value: "Gemini + Claude", baseline: "Automatic fallback" }
    ],
    architecture: {
      diagram: [
        { step: "01", name: "Domain Crawling & Job Scraping", tech: "Async HTTPX + BeautifulSoup", desc: "Scrapes career listings, job descriptions, tech headers, and DNS records for enterprise clues." },
        { step: "02", name: "AI Footprint Inference", tech: "Gemini 2.0 Flash (Claude Haiku Fallback)", desc: "Extracts ERP software mentions (e.g., 'Requires 3+ years SAP Business One') and tech maturity score." },
        { step: "03", name: "Executive Contact Synthesis", tech: "FastAPI Pipeline", desc: "Correlates decision makers (CTO, VP of IT, Operations Director) to tech stack findings." },
        { step: "04", name: "Live Dashboard Presentation", tech: "React + TypeScript + Tailwind", desc: "Displays enriched company cards with confidence meters, direct CSV export, and CRM push." }
      ],
      tradeoffs: [
        {
          title: "Brute-force Headless Browser vs Smart Async HTML Parsing",
          decision: "Employed lightweight async HTML & API probing over heavy Puppeteer/Playwright instances.",
          reason: "Lowered server memory usage by 85% and increased concurrent domain processing capacity from 4 domains to 40 domains simultaneously."
        }
      ],
      bottlenecksResolved: [
        "Rate-limiting from public endpoints solved by implementing token-bucket throttling and intelligent IP rotation.",
        "Real-time UI streaming achieved using Server-Sent Events (SSE) so users see partial enrichments instantly."
      ],
      codeSnippet: `// React Streaming Hook for Lead Enrichment
export const useLeadEnrichment = (domain: string) => {
  const [data, setData] = useState<CompanyEnrichment | null>(null);
  const [stage, setStage] = useState<string>('idle');

  const startEnrichment = useCallback(() => {
    const sse = new EventSource(\`/api/v1/enrich?domain=\${encodeURIComponent(domain)}\`);
    sse.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.stage) setStage(payload.stage);
      if (payload.result) {
        setData(payload.result);
        sse.close();
      }
    };
  }, [domain]);

  return { data, stage, startEnrichment };
};`
    }
  },
  {
    id: "pulsepoint-attendance",
    title: "PulsePoint: Anti-Spoofing Attendance API",
    subtitle: "Zero-Trust Geofencing & Fraud-Resistant Verification Engine",
    category: "Workflow Automation",
    client: "Workforce Management Client",
    role: "Backend Security & API Engineer",
    period: "2024 - 2025",
    status: "Production API",
    badge: "Security & Fraud Detection",
    highlightMetric: "99.8% Catch Rate",
    highlightMetricLabel: "Mock GPS & Proxy Spoofing Detection",
    summary: "High-security geofenced check-in API that detects fraudulent mobile check-ins by cross-referencing mock GPS flags, VPN/proxy IP ranges, and physical Wi-Fi BSSID beacon fingerprints.",
    tags: ["FastAPI", "Python", "PostgreSQL", "Geofencing", "Network Security", "JWT"],
    githubUrl: null,
    liveDemo: null,
    confidential: true,
    quickStats: [
      { label: "Spoof Catch Rate", value: "99.8%", baseline: "Mock GPS & VPNs" },
      { label: "Check-in Latency", value: "<85ms", baseline: "P99 API response" },
      { label: "Validation Layers", value: "4 Distinct Checks", baseline: "Multi-factor location" },
      { label: "Daily Transactions", value: "15,000+", baseline: "Employee check-ins" }
    ],
    architecture: {
      diagram: [
        { step: "01", name: "Telemetry Ingestion", tech: "FastAPI REST Endpoint", desc: "Receives encrypted client payload containing coordinates, altitude, Wi-Fi BSSIDs, and system flags." },
        { step: "02", name: "Mock Location Probing", tech: "Mobile OS Flag Verification", desc: "Inspects Android Developer Options mock provider states and iOS simulated location flags." },
        { step: "03", name: "Network Security Audit", tech: "MaxMind GeoIP + ASN Proxy Check", desc: "Cross-checks egress IP against residential proxy and VPN threat databases." },
        { step: "04", name: "Physical Wi-Fi Triangulation", tech: "BSSID Database Matching", desc: "Validates that detected Wi-Fi hardware MAC addresses match verified physical access points on-site." },
        { step: "05", name: "Cryptographic Attendance Signature", tech: "HMAC-SHA256 Token", desc: "Issues immutable time-stamped punch-in record stored in audited PostgreSQL database." }
      ],
      tradeoffs: [
        {
          title: "Pure GPS vs Wi-Fi BSSID Multi-Factor Verification",
          decision: "Refused to trust raw GPS coordinates alone; required local Wi-Fi router BSSID broadcast presence.",
          reason: "GPS can be trivially spoofed on rooted or developer-mode phones. Physical Wi-Fi radio beacon signatures cannot be spoofed without being physically present."
        }
      ],
      bottlenecksResolved: [
        "Eliminated false positives for employees inside dense concrete buildings with weak GPS satellite locks via automatic Wi-Fi beacon fallback."
      ],
      codeSnippet: `# Multi-Factor Geofence Verification Engine
def verify_attendance_payload(payload: CheckInRequest, site: GeofenceSite) -> VerificationResult:
    # 1. Anti-Mocking OS Check
    if payload.is_mock_location or payload.device_rooted:
        return VerificationResult(valid=False, reason="FRAUD_MOCK_LOCATION_DETECTED")

    # 2. Network Proxy/VPN Check
    if is_datacenter_or_vpn_ip(payload.client_ip):
        return VerificationResult(valid=False, reason="FRAUD_VPN_DETECTED")

    # 3. Wi-Fi Physical BSSID Validation
    matching_bssids = set(payload.detected_bssids).intersection(site.authorized_bssids)
    if not matching_bssids:
        return VerificationResult(valid=False, reason="BSSID_LOCATION_MISMATCH")

    # 4. Haversine Spatial Geofence (< 50 meters radius)
    dist_meters = haversine(payload.latitude, payload.longitude, site.latitude, site.longitude)
    if dist_meters > site.radius_meters:
        return VerificationResult(valid=False, reason="OUTSIDE_PERIMETER")

    return VerificationResult(valid=True, confidence=1.0)`
    }
  },
  {
    id: "sap-telegram-approvals",
    title: "SAP Telegram Approvals",
    subtitle: "Instant Mobile Executive Document Authorization",
    category: "Workflow Automation",
    client: "Enterprise ERP Client",
    role: "Backend & Integration Developer",
    period: "2025",
    status: "Production Service",
    badge: "Enterprise ERP Integration",
    highlightMetric: "4min vs 48hrs",
    highlightMetricLabel: "Approval Cycle Turnaround Time",
    summary: "Production bot service integrating SAP Business One with Telegram Bot API, pushing purchase orders and invoices to executives with secure inline cryptographic approve/reject callbacks.",
    tags: ["FastAPI", "SAP Business One", "Telegram Bot API", "Python", "SQL", "Webhooks"],
    githubUrl: null,
    liveDemo: null,
    confidential: true,
    quickStats: [
      { label: "Approval Latency", value: "4 minutes", baseline: "Down from 48 hours" },
      { label: "Security", value: "HMAC Tokens", baseline: "Zero spoofing" },
      { label: "SAP Sync", value: "Real-time Two-Way", baseline: "Instant ledger update" },
      { label: "Reliability", value: "100%", baseline: "Zero dropped decisions" }
    ],
    architecture: {
      diagram: [
        { step: "01", name: "SAP Trigger", tech: "SAP B1 Service Layer / Webhook", desc: "Detects new Purchase Order created requiring senior management authorization." },
        { step: "02", name: "Executive Dispatch", tech: "FastAPI + Telegram Bot API", desc: "Formats line items, vendor history, and total amount into a crisp Markdown Telegram card." },
        { step: "03", name: "Inline Decision Buttons", tech: "InlineKeyboardMarkup", desc: "Provides one-tap [✅ Approve] / [❌ Reject] buttons with single-use cryptographically signed tokens." },
        { step: "04", name: "ERP Database Update", tech: "SAP B1 DI-API / REST", desc: "Immediately updates document status in SAP, adds auditor timestamp, and notifies purchasing agent." }
      ],
      tradeoffs: [
        {
          title: "Custom Native Mobile App vs Telegram Bot API",
          decision: "Chose Telegram bot interface over building a dedicated native mobile iOS/Android app.",
          reason: "Zero install friction for executives, instant push notifications, 100% reliability worldwide without app store review cycles."
        }
      ],
      bottlenecksResolved: [
        "Prevented double-clicks and race conditions via Redis distributed locks on the document ID during callback processing."
      ],
      codeSnippet: `# Secure Callback Handler for Telegram Inline Approvals
@router.post("/telegram-callback")
async def handle_approval_callback(update: TelegramUpdate):
    callback_data = update.callback_query.data # e.g. "APPROVE:PO-98231:hash_sig"
    action, doc_id, signature = callback_data.split(":")
    
    # Verify HMAC signature against executive secret
    if not verify_hmac(f"{action}:{doc_id}", signature, SECRET_KEY):
        return {"status": "unauthorized"}

    async with redis_lock(f"lock:sap:{doc_id}"):
        sap_result = await sap_service_layer.update_status(
            document_id=doc_id, 
            status="Approved" if action == "APPROVE" else "Rejected",
            approver=update.callback_query.from_user.username
        )
        await notify_telegram_success(update.callback_query.id, f"Document #{doc_id} {action}D")
        return {"status": "success"}`
    }
  }
];

export const ALL_PROJECTS = [
  ...FLAGSHIP_PROJECTS,
  {
    id: "intent-aware-support",
    title: "Intent Aware AI Support Chatbot",
    subtitle: "Zero-Token Intent Classifier with LangChain Handoff",
    category: "LLM & Conversational AI",
    tags: ["n8n", "LangChain", "OpenAI", "Webhooks"],
    summary: "Production customer service pipeline using lightweight regex/keyword gating to classify user intent without spending LLM tokens, handing off complex inquiries to a GPT-4.1 mini agent.",
    githubUrl: "https://github.com/HaroonRasheed-ui/n8n-intent-aware-ai-support-chatbot",
    status: "Open Source"
  },
  {
    id: "voice-to-email-agent",
    title: "AI Voice-to-Email Agent (Drive & Sheets Editions)",
    subtitle: "Autonomous Voice Transcription & Document Workflow",
    category: "LLM & Conversational AI",
    tags: ["n8n", "Gemini 2.0 Flash", "Google Drive", "Gmail API"],
    summary: "Voice-driven automated administrative agent using Gemini 2.0 Flash for audio transcription, dynamic Google Drive attachments search, and automated Gmail drafting and dispatch.",
    githubUrl: "https://github.com/HaroonRasheed-ui/ai-voice-email-agent",
    status: "Open Source"
  },
  {
    id: "self-learning-faq",
    title: "Self Learning FAQ Chatbot",
    subtitle: "Autonomous Vector Embedding Generation on Unanswered Queries",
    category: "LLM & Conversational AI",
    tags: ["n8n", "pgvector", "PostgreSQL", "Semantic Search"],
    summary: "Self-evolving customer FAQ bot using pgvector similarity search. Whenever a user question lacks a strong semantic match, it alerts administrators, captures the verified answer, and embeds it automatically.",
    githubUrl: "https://github.com/HaroonRasheed-ui/n8n-FAQs-Chatbot",
    status: "Open Source"
  },
  {
    id: "hybrid-real-estate",
    title: "Hybrid Real Estate Assistant",
    subtitle: "High-Throughput Lead Qualification & Property Recommendation",
    category: "LLM & Conversational AI",
    tags: ["n8n", "Groq", "Llama 3", "Webhooks"],
    summary: "Automated real estate property matching agent running on Groq Llama 3 for near-zero latency customer interaction, qualifying buyer budgets and booking property tours.",
    githubUrl: "https://github.com/HaroonRasheed-ui/n8n-Property-Assistant-Hybrid",
    status: "Open Source"
  },
  {
    id: "neurasense-emotion",
    title: "NeuraSense: Speech Emotion Recognition",
    subtitle: "Multi-Head Attention CNN + Bidirectional LSTM Deep Learning",
    category: "Computer Vision & Audio AI",
    tags: ["PyTorch", "TensorFlow", "CNN", "BiLSTM", "Attention"],
    summary: "Deep learning speech emotion classifier processing raw audio spectrograms through 2D CNN layers, Bidirectional LSTM recurrent units, and Multi-Head Attention mechanisms to detect 8 emotional states.",
    githubUrl: "https://github.com/HaroonRasheed-ui/NeuraSense-Speech-Emotion-Recognition-System",
    status: "Research / Open Source"
  },
  {
    id: "hammar-virtual-assistant",
    title: "Hammar AI Virtual Assistant",
    subtitle: "Multimodal Desktop Assistant with Knowledge Graph Queries",
    category: "LLM & Conversational AI",
    tags: ["Python", "Tkinter", "WolframAlpha", "SpeechRecognition"],
    summary: "Modular desktop agent supporting voice and text querying, synthesizing answers across Wikipedia, DuckDuckGo, and WolframAlpha computational intelligence engines.",
    githubUrl: "https://github.com/HaroonRasheed-ui/hammar-ai-virtual-assistant",
    status: "Open Source"
  },
  {
    id: "hand-gesture-recognition",
    title: "Real-Time Hand Gesture Recognition",
    subtitle: "Computer Vision Gesture Control via Convexity Defects",
    category: "Computer Vision & Audio AI",
    tags: ["OpenCV", "Python", "NumPy"],
    summary: "Zero-latency gesture recognition pipeline tracking hand contours and calculating convexity defect geometry for hands-free computer control.",
    githubUrl: "https://github.com/HaroonRasheed-ui/hand-gesture-recognition",
    status: "Open Source"
  },
  {
    id: "numberplate-detection",
    title: "Automated License Plate Recognition (ALPR)",
    subtitle: "Morphological Image Processing & OCR Pipeline",
    category: "Computer Vision & Audio AI",
    tags: ["OpenCV", "Tesseract", "Python"],
    summary: "Vehicle license plate detection and character segmentation pipeline utilizing Top-Hat transforms, Sobel gradients, and OCR character extraction.",
    githubUrl: "https://github.com/HaroonRasheed-ui/numberplate-detection",
    status: "Open Source"
  },
  {
    id: "fuzzy-door-control",
    title: "Fuzzy Logic Autonomous Door Control",
    subtitle: "Rule-Based Dynamic Actuator Controller",
    category: "Classical AI Agents",
    tags: ["Python", "scikit-fuzzy", "Control Systems"],
    summary: "Mathematical fuzzy inference system modeling human proximity, walking velocity, and door actuator velocity curves for smooth energy-efficient automated ingress.",
    githubUrl: "https://github.com/HaroonRasheed-ui/fuzzy-door-control",
    status: "Open Source"
  },
  {
    id: "reflex-door-agent",
    title: "Reflex-Based Autonomous Door Agent",
    subtitle: "State Machine Intelligence for Building Automation",
    category: "Classical AI Agents",
    tags: ["Python", "AI Agents", "State Machines"],
    summary: "Deterministic reflex agent with temporal condition-action rules and obstacle safety fail-safes.",
    githubUrl: "https://github.com/HaroonRasheed-ui/reflex-door-agent",
    status: "Open Source"
  },
  {
    id: "vacuum-cleaner-simulator",
    title: "Autonomous Vacuum Cleaner Agent Simulator",
    subtitle: "Environment Exploration & Pathfinding Visualization",
    category: "Classical AI Agents",
    tags: ["Python", "Tkinter", "Pathfinding"],
    summary: "Interactive simulation engine comparing simple reflex, model-based reflex, and goal-driven agent architectures navigating dynamic grid rooms.",
    githubUrl: "https://github.com/HaroonRasheed-ui/vacuum-cleaner-simulator",
    status: "Open Source"
  },
  {
    id: "health-condition-predictor",
    title: "Health Condition Predictor",
    subtitle: "Supervised Clinical Diagnostic Classification",
    category: "Applied ML & Data Science",
    tags: ["Scikit-Learn", "Pandas", "Random Forest"],
    summary: "Predictive medical diagnostic model trained on tabular patient biomarker datasets, implementing feature importance ranking and hyperparameter tuning.",
    githubUrl: "https://github.com/HaroonRasheed-ui/health-condition-predictor",
    status: "Open Source"
  },
  {
    id: "product-classification",
    title: "Multi-Modal Product Classifier",
    subtitle: "Joint Embedding of Product Titles, Categorical Specs & Price",
    category: "Applied ML & Data Science",
    tags: ["Keras", "TensorFlow", "NLP"],
    summary: "Deep learning classifier combining text token embeddings with normalized numerical price features to classify e-commerce catalogs across 50+ taxonomy classes.",
    githubUrl: "https://github.com/HaroonRasheed-ui/product-classification",
    status: "Open Source"
  },
  {
    id: "forest-fire-prediction",
    title: "Forest Fire Risk Predictor",
    subtitle: "Meteorological Feature Regression Modeling",
    category: "Applied ML & Data Science",
    tags: ["Scikit-Learn", "Regression", "Python"],
    summary: "Environmental regression model analyzing temperature, humidity, wind velocity, and drought indexes to predict wildfire area spread.",
    githubUrl: "https://github.com/HaroonRasheed-ui/Forest-Fire-Predection",
    status: "Open Source"
  },
  {
    id: "fake-news-detection",
    title: "NLP Fake News Detector",
    subtitle: "Linguistic Stylometry & Passive-Aggressive Classifier",
    category: "Applied ML & Data Science",
    tags: ["NLP", "TF-IDF", "Scikit-Learn"],
    summary: "Linguistic text analysis system extracting n-gram TF-IDF vectors to detect disinformation in journalism datasets with 92% cross-validated accuracy.",
    githubUrl: "https://github.com/HaroonRasheed-ui/Fake_News_detection",
    status: "Open Source"
  },
  {
    id: "sentiment-analysis-cli",
    title: "Command-Line Sentiment Analysis Tool",
    subtitle: "Zero-Shot Inference CLI using Transformers",
    category: "Applied ML & Data Science",
    tags: ["HuggingFace", "PyTorch", "CLI"],
    summary: "Lightweight command-line utility for streaming log analysis and customer review polarity scoring with quantized transformer weights.",
    githubUrl: "https://github.com/HaroonRasheed-ui/sentiment-analysis",
    status: "Open Source"
  }
];

export const TECH_EVIDENCE_MAP = [
  {
    category: "AI & LLM Orchestration",
    skills: [
      { name: "LangChain", level: "Production", evidence: "M365 Exec Assistant, Intent-Aware Chatbot", impact: "Orchestrated complex RAG retrieval with conversational memory." },
      { name: "FastAPI", level: "Production", evidence: "HaeirLens IDP, PulsePoint, LeadIntel.AI, SAP Bot", impact: "High-throughput async REST endpoints with Pydantic v2 validation." },
      { name: "OpenAI API", level: "Production", evidence: "n8n QBO Automation Suite, M365 Assistant", impact: "Structured JSON schema output, function calling, zero hallucination guardrails." },
      { name: "RAG & Vector Search", level: "Production", evidence: "pgvector on M365 Copilot, Self-Learning FAQ", impact: "Sub-120ms semantic search with HNSW indexing and metadata filtering." },
      { name: "LangGraph", level: "Applied", evidence: "Multi-agent research pipelines & branching logic", impact: "Cyclic state graphs with human-in-the-loop validation checkpoints." },
      { name: "Gemini 2.0 Flash", level: "Production", evidence: "Bilingual PO Extractor, Voice-to-Email Agent", impact: "Multi-modal vision and low-latency audio transcription." }
    ]
  },
  {
    category: "Document Intelligence & Computer Vision",
    skills: [
      { name: "PaddleOCR", level: "Production", evidence: "HaeirLens for major appliance manufacturer", impact: "Multi-language character recognition in noisy industrial documents." },
      { name: "OpenVINO (Intel)", level: "Production", evidence: "HaeirLens HPI deployment, 304s → 15-20s", impact: "Hardware-accelerated INT8/FP16 CPU inference (~0.26s/region)." },
      { name: "OpenCV", level: "Production", evidence: "AI Smart Glasses, Numberplate ALPR", impact: "Adaptive thresholding, contour extraction, geometric perspective rectification." },
      { name: "YOLOv8", level: "Production", evidence: "AI Smart Glasses for Visually Impaired", impact: "28 FPS real-time edge obstacle detection on wearable sensors." }
    ]
  },
  {
    category: "Workflow Automation & Enterprise Systems",
    skills: [
      { name: "n8n", level: "Production", evidence: "5 live production workflows for US accounting firm", impact: "Cut 40% manual data processing across accounts payable & reconciliation." },
      { name: "QuickBooks Online (QBO)", level: "Production", evidence: "Automated Bookkeeping Suite", impact: "REST API integration, batch transaction posting, token self-healing." },
      { name: "SAP Business One", level: "Production", evidence: "SAP Telegram Approvals, .NET/Angular integrations", impact: "DI-API / Service Layer real-time document approval automation." },
      { 
        name: "Docker & Linux", 
        level: "Production", 
        evidence: "n8n Production Instance, HaeirLens IDP", 
        impact: "Our enterprise n8n automation suite and HaeirLens IDP services are containerized on Docker running on production Linux servers (Ubuntu VPS).",
        searchKey: "Docker"
      }
    ]
  }
];

export const WORK_EXPERIENCE = [
  {
    company: "Apex Innovation Technology",
    role: "Junior AI Engineer",
    location: "Lahore, Punjab, Pakistan",
    period: "Aug 2025 - Present",
    tag: "Current Role",
    bullets: [
      "Promoted to Junior AI Engineer (leading a small AI team, planning technical scope, conducting code reviews, and mentoring interns before code goes to production).",
      "Architected and deployed HaeirLens, a production document intelligence pipeline (FastAPI + PaddleOCR + OpenVINO) for a major appliance manufacturer; cut end-to-end processing from 304s to 15-20s with ~0.26s inference per region.",
      "Engineered five live production n8n workflows for a US accounting firm, automating transaction categorization with an LLM, statement reconciliation, and human-in-the-loop exception routing, cutting manual effort by 40%.",
      "Sole architect of the company's internal AI Executive Assistant on Microsoft 365, featuring local Whisper transcription for Teams calls, daily task briefings, and on-premise pgvector semantic search.",
      "Engineered SAP Business One integrations with .NET, Angular, and FastAPI for real-time mobile Telegram bot approvals."
    ]
  },
  {
    company: "Giga Developers",
    role: "Python Developer (Internship)",
    location: "Harīpur, Khyber Pakhtunkhwa, Pakistan",
    period: "Jul 2024 - Oct 2024",
    tag: "Backend Engineering",
    bullets: [
      "Built and maintained Python-based backend services with Flask and FastAPI for client-facing web applications, handling JWT authentication, schema validation, and CRUD operations.",
      "Automated repetitive data-ingestion workflows with Python scripts, eliminating ~6 hours of manual processing per week (40% time reduction).",
      "Enhanced application response performance by profiling slow endpoints and optimizing SQL queries."
    ]
  },
  {
    company: "EcodeCamp (Pvt.) Ltd",
    role: "Artificial Intelligence Intern",
    location: "Lahore, Punjab, Pakistan",
    period: "Aug 2024 - Sep 2024",
    tag: "Applied AI",
    bullets: [
      "Optimized model performance through hyperparameter tuning and architecture adjustments, delivering a 25% improvement in accuracy across three applied AI projects (Shopping Assistant, Health Tracker, Grocery Organizer)."
    ]
  },
  {
    company: "CodXo",
    role: "Data Science Intern",
    location: "India (Remote)",
    period: "Aug 2024 - Sep 2024",
    tag: "Predictive Analytics",
    bullets: [
      "Built and validated machine learning forecasting models achieving 85% accuracy; performed extensive EDA and feature engineering using Pandas, NumPy, and Scikit-learn."
    ]
  },
  {
    company: "Beats by Dre",
    role: "Consumer Insights Business Analytics",
    location: "California, United States (Remote Project)",
    period: "Aug 2024 - Sep 2024",
    tag: "NLP Research",
    bullets: [
      "Conducted sentiment analysis on large-scale customer feedback using NLP techniques; performed SWOT analysis and competitive landscape research to support strategic positioning."
    ]
  }
];

export const EDUCATION_RESEARCH = {
  degree: "Bachelor of Science in Artificial Intelligence",
  institution: "The University of Haripur",
  location: "Haripur, Khyber Pakhtunkhwa, Pakistan",
  period: "2021 - 2025",
  fellowship: {
    title: "Internet Society Pre-Fellowship Training",
    track: "Online Trust & Safety Track",
    status: "Completed October 2026",
    details: "Specialized coursework on Internet governance, encryption standards, and digital trust. Applying for 2027 Internet Society Fellowship."
  },
  conference: {
    title: "Conference Paper Under Review (2026)",
    venue: "ICAAD (International Conference on AI Across Disciplines), Selcuk University",
    status: "Under Peer Review",
    topic: "Applied Computer Vision & Assistive AI Systems"
  }
};

