document.addEventListener('DOMContentLoaded', () => {
  // --- Background Emoji Animation ---
  const emojiBg = document.getElementById('emojiBg');
  const themeEmojis = ['💀', '🔥', '💥', '👎', '☠️', '😡', '📠', '👎'];
  
  function createFloatingEmoji() {
    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji';
    emoji.innerText = themeEmojis[Math.floor(Math.random() * themeEmojis.length)];
    emoji.style.left = `${Math.random() * 100}vw`;
    // Random size
    const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
    emoji.style.fontSize = `${size}rem`;
    // Random animation duration
    const duration = Math.random() * 10 + 10; // 10s to 20s
    emoji.style.animationDuration = `${duration}s`;
    
    emojiBg.appendChild(emoji);
    
    // Remove emoji after animation completes
    setTimeout(() => {
      emoji.remove();
    }, duration * 1000);
  }
  
  // Initialize with some emojis and keep spawning
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

  // --- State Variables ---
  let selectedFile = null;
  let activeTab = 'upload'; // 'upload' or 'paste'
  let selectedToxicity = 'salty-founder'; // default

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

  // Drag and drop event listeners
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
    
    // Clear any previous typewriter interval
    if (typewriterInterval) clearInterval(typewriterInterval);
    
    typewriterInterval = setInterval(() => {
      if (index < text.length) {
        // Read character
        let char = text.charAt(index);
        element.innerHTML += char;
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

  // --- Roast CV Action ---
  roastBtn.addEventListener('click', async () => {
    // 1. Validation
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

    // 2. Setup Loading Animation UI
    inputCard.classList.add('hidden');
    loaderCard.classList.remove('hidden');
    progressBar.style.width = '0%';
    
    // Progress Bar simulation
    let progress = 0;
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 8;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
      }
    }, 200);

    // Loader Text cycle
    let msgIndex = 0;
    loaderText.innerText = loaderMessages[msgIndex];
    const textInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loaderMessages.length;
      loaderText.innerText = loaderMessages[msgIndex];
    }, 850);

    // 3. Make Server API call
    try {
      let response;
      if (activeTab === 'upload') {
        response = await fetch('/api/roast', {
          method: 'POST',
          body: formData
        });
      } else {
        // Send JSON
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

      // Finish progress bar
      clearInterval(progressInterval);
      clearInterval(textInterval);
      progressBar.style.width = '100%';

      // Smooth delay before showing results
      setTimeout(() => {
        showResults(data);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      alert(`Roast Failure: ${err.message}`);
      // Return to input screen
      loaderCard.classList.add('hidden');
      inputCard.classList.remove('hidden');
    }
  });

  // --- Display Results ---
  function showResults(data) {
    loaderCard.classList.add('hidden');
    resultsCard.classList.remove('hidden');
    
    // Clear previous details
    roastOutput.innerText = '';
    tipsList.innerHTML = '';
    scoreCard.classList.remove('shaker');

    // 1. Populate Score Badge
    const score = typeof data.score === 'number' ? data.score : parseInt(data.score) || 0;
    scoreDisplay.innerText = `${score}%`;
    scoreLabel.innerText = getScoreLabel(score);

    if (score < 20) {
      scoreCard.classList.add('shaker');
    }

    // 2. Stream Roast Text
    streamText(roastOutput, data.roast, 20, () => {
      // 3. Stream/Show Improvement Tips once typewriter is finished
      if (data.tips && Array.isArray(data.tips)) {
        data.tips.forEach((tip, index) => {
          setTimeout(() => {
            const li = document.createElement('li');
            li.innerText = tip;
            tipsList.appendChild(li);
          }, index * 300); // Cascading reveal of tips
        });
      }
    });
  }

  // --- Restart Screen ---
  restartBtn.addEventListener('click', () => {
    // Reset file state
    selectedFile = null;
    fileInput.value = '';
    fileNameDisplay.innerText = '';
    pasteInput.value = '';
    
    // Reset tabs
    activeTab = 'upload';
    toggleUpload.classList.add('active');
    togglePaste.classList.remove('active');
    uploadSection.classList.remove('hidden');
    pasteSection.classList.add('hidden');

    // Toggle views
    resultsCard.classList.add('hidden');
    inputCard.classList.remove('hidden');
  });
});
