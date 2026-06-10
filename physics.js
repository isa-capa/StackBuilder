import { LEGO_CATALOG, CRITICAL_SUBJECTS, BLOCK_WEIGHTS } from './legoData.js';
import { LegoBlock } from './legoBlock.js';

// Desestructuración de Matter.js
const { Engine, World, Bodies, Body, Composite, Mouse, MouseConstraint, Query, Events } = Matter;

let engine;
let world;
let legoBlocks = [];
let ground;
let wallLeft;
let wallRight;
let mouseConstraint;
let canvas;
let ctx;
let animationFrameId;
let highlightParent = null;
let initialTotalWeight = 0;

// Callbacks para comunicar eventos de física e interacción a app.js
let onHoverBlockCallback = null;
let onStatsUpdateCallback = null;
let onDragStartCallback = null;
let onDragMoveCallback = null;
let onDragEndCallback = null;

// Configuración de pantalla
const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 650;

// Definición de la zona del Bote de Basura en coordenadas del canvas (esquina superior derecha)
const TRASH_ZONE = {
  x: CANVAS_WIDTH - 80, // x = 770
  y: 65,
  width: 120,
  height: 85
};

/**
 * Inicializa el ecosistema físico y de renderizado.
 */
export function initPhysics(
  canvasElement,
  onHoverBlock,
  onStatsUpdate,
  onDragStart,
  onDragMove,
  onDragEnd
) {
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  
  onHoverBlockCallback = onHoverBlock;
  onStatsUpdateCallback = onStatsUpdate;
  onDragStartCallback = onDragStart;
  onDragMoveCallback = onDragMove;
  onDragEndCallback = onDragEnd;

  // 1. Inicializar motor Matter.js con gravedad lenta (0.4 G)
  engine = Engine.create({
    gravity: { x: 0, y: 0.4 }
  });
  world = engine.world;

  // 2. Crear límites del escenario (Suelo y paredes laterales)
  ground = Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 40, {
    isStatic: true,
    render: { visible: false }
  });

  wallLeft = Bodies.rectangle(-10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, {
    isStatic: true,
    render: { visible: false }
  });
  wallRight = Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, {
    isStatic: true,
    render: { visible: false }
  });

  Composite.add(world, [ground, wallLeft, wallRight]);

  // 3. Crear torre de bloques inicial
  buildTower();

  // 4. Configurar interacción de ratón (Drag and Drop)
  const mouse = Mouse.create(canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.15,
      angularStiffness: 0.1,
      render: { visible: false }
    }
  });

  Composite.add(world, mouseConstraint);

  // Evitar interferencia con el scroll
  mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
  mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

  // 5. Iniciar bucles de física y renderizado personalizado
  runLoop();

  // 6. Escuchar eventos de ratón para interactividad
  setupMouseEvents();
}

/**
 * Reconstruye la torre utilizando la nueva jerarquía granular de legoData.js (46 bloques en total).
 */
