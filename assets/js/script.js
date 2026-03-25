// JavaScript para funcionalidades interativas da landing page

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initScrollEffects();
    initFormValidation();
    initWhatsAppIntegration();
    initScrollProgress();
    initAnimations();
    initMobileOptimizations();
});

// Scroll Effects - CTA Flutuante e Animações
function initScrollEffects() {
    const floatingCta = document.getElementById('floatingCta');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.testimonial-card, .address-card, .contact-card, .hours-card, .transport-card');
    animateElements.forEach(el => observer.observe(el));

    // Controlar CTA flutuante
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 500) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Função para enviar direto pelo WhatsApp
function sendDirectWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const treatment = document.getElementById('treatment').value;
    const message = document.getElementById('message').value.trim();
    
    // Validação básica
    if (name.length < 3) {
        showFieldError('name', 'Por favor, digite seu nome completo');
        return;
    }
    
    // Montar mensagem para WhatsApp
    const treatmentText = treatment ? getTreatmentText(treatment) : 'Não informado';
    const messageText = message || 'Sem mensagem adicional';
    
    const whatsappMessage = `Olá, me chamo ${name} e gostaria de um atendimento sobre ${treatmentText.toLowerCase()}${messageText !== 'Sem mensagem adicional' ? ', ' + messageText : ''}. Poderia me passar mais informações sobre as datas disponíveis?`;
    
    const whatsappUrl = `https://wa.me/5511971775049?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');
    
    // Mostrar mensagem de sucesso
    showWhatsAppSuccessMessage();
    
    // Salvar dados localmente
    const data = {
        name: name,
        treatment: treatmentText,
        message: messageText,
        timestamp: new Date().toISOString(),
        type: 'direct_whatsapp'
    };
    saveFormData(data);
    
    // Registrar conversão
    trackConversion();
}

function getTreatmentText(treatmentValue) {
    const treatments = {
        'consulta': 'Consulta de rotina',
        'limpeza': 'Limpeza profissional',
        'clareamento': 'Clareamento dental',
        'urgencia': 'Urgência odontológica',
        'outro': 'Outro tipo de atendimento'
    };
    return treatments[treatmentValue] || treatmentValue;
}

function showWhatsAppSuccessMessage() {
    const formContainer = document.querySelector('.form-container');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3 style="margin-bottom: 8px;">📱 WhatsApp Aberto!</h3>
        <p>Sua mensagem foi preparada e o WhatsApp foi aberto. Envie a mensagem para agendar sua consulta.</p>
    `;
    
    // Inserir mensagem antes do formulário
    formContainer.insertBefore(successDiv, formContainer.firstChild);
    
    // Remover mensagem após 8 segundos
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 8000);
    
    // Rolar para a mensagem
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Validação e Processamento do Formulário
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    // Como o campo WhatsApp foi removido, não precisamos da máscara
    
    // Adicionar evento de submit ao formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const treatment = document.getElementById('treatment').value;
    const message = document.getElementById('message').value.trim();
    
    // Remover mensagens de erro anteriores
    removeErrorMessages();
    
    let isValid = true;
    
    // Validar nome
    if (name.length < 3) {
        showFieldError('name', 'Por favor, digite seu nome completo');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#f44336';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#f44336';
    
    field.addEventListener('focus', function() {
        field.style.borderColor = '#e0e0e0';
        errorDiv.remove();
    });
}

function removeErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '#e0e0e0';
    });
}

