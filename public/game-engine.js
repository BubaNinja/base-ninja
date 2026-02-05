// =============================================================================
// Base Ninja - Complete Game Engine (auto-extracted from original index.html)
// All 13 backgrounds, all blades, all audio, all game mechanics preserved.
// =============================================================================

/* global ethers */
/* global base */ // @base-org/account SDK (window.base.pay)

const Game = {
    canvas: null, ctx: null, W: 0, H: 0, dpr: 1,
    state: 'menu', mode: null, score: 0, lives: 3, timeLeft: 60, combo: 0, comboTimer: null,
    coins: [], pieces: [], particles: [], texts: [], moneyParticles: [], bladeParticles: [],
    trail: [], slicing: false, lastPos: null,
    waveTimer: null, gameTimer: null,
    images: {}, bombCanvas: null, billCanvas: null, squareBombCanvas: null,
    
    // Wallet & Payments
    walletConnected: false,
    walletAddress: null,
    provider: null,
    signer: null,
    pendingPurchase: null,
    
    // Base chain config
    BASE_CHAIN_ID: 8453,
    USDC_ADDRESS: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    RECEIVER_ADDRESS: '0x01fB34CeACd6f29938C7b34dDAED0035377662f9', // Replace with your address
    
    // Base Ninja Shop Contract V2 - WITH BATCH PURCHASE SUPPORT
    // After deploying BaseNinjaShop_V2.sol, replace with new contract address
    // Old V1 contract: 0x02fAD5a04345ea9279790d67B6EFc1842BD74C5F
    SHOP_CONTRACT_ADDRESS: '0x49e7DB0174e944e51b1cF3cdd54EA3a85eC45B17', // UPDATE THIS AFTER DEPLOY!
    
    // Verification Server URL - REPLACE WITH YOUR SERVER URL
    VERIFICATION_SERVER: '',
    
    // Shop Contract ABI (includes leaderboard with signature verification)
    SHOP_ABI: [
        // Shop functions
        'function purchaseItem(string itemType, string itemId) external',
        'function purchaseMultiple(string[] itemTypes, string[] itemIds) external',
        'function hasPurchased(address user, string itemType, string itemId) external view returns (bool)',
        'function getBulkPurchases(address user, string[] itemTypes, string[] itemIds) external view returns (bool[])',
        'function itemPrice() external view returns (uint256)',
        // Leaderboard functions (with signature)
        'function setNickname(string nickname) external',
        'function submitScore(uint8 mode, uint256 score, uint256 nonce, bytes signature) external',
        'function submitScoreUnsafe(uint8 mode, uint256 score) external',
        'function getTopScores(uint8 mode, uint256 count) external view returns (address[] players, uint256[] scores, string[] nicknames, uint256[] timestamps)',
        'function getLeaderboardSize(uint8 mode) external view returns (uint256)',
        'function getPlayerRank(address player, uint8 mode) external view returns (uint256)',
        'function playerBestScore(address player, uint8 mode) external view returns (uint256)',
        'function playerNickname(address player) external view returns (string)',
        'function scoreVerifier() external view returns (address)',
        // Events
        'event ItemPurchased(address indexed buyer, string itemType, string itemId, uint256 price)',
        'event ScoreSubmitted(address indexed player, uint8 indexed mode, uint256 score, string nickname)'
    ],
    
    // Game session recording
    gameSession: null,
    
    // Customization
    currentBlade: 'money',
    currentBg: 'default',
    
    // Matrix rain effect
    matrixColumns: [],
    matrixChars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF₿Ξ◊∞',
    matrixInitialized: false,
    
    // Blockchain effect
    blocks: [],
    blockchainInitialized: false,
    
    // Neon City effect
    neonBuildings: [],
    neonShips: [],
    neonInitialized: false,
    
    // Circuit effect
    circuitNodes: [],
    circuitPaths: [],
    circuitPulses: [],
    circuitInitialized: false,
    
    // Space effect
    stars: [],
    nebulaClouds: [],
    shootingStars: [],
    planets: [],
    spaceInitialized: false,
    
    // Waves effect
    waves: [],
    waveParticles: [],
    wavesInitialized: false,
    
    // Retro/Arcade effect
    retroGrid: [],
    retroStars: [],
    retroSunY: 0,
    retroMountains: [],
    
    // CRT Monitor effect
    crtLines: [],
    crtCursorBlink: 0,
    crtText: '',
    crtTextLines: [],
    
    // Pixel/8-bit effect
    pixelClouds: [],
    pixelStars: [],
    pixelPlatforms: [],
    pixelCoins: [],
    pixelEnemies: [],
    pixelOffset: 0,
    
    // Windows 95 effect
    win95Windows: [],
    win95Icons: [],
    win95Initialized: false,
    win95Timer: 0,
    
    // Nokia effect
    nokiaSnake: [],
    nokiaSnakeDir: 1,
    nokiaFood: null,
    nokiaInitialized: false,
    nokiaLastMove: 0,
    
    // Oscilloscope effect
    oscWaves: [],
    oscTime: 0,
    oscReactions: [],
    oscBombHit: false,
    
    // Audio system
    audioCtx: null,
    musicPlaying: false,
    musicNodes: [],
    soundEnabled: true,
    musicEnabled: true,
    masterVolume: 0.3,
    musicVolume: 0.15,
    
    blades: [
        { id: 'money', name: 'Money', icon: '$', unlocked: true, price: 0 },
        { id: 'bitcoin', name: 'Bitcoin', icon: '₿', unlocked: true, price: 0 },
        { id: 'ethereum', name: 'Ethereum', icon: '◆', unlocked: true, price: 0 },
        { id: 'base', name: 'Base', icon: '◉', unlocked: true, price: 0 },
        { id: 'matrix', name: 'Matrix', icon: '▦', unlocked: false, price: 1 },
        { id: 'blockchain', name: 'Blockchain', icon: '⬡', unlocked: false, price: 1 },
        { id: 'quantum', name: 'Quantum', icon: '∞', unlocked: true, price: 0 },
        { id: 'pixel', name: 'Pixel', icon: '▪', unlocked: false, price: 1 },
        { id: 'neural', name: 'Neural', icon: '◎', unlocked: false, price: 1 },
        { id: 'candle', name: 'Candles', icon: '▯', unlocked: false, price: 1 }
    ],
    
    backgrounds: [
        { id: 'default', name: 'Default', icon: '●', unlocked: true, price: 0 },
        { id: 'matrix', name: 'Matrix', icon: '▦', unlocked: true, price: 0 },
        { id: 'blockchain', name: 'Blockchain', icon: '⬡', unlocked: true, price: 0 },
        { id: 'neon', name: 'Neon City', icon: '◈', unlocked: true, price: 0 },
        { id: 'circuit', name: 'Circuit', icon: '⊞', unlocked: false, price: 1 },
        { id: 'space', name: 'Space', icon: '✦', unlocked: false, price: 1 },
        { id: 'waves', name: 'Waves', icon: '≋', unlocked: false, price: 1 },
        { id: 'retro', name: 'Retro', icon: '▣', unlocked: false, price: 1 },
        { id: 'crt', name: 'CRT', icon: '▤', unlocked: false, price: 1 },
        { id: 'pixel', name: 'Pixel', icon: '▫', unlocked: false, price: 1 },
        { id: 'win95', name: 'Win95', icon: '⊟', unlocked: false, price: 1 },
        { id: 'nokia', name: 'Nokia', icon: '▭', unlocked: false, price: 1 },
        { id: 'oscilloscope', name: 'Oscillo', icon: '∿', unlocked: false, price: 1 }
    ],
    
    cryptos: ['BTC','ETH','XRP','USDT','SOL','USDC','TRX','BASE','PENGU','HYPE'],
    
    init() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.dpr = Math.min(devicePixelRatio || 1, 2);
        this.resize();
        addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousedown', e => this.down(e));
        this.canvas.addEventListener('mousemove', e => this.move(e));
        this.canvas.addEventListener('mouseup', () => this.up());
        this.canvas.addEventListener('mouseleave', () => this.up());
        this.canvas.addEventListener('touchstart', e => this.down(e), {passive:false});
        this.canvas.addEventListener('touchmove', e => this.move(e), {passive:false});
        this.canvas.addEventListener('touchend', () => this.up());
        
        // Initialize audio on first interaction
        const initAudio = () => {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.state === 'menu') {
                this.startMenuMusic();
            }
            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
        };
        document.addEventListener('click', initAudio);
        document.addEventListener('touchstart', initAudio);
        
        this.createBombCanvas();
        this.createBillCanvas();
        this.initMatrix();
        this.initBlockchain();
        this.initNeonCity();
        this.initCircuit();
        this.initSpace();
        this.initWaves();
        this.loadImages();
        this.loadPurchases(); // Load device-cached purchases (works without wallet)
        this.loop();
        
        // Notify Farcaster/Base App that the mini app is ready
        this.notifyMiniAppReady();
    },
    
    
