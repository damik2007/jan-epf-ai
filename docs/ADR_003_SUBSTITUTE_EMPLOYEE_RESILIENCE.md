# ADR-003: Substitute Employee Fault-Tolerant Resilience Matrix

## Metadata
- **Status**: ACCEPTED / IN PRODUCTION
- **Document ID**: ADR-003
- **Deciders**: Damik Reddy (Principal Systems Architect & Lead FDE), Multi-Agent Engineering Squad (Agents 1–6)
- **Date**: 2026-08-22
- **Technical Domain**: High-Availability Systems, Fault Tolerance, SRE & Chaos Engineering, Circuit Breakers
- **Target Platform**: Jan-EPF AI (Rebuilding India's Provident Fund Platform for 70 Million Citizens)

---

## 1. Context and Problem Statement

National Digital Public Infrastructure (DPI) platforms cannot afford single points of failure (SPOF). When an emergency medical withdrawal or pension claim cannot be submitted because an upstream third-party API or downstream database node is experiencing high load or a network hiccup, real human lives and livelihoods are directly impacted.

### The Legacy Failure Cascade
In conventional monolithic architectures, subsystems are tightly coupled. If the passbook database slows down, database connection pools exhaust, the API gateway times out, and the entire citizen portal crashes with opaque HTTP 500 error screens:

```
+---------------------------------------------------------------------------------------------------+
|                           THE MONOLITHIC CASCADING FAILURE ANTI-PATTERN                           |
+---------------------------------------------------------------------------------------------------+
|  Passbook DB Latency Spike (10s)                                                                  |
|       |                                                                                           |
|       v                                                                                           |
|  [Connection Pool Exhausted] ---> [API Gateway Blocks] ---> [Entire Web Portal Returns HTTP 500]  |
|                                                                    |                              |
|  "A worker dying in a hospital cannot submit an emergency claim because the passbook timed out."  |
+---------------------------------------------------------------------------------------------------+
```

### Key Vulnerabilities Addressed
1. **Third-Party Cloud AI Outages**: External AI APIs (e.g. speech transcription or vision models) periodically experience rate limits (HTTP 429), regional outages, or latency degradation.
2. **Network Flakiness in Rural India**: Intermittent 3G/4G connectivity drops connections mid-submission.
3. **Database Maintenance & Connection Limits**: PostgreSQL connection spikes during salary disbursement dates must not take down the platform.

---

## 2. Decision Outcome: The "Substitute Employee" Metaphor

In high-performing operational teams, no mission-critical function halts because an individual employee is absent or sick—a cross-trained backup (the "Substitute Employee") immediately steps in with zero disruption.

In Jan-EPF AI, we apply this organizational principle to software engineering: **Every single critical subsystem MUST have an automatic, active-standby, hot-substitute fallback that engages seamlessly upon degradation, error, or timeout.**

```
+===================================================================================================+
|                     THE JAN-EPF AI COMPONENT HOT-SUBSTITUTE RESILIENCE MATRIX                     |
+===================================================================================================+
|                                                                                                   |
|  [ 1. VOICE INGEST ]          Primary: OpenAI Whisper Cloud API                                   |
|                               Fallback: Browser Web Speech API + 1-Tap Quick Action Tiles         |
|                                                                                                   |
|  [ 2. CHEQUE OCR ]            Primary: OpenAI GPT-4o Vision API                                   |
|                               Fallback: Client Canvas OCR + Active Pre-Verified KYC Match         |
|                                                                                                   |
|  [ 3. PASSBOOK DATA ]         Primary: Live PostgreSQL Master Database                           |
|                               Fallback: Redis Edge Cache ---> Local Client IndexedDB Snapshot     |
|                                                                                                   |
|  [ 4. CLAIM SUBMISSION ]      Primary: Async Redis / Celery Task Queue Worker                     |
|                               Fallback: Service Worker Offline Queue ---> Auto-Sync on Reconnect  |
|                                                                                                   |
|  [ 5. FUZZY NAME MATCH ]      Primary: Python FastAPI Backend Service                             |
|                               Fallback: Client-Side Levenshtein WASM/JS Engine                    |
|                                                                                                   |
|  [ 6. APPLICATION CACHING ]   Primary: Redis Distributed In-Memory Cluster                        |
|                               Fallback: Local Process LRU Memory Cache via Circuit Breaker        |
|                                                                                                   |
+===================================================================================================+
```

---

## 3. Comprehensive Component Substitution Matrix

| Subsystem | Primary Engine | Failure Trigger | Automatic Hot Substitute (The "Backup") | User Experience Impact |
|---|---|---|---|---|
| **Voice Ingest** | OpenAI Whisper API | Cloud Timeout ($>3\text{s}$) or HTTP 429/500 | Browser Web Speech API + 1-Tap Quick Action Tiles | Voice converted instantly using local browser speech engine or touch tiles; 0s lag. |
| **Cheque OCR** | GPT-4o Vision API | API 500, Rate Limit, or Network Disconnect | Client HTML5 Canvas Pre-Filter + Pre-filled Active KYC Verification | Citizen presented with pre-verified bank details with 1-click confirmation. |
| **Passbook Analytics** | Live PostgreSQL DB | Connection Pool Full or DB Slowdown ($>2\text{s}$) | Redis Edge Cache $\rightarrow$ Client IndexedDB Snapshot | Immediate display of last cached balance with a clear *"Synced 2 hours ago"* indicator. |
| **Claim Submission** | Async Redis Queue Worker | Server Unreachable or Network Blackout | Service Worker Offline Queue (Background Sync API) | Claim saved locally, assigned an offline tracking token, and auto-dispatched on reconnect. |
| **Name Reconciliation**| Python Backend API | Gateway 504 / Network Drop | Client-Side Levenshtein WASM/JS Engine | Instantaneous match feedback calculated directly on device in $<2\text{ ms}$. |
| **Cache Storage** | Redis Pod Cluster | Redis Pod Crash / Connection Timeout | In-Memory LRU Process Cache with Circuit Breaker | Zero downtime; requests served from fallback memory cache while Redis restarts. |

---

## 4. Blast Radius Isolation & Fault Domain Boundaries

To guarantee that localized failures never propagate into global system crashes, Jan-EPF AI enforces strict **Blast Radius Isolation**:

```
+---------------------------------------------------------------------------------------------------+
|                                     BLAST RADIUS ISOLATION MAP                                    |
+------------------------------------+--------------------------------+-----------------------------+
|  DOMAIN A: Life-Critical Claims    |  DOMAIN B: Analytics & History |  DOMAIN C: AI Companions    |
|  - Medical Advance (Form 31)       |  - Visual Passbook Visualizer  |  - Whisper Voice Assistant  |
|  - Hospital Escrow Fast-Track      |  - EPS-95 Pension Forecaster   |  - Conversational Advisor   |
|  - Bank Settlement Pipeline        |  - Historical Contribution ECR |  - Chatbot Grievance Triage |
+------------------------------------+--------------------------------+-----------------------------+
|  ISOLATION GUARANTEE: Outage in Domain B or C CANNOT degrade or block Domain A.                   |
+---------------------------------------------------------------------------------------------------+
```

### Concrete Architectural Safeguards
1. **Asynchronous Decoupling**: Claim submissions are decoupled from passbook analytics and chatbot reasoning. A crash in the voice LLM does not prevent the submission form from firing.
2. **Bulkheads**: Separate connection pools and thread workers are allocated for Claim Processing vs. Analytics Queries.
3. **Graceful UI Degradation**: When a non-critical component fails, the UI disables only that specific widget, displaying an informative banner while keeping all core transaction paths operational.

---

## 5. Technical Implementation Specifications

### 5.1 Three-State Circuit Breaker Pattern (`src/core/resilience.py`)

```python
import time
import logging
from enum import Enum
from typing import Callable, Any

logger = logging.getLogger(__name__)

class CircuitState(str, Enum):
    CLOSED = "CLOSED"       # Normal operation; all requests pass through
    OPEN = "OPEN"           # Failed threshold breached; requests route to substitute immediately
    HALF_OPEN = "HALF_OPEN" # Testing upstream recovery with limited traffic

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 3, recovery_timeout_sec: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout_sec = recovery_timeout_sec
        self.failure_count = 0
        self.last_state_change = time.time()
        self.state = CircuitState.CLOSED

    def execute(self, primary_func: Callable, fallback_func: Callable, *args, **kwargs) -> Any:
        now = time.time()
        
        # Check if OPEN state has expired and should transition to HALF_OPEN
        if self.state == CircuitState.OPEN:
            if now - self.last_state_change > self.recovery_timeout_sec:
                logger.info("CircuitBreaker entering HALF_OPEN state. Testing primary upstream.")
                self.state = CircuitState.HALF_OPEN
            else:
                logger.warning("CircuitBreaker is OPEN. Invoking Hot Substitute.")
                return fallback_func(*args, **kwargs)

        try:
            result = primary_func(*args, **kwargs)
            if self.state == CircuitState.HALF_OPEN:
                logger.info("Primary upstream succeeded in HALF_OPEN. Resetting CircuitBreaker to CLOSED.")
                self.state = CircuitState.CLOSED
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            logger.error(f"Primary function failed (attempt {self.failure_count}): {e}")
            
            if self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN
                self.last_state_change = now
                logger.critical(f"Failure threshold breached. CircuitBreaker transitioned to OPEN.")
                
            return fallback_func(*args, **kwargs)
```

### 5.2 Voice Ingestion Hot Substitute (`src/components/dashboard/VoiceClaimAssistant.tsx`)

```typescript
/**
 * Voice Ingestion Engine with Automatic Hot-Substitute Failover
 */
export async function processVoiceInput(audioBlob: Blob, language: string): Promise<string> {
  try {
    // 1. Attempt Primary: Whisper Cloud API with strict 3.5s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('language', language);

    const response = await fetch('/api/v1/voice/transcribe', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Whisper API error: ${response.status}`);
    const data = await response.json();
    return data.transcription;
  } catch (error) {
    console.warn("Primary Whisper API failed or timed out. Activating Browser Speech Hot Substitute.", error);
    
    // 2. Activate Hot Substitute: Browser Web Speech API or Fallback Prompt
    return fallbackToWebSpeechRecognition(language);
  }
}

