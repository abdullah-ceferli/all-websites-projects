// --- Global Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fixed Canvas Size
canvas.width = 800;
canvas.height = 600;

// UI Elements
const menuDiv = document.getElementById('mainMenu');
const continueBtn = document.getElementById('continueGameBtn');
const deleteBtn = document.getElementById('deleteSaveBtn');
const inventoryPanel = document.getElementById('inventoryPanel');

// Game Constants
const TILE_SIZE = 30;
const WORLD_WIDTH = 200; // Requirement: At least 200x200 tiles
const WORLD_HEIGHT = 200;

// Physics
const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;
const PLAYER_SPEED = 4;
const MAX_HEALTH = 100;
const HOTBAR_SIZE = 9;
const MINING_RANGE_TILES = 5;

// Game State Flags
let isGameRunning = false;
let isInventoryOpen = false;
let hasSaveData = false;

// --- Tile Definitions ---
const TILE_TYPES = {
    0: { name: 'Air', color: 'rgba(0,0,0,0)', solid: false },
    1: { name: 'Dirt', color: '#8B4513', solid: true, drop: 1 },
    2: { name: 'Stone', color: '#708090', solid: true, drop: 2 },
    3: { name: 'Wood', color: '#A0522D', solid: true, drop: 3 },
    4: { name: 'Grass', color: '#6A9955', solid: true, drop: 1 } // Grass drops Dirt
};

// Default (Initial) Game State
const defaultGameState = {
    world: [],
    player: {
        x: (WORLD_WIDTH / 2) * TILE_SIZE,
        y: 0,
        width: 20,
        height: 40,
        dx: 0,
        dy: 0,
        onGround: false,
        health: MAX_HEALTH,
        maxHealth: MAX_HEALTH,
        damageCooldown: 0 
    },
    inventory: new Array(HOTBAR_SIZE * 3).fill({ type: 0, count: 0 }), // 3 rows of inventory
    selectedSlot: 0,
};

let gameState = defaultGameState;

// --- Input Handling ---
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    if (!isGameRunning) return;

    // Hotbar selection (1-9)
    if (e.code.startsWith('Digit')) {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < HOTBAR_SIZE) {
            gameState.selectedSlot = index;
            updateUI();
        }
    }
    
    // Inventory toggle
    if (e.code === 'KeyE' || e.code === 'KeyI') {
        isInventoryOpen = !isInventoryOpen;
        inventoryPanel.style.display = isInventoryOpen ? 'block' : 'none';
        updateUI();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// --- Utility Functions ---

function toTileCoord(px) { return Math.floor(px / TILE_SIZE); }
function getTile(tx, ty) {
    if (ty < 0 || ty >= WORLD_HEIGHT || tx < 0 || tx >= WORLD_WIDTH) {
        return TILE_TYPES[0];
    }
    return TILE_TYPES[gameState.world[ty][tx]];
}

function setTile(tx, ty, typeId) {
    if (ty >= 0 && ty < WORLD_HEIGHT && tx < WORLD_WIDTH) {
        gameState.world[ty][tx] = typeId;
    }
}

// --- Persistence (Save/Load) ---
const SAVE_KEY = 'terrariaCloneSaveData';

/** Checks local storage for save data and updates the menu buttons. */
function checkSaveData() {
    hasSaveData = !!localStorage.getItem(SAVE_KEY);
    continueBtn.disabled = !hasSaveData;
    deleteBtn.disabled = !hasSaveData;
    document.querySelector('.menu-info').textContent = hasSaveData 
        ? 'Save data found. Press Continue or Start New Game.'
        : 'No save data found. Press Start New Game.';
}

/** Saves the current game state to localStorage. */
function saveGame() {
    if (!isGameRunning) return;
    try {
        const data = JSON.stringify({
            world: gameState.world,
            player: gameState.player,
            inventory: gameState.inventory,
            selectedSlot: gameState.selectedSlot
        });
        localStorage.setItem(SAVE_KEY, data);
        checkSaveData(); 
        // console.log("Game Saved.");
    } catch (e) {
        console.error("Could not save game:", e);
    }
}

/** Loads game state from localStorage. */
function loadGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            // Use spread operators for robust loading
            gameState = {
                ...defaultGameState,
                ...data,
                player: { ...defaultGameState.player, ...data.player },
            };
            // Ensure inventory size is maintained
            if (gameState.inventory.length < defaultGameState.inventory.length) {
                 gameState.inventory = [...data.inventory, ...new Array(defaultGameState.inventory.length - data.inventory.length).fill({ type: 0, count: 0 })];
            }
            return true;
        } catch (e) {
            console.error("Error loading save data:", e);
            return false;
        }
    }
    return false;
}

