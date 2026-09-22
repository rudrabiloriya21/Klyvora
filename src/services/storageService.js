import { getSeedTemplates } from '../models/defaultTemplates.js';
import { generateId } from '../models/projectSchema.js';

const STORAGE_KEY = 'klyvora_studio_projects_v1';
const SETTINGS_KEY = 'klyvora_studio_settings_v1';

let memoryFallback = {};
const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return {
    getItem: (k) => memoryFallback[k] || null,
    setItem: (k, v) => { memoryFallback[k] = String(v); },
    removeItem: (k) => { delete memoryFallback[k]; },
    clear: () => { memoryFallback = {}; },
  };
};

export const storageService = {
  /**
   * Initializes storage with sample seed projects if empty
   */
  initStorage() {
    try {
      const existing = getStorage().getItem(STORAGE_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        const seeds = getSeedTemplates();
        getStorage().setItem(STORAGE_KEY, JSON.stringify(seeds));
        return seeds;
      }
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) {
        const hasKavya = parsed.some((p) => p.metadata?.name?.includes('Kavya Handloom'));
        if (!hasKavya) {
          const seeds = getSeedTemplates();
          // Keep user's custom created projects, while updating seed templates to new Indian business templates
          const userCreated = parsed.filter((p) =>
            !p.id?.startsWith('tpl_') &&
            !p.metadata?.name?.includes('Luma & Bean') &&
            !p.metadata?.name?.includes('Synapse') &&
            !p.metadata?.name?.includes('Nexus Studio')
          );
          const updated = [...seeds, ...userCreated];
          getStorage().setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }
      }
      return parsed;
    } catch (err) {
      console.warn('Storage init failed, falling back to in-memory seeds', err);
      return getSeedTemplates();
    }
  },

  /**
   * Retrieve projects scoped to a specific user UID
   */
  getUserProjects(userId) {
    if (!userId) return this.getAllProjects();
    const all = this.getAllProjects();
    return all.filter((p) => p.metadata?.userId === userId);
  },

  /**
   * Retrieve all saved projects
   */
  getAllProjects() {
    try {
      const raw = getStorage().getItem(STORAGE_KEY);
      if (!raw) return this.initStorage();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return this.initStorage();
      }
      return parsed;
    } catch (err) {
      console.error('Failed to load projects from storage', err);
      return getSeedTemplates();
    }
  },

  /**
   * Retrieve a single project by ID
   */
  getProject(id, userId) {
    const projects = userId ? this.getUserProjects(userId) : this.getAllProjects();
    return projects.find((p) => p.id === id) || (userId ? this.getAllProjects().find((p) => p.id === id) : null);
  },

  /**
   * Save or update an existing project, stamping user ownership
   */
  saveProject(project, userId) {
    if (!project || !project.id) throw new Error('Invalid project structure for saving');
    const projects = this.getAllProjects();
    const now = new Date().toISOString();

    const ownerId = userId || project.metadata?.userId;

    const updatedProject = {
      ...project,
      metadata: {
        ...project.metadata,
        userId: ownerId,
        updatedAt: now,
      },
    };

    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = updatedProject;
    } else {
      projects.unshift(updatedProject);
    }

    try {
      getStorage().setItem(STORAGE_KEY, JSON.stringify(projects));
      return updatedProject;
    } catch (err) {
      console.error('Failed to save project to storage', err);
      throw new Error('Local storage limit exceeded or write error.');
    }
  },

  /**
   * Duplicate a project
   */
  duplicateProject(id, userId) {
    const target = this.getProject(id, userId);
    if (!target) throw new Error(`Project ${id} not found`);

    const newId = generateId('proj');
    const now = new Date().toISOString();

    const clone = JSON.parse(JSON.stringify(target));
    clone.id = newId;
    clone.metadata.name = `${target.metadata.name} (Copy)`;
    clone.metadata.userId = userId || target.metadata.userId;
    clone.metadata.createdAt = now;
    clone.metadata.updatedAt = now;
    clone.metadata.status = 'draft';

    // Refresh IDs on cloned pages and sections to ensure stability
    clone.pages = clone.pages.map((page) => ({
      ...page,
      id: generateId('page'),
      sections: page.sections.map((sec) => ({
        ...sec,
        id: generateId(`sec_${sec.type}`),
      })),
    }));

    return this.saveProject(clone, userId);
  },

  /**
   * Delete a project by ID
   */
  deleteProject(id) {
    const projects = this.getAllProjects();
    const filtered = projects.filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.error('Failed to delete project', err);
      return false;
    }
  },

  /**
   * Toggle project favorite status
   */
  toggleFavorite(id) {
    const project = this.getProject(id);
    if (!project) return null;
    project.metadata.favorite = !project.metadata.favorite;
    return this.saveProject(project);
  },

  /**
   * Save a point-in-time snapshot to version history
   */
  addVersionSnapshot(projectId, label, summary = '') {
    const project = this.getProject(projectId);
    if (!project) return null;

    const snapshot = {
      id: generateId('ver'),
      timestamp: new Date().toISOString(),
      label: label || `Snapshot ${project.versionHistory ? project.versionHistory.length + 1 : 1}`,
      snapshotSummary: summary,
      data: JSON.parse(JSON.stringify(project)),
    };

    if (!project.versionHistory) project.versionHistory = [];
    project.versionHistory.unshift(snapshot);

    // Keep last 15 snapshots to conserve storage space
    if (project.versionHistory.length > 15) {
      project.versionHistory = project.versionHistory.slice(0, 15);
    }

    return this.saveProject(project);
  },

  /**
   * Record a form submission (from live preview test forms)
   */
  addFormSubmission(projectId, submission) {
    const project = this.getProject(projectId);
    if (!project) return false;

    if (!project.forms) project.forms = [];
    project.forms.unshift({
      id: generateId('sub'),
      timestamp: new Date().toISOString(),
      ...submission,
    });

    this.saveProject(project);
    return true;
  },

  /**
   * Export project as formatted JSON string
   */
  exportProjectAsJson(id) {
    const project = this.getProject(id);
    if (!project) throw new Error('Project not found');
    return JSON.stringify(project, null, 2);
  },

  /**
   * Import project from JSON string
   */
  importProjectFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.metadata || !parsed.pages) {
        throw new Error('Invalid project JSON schema');
      }
      parsed.id = generateId('proj');
      parsed.metadata.name = `${parsed.metadata.name || 'Imported Project'} (Imported)`;
      parsed.metadata.createdAt = new Date().toISOString();
      parsed.metadata.updatedAt = new Date().toISOString();
      return this.saveProject(parsed);
    } catch (err) {
      throw new Error(`Import failed: ${err.message}`);
    }
  },

  /**
   * Global Settings (AI Providers & API keys)
   */
  getSettings() {
    try {
      const raw = getStorage().getItem(SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        provider: parsed.provider || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_PROVIDER) || 'groq',
        apiUrl: parsed.apiUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_URL) || 'https://api.groq.com/openai/v1',
        apiKey: parsed.apiKey || (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_AI_API_KEY || import.meta.env?.VITE_GROQ_API_KEY)) || '',
        modelId: parsed.modelId || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_MODEL_ID) || 'openai/gpt-oss-120b',
        timeoutMs: parsed.timeoutMs || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_TIMEOUT_MS) || 30000,
      };
    } catch {
      return {
        provider: 'groq',
        apiUrl: 'https://api.groq.com/openai/v1',
        apiKey: (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_AI_API_KEY || import.meta.env?.VITE_GROQ_API_KEY)) || '',
        modelId: 'openai/gpt-oss-120b',
        timeoutMs: 30000,
      };
    }
  },

  saveSettings(settings) {
    try {
      getStorage().setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  },
};
