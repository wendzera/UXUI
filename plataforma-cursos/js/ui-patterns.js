/**
 * UI Patterns Implementation
 * Implementação de padrões de interface baseados em https://ui-patterns.com/
 */

// ===== PROGRESSIVE DISCLOSURE PATTERN =====
// Padrão que revela informações progressivamente para não sobrecarregar o usuário
class ProgressiveDisclosure {
  constructor() {
    this.initializeCards();
  }

  initializeCards() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-toggle')) {
        const card = e.target.closest('.card');
        card.classList.toggle('expanded');
        
        const isExpanded = card.classList.contains('expanded');
        e.target.textContent = isExpanded ? 'Ver menos ▲' : 'Ver mais ▼';
      }
    });
  }
}

// ===== SKELETON LOADING PATTERN =====
// Mostra um placeholder enquanto o conteúdo carrega
class SkeletonLoader {
  static createSkeleton(count = 3) {
    const container = document.querySelector('.card-grid');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'card skeleton skeleton-card';
      container.appendChild(skeleton);
    }
  }

  static removeSkeleton() {
    const skeletons = document.querySelectorAll('.skeleton');
    skeletons.forEach(skeleton => skeleton.remove());
  }
}

// ===== BREADCRUMB NAVIGATION PATTERN =====
// Ajuda o usuário a entender onde está na hierarquia do site
class Breadcrumb {
  static create(items) {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');

    items.forEach((item, index) => {
      if (index > 0) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.textContent = '›';
        breadcrumb.appendChild(separator);
      }

      if (item.url) {
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.text;
        breadcrumb.appendChild(link);
      } else {
        const span = document.createElement('span');
        span.textContent = item.text;
        span.setAttribute('aria-current', 'page');
        breadcrumb.appendChild(span);
      }
    });

    return breadcrumb;
  }

  static insertBreadcrumb(items, targetSelector = '.container') {
    const container = document.querySelector(targetSelector);
    if (!container) return;

    const existingBreadcrumb = container.querySelector('.breadcrumb');
    if (existingBreadcrumb) {
      existingBreadcrumb.remove();
    }

    const breadcrumb = this.create(items);
    container.insertBefore(breadcrumb, container.firstChild);
  }
}

// ===== TOAST NOTIFICATION PATTERN =====
// Feedback não-intrusivo para ações do usuário
class ToastNotification {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    const text = document.createElement('span');
    text.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => this.remove(toast);
    
    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(closeBtn);
    
    this.container.appendChild(toast);
    
    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }
    
    return toast;
  }

  getIcon(type) {
    const icon = document.createElement('span');
    icon.style.fontSize = '1.5rem';
    
    switch(type) {
      case 'success':
        icon.textContent = '✓';
        icon.style.color = '#4caf50';
        break;
      case 'error':
        icon.textContent = '✗';
        icon.style.color = '#f44336';
        break;
      case 'warning':
        icon.textContent = '⚠';
        icon.style.color = '#ff9800';
        break;
      default:
        icon.textContent = 'ℹ';
        icon.style.color = '#2196f3';
    }
    
    return icon;
  }

  remove(toast) {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }
}

// ===== FORM VALIDATION PATTERN =====
// Validação inline com feedback visual claro
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (this.form) {
      this.initializeValidation();
    }
  }

  initializeValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Wrap inputs in form-group if not already
      if (!input.closest('.form-group')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }

      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.handleSubmit();
      }
    });
  }

  validateField(field) {
    const formGroup = field.closest('.form-group');
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Remove feedback anterior
    const existingFeedback = formGroup.querySelector('.form-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    // Validações
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'Este campo é obrigatório';
    } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      message = 'Digite um e-mail válido';
    } else if (field.type === 'password' && value && value.length < 6) {
      isValid = false;
      message = 'A senha deve ter no mínimo 6 caracteres';
    }

    // Aplicar classes e feedback
    formGroup.classList.remove('error', 'success');
    if (value) {
      formGroup.classList.add(isValid ? 'success' : 'error');
      
      const feedback = document.createElement('div');
      feedback.className = `form-feedback ${isValid ? 'success' : 'error'}`;
      feedback.textContent = isValid ? '✓ Campo válido' : message;
      formGroup.appendChild(feedback);
    }

    return isValid;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  handleSubmit() {
    const toast = new ToastNotification();
    toast.show('Formulário enviado com sucesso!', 'success');
    
    // Simulação de envio
    setTimeout(() => {
      this.form.reset();
      const formGroups = this.form.querySelectorAll('.form-group');
      formGroups.forEach(group => {
        group.classList.remove('success', 'error');
        const feedback = group.querySelector('.form-feedback');
        if (feedback) feedback.remove();
      });
    }, 1000);
  }
}

