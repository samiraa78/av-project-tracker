const fs = require('fs');
const path = require('path');

class ProjectDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, 'projects.json');
    this.projects = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    return [];
  }

  saveData() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.projects, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  addProject(project) {
    const newProject = {
      id: Date.now().toString(),
      name: project.name,
      description: project.description || '',
      status: project.status || 'Todo',
      priority: project.priority || 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: project.startDate || null,
      endDate: project.endDate || null,
      progress: project.progress || 0
    };
    
    this.projects.push(newProject);
    this.saveData();
    return newProject;
  }

  updateProject(id, updates) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = {
        ...this.projects[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.projects[index];
    }
    return null;
  }

  deleteProject(id) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = this.projects.splice(index, 1)[0];
      this.saveData();
      return deleted;
    }
    return null;
  }

  getAllProjects() {
    return this.projects;
  }

  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }

  getProjectsByStatus(status) {
    return this.projects.filter(p => p.status === status);
  }
}

module.exports = ProjectDatabase;