function buildTower() {
  // Limpiar bloques existentes en el mundo físico y local
  legoBlocks.forEach(block => Composite.remove(world, block.body));
  legoBlocks = [];

  const centerX = CANVAS_WIDTH / 2;

  // --- CAPA 1: BASES (9 bloques de ancho 80px) ---
  // Ancho total = 9 * 80 = 720px. Centrado en 425 -> rango [65, 785].
  // Centros de bloques: xStart = 425 - 320 = 105. Spacing = 80.
  const row1Y = 585;
  const bases = [
    LEGO_CATALOG.JAVA_OOP, LEGO_CATALOG.JAVA_COLLECTIONS, LEGO_CATALOG.JAVA_MEMORY,
    LEGO_CATALOG.DB_MODELING, LEGO_CATALOG.DB_SQL, LEGO_CATALOG.DB_ACID,
    LEGO_CATALOG.FUND_HTTP, LEGO_CATALOG.FUND_OS, LEGO_CATALOG.FUND_ALGO
  ];

  bases.forEach((info, i) => {
    const x = 105 + i * 80;
    createBlockBody(info, x, row1Y);
  });

  // --- CAPA 2: CONECTORES Y CALIDAD + SOFT SKILLS (25 bloques de ancho 30px) ---
  // Ancho total = 25 * 30 = 750px. Centrado en 425 -> rango [50, 800].
  // Centros de bloques: xStart = 425 - 360 = 65. Spacing = 30.
  const row2Y = 520;
  const connectors = [
    LEGO_CATALOG.SCRUM_ROLES, LEGO_CATALOG.SCRUM_EVENTS, LEGO_CATALOG.SCRUM_ART,
    LEGO_CATALOG.TEST_UNIT, LEGO_CATALOG.TEST_MOCK, LEGO_CATALOG.TEST_TDD,
    LEGO_CATALOG.GIT_BASICS, LEGO_CATALOG.GIT_BRANCH, LEGO_CATALOG.GIT_PR,
    LEGO_CATALOG.OPS_DOCKER, LEGO_CATALOG.OPS_CICD, LEGO_CATALOG.OPS_DEPLOY,
    LEGO_CATALOG.SEC_AUTHN, LEGO_CATALOG.SEC_AUTHZ, LEGO_CATALOG.SEC_JWT,
    LEGO_CATALOG.SOFT_TEAMWORK, LEGO_CATALOG.SOFT_COMMUNICATION, LEGO_CATALOG.SOFT_PROACTIVITY,
    LEGO_CATALOG.SOFT_PROBLEM_SOLVING, LEGO_CATALOG.SOFT_ADAPTABILITY, LEGO_CATALOG.SOFT_TIME_MGMT,
    LEGO_CATALOG.SOFT_CRITICAL, LEGO_CATALOG.SOFT_EMPATHY, LEGO_CATALOG.SOFT_LEARNING,
    LEGO_CATALOG.SOFT_FEEDBACK
  ];

  connectors.forEach((info, i) => {
    const x = 65 + i * 30;
    createBlockBody(info, x, row2Y);
  });

  // --- CAPA 3: ESTRUCTURALES (12 bloques de ancho 60px) ---
  // Ancho total = 12 * 60 = 720px. Centrado en 425 -> rango [65, 785].
  // Centros de bloques: xStart = 425 - 330 = 95. Spacing = 60.
  const row3Y = 455;
  const structurals = [
    LEGO_CATALOG.FRONT_HTML, LEGO_CATALOG.FRONT_CSS, LEGO_CATALOG.FRONT_JS,
    LEGO_CATALOG.SPRING_CORE, LEGO_CATALOG.SPRING_WEB, LEGO_CATALOG.SPRING_DATA,
    LEGO_CATALOG.ARCH_DESIGN, LEGO_CATALOG.ARCH_DDD, LEGO_CATALOG.ARCH_API,
    LEGO_CATALOG.REACT_COMPONENTS, LEGO_CATALOG.REACT_HOOKS, LEGO_CATALOG.REACT_STATE
  ];

  structurals.forEach((info, i) => {
    const x = 95 + i * 60;
    createBlockBody(info, x, row3Y);
  });

  // Calcular el peso total inicial del ecosistema para la fórmula de estabilidad
  initialTotalWeight = legoBlocks.reduce((sum, block) => {
    return sum + (BLOCK_WEIGHTS[block.info.id] || 1);
  }, 0);
}

/**
 * Crea físicamente un cuerpo rectangular de Matter y lo vincula al gestor de bloques.
 */
function createBlockBody(info, x, y) {
  if (!info) return;
  
  const body = Bodies.rectangle(x, y, info.width, info.height, {
    friction: 0.5,
    frictionStatic: 0.8,
    restitution: 0.02,
    density: 0.01,
    inertia: Infinity // Bloquear rotaciones por legibilidad
  });

  const block = new LegoBlock(body, info);
  legoBlocks.push(block);
  Composite.add(world, body);
}

/**
 * Añade un bloque dinámico desde la parte superior.
 */
export function spawnBlock(blockId) {
  const info = Object.values(LEGO_CATALOG).find(item => item.id === blockId);
  if (!info) return;

  const randomX = CANVAS_WIDTH / 2 + (Math.random() - 0.5) * 200;
  const y = 80;

  const body = Bodies.rectangle(randomX, y, info.width, info.height, {
    friction: 0.5,
    frictionStatic: 0.8,
    restitution: 0.02,
    density: 0.01,
    inertia: Infinity
  });

  const block = new LegoBlock(body, info);
  legoBlocks.push(block);
  Composite.add(world, body);
}

/**
 * Elimina un bloque del motor de física y de la lista de renderizado.
 */
export function removeBlock(block) {
  Composite.remove(world, block.body);
  legoBlocks = legoBlocks.filter(b => b !== block);
}

/**
 * Resetea la física.
 */
export function resetPhysics() {
  buildTower();
}

/**
 * Modifica la gravedad.
 */