/** Clears the save data. */
function deleteSave() {
    if (confirm("Are you sure you want to delete all saved progress?")) {
        localStorage.removeItem(SAVE_KEY);
        checkSaveData();
        alert("Save data deleted.");
        if(isGameRunning) document.location.reload(); // Restart to menu
    }
}

// --- World Generation ---

/** Generates a simple world with random surface height. */
function createNewWorld() {
    const newWorld = [];
    const maxSurfaceOffset = 10; 
    let currentSurfaceY = Math.floor(WORLD_HEIGHT * 0.4);

    for (let y = 0; y < WORLD_HEIGHT; y++) {
        newWorld[y] = [];
        for (let x = 0; x < WORLD_WIDTH; x++) {
            
            // Adjust surface height based on previous tile
            if (y === currentSurfaceY) {
                newWorld[y][x] = 4; // Grass
            } else if (y > currentSurfaceY && y < currentSurfaceY + 4) {
                newWorld[y][x] = 1; // Dirt Layer
            } else if (y >= currentSurfaceY + 4) {
                newWorld[y][x] = 2; // Stone Layer
            } else {
                newWorld[y][x] = 0; // Air
            }
            
            // Randomly adjust surface for the next column
            if (y === currentSurfaceY && Math.random() < 0.1) {
                currentSurfaceY += Math.floor(Math.random() * 3) - 1; 
                currentSurfaceY = Math.max(1, Math.min(currentSurfaceY, WORLD_HEIGHT - maxSurfaceOffset));
            }
        }
    }
    gameState.world = newWorld;
}

/** Finds the first solid ground below the player's X position. */
function placePlayerOnGround(player) {
    const tx = toTileCoord(player.x);
    for (let ty = 0; ty < WORLD_HEIGHT; ty++) {
        if (getTile(tx, ty).solid) {
            // Snap player position just above the block
            player.y = ty * TILE_SIZE - player.height; 
            player.onGround = true;
            return;
        }
    }
}

// --- Inventory and UI Logic ---

/** Adds an item to the inventory. */
function addItemToInventory(typeId, count) {
    if (typeId === 0 || count <= 0) return;

    // 1. Try to stack
    for (const slot of gameState.inventory) {
        if (slot.type === typeId) {
            slot.count += count;
            updateUI();
            return;
        }
    }

    // 2. Try to find an empty slot
    for (let i = 0; i < gameState.inventory.length; i++) {
        if (gameState.inventory[i].type === 0) {
            gameState.inventory[i] = { type: typeId, count: count };
            updateUI();
            return;
        }
    }
}

/** Initializes the UI structure. */
function initializeUI() {
    const hotbarDiv = document.getElementById('hotbar');
    const inventorySlotsDiv = document.getElementById('inventorySlots');

    // Create Hotbar slots
    hotbarDiv.innerHTML = '';
    for (let i = 0; i < HOTBAR_SIZE; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot hotbar-slot';
        slotDiv.dataset.index = i;
        slotDiv.id = `hotbar-slot-${i}`;
        slotDiv.addEventListener('click', () => { gameState.selectedSlot = i; updateUI(); });
        hotbarDiv.appendChild(slotDiv);
    }
    
    // Create Inventory slots
    inventorySlotsDiv.innerHTML = '';
    for (let i = 0; i < gameState.inventory.length; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot inventory-slot';
        slotDiv.dataset.index = i;
        slotDiv.id = `inv-slot-${i}`;
        
        // Simplified item interaction for inventory:
        slotDiv.addEventListener('click', (e) => { 
            e.preventDefault(); 
            handleInventoryInteraction(i); // LMB swaps stack
        });
        slotDiv.addEventListener('contextmenu', (e) => { 
            e.preventDefault(); 
            handleInventoryInteraction(i, true); // RMB swaps type
        });

        inventorySlotsDiv.appendChild(slotDiv);
    }

    updateUI();
}

