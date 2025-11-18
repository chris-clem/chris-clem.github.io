// Terminal configuration
const term = new Terminal({
  cursorBlink: true,
  fontFamily: '"Cascadia Code", Menlo, monospace',
  fontSize: 14,
  theme: {
    background: '#0c0c0c',
    foreground: '#cccccc',
    cursor: '#00ff00',
    cursorAccent: '#000000',
    selection: '#ffffff40',
    black: '#0c0c0c',
    red: '#c50f1f',
    green: '#13a10e',
    yellow: '#c19c00',
    blue: '#0037da',
    magenta: '#881798',
    cyan: '#3a96dd',
    white: '#cccccc',
    brightBlack: '#767676',
    brightRed: '#e74856',
    brightGreen: '#16c60c',
    brightYellow: '#f9f1a5',
    brightBlue: '#3b78ff',
    brightMagenta: '#b4009e',
    brightCyan: '#61d6d6',
    brightWhite: '#f2f2f2'
  }
});

const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.loadAddon(new WebLinksAddon.WebLinksAddon());

term.open(document.getElementById('terminal'));
fitAddon.fit();

// Terminal state
let currentLine = '';
let commandHistory = [];
let historyIndex = -1;
const prompt = '\x1b[32mguest\x1b[0m:\x1b[34m~\x1b[0m$ ';

// ASCII Art banner
const banner = `
\x1b[36m
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   ██████╗██╗  ██╗██████╗ ██╗███████╗████████╗ ██████╗ ██████╗ ██╗  ██╗  ║
║  ██╔════╝██║  ██║██╔══██╗██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██║  ██║  ║
║  ██║     ███████║██████╔╝██║███████╗   ██║   ██║   ██║██████╔╝███████║  ║
║  ██║     ██╔══██║██╔══██╗██║╚════██║   ██║   ██║   ██║██╔═══╝ ██╔══██║  ║
║  ╚██████╗██║  ██║██║  ██║██║███████║   ██║   ╚██████╔╝██║     ██║  ██║  ║
║   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝  ╚═╝  ║
║                                                                           ║
║              ██████╗██╗     ███████╗███╗   ███╗███████╗███╗   ██╗████████╗║
║             ██╔════╝██║     ██╔════╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝║
║             ██║     ██║     █████╗  ██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ║
║             ██║     ██║     ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ║
║             ╚██████╗███████╗███████╗██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ║
║              ╚═════╝╚══════╝╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
\x1b[0m

\x1b[33mWelcome to Christoph's interactive terminal!\x1b[0m
\x1b[90mType '\x1b[37mhelp\x1b[90m' to see available commands or '\x1b[37mclear\x1b[90m' to clear the screen.\x1b[0m

`;