// ===== MODAL DIALOG PATTERN =====
// Modal acessível para exibir conteúdo adicional
class ModalDialog {
  constructor() {
    this.overlay = this.createOverlay();
    this.setupEventListeners();
  }

  createOverlay() {
    let overlay = document.querySelector('.modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  setupEventListeners() {
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(title, content, footerButtons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => this.close();
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    
    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else {
      body.appendChild(content);
    }
    
    // Footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footerButtons.forEach(btnConfig => {
      const btn = document.createElement('button');
      btn.textContent = btnConfig.text;
      btn.className = btnConfig.className || '';
      btn.onclick = btnConfig.onClick || (() => this.close());
      footer.appendChild(btn);
    });
    
    modal.appendChild(header);
    modal.appendChild(body);
    if (footerButtons.length > 0) {
      modal.appendChild(footer);
    }
    
    this.overlay.innerHTML = '';
    this.overlay.appendChild(modal);
    this.overlay.classList.add('active');
    
    // Trap focus
    modal.focus();
  }

  close() {
    this.overlay.classList.remove('active');
  }
}

// ===== LAZY LOADING IMAGES PATTERN =====
// Carrega imagens apenas quando necessário
class LazyImageLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.initializeObserver();
  }

  initializeObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });

      this.images.forEach(img => observer.observe(img));
    } else {
      // Fallback para navegadores antigos
      this.images.forEach(img => this.loadImage(img));
    }
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');
  }
}

// ===== SEARCH AND FILTER PATTERN =====
// Busca e filtragem em tempo real
class SearchFilter {
  constructor(searchInputId, filterTagsClass, itemsSelector) {
    this.searchInput = document.getElementById(searchInputId);
    this.filterTags = document.querySelectorAll(`.${filterTagsClass}`);
    this.items = document.querySelectorAll(itemsSelector);
    this.activeFilters = new Set();

    this.initialize();
  }

  initialize() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.filter());
    }

    this.filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        const category = tag.dataset.category;
        
        if (tag.classList.contains('active')) {
          this.activeFilters.add(category);
        } else {
          this.activeFilters.delete(category);
        }
        
        this.filter();
      });
    });
  }

  filter() {
    const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';

    this.items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const category = item.dataset.category;
      
      const matchesSearch = !searchTerm || text.includes(searchTerm);
      const matchesFilter = this.activeFilters.size === 0 || 
                           this.activeFilters.has(category);
      
      if (matchesSearch && matchesFilter) {
        item.style.display = '';
        item.style.animation = 'fadeIn 0.3s ease';
      } else {
        item.style.display = 'none';
      }
    });
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Progressive Disclosure
  new ProgressiveDisclosure();

  // Inicializa Lazy Loading
  new LazyImageLoader();

  // Inicializa validação de formulários
  const loginForm = document.querySelector('form');
  if (loginForm) {
    new FormValidator('form');
  }

  // Instância global de Toast
  window.toast = new ToastNotification();

  // Instância global de Modal
  window.modal = new ModalDialog();

  // Adiciona breadcrumbs baseado na página atual
  const path = window.location.pathname;
  const pageName = path.split('/').pop().replace('.html', '') || 'index';
  
  const breadcrumbMap = {
    'index': [{ text: 'Início', url: null }],
    'cursos': [
      { text: 'Início', url: 'index.html' },
      { text: 'Cursos', url: null }
    ],
    'login': [
      { text: 'Início', url: 'index.html' },
      { text: 'Login', url: null }
    ],
    'cadastro': [
      { text: 'Início', url: 'index.html' },
      { text: 'Cadastro', url: null }
    ],
    'noticias': [
      { text: 'Início', url: 'index.html' },
      { text: 'Notícias', url: null }
    ],
    'novidades': [
      { text: 'Início', url: 'index.html' },
      { text: 'Novidades', url: null }
    ],
    'contatos': [
      { text: 'Início', url: 'index.html' },
      { text: 'Contatos', url: null }
    ]
  };

  if (breadcrumbMap[pageName]) {
    Breadcrumb.insertBreadcrumb(breadcrumbMap[pageName]);
  }
});

// Exporta classes para uso global
window.UIPatterns = {
  ProgressiveDisclosure,
  SkeletonLoader,
  Breadcrumb,
  ToastNotification,
  FormValidator,
  ModalDialog,
  LazyImageLoader,
  SearchFilter
};
