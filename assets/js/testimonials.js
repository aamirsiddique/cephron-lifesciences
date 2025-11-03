// Testimonials Data
const testimonialsData = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        position: "Franchise Partner",
        location: "Delhi",
        image: "assets/img/testimonials/testimonials-1.jpg",
        quote: "Cephron LifeSciences has been an excellent partner. Their product quality is outstanding and delivery is always on time. The franchise support team is very responsive and helpful.",
        category: "franchise",
        featured: true,
        dateAdded: "2024-01-15"
    },
    {
        id: 2,
        name: "Mrs. Priya Sharma",
        position: "Healthcare Distributor",
        location: "Mumbai",
        image: "assets/img/testimonials/testimonials-2.jpg",
        quote: "The monopoly rights and marketing support provided by Cephron has helped us establish a strong presence in our territory. Highly recommended for anyone looking to start a pharma business.",
        category: "distributor",
        featured: true,
        dateAdded: "2024-01-20"
    },
    {
        id: 3,
        name: "Mr. Amit Verma",
        position: "Pharmacy Owner",
        location: "Bangalore",
        image: "assets/img/testimonials/testimonials-3.jpg",
        quote: "Working with Cephron LifeSciences has been a game-changer for our pharmacy. Their product range is comprehensive and the quality is consistently excellent.",
        category: "pharmacy",
        featured: true,
        dateAdded: "2024-02-01"
    },
    {
        id: 4,
        name: "Dr. Sunita Patel",
        position: "Medical Representative",
        location: "Pune",
        image: "assets/img/testimonials/testimonials-4.jpg",
        quote: "The transparent business practices and ethical approach of Cephron LifeSciences sets them apart. They truly care about their partners' success and long-term growth.",
        category: "medical",
        featured: true,
        dateAdded: "2024-02-10"
    },
    {
        id: 5,
        name: "Mr. Naveen Singh",
        position: "Healthcare Entrepreneur",
        location: "Chennai",
        image: "assets/img/testimonials/testimonials-5.jpg",
        quote: "Excellent product quality, competitive pricing, and reliable supply chain. Cephron LifeSciences is definitely a trusted partner in the pharmaceutical industry.",
        category: "entrepreneur",
        featured: true,
        dateAdded: "2024-02-15"
    }
];

// Admin credentials (in a real app, this would be more secure)
const ADMIN_PASSWORD = "cephron2024"; // Change this to your desired password

// Testimonials Manager with Admin Panel
class TestimonialsManager {
    constructor() {
        this.allTestimonials = [...testimonialsData];
        this.currentFilter = 'all';
        this.isAdminMode = false;
        this.init();
    }

    init() {
        this.loadSavedTestimonials();
        this.addFilterButtons();
        this.createAdminButton();
        this.renderTestimonials();
        this.checkAdminSession();
    }

    loadSavedTestimonials() {
        const saved = localStorage.getItem('cephron_testimonials');
        if (saved) {
            this.allTestimonials = JSON.parse(saved);
        }
    }

    saveTestimonials() {
        localStorage.setItem('cephron_testimonials', JSON.stringify(this.allTestimonials));
    }

    checkAdminSession() {
        const adminSession = sessionStorage.getItem('cephron_admin');
        if (adminSession === 'true') {
            this.isAdminMode = true;
            this.updateAdminButton();
        }
    }

    createAdminButton() {
        const titleContainer = document.querySelector('#testimonials .section-title');
        if (!titleContainer.querySelector('.admin-access')) {
            const adminDiv = document.createElement('div');
            adminDiv.className = 'admin-access text-end mt-2';
            adminDiv.innerHTML = `
                <button id="admin-btn" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-gear"></i> Admin
                </button>
            `;
            titleContainer.appendChild(adminDiv);

            document.getElementById('admin-btn').addEventListener('click', () => {
                this.toggleAdminMode();
            });
        }
    }

    updateAdminButton() {
        const adminBtn = document.getElementById('admin-btn');
        if (this.isAdminMode) {
            adminBtn.innerHTML = '<i class="bi bi-gear-fill"></i> Exit Admin';
            adminBtn.className = 'btn btn-danger btn-sm';
        } else {
            adminBtn.innerHTML = '<i class="bi bi-gear"></i> Admin';
            adminBtn.className = 'btn btn-outline-secondary btn-sm';
        }
    }

    toggleAdminMode() {
        if (!this.isAdminMode) {
            this.showPasswordPrompt();
        } else {
            this.exitAdminMode();
        }
    }

    showPasswordPrompt() {
        const password = prompt('Enter admin password:');
        if (password === ADMIN_PASSWORD) {
            this.isAdminMode = true;
            sessionStorage.setItem('cephron_admin', 'true');
            this.updateAdminButton();
            this.showAdminPanel();
            this.renderTestimonials();
            alert('Admin mode activated!');
        } else if (password !== null) {
            alert('Incorrect password!');
        }
    }

    exitAdminMode() {
        this.isAdminMode = false;
        sessionStorage.removeItem('cephron_admin');
        this.updateAdminButton();
        this.hideAdminPanel();
        this.renderTestimonials();
    }