// Command definitions
const commands = {
  help: {
    description: 'Show available commands',
    execute: () => {
      return `
\x1b[1mAvailable Commands:\x1b[0m
  \x1b[32mhelp\x1b[0m                 List all commands (you're looking at it)
  \x1b[32mabout\x1b[0m                Learn about Christoph
  \x1b[32mwhoami\x1b[0m               Short introduction
  \x1b[32mwork\x1b[0m                 Current work and research
  \x1b[32meducation\x1b[0m            Educational background
  \x1b[32mresearch\x1b[0m             Research interests and publications
  \x1b[32mskills\x1b[0m               Technical skills and expertise
  \x1b[32mprojects\x1b[0m             View projects and portfolio
  \x1b[32mblog\x1b[0m                 Read blog posts
  \x1b[32mcontact\x1b[0m              Get contact information
  \x1b[32msocial\x1b[0m               Social media links
  \x1b[32mcv\x1b[0m                   View CV/Resume
  \x1b[32mfun\x1b[0m                  Something fun!
  \x1b[32mmatrix\x1b[0m               Enter the Matrix...
  \x1b[32mclear\x1b[0m                Clear the terminal
  \x1b[32mexit\x1b[0m                 Leave terminal mode

\x1b[90mTip: Try tab completion or use arrow keys for command history!\x1b[0m
`;
    }
  },

  about: {
    description: 'Learn about Christoph',
    execute: () => {
      return `
\x1b[1m\x1b[36m🧬 About Christoph Clement\x1b[0m

I'm a Machine Learning Engineer at \x1b[33mKhumbu\x1b[0m, where I leverage cutting-edge
AI models for drug discovery with an initial focus on diabetes.

I recently completed my PhD in \x1b[35mBiomedical Engineering\x1b[0m at the University
of Bern, complemented by research on PET foundation models at Harvard
Medical School.

\x1b[32mResearch Focus:\x1b[0m
  • Deep Learning for Medical Imaging
  • PET/CT Image Analysis
  • Neurodegenerative Disease Detection
  • AI-Driven Drug Discovery
  • Organ-on-Chip Imaging

\x1b[36mVisiting Researcher:\x1b[0m
  Center for Advanced Medical Computing and Analysis (CAMCA)
  Harvard Medical School

Type '\x1b[37mwork\x1b[0m' to learn more about my current work.
Type '\x1b[37mresearch\x1b[0m' to explore my research interests.
`;
    }
  },

  whoami: {
    description: 'Short introduction',
    execute: () => {
      return `
\x1b[36mChristoph Clement\x1b[0m
\x1b[90m├─\x1b[0m Role: Machine Learning Engineer @ Khumbu
\x1b[90m├─\x1b[0m Location: Munich, Germany
\x1b[90m├─\x1b[0m Education: PhD in Biomedical Engineering
\x1b[90m└─\x1b[0m Passion: AI for Healthcare & Drug Discovery

Type '\x1b[37mabout\x1b[0m' for more details.
`;
    }
  },

  work: {
    description: 'Current work and research',
    execute: () => {
      return `
\x1b[1m\x1b[33m💊 Current Work\x1b[0m

\x1b[32mKhumbu AI\x1b[0m - Machine Learning Engineer
\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
Leveraging cutting-edge AI models for drug discovery with an initial
focus on diabetes. Building and deploying ML pipelines for:
  • Molecular property prediction
  • Drug-target interaction modeling
  • Generative models for molecule design
  • Large-scale data processing

\x1b[35mHarvard Medical School\x1b[0m - Visiting Researcher
\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
Center for Advanced Medical Computing and Analysis (CAMCA)
  • Developing foundation models for PET/CT imaging
  • Working under supervision of Dr. Quanzheng Li
  • Advancing medical image analysis techniques

\x1b[36m🌐 Website:\x1b[0m https://www.khumbu.ai/
`;
    }
  },

  education: {
    description: 'Educational background',
    execute: () => {
      return `
\x1b[1m\x1b[36m🎓 Education\x1b[0m

\x1b[32mPhD in Biomedical Engineering\x1b[0m
University of Bern, Switzerland
\x1b[90m├─\x1b[0m Research: PET foundation models
\x1b[90m├─\x1b[0m Focus: Deep learning for medical imaging
\x1b[90m└─\x1b[0m Collaboration: Harvard Medical School

\x1b[32mM.Sc. Robotics, Cognition, and Intelligence\x1b[0m
Technical University of Munich (TUM), Germany
\x1b[90m├─\x1b[0m Specialization: Computer-Aided Medical Procedures
\x1b[90m├─\x1b[0m Focus: Computer Vision & Deep Learning
\x1b[90m└─\x1b[0m Thesis: Medical image analysis

\x1b[32mHonors Degree in Technology Management\x1b[0m
Center for Digital Technology and Management (CDTM)
\x1b[90m└─\x1b[0m Combining technical expertise with entrepreneurship

\x1b[36m📚 Additional Training:\x1b[0m
  • Computer Vision
  • Medical Image Processing
  • Deep Learning & Neural Networks
  • Entrepreneurship & Innovation
`;
    }
  },

  research: {
    description: 'Research interests and publications',
    execute: () => {
      return `
\x1b[1m\x1b[35m🔬 Research Interests\x1b[0m

\x1b[32mCore Areas:\x1b[0m
  🧠 Medical Imaging Analysis
     └─ PET/CT image segmentation and interpretation
  🏥 Neurodegenerative Disease Detection
     └─ Tau-PET brain scan analysis
  🔬 AI Drug Discovery
     └─ ML models for molecular property prediction
  📸 High-Resolution Organ-on-Chip Imaging
     └─ Novel imaging approaches for micro-physiological systems
  🤖 Foundation Models for Medical Imaging
     └─ Large-scale pre-training for PET imaging

\x1b[36mKey Projects:\x1b[0m
  • CT-free total-body PET segmentation
  • Tau-PET interpretation for Alzheimer's disease
  • Deepfake detection (TUM Visual Computing Group)
  • Foundation models for PET/CT (Harvard)

\x1b[33m📄 Publications:\x1b[0m Visit my website to see selected papers
   → Type '\x1b[37mcv\x1b[0m' to view full academic CV
   → Type '\x1b[37mprojects\x1b[0m' to see project portfolio
`;
    }
  },

  skills: {
    description: 'Technical skills and expertise',
    execute: () => {
      return `
\x1b[1m\x1b[36m💻 Technical Skills\x1b[0m

\x1b[32mMachine Learning & AI:\x1b[0m
  ████████████████████  PyTorch, TensorFlow
  ██████████████████    Deep Learning & CNNs
  ████████████████████  Medical Image Analysis
  ██████████████████    Foundation Models
  ████████████████      Drug Discovery ML

\x1b[32mProgramming:\x1b[0m
  ████████████████████  Python
  ██████████████        C++
  ████████████          CUDA
  ██████████            JavaScript

\x1b[32mMedical Imaging:\x1b[0m
  ████████████████████  PET/CT Analysis
  ██████████████████    Image Segmentation
  ████████████████      3D Reconstruction
  ████████████          Multi-modal Imaging

\x1b[32mTools & Frameworks:\x1b[0m
  • Docker, Kubernetes
  • Git, CI/CD
  • AWS, GCP
  • Jupyter, MLflow
  • MONAI, SimpleITK

\x1b[33m🎯 Domain Expertise:\x1b[0m
  Medical Imaging • Deep Learning • Computer Vision • Drug Discovery
  Biomedical Engineering • Data Science • Research

Type '\x1b[37mprojects\x1b[0m' to see these skills in action!
`;
    }
  },

  projects: {
    description: 'View projects and portfolio',
    execute: () => {
      return `
\x1b[1m\x1b[33m🚀 Projects\x1b[0m

To view my full project portfolio, visit:
  \x1b[36mhttps://chris-clem.github.io/projects/\x1b[0m

\x1b[32mFeatured Work:\x1b[0m
  🔬 AI Drug Discovery Platform (Khumbu)
  🧠 PET Foundation Models (Harvard Medical School)
  📊 Tau-PET Analysis for Alzheimer's (University of Bern)
  🎭 Deepfake Detection System (TUM)
  🔬 Organ-on-Chip Imaging Pipeline

\x1b[90mOpening in browser...\x1b[0m
`;
    }
  },

  blog: {
    description: 'Read blog posts',
    execute: () => {
      window.open('https://chris-clem.github.io/blog/', '_blank');
      return `
\x1b[1m\x1b[36m📝 Blog\x1b[0m

Visit my blog for insights on:
  • Machine Learning
  • Medical Imaging
  • AI Drug Discovery
  • Research Updates

  \x1b[36mhttps://chris-clem.github.io/blog/\x1b[0m

\x1b[90mOpening in new tab...\x1b[0m
`;
    }
  },

  contact: {
    description: 'Get contact information',
    execute: () => {
      return `
\x1b[1m\x1b[32m📧 Contact Information\x1b[0m

Feel free to reach out via email or LinkedIn!

\x1b[36m📍 Location:\x1b[0m Munich, Bavaria, Germany
\x1b[36m💼 Company:\x1b[0m Khumbu AI
\x1b[36m🌐 Website:\x1b[0m https://chris-clem.github.io/

\x1b[33mFor collaboration inquiries, research questions, or just to say hi,
don't hesitate to get in touch!\x1b[0m

Type '\x1b[37msocial\x1b[0m' to see my social media profiles.
`;
    }
  },

  social: {
    description: 'Social media links',
    execute: () => {
      return `
\x1b[1m\x1b[36m🔗 Social Media\x1b[0m

Connect with me on:
  \x1b[34m→\x1b[0m LinkedIn: \x1b[4mhttps://linkedin.com/in/christoph-clement\x1b[0m
  \x1b[34m→\x1b[0m GitHub: \x1b[4mhttps://github.com/chris-clem\x1b[0m
  \x1b[34m→\x1b[0m Twitter/X: @christophclem (if available)
  \x1b[34m→\x1b[0m Google Scholar: Research publications

\x1b[90mNote: Update these links with your actual social profiles!\x1b[0m
`;
    }
  },

  cv: {
    description: 'View CV/Resume',
    execute: () => {
      window.open('https://chris-clem.github.io/cv/', '_blank');
      return `
\x1b[1m\x1b[33m📄 Curriculum Vitae\x1b[0m

Opening CV in new tab...
  \x1b[36mhttps://chris-clem.github.io/cv/\x1b[0m

\x1b[32mHighlights:\x1b[0m
  • PhD in Biomedical Engineering
  • M.Sc. Robotics, Cognition, and Intelligence (TUM)
  • Honors Degree in Technology Management (CDTM)
  • ML Engineer at Khumbu
  • Visiting Researcher at Harvard Medical School
  • Experience in medical imaging, drug discovery, and deep learning
`;
    }
  },

  fun: {
    description: 'Something fun!',
    execute: () => {
      const facts = [
        "🎯 Did you know? The human brain has about 86 billion neurons, and I'm trying to model them!",
        "🔬 Fun fact: AI can now predict protein structures with near-atomic accuracy!",
        "🧬 Random science: There are more possible games of chess than atoms in the observable universe!",
        "🤖 Plot twist: This terminal is actually running in your browser, not a real shell!",
        "💊 Drug discovery fact: It typically takes 10+ years and $2.6B to develop a new drug. AI can help speed this up!",
        "🧠 Brain teaser: Your brain uses about 20% of your body's energy despite being only 2% of your body weight!",
        "🖥️ Tech history: The first computer bug was an actual moth found in a Harvard computer in 1947!",
        "🎭 AI milestone: Deepfakes are so advanced now that detecting them is an arms race!"
      ];
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      return `
\x1b[1m\x1b[35m✨ Fun Mode Activated!\x1b[0m

${randomFact}

\x1b[90mType '\x1b[37mfun\x1b[90m' again for another fact, or '\x1b[37mmatrix\x1b[90m' for something different...\x1b[0m
`;
    }
  },

  matrix: {
    description: 'Enter the Matrix',
    execute: () => {
      const matrixChars = ['0', '1', 'ﾊ', 'ﾐ', 'ﾋ', 'ｰ', 'ｳ', 'ｼ', 'ﾅ', 'ﾓ', 'ﾆ', 'ｻ', 'ﾜ'];
      let output = '\n\x1b[32m';
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 60; j++) {
          output += matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        output += '\n';
      }
      output += '\x1b[0m\n\x1b[1mWake up, Neo...\x1b[0m\n\x1b[90mThe terminal has you...\x1b[0m\n';
      return output;
    }
  },

  clear: {
    description: 'Clear the terminal',
    execute: () => {
      term.clear();
      return '';
    }
  },

  exit: {
    description: 'Leave terminal mode',
    execute: () => {
      window.location.href = 'https://chris-clem.github.io/about/';
      return '\x1b[33mExiting terminal mode...\x1b[0m\nRedirecting to standard website...';
    }
  },

  ls: {
    description: 'List files (Easter egg)',
    execute: () => {
      return `
\x1b[36mabout.txt\x1b[0m      \x1b[36meducation.txt\x1b[0m   \x1b[36mresearch.txt\x1b[0m
\x1b[36mwork.txt\x1b[0m       \x1b[36mprojects.txt\x1b[0m    \x1b[36mcv.pdf\x1b[0m
\x1b[36mskills.txt\x1b[0m     \x1b[36mcontact.txt\x1b[0m     \x1b[32msecret.sh\x1b[0m

\x1b[90mHint: These aren't real files, try the actual commands instead!\x1b[0m
`;
    }
  },

  pwd: {
    description: 'Print working directory (Easter egg)',
    execute: () => {
      return '/home/christoph/terminal';
    }
  },

  sudo: {
    description: 'Sudo command (Easter egg)',
    execute: (args) => {
      if (args[0] === 'give' && args[1] === 'me' && args[2] === 'access') {
        return `
\x1b[31m[sudo]\x1b[0m password for guest:
\x1b[31mSorry, access denied.\x1b[0m
\x1b[33mThis incident will be reported to Christoph.\x1b[0m
\x1b[90m(Just kidding! Type 'help' for available commands)\x1b[0m
`;
      }
      return `\x1b[31m[sudo]\x1b[0m Nice try! But you don't have sudo access here 😄`;
    }
  }
};