export function setGravity(value) {
  if (engine) {
    engine.gravity.y = value;
  }
}

/**
 * Activa/desactiva el resaltado de bloques por grupo temático (parent).
 * Devuelve el parent activo o null si se desactivó.
 */
export function setHighlightParent(parent) {
  highlightParent = (highlightParent === parent) ? null : parent;
  return highlightParent;
}

/**
 * Bucle de física y renderizado.
 */
function runLoop() {
  Engine.update(engine, 1000 / 60);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawGridAndBackdrop();
  drawGround();
  
  // Dibujar el bote de basura detrás de las piezas
  drawTrashZone();
  
  // Actualizar estado de resaltado en cada bloque
  legoBlocks.forEach(block => {
    block.isHighlighted = highlightParent ? block.info.parent === highlightParent : false;
  });

  legoBlocks.forEach(block => block.draw(ctx));
  drawDragLine();
  calculateStats();

  animationFrameId = requestAnimationFrame(runLoop);
}

function drawGridAndBackdrop() {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 40;

  for (let x = 0; x < CANVAS_WIDTH; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }

  const radialGrad = ctx.createRadialGradient(
    CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100, 50,
    CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50, 400
  );
  radialGrad.addColorStop(0, 'rgba(131, 56, 236, 0.08)');
  radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGround() {
  ctx.fillStyle = '#212529';
  ctx.fillRect(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 40);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_HEIGHT - 40);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 40);
  ctx.stroke();

  ctx.fillStyle = '#16191c';
  const buttonSpacing = 20;
  for (let x = 10; x < CANVAS_WIDTH; x += buttonSpacing) {
    ctx.beginPath();
    ctx.arc(x, CANVAS_HEIGHT - 35, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Dibuja la zona de la papelera en el lienzo (Esquina Superior Derecha).
 */
function drawTrashZone() {
  ctx.save();
  
  const { x, y, width, height } = TRASH_ZONE;
  
  // Detectar si un bloque es arrastrado sobre la papelera
  let isHovered = false;
  if (mouseConstraint.body) {
    const mousePos = mouseConstraint.mouse.position;
    isHovered = (
      mousePos.x >= x - width / 2 &&
      mousePos.x <= x + width / 2 &&
      mousePos.y >= y - height / 2 &&
      mousePos.y <= y + height / 2
    );
  }
  
  // Fondo semi-transparente
  ctx.fillStyle = isHovered ? 'rgba(224, 17, 95, 0.15)' : 'rgba(224, 17, 95, 0.04)';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - width / 2, y - height / 2, width, height, 12);
  } else {
    ctx.rect(x - width / 2, y - height / 2, width, height);
  }
  ctx.fill();
  
  // Borde discontinuo de neón
  ctx.strokeStyle = isHovered ? '#ff3366' : 'rgba(224, 17, 95, 0.4)';
  ctx.lineWidth = isHovered ? 2.5 : 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - width / 2, y - height / 2, width, height, 12);
  } else {
    ctx.rect(x - width / 2, y - height / 2, width, height);
  }
  ctx.stroke();
  
  // Icono
  ctx.fillStyle = isHovered ? '#ff3366' : 'rgba(224, 17, 95, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '26px sans-serif';
  ctx.fillText('🗑️', x, y - 14);
  
  // Textos
  ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.6)';
  ctx.font = 'bold 10px "Outfit", "Inter", sans-serif';
  ctx.fillText('ELIMINAR', x, y + 14);
  
  ctx.font = '9px "Inter", sans-serif';
  ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.35)';
  ctx.fillText('Arrastra aquí', x, y + 26);
  
  ctx.restore();
}

