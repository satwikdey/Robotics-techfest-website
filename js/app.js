/**
 * TECHPULSE 2027 • CYBERTRON CORE LOGIC
 * Transformers Themed Robotics Fest Interactive Controller
 * Real-time Pass Sync, QR Engine, Web Audio Synthesizer,
 * Multi-Step Form Wizard, Google Sheets / Apps Script Integration & Excel Export.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    profile: 'school', // 'school' | 'college'
    currentStep: 1,
    totalSteps: 5,
    soundEnabled: true,
    faction: 'autobot', // 'autobot' | 'decepticon'
    isFlipped: false,
    appScriptUrl: localStorage.getItem('tp27_appscript_url') || 'https://script.google.com/macros/s/AKfycbwho09oISTnmsj2ifg5QFvHSXD1ApycShe9AgQ0NVRsDRarOdVmKfUW4IIXB-BgAdFL/exec',
    avatarUrl: 'assets/images/cybertron_avatar_optimus.jpg',
    delegateId: generateDelegateId('AUTOBOT'),
    registrations: JSON.parse(localStorage.getItem('tp27_registrations') || '[]'),
    activeVideoIndex: 0
  };

  // Video Assets Feed
  const videoFeeds = [
    {
      title: "TACTICAL DRONE & COMBAT ARENA",
      sub: "Aerial telemetry of the Grand Arena & high-altitude obstacle grid.",
      src: "assets/videos/arena-drone-aerial.mp4",
      tag: "FEED 01 • OUTDOOR ARENA",
      time: "1080P • 60 FPS • LIVE SATELLITE"
    },
    {
      title: "DELEGATE INFLUX & EXPO GROUNDS",
      sub: "Student pioneers assembling across the South 24 Parganas tech pavilions.",
      src: "assets/videos/delegates-expo-walk.mp4",
      tag: "FEED 02 • MAIN CONCOURSE",
      time: "1080P • HIGH MOBILITY"
    },
    {
      title: "NEON TECH STALLS & PROJECT SHOWCASE",
      sub: "Inside look at next-gen hardware, IoT and automated robotics booths.",
      src: "assets/videos/tech-stalls-showcase.mp4",
      tag: "FEED 03 • INNOVATION PAVILION",
      time: "1080P • INDOOR STALLS"
    },
    {
      title: "AUTONOMOUS LINE FOLLOWER & BOT RACE",
      sub: "High-speed sensor-guided robots competing on precision track.",
      src: "assets/videos/line-follower-action.mp4",
      tag: "FEED 04 • COMBAT CIRCUIT",
      time: "1080P • HIGH SPEED TRACK"
    }
  ];

  // Helper: Generate Delegate ID
  function generateDelegateId(faction) {
    const prefix = faction === 'decepticon' ? 'DCP' : 'ATB';
    const num = Math.floor(1000 + Math.random() * 9000);
    return `TP27-${prefix}-${num}`;
  }

  // ==========================================================================
  // TRANSFORMERS WEB AUDIO SYNTHESIZER
  // ==========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const SoundFX = {
    click: function () {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } catch (e) {}
    },
    beep: function () {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (e) {}
    },
    transform: function () {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.28);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.45);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.52);
      } catch (e) {}
    },
    success: function () {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const t = ctx.currentTime + idx * 0.1;
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.35);
        });
      } catch (e) {}
    }
  };

  // ==========================================================================
  // BACKGROUND CYBER MATRIX CANVAS
  // ==========================================================================
  function initCyberCanvas() {
    const canvas = document.getElementById('cyberCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 18000), 70);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(255, 183, 0, '
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.fillStyle = p1.color + '0.6)';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(render);
    }
    render();
  }

  // ==========================================================================
  // COUNTDOWN TIMER
  // ==========================================================================
  function initCountdown() {
    const el = document.getElementById('festCountdown');
    if (!el) return;
    // Set target date: October 17, 2027
    const targetDate = new Date('2027-10-17T09:00:00+05:30').getTime();

    function update() {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      el.textContent = `${days}d : ${String(hours).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`;
    }
    update();
    setInterval(update, 1000);
  }

  // ==========================================================================
  // QR CODE GENERATOR (Using qrcode.js)
  // ==========================================================================
  function updatePassQRCode() {
    const container = document.getElementById('passQrCode');
    if (!container) return;

    const name = document.getElementById('regFullName')?.value || 'Cadet Delegate';
    const profile = state.profile.toUpperCase();
    const inst = (state.profile === 'school' ? document.getElementById('regSchoolName')?.value : document.getElementById('regCollegeName')?.value) || 'TechPulse Academy';

    const qrPayload = JSON.stringify({
      id: state.delegateId,
      name: name,
      profile: profile,
      inst: inst,
      valid: "VERIFIED_CYBERTRON_PASS_2027"
    });

    try {
      if (typeof qrcode !== 'undefined') {
        const qr = qrcode(0, 'M');
        qr.addData(qrPayload);
        qr.make();
        container.innerHTML = qr.createImgTag(3, 4);
      } else {
        container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrPayload)}" alt="QR Code">`;
      }
    } catch (e) {
      container.innerHTML = `<div style="font-size:9px;color:#000;text-align:center;padding:4px;">VERIFIED<br><b>${state.delegateId}</b></div>`;
    }
  }

  // ==========================================================================
  // REAL-TIME PASS SYNCHRONIZATION
  // ==========================================================================
  function syncPass() {
    const nameEl = document.getElementById('regFullName');
    const passNameEl = document.getElementById('passDelegateName');
    const passProfileTag = document.getElementById('passProfileTag');
    const passInstVal = document.getElementById('passInstVal');
    const passRollVal = document.getElementById('passRollVal');
    const passContactVal = document.getElementById('passContactVal');
    const passArenasVal = document.getElementById('passArenasVal');
    const passIdDisplay = document.getElementById('passIdDisplay');
    const passAvatarImg = document.getElementById('passAvatarImg');

    if (passNameEl) {
      passNameEl.textContent = nameEl && nameEl.value.trim() ? nameEl.value.trim() : 'Cadet Delegate';
    }

    if (passProfileTag) {
      passProfileTag.textContent = state.profile === 'school' ? 'SCHOOL PIONEER' : 'COLLEGE TECHNOCRAT';
    }

    if (passIdDisplay) {
      passIdDisplay.textContent = state.delegateId;
    }

    if (passAvatarImg) {
      passAvatarImg.src = state.avatarUrl;
    }

    // Institution & Roll / Grade
    if (state.profile === 'school') {
      const schName = document.getElementById('regSchoolName')?.value || 'FIEM / Sonarpur Campus';
      const grade = document.getElementById('regGrade')?.value || 'Grade XI';
      const sec = document.getElementById('regSection')?.value || 'Sec A';
      if (passInstVal) passInstVal.textContent = schName;
      if (passRollVal) passRollVal.textContent = `${grade} (${sec})`;
    } else {
      const colName = document.getElementById('regCollegeName')?.value || 'Future Institute / Engg.';
      const dept = document.getElementById('regDepartment')?.value || 'CSE / Robotics';
      const roll = document.getElementById('regRollNumber')?.value || '2027-ENG-001';
      if (passInstVal) passInstVal.textContent = colName;
      if (passRollVal) passRollVal.textContent = `${dept} • ${roll}`;
    }

    // Contact
    const phone = document.getElementById('regPhone')?.value;
    if (passContactVal) {
      passContactVal.textContent = phone && phone.trim() ? phone.trim() : '+91 98765 43210';
    }

    // Selected Arenas Count
    const checkedArenas = document.querySelectorAll('input[name="enlistedEvents"]:checked');
    if (passArenasVal) {
      if (checkedArenas.length === 0) {
        passArenasVal.textContent = 'Delegate Pass Only';
      } else {
        const names = Array.from(checkedArenas).map(cb => cb.value);
        passArenasVal.textContent = `${checkedArenas.length} Arenas (${names[0]}${checkedArenas.length > 1 ? ' +' + (checkedArenas.length - 1) : ''})`;
      }
    }

    // Refresh QR code
    updatePassQRCode();
  }

  // ==========================================================================
  // MULTI-STEP WIZARD CONTROLLER
  // ==========================================================================
  function showStep(stepNum) {
    if (stepNum < 1 || stepNum > state.totalSteps) return;
    state.currentStep = stepNum;

    // Toggle step containers
    for (let i = 1; i <= state.totalSteps; i++) {
      const stepEl = document.getElementById(`formStep${i}`);
      const chipEl = document.getElementById(`stepChip${i}`);
      if (stepEl) {
        stepEl.style.display = i === stepNum ? 'block' : 'none';
      }
      if (chipEl) {
        chipEl.classList.toggle('active', i === stepNum);
        chipEl.classList.toggle('completed', i < stepNum);
      }
    }

    // Update progress pill
    const progressPill = document.getElementById('formProgressPill');
    if (progressPill) {
      const pct = Math.round(((stepNum - 1) / (state.totalSteps - 1)) * 100);
      progressPill.textContent = `${pct}% COMPLETE`;
    }

    // Scroll slightly if on mobile
    if (window.innerWidth < 768) {
      const regBox = document.getElementById('registrationBox');
      if (regBox) regBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    SoundFX.beep();
    syncPass();
  }

  // Validate step fields before proceeding
  function validateCurrentStep() {
    const currentContainer = document.getElementById(`formStep${state.currentStep}`);
    if (!currentContainer) return true;

    const requiredInputs = currentContainer.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalid = null;

    requiredInputs.forEach(input => {
      if (!input.value || !input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'var(--accent-red)';
        input.style.boxShadow = '0 0 10px rgba(255,42,77,0.4)';
        if (!firstInvalid) firstInvalid = input;
      } else {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }
    });

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
      alert('Please fill out the highlighted required cybertron telemetry fields.');
      return false;
    }
    return true;
  }

  // ==========================================================================
  // PROFILE SWITCHER (School Student vs College Delegate)
  // ==========================================================================
  function setProfile(profile) {
    state.profile = profile;
    const btnSchool = document.getElementById('btnProfileSchool');
    const btnCollege = document.getElementById('btnProfileCollege');
    const schoolFields = document.querySelectorAll('.profile-school-only');
    const collegeFields = document.querySelectorAll('.profile-college-only');
    const profileTag = document.getElementById('regBadgeTag');

    if (profile === 'school') {
      btnSchool?.classList.add('active');
      btnCollege?.classList.remove('active');
      schoolFields.forEach(el => (el.style.display = ''));
      collegeFields.forEach(el => (el.style.display = 'none'));
      if (profileTag) profileTag.textContent = 'SCHOOL STUDENT REGISTRATION';
    } else {
      btnSchool?.classList.remove('active');
      btnCollege?.classList.add('active');
      schoolFields.forEach(el => (el.style.display = 'none'));
      collegeFields.forEach(el => (el.style.display = ''));
      if (profileTag) profileTag.textContent = 'COLLEGE / UNIVERSITY REGISTRATION';
    }

    SoundFX.transform();
    syncPass();
  }

  // ==========================================================================
  // FACTION SWITCHER (Autobot vs Decepticon)
  // ==========================================================================
  function toggleFaction() {
    state.faction = state.faction === 'autobot' ? 'decepticon' : 'autobot';
    document.body.classList.toggle('theme-decepticon', state.faction === 'decepticon');

    const factionBtn = document.getElementById('factionToggleBtn');
    if (factionBtn) {
      factionBtn.innerHTML = state.faction === 'autobot'
        ? `<span class="pulse-dot"></span> AUTOBOT ALLIANCE`
        : `<span class="pulse-dot" style="background:#ff0055;box-shadow:0 0 8px #ff0055;"></span> DECEPTICON REIGN`;
    }

    state.delegateId = generateDelegateId(state.faction);
    SoundFX.transform();
    syncPass();
  }

  // ==========================================================================
  // VIDEO REEL CONTROLLER
  // ==========================================================================
  function setVideoFeed(index) {
    if (index < 0 || index >= videoFeeds.length) return;
    state.activeVideoIndex = index;
    const feed = videoFeeds[index];

    const player = document.getElementById('surveillancePlayer');
    const titleEl = document.getElementById('hudVideoTitle');
    const subEl = document.getElementById('hudVideoSub');
    const tagEl = document.getElementById('hudVideoTag');

    if (player) {
      player.src = feed.src;
      player.play().catch(() => {});
    }
    if (titleEl) titleEl.textContent = feed.title;
    if (subEl) subEl.textContent = feed.sub;
    if (tagEl) tagEl.textContent = feed.tag;

    // Update active tab styles
    document.querySelectorAll('.surveillance-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });

    SoundFX.click();
  }

  // ==========================================================================
  // AVATAR PICKER / SNAP PHOTO CONTROLLER
  // ==========================================================================
  function initAvatarControls() {
    // Presets
    document.querySelectorAll('.preset-avatar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.avatar;
        if (url) {
          state.avatarUrl = url;
          document.querySelectorAll('.preset-avatar-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          const preview = document.getElementById('avatarFormPreview');
          if (preview) preview.src = url;
          SoundFX.click();
          syncPass();
        }
      });
    });

    // Custom File Upload
    const fileInput = document.getElementById('avatarFileInput');
    const uploadBtn = document.getElementById('btnUploadCustomPhoto');
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = evt => {
            state.avatarUrl = evt.target.result;
            const preview = document.getElementById('avatarFormPreview');
            if (preview) preview.src = state.avatarUrl;
            SoundFX.beep();
            syncPass();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Snap Webcam Photo
    const snapBtn = document.getElementById('btnSnapWebcamPhoto');
    if (snapBtn) {
      snapBtn.addEventListener('click', async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const modal = document.getElementById('webcamModal');
          const video = document.getElementById('webcamVideo');
          if (modal && video) {
            video.srcObject = stream;
            modal.classList.add('open');
            SoundFX.beep();
          }
        } catch (err) {
          alert('Webcam sensor unavailable. You can upload an image file instead!');
        }
      });
    }

    const captureBtn = document.getElementById('btnCaptureFrame');
    const closeWebcamBtn = document.getElementById('btnCloseWebcam');
    if (captureBtn) {
      captureBtn.addEventListener('click', () => {
        const video = document.getElementById('webcamVideo');
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        const minDim = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - minDim) / 2;
        const startY = (video.videoHeight - minDim) / 2;
        ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 300, 300);

        state.avatarUrl = canvas.toDataURL('image/jpeg');
        const preview = document.getElementById('avatarFormPreview');
        if (preview) preview.src = state.avatarUrl;

        // Stop stream
        if (video.srcObject) {
          video.srcObject.getTracks().forEach(t => t.stop());
        }
        document.getElementById('webcamModal')?.classList.remove('open');
        SoundFX.success();
        syncPass();
      });
    }

    if (closeWebcamBtn) {
      closeWebcamBtn.addEventListener('click', () => {
        const video = document.getElementById('webcamVideo');
        if (video && video.srcObject) {
          video.srcObject.getTracks().forEach(t => t.stop());
        }
        document.getElementById('webcamModal')?.classList.remove('open');
      });
    }
  }

  // ==========================================================================
  // PASS FLIP & DOWNLOAD CONTROLLER
  // ==========================================================================
  function initPassActions() {
    const card = document.getElementById('holographicCard');
    const flipBtn = document.getElementById('passFlipBtn');

    function toggleFlip() {
      state.isFlipped = !state.isFlipped;
      card?.classList.toggle('flipped', state.isFlipped);
      SoundFX.click();
    }

    flipBtn?.addEventListener('click', toggleFlip);
    card?.addEventListener('click', e => {
      // Don't flip if user clicked directly on QR or buttons
      if (!e.target.closest('button') && !e.target.closest('a')) {
        toggleFlip();
      }
    });

    // Print Pass
    document.getElementById('btnPrintLanyardPass')?.addEventListener('click', () => {
      SoundFX.click();
      window.print();
    });

    // Download HD Pass via Canvas
    document.getElementById('btnDownloadHdPass')?.addEventListener('click', () => {
      SoundFX.click();
      downloadPassAsImage();
    });
  }

  function downloadPassAsImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 920;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 920);
    bgGrad.addColorStop(0, '#0a0e17');
    bgGrad.addColorStop(0.5, '#05070a');
    bgGrad.addColorStop(1, '#0e1522');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 920);

    // Glowing Border
    ctx.strokeStyle = state.faction === 'decepticon' ? '#bd34fe' : '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, 570, 890);

    // Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Orbitron", sans-serif';
    ctx.fillText("TECHPULSE 2027", 40, 65);

    ctx.fillStyle = state.faction === 'decepticon' ? '#bd34fe' : '#00f0ff';
    ctx.font = '14px "Chakra Petch", monospace';
    ctx.fillText("OFFICIAL DELEGATE PASS • SONARPUR", 40, 90);

    // Delegate Avatar
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.onload = () => {
      // Draw circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(300, 220, 90, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, 210, 130, 180, 180);
      ctx.restore();

      // Avatar Border
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(300, 220, 92, 0, Math.PI * 2);
      ctx.stroke();

      // Name & Profile
      const name = document.getElementById('passDelegateName')?.textContent || 'Cadet Delegate';
      const profile = document.getElementById('passProfileTag')?.textContent || 'DELEGATE';

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, 300, 360);

      ctx.fillStyle = '#ffb700';
      ctx.font = 'bold 16px "Chakra Petch", monospace';
      ctx.fillText(`[ ${profile} ]`, 300, 395);

      // Detail Rows
      ctx.textAlign = 'left';
      ctx.font = '14px "Chakra Petch", monospace';
      const inst = document.getElementById('passInstVal')?.textContent || 'Sonarpur Tech Campus';
      const roll = document.getElementById('passRollVal')?.textContent || '2027-ENG-001';
      const contact = document.getElementById('passContactVal')?.textContent || '+91 98765 43210';
      const arenas = document.getElementById('passArenasVal')?.textContent || 'Delegate Pass';

      ctx.fillStyle = '#8b9bb4';
      ctx.fillText("INSTITUTION:", 50, 460);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(inst.slice(0, 32), 190, 460);

      ctx.fillStyle = '#8b9bb4';
      ctx.fillText("IDENTIFIER:", 50, 500);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(roll, 190, 500);

      ctx.fillStyle = '#8b9bb4';
      ctx.fillText("COMM CHANNEL:", 50, 540);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 190, 540);

      ctx.fillStyle = '#8b9bb4';
      ctx.fillText("ARENA SLOTS:", 50, 580);
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(arenas.slice(0, 32), 190, 580);

      // Delegate ID Core
      ctx.fillStyle = '#ffb700';
      ctx.font = 'bold 22px "Orbitron", sans-serif';
      ctx.fillText(state.delegateId, 50, 660);
      ctx.fillStyle = '#8b9bb4';
      ctx.font = '12px "Chakra Petch", monospace';
      ctx.fillText("AUTHENTICATED BY 5 POINT EDUCATION & KRANTI FOUNDATION", 50, 685);

      // QR Code
      const qrImg = document.querySelector('#passQrCode img');
      if (qrImg && qrImg.complete) {
        ctx.drawImage(qrImg, 420, 610, 120, 120);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(420, 610, 120, 120);
      }

      // Trigger download
      const link = document.createElement('a');
      link.download = `${state.delegateId}-HOLOGRAPHIC-PASS.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    avatarImg.src = state.avatarUrl;
  }

  // ==========================================================================
  // DATA TRANSMISSION & GOOGLE APPS SCRIPT / EXCEL INTEGRATION
  // ==========================================================================
  async function submitRegistration(e) {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) return;

    const submitBtn = document.getElementById('btnSubmitRegistration');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `TRANSMITTING TO CYBERTRON...`;
    }

    // Collect all data
    const checkedEvents = Array.from(document.querySelectorAll('input[name="enlistedEvents"]:checked')).map(cb => cb.value);
    const checkedZones = Array.from(document.querySelectorAll('input[name="selectedZones"]:checked')).map(cb => cb.value);

    const record = {
      timestamp: new Date().toISOString(),
      delegateId: state.delegateId,
      profile: state.profile === 'school' ? 'School Student' : 'College / University',
      fullName: document.getElementById('regFullName')?.value || '',
      email: document.getElementById('regEmail')?.value || '',
      phone: document.getElementById('regPhone')?.value || '',
      gender: document.getElementById('regGender')?.value || '',
      dob: document.getElementById('regDob')?.value || '',
      // School Fields
      grade: state.profile === 'school' ? document.getElementById('regGrade')?.value || '' : '',
      section: state.profile === 'school' ? document.getElementById('regSection')?.value || '' : '',
      guardianName: state.profile === 'school' ? document.getElementById('regGuardianName')?.value || '' : '',
      guardianPhone: state.profile === 'school' ? document.getElementById('regGuardianPhone')?.value || '' : '',
      // College Fields
      department: state.profile === 'college' ? document.getElementById('regDepartment')?.value || '' : '',
      yearSem: state.profile === 'college' ? document.getElementById('regYearSem')?.value || '' : '',
      rollNumber: state.profile === 'college' ? document.getElementById('regRollNumber')?.value || '' : '',
      // Academic Institution
      institutionName: (state.profile === 'school' ? document.getElementById('regSchoolName')?.value : document.getElementById('regCollegeName')?.value) || '',
      city: document.getElementById('regCity')?.value || 'Kolkata',
      // Events & Perks
      events: checkedEvents.join(', '),
      zones: checkedZones.join(', '),
      foodPass: document.getElementById('regFoodPass')?.value || 'Yes',
      emergencyContact: document.getElementById('regEmergencyContact')?.value || ''
    };

    // 1. Store locally in state & localStorage
    state.registrations.push(record);
    localStorage.setItem('tp27_registrations', JSON.stringify(state.registrations));
    updateRegistryCount();

    // 2. Post to Google Apps Script Web App if URL is provided
    let appsScriptSuccess = false;
    if (state.appScriptUrl && state.appScriptUrl.trim()) {
      try {
        await fetch(state.appScriptUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Apps Script Web Apps to prevent CORS blockage
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        appsScriptSuccess = true;
      } catch (err) {
        console.warn('Apps Script transmission encountered a network issue, saved to local registry:', err);
      }
    }

    SoundFX.success();

    // 3. Display Success Confirmation Modal
    showSuccessModal(record, appsScriptSuccess);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `AUTHENTICATE & TRANSMIT DELEGATE ENROLLMENT ➜`;
    }
  }

  function showSuccessModal(record, appsScriptSuccess) {
    const modal = document.getElementById('successModal');
    const summaryEl = document.getElementById('successSummaryBox');

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="font-family:var(--font-tech);font-size:0.85rem;line-height:1.8;">
          <p><strong style="color:var(--primary)">PASS ENCRYPTED:</strong> ${record.delegateId}</p>
          <p><strong style="color:#fff">DELEGATE:</strong> ${record.fullName} (${record.profile})</p>
          <p><strong style="color:#fff">INSTITUTION:</strong> ${record.institutionName}</p>
          <p><strong style="color:#fff">EVENTS ENLISTED:</strong> ${record.events || 'Delegate Pass'}</p>
          <p style="margin-top:0.8rem;color:${appsScriptSuccess ? '#00f0ff' : '#ffb700'}">
            ${appsScriptSuccess ? '✓ Successfully synchronized to Google Sheet!' : '✓ Secured in Local Cybertron Registry (Ready for Excel export)'}
          </p>
        </div>
      `;
    }
    modal?.classList.add('open');
  }

  // ==========================================================================
  // EXPORT TO EXCEL / CSV
  // ==========================================================================
  function exportRegistryToCSV() {
    if (state.registrations.length === 0) {
      alert('Registry is currently empty! Fill out the enrollment form to create entries.');
      return;
    }

    const headers = [
      "Timestamp", "Delegate ID", "Profile", "Full Name", "Email", "Phone",
      "Gender", "DOB", "Grade", "Section", "Guardian Name", "Guardian Phone",
      "Department", "Year/Sem", "Roll Number", "Institution Name", "City",
      "Enlisted Events", "Selected Zones", "Food Pass", "Emergency Contact"
    ];

    const rows = state.registrations.map(r => [
      `"${r.timestamp}"`,
      `"${r.delegateId}"`,
      `"${r.profile}"`,
      `"${r.fullName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.gender}"`,
      `"${r.dob}"`,
      `"${r.grade}"`,
      `"${r.section}"`,
      `"${r.guardianName}"`,
      `"${r.guardianPhone}"`,
      `"${r.department}"`,
      `"${r.yearSem}"`,
      `"${r.rollNumber}"`,
      `"${r.institutionName}"`,
      `"${r.city}"`,
      `"${r.events}"`,
      `"${r.zones}"`,
      `"${r.foodPass}"`,
      `"${r.emergencyContact}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TECHPULSE_2027_DELEGATES_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    SoundFX.success();
  }

  function updateRegistryCount() {
    const el = document.getElementById('navRegistryCount');
    const badgeEl = document.getElementById('headerRegistryPill');
    const total = state.registrations.length;
    if (el) el.textContent = `REGISTRY (${total})`;
    if (badgeEl) badgeEl.textContent = `REGISTRY (${total})`;
    renderRegistryTable();
  }

  function renderRegistryTable() {
    const tbody = document.getElementById('registryTableBody');
    if (!tbody) return;

    if (state.registrations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--text-dim)">No delegates enrolled yet. Fill the registration form to populate the database!</td></tr>`;
      return;
    }

    tbody.innerHTML = state.registrations.slice().reverse().map(r => `
      <tr>
        <td><strong style="color:var(--primary)">${r.delegateId}</strong></td>
        <td>${r.fullName}</td>
        <td><span style="font-size:0.75rem;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.1)">${r.profile}</span></td>
        <td>${r.institutionName}</td>
        <td>${r.events || 'Pass'}</td>
        <td>${r.phone}</td>
      </tr>
    `).join('');
  }

  // ==========================================================================
  // INITIALIZATION ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader dismissal
    setTimeout(() => {
      document.getElementById('cyberLoader')?.classList.add('loaded');
      SoundFX.beep();
    }, 800);

    // 2. Initialize visual elements
    initCyberCanvas();
    initCountdown();
    initPassActions();
    initAvatarControls();
    updateRegistryCount();
    syncPass();

    // 3. Audio toggle
    const soundBtn = document.getElementById('soundToggleBtn');
    soundBtn?.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      document.querySelector('.sound-bars')?.classList.toggle('muted', !state.soundEnabled);
      if (state.soundEnabled) SoundFX.beep();
    });

    // 4. Faction toggle
    document.getElementById('factionToggleBtn')?.addEventListener('click', toggleFaction);

    // 5. Profile Switchers
    document.getElementById('btnProfileSchool')?.addEventListener('click', () => setProfile('school'));
    document.getElementById('btnProfileCollege')?.addEventListener('click', () => setProfile('college'));

    // 6. Stepper navigation
    for (let i = 1; i <= state.totalSteps; i++) {
      const chip = document.getElementById(`stepChip${i}`);
      chip?.addEventListener('click', () => {
        if (i < state.currentStep || validateCurrentStep()) {
          showStep(i);
        }
      });

      const nextBtn = document.getElementById(`btnNextStep${i}`);
      const prevBtn = document.getElementById(`btnPrevStep${i}`);

      nextBtn?.addEventListener('click', () => {
        if (validateCurrentStep()) showStep(i + 1);
      });
      prevBtn?.addEventListener('click', () => showStep(i - 1));
    }

    // 7. Real-time form listeners
    const form = document.getElementById('registrationForm');
    if (form) {
      form.addEventListener('input', syncPass);
      form.addEventListener('change', syncPass);
      form.addEventListener('submit', submitRegistration);
    }

    // 8. Event selection quick-add from Arenas Cards
    document.querySelectorAll('.arena-quick-enlist-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const eventName = btn.dataset.event;
        const cb = document.querySelector(`input[name="enlistedEvents"][value="${eventName}"]`);
        if (cb) {
          cb.checked = true;
          cb.closest('.event-check-card')?.classList.add('checked');
        }
        SoundFX.beep();
        syncPass();

        // Scroll to form
        document.getElementById('registrationSection')?.scrollIntoView({ behavior: 'smooth' });
        showStep(3); // Jump to events step
      });
    });

    // Checkbox cards styling
    document.querySelectorAll('.event-check-card input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('.event-check-card')?.classList.toggle('checked', cb.checked);
        SoundFX.click();
        syncPass();
      });
    });

    // 9. Video Surveillance Switcher
    document.querySelectorAll('.surveillance-tab').forEach((tab, index) => {
      tab.addEventListener('click', () => setVideoFeed(index));
    });

    // 10. Modals (Sheet Sync / Registry Modal)
    const sheetModal = document.getElementById('sheetSyncModal');
    const openSheetBtns = [document.getElementById('navSheetSyncBtn'), document.getElementById('heroSheetSyncBtn')];
    openSheetBtns.forEach(btn => btn?.addEventListener('click', () => {
      sheetModal?.classList.add('open');
      SoundFX.click();
    }));

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
        SoundFX.click();
      });
    });

    // Modal Tabs (Registry vs Setup Guide)
    document.getElementById('modalTabRegistry')?.addEventListener('click', () => {
      document.getElementById('modalTabRegistry').classList.add('active');
      document.getElementById('modalTabSetup').classList.remove('active');
      document.getElementById('modalViewRegistry').style.display = 'block';
      document.getElementById('modalViewSetup').style.display = 'none';
      SoundFX.click();
    });

    document.getElementById('modalTabSetup')?.addEventListener('click', () => {
      document.getElementById('modalTabRegistry').classList.remove('active');
      document.getElementById('modalTabSetup').classList.add('active');
      document.getElementById('modalViewRegistry').style.display = 'none';
      document.getElementById('modalViewSetup').style.display = 'block';
      SoundFX.click();
    });

    // Save Apps Script URL
    const appScriptInput = document.getElementById('appScriptUrlInput');
    if (appScriptInput) {
      appScriptInput.value = state.appScriptUrl;
      document.getElementById('btnSaveAppScriptUrl')?.addEventListener('click', () => {
        state.appScriptUrl = appScriptInput.value.trim();
        localStorage.setItem('tp27_appscript_url', state.appScriptUrl);
        alert('Google Apps Script Web App URL updated successfully!');
        SoundFX.beep();
      });
    }

    // Export Excel / CSV button
    document.getElementById('btnExportCsv')?.addEventListener('click', exportRegistryToCSV);
    document.getElementById('btnModalExportCsv')?.addEventListener('click', exportRegistryToCSV);

    // Copy Google Apps Script snippet
    document.getElementById('btnCopyAppScriptCode')?.addEventListener('click', () => {
      const code = document.getElementById('appsScriptCodeBlock')?.textContent;
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          alert('Google Apps Script code copied to clipboard! Paste it into Google Sheets Script Editor.');
        });
      }
    });

    // View Summary Receipt from Pass
    document.getElementById('btnViewSummaryReceipt')?.addEventListener('click', () => {
      const summaryModal = document.getElementById('successModal');
      const latest = state.registrations[state.registrations.length - 1];
      if (latest) {
        showSuccessModal(latest, !!state.appScriptUrl);
      } else {
        alert('Please complete registration first to view your verification receipt.');
      }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.cyber-nav');
      if (window.scrollY > 30) {
        nav?.classList.add('scrolled');
      } else {
        nav?.classList.remove('scrolled');
      }
    });
  });

})();
