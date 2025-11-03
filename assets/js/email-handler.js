// EmailJS Configuration
const EMAIL_CONFIG = {
    serviceID: 'your_service_id',      // Replace with your EmailJS service ID
    businessTemplateID: 'template_shth7rp',  // Template for business notifications
    customerTemplateID: 'template_xxhyp86',  // Template for customer confirmations
    publicKey: 'D5fG06kvRVAZUEtCu'       // Replace with your EmailJS public key
};

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.publicKey);

// Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.form = document.querySelector('.php-email-form');
        if (!this.form) return;
        
        this.loadingEl = this.form.querySelector('.loading');
        this.errorEl = this.form.querySelector('.error-message');
        this.successEl = this.form.querySelector('.sent-message');
        
        this.init();
    }

    init() {
        // Override the default form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        try {
            this.showLoading();
            
            const formData = this.getFormData();
            
            if (!this.validateForm(formData)) {
                throw new Error('Please fill in all required fields with valid information.');
            }

            // Send both emails
            await Promise.all([
                this.sendBusinessNotification(formData),
                this.sendCustomerConfirmation(formData)
            ]);
            
            this.showSuccess();
            this.form.reset();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            this.showError('Failed to send message. Please try again or contact us directly at inquiry@cephronlifesciences.com');
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        return {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            subject: formData.get('subject')?.trim(),
            message: formData.get('message')?.trim(),
            date: new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    }

    validateForm(data) {
        if (!data.name || !data.email || !data.subject || !data.message) {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(data.email);
    }

    async sendBusinessNotification(formData) {
        const templateParams = {
            to_email: 'inquiry@cephronlifesciences.com',
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            inquiry_date: formData.date,
            inquiry_type: this.getInquiryType(formData.subject)
        };

        return emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.businessTemplateID,
            templateParams
        );
    }

    async sendCustomerConfirmation(formData) {
        const templateParams = {
            to_email: formData.email,
            customer_name: formData.name,
            inquiry_subject: formData.subject,
            inquiry_date: formData.date,
            company_name: 'Cephron LifeSciences',
            company_email: 'inquiry@cephronlifesciences.com',
            company_phone: '+91 9453941137',
            company_address: 'Shop No. 5 529D/1/2717 Jannat Complex, Kanchana Bihari Marg Kalyanpur, Lucknow – 226022 UP'
        };

        return emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.customerTemplateID,
            templateParams
        );
    }

    getInquiryType(subject) {
        const subjectLower = subject.toLowerCase();
        if (subjectLower.includes('franchise')) return 'Franchise Inquiry';
        if (subjectLower.includes('product')) return 'Product Inquiry';
        if (subjectLower.includes('partnership')) return 'Partnership Inquiry';
        if (subjectLower.includes('support')) return 'Support Request';
        return 'General Inquiry';
    }

    showLoading() {
        this.hideAllMessages();
        this.loadingEl.classList.add('d-block');
    }

    showSuccess() {
        this.hideAllMessages();
        this.successEl.classList.add('d-block');
        this.successEl.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
    }

    showError(message) {
        this.hideAllMessages();
        this.errorEl.classList.add('d-block');
        this.errorEl.textContent = message;
    }

    hideAllMessages() {
        this.loadingEl.classList.remove('d-block');
        this.errorEl.classList.remove('d-block');
        this.successEl.classList.remove('d-block');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof emailjs !== 'undefined') {
        new ContactFormHandler();
    } else {
        console.error('EmailJS library not loaded');
    }
});