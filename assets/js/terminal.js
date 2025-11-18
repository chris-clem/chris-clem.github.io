// Terminal configuration
const term = new Terminal({
  cursorBlink: true,
  fontFamily: '"Cascadia Code", Menlo, monospace',
  fontSize: 14,
  scrollback: 1000,
  convertEol: true,
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

// Terminal state
let currentLine = '';
let commandHistory = [];
let historyIndex = -1;

// Dynamic prompt based on current directory
function getPrompt() {
  return `\x1b[32mguest\x1b[0m:\x1b[34m${currentDir}\x1b[0m$ `;
}

// ASCII Art banner - kept simple for proper rendering
const banner = `\x1b[1m\x1b[36m
   ╔═╗╦ ╦╦═╗╦╔═╗╔╦╗╔═╗╔═╗╦ ╦  ╔═╗╦  ╔═╗╔╦╗╔═╗╔╗╔╔╦╗
   ║  ╠═╣╠╦╝║╚═╗ ║ ║ ║╠═╝╠═╣  ║  ║  ║╣ ║║║║╣ ║║║ ║
   ╚═╝╩ ╩╩╚═╩╚═╝ ╩ ╚═╝╩  ╩ ╩  ╚═╝╩═╝╚═╝╩ ╩╚═╝╝╚╝ ╩
\x1b[0m
   \x1b[90mMachine Learning Engineer | AI Drug Discovery\x1b[0m
   \x1b[90mPhD Biomedical Engineering | Harvard Researcher\x1b[0m

\x1b[1m\x1b[33mWelcome to Christoph's interactive terminal!\x1b[0m
\x1b[90mType '\x1b[37mhelp\x1b[90m' to see available commands or '\x1b[37mclear\x1b[90m' to clear the screen.\x1b[0m

`;

// Blog posts data
const blogPosts = {
  'raycast-quicklinks.md': {
    title: 'TIL: Use Raycast Quicklinks to open RCSB PDB 3D Viewer',
    date: '2025-11-07',
    tags: ['raycast'],
    content: `# TIL: Use Raycast Quicklinks to open RCSB PDB 3D Viewer

1. Create a Raycast Quicklink with the following content:

   Name: RCSB Structure
   Link: https://www2.rcsb.org/3d-view/{clipboard}

2. With it, copy a PDB ID, e.g. from the terminal, and use the
   Quicklink to open the RCSB PDB 3D Viewer.

3. Open Raycast, search for the Quicklink "RCSB Structure", and
   hit enter.

4. https://www2.rcsb.org/3d-view/2GEU opens in your browser.

5. Repeat with "https://www.rcsb.org/ligand/{clipboard}" for RCSB
   Ligand Viewer Quicklink where a CCD code is copied to clipboard.`
  },
  'windsurf-remote.md': {
    title: 'TIL: Quickly open remote dirs in Windsurf',
    date: '2025-11-07',
    tags: ['windsurf'],
    content: `# TIL: Quickly open remote dirs in Windsurf

Access remote dirs in Windsurf with the following command:

windsurf --folder-uri vscode-remote://ssh-remote+<remote-host>/home/user/<path>`
  },
  'gcp-buckets.md': {
    title: 'TIL: Manage GCP Buckets',
    date: '2025-11-10',
    tags: ['gcp'],
    content: `# TIL: Manage GCP Buckets

## Create bucket
gcloud storage buckets create gs://$BUCKET_NAME

## Transfer files to bucket
gcloud storage rsync -r ./local_dir gs://$BUCKET_NAME

## List buckets
gcloud storage ls`
  },
  'ghostty-terminfo.md': {
    title: 'TIL: Fix missing terminal error message',
    date: '2025-11-10',
    tags: ['ghostty'],
    content: `# TIL: Fix missing terminal error message

https://ghostty.org/docs/help/terminfo

## Copy Ghostty terminfo to remote server
infocmp -x xterm-ghostty | ssh YOUR-SERVER -- tic -x -`
  },
  'skypilot-commands.md': {
    title: 'TIL: Useful SkyPilot Commands',
    date: '2025-11-10',
    tags: ['skypilot'],
    content: `# TIL: Useful SkyPilot Commands

## Installation
uv tool install --with pip "skypilot[gcp]"

## Common commands

### Check to verify cloud access
sky check gcp

### Status to see all clusters
sky status

### Dashboard for a nicer UI
sky dashboard

## Development Cluster

### Launch cluster with L4 GPU and 5 hours autostop
sky launch -c dev --gpus L4 --workdir . -i 300

### SSH into cluster
ssh dev

### Stop/ Terminate a cluster
sky [stop/down] dev # down to terminate`
  },
  'jupyter-template.md': {
    title: 'TIL: Template data exploration Jupyter notebook',
    date: '2025-11-11',
    tags: ['python'],
    content: `# TIL: Template data exploration Jupyter notebook

Template Jupyter notebook for exploring data.
I have added it as a Raycast snippet @notebook

In VSCode/Windsurf/Cursor, create a new file called
explore_data.txt and copy the JSON content, then rename
it to explore_data.ipynb.

Includes cells for:
- Imports (pathlib, matplotlib, numpy, pandas, seaborn)
- Paths & Settings (DATA_DIR)
- Load Data (pd.read_csv)`
  },
  'python-script-template.md': {
    title: 'TIL: Template data processing script',
    date: '2025-11-11',
    tags: ['python'],
    content: `# TIL: Template data processing script

Template script for processing data with common packages.
I have added it as a Raycast snippet @script

Uses:
- pathlib for file paths
- fire for CLI arguments
- joblib for parallel processing
- loguru for logging
- tqdm for progress bars

Example usage:
python process.py --n_jobs 4`
  },
  'datamol-functions.md': {
    title: 'TIL: Useful Datamol functions',
    date: '2025-11-12',
    tags: ['datamol'],
    content: `# TIL: Useful Datamol functions

https://docs.datamol.io/stable/index.html

import datamol as dm

## Cluster molecules using butina algorithm
dm.cluster.cluster_mols(mols, cutoff=0.2)

## Compute conformers
dm.conformers.generate(mol, ...)

## Convert mols to dataframe
dm.convert.to_df(mols)

## Compute molecular properties
dm.descriptors.compute_many_descriptors(mol)

## Compute fingerprints
dm.fp.to_fp(mol, as_array=True, fp_type='ecfp')

## Fragment molecule
dm.fragment.frag(mol)

## Read/Write SDF files
dm.io.read_sdf(urlpath)
dm.io.to_sdf(mols, urlpath)

## Disable RDKit logs
with dm.log.without_rdkit_log():
    mol = dm.to_mol("CCCCO")

## Standardize molecule
mol = dm.mol.to_mol("O=C(C)Oc1ccccc1C(=O)O")
mol = dm.mol.fix_mol(mol)
mol = dm.mol.sanitize_mol(mol)
mol = dm.mol.standardize_mol(mol)

## Generate image
dm.viz.to_image(mols, legends)`
  },
  'gcp-quota.md': {
    title: 'TIL: Request GCP quota increase',
    date: '2025-11-13',
    tags: ['gcp'],
    content: `# TIL: Request GCP quota increase

1. Go to the Quota page in Google Cloud Console
2. Click Filter and select Service: Compute Engine API
3. For H100 GPUs: choose metric: GPUS_PER_GPU_FAMILY
   and select dimension gpu_family: NVIDIA_H100
4. For other GPUs: choose Limit Name: instance_name
   (e.g., NVIDIA-V100-GPUS-per-project-region)
5. Select the checkbox of the region
6. Click Edit Quotas and fill out the new limit
7. Click Submit Request`
  },
  'skypilot-multinode.md': {
    title: 'TIL: Multi-node GPU training with SkyPilot',
    date: '2025-11-13',
    tags: ['skypilot', 'pytorch'],
    content: `# TIL: Multi-node GPU training with SkyPilot

## 1. Configure PyTorch Lightning Trainer
trainer = Trainer(
    accelerator="gpu",
    devices=8,
    num_nodes=8,
    strategy="ddp"
)

## 2. Launch SkyPilot cluster
sky launch -c train train.yaml

## SkyPilot config (train.yaml):
resources:
    accelerators: H100:8
    disks: 1TB

num_nodes: 8

run: |
    MASTER_ADDR=$(echo "$SKYPILOT_NODE_IPS" | head -n1)
    torchrun \\
    --nnodes=$SKYPILOT_NUM_NODES \\
    --nproc_per_node=$SKYPILOT_NUM_GPUS_PER_NODE \\
    --master_addr=$MASTER_ADDR \\
    --master_port=8008 \\
    --node_rank=\${SKYPILOT_NODE_RANK} \\
    train.py`
  },
  'python-project-template.md': {
    title: 'TIL: Python Template Project',
    date: '2025-11-14',
    tags: ['python', 'uv'],
    content: `# TIL: Python Template Project

## 1. Initialize project as a uv packaged application
uv init --package project-name

## 2. Create venv by running it
cd project-name
uv run project-name

## 3. Add dependencies
uv add fire joblib loguru tqdm

## 4. Add pre-commit hooks
Create .pre-commit-config.yaml with:
- pre-commit-hooks (check-ast, check-json, etc.)
- ruff-pre-commit (ruff-check, ruff-format)

Install:
uv add --dev pre-commit
uv run pre-commit install

Run on all files:
git add .
uv run pre-commit run --all-files
git commit -m "Initial commit"`
  }
};

// Projects data
const projects = {
  'pet-foundation-models.md': {
    title: 'PET Foundation Models',
    status: 'Research',
    tags: ['Medical Imaging', 'Foundation Models', 'Harvard'],
    content: `# PET Foundation Models @ Harvard Medical School

Developing large-scale pre-trained models for PET/CT imaging
at the Center for Advanced Medical Computing and Analysis (CAMCA).

## Research Goals
- Self-supervised learning for medical images
- Transfer learning across imaging modalities
- Improved diagnostic accuracy with less labeled data

## Collaboration
Working under supervision of Dr. Quanzheng Li at MGH/Harvard.`
  },
  'tau-pet-analysis.md': {
    title: 'Tau-PET Analysis for Alzheimer\'s',
    status: 'Completed',
    tags: ['Neurology', 'PET', 'Deep Learning'],
    content: `# Tau-PET Brain Scan Analysis

PhD research on interpreting tau-PET brain scans for
neurodegenerative disease detection.

## Methodology
- 3D CNN architectures for brain imaging
- Attention mechanisms for interpretability
- Multi-task learning for staging

## Outcomes
- Improved early detection of Alzheimer's disease
- Automated staging of disease progression
- Published in peer-reviewed journals`
  },
  'deepfake-detection.md': {
    title: 'Deepfake Detection System',
    status: 'Completed',
    tags: ['Computer Vision', 'Security', 'TUM'],
    content: `# Deepfake Detection @ TUM Visual Computing Group

Developed deepfake detection algorithms in collaboration
with AI Foundation.

## Approach
- Face manipulation detection
- Temporal inconsistency analysis
- Ensemble methods for robustness

## Impact
Contributing to media authenticity verification and
combating misinformation.`
  }
};

// Publications data
const publications = {
  'ct-free-pet-segmentation.md': {
    title: 'CT-free Total-Body PET Segmentation',
    year: '2024',
    venue: 'Medical Image Analysis',
    content: `# CT-free Total-Body PET Segmentation

## Abstract
Novel deep learning approach for anatomical segmentation
of PET images without requiring CT scans, reducing
radiation exposure for patients.

## Key Contributions
- Developed synthetic CT generation from PET
- Multi-organ segmentation network
- Validated on total-body PET scanner data

## Citation
Clement et al., Medical Image Analysis, 2024`
  },
  'organ-on-chip-imaging.md': {
    title: 'High-Resolution Organ-on-Chip Imaging',
    year: '2023',
    venue: 'Lab on a Chip',
    content: `# High-Resolution Organ-on-Chip Imaging

## Abstract
Novel imaging pipeline for micro-physiological systems
enabling real-time monitoring of organ-on-chip devices.

## Key Contributions
- Custom microscopy setup for 3D imaging
- Deep learning-based image enhancement
- Automated cell tracking and analysis

## Citation
Clement et al., Lab on a Chip, 2023`
  },
  'pet-reconstruction.md': {
    title: 'Deep Learning PET Reconstruction',
    year: '2022',
    venue: 'IEEE TMI',
    content: `# Deep Learning for PET Image Reconstruction

## Abstract
End-to-end deep learning approach for PET image
reconstruction with improved noise reduction and
resolution recovery.

## Key Contributions
- Unrolled optimization network architecture
- Physics-informed neural network design
- Clinical validation study

## Citation
Clement et al., IEEE Trans. Medical Imaging, 2022`
  }
};

// Current directory for filesystem simulation
let currentDir = '~';

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
  \x1b[32mcontact\x1b[0m              Get contact information
  \x1b[32msocial\x1b[0m               Social media links
  \x1b[32mcv\x1b[0m                   View CV/Resume
  \x1b[32mfun\x1b[0m                  Something fun!
  \x1b[32mmatrix\x1b[0m               Enter the Matrix...
  \x1b[32mclear\x1b[0m                Clear the terminal
  \x1b[32mexit\x1b[0m                 Leave terminal mode

\x1b[1mFilesystem Commands:\x1b[0m
  \x1b[32mls\x1b[0m                   List directory contents
  \x1b[32mcd [dir]\x1b[0m             Change directory
  \x1b[32mcat [file]\x1b[0m           View file contents
  \x1b[32mpwd\x1b[0m                  Print working directory

\x1b[1mDirectories:\x1b[0m
  \x1b[34mblog/\x1b[0m                TIL posts (Today I Learned)
  \x1b[34mprojects/\x1b[0m            Research & work projects
  \x1b[34mpublications/\x1b[0m        Academic publications

\x1b[90mTip: Try 'ls' then 'cd blog' then 'cat skypilot-commands.md'\x1b[0m
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
      // List blog posts
      const files = Object.keys(blogPosts).sort();
      let output = `
\x1b[1m\x1b[36m📝 Blog Posts (TIL - Today I Learned)\x1b[0m

`;
      files.forEach(file => {
        const post = blogPosts[file];
        output += `  \x1b[36m${file}\x1b[0m\n`;
        output += `    \x1b[90m${post.date} - ${post.title}\x1b[0m\n\n`;
      });
      output += `\x1b[32mRead a post:\x1b[0m cat blog/<filename>
\x1b[32mOr navigate:\x1b[0m cd blog && ls && cat <filename>

\x1b[90mFor more posts, visit: https://chris-clem.github.io/blog/\x1b[0m`;
      return output;
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
    description: 'List directory contents',
    execute: (args) => {
      const target = args[0] || currentDir;

      if (currentDir === '~' && !args[0]) {
        return `
\x1b[34mblog/\x1b[0m          \x1b[34mprojects/\x1b[0m       \x1b[34mpublications/\x1b[0m
\x1b[36mREADME.md\x1b[0m      \x1b[36mcontact.txt\x1b[0m

\x1b[90mTip: Try 'cd blog', 'cd projects', or 'cd publications'\x1b[0m
`;
      } else if (currentDir === '~/blog' || target === 'blog' || target === '~/blog') {
        // List blog posts
        const files = Object.keys(blogPosts).sort();
        let output = '\n';
        files.forEach(file => {
          const post = blogPosts[file];
          output += `\x1b[36m${file}\x1b[0m\n`;
          output += `  \x1b[90m${post.date} - ${post.title}\x1b[0m\n`;
        });
        output += `\n\x1b[90mUse 'cat <filename>' to read a post\x1b[0m\n`;
        return output;
      } else if (currentDir === '~/projects' || target === 'projects' || target === '~/projects') {
        // List projects
        const files = Object.keys(projects).sort();
        let output = '\n';
        files.forEach(file => {
          const project = projects[file];
          output += `\x1b[36m${file}\x1b[0m\n`;
          output += `  \x1b[90m[${project.status}] ${project.title}\x1b[0m\n`;
        });
        output += `\n\x1b[90mUse 'cat <filename>' to read about a project\x1b[0m\n`;
        return output;
      } else if (currentDir === '~/publications' || target === 'publications' || target === '~/publications') {
        // List publications
        const files = Object.keys(publications).sort();
        let output = '\n';
        files.forEach(file => {
          const pub = publications[file];
          output += `\x1b[36m${file}\x1b[0m\n`;
          output += `  \x1b[90m${pub.year} - ${pub.title}\x1b[0m\n`;
        });
        output += `\n\x1b[90mUse 'cat <filename>' to read a publication\x1b[0m\n`;
        return output;
      }

      return `\x1b[31mls: cannot access '${target}': No such directory\x1b[0m`;
    }
  },

  cd: {
    description: 'Change directory',
    execute: (args) => {
      const target = args[0];

      if (!target || target === '~') {
        currentDir = '~';
        return '';
      } else if (target === '..') {
        currentDir = '~';
        return '';
      } else if (target === 'blog' || target === '~/blog') {
        currentDir = '~/blog';
        return '';
      } else if (target === 'projects' || target === '~/projects') {
        currentDir = '~/projects';
        return '';
      } else if (target === 'publications' || target === '~/publications') {
        currentDir = '~/publications';
        return '';
      } else {
        return `\x1b[31mcd: no such directory: ${target}\x1b[0m`;
      }
    }
  },

  cat: {
    description: 'View file contents',
    execute: (args) => {
      if (!args[0]) {
        return `\x1b[31mcat: missing file operand\x1b[0m\nUsage: cat <filename>`;
      }

      let filename = args[0];
      let targetDir = currentDir;

      // Handle paths like blog/filename.md, projects/filename.md, etc.
      if (filename.startsWith('blog/')) {
        filename = filename.replace('blog/', '');
        targetDir = '~/blog';
      } else if (filename.startsWith('projects/')) {
        filename = filename.replace('projects/', '');
        targetDir = '~/projects';
      } else if (filename.startsWith('publications/')) {
        filename = filename.replace('publications/', '');
        targetDir = '~/publications';
      }

      // Check based on current/target directory
      if (targetDir === '~/blog' || currentDir === '~/blog') {
        if (blogPosts[filename]) {
          const post = blogPosts[filename];
          const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
          return `
\x1b[90m[${now}] cat ${args[0]}\x1b[0m

\x1b[1m\x1b[33m${post.title}\x1b[0m
\x1b[90mDate: ${post.date} | Tags: ${post.tags.join(', ')}\x1b[0m
\x1b[90m${'─'.repeat(50)}\x1b[0m

${post.content}
`;
        }
      }

      if (targetDir === '~/projects' || currentDir === '~/projects') {
        if (projects[filename]) {
          const project = projects[filename];
          const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
          return `
\x1b[90m[${now}] cat ${args[0]}\x1b[0m

\x1b[1m\x1b[33m${project.title}\x1b[0m
\x1b[90mStatus: ${project.status} | Tags: ${project.tags.join(', ')}\x1b[0m
\x1b[90m${'─'.repeat(50)}\x1b[0m

${project.content}
`;
        }
      }

      if (targetDir === '~/publications' || currentDir === '~/publications') {
        if (publications[filename]) {
          const pub = publications[filename];
          const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
          return `
\x1b[90m[${now}] cat ${args[0]}\x1b[0m

\x1b[1m\x1b[33m${pub.title}\x1b[0m
\x1b[90mYear: ${pub.year} | Venue: ${pub.venue}\x1b[0m
\x1b[90m${'─'.repeat(50)}\x1b[0m

${pub.content}
`;
        }
      }

      return `\x1b[31mcat: ${args[0]}: No such file or directory\x1b[0m`;
    }
  },

  pwd: {
    description: 'Print working directory',
    execute: () => {
      return `/home/christoph${currentDir.replace('~', '')}`;
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
      return `\x1b[31m[sudo]\x1b[0m Nice try! But you don't have sudo access here`;
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
      write(getPrompt());
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
      write(getPrompt());
    } else if (code === 76) { // Ctrl+L
      term.clear();
      write(getPrompt());
    }
  }
});

// Initialize terminal properly
function initTerminal() {
  // Fit terminal to container dimensions immediately
  fitAddon.fit();

  // Write banner and prompt
  term.writeln(banner);
  term.write(getPrompt());

  // Focus terminal
  term.focus();
}

// Handle window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    fitAddon.fit();
  }, 100);
});

// Wait for fonts to load and DOM to be ready, then initialize
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    // Small delay to ensure container has proper dimensions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initTerminal();
      });
    });
  });
} else {
  // Fallback for browsers without font loading API
  setTimeout(initTerminal, 200);
}