/** Handles clicking slots in the inventory panel. */
function handleInventoryInteraction(slotIndex, isRMB = false) {
    const selectedHotbarSlot = gameState.selectedSlot;
    const invSlot = gameState.inventory[slotIndex];
    const hotbarSlot = gameState.inventory[selectedHotbarSlot];

    if (isRMB) {
        // RMB: Swap item TYPES (useful for quickly equipping a block)
        const tempType = invSlot.type;
        invSlot.type = hotbarSlot.type;
        hotbarSlot.type = tempType;
    } else {
        // LMB: Swap full stacks
        const temp = { ...invSlot }; // Deep copy slot object
        gameState.inventory[slotIndex] = { ...hotbarSlot };
        gameState.inventory[selectedHotbarSlot] = temp;
    }

    updateUI();
}

/** Renders the current state of the UI (Health, Hotbar, Inventory). */
function updateUI() {
    // Health Bar
    const healthBar = document.getElementById('healthBar');
    const healthValue = document.getElementById('healthValue');
    const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
    healthBar.style.width = `${Math.max(0, healthPercent)}%`;
    healthValue.textContent = `${Math.floor(gameState.player.health)} / ${gameState.player.maxHealth}`;

    // Hotbar (First HOTBAR_SIZE slots of inventory)
    for (let i = 0; i < HOTBAR_SIZE; i++) {
        const slotDiv = document.getElementById(`hotbar-slot-${i}`);
        const slot = gameState.inventory[i]; 
        slotDiv.classList.toggle('selected', i === gameState.selectedSlot);
        renderSlot(slotDiv, slot);
    }

    // Inventory Panel
    if (isInventoryOpen) {
        for (let i = 0; i < gameState.inventory.length; i++) {
            const slotDiv = document.getElementById(`inv-slot-${i}`);
            const slot = gameState.inventory[i];
            renderSlot(slotDiv, slot);
        }
    }
}

/** Helper function to render the contents of a single slot div. */
function renderSlot(slotDiv, slot) {
    slotDiv.innerHTML = '';
    if (slot && slot.type !== 0 && slot.count > 0) {
        const tileInfo = TILE_TYPES[slot.type];
        slotDiv.style.backgroundColor = tileInfo.color;
        slotDiv.innerHTML = `<div class="item-count">${slot.count}</div>`;
    } else {
        slotDiv.style.backgroundColor = '#3e4451';
    }
}

// --- Player Physics ---

function updatePlayerPhysics() {
    const p = gameState.player;
    if (isInventoryOpen) return; 

    // Horizontal Movement
    p.dx = 0;
    if (keys['KeyA'] || keys['ArrowLeft']) { p.dx = -PLAYER_SPEED; }
    if (keys['KeyD'] || keys['ArrowRight']) { p.dx = PLAYER_SPEED; }

    // Jump
    if ((keys['Space'] || keys['KeyW'] || keys['ArrowUp']) && p.onGround) {
        p.dy = JUMP_STRENGTH;
        p.onGround = false;
    }
    
    // Apply Gravity
    p.dy += GRAVITY;
    if (p.dy > 10) p.dy = 10; 

    p.onGround = false; 
    
    // Collision checking helper
    function checkCollision(nextPos, axis) {
        const checkX = axis === 'x';
        const rect = { 
            x: checkX ? nextPos : p.x, 
            y: checkX ? p.y : nextPos, 
            width: p.width, 
            height: p.height 
        };

        const startTx = toTileCoord(rect.x);
        const endTx = toTileCoord(rect.x + rect.width - 0.001);
        const startTy = toTileCoord(rect.y);
        const endTy = toTileCoord(rect.y + rect.height - 0.001);
        
        for (let ty = startTy; ty <= endTy; ty++) {
            for (let tx = startTx; tx <= endTx; tx++) {
                if (getTile(tx, ty).solid) {
                    return { collision: true, tx, ty };
                }
            }
        }
        return { collision: false };
    }

    // Resolve X-axis
    const collisionX = checkCollision(p.x + p.dx, 'x');
    if (!collisionX.collision) {
        p.x += p.dx;
    }

    // Resolve Y-axis
    const prevY = p.y;
    const collisionY = checkCollision(p.y + p.dy, 'y');
    if (collisionY.collision) {
        const tileY = collisionY.ty * TILE_SIZE;
        
        if (p.dy > 0) { // Falling (Landed)
            p.y = tileY - p.height;
            p.dy = 0;
            p.onGround = true;
            
            // Fall Damage (simplified)
            const fallDistance = prevY - p.y;
            if (fallDistance > 100) { 
                const damage = Math.floor((fallDistance - 100) / 10);
                p.health = Math.max(0, p.health - damage);
                updateUI();
            }
            
        } else if (p.dy < 0) { // Moving up (Hit head)
            p.y = tileY + TILE_SIZE;
            p.dy = 0;
        }
    } else {
        p.y += p.dy;
    }
    
    // Clamp player to world bounds
    p.x = Math.max(0, Math.min(p.x, WORLD_WIDTH * TILE_SIZE - p.width));
    p.y = Math.min(p.y, WORLD_HEIGHT * TILE_SIZE - p.height); 
    
    if (p.health <= 0) {
        alert("You died! Starting a new game.");
        startGame(true);
    }
}

