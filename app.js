import { initPhysics, resetPhysics, spawnBlock, setGravity, setHighlightParent } from './physics.js';
import { LEGO_CATALOG } from './legoData.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('simulator-canvas');
  const tooltip = document.getElementById('lego-tooltip');
  const toastContainer = document.getElementById('toast-container');

  // HUD de Estadísticas
  const stabilityRing = document.getElementById('stability-ring');
  const stabilityNumber = document.getElementById('stability-number');
  const stabilityLabel = document.getElementById('stability-label');
  const statActive = document.getElementById('stat-active');
  const statFallen = document.getElementById('stat-fallen');

  // Controles
  const gravitySlider = document.getElementById('gravity-slider');
  const gravityVal = document.getElementById('gravity-val');
  const blockSpawnSelect = document.getElementById('block-spawn-select');
  const spawnBtn = document.getElementById('spawn-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Rastrear estado crítico anterior para evitar sonar repetidamente
  let lastCriticalStatus = false;

  /**
   * Genera dinámicamente las opciones del selector de bloques según el catálogo de legoData.js.
   */
  function populateSpawnSelector() {
    blockSpawnSelect.innerHTML = '';

    const groups = {
      base: document.createElement('optgroup'),
      structural: document.createElement('optgroup'),
      quality: document.createElement('optgroup'),
      soft: document.createElement('optgroup')
    };

    groups.base.label = 'Bases Fundacionales (Grande - 80px)';
    groups.structural.label = 'Estructura Aplicativa (Mediano - 60px)';
    groups.quality.label = 'Calidad y Procesos (Pequeño - 30px)';
    groups.soft.label = 'Habilidades Blandas (Pequeño - 30px)';

    // Ordenar y clasificar bloques
    Object.values(LEGO_CATALOG).forEach(block => {
      const option = document.createElement('option');
      option.value = block.id;
      option.textContent = block.title;

      if (groups[block.category]) {
        groups[block.category].appendChild(option);
      }
    });

    // Añadir grupos que tengan hijos
    Object.values(groups).forEach(group => {
      if (group.children.length > 0) {
        blockSpawnSelect.appendChild(group);
      }
    });
  }

  /**
   * Reproduce un sonido de advertencia utilizando la API Web Audio nativa.
   */
  function playWarningSound(type = 'trash') {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'critical') {
        // Alarma de colapso crítico
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, audioCtx.currentTime);
        osc.frequency.setValueAtTime(280, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        // Sonido corto digital de eliminación
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("AudioContext bloqueado o no soportado por el navegador:", e);
    }
  }

  /**
   * Crea y despliega una notificación flotante (toast) con el impacto didáctico y botón de cierre.
   */
  function showToast(title, message) {
    // Evitar spamear notificaciones idénticas que ya estén visibles en pantalla
    const existingToasts = Array.from(toastContainer.querySelectorAll('.toast'));
    const isDuplicate = existingToasts.some(t => {
      const tTitle = t.querySelector('.toast-title').textContent.trim();
      const tBody = t.querySelector('.toast-body').textContent.trim();
      return tTitle.includes(title) && tBody.includes(message);
    });
    if (isDuplicate) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    toast.innerHTML = `
      <button class="toast-close-btn" aria-label="Cerrar">&times;</button>
      <div class="toast-title">
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 7-7 7 7 0 0 0-7-7z"/>
        </svg>
        ${title}
      </div>
      <div class="toast-body">${message}</div>
    `;

    // Conectar el botón de cruz (Crux) para cierre instantáneo
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => {
      dismissToast(toast);
    });

    toastContainer.appendChild(toast);

    // Animación de salida programada a los 5 segundos
    const autoDismissTimeout = setTimeout(() => {
      dismissToast(toast);
    }, 5000);

    // Guardar el timeout en el dataset del elemento para poder cancelarlo si se cierra manualmente
    toast.dataset.timeoutId = autoDismissTimeout;
  }

  /**
   * Quita un toast de la pantalla de forma suave.
   */
  function dismissToast(toast) {
    if (toast.classList.contains('fade-out')) return;

    // Cancelar el timeout de autocerrado
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }

    toast.classList.add('fade-out');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }

  // --- CALLBACKS DEL MOTOR FÍSICO ---

  /**
   * Maneja el paso del cursor sobre un bloque (Hover).
   */
  function handleHoverBlock(info, mousePos) {
    if (!info || !mousePos) {
      tooltip.classList.remove('visible');
      return;
    }

    document.getElementById('tooltip-title').textContent = info.title;
    document.getElementById('tooltip-desc').textContent = info.description;

    const consequenceEl = document.getElementById('tooltip-consequence');
    consequenceEl.innerHTML = `<strong>Riesgo Profesional:</strong> ${info.consequence}`;

    const badge = document.getElementById('tooltip-badge');
    badge.textContent = translateCategory(info.category);

    badge.className = 'tooltip-badge';
    if (info.category === 'base') {
      badge.classList.add('badge-base');
    } else if (info.category === 'structural') {
      badge.classList.add('badge-structural');
    } else if (info.category === 'quality') {
      badge.classList.add('badge-quality');
    } else if (info.category === 'soft') {
      badge.className = 'tooltip-badge'; // reset
      badge.style.background = 'rgba(42, 157, 143, 0.2)';
      badge.style.color = '#72efdd';
    }

    const canvasRect = canvas.getBoundingClientRect();
    const tooltipX = canvasRect.left + window.scrollX + mousePos.x;
    const tooltipY = canvasRect.top + window.scrollY + mousePos.y - 12;

    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
    tooltip.classList.add('visible');
  }

  function translateCategory(category) {
    switch (category) {
      case 'base': return 'Bases Fundacionales';
      case 'structural': return 'Estructura Aplicativa';
      case 'quality': return 'Calidad y Conector';
      case 'soft': return 'Habilidades Blandas';
      default: return category;
    }
  }

  /**
   * Callback ejecutado periódicamente para actualizar las estadísticas en el HUD.
   */
  function handleStatsUpdate(stats) {
    const { stability, totalBlocks, fallenBlocks, activeBlocks, criticalRemoved } = stats;

    stabilityNumber.textContent = stability;
    statActive.textContent = activeBlocks;
    statFallen.textContent = fallenBlocks;

    if (fallenBlocks > 0) {
      statFallen.classList.add('alert-danger');
    } else {
      statFallen.classList.remove('alert-danger');
    }

    // Animar la barra circular
    const circumference = 377;
    const offset = circumference - (stability / 100) * circumference;
    stabilityRing.style.strokeDashoffset = offset;

    // Colapso Crítico si la estabilidad cae del 30% o si se eliminan más de 2 materias críticas
    const isCritical = (stability < 30) || (criticalRemoved > 2);

    stabilityLabel.className = 'stability-status';

    if (isCritical) {
      stabilityLabel.textContent = 'COLAPSO CRÍTICO';
      stabilityLabel.classList.add('danger');
      stabilityRing.style.stroke = '#ff006e'; // Rojo

      // Sonido de alerta al entrar en colapso crítico
      if (!lastCriticalStatus) {
        playWarningSound('critical');
        showToast('¡ALERTA DE DESPLOME!', 'La estabilidad estructural de tu carrera ha entrado en un colapso crítico. Revisa tus bases.');
        lastCriticalStatus = true;
      }
    } else {
      lastCriticalStatus = false;
      if (stability >= 75) {
        stabilityLabel.textContent = 'SÓLIDO';
        stabilityRing.style.stroke = '#38b000'; // Verde
      } else {
        stabilityLabel.textContent = 'INESTABLE';
        stabilityLabel.classList.add('warning');
        stabilityRing.style.stroke = '#ffbe0b'; // Amarillo
      }
    }
  }

  /**
   * Se ejecuta cuando el usuario comienza a arrastrar un bloque.
   */
  function handleDragStart(block) {
    tooltip.classList.remove('visible');
  }

  /**
   * Se ejecuta continuamente mientras el bloque es arrastrado.
   */
  function handleDragMove(mousePos) {
    // La papelera se dibuja y gestiona directamente en el canvas
  }

  /**
   * Se ejecuta cuando el usuario suelta un bloque arrastrado.
   */
  function handleDragEnd(block, mousePos, deleted) {
    if (deleted) {
      playWarningSound('trash');
      showToast(`Materia Eliminada: ${block.info.title}`, block.info.consequence);
    }
  }

  // --- VINCULACIÓN DE CONTROLES ---

  // Botón Reiniciar
  resetBtn.addEventListener('click', () => {
    resetPhysics();
    tooltip.classList.remove('visible');
    toastContainer.innerHTML = '';
    lastCriticalStatus = false;
  });

  // Slider de Gravedad
  gravitySlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    gravityVal.textContent = `${val.toFixed(1)} G`;
    setGravity(val);
  });

  // Botón Lanzar
  spawnBtn.addEventListener('click', () => {
    const selectedBlock = blockSpawnSelect.value;
    spawnBlock(selectedBlock);
  });

  // --- VINCULACIÓN DE ETIQUETAS DE SUB-CATEGORÍA ---
  document.querySelectorAll('.subcat-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const parent = tag.dataset.parent;
      if (!parent) return;
      const activeParent = setHighlightParent(parent);

      // Toggle visual: quitar active de todos y añadir al clickeado
      document.querySelectorAll('.subcat-tag').forEach(t => t.classList.remove('active'));
      if (activeParent) {
        tag.classList.add('active');
      }
    });
  });

  // --- INICIALIZACIÓN ---
  populateSpawnSelector();

  initPhysics(
    canvas,
    handleHoverBlock,
    handleStatsUpdate,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  );
});
