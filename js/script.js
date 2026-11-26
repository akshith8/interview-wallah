/* Interview Wallah - landing page behaviour (replaces the React components). */
(function () {
  "use strict";

  /* Backend base URL (was NEXT_PUBLIC API setting in frontend/.env.example). */
  var API_BASE = "http://localhost:8000";

  var A = window.Analyse;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /* ---------- Footer year (all pages) ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Marquee: duplicate the row so the loop is seamless ---------- */
  var track = $(".marquee-track");
  if (track) {
    var items = [
      "Tell me about yourself",
      "Why this company?",
      "Your biggest weakness",
      "A time you led a team",
      "Where do you see yourself in 5 years?",
      "Walk me through your resume",
      "Handling conflict at work",
      "Why should we hire you?"
    ];
    items.concat(items).forEach(function (q) {
      var item = document.createElement("span");
      item.className = "marquee-item";
      item.appendChild(document.createTextNode(q));
      var dot = document.createElement("span");
      dot.className = "dot";
      dot.innerHTML = "&bull;";
      item.appendChild(dot);
      track.appendChild(item);
    });
  }

  /* ---------- Practice demo ---------- */
  var practice = $("#practice");
  if (practice && A) {
    var QUESTIONS = [
      "Tell me about yourself.",
      "Why do you want to work here?",
      "Describe a time you handled a difficult situation.",
      "What is your biggest weakness?"
    ];

    var Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    var supported = Boolean(Ctor);

    var state = { qIndex: 0, recording: false, seconds: 0 };
    var rec = null;
    var timer = null;
    var finalText = "";

    var tabsEl = $("#q-tabs");
    var questionEl = $("#question");
    var recBtn = $("#rec-btn");
    var timerEl = $("#timer");
    var unsupportedEl = $("#unsupported");
    var textEl = $("#transcript");
    var secsLabel = $("#secs-label");
    var secsInput = $("#secs-input");
    var feedbackBtn = $("#feedback-btn");
    var resultEl = $("#result");

    function renderTabs() {
      tabsEl.innerHTML = "";
      QUESTIONS.forEach(function (q, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "q-tab" + (i === state.qIndex ? " active" : "");
        b.textContent = "Q" + (i + 1);
        b.disabled = state.recording;
        b.addEventListener("click", function () {
          state.qIndex = i;
          resultEl.hidden = true;
          renderTabs();
          questionEl.textContent = QUESTIONS[i];
        });
        tabsEl.appendChild(b);
      });
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
      renderTabs();
    }

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function start() {
      if (!Ctor) return;
      resultEl.hidden = true;
      state.seconds = 0;
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
        updateControls();
      };
      rec.onend = function () {
        stopTimer();
        state.recording = false;
        updateControls();
      };
      rec.start();
      state.recording = true;
      timer = setInterval(function () {
        state.seconds += 1;
        timerEl.textContent = A.formatTime(state.seconds);
      }, 1000);
      updateControls();
    }

    function stop() {
      if (rec) rec.stop();
      stopTimer();
      state.recording = false;
      updateControls();
    }

    function stat(label, value) {
      var wrap = document.createElement("div");
      var v = document.createElement("div");
      v.className = "stat-value";
      v.textContent = value;
      var l = document.createElement("div");
      l.className = "stat-label";
      l.textContent = label;
      wrap.appendChild(v);
      wrap.appendChild(l);
      return wrap;
    }

    function renderResult(text, seconds) {
      var r = A.analyse(text, seconds);
      resultEl.innerHTML = "";

      var stats = document.createElement("div");
      stats.className = "result-stats";
      var scoreWrap = document.createElement("div");
      var score = document.createElement("div");
      score.className = "score";
      score.textContent = r.score;
      var outOf = document.createElement("div");
      outOf.className = "stat-label";
      outOf.textContent = "out of 100";
      scoreWrap.appendChild(score);
      scoreWrap.appendChild(outOf);
      stats.appendChild(scoreWrap);
      stats.appendChild(stat("Pace", r.wpm + " wpm"));
      stats.appendChild(stat("Words", String(r.words)));
      stats.appendChild(stat("Fillers", String(r.fillers)));
      resultEl.appendChild(stats);

      var p = document.createElement("p");
      p.className = "result-text";
      A.splitFillers(text).forEach(function (part) {
        var node = document.createElement(part.filler ? "mark" : "span");
        node.textContent = part.text;
        p.appendChild(node);
      });
      resultEl.appendChild(p);

      var ul = document.createElement("ul");
      ul.className = "tips";
      r.tips.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        ul.appendChild(li);
      });
      resultEl.appendChild(ul);
      resultEl.hidden = false;
    }

    // Initial UI
    questionEl.textContent = QUESTIONS[0];
    if (supported) {
      unsupportedEl.hidden = true;
      secsLabel.hidden = true;
      recBtn.addEventListener("click", function () { state.recording ? stop() : start(); });
    } else {
      recBtn.hidden = true;
      unsupportedEl.hidden = false;
    }
    textEl.addEventListener("input", updateControls);
    secsInput.addEventListener("input", function () {
      state.seconds = Number(secsInput.value) || 0;
      timerEl.textContent = A.formatTime(state.seconds);
    });
    feedbackBtn.addEventListener("click", function () {
      renderResult(textEl.value, state.seconds);
    });
    window.addEventListener("beforeunload", function () {
      if (rec) rec.stop();
      stopTimer();
    });
    updateControls();
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
