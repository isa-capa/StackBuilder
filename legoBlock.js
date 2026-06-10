/**
 * Clase que representa visualmente un bloque estilo Lego.
 * Utiliza los datos del cuerpo físico de Matter.js para dibujarse en el Canvas.
 */
export class LegoBlock {
  constructor(body, blockInfo) {
    this.body = body;
    this.info = blockInfo;
    this.isHovered = false;
    this.isDragged = false;
    this.isHighlighted = false;
  }

  /**
   * Dibuja el bloque Lego en el contexto del canvas.
   * @param {CanvasRenderingContext2D} ctx - Contexto 2D del Canvas.
   */
  draw(ctx) {
    if (!this.body) return;

    const { x, y } = this.body.position;
    const angle = this.body.angle;
    const { width, height, color, title } = this.info;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    // 2. DIBUJAR EL CUERPO PRINCIPAL DEL BLOQUE
    // Gradiente lineal de arriba a abajo para dar aspecto cilíndrico/plástico
    const gradient = ctx.createLinearGradient(-width / 2, -height / 2, -width / 2, height / 2);
    gradient.addColorStop(0, lightenColor(color, 25));
    gradient.addColorStop(0.15, lightenColor(color, 10));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(0.85, darkenColor(color, 15));
    gradient.addColorStop(1, darkenColor(color, 30));

    ctx.fillStyle = gradient;

    const cornerRadius = 6;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-width / 2, -height / 2, width, height, cornerRadius);
    } else {
      ctx.rect(-width / 2, -height / 2, width, height);
    }
    ctx.fill();

    // 3. EFECTO DE LUZ E INTERIOR DE LOS BORDES (BEVEL EFFECT)
    // Línea de brillo en el borde superior e izquierdo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-width / 2 + cornerRadius, -height / 2 + 1);
    ctx.lineTo(width / 2 - cornerRadius, -height / 2 + 1);
    ctx.moveTo(-width / 2 + 1, -height / 2 + cornerRadius);
    ctx.lineTo(-width / 2 + 1, height / 2 - cornerRadius);
    ctx.stroke();

    // Línea de sombra en el borde inferior y derecho
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-width / 2 + cornerRadius, height / 2 - 1);
    ctx.lineTo(width / 2 - cornerRadius, height / 2 - 1);
    ctx.moveTo(width / 2 - 1, -height / 2 + cornerRadius);
    ctx.lineTo(width / 2 - 1, height / 2 - cornerRadius);
    ctx.stroke();

    // 4. INTERACTVIDAD Y SELECCIÓN (GLOW / BRILLO DE HOVER)
    if (this.isHovered || this.isDragged) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = this.isDragged ? 20 : 12;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-width / 2, -height / 2, width, height, cornerRadius);
      } else {
        ctx.rect(-width / 2, -height / 2, width, height);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Resetear sombra para otros dibujos
    } else if (this.isHighlighted) {
      // Resplandor pulsante con el color del bloque al filtrar por sub-categoría
      const pulseIntensity = 10 + Math.sin(Date.now() / 300) * 6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = pulseIntensity;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-width / 2, -height / 2, width, height, cornerRadius);
      } else {
        ctx.rect(-width / 2, -height / 2, width, height);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      // Borde sutil oscuro estándar
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-width / 2, -height / 2, width, height, cornerRadius);
      } else {
        ctx.rect(-width / 2, -height / 2, width, height);
      }
      ctx.stroke();
    }

    // 5. TEXTO DEL BLOQUE
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra del texto
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0.5;
    ctx.shadowOffsetY = 1;

    // Diccionario de abreviaturas para bloques estrechos o pequeños
    const SHORT_TITLES = {
      'OOP & Sintaxis': 'OOP',
      'Colecciones & Lambdas': 'Collections',
      'Memoria & Concurrencia': 'Memory',
      'Modelado Relacional': 'Modeling',
      'SQL & Consultas': 'SQL',
      'Transacciones (ACID)': 'ACID',
      'Redes & HTTP': 'HTTP',
      'Terminal & OS': 'Terminal',
      'Estructuras de Datos': 'Algorithms',
      'HTML5 Semántico': 'HTML5',
      'CSS3 & Flex/Grid': 'CSS3',
      'JavaScript ES6+': 'JS ES6+',
      'IoC & Beans': 'IoC',
      'REST APIs (MVC)': 'REST API',
      'Spring Data JPA': 'JPA',
      'Patrones de Diseño': 'Design Pat.',
      'Domain-Driven Design': 'DDD',
      'Diseño de APIs REST': 'API Design',
      'Componentes & JSX': 'JSX',
      'Hooks & Estado': 'Hooks',
      'Estado Global & APIs': 'Global St.',
      'Roles & Mindset': 'Roles',
      'Sprints & Dailies': 'Sprints',
      'Backlog & Historias': 'Backlog',
      'Pruebas Unitarias': 'Unit Tests',
      'Mocks & Spies': 'Mocks',
      'Metodología TDD': 'TDD',
      'Comandos Core': 'Git Core',
      'Branching & Merge': 'Branching',
      'Pull Requests': 'PRs',
      'Contenedores': 'Docker',
      'Pipelines CI/CD': 'CI/CD',
      'Despliegues': 'Deploy',
      'Autenticación': 'AuthN',
      'Autorización (Roles)': 'AuthZ',
      'Tokens & JWT': 'JWT',
      'Trabajo en Equipo': 'Teamwork',
      'Comunicación Asertiva': 'Comm.',
      'Proactividad': 'Proactive',
      'Resolución de Problemas': 'Problem Sol.',
      'Adaptabilidad': 'Adapt.',
      'Gestión del Tiempo': 'Time Mgt.',
      'Pensamiento Crítico': 'Critical Th.',
      'Empatía': 'Empathy',
      'Aprendizaje Continuo': 'Learning',
      'Recepción de Feedback': 'Feedback'
    };

    // Obtener texto abreviado si existe
    let textToDraw = SHORT_TITLES[title] || title;

    // Si el bloque es vertical (más alto que ancho, p. ej. 30x50)
    if (width < height) {
      ctx.save();
      // Rotar 90 grados en contra de las manecillas del reloj para leer verticalmente hacia arriba
      ctx.rotate(-Math.PI / 2);
      ctx.font = 'bold 9px "Outfit", "Inter", sans-serif';
      
      // Limitar longitud para que no se salga de la altura (50px)
      if (textToDraw.length > 14) {
        textToDraw = textToDraw.substring(0, 12) + '..';
      }
      
      ctx.fillText(textToDraw, 0, 0);
      ctx.restore();
    } else {
      // Bloque horizontal normal
      ctx.font = 'bold 11px "Outfit", "Inter", sans-serif';
      
      // Ajustar tamaño de fuente si sigue siendo muy ancho
      let maxTextWidth = width - 10;
      if (ctx.measureText(textToDraw).width > maxTextWidth) {
        ctx.font = 'bold 9px "Outfit", "Inter", sans-serif';
      }
      
      ctx.fillText(textToDraw, 0, 0);
    }

    ctx.restore();
  }
}

/**
 * Aclara un color en formato HEX.
 */
function lightenColor(hex, percent) {
  let num = parseInt(hex.replace("#", ""), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = (num >> 8 & 0x00FF) + amt;
  let B = (num & 0x0000FF) + amt;
  
  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));
  
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Oscurece un color en formato HEX.
 */
function darkenColor(hex, percent) {
  let num = parseInt(hex.replace("#", ""), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) - amt;
  let G = (num >> 8 & 0x00FF) - amt;
  let B = (num & 0x0000FF) - amt;
  
  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));
  
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}