function submitForm() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.form-submit');
    const formData = new FormData(form);
    
    // Mostrar estado de loading
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    submitButton.classList.add('loading');
    
    // Simular envio (em produção, substituir com API real)
    setTimeout(() => {
        const data = {
            name: formData.get('name'),
            whatsapp: formData.get('whatsapp'),
            treatment: formData.get('treatment'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        // Salvar no localStorage (backup)
        saveFormData(data);
        
        // Enviar para WhatsApp
        sendToWhatsApp(data);
        
        // Mostrar mensagem de sucesso
        showSuccessMessage();
        
        // Resetar formulário
        form.reset();
        
        // Restaurar botão
        submitButton.disabled = false;
        submitButton.textContent = '👉 AGENDAR CONSULTA AGORA';
        submitButton.classList.remove('loading');
        
        // Registrar conversão
        trackConversion();
    }, 2000);
}

function saveFormData(data) {
    // Salvar dados no localStorage como backup
    let leads = JSON.parse(localStorage.getItem('clinic_leads') || '[]');
    leads.push(data);
    localStorage.setItem('clinic_leads', JSON.stringify(leads));
    
    console.log('Dados salvos localmente:', data);
}

function sendToWhatsApp(data) {
    const phoneNumber = '5511971775049'; // Número da clínica
    const message = `*NOVA SOLICITAÇÃO DE AGENDAMENTO*%0A%0A` +
        `*Nome:* ${data.name}%0A` +
        `*WhatsApp:* ${data.whatsapp}%0A` +
        `*Tipo de Atendimento:* ${data.treatment || 'Não informado'}%0A` +
        `*Mensagem:* ${data.message || 'Sem mensagem adicional'}%0A%0A` +
        `*Data:* ${new Date().toLocaleString('pt-BR')}%0A` +
        `*Origem:* Landing Page Odontologia Humanizada`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');
}

function showSuccessMessage() {
    const formContainer = document.querySelector('.form-container');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3 style="margin-bottom: 8px;">✅ Agendamento Solicitado!</h3>
        <p>Recebemos sua solicitação e já abrimos o WhatsApp para você. Entraremos em contato em breve para confirmar seu horário.</p>
    `;
    
    // Inserir mensagem antes do formulário
    formContainer.insertBefore(successDiv, formContainer.firstChild);
    
    // Remover mensagem após 10 segundos
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 10000);
    
    // Rolar para a mensagem
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Integração com WhatsApp
function initWhatsAppIntegration() {
    // Adicionar eventos de clique em todos os links WhatsApp
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Registrar clique no WhatsApp
            trackWhatsAppClick();
        });
    });
    
    // Botão CTA flutuante
    const floatingCta = document.querySelector('.floating-cta a');
    if (floatingCta) {
        floatingCta.addEventListener('click', function(e) {
            e.preventDefault();
            const formSection = document.getElementById('form');
            formSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Barra de Progresso de Scroll
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Animações ao Scroll
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.hero-content, .hero-image, .about-text, .about-image, .testimonial-card, .form-text, .form-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Otimizações Mobile
function initMobileOptimizations() {
    // Detectar dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Ajustar viewport para mobile
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        
        // Adicionar botão de WhatsApp direto no header mobile
        addMobileWhatsAppButton();
        
        // Otimizar imagens para mobile
        optimizeImagesForMobile();
    }
    
    // Prevenir zoom em inputs no iOS
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
        
        input.addEventListener('blur', () => {
            document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0');
        });
    });
}

function addMobileWhatsAppButton() {
    if (window.innerWidth <= 768) {
        const header = document.querySelector('body');
        const mobileWhatsApp = document.createElement('div');
        mobileWhatsApp.innerHTML = `
            <a href="https://wa.me/5511971775049" target="_blank" class="mobile-whatsapp-button">
                📱 Falar no WhatsApp
            </a>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .mobile-whatsapp-button {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: #25D366;
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                z-index: 999;
                box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.05); }
                100% { transform: translateX(-50%) scale(1); }
            }
        `;
        
        document.head.appendChild(style);
        header.appendChild(mobileWhatsApp);
    }
}

function optimizeImagesForMobile() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.addEventListener('error', function() {
            this.style.display = 'none';
            if (this.parentElement.classList.contains('image-placeholder')) {
                this.parentElement.querySelector('.placeholder-text').style.display = 'block';
            }
        });
    });
}

// Tracking e Analytics
function trackConversion() {
    // Simular evento de conversão
    console.log('🎯 Conversão registrada: Formulário enviado');
    
    // Enviar para Google Analytics (se disponível)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
            'value': 1.0,
            'currency': 'BRL'
        });
    }
    
    // Enviar para Facebook Pixel (se disponível)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            value: 1.0,
            currency: 'BRL'
        });
    }
    
    // Salvar conversão localmente
    const conversions = JSON.parse(localStorage.getItem('clinic_conversions') || '[]');
    conversions.push({
        type: 'form_submission',
        timestamp: new Date().toISOString(),
        page: window.location.href
    });
    localStorage.setItem('clinic_conversions', JSON.stringify(conversions));
}

function trackWhatsAppClick() {
    console.log('📱 Clique no WhatsApp registrado');
    
    // Enviar para analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'WhatsApp',
            'event_label': 'Contact Button'
        });
    }
    
    // Salvar localmente
    const clicks = JSON.parse(localStorage.getItem('whatsapp_clicks') || '[]');
    clicks.push({
        timestamp: new Date().toISOString(),
        page: window.location.href
    });
    localStorage.setItem('whatsapp_clicks', JSON.stringify(clicks));
}

// Utilitários
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Tempo de carregamento: ${loadTime.toFixed(2)}ms`);
    
    // Salvar métricas
    const metrics = {
        loadTime: loadTime,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    localStorage.setItem('page_metrics', JSON.stringify(metrics));
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('❌ Erro na página:', e.error);
    
    // Salvar erros para debugging
    const errors = JSON.parse(localStorage.getItem('page_errors') || '[]');
    errors.push({
        message: e.error.message,
        stack: e.error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
    });
    localStorage.setItem('page_errors', JSON.stringify(errors));
});