    showAdminPanel() {
        let panel = document.getElementById('testimonials-admin-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'testimonials-admin-panel';
            panel.className = 'admin-panel mt-4';
            panel.innerHTML = this.getAdminPanelHTML();
            
            const container = document.querySelector('#testimonials .container');
            container.appendChild(panel);
            
            this.bindAdminEvents();
        }
        panel.style.display = 'block';
    }

    hideAdminPanel() {
        const panel = document.getElementById('testimonials-admin-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    getAdminPanelHTML() {
        return `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5><i class="bi bi-gear-fill"></i> Testimonials Admin Panel</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <button class="btn btn-success btn-sm me-2 mb-2" onclick="testimonialsManager.showAddForm()">
                                <i class="bi bi-plus"></i> Add New
                            </button>
                            <button class="btn btn-info btn-sm me-2 mb-2" onclick="testimonialsManager.exportData()">
                                <i class="bi bi-download"></i> Export
                            </button>
                            <button class="btn btn-warning btn-sm mb-2" onclick="testimonialsManager.importData()">
                                <i class="bi bi-upload"></i> Import
                            </button>
                        </div>
                        <div class="col-md-6 text-end">
                            <span class="badge bg-secondary">${this.allTestimonials.length} total testimonials</span>
                        </div>
                    </div>
                    
                    <div id="admin-form-container" class="mt-3" style="display: none;"></div>
                    
                    <div class="mt-3">
                        <h6>Manage Testimonials:</h6>
                        <div id="admin-testimonials-list" class="table-responsive">
                            ${this.getTestimonialsTableHTML()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTestimonialsTableHTML() {
        let html = `
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Category</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        this.allTestimonials.forEach(testimonial => {
            html += `
                <tr>
                    <td>${testimonial.name}</td>
                    <td>${testimonial.position}</td>
                    <td><span class="badge bg-light text-dark">${testimonial.category}</span></td>
                    <td>${testimonial.featured ? '<i class="bi bi-star-fill text-warning"></i>' : ''}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="testimonialsManager.editTestimonial(${testimonial.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="testimonialsManager.deleteTestimonial(${testimonial.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `</tbody></table>`;
        return html;
    }

    showAddForm() {
        const container = document.getElementById('admin-form-container');
        container.innerHTML = this.getTestimonialFormHTML();
        container.style.display = 'block';
    }

    getTestimonialFormHTML(testimonial = null) {
        const isEdit = testimonial !== null;
        return `
            <div class="card">
                <div class="card-header">
                    <h6>${isEdit ? 'Edit' : 'Add New'} Testimonial</h6>
                </div>
                <div class="card-body">
                    <form id="testimonial-form">
                        ${isEdit ? `<input type="hidden" id="testimonial-id" value="${testimonial.id}">` : ''}
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Name *</label>
                                    <input type="text" class="form-control" id="testimonial-name" 
                                           value="${isEdit ? testimonial.name : ''}" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Position *</label>
                                    <input type="text" class="form-control" id="testimonial-position" 
                                           value="${isEdit ? testimonial.position : ''}" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Location *</label>
                                    <input type="text" class="form-control" id="testimonial-location" 
                                           value="${isEdit ? testimonial.location : ''}" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Category *</label>
                                    <select class="form-select" id="testimonial-category" required>
                                        <option value="">Select Category</option>
                                        <option value="franchise" ${isEdit && testimonial.category === 'franchise' ? 'selected' : ''}>Franchise Partner</option>
                                        <option value="distributor" ${isEdit && testimonial.category === 'distributor' ? 'selected' : ''}>Distributor</option>
                                        <option value="pharmacy" ${isEdit && testimonial.category === 'pharmacy' ? 'selected' : ''}>Pharmacy</option>
                                        <option value="medical" ${isEdit && testimonial.category === 'medical' ? 'selected' : ''}>Medical Professional</option>
                                        <option value="hospital" ${isEdit && testimonial.category === 'hospital' ? 'selected' : ''}>Hospital</option>
                                        <option value="entrepreneur" ${isEdit && testimonial.category === 'entrepreneur' ? 'selected' : ''}>Entrepreneur</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quote *</label>
                            <textarea class="form-control" id="testimonial-quote" rows="3" required>${isEdit ? testimonial.quote : ''}</textarea>
                        </div>
                        <div class="row">
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label class="form-label">Image URL</label>
                                    <input type="url" class="form-control" id="testimonial-image" 
                                           value="${isEdit ? testimonial.image : 'assets/img/testimonials/default-avatar.jpg'}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">&nbsp;</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="testimonial-featured" 
                                               ${isEdit && testimonial.featured ? 'checked' : ''}>
                                        <label class="form-check-label">Featured</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check"></i> ${isEdit ? 'Update' : 'Add'} Testimonial
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="testimonialsManager.cancelForm()">
                                <i class="bi bi-x"></i> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    bindAdminEvents() {
        const form = document.getElementById('testimonial-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTestimonial();
            });
        }
    }

    saveTestimonial() {
        const id = document.getElementById('testimonial-id')?.value;
        const isEdit = !!id;
        
        const testimonialData = {
            name: document.getElementById('testimonial-name').value,
            position: document.getElementById('testimonial-position').value,
            location: document.getElementById('testimonial-location').value,
            category: document.getElementById('testimonial-category').value,
            quote: document.getElementById('testimonial-quote').value,
            image: document.getElementById('testimonial-image').value || 'assets/img/testimonials/default-avatar.jpg',
            featured: document.getElementById('testimonial-featured').checked,
            dateAdded: isEdit ? this.allTestimonials.find(t => t.id == id).dateAdded : new Date().toISOString().split('T')[0]
        };

        if (isEdit) {
            const index = this.allTestimonials.findIndex(t => t.id == id);
            this.allTestimonials[index] = { ...testimonialData, id: parseInt(id) };
        } else {
            const newId = Math.max(...this.allTestimonials.map(t => t.id), 0) + 1;
            this.allTestimonials.push({ ...testimonialData, id: newId });
        }

        this.saveTestimonials();
        this.renderTestimonials();
        this.updateAdminPanel();
        this.cancelForm();
        
        alert(`Testimonial ${isEdit ? 'updated' : 'added'} successfully!`);
    }

    editTestimonial(id) {
        const testimonial = this.allTestimonials.find(t => t.id === id);
        if (testimonial) {
            const container = document.getElementById('admin-form-container');
            container.innerHTML = this.getTestimonialFormHTML(testimonial);
            container.style.display = 'block';
            this.bindAdminEvents();
        }
    }

    deleteTestimonial(id) {
        const testimonial = this.allTestimonials.find(t => t.id === id);
        if (testimonial && confirm(`Are you sure you want to delete the testimonial by ${testimonial.name}?`)) {
            this.allTestimonials = this.allTestimonials.filter(t => t.id !== id);
            this.saveTestimonials();
            this.renderTestimonials();
            this.updateAdminPanel();
            alert('Testimonial deleted successfully!');
        }
    }

    cancelForm() {
        const container = document.getElementById('admin-form-container');
        container.style.display = 'none';
        container.innerHTML = '';
    }

    updateAdminPanel() {
        const listContainer = document.getElementById('admin-testimonials-list');
        if (listContainer) {
            listContainer.innerHTML = this.getTestimonialsTableHTML();
        }
    }

    exportData() {
        const data = JSON.stringify(this.allTestimonials, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cephron-testimonials.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (Array.isArray(data)) {
                            this.allTestimonials = data;
                            this.saveTestimonials();
                            this.renderTestimonials();
                            this.updateAdminPanel();
                            alert('Data imported successfully!');
                        } else {
                            alert('Invalid file format!');
                        }
                    } catch (error) {
                        alert('Error reading file: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    addFilterButtons() {
        const titleContainer = document.querySelector('#testimonials .section-title');
        if (!titleContainer.querySelector('.testimonial-filters')) {
            const filtersDiv = document.createElement('div');
            filtersDiv.className = 'testimonial-filters text-center mt-3';
            filtersDiv.innerHTML = `
                <button class="filter-btn active" data-filter="all">All Reviews</button>
                <button class="filter-btn" data-filter="franchise">Franchise Partners</button>
                <button class="filter-btn" data-filter="distributor">Distributors</button>
                <button class="filter-btn" data-filter="pharmacy">Pharmacies</button>
                <button class="filter-btn" data-filter="medical">Medical Professionals</button>
                <button class="filter-btn" data-filter="hospital">Hospitals</button>
            `;
            titleContainer.appendChild(filtersDiv);

            filtersDiv.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterTestimonials(e.target.dataset.filter);
                    filtersDiv.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });
        }
    }

    filterTestimonials(category) {
        this.currentFilter = category;
        this.renderTestimonials();
    }

    renderTestimonials() {
        const wrapper = document.querySelector('#testimonials .swiper-wrapper');
        if (!wrapper) return;

        const filtered = this.currentFilter === 'all' 
            ? this.allTestimonials 
            : this.allTestimonials.filter(t => t.category === this.currentFilter);

        wrapper.innerHTML = '';

        filtered.forEach(testimonial => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="testimonial-item">
                    ${this.isAdminMode ? `<div class="admin-controls">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="testimonialsManager.editTestimonial(${testimonial.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="testimonialsManager.deleteTestimonial(${testimonial.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>` : ''}
                    <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        <span>${testimonial.quote}</span>
                        <i class="bi bi-quote quote-icon-right"></i>
                    </p>
                    <img src="${testimonial.image}" class="testimonial-img" alt="${testimonial.name}" 
                         onerror="this.src='assets/img/testimonials/default-avatar.jpg'">
                    <h3>${testimonial.name} ${testimonial.featured ? '<i class="bi bi-star-fill text-warning"></i>' : ''}</h3>
                    <h4>${testimonial.position}, ${testimonial.location}</h4>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        this.reinitializeSwiper();
    }

    reinitializeSwiper() {
        setTimeout(() => {
            const swiperEl = document.querySelector('#testimonials .swiper');
            if (swiperEl && swiperEl.swiper) {
                swiperEl.swiper.update();
            }
        }, 100);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.testimonialsManager = new TestimonialsManager();
});