// Write text to terminal
function write(text) {
  term.write(text);
}

// Write line to terminal
function writeln(text) {
  term.writeln(text);
}

// Execute command
function executeCommand(input) {
  const parts = input.trim().split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (command === '') {
    return '';
  }

  if (commands[command]) {
    return commands[command].execute(args);
  } else {
    return `\x1b[31mCommand not found:\x1b[0m ${command}\nType '\x1b[37mhelp\x1b[0m' to see available commands.`;
  }
}

// Handle key input
term.onKey(({ key, domEvent }) => {
  const char = key;
  const code = domEvent.keyCode;

  // Handle printable characters
  if (!domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey) {
    if (code === 13) { // Enter
      writeln('');
      commandHistory.push(currentLine);
      historyIndex = commandHistory.length;

      const output = executeCommand(currentLine);
      if (output) {
        writeln(output);
      }

      currentLine = '';
      write(prompt);
    } else if (code === 8) { // Backspace
      if (currentLine.length > 0) {
        currentLine = currentLine.slice(0, -1);
        term.write('\b \b');
      }
    } else if (code === 9) { // Tab
      domEvent.preventDefault();
      // Tab completion
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(currentLine));
      if (matches.length === 1) {
        const completion = matches[0].slice(currentLine.length);
        currentLine += completion;
        write(completion);
      } else if (matches.length > 1) {
        writeln('');
        writeln(matches.join('  '));
        write(prompt + currentLine);
      }
    } else if (code === 38) { // Up arrow
      if (historyIndex > 0) {
        historyIndex--;
        // Clear current line
        write('\r' + prompt + ' '.repeat(currentLine.length) + '\r' + prompt);
        currentLine = commandHistory[historyIndex];
        write(currentLine);
      }
    } else if (code === 40) { // Down arrow
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        // Clear current line
        write('\r' + prompt + ' '.repeat(currentLine.length) + '\r' + prompt);
        currentLine = commandHistory[historyIndex];
        write(currentLine);
      } else if (historyIndex === commandHistory.length - 1) {
        historyIndex = commandHistory.length;
        // Clear current line
        write('\r' + prompt + ' '.repeat(currentLine.length) + '\r' + prompt);
        currentLine = '';
      }
    } else if (char.length === 1 && code !== 37 && code !== 39) { // Regular character (not left/right arrow)
      currentLine += char;
      write(char);
    }
  } else if (domEvent.ctrlKey) {
    if (code === 67) { // Ctrl+C
      writeln('^C');
      currentLine = '';
      write(prompt);
    } else if (code === 76) { // Ctrl+L
      term.clear();
      write(prompt);
    }
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  fitAddon.fit();
});

// Initialize terminal
write(banner);
write(prompt);

// Focus terminal
term.focus();
