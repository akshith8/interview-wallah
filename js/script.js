/* Interview Wallah — Editorial motion graphics, Practice Studio & Delivery Report */
(function () {
  "use strict";

  var API_BASE = "http://localhost:8000";
  var A = window.Analyse;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll-driven animation fallback (IntersectionObserver) ---------- */
  var supportsViewTimeline = window.CSS && CSS.supports && CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
  if (!supportsViewTimeline && !prefersReducedMotion) {
    document.documentElement.classList.add("no-view-timeline");
    var revealEls = $$(".reveal-on-scroll");
    if ("IntersectionObserver" in window && revealEls.length) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { revealObs.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-inview"); });
    }
  }

  /* ---------- Shared Harmonic Canvas Waveform Renderer ---------- */
  function createWaveRenderer(canvas, getParams) {
    var ctx = canvas.getContext("2d");
    var phase = 0;
    var rafId = null;
    var currentAmp = 0.25;
    var currentSpeed = 0.04;
    var currentJitter = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    function drawFrame() {
      var rect = canvas.getBoundingClientRect();
      var w = rect.width || canvas.width;
      var h = rect.height || canvas.height;
      var p = getParams();

      currentAmp += (p.amp - currentAmp) * 0.08;
      currentSpeed += (p.speed - currentSpeed) * 0.08;
      currentJitter += (p.jitter - currentJitter) * 0.08;

      ctx.clearRect(0, 0, w, h);

      var midY = h * 0.52;
      // Subtle center guide rule
      ctx.strokeStyle = "rgba(26, 25, 23, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();

      var layers = [
        { freq: 0.018, mult: 1.0, phaseOffset: 0, color: "rgba(36, 64, 48, 0.85)", width: 2.2 },
        { freq: 0.028, mult: 0.65, phaseOffset: 1.7, color: "rgba(194, 89, 55, 0.7)", width: 1.6 },
        { freq: 0.011, mult: 0.45, phaseOffset: 3.1, color: "rgba(26, 25, 23, 0.2)", width: 1.2 }
      ];

      layers.forEach(function (layer) {
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.width;
        ctx.beginPath();
        for (var x = 0; x <= w; x += 3) {
          var normX = x / w;
          // Taper envelope cleanly at both edges
          var envelope = Math.sin(normX * Math.PI);
          var harmonic =
            Math.sin(x * layer.freq + phase + layer.phaseOffset) * 0.65 +
            Math.sin(x * layer.freq * 2.1 - phase * 1.4) * 0.35;
          var spike = currentJitter > 0
            ? Math.sin(x * 0.13 + phase * 2.7) * currentJitter * 0.35
            : 0;
          var y = midY + (harmonic + spike) * envelope * (h * 0.38) * currentAmp * layer.mult;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      if (p.playing) {
        phase += currentSpeed;
        rafId = requestAnimationFrame(drawFrame);
      } else {
        rafId = null;
      }
    }

    function start() {
      resize();
      if (!rafId) drawFrame();
    }

    function renderOnce() {
      resize();
      drawFrame();
    }

    window.addEventListener("resize", renderOnce);

    return {
      start: start,
      renderOnce: renderOnce,
      stop: function () {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }

  /* ---------- Landing Page: Hero Kinetic Telemetry Card ---------- */
  var telemetryCard = $("#hero-telemetry");
  var heroCanvas = $("#hero-wave");
  if (telemetryCard && heroCanvas) {
    var MODES = {
      steady: {
        label: "Cadence simulation · Steady",
        wpm: 142,
        amp: 0.68,
        speed: 0.055,
        jitter: 0.04,
        hzText: "Harmonic envelope · 142 WPM",
        fillerText: "0 fillers flagged",
        color: "#244030",
        transcriptHtml: "“In my last role I cut onboarding time by 35% <span class=\"pause-tag\">0.6s pause</span> by pairing new hires with recorded walkthroughs.”"
      },
      rushed: {
        label: "Cadence simulation · Rushed",
        wpm: 194,
        amp: 0.92,
        speed: 0.125,
        jitter: 0.55,
        hzText: "High tempo spike · 194 WPM",
        fillerText: "3 fillers flagged",
        color: "#c25937",
        transcriptHtml: "“So <span class=\"filler-tag\">basically</span> I worked on the backend API and <span class=\"filler-tag\">like</span> we shipped it fast, <span class=\"filler-tag\">you know</span>.”"
      },
      hesitant: {
        label: "Cadence simulation · Hesitant",
        wpm: 86,
        amp: 0.38,
        speed: 0.032,
        jitter: 0.28,
        hzText: "Uneven stops · 86 WPM",
        fillerText: "2 fillers flagged",
        color: "#b78436",
        transcriptHtml: "“<span class=\"filler-tag\">Umm</span> I think my biggest strength is <span class=\"filler-tag\">sort of</span> debugging complex frontend issues.”"
      }
    };

    var activeMode = "steady";
    var isPlaying = !prefersReducedMotion;

    var stateLabelEl = $("#telemetry-state-label");
    var waveHzEl = $("#wave-hz");
    var waveFillersEl = $("#wave-fillers");
    var dialArcEl = $("#dial-arc");
    var dialWpmEl = $("#dial-wpm");
    var transcriptPrevEl = $("#telemetry-transcript");
    var toggleBtn = $("#motion-toggle");
    var modeBtns = $$(".mode-chip", telemetryCard);

    if (prefersReducedMotion && toggleBtn) {
      toggleBtn.textContent = "Play";
      telemetryCard.classList.add("is-paused");
    }

    var heroWave = createWaveRenderer(heroCanvas, function () {
      var m = MODES[activeMode];
      return { amp: m.amp, speed: m.speed, jitter: m.jitter, playing: isPlaying };
    });

    function applyTelemetryMode(key) {
      activeMode = key;
      var m = MODES[key];
      modeBtns.forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-mode") === key);
      });
      stateLabelEl.textContent = m.label;
      waveHzEl.textContent = m.hzText;
      waveFillersEl.textContent = m.fillerText;
      dialWpmEl.textContent = String(m.wpm);
      transcriptPrevEl.innerHTML = m.transcriptHtml;

      // Update dial arc (circumference for r=39 is ~245.04)
      var circ = 245.04;
      var ratio = Math.max(0.12, Math.min(0.95, m.wpm / 220));
      dialArcEl.style.strokeDashoffset = String((circ * (1 - ratio)).toFixed(2));
      dialArcEl.style.stroke = m.color;

      if (!isPlaying) heroWave.renderOnce();
    }

    modeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTelemetryMode(btn.getAttribute("data-mode"));
      });
    });

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        isPlaying = !isPlaying;
        toggleBtn.textContent = isPlaying ? "Pause" : "Play";
        telemetryCard.classList.toggle("is-paused", !isPlaying);
        if (isPlaying) heroWave.start();
        else heroWave.stop();
      });
    }

    applyTelemetryMode("steady");
    if (isPlaying) heroWave.start();
    else heroWave.renderOnce();
  }

  /* ---------- Landing Page: Anatomy of an Answer Interactive SVG ---------- */
  var cadenceLine = $("#cadence-line");
  var cadenceMarkers = $$(".cadence-marker");
  if (cadenceLine && cadenceMarkers.length) {
    var MOMENTS = [
      {
        label: "0:11 · Opening hook",
        text: "Clear thesis statement sets context without rushing the first sentence.",
        metric: "138 WPM · 0 fillers"
      },
      {
        label: "0:22 · Filler spike",
        text: "Pace climbed above 180 WPM while searching for the next example, triggering 'basically' and 'like'.",
        metric: "184 WPM · 2 fillers"
      },
      {
        label: "0:34 · Concrete result",
        text: "Slowing slightly to land a specific number gives the interviewer time to absorb the impact.",
        metric: "132 WPM · 0.5s pause"
      },
      {
        label: "0:45 · Clean close",
        text: "Finished cleanly on a complete sentence instead of trailing off with 'so yeah'.",
        metric: "140 WPM · Strong close"
      }
    ];

    var mLabelEl = $("#cadence-moment-label");
    var mTextEl = $("#cadence-moment-text");
    var mMetricEl = $("#cadence-moment-metric");

    function selectMoment(idx) {
      var item = MOMENTS[idx] || MOMENTS[0];
      cadenceMarkers.forEach(function (g, i) {
        g.classList.toggle("is-active", i === idx);
      });
      mLabelEl.textContent = item.label;
      mTextEl.textContent = item.text;
      mMetricEl.textContent = item.metric;
    }

    cadenceMarkers.forEach(function (g) {
      var idx = Number(g.getAttribute("data-step")) || 0;
      g.addEventListener("click", function () { selectMoment(idx); });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectMoment(idx);
        }
      });
    });

    // Draw-in animation for cadence SVG path when scrolled into view
    if (!prefersReducedMotion && typeof cadenceLine.getTotalLength === "function") {
      var totalLen = cadenceLine.getTotalLength();
      cadenceLine.style.strokeDasharray = String(totalLen);
      cadenceLine.style.strokeDashoffset = String(totalLen);

      if ("IntersectionObserver" in window) {
        var pathObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              cadenceLine.style.transition = "stroke-dashoffset 1200ms cubic-bezier(0.16, 1, 0.3, 1)";
              cadenceLine.style.strokeDashoffset = "0";
              pathObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        pathObs.observe(cadenceLine);
      } else {
        cadenceLine.style.strokeDashoffset = "0";
      }
    }
  }

  /* ---------- Practice Studio Page (interview.html) ---------- */
  var practice = $("#practice");
  if (practice && A) {
    var QUESTIONS = [
      { text: "Tell me about yourself.", target: "60–90s" },
      { text: "Why do you want to work here?", target: "45–75s" },
      { text: "Describe a time you handled a difficult situation.", target: "60–90s" },
      { text: "What is your biggest weakness?", target: "45–60s" },
      { text: "Walk me through a project you led end-to-end.", target: "90s" }
    ];

    var params = new URLSearchParams(window.location.search);
    var initialQ = parseInt(params.get("q"), 10);
    var isCustomParam = params.get("custom") === "1";

    var Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    var supported = Boolean(Ctor);

    var state = {
      qIndex: isCustomParam ? -1 : (!isNaN(initialQ) && initialQ >= 0 && initialQ < QUESTIONS.length ? initialQ : 0),
      recording: false,
      seconds: 0,
      audioLevel: 0,
      typingPulse: 0
    };

    var rec = null;
    var timer = null;
    var finalText = "";
    var audioStream = null;
    var audioCtx = null;
    var analyser = null;
    var freqData = null;

    var tabsEl = $("#q-tabs");
    var customWrap = $("#custom-prompt-wrap");
    var customInput = $("#custom-prompt-input");
    var questionEl = $("#question");
    var recBtn = $("#rec-btn");
    var recDot = $("#rec-dot");
    var timerEl = $("#timer");
    var unsupportedEl = $("#unsupported");
    var textEl = $("#transcript");
    var secsLabel = $("#secs-label");
    var secsInput = $("#secs-input");
    var feedbackBtn = $("#feedback-btn");
    var sampleFillBtn = $("#sample-fill-btn");
    var vizStatusEl = $("#viz-status");
    var vizModeEl = $("#viz-mode");
    var studioCanvas = $("#studio-wave");

    var liveWordsEl = $("#live-words");
    var liveWpmEl = $("#live-wpm");
    var liveFillersEl = $("#live-fillers");
    var liveTargetEl = $("#live-target");

    var studioWave = studioCanvas
      ? createWaveRenderer(studioCanvas, function () {
          if (analyser && freqData && state.recording) {
            analyser.getByteFrequencyData(freqData);
            var sum = 0;
            for (var i = 0; i < freqData.length; i++) sum += freqData[i];
            var avg = sum / (freqData.length * 255);
            state.audioLevel = Math.max(0.22, Math.min(1.05, avg * 2.6));
          } else if (state.recording) {
            state.audioLevel = 0.45 + Math.sin(Date.now() * 0.008) * 0.25;
          } else if (state.typingPulse > 0.05) {
            state.typingPulse *= 0.92;
            state.audioLevel = 0.2 + state.typingPulse * 0.65;
          } else {
            state.audioLevel = 0.16;
          }
          return {
            amp: state.audioLevel,
            speed: state.recording ? 0.095 : 0.032,
            jitter: state.recording ? state.audioLevel * 0.4 : 0.02,
            playing: !prefersReducedMotion
          };
        })
      : null;

    if (studioWave) {
      if (prefersReducedMotion) studioWave.renderOnce();
      else studioWave.start();
    }

    function currentQuestionText() {
      if (state.qIndex === -1) {
        return customInput.value.trim() || "Custom prompt — type your question above.";
      }
      return QUESTIONS[state.qIndex].text;
    }

    function renderPromptHeader() {
      questionEl.textContent = currentQuestionText();
      customWrap.hidden = state.qIndex !== -1;
      liveTargetEl.textContent = state.qIndex === -1 ? "60–90s" : QUESTIONS[state.qIndex].target;
    }

    function renderTabs() {
      tabsEl.innerHTML = "";
      QUESTIONS.forEach(function (q, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "q-tab" + (i === state.qIndex ? " active" : "");
        b.textContent = "Q" + (i + 1);
        b.title = q.text;
        b.disabled = state.recording;
        b.addEventListener("click", function () {
          state.qIndex = i;
          renderTabs();
          renderPromptHeader();
        });
        tabsEl.appendChild(b);
      });

      var customBtn = document.createElement("button");
      customBtn.type = "button";
      customBtn.className = "q-tab" + (state.qIndex === -1 ? " active" : "");
      customBtn.textContent = "Custom";
      customBtn.disabled = state.recording;
      customBtn.addEventListener("click", function () {
        state.qIndex = -1;
        renderTabs();
        renderPromptHeader();
        customInput.focus();
      });
      tabsEl.appendChild(customBtn);
    }

    function updateLiveTelemetry() {
      var text = textEl.value.trim();
      var words = text ? text.split(/\s+/).length : 0;
      var secs = state.seconds || Number(secsInput.value) || 0;
      var wpm = secs > 0 ? Math.round(words / (secs / 60)) : 0;
      var fillers = A.splitFillers(text).filter(function (p) { return p.filler; }).length;

      liveWordsEl.textContent = String(words);
      liveWpmEl.textContent = String(wpm);
      liveFillersEl.textContent = String(fillers);
    }

    function updateControls() {
      var hasText = textEl.value.trim().length > 0;
      feedbackBtn.disabled = state.recording || !hasText;
      textEl.readOnly = state.recording;
      timerEl.textContent = A.formatTime(state.seconds);
      if (supported) {
        recBtn.textContent = state.recording ? "Stop recording" : "Start recording";
        recBtn.classList.toggle("live", state.recording);
      }
      if (recDot) recDot.style.background = state.recording ? "#c25937" : "#244030";
      if (vizStatusEl && vizModeEl) {
        vizStatusEl.textContent = state.recording ? "Listening live" : "Microphone standby";
        vizModeEl.textContent = state.recording ? "Active capture" : "Ready";
      }
      renderTabs();
      updateLiveTelemetry();
    }

    function cleanupAudio() {
      if (audioStream) {
        audioStream.getTracks().forEach(function (t) { t.stop(); });
        audioStream = null;
      }
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(function () {});
        audioCtx = null;
      }
      analyser = null;
      freqData = null;
    }

    function initMicVisualizer() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return;
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
          if (!state.recording) {
            stream.getTracks().forEach(function (t) { t.stop(); });
            return;
          }
          audioStream = stream;
          audioCtx = new AudioContextCtor();
          var source = audioCtx.createMediaStreamSource(stream);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          freqData = new Uint8Array(analyser.frequencyBinCount);
        })
        .catch(function () {
          // Gracefully fall back to cadence-driven waveform animation
        });
    }

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function start() {
      if (!Ctor) return;
      state.seconds = 0;
      secsInput.value = "";
      textEl.value = "";
      finalText = "";

      rec = new Ctor();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-IN";
      rec.onresult = function (e) {
        var interim = "";
        for (var i = e.resultIndex; i < e.results.length; i++) {
          var r = e.results[i];
          if (r.isFinal) finalText += r[0].transcript + " ";
          else interim += r[0].transcript;
        }
        textEl.value = (finalText + interim).trim();
        state.typingPulse = 0.85;
        updateControls();
      };
      rec.onend = function () {
        stopTimer();
        cleanupAudio();
        state.recording = false;
        updateControls();
      };
      rec.start();
      state.recording = true;
      initMicVisualizer();

      timer = setInterval(function () {
        state.seconds += 1;
        secsInput.value = String(state.seconds);
        timerEl.textContent = A.formatTime(state.seconds);
        updateLiveTelemetry();
      }, 1000);
      updateControls();
    }

    function stop() {
      if (rec) rec.stop();
      stopTimer();
      cleanupAudio();
      state.recording = false;
      updateControls();
    }

    if (supported) {
      unsupportedEl.hidden = true;
      recBtn.addEventListener("click", function () { state.recording ? stop() : start(); });
    } else {
      recBtn.hidden = true;
      unsupportedEl.hidden = false;
    }

    customInput.addEventListener("input", renderPromptHeader);

    textEl.addEventListener("input", function () {
      state.typingPulse = 0.9;
      if (!state.seconds && !secsInput.value && textEl.value.trim()) {
        // Leave seconds editable, show live updates cleanly
      }
      updateControls();
    });

    secsInput.addEventListener("input", function () {
      state.seconds = Math.max(0, Number(secsInput.value) || 0);
      timerEl.textContent = A.formatTime(state.seconds);
      updateLiveTelemetry();
    });

    if (sampleFillBtn) {
      sampleFillBtn.addEventListener("click", function () {
        if (state.recording) return;
        textEl.value =
          "In my previous internship, we had a checkout flow where, basically, drop-offs spiked on mobile. " +
          "I sat down with support tickets and noticed users were, like, re-entering their address twice. " +
          "I simplified the form into two clear steps, added inline validation, and within three weeks completion rose by 18 percent. " +
          "That taught me to check real user friction before rewriting code.";
        state.seconds = 34;
        secsInput.value = "34";
        state.typingPulse = 1;
        updateControls();
      });
    }

    feedbackBtn.addEventListener("click", function () {
      var text = textEl.value.trim();
      if (!text) return;
      var words = text.split(/\s+/).length;
      var secs = state.seconds || Number(secsInput.value) || Math.max(15, Math.round(words / 2.3));
      var analysis = A.analyse(text, secs);
      var id = "s" + Date.now().toString(36);
      var payload = {
        id: id,
        qIndex: state.qIndex,
        question: currentQuestionText(),
        text: text,
        seconds: secs,
        analysis: analysis,
        createdAt: new Date().toISOString()
      };

      try {
        localStorage.setItem("iw_session_" + id, JSON.stringify(payload));
      } catch (e) {
        try { sessionStorage.setItem("iw_session_" + id, JSON.stringify(payload)); } catch (ignored) {}
      }

      window.location.href = "report.html?session=" + encodeURIComponent(id);
    });

    window.addEventListener("beforeunload", function () {
      if (rec) rec.stop();
      stopTimer();
      cleanupAudio();
    });

    renderPromptHeader();
    updateControls();
  }

  /* ---------- Delivery Report Page (report.html) ---------- */
  var reportRoot = $("#report-root");
  if (reportRoot && A) {
    var DEMO_SESSION = {
      id: "demo",
      qIndex: 2,
      question: "Describe a time you handled a difficult situation.",
      text: "Last semester our deployment pipeline broke two hours before our final demo. Basically, a dependency update shifted our build config and everyone started panicking. I paused the group, rolled back the lockfile to isolate what changed, and delegated UI verification to two teammates while I patched the environment script. We shipped ten minutes early and learned to pin build versions.",
      seconds: 28,
      isSample: true
    };

    var rParams = new URLSearchParams(window.location.search);
    var sessionId = rParams.get("session") || "demo";
    var session = null;

    if (sessionId !== "demo") {
      try {
        var raw = localStorage.getItem("iw_session_" + sessionId) || sessionStorage.getItem("iw_session_" + sessionId);
        if (raw) session = JSON.parse(raw);
      } catch (e) {}
    }

    if (!session) {
      session = DEMO_SESSION;
    }

    var analysis = session.analysis || A.analyse(session.text, session.seconds);

    $("#report-kicker").textContent = session.isSample ? "Sample Delivery Report" : "Your Delivery Report";
    $("#report-question").textContent = session.question;
    $("#stat-wpm").textContent = analysis.wpm + " wpm";
    $("#stat-duration").textContent = A.formatTime(session.seconds);
    $("#stat-words").textContent = String(analysis.words);
    $("#stat-fillers").textContent = String(analysis.fillers);

    var retryLink = $("#retry-link");
    if (retryLink) {
      retryLink.href = session.qIndex === -1
        ? "interview.html?custom=1"
        : "interview.html?q=" + encodeURIComponent(String(session.qIndex || 0));
    }

    // Pace band verdict & needle position (scale: 60..220 WPM)
    var needleEl = $("#pace-needle");
    var verdictEl = $("#pace-verdict");
    var pct = Math.max(4, Math.min(96, ((analysis.wpm - 60) / (220 - 60)) * 100));
    if (analysis.wpm < 110) {
      verdictEl.textContent = "Slightly deliberate — room to pick up momentum";
      verdictEl.style.color = "#b78436";
    } else if (analysis.wpm > 170) {
      verdictEl.textContent = "Above 170 WPM — slow down on key points";
      verdictEl.style.color = "#c25937";
    } else {
      verdictEl.textContent = "Right in the 120–170 WPM sweet spot";
      verdictEl.style.color = "#244030";
    }

    // Annotated transcript
    var transcriptOut = $("#report-transcript");
    transcriptOut.innerHTML = "";
    A.splitFillers(session.text).forEach(function (part) {
      var node = document.createElement(part.filler ? "mark" : "span");
      node.textContent = part.text;
      transcriptOut.appendChild(node);
    });

    // Coaching tips
    var tipsOut = $("#report-tips");
    tipsOut.innerHTML = "";
    analysis.tips.forEach(function (tip) {
      var li = document.createElement("li");
      li.textContent = tip;
      tipsOut.appendChild(li);
    });

    // Animated score ring & count-up
    var ringEl = $("#score-ring-arc");
    var scoreNumEl = $("#report-score");
    var ringCirc = 364.42;
    var targetOffset = ringCirc * (1 - analysis.score / 100);

    if (prefersReducedMotion) {
      ringEl.style.strokeDashoffset = String(targetOffset);
      scoreNumEl.textContent = String(analysis.score);
      needleEl.style.left = pct.toFixed(1) + "%";
    } else {
      requestAnimationFrame(function () {
        ringEl.style.strokeDashoffset = String(targetOffset.toFixed(2));
        needleEl.style.left = pct.toFixed(1) + "%";
      });

      var startTs = null;
      var durationMs = 750;
      function tickScore(ts) {
        if (!startTs) startTs = ts;
        var prog = Math.min(1, (ts - startTs) / durationMs);
        var eased = 1 - Math.pow(1 - prog, 3);
        scoreNumEl.textContent = String(Math.round(analysis.score * eased));
        if (prog < 1) requestAnimationFrame(tickScore);
      }
      requestAnimationFrame(tickScore);
    }
  }

  /* ---------- Contact form ---------- */
  var form = $("#contact-form");
  if (form) {
    var submitBtn = $("button", form);
    var msg = $("#form-msg");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      msg.hidden = true;

      fetch(API_BASE + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          message: String(fd.get("message") || "")
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          msg.className = "form-msg ok";
          msg.textContent = "Thanks! We will be in touch.";
          form.reset();
        })
        .catch(function () {
          msg.className = "form-msg err";
          msg.textContent = "Could not send. Check that the backend is running.";
        })
        .then(function () {
          msg.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = "Join the list";
        });
    });
  }
})();