function fallbackToWebSpeechRecognition(language: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Final resilient fallback: display quick-action topic tiles
      return resolve("FALLBACK_TO_QUICK_TILES");
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.onresult = (event: any) => resolve(event.results[0][0].transcript);
    recognition.onerror = () => resolve("FALLBACK_TO_QUICK_TILES");
    recognition.start();
  });
}
```

### 5.3 Offline Service Worker Background Sync (`src/workers/claimSyncWorker.ts`)

```typescript
/**
 * Offline Claim Submission Queue with Service Worker Background Sync
 */
export async function queueClaimOffline(claimPayload: any): Promise<{ trackingToken: string; isOffline: boolean }> {
  const offlineToken = `OFFLINE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const record = { ...claimPayload, offlineToken, queuedAt: new Date().toISOString() };

  // Store in browser IndexedDB
  await saveToIndexedDB('pending_claims', record);

  // Register Background Sync task if supported
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register('sync-pending-claims');
  }

  return { trackingToken: offlineToken, isOffline: true };
}
```

---

## 6. Alternatives Considered

### Alternative A: Fail-Fast with Blocking Error Modals
- **Description**: Return standard HTTP 500 error modals immediately when any microservice dependency fails.
- **Rejection Rationale**: 
  - Catastrophic user experience. Citizens undergoing medical emergencies are left stranded without actionable recourse.
  - Generates panic and flood-requests to EPFO physical offices.

### Alternative B: Synchronous Multi-Tier Fallback Cascades
- **Description**: Attempt Primary $\rightarrow$ Secondary $\rightarrow$ Tertiary synchronously inside a single request handler.
- **Rejection Rationale**: 
  - Causes severe latency stacking ($3\text{s} + 3\text{s} + 3\text{s} = 9\text{s}$), leading to browser gateway timeouts (504).
  - Starves backend web worker threads during high-traffic spikes.

### Alternative C: Static Maintenance Splash Pages
- **Description**: Route all traffic to a maintenance page during backend upgrades.
- **Rejection Rationale**: 
  - Completely unacceptable for mission-critical Digital Public Infrastructure. Jan-EPF AI mandates zero-downtime architecture.

---

## 7. Consequences & System Impact

### Positive Consequences
- **99.99% Operational System Availability**: Citizens can always view recent passbooks, draft claims, verify identities, and queue transactions regardless of upstream cloud issues.
- **Zero Cascading Outages**: Subsystem failures are contained within their local blast radius.
- **Rural Connectivity Resilience**: Intermittent 3G network drops no longer cause lost form data or failed submissions.
- **Predictable SRE Metrics**: SRE teams receive real-time Prometheus alert metrics (`janepf_circuit_breaker_trips_total`) without citizens experiencing portal crashes.

### Negative Consequences & Mitigations
- **Eventual Consistency Latency**: Offline queued claims are synced asynchronously when connectivity returns.
  - *Mitigation*: The UI clearly communicates the status: *"Claim Queued Offline — Syncing Automatically with EPFO Server (Audit Token: #OFFLINE-8921)"*.
- **Schema Parity Maintenance**: Local IndexedDB and server PostgreSQL schemas must remain compatible across versions.
  - *Mitigation*: Automatic schema version migration handler inside the Service Worker initialization pipeline.
