document.addEventListener('DOMContentLoaded', () => {
  // --- Background Emoji Animation ---
  const emojiBg = document.getElementById('emojiBg');
  const themeEmojis = ['💀', '🔥', '💥', '👎', '☠️', '😡', '📠', '👎'];
  
  function createFloatingEmoji() {
    if (!emojiBg) return;
    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji';
    emoji.innerText = themeEmojis[Math.floor(Math.random() * themeEmojis.length)];
    emoji.style.left = `${Math.random() * 100}vw`;
    const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
    emoji.style.fontSize = `${size}rem`;
    const duration = Math.random() * 10 + 10; // 10s to 20s
    emoji.style.animationDuration = `${duration}s`;
    
    emojiBg.appendChild(emoji);
    
    setTimeout(() => {
      emoji.remove();
    }, duration * 1000);
  }
  
  for (let i = 0; i < 6; i++) {
    setTimeout(createFloatingEmoji, Math.random() * 5000);
  }
  setInterval(createFloatingEmoji, 3000);

  // --- Element Selectors ---
  const toggleUpload = document.getElementById('toggleUpload');
  const togglePaste = document.getElementById('togglePaste');
  const uploadSection = document.getElementById('uploadSection');
  const pasteSection = document.getElementById('pasteSection');
  
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const pasteInput = document.getElementById('pasteInput');
  
  const chaosCards = document.querySelectorAll('.chaos-card');
  const roastBtn = document.getElementById('roastBtn');
  
  const inputCard = document.getElementById('inputCard');
  const loaderCard = document.getElementById('loaderCard');
  const progressBar = document.getElementById('progressBar');
  const loaderText = document.getElementById('loaderText');
  
  const resultsCard = document.getElementById('resultsCard');
  const roastOutput = document.getElementById('roastOutput');
  const scoreCard = document.getElementById('scoreCard');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const scoreLabel = document.getElementById('scoreLabel');
  const tipsList = document.getElementById('tipsList');
  const restartBtn = document.getElementById('restartBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  // --- State Variables ---
  let selectedFile = null;
  let activeTab = 'upload'; // 'upload' or 'paste'
  let selectedToxicity = 'salty-founder'; // default
  let responseData = null; // store server response for canvas download

  // --- Recruiter Judge Profiles ---
  const JUDGE_PROFILES = {
    'passive-aggressive': {
      emoji: '🤫',
      name: 'PASSIVE-AGGRESSIVE RECRUITER',
      title: 'Corporate Director of Backhanded Compliments'
    },
    'salty-founder': {
      emoji: '😭',
      name: 'SALTY STARTUP FOUNDER',
      title: 'Chief Hustle Officer & Cold Coffee Addict'
    },
    'unchecked-chaos': {
      emoji: '💀',
      name: 'UNCHECKED CHAOS',
      title: 'Lead Dream Crusher & Existential Obliterator'
    }
  };

  // --- Web Audio Synthesizer (No External Files) ---
  let audioCtx = null;
  
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynth(type) {
    try {
      initAudio();
      if (!audioCtx) return;
      
      const now = audioCtx.currentTime;
      
      if (type === 'click') {
        // High frequency typewriter key click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } 
      else if (type === 'alarm') {
        // Harsh buzzer sound for bad scores
        const duration = 0.4;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(100, now);
        osc1.frequency.linearRampToValueAtTime(130, now + duration);
        
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(105, now);
        osc2.frequency.linearRampToValueAtTime(135, now + duration);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
      } 
      else if (type === 'splat') {
        // Tomato hit squish noise (frequency sweep + high-frequency filter burst)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
      } 
      else if (type === 'success') {
        // Ascending chime notes
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
          const time = now + idx * 0.08;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          
          gain.gain.setValueAtTime(0.06, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(time);
          osc.stop(time + 0.2);
        });
      }
    } catch(e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  }

  // White noise generator for loading sizzle sound
  let sizzleSource = null;
  function startSizzleSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      sizzleSource = audioCtx.createBufferSource();
      sizzleSource.buffer = buffer;
      sizzleSource.loop = true;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      
      sizzleSource.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      sizzleSource.start();
    } catch(e) {}
  }

  function stopSizzleSound() {
    if (sizzleSource) {
      try {
        sizzleSource.stop();
      } catch(e){}
      sizzleSource = null;
    }
  }

  // Trigger audio initialization on first user click
  document.body.addEventListener('click', initAudio, { once: true });

  // --- Tab Toggling ---
  toggleUpload.addEventListener('click', () => {
    activeTab = 'upload';
    toggleUpload.classList.add('active');
    togglePaste.classList.remove('active');
    uploadSection.classList.remove('hidden');
    pasteSection.classList.add('hidden');
  });

  togglePaste.addEventListener('click', () => {
    activeTab = 'paste';
    togglePaste.classList.add('active');
    toggleUpload.classList.remove('active');
    pasteSection.classList.remove('hidden');
    uploadSection.classList.add('hidden');
  });

  // --- Dropzone Logic ---
  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  function handleFile(file) {
    const allowedExtensions = /(\.txt|\.pdf|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert('Only .txt, .pdf, or .docx files are allowed!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit!');
      return;
    }
    selectedFile = file;
    fileNameDisplay.innerText = `Selected File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  }

  // --- Toxicity Selection ---
  chaosCards.forEach(card => {
    card.addEventListener('click', () => {
      chaosCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedToxicity = card.getAttribute('data-level');
    });
  });

  // --- Loader Cycle Messages ---
  const loaderMessages = [
    "[Scanning for font crimes...]",
    "[Measuring buzzword density...]",
    "[Evaluating inflated skillsets...]",
    "[Analyzing corporate jargon...]",
    "[Detecting imposter syndrome...]",
    "[Calculating disappointment of your parents...]",
    "[Checking if 'Motivated Self-Starter' means 'Unsupervised Chaos'...]",
    "[Reviewing formatting errors that make me weep...]",
    "[Converting dreams into coffee grounds...]",
    "[Calculating chance of AI replacing you (99.9%)...]"
  ];

  // --- Typewriter Streaming Effect ---
  let typewriterInterval = null;
  function streamText(element, text, speed = 25, callback = null) {
    element.innerHTML = '';
    let index = 0;
    
    if (typewriterInterval) clearInterval(typewriterInterval);
    
    typewriterInterval = setInterval(() => {
      if (index < text.length) {
        let char = text.charAt(index);
        element.innerHTML += char;
        
        // Play keyboard click sound every 3rd character to keep it pleasant
        if (index % 3 === 0) {
          playSynth('click');
        }
        
        index++;
      } else {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        if (callback) callback();
      }
    }, speed);
  }

  // --- Get Score Description Label ---
  function getScoreLabel(score) {
    if (score < 10) return "IMMEDIATELY DEPORT TO SILICON VALLEY SALVAGE YARD";
    if (score < 20) return "ABSOLUTELY HOPELESS / CHANCE OF HIRE: 0.0%";
    if (score < 35) return "COFFEE RUN ASSISTANT (UNPAID)";
    if (score < 50) return "AVERAGE CUBICLE DRONE / BORDERLINE REJECT";
    if (score < 70) return "SUSPICIOUSLY COMPETENT BUT ANNOYING";
    return "PROBABLY WRITTEN BY CHATGPT";
  }

  // --- Cost Ticker Logic ---
  let costTickerInterval = null;
  let currentAccumulatedLoss = 0.0;
  
  function startCostTicker() {
    const salaryInput = document.getElementById('expectedSalaryInput');
    const lossTicker = document.getElementById('lossTicker');
    
    if (costTickerInterval) clearInterval(costTickerInterval);
    currentAccumulatedLoss = 0.0;
    
    // Yearly expected working hours = 2000 hours
    // Loss per millisecond = salary / 2000 hours / 3600 seconds / 1000 ms
    const updateRateMs = 43; // run ticker update every 43ms
    
    costTickerInterval = setInterval(() => {
      const salary = parseFloat(salaryInput.value) || 80000;
      const lossPerMs = salary / 2000 / 3600 / 1000;
      currentAccumulatedLoss += lossPerMs * updateRateMs;
      lossTicker.innerText = `$${currentAccumulatedLoss.toFixed(4)}`;
    }, updateRateMs);
  }

  function stopCostTicker() {
    if (costTickerInterval) {
      clearInterval(costTickerInterval);
      costTickerInterval = null;
    }
  }

  // Reset ticker if user changes the salary input field
  document.getElementById('expectedSalaryInput').addEventListener('input', () => {
    currentAccumulatedLoss = 0.0;
  });

  // --- Tomato Splat Game Logic ---
  let gameInterval = null;
  const gameWords = [];
  const defaultBuzzwords = ["synergy", "dynamic", "motivated", "detail-oriented", "spearheaded", "results-driven", "team-player", "ninja", "rockstar", "expert", "managed", "responsible for"];

  function initBuzzwordGame(resumeText, rewrites) {
    const arena = document.getElementById('buzzwordArena');
    arena.innerHTML = '';
    
    const foundBuzzwords = [];
    const textLower = resumeText.toLowerCase();
    
    // Grab buzzwords present in user text
    defaultBuzzwords.forEach(word => {
      if (textLower.includes(word)) {
        foundBuzzwords.push(word.toUpperCase());
      }
    });
    
    // Supplement from rewrites
    if (rewrites && rewrites.length > 0) {
      rewrites.forEach(rw => {
        const words = rw.before.split(/\s+/).filter(w => w.length > 5 && w.length < 15);
        if (words.length > 0) {
          foundBuzzwords.push(words[Math.floor(Math.random() * words.length)].replace(/[^a-zA-Z]/g, "").toUpperCase());
        }
      });
    }
    
    // Fallback fill to keep the arena populated
    while (foundBuzzwords.length < 7) {
      const randWord = defaultBuzzwords[Math.floor(Math.random() * defaultBuzzwords.length)].toUpperCase();
      if (!foundBuzzwords.includes(randWord)) {
        foundBuzzwords.push(randWord);
      }
    }
    
    gameWords.length = 0;
    const arenaWidth = arena.offsetWidth || 500;
    const arenaHeight = arena.offsetHeight || 220;
    
    foundBuzzwords.forEach(wordText => {
      const div = document.createElement('div');
      div.className = 'floating-buzzword';
      div.innerText = wordText;
      arena.appendChild(div);
      
      const w = div.offsetWidth || (wordText.length * 8 + 20);
      const h = div.offsetHeight || 30;
      
      // Random positions inside arena
      const x = Math.random() * (arenaWidth - w - 20) + 10;
      const y = Math.random() * (arenaHeight - h - 20) + 10;
      
      const entity = {
        element: div,
        x: x,
        y: y,
        w: w,
        h: h,
        dx: (Math.random() * 1.5 + 0.6) * (Math.random() < 0.5 ? 1 : -1),
        dy: (Math.random() * 1.5 + 0.6) * (Math.random() < 0.5 ? 1 : -1),
        hit: false
      };
      
      div.style.left = `${entity.x}px`;
      div.style.top = `${entity.y}px`;
      
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        if (entity.hit) return;
        
        entity.hit = true;
        div.classList.add('hit');
        playSynth('splat');
        
        const rect = arena.getBoundingClientRect();
        const clickX = e.clientX - rect.left - 15;
        const clickY = e.clientY - rect.top - 15;
        
        const splat = document.createElement('div');
        splat.className = 'splat-tomato';
        splat.innerText = '🍅';
        splat.style.left = `${clickX}px`;
        splat.style.top = `${clickY}px`;
        arena.appendChild(splat);
        
        setTimeout(() => splat.remove(), 400);
      });
      
      gameWords.push(entity);
    });

    // Splat tomato on missed blank arena hits too
    arena.addEventListener('click', (e) => {
      if (e.target !== arena) return;
      playSynth('splat');
      const rect = arena.getBoundingClientRect();
      const clickX = e.clientX - rect.left - 15;
      const clickY = e.clientY - rect.top - 15;
      
      const splat = document.createElement('div');
      splat.className = 'splat-tomato';
      splat.innerText = '🍅';
      splat.style.left = `${clickX}px`;
      splat.style.top = `${clickY}px`;
      arena.appendChild(splat);
      
      setTimeout(() => splat.remove(), 400);
    });

    // Game loop (physics update)
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      const curWidth = arena.offsetWidth || 500;
      const curHeight = arena.offsetHeight || 220;
      
      gameWords.forEach(entity => {
        entity.x += entity.dx;
        entity.y += entity.dy;
        
        // Bounce off left/right
        if (entity.x <= 0) {
          entity.x = 0;
          entity.dx *= -1;
        } else if (entity.x + entity.w >= curWidth) {
          entity.x = curWidth - entity.w;
          entity.dx *= -1;
        }
        
        // Bounce off top/bottom
        if (entity.y <= 0) {
          entity.y = 0;
          entity.dy *= -1;
        } else if (entity.y + entity.h >= curHeight) {
          entity.y = curHeight - entity.h;
          entity.dy *= -1;
        }
        
        entity.element.style.left = `${entity.x}px`;
        entity.element.style.top = `${entity.y}px`;
      });
    }, 16);
  }

  function stopBuzzwordGame() {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
  }

  // --- Canvas Report Card Generator ---
  function triggerReportCardDownload(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 620;
    const ctx = canvas.getContext('2d');
    
    // Draw Ivory Background
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw Thick Black Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    
    // Header block
    ctx.fillStyle = '#FF6B6B'; // Toxic Coral
    ctx.fillRect(30, 30, 740, 80);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 740, 80);
    
    ctx.fillStyle = '#000000';
    ctx.font = '800 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NO MERCY CV - ROAST REPORT CARD', 400, 70);
    
    // Score panel
    ctx.fillStyle = '#FFDE4D'; // Yellow
    ctx.fillRect(30, 140, 240, 180);
    ctx.strokeRect(30, 140, 240, 180);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('HIREABILITY RATING', 150, 175);
    
    const score = typeof data.score === 'number' ? data.score : parseInt(data.score) || 0;
    ctx.font = '800 68px sans-serif';
    ctx.fillText(`${score}%`, 150, 230);
    
    ctx.font = 'bold 10px monospace';
    let label = getScoreLabel(score);
    if (label.length > 34) label = label.substring(0, 32) + '...';
    ctx.fillText(label, 150, 290);
    
    // Judge panel
    ctx.fillStyle = '#00F0FF'; // Cyan
    ctx.fillRect(30, 350, 240, 220);
    ctx.strokeRect(30, 350, 240, 220);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('CRITIQUE BY', 150, 380);
    
    const judge = JUDGE_PROFILES[selectedToxicity] || JUDGE_PROFILES['salty-founder'];
    ctx.font = '64px sans-serif';
    ctx.fillText(judge.emoji, 150, 440);
    
    ctx.font = 'bold 11px monospace';
    ctx.fillText(judge.name, 150, 500);
    ctx.font = '9px monospace';
    ctx.fillText(judge.title, 150, 520);
    
    // Roast panel
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(300, 140, 470, 430);
    ctx.strokeRect(300, 140, 470, 430);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(300, 140, 470, 40);
    ctx.strokeRect(300, 140, 470, 40);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CRITIQUE SUMMARY', 320, 160);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px monospace';
    
    // Word wrap
    const words = data.roast.split(' ');
    let line = '';
    let x = 320;
    let y = 215;
    const maxWidth = 430;
    const lineHeight = 20;
    
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    
    // Footer watermark
    ctx.fillStyle = '#888888';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Hosted locally at http://localhost:5000', 535, 545);
    
    // Save image
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `no-mercy-roast-${score}pct.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Attach canvas download click
  downloadBtn.addEventListener('click', () => {
    if (responseData) {
      triggerReportCardDownload(responseData);
    }
  });

  // --- Roast CV Action ---
  roastBtn.addEventListener('click', async () => {
    let hasInput = false;
    const formData = new FormData();
    formData.append('toxicity', selectedToxicity);

    if (activeTab === 'upload') {
      if (!selectedFile) {
        alert('Please drop or select a CV file first, or paste text in the other tab.');
        return;
      }
      formData.append('resumeFile', selectedFile);
      hasInput = true;
    } else {
      const text = pasteInput.value.trim();
      if (!text) {
        alert('Please paste some resume text first, or upload a file.');
        return;
      }
      formData.append('resumeText', text);
      hasInput = true;
    }

    if (!hasInput) return;

    // Trigger Audio init and start Loader Sizzle
    initAudio();
    startSizzleSound();

    // Transition views
    inputCard.classList.add('hidden');
    loaderCard.classList.remove('hidden');
    progressBar.style.width = '0%';
    
    let progress = 0;
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 8;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
      }
    }, 200);

    let msgIndex = 0;
    loaderText.innerText = loaderMessages[msgIndex];
    const textInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loaderMessages.length;
      loaderText.innerText = loaderMessages[msgIndex];
    }, 850);

    try {
      let response;
      if (activeTab === 'upload') {
        response = await fetch('/api/roast', {
          method: 'POST',
          body: formData
        });
      } else {
        const text = pasteInput.value.trim();
        response = await fetch('/api/roast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resumeText: text,
            toxicity: selectedToxicity
          })
        });
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Server error');
      }

      responseData = data; // store response

      clearInterval(progressInterval);
      clearInterval(textInterval);
      progressBar.style.width = '100%';
      stopSizzleSound();

      setTimeout(() => {
        showResults(data);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      stopSizzleSound();
      alert(`Roast Failure: ${err.message}`);
      
      loaderCard.classList.add('hidden');
      inputCard.classList.remove('hidden');
    }
  });

  // --- Display Results ---
  function showResults(data) {
    loaderCard.classList.add('hidden');
    resultsCard.classList.remove('hidden');
    
    // Reset cards visibility
    document.getElementById('tipsCard').classList.add('hidden');
    document.getElementById('rewritesCard').classList.add('hidden');
    document.getElementById('gameCard').classList.add('hidden');
    document.getElementById('calculatorCard').classList.add('hidden');
    
    roastOutput.innerText = '';
    tipsList.innerHTML = '';
    scoreCard.classList.remove('shaker');

    // Populate score details
    const score = typeof data.score === 'number' ? data.score : parseInt(data.score) || 0;
    scoreDisplay.innerText = `${score}%`;
    scoreLabel.innerText = getScoreLabel(score);

    // Populate judge header details
    const judgeProfile = JUDGE_PROFILES[selectedToxicity] || JUDGE_PROFILES['salty-founder'];
    document.getElementById('judgeAvatar').innerText = judgeProfile.emoji;
    document.getElementById('judgeName').innerText = judgeProfile.name;
    document.getElementById('judgeTitle').innerText = judgeProfile.title;

    // Stream Roast Text only in the critique box
    streamText(roastOutput, data.roast, 20, () => {
      // Once typewriter finishes, play buzzer or chimes
      if (score < 20) {
        playSynth('alarm');
        scoreCard.classList.add('shaker');
        setTimeout(() => playSynth('alarm'), 500); // double alarm for dramatic impact
      } else {
        playSynth('success');
      }

      // 1. Render tips and show card
      if (data.tips && Array.isArray(data.tips)) {
        data.tips.forEach((tip, index) => {
          setTimeout(() => {
            const li = document.createElement('li');
            li.innerText = tip;
            tipsList.appendChild(li);
          }, index * 250);
        });
      }
      document.getElementById('tipsCard').classList.remove('hidden');

      // 2. Render Before/After comparative rewrites and show card
      const rewritesContainer = document.getElementById('rewritesContainer');
      rewritesContainer.innerHTML = '';
      if (data.rewrites && Array.isArray(data.rewrites)) {
        data.rewrites.forEach(rw => {
          const item = document.createElement('div');
          item.className = 'rewrite-item';
          item.innerHTML = `
            <div class="rewrite-box before">
              <div class="rewrite-label">BEFORE</div>
              <div class="rewrite-text">"${rw.before}"</div>
            </div>
            <div class="rewrite-box after">
              <div class="rewrite-label">AFTER</div>
              <div class="rewrite-text">"${rw.after}"</div>
            </div>
            <div class="rewrite-box explanation">
              <div class="rewrite-label">EXPLANATION</div>
              <div class="rewrite-text">${rw.explanation}</div>
            </div>
          `;
          rewritesContainer.appendChild(item);
        });
      }
      document.getElementById('rewritesCard').classList.remove('hidden');

      // 3. Setup Buzzword Eliminator game and show card
      document.getElementById('gameCard').classList.remove('hidden');
      const textToExtractFrom = data.roast + " " + (activeTab === 'paste' ? pasteInput.value : selectedFile.name);
      initBuzzwordGame(textToExtractFrom, data.rewrites);

      // 4. Setup Salary Cost Calculator and show card
      document.getElementById('calculatorCard').classList.remove('hidden');
      startCostTicker();
    });
  }

  // --- Restart Screen ---
  restartBtn.addEventListener('click', () => {
    // Stop loops and games
    stopCostTicker();
    stopBuzzwordGame();
    stopSizzleSound();

    // Reset file states
    selectedFile = null;
    fileInput.value = '';
    fileNameDisplay.innerText = '';
    pasteInput.value = '';
    responseData = null;
    
    activeTab = 'upload';
    toggleUpload.classList.add('active');
    togglePaste.classList.remove('active');
    uploadSection.classList.remove('hidden');
    pasteSection.classList.add('hidden');

    resultsCard.classList.add('hidden');
    inputCard.classList.remove('hidden');
  });
});