// --- Mining and Building System ---

/** Gets the tile coordinates under the mouse cursor, adjusted for the camera. */
function getTargetTile(e) {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    const { camX, camY } = getCameraOffset();
    
    const worldX = mouseX + camX;
    const worldY = mouseY + camY;

    const tx = toTileCoord(worldX);
    const ty = toTileCoord(worldY);

    return { tx, ty, worldX, worldY };
}

/** Handles removing a tile (Mining) on Left Click. */
function handleMining(e) {
    if (!isGameRunning || isInventoryOpen) return;
    const { tx, ty } = getTargetTile(e);
    const tileType = gameState.world[ty]?.[tx];
    const tileInfo = TILE_TYPES[tileType];
    
    // Check mining range limit
    const distanceX = Math.abs(tx * TILE_SIZE + TILE_SIZE / 2 - (gameState.player.x + gameState.player.width / 2));
    const distanceY = Math.abs(ty * TILE_SIZE + TILE_SIZE / 2 - (gameState.player.y + gameState.player.height / 2));
    
    if (tileInfo && tileInfo.solid && distanceX < MINING_RANGE_TILES * TILE_SIZE && distanceY < MINING_RANGE_TILES * TILE_SIZE) {
        setTile(tx, ty, 0); // Remove the block
        
        // Add block drop to inventory
        if (tileInfo.drop) {
            addItemToInventory(tileInfo.drop, 1);
        }
    }
}

/** Handles placing a tile (Building) on Right Click. */
function handleBuilding(e) {
    if (!isGameRunning || isInventoryOpen) return;
    const { tx, ty } = getTargetTile(e);
    
    const selectedItemSlot = gameState.inventory[gameState.selectedSlot];
    
    // Check range
    const distanceX = Math.abs(tx * TILE_SIZE + TILE_SIZE / 2 - (gameState.player.x + gameState.player.width / 2));
    const distanceY = Math.abs(ty * TILE_SIZE + TILE_SIZE / 2 - (gameState.player.y + gameState.player.height / 2));
    
    if (selectedItemSlot && selectedItemSlot.type !== 0 && selectedItemSlot.count > 0 && gameState.world[ty]?.[tx] === 0) {
        
        // Check range and Player overlap
        if (distanceX < MINING_RANGE_TILES * TILE_SIZE && distanceY < MINING_RANGE_TILES * TILE_SIZE && !isPlayerOverlapping(tx, ty)) {
            setTile(tx, ty, selectedItemSlot.type); // Place the block
            selectedItemSlot.count--; // Consume one item
            
            if (selectedItemSlot.count === 0) {
                selectedItemSlot.type = 0;
            }
            updateUI();
        }
    }
}

/** Checks if the player's collision box overlaps with a potential block placement location. */
function isPlayerOverlapping(tx, ty) {
    const p = gameState.player;
    const tileX = tx * TILE_SIZE;
    const tileY = ty * TILE_SIZE;

    return p.x < tileX + TILE_SIZE &&
           p.x + p.width > tileX &&
           p.y < tileY + TILE_SIZE &&
           p.y + p.height > tileY;
}

// Attach mouse listeners for Mining/Building
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left Click (Mine)
        handleMining(e); 
    } else if (e.button === 2) { // Right Click (Build)
        handleBuilding(e); 
    }
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());