function drawDragLine() {
  if (mouseConstraint.body) {
    const bodyPos = mouseConstraint.body.position;
    const mousePos = mouseConstraint.mouse.position;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(bodyPos.x, bodyPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Configura los eventos del ratón para arrastre y detección.
 */
function setupMouseEvents() {
  Events.on(mouseConstraint, 'startdrag', (event) => {
    const body = event.body;
    if (!body) return;
    const block = legoBlocks.find(b => b.body === body);
    if (block && onDragStartCallback) {
      onDragStartCallback(block);
    }
  });

  Events.on(mouseConstraint, 'mousemove', () => {
    const mousePos = mouseConstraint.mouse.position;
    const bodies = legoBlocks.map(b => b.body);
    
    // Si estamos arrastrando, notificar posición
    if (mouseConstraint.body && onDragMoveCallback) {
      onDragMoveCallback(mousePos);
    }

    const hoveredBodies = Query.point(bodies, mousePos);

    legoBlocks.forEach(b => {
      b.isHovered = false;
      b.isDragged = false;
    });

    if (mouseConstraint.body) {
      const draggedBlock = legoBlocks.find(b => b.body === mouseConstraint.body);
      if (draggedBlock) {
        draggedBlock.isDragged = true;
      }
    }

    if (hoveredBodies.length > 0 && !mouseConstraint.body) {
      const topBody = hoveredBodies[hoveredBodies.length - 1];
      const block = legoBlocks.find(b => b.body === topBody);
      if (block) {
        block.isHovered = true;
        if (onHoverBlockCallback) {
          onHoverBlockCallback(block.info, mousePos);
        }
      }
    } else if (!mouseConstraint.body) {
      if (onHoverBlockCallback) {
        onHoverBlockCallback(null, null);
      }
    }
  });

  Events.on(mouseConstraint, 'enddrag', (event) => {
    const body = event.body;
    if (!body) return;
    const block = legoBlocks.find(b => b.body === body);
    
    legoBlocks.forEach(b => b.isDragged = false);

    if (block) {
      // Comprobar si fue soltado en la papelera
      const pos = mouseConstraint.mouse.position;
      const { x, y, width, height } = TRASH_ZONE;
      const droppedInTrash = (
        pos.x >= x - width / 2 &&
        pos.x <= x + width / 2 &&
        pos.y >= y - height / 2 &&
        pos.y <= y + height / 2
      );

      if (droppedInTrash) {
        removeBlock(block);
        if (onDragEndCallback) {
          onDragEndCallback(block, pos, true);
        }
      } else if (onDragEndCallback) {
        onDragEndCallback(block, pos, false);
      }
    }
  });
}

/**
 * Calcula estadísticas dinámicas y estabilidad.
 * Fórmula de Estabilidad Ponderada:
 *   Estabilidad (%) = (Peso de bloques presentes / Peso total inicial) × 100
 *
 * Cada bloque tiene un peso definido en BLOCK_WEIGHTS según su importancia:
 *   Bases (4-7 pts)  >  Estructurales (3-5 pts)  >  Calidad (1-3 pts)  >  Soft (1 pt)
 *
 * Peso total del ecosistema: 124 puntos = 100% estabilidad.
 * Ejemplo: eliminar Java OOP (7 pts) reduce ~5.6%, eliminar un Soft Skill (1 pt) reduce ~0.8%.
 */
function calculateStats() {
  // Caso base: todos los bloques eliminados
  if (legoBlocks.length === 0) {
    if (onStatsUpdateCallback) {
      onStatsUpdateCallback({
        stability: 0,
        totalBlocks: 0,
        fallenBlocks: 0,
        activeBlocks: 0,
        criticalRemoved: CRITICAL_SUBJECTS.length
      });
    }
    return;
  }

  // 1. Peso ponderado actual (suma de pesos de los bloques que siguen presentes)
  const currentWeight = legoBlocks.reduce((sum, block) => {
    return sum + (BLOCK_WEIGHTS[block.info.id] || 1);
  }, 0);

  // 2. Estabilidad = porcentaje del peso retenido respecto al peso total inicial
  let stabilityPercentage = initialTotalWeight > 0
    ? Math.round((currentWeight / initialTotalWeight) * 100)
    : 0;
  stabilityPercentage = Math.max(0, Math.min(100, stabilityPercentage));

  // 3. Rastrear materias críticas eliminadas (para alerta de colapso)
  const activeCriticalBlocks = legoBlocks.filter(block => CRITICAL_SUBJECTS.includes(block.info.id));
  const criticalRemovedCount = CRITICAL_SUBJECTS.length - activeCriticalBlocks.length;

  // 4. Contar bloques caídos (no-base que tocaron el suelo sin soporte)
  const nonBaseBlocks = legoBlocks.filter(b => b.info.category !== 'base');
  const fallenCount = nonBaseBlocks.filter(b => b.body.position.y > 570).length;

  if (onStatsUpdateCallback) {
    onStatsUpdateCallback({
      stability: stabilityPercentage,
      totalBlocks: legoBlocks.length,
      fallenBlocks: fallenCount,
      activeBlocks: legoBlocks.length - fallenCount,
      criticalRemoved: criticalRemovedCount
    });
  }
}
