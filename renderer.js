const { ipcRenderer } = require('electron');

class ProjectTracker {
    constructor() {
        this.projects = [];
        this.editingProjectId = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadProjects();
        this.renderProjects();
    }

    bindEvents() {
        // Modal events
        document.getElementById('add-project-btn').addEventListener('click', () => {
            this.showModal();
        });

        document.querySelector('.close').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.hideModal();
        });

        // Form submission
        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        // Filter events
        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.filterProjects(e.target.value);
        });

        // Progress slider
        document.getElementById('project-progress').addEventListener('input', (e) => {
            document.getElementById('progress-value').textContent = e.target.value + '%';
        });

        // Close modal when clicking outside
        document.getElementById('project-modal').addEventListener('click', (e) => {
            if (e.target.id === 'project-modal') {
                this.hideModal();
            }
        });
    }

    async loadProjects() {
        try {
            this.projects = await ipcRenderer.invoke('get-all-projects');
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    renderProjects(projectsToRender = null) {
        const grid = document.getElementById('projects-grid');
        const projects = projectsToRender || this.projects;

        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>No projects found</h3>
                    <p>Click "Add Project" to get started!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = projects.map(project => this.createProjectCard(project)).join('');
    }

    createProjectCard(project) {
        const statusClass = project.status.toLowerCase().replace(' ', '-');
        const priorityClass = project.priority.toLowerCase();
        
        return `
            <div class="project-card">
                <div class="project-header">
                    <h3 class="project-title">${project.name}</h3>
                    <div class="project-actions">
                        <button class="btn btn-small btn-secondary" onclick="app.editProject('${project.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="app.deleteProject('${project.id}')">Delete</button>
                    </div>
                </div>
                
                <p class="project-description">${project.description || 'No description'}</p>
                
                <div class="project-meta">
                    <div class="meta-item">
                        <span class="meta-label">Status:</span>
                        <span class="status-badge status-${statusClass}">${project.status}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Priority:</span>
                        <span class="priority-${priorityClass}">${project.priority}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Created:</span>
                        <span>${new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Progress:</span>
                        <span>${project.progress}%</span>
                    </div>
                </div>
                
                ${project.startDate ? `
                    <div class="project-meta">
                        <div class="meta-item">
                            <span class="meta-label">Start:</span>
                            <span>${new Date(project.startDate).toLocaleDateString()}</span>
                        </div>
                        ${project.endDate ? `
                            <div class="meta-item">
                                <span class="meta-label">End:</span>
                                <span>${new Date(project.endDate).toLocaleDateString()}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
            </div>
        `;
    }

    showModal(project = null) {
        const modal = document.getElementById('project-modal');
        const title = document.getElementById('modal-title');
        
        if (project) {
            title.textContent = 'Edit Project';
            this.editingProjectId = project.id;
            this.fillForm(project);
        } else {
            title.textContent = 'Add New Project';
            this.editingProjectId = null;
            this.clearForm();
        }
        
        modal.style.display = 'block';
    }

    hideModal() {
        document.getElementById('project-modal').style.display = 'none';
        this.editingProjectId = null;
        this.clearForm();
    }

    fillForm(project) {
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-description').value = project.description || '';
        document.getElementById('project-status').value = project.status;
        document.getElementById('project-priority').value = project.priority;
        document.getElementById('project-start-date').value = project.startDate ? project.startDate.split('T')[0] : '';
        document.getElementById('project-end-date').value = project.endDate ? project.endDate.split('T')[0] : '';
        document.getElementById('project-progress').value = project.progress;
        document.getElementById('progress-value').textContent = project.progress + '%';
    }

    clearForm() {
        document.getElementById('project-form').reset();
        document.getElementById('progress-value').textContent = '0%';
    }

    async saveProject() {
        const formData = {
            name: document.getElementById('project-name').value,
            description: document.getElementById('project-description').value,
            status: document.getElementById('project-status').value,
            priority: document.getElementById('project-priority').value,
            startDate: document.getElementById('project-start-date').value || null,
            endDate: document.getElementById('project-end-date').value || null,
            progress: parseInt(document.getElementById('project-progress').value)
        };

        try {
            if (this.editingProjectId) {
                await ipcRenderer.invoke('update-project', this.editingProjectId, formData);
            } else {
                await ipcRenderer.invoke('add-project', formData);
            }
            
            await this.loadProjects();
            this.renderProjects();
            this.hideModal();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project. Please try again.');
        }
    }

    async editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (project) {
            this.showModal(project);
        }
    }

    async deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await ipcRenderer.invoke('delete-project', id);
                await this.loadProjects();
                this.renderProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Error deleting project. Please try again.');
            }
        }
    }

    async filterProjects(status) {
        if (status === 'all') {
            this.renderProjects();
        } else {
            try {
                const filteredProjects = await ipcRenderer.invoke('get-projects-by-status', status);
                this.renderProjects(filteredProjects);
            } catch (error) {
                console.error('Error filtering projects:', error);
            }
        }
    }
}

// Initialize the app
const app = new ProjectTracker();