// --- Rendering ---

/** Calculates the camera offset to keep the player centered (Camera Follow). */
function getCameraOffset() {
    const p = gameState.player;
    const targetX = p.x + p.width / 2;
    const targetY = p.y + p.height / 2;

    const camX = targetX - canvas.width / 2;
    const camY = targetY - canvas.height / 2;
    
    // Clamp the camera to world boundaries
    const clampedCamX = Math.max(0, Math.min(camX, WORLD_WIDTH * TILE_SIZE - canvas.width));
    const clampedCamY = Math.max(0, Math.min(camY, WORLD_HEIGHT * TILE_SIZE - canvas.height));
    
    return { camX: clampedCamX, camY: clampedCamY };
}

/** Draws the entire world (tiles). */
function drawWorld() {
    const { camX, camY } = getCameraOffset();
    
    // Calculate the visible range of tiles
    const startTx = Math.floor(camX / TILE_SIZE);
    const endTx = Math.ceil((camX + canvas.width) / TILE_SIZE);
    const startTy = Math.floor(camY / TILE_SIZE);
    const endTy = Math.ceil((camY + canvas.height) / TILE_SIZE);

    // Draw Sky Background Color
    ctx.fillStyle = '#87ceeb'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    for (let ty = startTy; ty < endTy; ty++) {
        for (let tx = startTx; tx < endTx; tx++) {
            const tile = getTile(tx, ty);
            
            if (tile.solid) {
                ctx.fillStyle = tile.color;
                
                // Draw tile position adjusted for camera offset
                ctx.fillRect(
                    tx * TILE_SIZE - camX, 
                    ty * TILE_SIZE - camY, 
                    TILE_SIZE, 
                    TILE_SIZE
                );
            }
        }
    }
}

/** Draws the player as a simple Terraria-style rectangle character. */
function drawPlayer() {
    const p = gameState.player;
    
    // Player is drawn centered in the canvas
    const screenX = canvas.width / 2 - p.width / 2;
    const screenY = canvas.height / 2 - p.height / 2;

    // 1. Head
    ctx.fillStyle = '#ffcc99'; 
    ctx.fillRect(screenX, screenY, p.width, p.height / 3);

    // 2. Body
    ctx.fillStyle = '#61afef'; 
    ctx.fillRect(screenX, screenY + p.height / 3, p.width, p.height * 0.4);

    // 3. Legs
    ctx.fillStyle = '#565656'; 
    ctx.fillRect(screenX, screenY + p.height * 0.73, p.width / 2, p.height * 0.27);
    ctx.fillRect(screenX + p.width / 2, screenY + p.height * 0.73, p.width / 2, p.height * 0.27);
}


// --- Game Loop and Control ---

/** The main game loop function. */
function gameLoop() {
    if (isGameRunning) {
        // 1. Update Logic
        updatePlayerPhysics();
        
        // 2. Render Graphics
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        drawWorld();
        drawPlayer();
    }

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

/** Starts the game, either new or loaded. */
function startGame(isNewGame) {
    menuDiv.style.display = 'none'; // Hide menu
    document.getElementById('gameUI').style.display = 'flex'; // Show in-game UI

    if (isNewGame) {
        gameState = JSON.parse(JSON.stringify(defaultGameState)); // Reset state
        createNewWorld();
        // Give starter items
        addItemToInventory(1, 50); 
        addItemToInventory(3, 10);
    } else {
        if (!loadGame()) {
            alert("No valid save found. Starting new game.");
            startGame(true);
            return;
        }
    }
    
    placePlayerOnGround(gameState.player);

    initializeUI();
    isGameRunning = true;
    
    // Set up autosave
    setInterval(saveGame, 10000); 
}

// --- Menu Initialization and Events ---

document.getElementById('startGameBtn').addEventListener('click', () => startGame(true));
continueBtn.addEventListener('click', () => startGame(false));
deleteBtn.addEventListener('click', deleteSave);

// --- Game Initialization ---

// 1. Run checks on load to determine initial menu state
checkSaveData(); 

// 2. Hide the in-game UI initially
document.getElementById('gameUI').style.display = 'none';

// 3. Start the animation loop (will draw the menu overlay until startGame is called)
requestAnimationFrame(gameLoop);