async notifyMiniAppReady() {
    try {
        if (window.miniapp && window.miniapp.sdk) {
            await window.miniapp.sdk.actions.ready();
            console.log('Mini App ready');
        }
    } catch (e) {
        console.log('SDK error:', e);
    }
},
    
    resize() {
        this.W = innerWidth; this.H = innerHeight;
        this.canvas.width = this.W * this.dpr;
        this.canvas.height = this.H * this.dpr;
        this.canvas.style.width = this.W + 'px';
        this.canvas.style.height = this.H + 'px';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.initMatrix();
        this.initBlockchain();
        this.initNeonCity();
        this.initCircuit();
        this.initSpace();
        this.initWaves();
    },
    
    initMatrix() {
        const fontSize = 16;
        const columns = Math.floor(this.W / fontSize);
        this.matrixColumns = [];
        for (let i = 0; i < columns; i++) {
            this.matrixColumns.push({
                x: i * fontSize,
                y: Math.random() * this.H,
                speed: 2 + Math.random() * 4,
                chars: [],
                length: 10 + Math.floor(Math.random() * 20)
            });
            // Initialize character trail for each column
            for (let j = 0; j < this.matrixColumns[i].length; j++) {
                this.matrixColumns[i].chars.push(this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)]);
            }
        }
    },
    
    initBlockchain() {
        this.blocks = [];
        const numBlocks = 25;
        const hexChars = '0123456789ABCDEF';
        
        for (let i = 0; i < numBlocks; i++) {
            // Generate random hash
            let hash = '0x';
            for (let j = 0; j < 8; j++) {
                hash += hexChars[Math.floor(Math.random() * 16)];
            }
            
            this.blocks.push({
                x: Math.random() * this.W,
                y: Math.random() * this.H,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 40 + Math.random() * 30,
                hash: hash,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                confirmed: Math.random() > 0.3
            });
        }
    },
    
    initNeonCity() {
        // Generate Coruscant-style skyline with tall spires
        this.neonBuildings = [];
        const numBuildings = Math.floor(this.W / 25);
        
        for (let i = 0; i < numBuildings; i++) {
            const baseHeight = 100 + Math.random() * 300;
            const width = 15 + Math.random() * 40;
            const hasSpire = Math.random() > 0.4;
            const spireHeight = hasSpire ? baseHeight * (0.3 + Math.random() * 0.5) : 0;
            
            this.neonBuildings.push({
                x: i * 25 + Math.random() * 15 - 7,
                width: width,
                height: baseHeight,
                spireHeight: spireHeight,
                layer: Math.floor(Math.random() * 3), // 0 = front, 1 = mid, 2 = back
                windows: [],
                topLight: Math.random() > 0.5,
                lightColor: ['#ff6600', '#ffaa00', '#00ffff', '#ff0066'][Math.floor(Math.random() * 4)]
            });
            
            // Generate windows
            const cols = Math.floor(width / 8);
            const rows = Math.floor(baseHeight / 12);
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (Math.random() > 0.4) {
                        this.neonBuildings[i].windows.push({
                            x: c * 8 + 2,
                            y: r * 12 + 5,
                            lit: Math.random() > 0.3
                        });
                    }
                }
            }
        }
        
        // Sort by layer (back to front)
        this.neonBuildings.sort((a, b) => b.layer - a.layer);
        
        // Generate flying ships (speeders)
        this.neonShips = [];
        for (let i = 0; i < 8; i++) {
            this.neonShips.push({
                x: Math.random() * this.W,
                y: 100 + Math.random() * (this.H * 0.5),
                speed: 1.5 + Math.random() * 3,
                size: 3 + Math.random() * 5,
                direction: Math.random() > 0.5 ? 1 : -1,
                tailLength: 20 + Math.random() * 30,
                color: ['#ff6600', '#00ffff', '#ffff00', '#ff0066'][Math.floor(Math.random() * 4)]
            });
        }
    },
    
    initCircuit() {
        this.circuitNodes = [];
        this.circuitPaths = [];
        this.circuitPulses = [];
        
        // Create grid of nodes
        const gridSize = 60;
        const cols = Math.ceil(this.W / gridSize) + 1;
        const rows = Math.ceil(this.H / gridSize) + 1;
        
        // Generate nodes with some randomness
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.3) {
                    const node = {
                        x: c * gridSize + (Math.random() - 0.5) * 20,
                        y: r * gridSize + (Math.random() - 0.5) * 20,
                        type: Math.random() > 0.85 ? 'chip' : Math.random() > 0.7 ? 'capacitor' : 'node',
                        size: Math.random() > 0.8 ? 8 : 4,
                        pulse: Math.random() * Math.PI * 2,
                        connections: []
                    };
                    this.circuitNodes.push(node);
                }
            }
        }
        
        // Create paths between nearby nodes
        for (let i = 0; i < this.circuitNodes.length; i++) {
            const node = this.circuitNodes[i];
            for (let j = i + 1; j < this.circuitNodes.length; j++) {
                const other = this.circuitNodes[j];
                const dist = Math.hypot(other.x - node.x, other.y - node.y);
                
                if (dist < gridSize * 1.8 && Math.random() > 0.5) {
                    // Create orthogonal path (like real PCB traces)
                    const midX = Math.random() > 0.5 ? node.x : other.x;
                    const midY = Math.random() > 0.5 ? other.y : node.y;
                    
                    this.circuitPaths.push({
                        from: node,
                        to: other,
                        midX: midX,
                        midY: midY,
                        width: Math.random() > 0.7 ? 3 : 1.5
                    });
                    
                    node.connections.push(other);
                    other.connections.push(node);
                }
            }
        }
        
        // Create initial pulses
        for (let i = 0; i < 15; i++) {
            this.spawnCircuitPulse();
        }
    },
    
    spawnCircuitPulse() {
        if (this.circuitPaths.length === 0) return;
        const path = this.circuitPaths[Math.floor(Math.random() * this.circuitPaths.length)];
        this.circuitPulses.push({
            path: path,
            progress: 0,
            speed: 0.01 + Math.random() * 0.02,
            color: Math.random() > 0.7 ? '#00ff88' : Math.random() > 0.5 ? '#00ffff' : '#0088ff',
            size: 3 + Math.random() * 3
        });
    },
    
    initSpace() {
        // Create stars
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.W,
                y: Math.random() * this.H,
                size: Math.random() * 2.5,
                brightness: 0.3 + Math.random() * 0.7,
                twinkleSpeed: 0.02 + Math.random() * 0.05,
                twinklePhase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.9 ? '#aaccff' : Math.random() > 0.8 ? '#ffddaa' : '#ffffff'
            });
        }
        
        // Create nebula clouds
        this.nebulaClouds = [];
        const nebulaColors = [
            { r: 100, g: 50, b: 150 },   // Purple
            { r: 50, g: 100, b: 150 },   // Blue
            { r: 150, g: 50, b: 100 },   // Pink
            { r: 50, g: 80, b: 120 }     // Dark blue
        ];
        
        for (let i = 0; i < 6; i++) {
            const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            this.nebulaClouds.push({
                x: Math.random() * this.W,
                y: Math.random() * this.H,
                radius: 100 + Math.random() * 200,
                color: color,
                alpha: 0.05 + Math.random() * 0.1,
                drift: (Math.random() - 0.5) * 0.2
            });
        }
        
        // Create planets
        this.planets = [];
        // Main planet
        this.planets.push({
            x: this.W * 0.8,
            y: this.H * 0.7,
            radius: 80,
            color1: '#3a1a5a',
            color2: '#1a0a3a',
            hasRing: true,
            ringColor: 'rgba(200, 180, 255, 0.3)',
            ringWidth: 25
        });
        
        // Small moon
        this.planets.push({
            x: this.W * 0.15,
            y: this.H * 0.25,
            radius: 25,
            color1: '#4a4a5a',
            color2: '#2a2a3a',
            hasRing: false
        });
        
        // Shooting stars array (spawned dynamically)
        this.shootingStars = [];
    },
    
    spawnShootingStar() {
        this.shootingStars.push({
            x: Math.random() * this.W,
            y: -10,
            vx: 3 + Math.random() * 4,
            vy: 5 + Math.random() * 5,
            length: 30 + Math.random() * 50,
            life: 1,
            decay: 0.015 + Math.random() * 0.01
        });
    },
    
    initWaves() {
        this.waves = [];
        const numWaves = 8;
        
        for (let i = 0; i < numWaves; i++) {
            this.waves.push({
                y: this.H * 0.3 + i * (this.H * 0.1),
                amplitude: 20 + Math.random() * 30,
                frequency: 0.005 + Math.random() * 0.01,
                speed: 0.02 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2,
                color: {
                    r: 0,
                    g: 100 + i * 15,
                    b: 200 + i * 8
                },
                alpha: 0.15 + i * 0.08
            });
        }
        
        // Floating particles
        this.waveParticles = [];
        for (let i = 0; i < 50; i++) {
            this.waveParticles.push({
                x: Math.random() * this.W,
                y: Math.random() * this.H,
                size: 2 + Math.random() * 4,
                speedX: 0.2 + Math.random() * 0.5,
                speedY: (Math.random() - 0.5) * 0.3,
                alpha: 0.2 + Math.random() * 0.4,
                pulse: Math.random() * Math.PI * 2
            });
        }
    },
    
    // Create a dollar bill texture
    createBillCanvas() {
        const w = 50, h = 22;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        
        // Bill background - greenish
        ctx.fillStyle = '#85bb65';
        ctx.fillRect(0, 0, w, h);
        
        // Darker border
        ctx.strokeStyle = '#5a8a3d';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, w-2, h-2);
        
        // Inner lighter rectangle
        ctx.fillStyle = '#9acc85';
        ctx.fillRect(4, 3, w-8, h-6);
        
        // Center circle (like portrait area)
        ctx.beginPath();
        ctx.arc(w/2, h/2, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#7ab55c';
        ctx.fill();
        
        // Dollar sign
        ctx.fillStyle = '#4a7a2d';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', w/2, h/2 + 1);
        
        // Corner decorations
        ctx.fillStyle = '#5a8a3d';
        ctx.font = 'bold 5px Arial';
        ctx.fillText('1', 8, 6);
        ctx.fillText('1', w-8, 6);
        ctx.fillText('1', 8, h-5);
        ctx.fillText('1', w-8, h-5);
        
        this.billCanvas = c;
    },
    
    createBombCanvas() {
        const size = 140;
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        const ctx = c.getContext('2d');
        const cx = size/2, cy = size/2 + 8, r = 45;
        
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
        
        const bg = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, 0, cx, cy, r);
        bg.addColorStop(0, '#4a4a4a');
        bg.addColorStop(0.3, '#2a2a2a');
        bg.addColorStop(0.7, '#1a1a1a');
        bg.addColorStop(1, '#0a0a0a');
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        
        const hg = ctx.createRadialGradient(cx - r*0.4, cy - r*0.4, 0, cx - r*0.3, cy - r*0.3, r*0.5);
        hg.addColorStop(0, 'rgba(255,255,255,0.4)');
        hg.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
        
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.ellipse(cx, cy - r + 5, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(cx - 7, cy - r - 8, 14, 13);
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.ellipse(cx, cy - r - 8, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - r - 10);
        ctx.quadraticCurveTo(cx + 15, cy - r - 25, cx + 8, cy - r - 35);
        ctx.strokeStyle = '#5a3d2b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        const sx = cx + 8, sy = cy - r - 38;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 20);
        sg.addColorStop(0, 'rgba(255,200,50,0.9)');
        sg.addColorStop(0.3, 'rgba(255,100,20,0.4)');
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.fillRect(sx - 25, sy - 25, 50, 50);
        
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        this.bombCanvas = c;
        
        // Create square bomb for blockchain
        this.createSquareBombCanvas();
    },
    
    createSquareBombCanvas() {
        const size = 90;
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        const ctx = c.getContext('2d');
        const radius = 12;
        
        // Dark background with red tint
        ctx.shadowColor = 'rgba(255, 50, 50, 0.3)';
        ctx.shadowBlur = 6;
        
        ctx.beginPath();
        ctx.roundRect(5, 5, size - 10, size - 10, radius);
        const bg = ctx.createLinearGradient(0, 0, size, size);
        bg.addColorStop(0, '#3a2020');
        bg.addColorStop(0.5, '#2a1515');
        bg.addColorStop(1, '#1a0a0a');
        ctx.fillStyle = bg;
        ctx.fill();
        
        // Red border
        ctx.strokeStyle = 'rgba(255, 80, 80, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // Warning icon
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣', size/2, size/2);
        
        // Corner warning triangles
        ctx.fillStyle = 'rgba(255, 80, 80, 0.3)';
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(25, 10);
        ctx.lineTo(10, 25);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(size - 10, size - 10);
        ctx.lineTo(size - 25, size - 10);
        ctx.lineTo(size - 10, size - 25);
        ctx.fill();
        
        this.squareBombCanvas = c;
    },
    
    loadImages() {
        const files = {BTC:'btc.png',ETH:'eth.png',XRP:'xrp.webp',USDT:'usdt.png',SOL:'sol.png',USDC:'usdc.png',TRX:'trx.png',BASE:'base.png',PENGU:'pengu.png',HYPE:'hype.png'};
        Object.entries(files).forEach(([id,file]) => {
            const img = new Image();
            img.src = '/images/' + file;
            img.onload = () => this.images[id] = img;
        });
        // Load Base logo for blade particles
        this.baseLogoImg = new Image();
        this.baseLogoImg.src = '/images/base.png';
    },
    
    // Sound effect generator
    playSliceSound(isBomb) {
        if (!this.audioCtx || !this.soundEnabled) return;
        
        const ctx = this.audioCtx;
        const now = ctx.currentTime;
        const vol = this.masterVolume;
        
        // Different sounds per background
        const bg = this.currentBg;
        
        if (isBomb) {
            // Bomb explosion sounds
            this.playBombSound(bg, ctx, now, vol);
        } else {
            // Coin slice sounds
            this.playCoinSound(bg, ctx, now, vol);
        }
    },
    
    playCoinSound(bg, ctx, now, vol) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        switch(bg) {
            case 'matrix':
                // Soft digital blip
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
                gain.gain.setValueAtTime(vol * 0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
                
            case 'blockchain':
                // Electronic beep
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.05);
                osc.frequency.setValueAtTime(784, now + 0.1);
                gain.gain.setValueAtTime(vol * 0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
                
            case 'neon':
                // Neon laser swoosh
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
                gain.gain.setValueAtTime(vol * 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                // Add high sparkle
                const neonSparkle = ctx.createOscillator();
                const neonGain = ctx.createGain();
                neonSparkle.connect(neonGain);
                neonGain.connect(ctx.destination);
                neonSparkle.type = 'sine';
                neonSparkle.frequency.setValueAtTime(2000, now);
                neonSparkle.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                neonGain.gain.setValueAtTime(vol * 0.1, now);
                neonGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                neonSparkle.start(now);
                neonSparkle.stop(now + 0.12);
                break;
                
            case 'circuit':
                // Electric zap
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(2000, now + 0.03);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(vol * 0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;
                
            case 'space':
                // Cosmic chime
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(vol * 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                // Add second tone
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(900, now + 0.05);
                gain2.gain.setValueAtTime(vol * 0.15, now + 0.05);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc2.start(now + 0.05);
                osc2.stop(now + 0.5);
                break;
                
            case 'waves':
                // Bubbling water - multiple bubbles
                for (let b = 0; b < 4; b++) {
                    const bubble = ctx.createOscillator();
                    const bubbleGain = ctx.createGain();
                    bubble.connect(bubbleGain);
                    bubbleGain.connect(ctx.destination);
                    bubble.type = 'sine';
                    const bubbleStart = now + b * 0.04;
                    const bubbleFreq = 400 + Math.random() * 300;
                    bubble.frequency.setValueAtTime(bubbleFreq, bubbleStart);
                    bubble.frequency.exponentialRampToValueAtTime(bubbleFreq * 1.8, bubbleStart + 0.06);
                    bubbleGain.gain.setValueAtTime(vol * 0.15, bubbleStart);
                    bubbleGain.gain.exponentialRampToValueAtTime(0.01, bubbleStart + 0.08);
                    bubble.start(bubbleStart);
                    bubble.stop(bubbleStart + 0.08);
                }
                break;
                
            case 'retro':
                // 8-bit coin
                osc.type = 'square';
                osc.frequency.setValueAtTime(987, now);
                osc.frequency.setValueAtTime(1318, now + 0.06);
                gain.gain.setValueAtTime(vol * 0.2, now);
                gain.gain.setValueAtTime(vol * 0.2, now + 0.06);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
                
            case 'crt':
                // Terminal beep
                osc.type = 'square';
                osc.frequency.setValueAtTime(1000, now);
                gain.gain.setValueAtTime(vol * 0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;
                
            case 'pixel':
                // Classic 8-bit pickup
                osc.type = 'square';
                osc.frequency.setValueAtTime(660, now);
                osc.frequency.setValueAtTime(880, now + 0.04);
                osc.frequency.setValueAtTime(1100, now + 0.08);
                gain.gain.setValueAtTime(vol * 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
                
            case 'win95':
                // Windows ding
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(vol * 0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
                
            case 'nokia':
                // Nokia beep
                osc.type = 'square';
                osc.frequency.setValueAtTime(1397, now);
                osc.frequency.setValueAtTime(1568, now + 0.05);
                gain.gain.setValueAtTime(vol * 0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;
                
            case 'oscilloscope':
                // Clean sine sweep
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gain.gain.setValueAtTime(vol * 0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
                
            default:
                // Default swoosh
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gain.gain.setValueAtTime(vol * 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
        }
    },
    
    playBombSound(bg, ctx, now, vol) {
        // Win95 - classic Windows error sound (chord)
        if (bg === 'win95') {
            const frequencies = [523, 392, 330]; // C5, G4, E4 - error chord
            frequencies.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(vol * 0.25, now);
                gain.gain.setValueAtTime(vol * 0.25, now + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            });
            // Add characteristic "ding" 
            const ding = ctx.createOscillator();
            const dingGain = ctx.createGain();
            ding.connect(dingGain);
            dingGain.connect(ctx.destination);
            ding.type = 'sine';
            ding.frequency.setValueAtTime(880, now);
            ding.frequency.setValueAtTime(440, now + 0.1);
            dingGain.gain.setValueAtTime(vol * 0.3, now);
            dingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            ding.start(now);
            ding.stop(now + 0.3);
            return;
        }
        
        // Nokia - snake crash into wall (short buzz + thud)
        if (bg === 'nokia') {
            // Buzz
            const buzz = ctx.createOscillator();
            const buzzGain = ctx.createGain();
            buzz.connect(buzzGain);
            buzzGain.connect(ctx.destination);
            buzz.type = 'square';
            buzz.frequency.setValueAtTime(150, now);
            buzzGain.gain.setValueAtTime(vol * 0.25, now);
            buzzGain.gain.setValueAtTime(vol * 0.25, now + 0.05);
            buzzGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            buzz.start(now);
            buzz.stop(now + 0.1);
            // Thud
            const thud = ctx.createOscillator();
            const thudGain = ctx.createGain();
            thud.connect(thudGain);
            thudGain.connect(ctx.destination);
            thud.type = 'sine';
            thud.frequency.setValueAtTime(80, now + 0.05);
            thud.frequency.exponentialRampToValueAtTime(40, now + 0.15);
            thudGain.gain.setValueAtTime(vol * 0.4, now + 0.05);
            thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            thud.start(now + 0.05);
            thud.stop(now + 0.2);
            return;
        }
        
        // Create noise for explosion (other backgrounds)
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        filter.type = 'lowpass';
        
        switch(bg) {
            case 'matrix':
            case 'crt':
                filter.frequency.setValueAtTime(2000, now);
                filter.frequency.exponentialRampToValueAtTime(200, now + 0.2);
                noiseGain.gain.setValueAtTime(vol * 0.4, now);
                break;
            case 'pixel':
            case 'retro':
                // 8-bit explosion
                filter.frequency.setValueAtTime(800, now);
                noiseGain.gain.setValueAtTime(vol * 0.3, now);
                break;
            case 'space':
                filter.frequency.setValueAtTime(3000, now);
                filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);
                noiseGain.gain.setValueAtTime(vol * 0.35, now);
                break;
            case 'neon':
                // Electric overload
                filter.frequency.setValueAtTime(4000, now);
                filter.frequency.exponentialRampToValueAtTime(500, now + 0.15);
                noiseGain.gain.setValueAtTime(vol * 0.35, now);
                break;
            default:
                filter.frequency.setValueAtTime(1500, now);
                filter.frequency.exponentialRampToValueAtTime(200, now + 0.25);
                noiseGain.gain.setValueAtTime(vol * 0.4, now);
        }
        
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        noise.start(now);
        noise.stop(now + 0.3);
        
        // Add low boom
        const boom = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boom.connect(boomGain);
        boomGain.connect(ctx.destination);
        boom.type = 'sine';
        boom.frequency.setValueAtTime(80, now);
        boom.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        boomGain.gain.setValueAtTime(vol * 0.5, now);
        boomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        boom.start(now);
        boom.stop(now + 0.25);
    },
    
    
    // Background music system - MP3 files
    bgMusicFiles: {
        'default': '/audio/matrix.mp3',
        'matrix': '/audio/matrix.mp3',
        'blockchain': '/audio/blochchain.mp3',
        'neon': '/audio/neon_city.mp3',
        'circuit': '/audio/circuit.mp3',
        'space': '/audio/space.mp3',
        'waves': '/audio/waves.mp3',
        'retro': '/audio/retro.mp3',
        'crt': '/audio/crt.mp3',
        'pixel': '/audio/pixel.mp3',
        'win95': '/audio/win95.mp3',
        'nokia': '/audio/nokia.mp3',
        'oscilloscope': '/audio/oscillo.mp3'
    },
    
    // Volume multipliers per background (1.0 = default, 1.25 = 25% louder)
    bgMusicVolume: {
        'default': 1.25,
        'matrix': 1.25,
        'blockchain': 1.0,
        'neon': 1.0,
        'circuit': 1.25,
        'space': 1.25,
        'waves': 1.25,
        'retro': 1.0,
        'crt': 1.0,
        'pixel': 1.0,
        'win95': 1.0,
        'nokia': 1.0,
        'oscilloscope': 1.25
    },
    
    bgAudio: null,
    currentMusicFile: null,
    menuAudio: null,
    
    startMenuMusic() {
        if (!this.musicEnabled) return;
        // Check if already playing (not just exists)
        if (this.menuAudio && !this.menuAudio.paused) return;
        
        // Stop any existing audio object
        if (this.menuAudio) {
            this.menuAudio.pause();
            this.menuAudio = null;
        }
        
        this.menuAudio = new Audio('/audio/intro.mp3');
        this.menuAudio.loop = true;
        this.menuAudio.volume = Math.min(1.0, this.musicVolume * 1.25);
        this.menuAudio.play().catch(e => console.log('Menu audio play failed:', e));
    },
    
    stopMenuMusic() {
        if (this.menuAudio) {
            this.menuAudio.pause();
            this.menuAudio.currentTime = 0;
            this.menuAudio = null;
        }
    },
    
    playClickSound() {
        if (!this.audioCtx || !this.soundEnabled) return;
        const ctx = this.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    },
    
    startMusic() {
        if (!this.musicEnabled) return;
        
        // Get music file for current background
        const musicFile = this.bgMusicFiles[this.currentBg] || this.bgMusicFiles['default'];
        
        // If same music is already playing, don't restart
        if (this.bgAudio && this.currentMusicFile === musicFile && !this.bgAudio.paused) {
            return;
        }
        
        // Stop any existing music
        this.stopMusic();
        
        // Get volume multiplier for this background
        const volMultiplier = this.bgMusicVolume[this.currentBg] || 1.0;
        
        // Create audio element
        this.bgAudio = new Audio(musicFile);
        this.bgAudio.loop = true;
        this.bgAudio.volume = Math.min(1.0, this.musicVolume * volMultiplier);
        this.bgAudio.play().catch(e => console.log('Audio play failed:', e));
        
        this.currentMusicFile = musicFile;
        this.musicPlaying = true;
    },
    
    stopMusic() {
        if (this.bgAudio) {
            this.bgAudio.pause();
            this.bgAudio.currentTime = 0;
            this.bgAudio = null;
        }
        this.currentMusicFile = null;
        this.musicPlaying = false;
    },
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('soundBtn');
        if (btn) {
            btn.textContent = this.soundEnabled ? ')) SFX' : '× SFX';
            btn.classList.toggle('off', !this.soundEnabled);
        }
    },
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const btn = document.getElementById('musicBtn');
        if (btn) {
            btn.textContent = this.musicEnabled ? '♪ Music' : '× Music';
            btn.classList.toggle('off', !this.musicEnabled);
        }
        if (this.musicEnabled) {
            if (this.state === 'menu') {
                this.startMenuMusic();
            } else if (this.state === 'playing' || this.state === 'gameover') {
                this.startMusic();
            }
        } else {
            this.stopMusic();
            this.stopMenuMusic();
        }
    },
    
    start(mode) {
        // Stop menu music
        this.stopMenuMusic();
        
        this.mode = mode;
        this.state = 'playing';
        this.score = 0; this.combo = 0; this.lives = 3; this.timeLeft = 60;
        this.coins = []; this.pieces = []; this.particles = []; this.texts = []; this.moneyParticles = []; this.bladeParticles = [];
        this.matrixInitialized = false;
        this.blockchainInitialized = false;
        this.neonInitialized = false;
        this.circuitInitialized = false;
        this.spaceInitialized = false;
        this.wavesInitialized = false;
        
        // Initialize game session for anti-cheat verification
        this.gameSession = {
            mode: mode,
            startTime: Date.now(),
            actions: [],
            version: '1.0'
        };
        
        // Start background music
        this.startMusic();
        
        this.updateScore();
        if (mode === 'classic') {
            this.updateLives();
            document.getElementById('timer').textContent = '';
        } else {
            document.getElementById('lives').innerHTML = '';
            this.updateTimer();
            this.gameTimer = setInterval(() => {
                if (--this.timeLeft <= 0) this.end('time');
                this.updateTimer();
            }, 1000);
        }
        
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('gameover').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
        
        this.spawnWave();
        this.waveTimer = setInterval(() => this.spawnWave(), 3000);
    },
    
    spawnWave() {
        if (this.state !== 'playing') return;
        const count = this.mode === 'arcade' ? 3 + Math.floor(Math.random()*4) : 1 + Math.floor(Math.random()*3);
        for (let i = 0; i < count; i++) {
            // 10% bomb chance (was 8%)
            setTimeout(() => this.spawnCoin(Math.random() < 0.10), i * 150);
        }
    },
    
    spawnCoin(isBomb) {
        if (this.state !== 'playing') return;
        const r = 40;
        const x = r + Math.random() * (this.W - r*2);
        const vy = -(13 + Math.random() * 5);
        this.coins.push({
            x, y: this.H + r,
            vx: (Math.random() - 0.5) * 4,
            vy,
            r,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            id: isBomb ? 'BOMB' : this.cryptos[Math.floor(Math.random() * this.cryptos.length)],
            isBomb,
            sliced: false
        });
    },
    
    updateScore() { document.getElementById('score').textContent = this.score; },
    updateTimer() {
        const el = document.getElementById('timer');
        el.textContent = this.timeLeft + 's';
        el.classList.toggle('warning', this.timeLeft <= 10);
    },
    updateLives() {
        const c = document.getElementById('lives');
        c.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const d = document.createElement('div');
            d.className = 'life' + (i >= this.lives ? ' lost' : '');
            c.appendChild(d);
        }
    },
    updateCombo() {
        const el = document.getElementById('combo');
        if (this.combo >= 3 && this.mode === 'classic') {
            el.textContent = 'COMBO x' + this.combo + ' ❤️';
        } else {
            el.textContent = 'COMBO x' + this.combo;
        }
        el.classList.toggle('active', this.combo >= 2);
    },
    
    pos(e) { const t = e.touches?.[0] || e; return {x: t.clientX, y: t.clientY}; },
    down(e) { e.preventDefault(); this.slicing = true; this.lastPos = this.pos(e); this.trail = [{...this.lastPos, t: Date.now()}]; },
    move(e) {
        e.preventDefault();
        if (!this.slicing || this.state !== 'playing') return;
        const p = this.pos(e);
        this.trail.push({...p, t: Date.now()});
        if (this.trail.length > 30) this.trail.shift();
        
        // Spawn particles along the trail based on blade type
        if (this.lastPos && Math.random() < 0.4) {
            this.spawnBladeParticle(p.x, p.y);
        }
        
        if (this.lastPos) this.checkSlice(this.lastPos, p);
        this.lastPos = p;
    },
    up() { this.slicing = false; this.lastPos = null; },
    
    spawnBladeParticle(x, y) {
        const blade = this.currentBlade;
        const px = x + (Math.random() - 0.5) * 40;
        const py = y + (Math.random() - 0.5) * 40;
        const vx = (Math.random() - 0.5) * 5;
        const vy = (Math.random() - 0.5) * 5;
        
        switch(blade) {
            case 'money':
                this.moneyParticles.push({
                    x: px, y: py, vx: vx, vy: vy + 1,
                    rot: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.2,
                    scale: 0.4 + Math.random() * 0.4, a: 1
                });
                break;
            case 'bitcoin':
                this.bladeParticles.push({
                    type: 'text', text: '₿', x: px, y: py, vx: vx, vy: vy,
                    size: 14 + Math.random() * 10, color: '#FFD700', a: 1,
                    rot: Math.random() * 0.5 - 0.25, rotSpeed: (Math.random() - 0.5) * 0.1
                });
                break;
            case 'ethereum':
                this.bladeParticles.push({
                    type: 'diamond', x: px, y: py, vx: vx, vy: vy,
                    size: 8 + Math.random() * 6, color: '#8B5CF6', a: 1,
                    rot: Math.random() * Math.PI, rotSpeed: (Math.random() - 0.5) * 0.15
                });
                break;
            case 'base':
                this.bladeParticles.push({
                    type: 'baselogo', x: px, y: py, vx: vx, vy: vy,
                    size: 16 + Math.random() * 8, a: 1,
                    rot: 0, rotSpeed: (Math.random() - 0.5) * 0.1
                });
                break;
            case 'matrix':
                const nums = '01';
                this.bladeParticles.push({
                    type: 'text', text: nums[Math.floor(Math.random() * 2)],
                    x: px, y: py, vx: vx * 0.5, vy: Math.random() * 4 + 2,
                    size: 12 + Math.random() * 8, color: '#00FF00', a: 1,
                    rot: 0, rotSpeed: 0
                });
                break;
            case 'blockchain':
                this.bladeParticles.push({
                    type: 'square', x: px, y: py, vx: vx, vy: vy,
                    size: 6 + Math.random() * 8, color: '#00BFFF', a: 1,
                    rot: Math.random() * Math.PI / 4, rotSpeed: (Math.random() - 0.5) * 0.2
                });
                break;
            case 'quantum':
                const hue = (Date.now() * 0.1) % 360;
                this.bladeParticles.push({
                    type: 'circle', x: px, y: py, vx: vx, vy: vy,
                    size: 4 + Math.random() * 4, color: `hsl(${hue + Math.random() * 60}, 100%, 60%)`, a: 1
                });
                break;
            case 'pixel':
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
                this.bladeParticles.push({
                    type: 'pixel', x: Math.floor(px / 5) * 5, y: Math.floor(py / 5) * 5,
                    vx: vx, vy: vy, size: 5,
                    color: colors[Math.floor(Math.random() * colors.length)], a: 1
                });
                break;
            case 'neural':
                this.bladeParticles.push({
                    type: 'node', x: px, y: py, vx: vx * 0.5, vy: vy * 0.5,
                    size: 5 + Math.random() * 4, color: '#90CAF9', a: 1
                });
                break;
            case 'candle':
                this.bladeParticles.push({
                    type: 'candle', x: px, y: py, vx: vx * 0.7, vy: -Math.random() * 3 - 1,
                    width: 4 + Math.random() * 3, height: 10 + Math.random() * 10, a: 1,
                    rot: (Math.random() - 0.5) * 0.3, rotSpeed: (Math.random() - 0.5) * 0.05
                });
                break;
        }
    },
    
    spawnMoneyParticle(x, y) {
        this.moneyParticles.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3 + 1,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.2,
            scale: 0.4 + Math.random() * 0.4,
            a: 1
        });
    },
    
    checkSlice(a, b) {
        for (const c of this.coins) {
            if (c.sliced) continue;
            const dx = c.x - a.x, dy = c.y - a.y;
            const bx = b.x - a.x, by = b.y - a.y;
            const t = Math.max(0, Math.min(1, (dx*bx + dy*by) / (bx*bx + by*by || 1)));
            if (Math.hypot(c.x - (a.x + t*bx), c.y - (a.y + t*by)) < c.r * 1.1) {
                this.slice(c, a, b);
            }
        }
    },
    
    slice(c, a, b) {
        c.sliced = true;
        
        // Play slice sound
        this.playSliceSound(c.isBomb);
        
        if (c.isBomb) {
            // Oscilloscope bomb reaction
            if (this.currentBg === 'oscilloscope') {
                if (!this.oscReactions) this.oscReactions = [];
                this.oscReactions.push({ type: 'bomb', intensity: 0.8, age: 0 });
            }
            
            for (let i = 0; i < 15; i++) {
                const ang = Math.random() * Math.PI * 2;
                this.particles.push({x: c.x, y: c.y, vx: Math.cos(ang)*7, vy: Math.sin(ang)*7 - 4, r: 5+Math.random()*6, color: ['#FF6600','#FF9900','#FFCC00','#FF4400'][Math.floor(Math.random()*4)], a: 1});
            }
            
            if (this.mode === 'classic') {
                // Bomb removes 1 life in classic mode
                this.combo = 0;
                this.updateCombo();
                this.lives--;
                this.updateLives();
                this.texts.push({x: c.x, y: c.y, text: '💥 -1 ❤️', color: '#EF4444', a: 1, vy: -2});
                
                // Record bomb hit for anti-cheat
                if (this.gameSession) {
                    this.gameSession.actions.push({
                        type: 'bomb',
                        timestamp: Date.now()
                    });
                }
                
                if (this.lives <= 0) return this.end('lives');
                return;
            }
            
            // Arcade mode - just lose points
            this.score = Math.max(0, this.score - 10);
            this.updateScore();
            this.texts.push({x: c.x, y: c.y, text: '-10', color: '#EF4444', a: 1, vy: -2});
            return;
        }
        
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        for (let i = 0; i < 2; i++) {
            const dir = i === 0 ? 1 : -1;
            this.pieces.push({
                x: c.x, y: c.y,
                vx: c.vx + Math.cos(ang + Math.PI/2) * dir * 3,
                vy: c.vy - 2,
                r: c.r,
                rot: c.rot,
                rotSpeed: c.rotSpeed + dir * 0.15,
                id: c.id,
                half: i,
                sliceAng: ang,
                a: 1
            });
        }
        
        for (let i = 0; i < 6; i++) {
            const ang = Math.random() * Math.PI * 2;
            let color;
            if (this.currentBg === 'blockchain') {
                color = '#00c8ff';
            } else if (this.currentBg === 'neon') {
                color = '#00ffff';
            } else if (this.currentBg === 'circuit') {
                color = ['#00ff88', '#00ffaa', '#ffff00', '#ffffff'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'space') {
                color = ['#9966ff', '#ff66cc', '#66ccff', '#ffffff'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'waves') {
                color = ['#66ddff', '#88eeff', '#aaffff', '#ffffff'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'retro') {
                color = ['#ff00ff', '#00ffff', '#ff6699', '#ffff00'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'crt') {
                color = ['#00ff00', '#00cc00', '#00aa00', '#88ff88'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'pixel') {
                color = ['#FFD700', '#FFA500', '#ffffff', '#ff0000'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'win95') {
                color = ['#000080', '#008080', '#c0c0c0', '#ffffff'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'nokia') {
                color = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'][Math.floor(Math.random() * 4)];
            } else if (this.currentBg === 'oscilloscope') {
                color = ['#00ff00', '#00ffff', '#ffff00', '#ffffff'][Math.floor(Math.random() * 4)];
            } else {
                color = '#0052FF';
            }
            this.particles.push({x: c.x, y: c.y, vx: Math.cos(ang)*5, vy: Math.sin(ang)*5 - 2, r: 3+Math.random()*4, color: color, a: 1});
        }
        
        // Extra electric sparks for circuit background
        if (this.currentBg === 'circuit') {
            for (let i = 0; i < 4; i++) {
                const ang = Math.random() * Math.PI * 2;
                this.particles.push({
                    x: c.x, y: c.y,
                    vx: Math.cos(ang) * (8 + Math.random() * 5),
                    vy: Math.sin(ang) * (8 + Math.random() * 5) - 3,
                    r: 1 + Math.random() * 2,
                    color: '#ffffff',
                    a: 1
                });
            }
        }
        
        // Cosmic dust for space background
        if (this.currentBg === 'space') {
            for (let i = 0; i < 5; i++) {
                const ang = Math.random() * Math.PI * 2;
                this.particles.push({
                    x: c.x, y: c.y,
                    vx: Math.cos(ang) * (4 + Math.random() * 4),
                    vy: Math.sin(ang) * (4 + Math.random() * 4),
                    r: 1 + Math.random() * 3,
                    color: ['#cc99ff', '#ff99cc', '#99ccff'][Math.floor(Math.random() * 3)],
                    a: 1
                });
            }
        }
        
        // Bubbles for waves background
        if (this.currentBg === 'waves') {
            for (let i = 0; i < 6; i++) {
                const ang = Math.random() * Math.PI * 2;
                this.particles.push({
                    x: c.x, y: c.y,
                    vx: Math.cos(ang) * (3 + Math.random() * 3),
                    vy: Math.sin(ang) * (3 + Math.random() * 3) - 4, // Bubbles float up
                    r: 2 + Math.random() * 5,
                    color: ['#66ddff', '#88eeff', '#ffffff'][Math.floor(Math.random() * 3)],
                    a: 1
                });
            }
        }
        
        // Neon sparks for retro background
        if (this.currentBg === 'retro') {
            for (let i = 0; i < 5; i++) {
                const ang = Math.random() * Math.PI * 2;
                this.particles.push({
                    x: c.x,
                    y: c.y,
                    vx: Math.cos(ang) * (5 + Math.random() * 5),
                    vy: Math.sin(ang) * (5 + Math.random() * 5),
                    r: 2 + Math.random() * 4,
                    color: ['#ff00ff', '#00ffff', '#ffff00'][Math.floor(Math.random() * 3)],
                    a: 1
                });
            }
        }
        
        let pts = 1;
        if (this.mode === 'arcade') {
            this.combo++;
            clearTimeout(this.comboTimer);
            this.comboTimer = setTimeout(() => { this.combo = 0; this.updateCombo(); }, 1000);
            if (this.combo >= 2) pts = this.combo;
        } else if (this.mode === 'classic') {
            // Classic mode also has combo, but restores life at 3
            this.combo++;
            clearTimeout(this.comboTimer);
            this.comboTimer = setTimeout(() => { this.combo = 0; this.updateCombo(); }, 1000);
            
            // Combo of 3 restores 1 life (max 3 lives)
            if (this.combo === 3 && this.lives < 3) {
                this.lives++;
                this.updateLives();
                this.texts.push({x: c.x, y: c.y - 40, text: '+1 ❤️', color: '#22C55E', a: 1, vy: -3});
            }
            
            // Bonus points for combo
            if (this.combo >= 2) pts = this.combo;
        }
        this.score += pts;
        this.updateScore();
        this.updateCombo();
        
        // Record action for anti-cheat verification
        if (this.gameSession) {
            this.gameSession.actions.push({
                type: 'slice',
                coinType: c.id,
                timestamp: Date.now(),
                combo: this.combo,
                points: pts
            });
        }
        
        // Oscilloscope coin reaction
        if (this.currentBg === 'oscilloscope') {
            if (!this.oscReactions) this.oscReactions = [];
            this.oscReactions.push({ type: 'coin', intensity: 0.5 + pts * 0.2, age: 0 });
        }
        
        let textColor;
        if (this.currentBg === 'blockchain') {
            textColor = pts > 1 ? '#00ffff' : '#00c8ff';
        } else if (this.currentBg === 'neon') {
            textColor = pts > 1 ? '#ff00ff' : '#00ffff';
        } else if (this.currentBg === 'circuit') {
            textColor = pts > 1 ? '#00ff88' : '#00ffaa';
        } else if (this.currentBg === 'space') {
            textColor = pts > 1 ? '#ff66cc' : '#9966ff';
        } else if (this.currentBg === 'waves') {
            textColor = pts > 1 ? '#66ffff' : '#66ddff';
        } else if (this.currentBg === 'retro') {
            textColor = pts > 1 ? '#ffff00' : '#ff00ff';
        } else if (this.currentBg === 'crt') {
            textColor = pts > 1 ? '#00ff00' : '#00aa00';
        } else if (this.currentBg === 'pixel') {
            textColor = pts > 1 ? '#FFD700' : '#FFA500';
        } else if (this.currentBg === 'win95') {
            textColor = pts > 1 ? '#000080' : '#0000ff';
        } else if (this.currentBg === 'nokia') {
            textColor = pts > 1 ? '#0f380f' : '#306230';
        } else if (this.currentBg === 'oscilloscope') {
            textColor = pts > 1 ? '#00ffff' : '#00ff00';
        } else {
            textColor = pts > 1 ? '#F59E0B' : '#0052FF';
        }
        this.texts.push({x: c.x, y: c.y, text: '+' + pts, color: textColor, a: 1, vy: -2});
    },
    
    end(reason) {
        this.state = 'gameover';
        clearInterval(this.waveTimer);
        clearInterval(this.gameTimer);
        
        // Finalize game session for anti-cheat
        if (this.gameSession) {
            this.gameSession.endTime = Date.now();
            this.gameSession.finalLives = this.lives;
            this.gameSession.finalScore = this.score;
        }
        
        // Music continues playing during game over screen
        document.getElementById('hud').classList.add('hidden');
        setTimeout(() => {
            document.getElementById('goTitle').textContent = {lives:'GAME OVER',time:"TIME'S UP"}[reason] || 'GAME OVER';
            document.getElementById('goScore').textContent = this.score;
            document.getElementById('gameover').classList.remove('hidden');
            
            // Show submit score modal if wallet connected and score > 0
            if (this.walletConnected && this.score > 0) {
                setTimeout(() => this.showSubmitScoreModal(), 500);
            }
        }, 100);
    },
    
    restart() { document.getElementById('gameover').classList.add('hidden'); this.start(this.mode); },
    toMenu() { this.state = 'menu'; this.stopMusic(); this.startMenuMusic(); this.matrixInitialized = false; this.blockchainInitialized = false; this.neonInitialized = false; this.circuitInitialized = false; this.spaceInitialized = false; this.wavesInitialized = false; document.getElementById('gameover').classList.add('hidden'); document.getElementById('hud').classList.add('hidden'); document.getElementById('menu').classList.remove('hidden'); },
    
    showShop() {
        document.getElementById('menu').classList.add('hidden');
        const shopEl = document.getElementById('shop');
        shopEl.classList.remove('hidden');
        shopEl.scrollTop = 0; // Scroll to top
        this.renderShop();
    },
    
    hideShop() {
        document.getElementById('shop').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
    },
    
    renderShop() {
        // Render blades
        const bladeContainer = document.getElementById('bladeItems');
        bladeContainer.innerHTML = '';
        this.blades.forEach(blade => {
            const item = document.createElement('div');
            item.className = 'shop-item' + (blade.id === this.currentBlade ? ' selected' : '') + (!blade.unlocked ? ' locked' : '');
            if (blade.unlocked) {
                item.innerHTML = `<div class="shop-item-icon">${blade.icon}</div><div class="shop-item-name">${blade.name}</div>`;
                item.onclick = () => { this.playClickSound(); this.currentBlade = blade.id; this.renderShop(); };
            } else {
                item.innerHTML = `<div class="shop-item-lock">🔒</div><div class="shop-item-icon">${blade.icon}</div><div class="shop-item-name">${blade.name}</div><div class="shop-item-price">${blade.price} USDC</div>`;
                item.onclick = () => { this.playClickSound(); this.openPurchaseModal('blade', blade); };
            }
            bladeContainer.appendChild(item);
        });
        
        // Render backgrounds
        const bgContainer = document.getElementById('bgItems');
        bgContainer.innerHTML = '';
        this.backgrounds.forEach(bg => {
            const item = document.createElement('div');
            item.className = 'shop-item' + (bg.id === this.currentBg ? ' selected' : '') + (!bg.unlocked ? ' locked' : '');
            if (bg.unlocked) {
                item.innerHTML = `<div class="shop-item-icon">${bg.icon}</div><div class="shop-item-name">${bg.name}</div>`;
                item.onclick = () => { this.playClickSound(); this.currentBg = bg.id; this.matrixInitialized = false; this.blockchainInitialized = false; this.neonInitialized = false; this.circuitInitialized = false; this.spaceInitialized = false; this.wavesInitialized = false; if (this.musicPlaying) { this.stopMusic(); this.startMusic(); } this.renderShop(); };
            } else {
                item.innerHTML = `<div class="shop-item-lock">🔒</div><div class="shop-item-icon">${bg.icon}</div><div class="shop-item-name">${bg.name}</div><div class="shop-item-price">${bg.price} USDC</div>`;
                item.onclick = () => { this.playClickSound(); this.openPurchaseModal('bg', bg); };
            }
            bgContainer.appendChild(item);
        });
        
        // Update Buy All buttons
        this.updateBuyAllButtons();
        
        // Update wallet button
        this.updateWalletButton();
    },
    
    updateBuyAllButtons() {
        // Buy all buttons work without wallet connection (Base Pay handles it)
        
        // Count locked blades
        const lockedBlades = this.blades.filter(b => !b.unlocked);
        const bladesBtn = document.getElementById('buyAllBladesBtn');
        const bladesPriceEl = document.getElementById('bladesPrice');
        
        if (lockedBlades.length > 0) {
            const bladesTotal = lockedBlades.length;
            bladesBtn.style.display = 'block';
            bladesPriceEl.textContent = `${bladesTotal} USDC (${lockedBlades.length} items)`;
        } else {
            bladesBtn.style.display = 'none';
        }
        
        // Count locked backgrounds
        const lockedBgs = this.backgrounds.filter(bg => !bg.unlocked);
        const bgsBtn = document.getElementById('buyAllBgsBtn');
        const bgsPriceEl = document.getElementById('bgsPrice');
        
        if (lockedBgs.length > 0) {
            const bgsTotal = lockedBgs.length;
            bgsBtn.style.display = 'block';
            bgsPriceEl.textContent = `${bgsTotal} USDC (${lockedBgs.length} items)`;
        } else {
            bgsBtn.style.display = 'none';
        }
        
        // Buy Everything button
        const totalLocked = lockedBlades.length + lockedBgs.length;
        const everythingBtn = document.getElementById('buyEverythingBtn');
        const totalPriceEl = document.getElementById('totalPrice');
        
        if (totalLocked > 0) {
            everythingBtn.style.display = 'block';
            totalPriceEl.textContent = `${totalLocked} USDC (${totalLocked} items)`;
        } else {
            everythingBtn.style.display = 'none';
        }
    },
    
    // Wallet functions
    async connectWallet() {
        this.playClickSound();
        
        // Show wallet selection modal
        document.getElementById('walletModal').classList.add('show');
    },
    
    closeWalletModal() {
        this.playClickSound();
        document.getElementById('walletModal').classList.remove('show');
    },
    
    async connectMetaMask() {
        this.closeWalletModal();
        await this.connectWithProvider('metamask');
    },
    
    async connectCoinbase() {
        this.closeWalletModal();
        await this.connectWithProvider('coinbase');
    },
    
    async connectInjected() {
        this.closeWalletModal();
        await this.connectWithProvider('injected');
    },
    
    async connectWithProvider(walletType) {
        if (!window.ethereum) {
            if (walletType === 'metamask') {
                alert('MetaMask not detected. Please install MetaMask extension.');
                window.open('https://metamask.io/download/', '_blank');
            } else if (walletType === 'coinbase') {
                alert('Coinbase Wallet not detected. Please install Coinbase Wallet.');
                window.open('https://www.coinbase.com/wallet', '_blank');
            } else {
                alert('No wallet detected. Please install MetaMask or Coinbase Wallet.');
            }
            return;
        }
        
        try {
            let selectedProvider = window.ethereum;
            
            // Try to find specific wallet if multiple providers
            if (window.ethereum.providers && window.ethereum.providers.length > 0) {
                if (walletType === 'metamask') {
                    const metamask = window.ethereum.providers.find(p => p.isMetaMask && !p.isBraveWallet);
                    if (metamask) selectedProvider = metamask;
                } else if (walletType === 'coinbase') {
                    const coinbase = window.ethereum.providers.find(p => p.isCoinbaseWallet);
                    if (coinbase) selectedProvider = coinbase;
                }
            }
            
            // Create provider
            this.provider = new ethers.BrowserProvider(selectedProvider);
            
            // Request account access
            await this.provider.send('eth_requestAccounts', []);
            
            // Check if on Base network
            const network = await this.provider.getNetwork();
            if (Number(network.chainId) !== this.BASE_CHAIN_ID) {
                // Try to switch to Base
                try {
                    await selectedProvider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x2105' }],
                    });
                } catch (switchError) {
                    // If Base is not added, add it
                    if (switchError.code === 4902) {
                        await selectedProvider.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x2105',
                                chainName: 'Base',
                                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                                rpcUrls: ['https://mainnet.base.org'],
                                blockExplorerUrls: ['https://basescan.org']
                            }]
                        });
                    } else {
                        throw switchError;
                    }
                }
                // Recreate provider after chain switch
                this.provider = new ethers.BrowserProvider(selectedProvider);
            }
            
            this.signer = await this.provider.getSigner();
            this.walletAddress = await this.signer.getAddress();
            this.walletConnected = true;
            
            // Load saved purchases for this wallet
            this.loadPurchases();
            
            this.updateWalletButton();
            this.renderShop();
            
            console.log(`Connected with ${walletType}:`, this.walletAddress);
            
        } catch (error) {
            console.error('Wallet connection error:', error);
            if (error.message && !error.message.includes('rejected') && !error.message.includes('denied')) {
                alert('Failed to connect wallet: ' + error.message);
            }
        }
    },
    
    updateWalletButton() {
        const btn = document.getElementById('walletBtn');
        const addrDiv = document.getElementById('walletAddress');
        
        if (this.walletConnected && this.walletAddress) {
            btn.textContent = 'Connected ✓';
            btn.classList.add('connected');
            addrDiv.textContent = this.walletAddress.slice(0, 6) + '...' + this.walletAddress.slice(-4);
        } else {
            btn.textContent = 'Connect Wallet';
            btn.classList.remove('connected');
            addrDiv.textContent = '';
        }
    },
    
    // Load purchases from localStorage for current wallet or device
    loadPurchases() {
        const keyId = this.walletAddress ? this.walletAddress.toLowerCase() : 'device';
        const key = `baseninja_${keyId}`;
        const saved = localStorage.getItem(key);
        
        // Also load device purchases if wallet is connected (merge both)
        const deviceSaved = this.walletAddress ? localStorage.getItem('baseninja_device') : null;
        
        const loadData = (dataStr) => {
            if (!dataStr) return;
            try {
                const data = JSON.parse(dataStr);
                if (data.blades) {
                    data.blades.forEach(bladeId => {
                        const blade = this.blades.find(b => b.id === bladeId);
                        if (blade) blade.unlocked = true;
                    });
                }
                if (data.backgrounds) {
                    data.backgrounds.forEach(bgId => {
                        const bg = this.backgrounds.find(b => b.id === bgId);
                        if (bg) bg.unlocked = true;
                    });
                }
            } catch (e) {
                console.error('Failed to load purchases:', e);
            }
        };
        
        loadData(saved);
        loadData(deviceSaved);
        
        console.log('Purchases loaded for', keyId);
        
        // Also check onchain (async, will update UI when done)
        this.loadPurchasesOnchain();
    },
    
    // Load purchases from smart contract (onchain verification)
    async loadPurchasesOnchain() {
        if (!this.walletAddress || !this.provider) return;
        
        // Check if shop contract is configured
        if (this.SHOP_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
            console.log('Shop contract not configured, using localStorage only');
            return;
        }
        
        try {
            const shopContract = new ethers.Contract(
                this.SHOP_CONTRACT_ADDRESS, 
                this.SHOP_ABI, 
                this.provider
            );
            
            // Collect all locked items to check
            const itemTypes = [];
            const itemIds = [];
            
            this.blades.forEach(blade => {
                if (!blade.unlocked && blade.price) {
                    itemTypes.push('blade');
                    itemIds.push(blade.id);
                }
            });
            
            this.backgrounds.forEach(bg => {
                if (!bg.unlocked && bg.price) {
                    itemTypes.push('bg');
                    itemIds.push(bg.id);
                }
            });
            
            if (itemTypes.length === 0) return;
            
            // Bulk check purchases onchain
            const results = await shopContract.getBulkPurchases(
                this.walletAddress,
                itemTypes,
                itemIds
            );
            
            let updated = false;
            const key = `baseninja_${this.walletAddress.toLowerCase()}`;
            let cacheData = { blades: [], backgrounds: [] };
            
            try {
                const saved = localStorage.getItem(key);
                if (saved) cacheData = JSON.parse(saved);
            } catch (e) {}
            
            // Unlock purchased items
            for (let i = 0; i < results.length; i++) {
                if (results[i]) {
                    const type = itemTypes[i];
                    const id = itemIds[i];
                    
                    if (type === 'blade') {
                        const blade = this.blades.find(b => b.id === id);
                        if (blade && !blade.unlocked) {
                            blade.unlocked = true;
                            updated = true;
                            if (!cacheData.blades.includes(id)) cacheData.blades.push(id);
                        }
                    } else {
                        const bg = this.backgrounds.find(b => b.id === id);
                        if (bg && !bg.unlocked) {
                            bg.unlocked = true;
                            updated = true;
                            if (!cacheData.backgrounds.includes(id)) cacheData.backgrounds.push(id);
                        }
                    }
                }
            }
            
            // Update cache with onchain data
            if (updated) {
                localStorage.setItem(key, JSON.stringify(cacheData));
                this.renderShop();
                console.log('Purchases verified onchain for', this.walletAddress);
            }
            
            // Also load player's best scores and nickname for leaderboard
            try {
                for (let mode = 0; mode <= 1; mode++) {
                    this.myBestScores[mode] = Number(await shopContract.playerBestScore(this.walletAddress, mode));
                }
                this.currentNickname = await shopContract.playerNickname(this.walletAddress);
                console.log('Player stats loaded:', this.myBestScores, this.currentNickname);
            } catch (e) {
                console.log('Could not load player stats:', e.message);
            }
            
        } catch (error) {
            console.error('Failed to load purchases onchain:', error);
            // localStorage data is still used as fallback
        }
    },
    
    // Save purchase to localStorage
    savePurchase(type, itemId) {
        // Use wallet address if connected, otherwise device-based key
        const keyId = this.walletAddress ? this.walletAddress.toLowerCase() : 'device';
        const key = `baseninja_${keyId}`;
        let data = { blades: [], backgrounds: [] };
        
        // Load existing data
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                data = JSON.parse(saved);
            } catch (e) {}
        }
        
        // Add new purchase
        if (type === 'blade' && !data.blades.includes(itemId)) {
            data.blades.push(itemId);
        } else if (type === 'bg' && !data.backgrounds.includes(itemId)) {
            data.backgrounds.push(itemId);
        }
        
        // Save
        localStorage.setItem(key, JSON.stringify(data));
        console.log('Purchase saved:', type, itemId);
    },
    
    openPurchaseModal(type, item) {
        this.pendingPurchase = { type, item };
        
        document.getElementById('modalItem').textContent = item.icon;
        document.getElementById('modalName').textContent = item.name;
        document.getElementById('modalPrice').textContent = item.price + ' USDC';
        document.getElementById('modalStatus').textContent = '';
        document.getElementById('buyBtn').disabled = false;
        document.getElementById('purchaseModal').classList.add('show');
    },
    
    closePurchaseModal() {
        this.playClickSound();
        document.getElementById('purchaseModal').classList.remove('show');
        this.pendingPurchase = null;
    },
    
    async confirmPurchase() {
        if (!this.pendingPurchase) return;
        
        const statusEl = document.getElementById('modalStatus');
        const buyBtn = document.getElementById('buyBtn');
        
        buyBtn.disabled = true;
        statusEl.textContent = 'Opening payment...';
        
        const isBatch = this.pendingPurchase.type === 'batch';
        
        try {
            // Use Base Pay SDK - handles wallet, USDC transfer, gas sponsorship
            if (typeof window.base === 'undefined' || typeof window.base.pay !== 'function') {
                throw new Error('Base Pay SDK not loaded. Please refresh the page.');
            }
            
            const amount = isBatch 
                ? this.pendingPurchase.totalPrice.toString()
                : this.pendingPurchase.item.price.toString();
            
            const payment = await window.base.pay({
                amount,
                to: this.RECEIVER_ADDRESS,
                testnet: false
            });
            
            console.log('Payment successful:', payment);
            statusEl.textContent = 'Payment confirmed! Unlocking...';
            
            if (isBatch) {
                // Unlock all batch items
                this.pendingPurchase.items.forEach(({ type, item }) => {
                    if (type === 'blade') {
                        const blade = this.blades.find(b => b.id === item.id);
                        if (blade) {
                            blade.unlocked = true;
                            this.savePurchase('blade', item.id);
                        }
                    } else {
                        const bg = this.backgrounds.find(b => b.id === item.id);
                        if (bg) {
                            bg.unlocked = true;
                            this.savePurchase('bg', item.id);
                        }
                    }
                });
                
                // Save batch receipt
                try {
                    const receipts = JSON.parse(localStorage.getItem('baseninja_receipts') || '[]');
                    receipts.push({
                        type: 'batch',
                        items: this.pendingPurchase.items.map(i => ({ type: i.type, id: i.item.id })),
                        txId: payment.id, amount: payment.amount, to: payment.to,
                        timestamp: Date.now()
                    });
                    localStorage.setItem('baseninja_receipts', JSON.stringify(receipts));
                } catch (e) { console.warn('Failed to save receipt:', e); }
                
                const count = this.pendingPurchase.items.length;
                statusEl.textContent = `Success! ${count} items unlocked!`;
            } else {
                // Single item unlock
                const { type, item } = this.pendingPurchase;
                if (type === 'blade') {
                    const blade = this.blades.find(b => b.id === item.id);
                    if (blade) blade.unlocked = true;
                } else {
                    const bg = this.backgrounds.find(b => b.id === item.id);
                    if (bg) bg.unlocked = true;
                }
                
                this.savePurchase(type, item.id);
                
                try {
                    const receipts = JSON.parse(localStorage.getItem('baseninja_receipts') || '[]');
                    receipts.push({
                        type, itemId: item.id, txId: payment.id,
                        amount: payment.amount, to: payment.to,
                        timestamp: Date.now()
                    });
                    localStorage.setItem('baseninja_receipts', JSON.stringify(receipts));
                } catch (e) { console.warn('Failed to save receipt:', e); }
                
                statusEl.textContent = 'Success! Item unlocked!';
            }
            
            setTimeout(() => {
                this.closePurchaseModal();
                this.renderShop();
            }, 1500);
            
        } catch (error) {
            console.error('Purchase error:', error);
            statusEl.textContent = 'Error: ' + (error.message || 'Payment failed');
            buyBtn.disabled = false;
        }
    },
    
    async buyAllBlades() {
        this.playClickSound();
        await this.buyMultipleItems('blade');
    },
    
    async buyAllBackgrounds() {
        this.playClickSound();
        await this.buyMultipleItems('bg');
    },
    
    async buyEverything() {
        this.playClickSound();
        await this.buyMultipleItems('all');
    },
    
    async buyMultipleItems(category) {
        // Collect locked items
        let items = [];
        
        if (category === 'blade' || category === 'all') {
            this.blades.filter(b => !b.unlocked).forEach(blade => {
                items.push({ type: 'blade', item: blade });
            });
        }
        
        if (category === 'bg' || category === 'all') {
            this.backgrounds.filter(bg => !bg.unlocked).forEach(bg => {
                items.push({ type: 'bg', item: bg });
            });
        }
        
        if (items.length === 0) {
            alert('No items to purchase!');
            return;
        }
        
        // Calculate total price
        const totalPrice = items.reduce((sum, i) => sum + i.item.price, 0);
        
        // Pick icon/name for modal
        let icon, name;
        if (category === 'blade') {
            icon = '✕';
            name = `All Blades (${items.length})`;
        } else if (category === 'bg') {
            icon = '◐';
            name = `All Backgrounds (${items.length})`;
        } else {
            icon = '∞';
            name = `Everything (${items.length} items)`;
        }
        
        // Store batch data and show the purchase modal
        this.pendingPurchase = { type: 'batch', category, items, totalPrice };
        
        document.getElementById('modalItem').textContent = icon;
        document.getElementById('modalName').textContent = name;
        document.getElementById('modalPrice').textContent = totalPrice + ' USDC';
        document.getElementById('modalStatus').textContent = '';
        document.getElementById('buyBtn').disabled = false;
        document.getElementById('purchaseModal').classList.add('show');
    },
    
    // ============ LEADERBOARD FUNCTIONS ============
    
    currentLeaderboardMode: 0, // 0 = Classic, 1 = Arcade
    leaderboardData: { 0: [], 1: [] },
    myBestScores: { 0: 0, 1: 0 },
    myRanks: { 0: 0, 1: 0 },
    currentNickname: '',
    
    showLeaderboard() {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('leaderboard').classList.remove('hidden');
        this.loadLeaderboard();
    },
    
    hideLeaderboard() {
        document.getElementById('leaderboard').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
    },
    
    switchLeaderboardTab(mode) {
        this.currentLeaderboardMode = mode;
        document.getElementById('tabClassic').classList.toggle('active', mode === 0);
        document.getElementById('tabArcade').classList.toggle('active', mode === 1);
        this.renderLeaderboard();
    },
    
    async loadLeaderboard() {
        const listEl = document.getElementById('leaderboardList');
        listEl.innerHTML = '<div class="leaderboard-loading">Loading...</div>';
        
        // Check if contract is configured
        if (this.SHOP_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
            listEl.innerHTML = '<div class="leaderboard-empty">Leaderboard not configured yet.<br>Deploy smart contract first.</div>';
            return;
        }
        
        // Need wallet for some features but can view without
        if (!this.walletConnected) {
            document.getElementById('myStats').style.display = 'none';
            document.getElementById('nicknameSection').style.display = 'none';
        }
        
        try {
            const provider = this.provider || new ethers.BrowserProvider(window.ethereum || new ethers.JsonRpcProvider('https://mainnet.base.org'));
            const shopContract = new ethers.Contract(this.SHOP_CONTRACT_ADDRESS, this.SHOP_ABI, provider);
            
            // Load both modes
            for (let mode = 0; mode <= 1; mode++) {
                const result = await shopContract.getTopScores(mode, 100);
                this.leaderboardData[mode] = [];
                
                for (let i = 0; i < result.players.length; i++) {
                    this.leaderboardData[mode].push({
                        player: result.players[i],
                        score: Number(result.scores[i]),
                        nickname: result.nicknames[i],
                        timestamp: Number(result.timestamps[i])
                    });
                }
            }
            
            // Load player stats if connected
            if (this.walletConnected && this.walletAddress) {
                for (let mode = 0; mode <= 1; mode++) {
                    this.myBestScores[mode] = Number(await shopContract.playerBestScore(this.walletAddress, mode));
                    this.myRanks[mode] = Number(await shopContract.getPlayerRank(this.walletAddress, mode));
                }
                
                this.currentNickname = await shopContract.playerNickname(this.walletAddress);
                
                document.getElementById('myStats').style.display = 'block';
                document.getElementById('nicknameSection').style.display = 'flex';
                document.getElementById('nicknameInput').value = this.currentNickname;
            }
            
            this.renderLeaderboard();
            
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            listEl.innerHTML = '<div class="leaderboard-empty">Failed to load leaderboard.<br>' + (error.message || 'Check console for details') + '</div>';
        }
    },
    
    renderLeaderboard() {
        const mode = this.currentLeaderboardMode;
        const data = this.leaderboardData[mode];
        const listEl = document.getElementById('leaderboardList');
        
        // Update my stats
        if (this.walletConnected) {
            document.getElementById('myBestScore').textContent = this.myBestScores[mode].toLocaleString();
            const rank = this.myRanks[mode];
            document.getElementById('myRank').textContent = rank > 0 ? `Rank #${rank}` : 'Not ranked yet';
        }
        
        if (data.length === 0) {
            listEl.innerHTML = '<div class="leaderboard-empty">No scores yet.<br>Be the first to submit!</div>';
            return;
        }
        
        let html = '';
        data.forEach((entry, index) => {
            const rank = index + 1;
            const isMe = this.walletAddress && entry.player.toLowerCase() === this.walletAddress.toLowerCase();
            const rankClass = rank === 1 ? 'top1' : rank === 2 ? 'top2' : rank === 3 ? 'top3' : '';
            const entryClass = `leaderboard-entry ${rankClass} ${isMe ? 'me' : ''}`;
            
            const displayName = entry.nickname || this.shortenAddress(entry.player);
            const shortAddr = this.shortenAddress(entry.player);
            
            html += `
                <div class="${entryClass}">
                    <div class="leaderboard-rank ${rankClass}">${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : '#' + rank}</div>
                    <div class="leaderboard-player">
                        <div class="leaderboard-name">${this.escapeHtml(displayName)}</div>
                        ${entry.nickname ? `<div class="leaderboard-address">${shortAddr}</div>` : ''}
                    </div>
                    <div class="leaderboard-score">${entry.score.toLocaleString()}</div>
                </div>
            `;
        });
        
        listEl.innerHTML = html;
    },
    
    shortenAddress(addr) {
        return addr.slice(0, 6) + '...' + addr.slice(-4);
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    async saveNickname() {
        if (!this.walletConnected) {
            alert('Please connect your wallet first!');
            return;
        }
        
        const nickname = document.getElementById('nicknameInput').value.trim();
        if (nickname.length > 20) {
            alert('Nickname too long (max 20 characters)');
            return;
        }
        
        const btn = document.getElementById('nicknameBtn');
        btn.disabled = true;
        btn.textContent = '...';
        
        try {
            const shopContract = new ethers.Contract(this.SHOP_CONTRACT_ADDRESS, this.SHOP_ABI, this.signer);
            const tx = await shopContract.setNickname(nickname);
            await tx.wait();
            
            this.currentNickname = nickname;
            btn.textContent = '✓';
            
            setTimeout(() => {
                btn.textContent = 'Save';
                btn.disabled = false;
            }, 2000);
            
            // Reload leaderboard to show updated name
            this.loadLeaderboard();
            
        } catch (error) {
            console.error('Failed to save nickname:', error);
            btn.textContent = 'Error';
            setTimeout(() => {
                btn.textContent = 'Save';
                btn.disabled = false;
            }, 2000);
        }
    },
    
    // Show submit score modal after game over
    showSubmitScoreModal() {
        // Only show if contract is configured
        if (this.SHOP_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
            return;
        }
        
        const mode = this.mode === 'classic' ? 0 : 1;
        const score = this.score;
        const bestScore = this.myBestScores[mode];
        
        document.getElementById('submitScoreValue').textContent = score.toLocaleString();
        document.getElementById('submitNickname').value = this.currentNickname || '';
        document.getElementById('submitStatus').textContent = '';
        document.getElementById('submitBtn').disabled = false;
        
        // Show if it's a new personal best or no best yet
        if (score > bestScore) {
            document.getElementById('submitBestText').textContent = bestScore > 0 ? 
                `Previous best: ${bestScore.toLocaleString()}` : 
                'Your first score in this mode!';
            document.getElementById('submitScoreModal').classList.add('show');
        } else {
            document.getElementById('submitBestText').textContent = `Best: ${bestScore.toLocaleString()} (not a new record)`;
            // Don't show modal if not a new record
        }
    },
    
    skipSubmitScore() {
        this.playClickSound();
        document.getElementById('submitScoreModal').classList.remove('show');
    },
    
    async submitScoreOnchain() {
        if (!this.walletConnected) {
            await this.connectWallet();
            if (!this.walletConnected) return;
        }
        
        const mode = this.mode === 'classic' ? 0 : 1;
        const score = this.score;
        const nickname = document.getElementById('submitNickname').value.trim();
        
        const btn = document.getElementById('submitBtn');
        const statusEl = document.getElementById('submitStatus');
        
        btn.disabled = true;
        statusEl.textContent = 'Verifying gameplay...';
        
        try {
            const shopContract = new ethers.Contract(this.SHOP_CONTRACT_ADDRESS, this.SHOP_ABI, this.signer);
            
            // Check if verification is required
            let verifierAddress = '0x0000000000000000000000000000000000000000';
            try {
                verifierAddress = await shopContract.scoreVerifier();
            } catch (e) {
                console.log('Could not get verifier, using unsafe submit');
            }
            
            let nonce = 0;
            let signature = '0x';
            
            // If verifier is set and server is configured, verify first
            if (verifierAddress !== '0x0000000000000000000000000000000000000000' && 
                this.VERIFICATION_SERVER && 
                !this.VERIFICATION_SERVER.includes('your-server')) {
                
                statusEl.textContent = 'Verifying with server...';
                
                // Send game session to verification server
                const verifyResponse = await fetch(`${this.VERIFICATION_SERVER}/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        playerAddress: this.walletAddress,
                        mode: this.mode,
                        score: score,
                        actions: this.gameSession?.actions || [],
                        startTime: this.gameSession?.startTime || Date.now() - 60000,
                        endTime: this.gameSession?.endTime || Date.now(),
                        finalLives: this.gameSession?.finalLives || 0,
                        version: this.gameSession?.version || '1.0'
                    })
                });
                
                if (!verifyResponse.ok) {
                    const errorData = await verifyResponse.json();
                    throw new Error(errorData.error || 'Verification failed');
                }
                
                const verifyData = await verifyResponse.json();
                nonce = verifyData.nonce;
                signature = verifyData.signature;
                
                console.log('Score verified by server:', verifyData);
            }
            
            // Save nickname first if provided and different
            if (nickname && nickname !== this.currentNickname) {
                statusEl.textContent = 'Saving nickname...';
                const nickTx = await shopContract.setNickname(nickname);
                await nickTx.wait();
                this.currentNickname = nickname;
            }
            
            // Submit score
            statusEl.textContent = 'Submitting to blockchain...';
            
            let tx;
            if (verifierAddress !== '0x0000000000000000000000000000000000000000' && signature !== '0x') {
                // Use verified submit with signature
                tx = await shopContract.submitScore(mode, score, nonce, signature);
            } else {
                // Use unsafe submit (only works if verifier not set)
                tx = await shopContract.submitScoreUnsafe(mode, score);
            }
            
            statusEl.textContent = 'Waiting for confirmation...';
            await tx.wait();
            
            // Update local state
            this.myBestScores[mode] = score;
            
            statusEl.textContent = 'Score submitted! 🎉';
            
            setTimeout(() => {
                document.getElementById('submitScoreModal').classList.remove('show');
            }, 1500);
            
        } catch (error) {
            console.error('Failed to submit score:', error);
            let errorMsg = error.reason || error.message || 'Failed';
            if (errorMsg.includes('Validation failed')) {
                errorMsg = 'Score verification failed - suspicious gameplay detected';
            }
            statusEl.textContent = 'Error: ' + errorMsg;
            btn.disabled = false;
        }
    },
    
    update() {
        if (this.state !== 'playing' && this.state !== 'gameover') return;
        const g = 0.28;
        
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const c = this.coins[i];
            if (c.sliced) { this.coins.splice(i, 1); continue; }
            c.x += c.vx; c.y += c.vy; c.vy += g; c.rot += c.rotSpeed;
            
            // Bounce off left and right walls
            if (c.x - c.r < 0) {
                c.x = c.r;
                c.vx = Math.abs(c.vx);
            } else if (c.x + c.r > this.W) {
                c.x = this.W - c.r;
                c.vx = -Math.abs(c.vx);
            }
            
            if (c.y > this.H + c.r * 2) {
                if (!c.isBomb && this.mode === 'classic' && this.state === 'playing') {
                    // Reset combo when dropping a coin
                    this.combo = 0;
                    this.updateCombo();
                    
                    // Record miss for anti-cheat
                    if (this.gameSession) {
                        this.gameSession.actions.push({
                            type: 'miss',
                            coinType: c.id,
                            timestamp: Date.now()
                        });
                    }
                    
                    if (--this.lives <= 0) this.end('lives');
                    this.updateLives();
                }
                this.coins.splice(i, 1);
            }
        }
        
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            p.x += p.vx; p.y += p.vy; p.vy += g; p.rot += p.rotSpeed; p.a -= 0.015;
            if (p.a <= 0 || p.y > this.H + p.r * 2) this.pieces.splice(i, 1);
        }
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.a -= 0.025;
            if (p.a <= 0) this.particles.splice(i, 1);
        }
        
        // Update money particles
        for (let i = this.moneyParticles.length - 1; i >= 0; i--) {
            const p = this.moneyParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.rot += p.rotSpeed;
            p.a -= 0.02;
            if (p.a <= 0 || p.y > this.H + 50) this.moneyParticles.splice(i, 1);
        }
        
        // Update blade particles
        for (let i = this.bladeParticles.length - 1; i >= 0; i--) {
            const p = this.bladeParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12;
            if (p.rotSpeed) p.rot += p.rotSpeed;
            p.a -= 0.025;
            if (p.a <= 0 || p.y > this.H + 50) this.bladeParticles.splice(i, 1);
        }
        
        for (let i = this.texts.length - 1; i >= 0; i--) {
            const t = this.texts[i];
            t.y += t.vy; t.a -= 0.02;
            if (t.a <= 0) this.texts.splice(i, 1);
        }
        
        const now = Date.now();
        this.trail = this.trail.filter(p => now - p.t < 100);
    },
    
    draw() {
        const ctx = this.ctx;
        
        // Draw background based on selection
        this.drawBackground();
        
        if (this.state !== 'playing' && this.state !== 'gameover') return;
        
        // Draw money particles (only for money blade)
        if (this.currentBlade === 'money') {
            for (const p of this.moneyParticles) {
                ctx.save();
                ctx.globalAlpha = p.a;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.scale(p.scale, p.scale);
                ctx.drawImage(this.billCanvas, -25, -11);
                ctx.restore();
            }
        }
        
        // Draw blade particles (symbols, shapes, etc.)
        for (const p of this.bladeParticles) {
            ctx.save();
            ctx.globalAlpha = p.a;
            ctx.translate(p.x, p.y);
            if (p.rot) ctx.rotate(p.rot);
            
            switch(p.type) {
                case 'text':
                    ctx.font = `bold ${p.size}px Arial`;
                    ctx.fillStyle = p.color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.text, 0, 0);
                    break;
                case 'diamond':
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.moveTo(0, -p.size);
                    ctx.lineTo(p.size * 0.6, 0);
                    ctx.lineTo(0, p.size);
                    ctx.lineTo(-p.size * 0.6, 0);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'baselogo':
                    if (this.baseLogoImg && this.baseLogoImg.complete) {
                        ctx.drawImage(this.baseLogoImg, -p.size/2, -p.size/2, p.size, p.size);
                    } else {
                        ctx.fillStyle = '#0052FF';
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                case 'square':
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(-p.size/2, -p.size/2, p.size, p.size);
                    break;
                case 'circle':
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'pixel':
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size/2, -p.size/2, p.size - 1, p.size - 1);
                    break;
                case 'node':
                    ctx.fillStyle = 'rgba(100, 180, 255, 0.5)';
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size + 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'candle':
                    const w = p.width, h = p.height;
                    // Wick
                    ctx.strokeStyle = 'rgba(0, 200, 80, 0.8)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, -h/2 - h*0.3);
                    ctx.lineTo(0, h/2 + h*0.3);
                    ctx.stroke();
                    // Body
                    ctx.fillStyle = 'rgba(0, 200, 100, 0.9)';
                    ctx.fillRect(-w/2, -h/2, w, h);
                    ctx.strokeStyle = 'rgba(100, 255, 150, 0.8)';
                    ctx.strokeRect(-w/2, -h/2, w, h);
                    break;
            }
            ctx.restore();
        }
        
        // Draw blade based on selection
        this.drawBlade();
        
        // Coins
        // Draw neon tadpole tails (behind coins) for neon background
        if (this.currentBg === 'neon') {
            for (const c of this.coins) {
                if (c.sliced) continue;
                
                // Small tadpole tail - always visible
                const angle = Math.atan2(c.vy, c.vx);
                const tailLength = 25 + Math.min(20, Math.hypot(c.vx, c.vy) * 2);
                
                const tailEndX = c.x - Math.cos(angle) * tailLength;
                const tailEndY = c.y - Math.sin(angle) * tailLength;
                
                const tailColor = c.isBomb ? '#ff3366' : '#00ffff';
                
                // Tail gradient
                const trailGrad = ctx.createLinearGradient(tailEndX, tailEndY, c.x, c.y);
                trailGrad.addColorStop(0, 'transparent');
                trailGrad.addColorStop(0.6, tailColor + '30');
                trailGrad.addColorStop(1, tailColor + '90');
                
                // Curved tadpole tail
                ctx.strokeStyle = trailGrad;
                ctx.lineWidth = c.r * 0.4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(tailEndX, tailEndY);
                ctx.quadraticCurveTo(
                    c.x - Math.cos(angle) * tailLength * 0.5 + Math.sin(angle) * 8,
                    c.y - Math.sin(angle) * tailLength * 0.5 - Math.cos(angle) * 8,
                    c.x - Math.cos(angle) * c.r * 0.8,
                    c.y - Math.sin(angle) * c.r * 0.8
                );
                ctx.stroke();
                
                // Inner bright core of tail
                ctx.lineWidth = c.r * 0.12;
                ctx.beginPath();
                ctx.moveTo(tailEndX, tailEndY);
                ctx.quadraticCurveTo(
                    c.x - Math.cos(angle) * tailLength * 0.5 + Math.sin(angle) * 8,
                    c.y - Math.sin(angle) * tailLength * 0.5 - Math.cos(angle) * 8,
                    c.x - Math.cos(angle) * c.r * 0.8,
                    c.y - Math.sin(angle) * c.r * 0.8
                );
                ctx.stroke();
            }
        }
        
        for (const c of this.coins) {
            if (c.sliced) continue;
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rot);
            
            if (c.isBomb) {
                if (this.currentBg === 'blockchain') {
                    // Square bomb for blockchain
                    const s = c.r * 1.8;
                    ctx.drawImage(this.squareBombCanvas, -s/2, -s/2, s, s);
                } else if (this.currentBg === 'neon') {
                    // Neon glowing bomb
                    ctx.shadowColor = '#ff3366';
                    ctx.shadowBlur = 10;
                    ctx.drawImage(this.bombCanvas, -c.r, -c.r - 8, c.r * 2, c.r * 2 + 16);
                    ctx.shadowBlur = 0;
                } else if (this.currentBg === 'circuit') {
                    // Dangerous capacitor / faulty component
                    const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
                    
                    // Warning solder pads
                    ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
                    for (let i = 0; i < 4; i++) {
                        const angle = i * Math.PI / 2;
                        const padX = Math.cos(angle) * (c.r + 6);
                        const padY = Math.sin(angle) * (c.r + 6);
                        ctx.fillRect(padX - 4, padY - 2, 8, 4);
                    }
                    
                    // Outer casing
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fill();
                    
                    // Danger glow
                    ctx.shadowColor = `rgba(255, 50, 50, ${pulse})`;
                    ctx.shadowBlur = 20;
                    ctx.strokeStyle = `rgba(255, 80, 80, ${pulse})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // Inner danger gradient
                    const dangerGrad = ctx.createRadialGradient(0, -c.r * 0.3, 0, 0, 0, c.r * 0.85);
                    dangerGrad.addColorStop(0, `rgba(255, 150, 150, ${pulse})`);
                    dangerGrad.addColorStop(0.5, `rgba(200, 50, 50, ${pulse * 0.8})`);
                    dangerGrad.addColorStop(1, `rgba(80, 20, 20, ${pulse * 0.6})`);
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                    ctx.fillStyle = dangerGrad;
                    ctx.fill();
                    
                    ctx.shadowBlur = 0;
                    
                    // Warning symbol
                    ctx.fillStyle = `rgba(255, 200, 50, ${pulse})`;
                    ctx.font = 'bold 24px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('⚠', 0, 0);
                    
                    // Component label
                    ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
                    ctx.font = '6px monospace';
                    ctx.fillText('FAULT', 0, c.r + 16);
                } else if (this.currentBg === 'space') {
                    // Black hole bomb
                    const pulse = Math.sin(Date.now() * 0.008) * 0.3 + 0.7;
                    
                    // Event horizon glow
                    ctx.shadowColor = `rgba(255, 100, 50, ${pulse})`;
                    ctx.shadowBlur = 30;
                    
                    // Accretion disk
                    ctx.strokeStyle = `rgba(255, 150, 50, ${pulse * 0.6})`;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, c.r * 1.5, c.r * 0.4, 0.3, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    ctx.strokeStyle = `rgba(255, 200, 100, ${pulse * 0.4})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, c.r * 1.7, c.r * 0.5, 0.3, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Black hole center
                    const holeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, c.r);
                    holeGrad.addColorStop(0, '#000000');
                    holeGrad.addColorStop(0.7, '#0a0005');
                    holeGrad.addColorStop(1, '#1a0510');
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = holeGrad;
                    ctx.fill();
                    
                    // Inner red glow
                    ctx.strokeStyle = `rgba(255, 50, 50, ${pulse})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                    
                    // Warning symbol
                    ctx.fillStyle = `rgba(255, 100, 50, ${pulse})`;
                    ctx.font = 'bold 20px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('☠', 0, 0);
                } else if (this.currentBg === 'waves') {
                    // Dangerous jellyfish/mine
                    const pulse = Math.sin(Date.now() * 0.006) * 0.3 + 0.7;
                    const wobble = Math.sin(Date.now() * 0.008) * 5;
                    
                    // Danger glow
                    ctx.shadowColor = `rgba(255, 100, 150, ${pulse})`;
                    ctx.shadowBlur = 25;
                    
                    // Main body (jellyfish dome)
                    const jellyGrad = ctx.createRadialGradient(0, -c.r * 0.2, 0, 0, 0, c.r);
                    jellyGrad.addColorStop(0, `rgba(255, 150, 200, ${pulse * 0.8})`);
                    jellyGrad.addColorStop(0.5, `rgba(200, 50, 100, ${pulse * 0.6})`);
                    jellyGrad.addColorStop(1, `rgba(100, 20, 50, ${pulse * 0.4})`);
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = jellyGrad;
                    ctx.fill();
                    
                    // Edge
                    ctx.strokeStyle = `rgba(255, 100, 150, ${pulse})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                    
                    // Tentacles
                    ctx.strokeStyle = `rgba(255, 150, 200, ${pulse * 0.6})`;
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    for (let i = 0; i < 5; i++) {
                        const tx = -c.r * 0.6 + i * c.r * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(tx, c.r * 0.8);
                        ctx.quadraticCurveTo(tx + wobble, c.r * 1.3, tx - wobble * 0.5, c.r * 1.8);
                        ctx.stroke();
                    }
                    
                    // Warning symbol
                    ctx.fillStyle = `rgba(255, 255, 100, ${pulse})`;
                    ctx.font = 'bold 22px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('⚡', 0, -2);
                } else if (this.currentBg === 'retro') {
                    // Retro arcade enemy/bomb
                    const pulse = Math.sin(Date.now() * 0.006) * 0.2 + 0.8;
                    
                    // Red danger glow
                    ctx.shadowColor = '#ff0066';
                    ctx.shadowBlur = 20;
                    
                    // Body
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    const dangerGrad = ctx.createLinearGradient(-c.r, -c.r, c.r, c.r);
                    dangerGrad.addColorStop(0, '#ff0066');
                    dangerGrad.addColorStop(0.5, '#cc0044');
                    dangerGrad.addColorStop(1, '#660022');
                    ctx.fillStyle = dangerGrad;
                    ctx.fill();
                    
                    ctx.shadowBlur = 0;
                    
                    // Inner dark
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r * 0.7, 0, Math.PI * 2);
                    ctx.fillStyle = '#1a0a0a';
                    ctx.fill();
                    
                    // Neon border
                    ctx.strokeStyle = `rgba(255, 0, 102, ${pulse})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Skull/danger symbol
                    ctx.fillStyle = '#ff0066';
                    ctx.font = 'bold 24px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('☠', 0, 0);
                } else if (this.currentBg === 'crt') {
                    // CRT virus bomb
                    ctx.shadowColor = '#ff0000';
                    ctx.shadowBlur = 15;
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#1a0a0a';
                    ctx.fill();
                    
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    
                    // Scanlines
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.fillStyle = 'rgba(60, 0, 0, 0.5)';
                    for (let y = -c.r; y < c.r; y += 3) {
                        ctx.fillRect(-c.r, y, c.r * 2, 1);
                    }
                    ctx.restore();
                    
                    ctx.fillStyle = '#ff0000';
                    ctx.font = 'bold 10px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('VIRUS', 0, -4);
                    ctx.fillText('⚠', 0, 12);
                } else if (this.currentBg === 'pixel') {
                    // Pixel art enemy
                    const px = 4;
                    ctx.fillStyle = '#ff0000';
                    
                    for (let py = -c.r; py < c.r; py += px) {
                        for (let ppx = -c.r; ppx < c.r; ppx += px) {
                            if (ppx*ppx + py*py < c.r*c.r * 0.85) {
                                ctx.fillRect(ppx, py, px - 1, px - 1);
                            }
                        }
                    }
                    
                    // Eyes
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(-c.r * 0.4, -c.r * 0.2, px * 2, px * 2);
                    ctx.fillRect(c.r * 0.2, -c.r * 0.2, px * 2, px * 2);
                    
                    // Angry mouth
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(-c.r * 0.3, c.r * 0.2, c.r * 0.6, px);
                } else if (this.currentBg === 'win95') {
                    // BSOD bomb
                    ctx.fillStyle = '#0000aa';
                    ctx.fillRect(-c.r, -c.r, c.r * 2, c.r * 2);
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 8px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('FATAL', 0, -8);
                    ctx.fillText('ERROR', 0, 4);
                    ctx.font = '7px Arial';
                    ctx.fillText('0x000000', 0, 16);
                } else if (this.currentBg === 'nokia') {
                    // Nokia low battery bomb
                    const px = 3;
                    ctx.fillStyle = '#0f380f';
                    
                    for (let py = -c.r; py < c.r; py += px) {
                        for (let ppx = -c.r; ppx < c.r; ppx += px) {
                            if (ppx*ppx + py*py < c.r*c.r * 0.9) {
                                ctx.fillRect(ppx, py, px - 1, px - 1);
                            }
                        }
                    }
                    
                    // Battery icon
                    ctx.fillStyle = '#9bbc0f';
                    ctx.fillRect(-10, -6, 16, 12);
                    ctx.fillRect(6, -3, 4, 6);
                    // Empty battery indicator
                    ctx.fillStyle = '#0f380f';
                    ctx.fillRect(-8, -4, 12, 8);
                } else if (this.currentBg === 'oscilloscope') {
                    // Overload signal bomb
                    ctx.shadowColor = '#ff0000';
                    ctx.shadowBlur = 20;
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#1a0a0a';
                    ctx.fill();
                    
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Overloaded waveform
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    for (let x = -c.r; x < c.r; x += 2) {
                        const y = (Math.random() - 0.5) * c.r * 1.5;
                        if (x === -c.r) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.restore();
                    
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#ff0000';
                    ctx.font = 'bold 10px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('OVERLOAD', 0, c.r + 15);
                } else {
                    ctx.drawImage(this.bombCanvas, -c.r, -c.r - 8, c.r * 2, c.r * 2 + 16);
                }
            } else {
                const img = this.images[c.id];
                
                if (this.currentBg === 'blockchain') {
                    // Square coins with rounded corners for blockchain
                    const s = c.r * 1.8;
                    const radius = 12;
                    
                    // Subtle glow effect
                    ctx.shadowColor = 'rgba(0, 82, 255, 0.3)';
                    ctx.shadowBlur = 6;
                    
                    // Background
                    ctx.beginPath();
                    ctx.roundRect(-s/2, -s/2, s, s, radius);
                    ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
                    ctx.fill();
                    
                    // Border
                    ctx.strokeStyle = 'rgba(0, 150, 255, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                    
                    // Logo clipped to rounded square
                    if (img) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(-s/2 + 6, -s/2 + 6, s - 12, s - 12, radius - 4);
                        ctx.clip();
                        ctx.drawImage(img, -c.r + 4, -c.r + 4, c.r * 2 - 8, c.r * 2 - 8);
                        ctx.restore();
                    }
                } else if (this.currentBg === 'neon') {
                    // Neon glowing coins
                    // Outer glow
                    ctx.shadowColor = '#00ffff';
                    ctx.shadowBlur = 8;
                    
                    // Dark background circle
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(10, 20, 40, 0.9)';
                    ctx.fill();
                    
                    // Neon ring
                    ctx.strokeStyle = '#00ffff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                    
                    // Logo
                    if (img) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r + 4, -c.r + 4, c.r * 2 - 8, c.r * 2 - 8);
                        ctx.restore();
                    }
                } else if (this.currentBg === 'circuit') {
                    // Circuit board LED-style coins
                    const pulse = Math.sin(Date.now() * 0.005 + c.x) * 0.2 + 0.8;
                    
                    // Solder pads (legs)
                    ctx.fillStyle = 'rgba(0, 180, 120, 0.6)';
                    for (let i = 0; i < 4; i++) {
                        const angle = i * Math.PI / 2;
                        const padX = Math.cos(angle) * (c.r + 6);
                        const padY = Math.sin(angle) * (c.r + 6);
                        ctx.fillRect(padX - 4, padY - 2, 8, 4);
                    }
                    
                    // Connection traces to pads
                    ctx.strokeStyle = 'rgba(0, 150, 100, 0.4)';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 4; i++) {
                        const angle = i * Math.PI / 2;
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(angle) * c.r, Math.sin(angle) * c.r);
                        ctx.lineTo(Math.cos(angle) * (c.r + 6), Math.sin(angle) * (c.r + 6));
                        ctx.stroke();
                    }
                    
                    // Outer metal ring
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fill();
                    ctx.strokeStyle = `rgba(0, 200, 150, ${pulse * 0.7})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // LED glow
                    ctx.shadowColor = `rgba(0, 255, 150, ${pulse})`;
                    ctx.shadowBlur = 15;
                    
                    // Inner LED lens
                    const ledGrad = ctx.createRadialGradient(0, -c.r * 0.3, 0, 0, 0, c.r * 0.85);
                    ledGrad.addColorStop(0, `rgba(150, 255, 200, ${pulse})`);
                    ledGrad.addColorStop(0.5, `rgba(0, 200, 100, ${pulse * 0.8})`);
                    ledGrad.addColorStop(1, `rgba(0, 80, 50, ${pulse * 0.6})`);
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                    ctx.fillStyle = ledGrad;
                    ctx.fill();
                    
                    ctx.shadowBlur = 0;
                    
                    // Logo overlay
                    if (img) {
                        ctx.globalAlpha = 0.85;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r - 6, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r + 6, -c.r + 6, c.r * 2 - 12, c.r * 2 - 12);
                        ctx.restore();
                        ctx.globalAlpha = 1;
                    }
                    
                    // Component label
                    ctx.fillStyle = 'rgba(0, 200, 150, 0.5)';
                    ctx.font = '6px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('LED', 0, c.r + 16);
                } else if (this.currentBg === 'space') {
                    // Space asteroid/moon style coins
                    const pulse = Math.sin(Date.now() * 0.003 + c.x * 0.1) * 0.2 + 0.8;
                    
                    // Outer planetary rings (behind coin)
                    ctx.strokeStyle = `rgba(200, 180, 255, ${pulse * 0.4})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, c.r * 1.8, c.r * 0.5, 0.3, Math.PI, Math.PI * 2);
                    ctx.stroke();
                    
                    ctx.strokeStyle = `rgba(150, 120, 255, ${pulse * 0.3})`;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, c.r * 2.1, c.r * 0.6, 0.3, Math.PI, Math.PI * 2);
                    ctx.stroke();
                    
                    // Outer glow (cosmic energy)
                    ctx.shadowColor = 'rgba(150, 100, 255, 0.8)';
                    ctx.shadowBlur = 20;
                    
                    // Planet-like sphere with gradient
                    const sphereGrad = ctx.createRadialGradient(-c.r * 0.3, -c.r * 0.3, 0, 0, 0, c.r);
                    sphereGrad.addColorStop(0, '#6a5acd');
                    sphereGrad.addColorStop(0.5, '#483d8b');
                    sphereGrad.addColorStop(1, '#1a1a3a');
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = sphereGrad;
                    ctx.fill();
                    
                    // Atmosphere ring
                    ctx.strokeStyle = `rgba(150, 120, 255, ${pulse * 0.5})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                    
                    // Logo
                    if (img) {
                        ctx.globalAlpha = 0.9;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r - 5, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r + 5, -c.r + 5, c.r * 2 - 10, c.r * 2 - 10);
                        ctx.restore();
                        ctx.globalAlpha = 1;
                    }
                    
                    // Front planetary rings (in front of coin)
                    ctx.strokeStyle = `rgba(200, 180, 255, ${pulse * 0.5})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, c.r * 1.8, c.r * 0.5, 0.3, 0, Math.PI);
                    ctx.stroke();
                    
                    ctx.strokeStyle = `rgba(150, 120, 255, ${pulse * 0.4})`;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, c.r * 2.1, c.r * 0.6, 0.3, 0, Math.PI);
                    ctx.stroke();
                } else if (this.currentBg === 'waves') {
                    // Underwater bubble coin
                    const pulse = Math.sin(Date.now() * 0.004 + c.x * 0.1) * 0.2 + 0.8;
                    const wobble = Math.sin(Date.now() * 0.006 + c.y * 0.1) * 3;
                    
                    // Outer bubble glow
                    ctx.shadowColor = 'rgba(100, 200, 255, 0.6)';
                    ctx.shadowBlur = 20;
                    
                    // Bubble body
                    const bubbleGrad = ctx.createRadialGradient(-c.r * 0.3, -c.r * 0.3, 0, 0, 0, c.r);
                    bubbleGrad.addColorStop(0, `rgba(200, 240, 255, ${pulse * 0.9})`);
                    bubbleGrad.addColorStop(0.3, `rgba(100, 180, 220, ${pulse * 0.6})`);
                    bubbleGrad.addColorStop(0.7, `rgba(50, 120, 180, ${pulse * 0.4})`);
                    bubbleGrad.addColorStop(1, `rgba(20, 80, 140, ${pulse * 0.3})`);
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = bubbleGrad;
                    ctx.fill();
                    
                    // Bubble edge highlight
                    ctx.strokeStyle = `rgba(150, 220, 255, ${pulse * 0.7})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                    
                    // Shine reflection
                    ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.6})`;
                    ctx.beginPath();
                    ctx.ellipse(-c.r * 0.35, -c.r * 0.35, c.r * 0.25, c.r * 0.15, -0.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Small bubbles around
                    ctx.fillStyle = `rgba(150, 220, 255, ${pulse * 0.4})`;
                    ctx.beginPath();
                    ctx.arc(c.r * 0.7 + wobble * 0.5, -c.r * 0.5, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(c.r * 0.5, c.r * 0.6 + wobble * 0.3, 3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Logo
                    if (img) {
                        ctx.globalAlpha = 0.85;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r - 5, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r + 5, -c.r + 5, c.r * 2 - 10, c.r * 2 - 10);
                        ctx.restore();
                        ctx.globalAlpha = 1;
                    }
                } else if (this.currentBg === 'retro') {
                    // Retro arcade pixel coin
                    const pulse = Math.sin(Date.now() * 0.005) * 0.15 + 0.85;
                    
                    // Magenta/cyan glow
                    ctx.shadowColor = '#ff00ff';
                    ctx.shadowBlur = 15;
                    
                    // Coin body - dark base
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#1a0a2e';
                    ctx.fill();
                    
                    ctx.shadowBlur = 0;
                    
                    // Logo - bigger and brighter
                    if (img) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r + 6, -c.r + 6, c.r * 2 - 12, c.r * 2 - 12);
                        ctx.restore();
                    }
                    
                    // Neon border ring
                    ctx.strokeStyle = `rgba(255, 0, 255, ${pulse})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Second border - cyan
                    ctx.strokeStyle = `rgba(0, 255, 255, ${pulse * 0.7})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (this.currentBg === 'crt') {
                    // CRT terminal coin
                    ctx.shadowColor = '#00ff00';
                    ctx.shadowBlur = 15;
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#0a1a0a';
                    ctx.fill();
                    
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    
                    // Scanlines on coin
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.fillStyle = 'rgba(0, 60, 0, 0.5)';
                    for (let y = -c.r; y < c.r; y += 3) {
                        ctx.fillRect(-c.r, y, c.r * 2, 1);
                    }
                    ctx.restore();
                    
                    if (img) {
                        ctx.globalAlpha = 0.9;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r + 6, -c.r + 6, c.r * 2 - 12, c.r * 2 - 12);
                        ctx.restore();
                        ctx.globalAlpha = 1;
                    }
                } else if (this.currentBg === 'pixel') {
                    // Pixel art coin (square-ish)
                    const px = 4;
                    ctx.fillStyle = '#FFD700';
                    
                    // Draw pixelated circle
                    for (let py = -c.r; py < c.r; py += px) {
                        for (let ppx = -c.r; ppx < c.r; ppx += px) {
                            if (ppx*ppx + py*py < c.r*c.r * 0.85) {
                                ctx.fillRect(ppx, py, px - 1, px - 1);
                            }
                        }
                    }
                    
                    // Darker edge
                    ctx.fillStyle = '#CC9900';
                    for (let py = -c.r; py < c.r; py += px) {
                        for (let ppx = -c.r; ppx < c.r; ppx += px) {
                            const dist = ppx*ppx + py*py;
                            if (dist < c.r*c.r && dist > c.r*c.r * 0.7) {
                                ctx.fillRect(ppx, py, px - 1, px - 1);
                            }
                        }
                    }
                    
                    if (img) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r * 0.6, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r * 0.6, -c.r * 0.6, c.r * 1.2, c.r * 1.2);
                        ctx.restore();
                    }
                } else if (this.currentBg === 'win95') {
                    // Windows 95 icon style
                    ctx.fillStyle = '#c0c0c0';
                    ctx.fillRect(-c.r, -c.r, c.r * 2, c.r * 2);
                    
                    // 3D border
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(-c.r, -c.r, c.r * 2, 2);
                    ctx.fillRect(-c.r, -c.r, 2, c.r * 2);
                    ctx.fillStyle = '#808080';
                    ctx.fillRect(-c.r, c.r - 2, c.r * 2, 2);
                    ctx.fillRect(c.r - 2, -c.r, 2, c.r * 2);
                    
                    if (img) {
                        ctx.drawImage(img, -c.r + 6, -c.r + 6, c.r * 2 - 12, c.r * 2 - 12);
                    }
                } else if (this.currentBg === 'nokia') {
                    // Nokia LCD pixel style
                    const lcdDark = '#0f380f';
                    const lcdLight = '#9bbc0f';
                    const px = 3;
                    
                    // Pixelated circle
                    ctx.fillStyle = lcdDark;
                    for (let py = -c.r; py < c.r; py += px) {
                        for (let ppx = -c.r; ppx < c.r; ppx += px) {
                            if (ppx*ppx + py*py < c.r*c.r * 0.9) {
                                ctx.fillRect(ppx, py, px - 1, px - 1);
                            }
                        }
                    }
                    
                    if (img) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r * 0.65, 0, Math.PI * 2);
                        ctx.clip();
                        // Make image look LCD-ish
                        ctx.globalAlpha = 0.8;
                        ctx.drawImage(img, -c.r * 0.65, -c.r * 0.65, c.r * 1.3, c.r * 1.3);
                        ctx.restore();
                        ctx.globalAlpha = 1;
                    }
                } else if (this.currentBg === 'oscilloscope') {
                    // Oscilloscope blip style
                    ctx.shadowColor = '#00ff00';
                    ctx.shadowBlur = 20;
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#0a1a0a';
                    ctx.fill();
                    
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Waveform inside
                    ctx.beginPath();
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2);
                    ctx.clip();
                    
                    ctx.strokeStyle = '#00ffff';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    for (let x = -c.r; x < c.r; x += 2) {
                        const y = Math.sin(x * 0.2 + Date.now() * 0.01) * c.r * 0.3;
                        if (x === -c.r) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.restore();
                    
                    ctx.shadowBlur = 0;
                    
                    if (img) {
                        ctx.globalAlpha = 0.7;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r * 0.5, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r * 0.5, -c.r * 0.5, c.r, c.r);
                        ctx.restore();
                        ctx.globalAlpha = 1;
                    }
                } else {
                    // Normal circular coins
                    if (img) {
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, -c.r, -c.r, c.r * 2, c.r * 2);
                    } else {
                        ctx.beginPath();
                        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                        ctx.fillStyle = '#0052FF';
                        ctx.fill();
                    }
                }
            }
            ctx.restore();
        }
        
        // Pieces
        for (const p of this.pieces) {
            ctx.save();
            ctx.globalAlpha = p.a;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            
            const img = this.images[p.id];
            
            if (this.currentBg === 'blockchain') {
                // Square halves for blockchain
                const s = p.r * 1.8;
                const radius = 12;
                
                ctx.save();
                
                // Clip to half
                ctx.beginPath();
                if (p.half === 0) {
                    // Top half
                    ctx.roundRect(-s/2, -s/2, s, s/2 + 4, [radius, radius, 4, 4]);
                } else {
                    // Bottom half
                    ctx.roundRect(-s/2, -4, s, s/2 + 4, [4, 4, radius, radius]);
                }
                ctx.clip();
                
                // Background
                ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
                ctx.fillRect(-s/2, -s/2, s, s);
                
                // Border glow
                ctx.shadowColor = 'rgba(0, 82, 255, 0.5)';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = 'rgba(0, 150, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.strokeRect(-s/2, -s/2, s, s);
                ctx.shadowBlur = 0;
                
                // Logo
                if (img) {
                    ctx.drawImage(img, -p.r + 4, -p.r + 4, p.r * 2 - 8, p.r * 2 - 8);
                }
                
                // Inner cut line (like slice mark)
                ctx.strokeStyle = 'rgba(0, 200, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-s/2, p.half === 0 ? s/2 - 4 : -4);
                ctx.lineTo(s/2, p.half === 0 ? s/2 - 4 : -4);
                ctx.stroke();
                
                ctx.restore();
            } else if (this.currentBg === 'neon') {
                // Neon halves
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 15;
                
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.clip();
                
                // Dark background
                ctx.fillStyle = 'rgba(10, 20, 40, 0.9)';
                ctx.fill();
                
                // Neon edge
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.stroke();
                
                ctx.shadowBlur = 0;
                
                if (img) {
                    ctx.drawImage(img, -p.r + 4, -p.r + 4, p.r * 2 - 8, p.r * 2 - 8);
                }
            } else if (this.currentBg === 'circuit') {
                // Circuit board broken LED halves
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.clip();
                
                // Damaged component look
                ctx.fillStyle = '#1a1a1a';
                ctx.fill();
                
                // Sparking edge
                ctx.shadowColor = 'rgba(0, 255, 150, 0.8)';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = 'rgba(0, 200, 150, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.stroke();
                
                // Inner broken circuit
                const sparkGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r);
                sparkGrad.addColorStop(0, 'rgba(100, 255, 150, 0.4)');
                sparkGrad.addColorStop(0.5, 'rgba(0, 100, 50, 0.3)');
                sparkGrad.addColorStop(1, 'rgba(0, 50, 30, 0.2)');
                ctx.fillStyle = sparkGrad;
                ctx.beginPath();
                ctx.arc(0, 0, p.r - 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.shadowBlur = 0;
                
                if (img) {
                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(img, -p.r + 6, -p.r + 6, p.r * 2 - 12, p.r * 2 - 12);
                    ctx.globalAlpha = p.a;
                }
            } else if (this.currentBg === 'space') {
                // Cosmic halves
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.clip();
                
                // Planet fragment gradient
                const fragGrad = ctx.createRadialGradient(-p.r * 0.3, -p.r * 0.3, 0, 0, 0, p.r);
                fragGrad.addColorStop(0, '#6a5acd');
                fragGrad.addColorStop(0.5, '#483d8b');
                fragGrad.addColorStop(1, '#1a1a3a');
                ctx.fillStyle = fragGrad;
                ctx.fill();
                
                // Cosmic glow edge
                ctx.shadowColor = 'rgba(150, 100, 255, 0.8)';
                ctx.shadowBlur = 15;
                ctx.strokeStyle = 'rgba(180, 150, 255, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.stroke();
                
                ctx.shadowBlur = 0;
                
                if (img) {
                    ctx.globalAlpha = 0.7;
                    ctx.drawImage(img, -p.r + 5, -p.r + 5, p.r * 2 - 10, p.r * 2 - 10);
                    ctx.globalAlpha = p.a;
                }
            } else if (this.currentBg === 'waves') {
                // Bubble halves
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.clip();
                
                // Popped bubble gradient
                const popGrad = ctx.createRadialGradient(-p.r * 0.3, -p.r * 0.3, 0, 0, 0, p.r);
                popGrad.addColorStop(0, 'rgba(200, 240, 255, 0.7)');
                popGrad.addColorStop(0.5, 'rgba(100, 180, 220, 0.5)');
                popGrad.addColorStop(1, 'rgba(50, 120, 180, 0.3)');
                ctx.fillStyle = popGrad;
                ctx.fill();
                
                // Bubble edge
                ctx.shadowColor = 'rgba(100, 200, 255, 0.6)';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = 'rgba(150, 220, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.stroke();
                
                ctx.shadowBlur = 0;
                
                if (img) {
                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(img, -p.r + 5, -p.r + 5, p.r * 2 - 10, p.r * 2 - 10);
                    ctx.globalAlpha = p.a;
                }
            } else if (this.currentBg === 'retro') {
                // Retro neon halves
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.clip();
                
                // Neon gradient fill
                const retroPieceGrad = ctx.createLinearGradient(-p.r, -p.r, p.r, p.r);
                retroPieceGrad.addColorStop(0, '#ff00ff');
                retroPieceGrad.addColorStop(1, '#00ffff');
                ctx.fillStyle = retroPieceGrad;
                ctx.fill();
                
                // Dark inner
                ctx.fillStyle = 'rgba(26, 10, 46, 0.7)';
                ctx.fill();
                
                // Neon edge
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 8;
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                if (img) {
                    ctx.globalAlpha = 0.7;
                    ctx.drawImage(img, -p.r + 4, -p.r + 4, p.r * 2 - 8, p.r * 2 - 8);
                    ctx.globalAlpha = p.a;
                }
            } else if (this.currentBg === 'crt' || this.currentBg === 'oscilloscope') {
                // CRT/Oscilloscope halves
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.clip();
                
                ctx.fillStyle = '#0a1a0a';
                ctx.fill();
                
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = 8;
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                if (img) {
                    ctx.globalAlpha = 0.7;
                    ctx.drawImage(img, -p.r + 4, -p.r + 4, p.r * 2 - 8, p.r * 2 - 8);
                    ctx.globalAlpha = p.a;
                }
            } else if (this.currentBg === 'pixel') {
                // Pixel halves
                const px = 4;
                ctx.fillStyle = '#CC9900';
                for (let py = -p.r; py < p.r; py += px) {
                    for (let ppx = -p.r; ppx < p.r; ppx += px) {
                        const ang = Math.atan2(py, ppx);
                        const inHalf = (p.half === 0) ? 
                            (ang > p.sliceAng - Math.PI/2 && ang < p.sliceAng + Math.PI/2) :
                            (ang < p.sliceAng - Math.PI/2 || ang > p.sliceAng + Math.PI/2);
                        if (ppx*ppx + py*py < p.r*p.r * 0.85 && inHalf) {
                            ctx.fillRect(ppx, py, px - 1, px - 1);
                        }
                    }
                }
            } else if (this.currentBg === 'win95') {
                // Windows 95 halves
                ctx.fillStyle = '#c0c0c0';
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.fill();
                
                ctx.strokeStyle = '#808080';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                if (img) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 0, p.r - 4, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                    ctx.lineTo(0, 0);
                    ctx.clip();
                    ctx.drawImage(img, -p.r + 6, -p.r + 6, p.r * 2 - 12, p.r * 2 - 12);
                    ctx.restore();
                }
            } else if (this.currentBg === 'nokia') {
                // Nokia LCD halves
                const px = 3;
                ctx.fillStyle = '#0f380f';
                for (let py = -p.r; py < p.r; py += px) {
                    for (let ppx = -p.r; ppx < p.r; ppx += px) {
                        const ang = Math.atan2(py, ppx);
                        const inHalf = (p.half === 0) ? 
                            (ang > p.sliceAng - Math.PI/2 && ang < p.sliceAng + Math.PI/2) :
                            (ang < p.sliceAng - Math.PI/2 || ang > p.sliceAng + Math.PI/2);
                        if (ppx*ppx + py*py < p.r*p.r * 0.9 && inHalf) {
                            ctx.fillRect(ppx, py, px - 1, px - 1);
                        }
                    }
                }
            } else {
                // Normal circular halves
                ctx.beginPath();
                ctx.arc(0, 0, p.r, p.sliceAng - Math.PI/2 + p.half * Math.PI, p.sliceAng + Math.PI/2 + p.half * Math.PI);
                ctx.lineTo(0, 0);
                ctx.clip();
                
                if (img) {
                    ctx.drawImage(img, -p.r, -p.r, p.r * 2, p.r * 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#0052FF';
                    ctx.fill();
                }
            }
            ctx.restore();
        }
        
        // Particles
        for (const p of this.particles) {
            ctx.globalAlpha = p.a;
            if (this.currentBg === 'blockchain') {
                // Square particles for blockchain
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            } else if (this.currentBg === 'neon') {
                // Glowing particles for neon
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (this.currentBg === 'circuit') {
                // Electric spark particles for circuit
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                // Add small spark trail
                if (p.r < 2.5) {
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            } else if (this.currentBg === 'space') {
                // Cosmic dust particles for space
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                // Sparkle effect
                if (p.r > 2) {
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x - p.r * 2, p.y);
                    ctx.lineTo(p.x + p.r * 2, p.y);
                    ctx.moveTo(p.x, p.y - p.r * 2);
                    ctx.lineTo(p.x, p.y + p.r * 2);
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            } else if (this.currentBg === 'waves') {
                // Bubble particles for waves
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                
                // Bubble gradient
                const bubbleGrad = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 0, p.x, p.y, p.r);
                bubbleGrad.addColorStop(0, `rgba(255, 255, 255, ${p.a * 0.8})`);
                bubbleGrad.addColorStop(0.5, p.color);
                bubbleGrad.addColorStop(1, `rgba(100, 180, 220, ${p.a * 0.3})`);
                
                ctx.fillStyle = bubbleGrad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                
                // Bubble edge
                ctx.strokeStyle = `rgba(200, 240, 255, ${p.a * 0.5})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.shadowBlur = 0;
            } else if (this.currentBg === 'retro') {
                // Neon glowing particles
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (this.currentBg === 'crt' || this.currentBg === 'oscilloscope') {
                // Glowing green/cyan particles
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (this.currentBg === 'pixel') {
                // Pixel square particles
                const px = Math.max(2, Math.floor(p.r));
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.floor(p.x/px)*px, Math.floor(p.y/px)*px, px, px);
            } else if (this.currentBg === 'win95') {
                // Windows square particles
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
                ctx.strokeStyle = '#808080';
                ctx.strokeRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            } else if (this.currentBg === 'nokia') {
                // Nokia LCD pixel particles
                const px = 3;
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.floor(p.x/px)*px, Math.floor(p.y/px)*px, px - 1, px - 1);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        
        // Texts
        ctx.font = 'bold 30px "Bebas Neue"';
        ctx.textAlign = 'center';
        for (const t of this.texts) {
            ctx.globalAlpha = t.a;
            ctx.fillStyle = '#000';
            ctx.fillText(t.text, t.x + 2, t.y + 2);
            ctx.fillStyle = t.color;
            ctx.fillText(t.text, t.x, t.y);
        }
        ctx.globalAlpha = 1;
    },
    
    drawBackground() {
        const ctx = this.ctx;
        
        switch(this.currentBg) {
            case 'matrix':
                // Initialize with solid black on first frame or when switching
                if (!this.matrixInitialized) {
                    ctx.fillStyle = '#000500';
                    ctx.fillRect(0, 0, this.W, this.H);
                    this.matrixInitialized = true;
                }
                
                // Dark background with reduced trail effect
                ctx.fillStyle = 'rgba(0, 5, 0, 0.35)';
                ctx.fillRect(0, 0, this.W, this.H);
                
                const fontSize = 16;
                ctx.font = fontSize + 'px monospace';
                
                for (let col of this.matrixColumns) {
                    // Draw each character in the trail
                    for (let i = 0; i < col.chars.length; i++) {
                        const charY = col.y - i * fontSize;
                        
                        // Skip if off screen
                        if (charY < -fontSize || charY > this.H + fontSize) continue;
                        
                        // First char is brightest (white/green), others fade to dark green
                        if (i === 0) {
                            ctx.fillStyle = '#fff';
                        } else if (i === 1) {
                            ctx.fillStyle = '#90ff90';
                        } else {
                            const alpha = Math.max(0.1, 1 - (i / col.chars.length));
                            ctx.fillStyle = `rgba(0, ${Math.floor(180 * alpha)}, 0, ${alpha})`;
                        }
                        
                        ctx.fillText(col.chars[i], col.x, charY);
                    }
                    
                    // Move column down
                    col.y += col.speed;
                    
                    // Randomly change first character
                    if (Math.random() < 0.05) {
                        col.chars[0] = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
                    }
                    
                    // Reset when off screen
                    if (col.y - col.chars.length * fontSize > this.H) {
                        col.y = 0;
                        col.speed = 2 + Math.random() * 4;
                        col.length = 10 + Math.floor(Math.random() * 20);
                        col.chars = [];
                        for (let j = 0; j < col.length; j++) {
                            col.chars.push(this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)]);
                        }
                    }
                }
                break;
            case 'blockchain':
                // Dark blue background
                if (!this.blockchainInitialized) {
                    ctx.fillStyle = '#030810';
                    ctx.fillRect(0, 0, this.W, this.H);
                    this.blockchainInitialized = true;
                }
                
                // Reduced fade effect
                ctx.fillStyle = 'rgba(3, 8, 16, 0.3)';
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Draw connections between nearby blocks
                ctx.strokeStyle = 'rgba(0, 82, 255, 0.15)';
                ctx.lineWidth = 1;
                for (let i = 0; i < this.blocks.length; i++) {
                    for (let j = i + 1; j < this.blocks.length; j++) {
                        const dx = this.blocks[j].x - this.blocks[i].x;
                        const dy = this.blocks[j].y - this.blocks[i].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 200) {
                            const alpha = (1 - dist / 200) * 0.3;
                            ctx.strokeStyle = `rgba(0, 82, 255, ${alpha})`;
                            ctx.beginPath();
                            ctx.moveTo(this.blocks[i].x, this.blocks[i].y);
                            ctx.lineTo(this.blocks[j].x, this.blocks[j].y);
                            ctx.stroke();
                        }
                    }
                }
                
                // Draw and update blocks
                for (let block of this.blocks) {
                    // Update position
                    block.x += block.vx;
                    block.y += block.vy;
                    block.pulse += block.pulseSpeed;
                    
                    // Bounce off edges
                    if (block.x < 0 || block.x > this.W) block.vx *= -1;
                    if (block.y < 0 || block.y > this.H) block.vy *= -1;
                    
                    // Keep in bounds
                    block.x = Math.max(0, Math.min(this.W, block.x));
                    block.y = Math.max(0, Math.min(this.H, block.y));
                    
                    // Randomly confirm/unconfirm
                    if (Math.random() < 0.002) block.confirmed = !block.confirmed;
                    
                    const pulseAlpha = 0.3 + Math.sin(block.pulse) * 0.15;
                    const size = block.size;
                    
                    ctx.save();
                    ctx.translate(block.x, block.y);
                    
                    // Block glow
                    if (block.confirmed) {
                        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
                        glow.addColorStop(0, `rgba(0, 82, 255, ${pulseAlpha * 0.3})`);
                        glow.addColorStop(1, 'transparent');
                        ctx.fillStyle = glow;
                        ctx.fillRect(-size, -size, size * 2, size * 2);
                    }
                    
                    // Block body
                    const halfSize = size / 2;
                    ctx.strokeStyle = block.confirmed 
                        ? `rgba(0, 150, 255, ${pulseAlpha + 0.2})` 
                        : `rgba(100, 100, 100, ${pulseAlpha})`;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(-halfSize, -halfSize * 0.6, size, size * 0.6);
                    
                    // Block fill
                    ctx.fillStyle = block.confirmed 
                        ? `rgba(0, 40, 80, ${pulseAlpha})` 
                        : `rgba(20, 20, 30, ${pulseAlpha})`;
                    ctx.fillRect(-halfSize, -halfSize * 0.6, size, size * 0.6);
                    
                    // Hash text
                    ctx.fillStyle = block.confirmed 
                        ? `rgba(0, 200, 255, ${pulseAlpha + 0.3})` 
                        : `rgba(100, 100, 100, ${pulseAlpha + 0.2})`;
                    ctx.font = '8px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(block.hash, 0, 0);
                    
                    // Chain links (small circles at corners for confirmed blocks)
                    if (block.confirmed) {
                        ctx.fillStyle = `rgba(0, 200, 255, ${pulseAlpha + 0.2})`;
                        ctx.beginPath();
                        ctx.arc(-halfSize, 0, 3, 0, Math.PI * 2);
                        ctx.arc(halfSize, 0, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    ctx.restore();
                }
                break;
            case 'neon':
                // Coruscant-style cyberpunk city
                
                // Dark blue gradient sky
                const skyGrad = ctx.createLinearGradient(0, 0, 0, this.H);
                skyGrad.addColorStop(0, '#0a1628');
                skyGrad.addColorStop(0.3, '#122540');
                skyGrad.addColorStop(0.6, '#1a3050');
                skyGrad.addColorStop(1, '#2a4060');
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Subtle clouds/haze
                ctx.fillStyle = 'rgba(40, 60, 90, 0.15)';
                for (let i = 0; i < 5; i++) {
                    const cx = (i * 200 + Date.now() * 0.01) % (this.W + 200) - 100;
                    const cy = this.H * 0.35 + Math.sin(i) * 30;
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, 150, 30, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // City glow at horizon
                const horizonGlow = ctx.createRadialGradient(this.W / 2, this.H * 0.75, 0, this.W / 2, this.H * 0.75, this.W * 0.8);
                horizonGlow.addColorStop(0, 'rgba(255, 180, 100, 0.25)');
                horizonGlow.addColorStop(0.5, 'rgba(255, 120, 50, 0.1)');
                horizonGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = horizonGlow;
                ctx.fillRect(0, this.H * 0.4, this.W, this.H * 0.6);
                
                const groundY = this.H;
                
                // Draw buildings by layer (back to front)
                for (let b of this.neonBuildings) {
                    const bx = b.x;
                    const by = groundY - b.height;
                    
                    // Layer-based opacity and color
                    const layerAlpha = 0.4 + b.layer * 0.25;
                    const layerColor = b.layer === 2 ? '#0a1520' : b.layer === 1 ? '#0c1825' : '#0e1a28';
                    
                    // Building body
                    ctx.fillStyle = layerColor;
                    ctx.globalAlpha = layerAlpha + 0.3;
                    
                    // Main building shape
                    ctx.beginPath();
                    ctx.moveTo(bx, groundY + 50);
                    ctx.lineTo(bx, by + 10);
                    // Rounded or pointed top
                    if (b.spireHeight > 0) {
                        ctx.lineTo(bx + b.width * 0.3, by);
                        ctx.lineTo(bx + b.width * 0.5, by - b.spireHeight);
                        ctx.lineTo(bx + b.width * 0.7, by);
                    } else {
                        ctx.quadraticCurveTo(bx + b.width * 0.5, by - 10, bx + b.width, by + 10);
                    }
                    ctx.lineTo(bx + b.width, groundY + 50);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.globalAlpha = 1;
                    
                    // Edge highlights
                    ctx.strokeStyle = `rgba(100, 150, 200, ${0.1 + b.layer * 0.05})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(bx, by + 10);
                    ctx.lineTo(bx, groundY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(bx + b.width, by + 10);
                    ctx.lineTo(bx + b.width, groundY);
                    ctx.stroke();
                    
                    // Windows (only for front layers)
                    if (b.layer < 2) {
                        for (let w of b.windows) {
                            if (w.lit) {
                                ctx.fillStyle = `rgba(255, 220, 170, 0.7)`;
                                ctx.fillRect(bx + w.x, by + w.y, 5, 8);
                            }
                        }
                    }
                    
                    // Top beacon lights
                    if (b.topLight && b.layer < 2) {
                        const beaconY = b.spireHeight > 0 ? by - b.spireHeight : by;
                        const pulse = Math.sin(Date.now() * 0.003 + b.x) * 0.5 + 0.5;
                        
                        // Glow
                        const glowGrad = ctx.createRadialGradient(bx + b.width/2, beaconY, 0, bx + b.width/2, beaconY, 15);
                        glowGrad.addColorStop(0, `rgba(255, 100, 50, ${pulse * 0.8})`);
                        glowGrad.addColorStop(1, 'transparent');
                        ctx.fillStyle = glowGrad;
                        ctx.fillRect(bx + b.width/2 - 15, beaconY - 15, 30, 30);
                        
                        // Light point
                        ctx.fillStyle = `rgba(255, ${150 + pulse * 100}, ${50 + pulse * 50}, ${0.8 + pulse * 0.2})`;
                        ctx.beginPath();
                        ctx.arc(bx + b.width/2, beaconY, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Flying speeders
                for (let ship of this.neonShips) {
                    ship.x += ship.speed * ship.direction;
                    
                    // Wrap around
                    if (ship.x > this.W + 100) { ship.x = -50; ship.y = 100 + Math.random() * (this.H * 0.5); }
                    if (ship.x < -100) { ship.x = this.W + 50; ship.y = 100 + Math.random() * (this.H * 0.5); }
                    
                    // Engine trail
                    const trailGrad = ctx.createLinearGradient(
                        ship.x - ship.tailLength * ship.direction, ship.y,
                        ship.x, ship.y
                    );
                    trailGrad.addColorStop(0, 'transparent');
                    trailGrad.addColorStop(1, ship.color);
                    ctx.strokeStyle = trailGrad;
                    ctx.lineWidth = ship.size * 0.5;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(ship.x - ship.tailLength * ship.direction, ship.y);
                    ctx.lineTo(ship.x, ship.y);
                    ctx.stroke();
                    
                    // Ship body (small glowing dot)
                    ctx.fillStyle = ship.color;
                    ctx.shadowColor = ship.color;
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(ship.x, ship.y, ship.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
                
                // Bottom city glow (warm lights)
                const bottomGlow = ctx.createLinearGradient(0, this.H - 150, 0, this.H);
                bottomGlow.addColorStop(0, 'transparent');
                bottomGlow.addColorStop(0.5, 'rgba(255, 150, 80, 0.1)');
                bottomGlow.addColorStop(1, 'rgba(255, 120, 60, 0.2)');
                ctx.fillStyle = bottomGlow;
                ctx.fillRect(0, this.H - 150, this.W, 150);
                
                // Random distant lights twinkling
                ctx.fillStyle = 'rgba(255, 200, 150, 0.6)';
                for (let i = 0; i < 50; i++) {
                    if (Math.random() > 0.3) {
                        const lx = (i * 73.7) % this.W;
                        const ly = this.H * 0.6 + (i * 31.3) % (this.H * 0.35);
                        const size = Math.random() * 2;
                        ctx.globalAlpha = 0.3 + Math.random() * 0.4;
                        ctx.fillRect(lx, ly, size, size);
                    }
                }
                ctx.globalAlpha = 1;
                break;
            case 'circuit':
                // Circuit board background
                ctx.fillStyle = '#051510';
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Subtle grid pattern
                ctx.strokeStyle = 'rgba(0, 80, 60, 0.15)';
                ctx.lineWidth = 1;
                const gridStep = 30;
                for (let x = 0; x < this.W; x += gridStep) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, this.H);
                    ctx.stroke();
                }
                for (let y = 0; y < this.H; y += gridStep) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(this.W, y);
                    ctx.stroke();
                }
                
                // Draw circuit paths (traces)
                for (const path of this.circuitPaths) {
                    ctx.strokeStyle = 'rgba(0, 150, 100, 0.4)';
                    ctx.lineWidth = path.width;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    
                    ctx.beginPath();
                    ctx.moveTo(path.from.x, path.from.y);
                    ctx.lineTo(path.midX, path.from.y);
                    ctx.lineTo(path.midX, path.to.y);
                    ctx.lineTo(path.to.x, path.to.y);
                    ctx.stroke();
                }
                
                // Draw nodes
                for (const node of this.circuitNodes) {
                    node.pulse += 0.02;
                    const glow = 0.3 + Math.sin(node.pulse) * 0.1;
                    
                    if (node.type === 'chip') {
                        // Microchip
                        const chipW = 25;
                        const chipH = 15;
                        
                        ctx.fillStyle = '#0a0a0a';
                        ctx.fillRect(node.x - chipW/2, node.y - chipH/2, chipW, chipH);
                        
                        ctx.strokeStyle = `rgba(0, 200, 150, ${glow + 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(node.x - chipW/2, node.y - chipH/2, chipW, chipH);
                        
                        // Chip pins
                        ctx.fillStyle = `rgba(0, 200, 150, ${glow + 0.3})`;
                        for (let p = 0; p < 4; p++) {
                            ctx.fillRect(node.x - chipW/2 + 4 + p * 5, node.y - chipH/2 - 3, 2, 3);
                            ctx.fillRect(node.x - chipW/2 + 4 + p * 5, node.y + chipH/2, 2, 3);
                        }
                        
                        // Chip label
                        ctx.fillStyle = `rgba(0, 200, 150, ${glow})`;
                        ctx.font = '6px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText('IC', node.x, node.y + 2);
                        
                    } else if (node.type === 'capacitor') {
                        // Capacitor
                        ctx.fillStyle = '#1a1a1a';
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.strokeStyle = `rgba(0, 200, 150, ${glow + 0.2})`;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Capacitor marking
                        ctx.strokeStyle = `rgba(0, 200, 150, ${glow})`;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                        ctx.stroke();
                        
                    } else {
                        // Regular solder point / via
                        ctx.fillStyle = `rgba(0, 200, 150, ${glow + 0.3})`;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Inner hole
                        ctx.fillStyle = '#051510';
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.size * 0.4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Update and draw pulses (electricity flowing)
                for (let i = this.circuitPulses.length - 1; i >= 0; i--) {
                    const pulse = this.circuitPulses[i];
                    pulse.progress += pulse.speed;
                    
                    if (pulse.progress >= 1) {
                        this.circuitPulses.splice(i, 1);
                        // Spawn new pulse
                        if (Math.random() > 0.3) this.spawnCircuitPulse();
                        continue;
                    }
                    
                    // Calculate position along path
                    const path = pulse.path;
                    let px, py;
                    const t = pulse.progress;
                    
                    if (t < 0.33) {
                        // First segment
                        const segT = t / 0.33;
                        px = path.from.x + (path.midX - path.from.x) * segT;
                        py = path.from.y;
                    } else if (t < 0.66) {
                        // Second segment
                        const segT = (t - 0.33) / 0.33;
                        px = path.midX;
                        py = path.from.y + (path.to.y - path.from.y) * segT;
                    } else {
                        // Third segment
                        const segT = (t - 0.66) / 0.34;
                        px = path.midX + (path.to.x - path.midX) * segT;
                        py = path.to.y;
                    }
                    
                    // Draw pulse glow
                    const gradient = ctx.createRadialGradient(px, py, 0, px, py, pulse.size * 3);
                    gradient.addColorStop(0, pulse.color);
                    gradient.addColorStop(0.5, pulse.color + '60');
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(px, py, pulse.size * 3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bright center
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(px, py, pulse.size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Spawn new pulses occasionally
                if (Math.random() < 0.02) {
                    this.spawnCircuitPulse();
                }
                break;
            case 'space':
                // Deep space background
                const spaceGrad = ctx.createRadialGradient(this.W/2, this.H/2, 0, this.W/2, this.H/2, this.W * 0.8);
                spaceGrad.addColorStop(0, '#0a0a1a');
                spaceGrad.addColorStop(0.5, '#050510');
                spaceGrad.addColorStop(1, '#000005');
                ctx.fillStyle = spaceGrad;
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Draw nebula clouds (behind everything)
                for (const cloud of this.nebulaClouds) {
                    cloud.x += cloud.drift;
                    if (cloud.x > this.W + cloud.radius) cloud.x = -cloud.radius;
                    if (cloud.x < -cloud.radius) cloud.x = this.W + cloud.radius;
                    
                    const nebulaGrad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
                    nebulaGrad.addColorStop(0, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${cloud.alpha})`);
                    nebulaGrad.addColorStop(0.5, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${cloud.alpha * 0.5})`);
                    nebulaGrad.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = nebulaGrad;
                    ctx.beginPath();
                    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Draw planets
                for (const planet of this.planets) {
                    // Ring behind planet
                    if (planet.hasRing) {
                        ctx.strokeStyle = planet.ringColor;
                        ctx.lineWidth = planet.ringWidth;
                        ctx.beginPath();
                        ctx.ellipse(planet.x, planet.y, planet.radius * 1.8, planet.radius * 0.4, -0.3, Math.PI, Math.PI * 2);
                        ctx.stroke();
                    }
                    
                    // Planet body
                    const planetGrad = ctx.createRadialGradient(
                        planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 0,
                        planet.x, planet.y, planet.radius
                    );
                    planetGrad.addColorStop(0, planet.color1);
                    planetGrad.addColorStop(1, planet.color2);
                    
                    ctx.beginPath();
                    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
                    ctx.fillStyle = planetGrad;
                    ctx.fill();
                    
                    // Atmosphere glow
                    const atmoGrad = ctx.createRadialGradient(planet.x, planet.y, planet.radius * 0.9, planet.x, planet.y, planet.radius * 1.2);
                    atmoGrad.addColorStop(0, 'transparent');
                    atmoGrad.addColorStop(0.5, 'rgba(100, 150, 255, 0.1)');
                    atmoGrad.addColorStop(1, 'transparent');
                    ctx.fillStyle = atmoGrad;
                    ctx.beginPath();
                    ctx.arc(planet.x, planet.y, planet.radius * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Ring in front of planet
                    if (planet.hasRing) {
                        ctx.strokeStyle = planet.ringColor;
                        ctx.lineWidth = planet.ringWidth;
                        ctx.beginPath();
                        ctx.ellipse(planet.x, planet.y, planet.radius * 1.8, planet.radius * 0.4, -0.3, 0, Math.PI);
                        ctx.stroke();
                    }
                }
                
                // Draw stars
                for (const star of this.stars) {
                    star.twinklePhase += star.twinkleSpeed;
                    const twinkle = 0.5 + Math.sin(star.twinklePhase) * 0.5;
                    const alpha = star.brightness * twinkle;
                    
                    ctx.fillStyle = star.color;
                    ctx.globalAlpha = alpha;
                    
                    if (star.size > 1.5) {
                        ctx.shadowColor = star.color;
                        ctx.shadowBlur = star.size * 2;
                    }
                    
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.shadowBlur = 0;
                }
                ctx.globalAlpha = 1;
                
                // Spawn shooting stars occasionally
                if (Math.random() < 0.008) {
                    this.spawnShootingStar();
                }
                
                // Update and draw shooting stars
                for (let i = this.shootingStars.length - 1; i >= 0; i--) {
                    const ss = this.shootingStars[i];
                    ss.x += ss.vx;
                    ss.y += ss.vy;
                    ss.life -= ss.decay;
                    
                    if (ss.life <= 0 || ss.y > this.H + 50) {
                        this.shootingStars.splice(i, 1);
                        continue;
                    }
                    
                    // Draw shooting star trail
                    const ssGrad = ctx.createLinearGradient(
                        ss.x - ss.vx * ss.length / 5, ss.y - ss.vy * ss.length / 5,
                        ss.x, ss.y
                    );
                    ssGrad.addColorStop(0, 'transparent');
                    ssGrad.addColorStop(0.7, `rgba(255, 255, 255, ${ss.life * 0.3})`);
                    ssGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.life})`);
                    
                    ctx.strokeStyle = ssGrad;
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(ss.x - ss.vx * ss.length / 5, ss.y - ss.vy * ss.length / 5);
                    ctx.lineTo(ss.x, ss.y);
                    ctx.stroke();
                    
                    // Bright head
                    ctx.fillStyle = `rgba(255, 255, 255, ${ss.life})`;
                    ctx.beginPath();
                    ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 'waves':
                // Abstract ocean waves background - OPTIMIZED
                
                // Deep ocean gradient
                const oceanGrad = ctx.createLinearGradient(0, 0, 0, this.H);
                oceanGrad.addColorStop(0, '#020818');
                oceanGrad.addColorStop(0.5, '#041030');
                oceanGrad.addColorStop(1, '#082060');
                ctx.fillStyle = oceanGrad;
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Draw waves from back to front (optimized step size)
                for (let i = 0; i < this.waves.length; i++) {
                    const wave = this.waves[i];
                    wave.phase += wave.speed;
                    
                    ctx.beginPath();
                    
                    // Draw wave curve with larger step
                    for (let x = 0; x <= this.W; x += 10) {
                        const y = wave.y + 
                            Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
                            Math.sin(x * wave.frequency * 2 + wave.phase * 1.5) * wave.amplitude * 0.3;
                        
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    
                    // Complete the shape
                    ctx.lineTo(this.W, this.H);
                    ctx.lineTo(0, this.H);
                    ctx.closePath();
                    
                    // Simple fill
                    ctx.fillStyle = `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.alpha})`;
                    ctx.fill();
                }
                
                // Simplified floating particles (fewer, no shadows)
                for (const p of this.waveParticles) {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.pulse += 0.05;
                    
                    if (p.x > this.W + 10) p.x = -10;
                    if (p.y < -10) p.y = this.H + 10;
                    if (p.y > this.H + 10) p.y = -10;
                    
                    const pAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
                    ctx.fillStyle = `rgba(150, 220, 255, ${pAlpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Simplified light rays (just 3)
                ctx.globalAlpha = 0.04;
                for (let i = 0; i < 3; i++) {
                    const rayX = (this.W * 0.25) + i * (this.W * 0.25);
                    ctx.fillStyle = '#4488cc';
                    ctx.beginPath();
                    ctx.moveTo(rayX, 0);
                    ctx.lineTo(rayX + 30, this.H);
                    ctx.lineTo(rayX + 80, this.H);
                    ctx.lineTo(rayX + 50, 0);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                
                // Simple vignette
                const waveVig = ctx.createRadialGradient(this.W/2, this.H/2, this.H * 0.4, this.W/2, this.H/2, this.H);
                waveVig.addColorStop(0, 'transparent');
                waveVig.addColorStop(1, 'rgba(0, 0, 20, 0.4)');
                ctx.fillStyle = waveVig;
                ctx.fillRect(0, 0, this.W, this.H);
                break;
            case 'retro':
                // Retro 80s synthwave - OPTIMIZED
                
                // Gradient sky
                const retroSkyGrad = ctx.createLinearGradient(0, 0, 0, this.H * 0.6);
                retroSkyGrad.addColorStop(0, '#0f0520');
                retroSkyGrad.addColorStop(0.4, '#4a1d5c');
                retroSkyGrad.addColorStop(0.7, '#d4458a');
                retroSkyGrad.addColorStop(1, '#ff6b35');
                ctx.fillStyle = retroSkyGrad;
                ctx.fillRect(0, 0, this.W, this.H * 0.6);
                
                // Sun
                const sunY = this.H * 0.35;
                const sunRadius = Math.min(this.W, this.H) * 0.15;
                
                // Sun body
                const sunGrad = ctx.createLinearGradient(this.W/2, sunY - sunRadius, this.W/2, sunY + sunRadius);
                sunGrad.addColorStop(0, '#ffeb3b');
                sunGrad.addColorStop(0.5, '#ff9800');
                sunGrad.addColorStop(1, '#e91e63');
                ctx.beginPath();
                ctx.arc(this.W/2, sunY, sunRadius, 0, Math.PI * 2);
                ctx.fillStyle = sunGrad;
                ctx.fill();
                
                // Sun stripes (simplified)
                ctx.fillStyle = '#0f0520';
                for (let i = 0; i < 5; i++) {
                    const stripeY = sunY + i * 12 + 5;
                    const stripeH = 4 + i * 2;
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(this.W/2, sunY, sunRadius, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.fillRect(this.W/2 - sunRadius, stripeY, sunRadius * 2, stripeH);
                    ctx.restore();
                }
                
                // Ground
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(0, this.H * 0.6, this.W, this.H * 0.4);
                
                // Grid (simplified)
                const horizonY = this.H * 0.6;
                
                // Horizontal lines (fewer)
                ctx.strokeStyle = '#ff00ff';
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.5;
                for (let i = 0; i < 10; i++) {
                    const y = horizonY + Math.pow(i / 10, 1.5) * (this.H - horizonY);
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(this.W, y);
                    ctx.stroke();
                }
                
                // Vertical lines (fewer)
                const gridOffset = (Date.now() * 0.04) % 80;
                ctx.strokeStyle = '#00ffff';
                ctx.globalAlpha = 0.4;
                for (let i = -5; i <= 10; i++) {
                    const baseX = i * 60 + gridOffset - this.W/2;
                    ctx.beginPath();
                    ctx.moveTo(this.W/2 + baseX * 0.1, horizonY);
                    ctx.lineTo(this.W/2 + baseX * 2.5, this.H);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                
                // Mountains (simplified)
                ctx.fillStyle = '#1a0a2e';
                ctx.beginPath();
                ctx.moveTo(0, horizonY);
                for (let mx = 0; mx <= this.W; mx += 40) {
                    const peakH = 30 + Math.sin(mx * 0.02) * 40;
                    ctx.lineTo(mx, horizonY - peakH);
                }
                ctx.lineTo(this.W, horizonY);
                ctx.fill();
                
                // Stars (fewer)
                ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 25; i++) {
                    const sx = (i * 137.5) % this.W;
                    const sy = (i * 73.3) % (this.H * 0.35);
                    ctx.globalAlpha = Math.sin(Date.now() * 0.002 + i) * 0.3 + 0.5;
                    ctx.fillRect(sx, sy, 2, 2);
                }
                ctx.globalAlpha = 1;
                break;
            
            case 'crt':
                // CRT Monitor - full screen terminal
                ctx.fillStyle = '#0a0f0a';
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Initialize text lines if empty
                if (!this.crtTextLines || this.crtTextLines.length === 0) {
                    this.crtTextLines = [
                        'C:\\CRYPTO> dir',
                        '  BITCOIN.EXE      21,000,000 BTC',
                        '  ETHEREUM.DAT     120,000,000 ETH', 
                        '  WALLET.KEY       ************',
                        '  BLOCKCHAIN.SYS   IMMUTABLE',
                        '',
                        'C:\\CRYPTO> run miner.exe',
                        'INITIALIZING MINING PROTOCOL...',
                        'CONNECTING TO POOL: stratum://mine.crypto',
                        'GPU 0: RTX 4090 - DETECTED',
                        'GPU 1: RTX 4090 - DETECTED',
                        'HASHRATE: 120.5 MH/s',
                        '',
                        'BLOCK #847,293 FOUND!',
                        'NONCE: 0x7f3a8b2c',
                        'REWARD: 6.25 BTC',
                        'BROADCASTING TO NETWORK...',
                        '',
                        'C:\\CRYPTO> wallet balance',
                        'ADDRESS: 0x8A7b3F2d9E1c4B6a',
                        'BTC: 3.14159265',
                        'ETH: 42.0000000',
                        'USDT: 10,000.00',
                        '',
                        'C:\\CRYPTO> netstat -crypto',
                        'PEERS CONNECTED: 8,421',
                        'BLOCKS SYNCED: 847,293/847,293',
                        'MEMPOOL: 4,521 TX PENDING',
                        'NETWORK: HEALTHY',
                        '',
                        '> SLICE TOKENS TO COLLECT_',
                        '',
                        'SYSTEM STATUS: OPERATIONAL',
                        'UPTIME: 420:69:00',
                        'TEMP: 65°C (OPTIMAL)',
                        'POWER: 850W',
                        ''
                    ];
                }
                
                // Scrolling terminal text - centered
                this.crtCursorBlink += 0.05;
                ctx.font = '13px monospace';
                const crtLineH = 18;
                const crtScroll = (Date.now() * 0.015) % (this.crtTextLines.length * crtLineH);
                const crtVisibleLines = Math.ceil(this.H / crtLineH) + 2;
                const crtTextX = Math.max(30, (this.W - 280) / 2); // Center text block
                
                for (let i = 0; i < crtVisibleLines; i++) {
                    const lineIdx = Math.floor((crtScroll / crtLineH) + i) % this.crtTextLines.length;
                    const ty = i * crtLineH - (crtScroll % crtLineH) + 20;
                    
                    if (ty > -crtLineH && ty < this.H + crtLineH) {
                        const text = this.crtTextLines[lineIdx];
                        // Color based on content
                        if (text.includes('FOUND') || text.includes('REWARD')) {
                            ctx.fillStyle = '#00ff00';
                            ctx.globalAlpha = 0.9;
                        } else if (text.includes('ERROR') || text.includes('WARN')) {
                            ctx.fillStyle = '#ffff00';
                            ctx.globalAlpha = 0.8;
                        } else if (text.startsWith('C:\\')) {
                            ctx.fillStyle = '#00ff00';
                            ctx.globalAlpha = 0.85;
                        } else {
                            ctx.fillStyle = '#00cc00';
                            ctx.globalAlpha = 0.6;
                        }
                        ctx.fillText(text, crtTextX, ty);
                    }
                }
                ctx.globalAlpha = 1;
                
                // Scanlines
                ctx.fillStyle = 'rgba(0, 30, 0, 0.4)';
                for (let y = 0; y < this.H; y += 3) {
                    ctx.fillRect(0, y, this.W, 1);
                }
                
                // Blinking cursor at bottom center
                if (Math.sin(this.crtCursorBlink * 3) > 0) {
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(crtTextX, this.H - 30, 10, 14);
                }
                
                // CRT curvature vignette
                const crtVig = ctx.createRadialGradient(this.W/2, this.H/2, this.H * 0.3, this.W/2, this.H/2, this.H * 0.85);
                crtVig.addColorStop(0, 'transparent');
                crtVig.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
                ctx.fillStyle = crtVig;
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Phosphor glow
                ctx.fillStyle = 'rgba(0, 255, 0, 0.03)';
                ctx.fillRect(0, 0, this.W, this.H);
                break;
            
            case 'pixel':
                // Dynamic full-screen 8-bit pixel art
                this.pixelOffset += 1.5;
                const pxSize = 4;
                
                // Scrolling sky gradient
                for (let y = 0; y < this.H; y += pxSize) {
                    const skyProg = y / this.H;
                    const r = Math.floor(92 - skyProg * 60);
                    const g = Math.floor(148 - skyProg * 40);
                    const b = Math.floor(252 - skyProg * 100);
                    ctx.fillStyle = `rgb(${Math.max(0,r)}, ${Math.max(0,g)}, ${Math.max(0,b)})`;
                    ctx.fillRect(0, y, this.W, pxSize);
                }
                
                // Pixel stars (twinkling)
                ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 30; i++) {
                    const sx = (i * 97 + this.pixelOffset * 0.1) % this.W;
                    const sy = (i * 53) % (this.H * 0.5);
                    if (Math.sin(Date.now() * 0.003 + i * 2) > 0.3) {
                        ctx.fillRect(Math.floor(sx / pxSize) * pxSize, Math.floor(sy / pxSize) * pxSize, pxSize, pxSize);
                    }
                }
                
                // Scrolling pixel mountains (parallax layers)
                for (let layer = 0; layer < 3; layer++) {
                    const layerSpeed = (layer + 1) * 0.3;
                    const layerHeight = 80 - layer * 20;
                    const layerY = this.H * (0.4 + layer * 0.1);
                    const colors = ['#2d1b4e', '#4a2c6a', '#6b3d8a'];
                    ctx.fillStyle = colors[layer];
                    
                    ctx.beginPath();
                    ctx.moveTo(0, this.H);
                    for (let x = 0; x <= this.W + pxSize; x += pxSize) {
                        const noiseX = (x + this.pixelOffset * layerSpeed) * 0.01;
                        const h = Math.sin(noiseX) * layerHeight + Math.sin(noiseX * 2.5) * layerHeight * 0.5;
                        ctx.lineTo(x, layerY - Math.abs(h));
                    }
                    ctx.lineTo(this.W, this.H);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // Ground with scrolling grass pattern
                ctx.fillStyle = '#3d7c3d';
                ctx.fillRect(0, this.H * 0.75, this.W, this.H * 0.25);
                ctx.fillStyle = '#2d5c2d';
                for (let x = 0; x < this.W; x += pxSize * 4) {
                    const gx = (x + this.pixelOffset) % this.W;
                    ctx.fillRect(gx, this.H * 0.75, pxSize * 2, pxSize);
                }
                
                // Scrolling pixel clouds
                ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 8; i++) {
                    const cx = ((i * 120 + this.pixelOffset * 0.5) % (this.W + 100)) - 50;
                    const cy = 40 + (i % 3) * 50;
                    const cw = 32 + (i % 2) * 16;
                    // Cloud shape
                    ctx.fillRect(cx, cy, cw, 12);
                    ctx.fillRect(cx - 8, cy + 6, 12, 8);
                    ctx.fillRect(cx + cw - 4, cy + 6, 12, 8);
                    ctx.fillRect(cx + 8, cy - 6, cw - 16, 8);
                }
                
                // Floating coins animation
                ctx.fillStyle = '#FFD700';
                for (let i = 0; i < 6; i++) {
                    const coinX = ((i * 150 + this.pixelOffset * 2) % (this.W + 50)) - 25;
                    const coinY = this.H * 0.5 + Math.sin(Date.now() * 0.004 + i) * 20;
                    ctx.fillRect(coinX, coinY, 16, 16);
                    ctx.fillStyle = '#CC9900';
                    ctx.fillRect(coinX + 4, coinY + 4, 8, 8);
                    ctx.fillStyle = '#FFD700';
                }
                
                // Moving pixel enemies
                ctx.fillStyle = '#aa3333';
                for (let i = 0; i < 4; i++) {
                    const ex = ((i * 180 + this.pixelOffset * 1.5) % (this.W + 40)) - 20;
                    const ey = this.H * 0.72 - 16;
                    // Enemy body
                    ctx.fillRect(ex, ey, 16, 16);
                    // Eyes
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(ex + 2, ey + 4, 4, 4);
                    ctx.fillRect(ex + 10, ey + 4, 4, 4);
                    ctx.fillStyle = '#aa3333';
                }
                
                // Animated question blocks
                for (let i = 0; i < 3; i++) {
                    const bx = 80 + i * 150;
                    const by = this.H * 0.55 + Math.sin(Date.now() * 0.005 + i * 2) * 3;
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(bx, by, 24, 24);
                    ctx.fillStyle = '#CC9900';
                    ctx.fillRect(bx + 2, by + 2, 20, 20);
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 14px monospace';
                    ctx.fillText('?', bx + 7, by + 18);
                }
                
                // Pipes
                ctx.fillStyle = '#33aa33';
                for (let i = 0; i < 2; i++) {
                    const pipeX = 100 + i * 250;
                    const pipeH = 60 + i * 20;
                    ctx.fillRect(pipeX, this.H * 0.75 - pipeH, 32, pipeH);
                    ctx.fillStyle = '#44cc44';
                    ctx.fillRect(pipeX - 4, this.H * 0.75 - pipeH, 40, 12);
                    ctx.fillStyle = '#33aa33';
                }
                break;
            
            case 'win95':
                // Windows 95 desktop with dynamic windows
                ctx.fillStyle = '#008080';
                ctx.fillRect(0, 0, this.W, this.H);
                
                this.win95Timer += 0.016;
                
                // Initialize or update windows dynamically
                if (!this.win95Initialized) {
                    this.win95Windows = [];
                    this.win95Initialized = true;
                }
                
                // Spawn new windows periodically
                if (Math.random() < 0.02 && this.win95Windows.length < 8) {
                    const titles = ['Error', 'Warning', 'My Computer', 'Recycle Bin', 'Internet', 
                                   'Notepad', 'Calculator', 'Crypto', 'Miner', 'Wallet'];
                    const msgs = ['File not found', 'Low disk space', 'Access denied', 'Connected',
                                 'Mining: 42 MH/s', 'BTC: 3.14', 'Sync: 99%', 'Ready'];
                    const icons = ['⚠️', '❌', '💾', '📁', '🌐', '📝', '🔢', '💰', '⛏️', '🔐'];
                    
                    // Bigger windows for mobile
                    const minW = Math.min(180, this.W * 0.45);
                    const maxW = Math.min(240, this.W * 0.55);
                    const winW = minW + Math.random() * (maxW - minW);
                    const winH = 100 + Math.random() * 40;
                    
                    this.win95Windows.push({
                        x: Math.random() * (this.W - winW - 10),
                        y: Math.random() * (this.H - winH - 60),
                        w: winW,
                        h: winH,
                        title: titles[Math.floor(Math.random() * titles.length)],
                        msg: msgs[Math.floor(Math.random() * msgs.length)],
                        icon: icons[Math.floor(Math.random() * icons.length)],
                        age: 0,
                        closing: false,
                        scale: 0
                    });
                }
                
                // Update and draw windows
                for (let i = this.win95Windows.length - 1; i >= 0; i--) {
                    const win = this.win95Windows[i];
                    win.age += 0.016;
                    
                    // Opening animation
                    if (win.scale < 1 && !win.closing) {
                        win.scale = Math.min(1, win.scale + 0.1);
                    }
                    
                    // Start closing after random time
                    if (win.age > 3 + Math.random() * 5 && !win.closing) {
                        win.closing = true;
                    }
                    
                    // Closing animation
                    if (win.closing) {
                        win.scale -= 0.1;
                        if (win.scale <= 0) {
                            this.win95Windows.splice(i, 1);
                            continue;
                        }
                    }
                    
                    ctx.save();
                    ctx.translate(win.x + win.w/2, win.y + win.h/2);
                    ctx.scale(win.scale, win.scale);
                    ctx.translate(-win.w/2, -win.h/2);
                    
                    // Window shadow
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(4, 4, win.w, win.h);
                    
                    // Window body
                    ctx.fillStyle = '#c0c0c0';
                    ctx.fillRect(0, 0, win.w, win.h);
                    
                    // 3D border
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, win.w, 2);
                    ctx.fillRect(0, 0, 2, win.h);
                    ctx.fillStyle = '#808080';
                    ctx.fillRect(0, win.h - 2, win.w, 2);
                    ctx.fillRect(win.w - 2, 0, 2, win.h);
                    
                    // Title bar
                    const titleGrad = ctx.createLinearGradient(0, 0, win.w, 0);
                    titleGrad.addColorStop(0, '#000080');
                    titleGrad.addColorStop(1, '#1084d0');
                    ctx.fillStyle = titleGrad;
                    ctx.fillRect(3, 3, win.w - 6, 18);
                    
                    // Title text (clipped to title bar) - CENTERED
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(5, 3, win.w - 28, 18);
                    ctx.clip();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 11px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(win.title, (win.w - 15) / 2, 15);
                    ctx.restore();
                    
                    // Close button
                    ctx.fillStyle = '#c0c0c0';
                    ctx.fillRect(win.w - 18, 5, 14, 14);
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 12px Arial';
                    ctx.fillText('×', win.w - 14, 16);
                    
                    // Content (clipped to window body) - CENTERED
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(5, 24, win.w - 10, win.h - 52);
                    ctx.clip();
                    ctx.fillStyle = '#000000';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(win.icon + ' ' + win.msg, win.w / 2, 42);
                    ctx.restore();
                    
                    // OK button
                    ctx.fillStyle = '#c0c0c0';
                    ctx.fillRect(win.w/2 - 30, win.h - 26, 60, 18);
                    ctx.strokeStyle = '#808080';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(win.w/2 - 30, win.h - 26, 60, 18);
                    ctx.fillStyle = '#000000';
                    ctx.font = '11px Arial';
                    ctx.fillText('OK', win.w/2 - 6, win.h - 12);
                    
                    ctx.restore();
                }
                
                // Desktop icons
                const desktopIcons = [
                    {x: 10, y: 10, icon: '💾', label: 'My Computer'},
                    {x: 10, y: 80, icon: '🗑️', label: 'Recycle Bin'},
                    {x: 10, y: 150, icon: '🌐', label: 'Internet'},
                    {x: 10, y: 220, icon: '📁', label: 'My Documents'}
                ];
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                for (const ico of desktopIcons) {
                    ctx.font = '24px Arial';
                    ctx.fillText(ico.icon, ico.x + 20, ico.y + 25);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '10px Arial';
                    ctx.fillText(ico.label, ico.x + 20, ico.y + 45);
                    ctx.fillStyle = '#000000';
                }
                ctx.textAlign = 'left';
                
                // Taskbar
                ctx.fillStyle = '#c0c0c0';
                ctx.fillRect(0, this.H - 28, this.W, 28);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, this.H - 28, this.W, 1);
                
                // Start button
                ctx.fillStyle = '#c0c0c0';
                ctx.fillRect(2, this.H - 26, 54, 24);
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 11px Arial';
                ctx.fillText('🪟Start', 6, this.H - 10);
                
                // Taskbar items for open windows
                let taskX = 60;
                for (const win of this.win95Windows.slice(0, 6)) {
                    ctx.fillStyle = '#c0c0c0';
                    ctx.fillRect(taskX, this.H - 26, 60, 24);
                    ctx.fillStyle = '#000000';
                    ctx.font = '9px Arial';
                    ctx.fillText(win.title.slice(0, 8), taskX + 3, this.H - 10);
                    taskX += 62;
                }
                
                // Clock
                const now = new Date();
                ctx.fillStyle = '#000000';
                ctx.font = '11px Arial';
                ctx.fillText(now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}), this.W - 45, this.H - 10);
                break;
            
            case 'nokia':
                // Nokia 3310 LCD screen - OPTIMIZED
                const lcdBg = '#9bbc0f';
                const lcdDark = '#0f380f';
                const lcdMed = '#306230';
                
                // Simple LCD background (no pixel grid - was causing lag)
                ctx.fillStyle = lcdBg;
                ctx.fillRect(0, 0, this.W, this.H);
                
                // Subtle LCD texture with just lines (much faster)
                ctx.strokeStyle = '#8bac0f';
                ctx.lineWidth = 1;
                for (let y = 0; y < this.H; y += 8) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(this.W, y);
                    ctx.stroke();
                }
                
                // Snake game - optimized movement
                if (!this.nokiaInitialized) {
                    this.nokiaSnake = [];
                    for (let i = 0; i < 12; i++) {
                        this.nokiaSnake.push({x: 15 - i, y: 12});
                    }
                    this.nokiaFood = {x: 25, y: 15};
                    this.nokiaSnakeDir = 0;
                    this.nokiaLastMove = Date.now();
                    this.nokiaInitialized = true;
                }
                
                // Move snake at fixed interval (not every frame)
                const nowTime = Date.now();
                if (nowTime - this.nokiaLastMove > 150) {
                    this.nokiaLastMove = nowTime;
                    const head = {x: this.nokiaSnake[0].x, y: this.nokiaSnake[0].y};
                    
                    // Smart AI - move towards food
                    const dx = this.nokiaFood.x - head.x;
                    const dy = this.nokiaFood.y - head.y;
                    
                    if (Math.random() < 0.7) {
                        // Move towards food
                        if (Math.abs(dx) > Math.abs(dy)) {
                            this.nokiaSnakeDir = dx > 0 ? 0 : 2;
                        } else {
                            this.nokiaSnakeDir = dy > 0 ? 1 : 3;
                        }
                    } else if (Math.random() < 0.1) {
                        // Random turn
                        this.nokiaSnakeDir = Math.floor(Math.random() * 4);
                    }
                    
                    // Move
                    if (this.nokiaSnakeDir === 0) head.x++;
                    else if (this.nokiaSnakeDir === 1) head.y++;
                    else if (this.nokiaSnakeDir === 2) head.x--;
                    else head.y--;
                    
                    // Wrap
                    const gridW = Math.floor(this.W / 10);
                    const gridH = Math.floor((this.H - 50) / 10);
                    head.x = (head.x + gridW) % gridW;
                    head.y = ((head.y - 2 + gridH) % gridH) + 2;
                    
                    this.nokiaSnake.unshift(head);
                    
                    // Eat food
                    if (head.x === this.nokiaFood.x && head.y === this.nokiaFood.y) {
                        this.nokiaFood = {
                            x: Math.floor(Math.random() * gridW),
                            y: Math.floor(Math.random() * gridH) + 2
                        };
                        // Grow snake (keep tail)
                    } else {
                        this.nokiaSnake.pop();
                    }
                }
                
                // Draw snake body
                ctx.fillStyle = lcdDark;
                for (let i = 0; i < this.nokiaSnake.length; i++) {
                    const seg = this.nokiaSnake[i];
                    const size = i === 0 ? 9 : 8; // Head slightly bigger
                    ctx.fillRect(seg.x * 10 + 1, seg.y * 10 + 1, size, size);
                }
                
                // Draw food (blinking)
                if (Math.floor(nowTime / 300) % 2 === 0) {
                    ctx.fillStyle = lcdDark;
                } else {
                    ctx.fillStyle = lcdMed;
                }
                ctx.fillRect(this.nokiaFood.x * 10 + 2, this.nokiaFood.y * 10 + 2, 6, 6);
                
                // Top bar
                ctx.fillStyle = lcdDark;
                ctx.fillRect(0, 0, this.W, 18);
                ctx.fillStyle = lcdBg;
                ctx.font = 'bold 11px monospace';
                ctx.fillText('SNAKE II', 8, 13);
                
                // Signal bars
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(this.W - 45 + i * 7, 13 - i * 2, 4, 3 + i * 2);
                }
                
                // Battery
                ctx.strokeStyle = lcdBg;
                ctx.lineWidth = 1;
                ctx.strokeRect(this.W - 22, 4, 14, 8);
                ctx.fillRect(this.W - 20, 6, 9, 4);
                ctx.fillRect(this.W - 8, 6, 2, 4);
                
                // Bottom score bar
                ctx.fillStyle = lcdDark;
                ctx.fillRect(0, this.H - 20, this.W, 20);
                ctx.fillStyle = lcdBg;
                ctx.font = '11px monospace';
                ctx.fillText('Score: ' + ((this.nokiaSnake.length - 8) * 10), 8, this.H - 6);
                ctx.fillText('Hi: 420', this.W - 60, this.H - 6);
                break;
            
            case 'oscilloscope':
                // Oscilloscope display with subtle slice reactions
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(0, 0, this.W, this.H);
                
                this.oscTime += 0.03;
                
                // Calculate reaction intensity from recent slices (reduced)
                let coinReact = 0;
                let bombReact = 0;
                if (this.oscReactions) {
                    for (let i = this.oscReactions.length - 1; i >= 0; i--) {
                        const r = this.oscReactions[i];
                        r.age += 0.06; // Faster decay
                        if (r.age > 1) {
                            this.oscReactions.splice(i, 1);
                        } else {
                            const intensity = (1 - r.age) * r.intensity * 0.4; // Reduced intensity
                            if (r.type === 'coin') coinReact += intensity;
                            else bombReact += intensity;
                        }
                    }
                }
                
                // Grid
                ctx.strokeStyle = bombReact > 0.2 ? '#2a1a1a' : '#1a3a1a';
                ctx.lineWidth = 1;
                const oscGridSize = 40;
                
                for (let x = 0; x < this.W; x += oscGridSize) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, this.H);
                    ctx.stroke();
                }
                for (let y = 0; y < this.H; y += oscGridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(this.W, y);
                    ctx.stroke();
                }
                
                // Center lines
                ctx.strokeStyle = bombReact > 0.2 ? '#3a2a2a' : '#2a5a2a';
                ctx.beginPath();
                ctx.moveTo(this.W/2, 0);
                ctx.lineTo(this.W/2, this.H);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, this.H/2);
                ctx.lineTo(this.W, this.H/2);
                ctx.stroke();
                
                // Main waveform (green) - subtle coin reaction
                const coinAmp = 80 + coinReact * 40;
                const coinFreq = 0.02 + coinReact * 0.005;
                ctx.strokeStyle = '#00ff00';
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = 8 + coinReact * 5;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < this.W; x += 2) {
                    const y = this.H/2 + Math.sin(x * coinFreq + this.oscTime * 2) * coinAmp + Math.sin(x * 0.05 + this.oscTime) * (30 + coinReact * 15);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // Secondary waveform (cyan)
                ctx.strokeStyle = '#00ffff';
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 6;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < this.W; x += 2) {
                    const y = this.H/2 + Math.sin(x * 0.03 + this.oscTime * 1.5 + 1) * (50 + coinReact * 10);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // Third waveform - subtle bomb reaction
                if (bombReact > 0.15) {
                    ctx.strokeStyle = '#ff6666';
                    ctx.shadowColor = '#ff4444';
                    ctx.shadowBlur = 8 + bombReact * 10;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    for (let x = 0; x < this.W; x += 2) {
                        // Reduced noise when bomb hit
                        const noise = (Math.random() - 0.5) * bombReact * 60;
                        const spike = Math.sin(x * 0.1 + this.oscTime * 5) * bombReact * 30;
                        const y = this.H/2 + this.H * 0.25 + noise + spike;
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                } else {
                    ctx.strokeStyle = '#ffff00';
                    ctx.shadowColor = '#ffff00';
                    ctx.shadowBlur = 5;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    for (let x = 0; x < this.W; x += 2) {
                        const sq = Math.sin(x * 0.015 + this.oscTime) > 0 ? 1 : -1;
                        const y = this.H/2 + sq * 40 + this.H * 0.25;
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
                
                ctx.shadowBlur = 0;
                
                // Readings
                ctx.fillStyle = coinReact > 0.2 ? '#66ff66' : '#00ff00';
                ctx.font = '12px monospace';
                ctx.fillText('CH1: ' + (2.5 + coinReact * 1.5).toFixed(1) + 'V/div', 10, 20);
                ctx.fillStyle = '#00ffff';
                ctx.fillText('CH2: 1.0V/div', 10, 35);
                ctx.fillStyle = bombReact > 0.15 ? '#ff6666' : '#ffff00';
                ctx.fillText(bombReact > 0.15 ? 'CH3: WARNING' : 'CH3: 0.5V/div', 10, 50);
                ctx.fillStyle = '#888888';
                ctx.fillText('TIME: 10ms/div', this.W - 110, 20);
                const freq = Math.floor(50 + Math.sin(this.oscTime) * 10 + coinReact * 20);
                ctx.fillText('FREQ: ' + freq + ' Hz', this.W - 110, 35);
                
                // Warning indicator when bomb
                if (bombReact > 0.2) {
                    ctx.fillStyle = Math.floor(Date.now() / 100) % 2 === 0 ? '#ff0000' : '#330000';
                    ctx.font = 'bold 14px monospace';
                    ctx.fillText('⚠ SIGNAL OVERLOAD', this.W - 150, this.H - 20);
                }
                break;
            
            default:
                ctx.fillStyle = '#0A0B0D';
                ctx.fillRect(0, 0, this.W, this.H);
        }
    },
    
    drawBlade() {
        switch(this.currentBlade) {
            case 'money': this.drawMoneyBlade(); break;
            case 'bitcoin': this.drawBitcoinBlade(); break;
            case 'ethereum': this.drawEthereumBlade(); break;
            case 'base': this.drawBaseBlade(); break;
            case 'matrix': this.drawMatrixBlade(); break;
            case 'blockchain': this.drawBlockchainBlade(); break;
            case 'quantum': this.drawQuantumBlade(); break;
            case 'pixel': this.drawPixelBlade(); break;
            case 'neural': this.drawNeuralBlade(); break;
            case 'candle': this.drawCandleBlade(); break;
            default: this.drawMoneyBlade();
        }
    },
    
    // Helper: Draw blade shape (sharp tip -> wide middle -> tapered tail)
    drawBladeShape(ctx, trail, color, unused, glowColor) {
        if (trail.length < 3) return;
        
        const len = trail.length;
        
        // Calculate widths: sharp tip, wide middle, tapered tail
        const getWidth = (i) => {
            const t = i / len;
            if (t < 0.15) return t / 0.15 * 25; // Sharp tip: 0 -> 25
            if (t < 0.5) return 25 + (t - 0.15) / 0.35 * 10; // Wide: 25 -> 35
            return 35 - (t - 0.5) / 0.5 * 30; // Taper: 35 -> 5
        };
        
        // Build blade outline
        const leftPoints = [];
        const rightPoints = [];
        
        for (let i = 0; i < len - 1; i++) {
            const p = trail[i];
            const next = trail[i + 1];
            const dx = next.x - p.x;
            const dy = next.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / dist;
            const ny = dx / dist;
            const w = getWidth(i) / 2;
            
            leftPoints.push({ x: p.x + nx * w, y: p.y + ny * w });
            rightPoints.push({ x: p.x - nx * w, y: p.y - ny * w });
        }
        
        const tip = trail[0];
        
        // Glow
        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 20;
        
        // Draw blade body
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        for (const p of leftPoints) ctx.lineTo(p.x, p.y);
        for (let i = rightPoints.length - 1; i >= 0; i--) ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        
        // Edge highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    },
    
    // MONEY BLADE - Dollar bills
    drawMoneyBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        // Glow
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = 'rgba(133, 187, 101, 0.25)';
        ctx.lineWidth = 35;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.strokeStyle = 'rgba(133, 187, 101, 0.4)';
        ctx.lineWidth = 15;
        ctx.stroke();
        
        // Draw bills
        const numBills = Math.min(12, Math.floor(trail.length / 2));
        for (let i = 0; i < numBills; i++) {
            const t = i / numBills;
            const idx = Math.floor((1 - t) * (trail.length - 1));
            const prevIdx = Math.max(idx - 1, 0);
            const p = trail[idx];
            const prev = trail[prevIdx];
            const angle = Math.atan2(p.y - prev.y, p.x - prev.x);
            const scale = 1.0 - t * 0.5;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(angle);
            ctx.scale(scale, scale);
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 4;
            ctx.drawImage(this.billCanvas, -25, -11);
            ctx.restore();
        }
    },
    
    // BITCOIN BLADE - Sharp blade with ₿ symbols
    drawBitcoinBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        this.drawBladeShape(ctx, trail, 'rgba(255, 180, 0, 0.9)', null, 'rgba(255, 200, 50, 0.8)');
        
        // Inner gradient
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = 'rgba(255, 220, 100, 0.6)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    },
    
    // ETHEREUM BLADE - Purple blade with ◊ symbols
    drawEthereumBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        this.drawBladeShape(ctx, trail, 'rgba(130, 80, 200, 0.9)', null, 'rgba(150, 100, 255, 0.8)');
        
        // Inner glow
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = 'rgba(180, 140, 255, 0.6)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
    },
    
    // BASE BLADE - Blue Base blockchain style (single color)
    drawBaseBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        // Simple blue blade shape
        this.drawBladeShape(ctx, trail, 'rgba(0, 82, 255, 0.9)', null, 'rgba(0, 120, 255, 0.8)');
        
        // Inner bright line
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.6)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.strokeStyle = 'rgba(200, 230, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
    },
    
    // MATRIX BLADE - Green blade with numbers inside
    drawMatrixBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        this.drawBladeShape(ctx, trail, 'rgba(0, 100, 0, 0.85)', null, 'rgba(0, 255, 0, 0.6)');
        
        // Numbers inside blade
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const nums = '01001110101';
        for (let i = 2; i < trail.length - 2; i += 3) {
            const p = trail[i];
            const alpha = 0.9 - (i / trail.length) * 0.6;
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.fillText(nums[i % nums.length], p.x + (Math.random()-0.5)*10, p.y + (Math.random()-0.5)*10);
        }
        
        // Bright edge
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = 'rgba(100, 255, 100, 0.4)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
    },
    
    // BLOCKCHAIN BLADE - Chain of squares (small -> big -> small)
    drawBlockchainBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 2) return;
        
        // Short connecting lines
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.4)';
        ctx.lineWidth = 2;
        
        // Draw blocks (small -> big -> small)
        for (let i = 0; i < trail.length; i += 3) {
            const p = trail[i];
            const t = i / trail.length;
            
            // Size curve: small at start, big in middle, small at end
            let size;
            if (t < 0.3) size = 6 + t / 0.3 * 12; // 6 -> 18
            else if (t < 0.7) size = 18; // Stay big
            else size = 18 - (t - 0.7) / 0.3 * 14; // 18 -> 4
            
            const alpha = 1 - t * 0.4;
            
            // Block
            ctx.fillStyle = `rgba(0, 80, 150, ${alpha})`;
            ctx.fillRect(p.x - size/2, p.y - size/2, size, size);
            ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x - size/2, p.y - size/2, size, size);
            
            // Chain to next
            if (i + 3 < trail.length) {
                const next = trail[i + 3];
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();
            }
        }
    },
    
    // QUANTUM BLADE - Color-shifting
    drawQuantumBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        const time = Date.now() * 0.003;
        const hue = (time * 50) % 360;
        
        // Single color that shifts
        this.drawBladeShape(ctx, trail, `hsla(${hue}, 80%, 50%, 0.9)`, null, `hsla(${hue}, 100%, 60%, 0.8)`);
        
        // Shimmer particles
        for (let i = 0; i < trail.length; i += 4) {
            const p = trail[i];
            const particleHue = (hue + i * 15) % 360;
            ctx.fillStyle = `hsla(${particleHue}, 100%, 70%, 0.8)`;
            ctx.beginPath();
            ctx.arc(p.x + Math.sin(time + i) * 5, p.y + Math.cos(time + i) * 5, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    // PIXEL BLADE - Made of colored squares (fully filled)
    drawPixelBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        const pixelSize = 4;
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        
        // Track which pixels we've drawn to avoid duplicates
        const drawnPixels = new Set();
        
        // Calculate blade width at each point (sharp -> wide -> taper)
        for (let i = 0; i < trail.length; i++) {
            const p = trail[i];
            const t = i / trail.length;
            
            // Width curve
            let width;
            if (t < 0.15) width = t / 0.15 * 5;
            else if (t < 0.5) width = 5 + (t - 0.15) / 0.35 * 3;
            else width = 8 - (t - 0.5) / 0.5 * 7;
            
            width = Math.max(1, Math.floor(width));
            
            // Calculate perpendicular direction
            const prev = trail[Math.max(0, i - 1)];
            const next = trail[Math.min(trail.length - 1, i + 1)];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / dist;
            const ny = dx / dist;
            
            // Draw pixels across full width
            for (let w = -width; w <= width; w++) {
                const px = Math.floor((p.x + nx * w * pixelSize) / pixelSize) * pixelSize;
                const py = Math.floor((p.y + ny * w * pixelSize) / pixelSize) * pixelSize;
                const key = `${px},${py}`;
                
                if (!drawnPixels.has(key)) {
                    drawnPixels.add(key);
                    ctx.fillStyle = colors[(Math.abs(px) + Math.abs(py)) % colors.length];
                    ctx.fillRect(px, py, pixelSize - 1, pixelSize - 1);
                }
            }
        }
    },
    
    // NEURAL BLADE - More circles, shorter lines
    drawNeuralBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 2) return;
        
        // Collect nodes (more frequent)
        const nodes = [];
        for (let i = 0; i < trail.length; i += 2) {
            nodes.push(trail[i]);
        }
        
        // Draw short connections
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < Math.min(i + 2, nodes.length); j++) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
        
        // Draw bigger nodes
        for (let i = 0; i < nodes.length; i++) {
            const p = nodes[i];
            const t = i / nodes.length;
            const alpha = 1 - t * 0.5;
            const size = 8 - t * 4;
            
            // Outer glow
            ctx.fillStyle = `rgba(100, 180, 255, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size + 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Center dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    // GREEN CANDLES BLADE - Longer with filled candles inside
    drawCandleBlade() {
        const ctx = this.ctx;
        const trail = this.trail;
        if (trail.length < 3) return;
        
        // Draw blade shape first
        this.drawBladeShape(ctx, trail, 'rgba(0, 80, 40, 0.85)', null, 'rgba(0, 255, 100, 0.6)');
        
        // Draw filled candles inside the blade
        for (let i = 2; i < trail.length - 2; i += 5) {
            const p = trail[i];
            const prev = trail[Math.max(0, i - 5)] || p;
            const t = i / trail.length;
            const alpha = 1 - t * 0.5;
            
            // Candle size based on position
            let candleWidth, candleHeight;
            if (t < 0.3) {
                candleWidth = 3 + t / 0.3 * 5;
                candleHeight = 8 + t / 0.3 * 12;
            } else if (t < 0.7) {
                candleWidth = 8;
                candleHeight = 20;
            } else {
                candleWidth = 8 - (t - 0.7) / 0.3 * 6;
                candleHeight = 20 - (t - 0.7) / 0.3 * 14;
            }
            
            const wickHeight = candleHeight * 0.3;
            
            // Determine direction for angle
            const dx = p.x - prev.x;
            const dy = p.y - prev.y;
            const angle = Math.atan2(dy, dx);
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(angle + Math.PI / 2);
            
            // Wick
            ctx.strokeStyle = `rgba(0, 200, 80, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -candleHeight/2 - wickHeight);
            ctx.lineTo(0, candleHeight/2 + wickHeight);
            ctx.stroke();
            
            // Filled candle body
            ctx.fillStyle = `rgba(0, 200, 100, ${alpha})`;
            ctx.fillRect(-candleWidth/2, -candleHeight/2, candleWidth, candleHeight);
            
            // Bright edge
            ctx.strokeStyle = `rgba(100, 255, 150, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(-candleWidth/2, -candleHeight/2, candleWidth, candleHeight);
            
            ctx.restore();
        }
    },
    
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
};



// Export for use in React wrapper
if (typeof window !== 'undefined') {
  window.Game = Game;
}
