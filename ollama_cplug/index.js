// ---------------------------------------------------------------------------
// Ollama Plugin — Local LLM inference integration.
// ---------------------------------------------------------------------------
import { definePlugin } from '../../cms/kernel/index.js';
import { Bot } from 'lucide-react';
import OllamaPage from './OllamaPage.jsx';
import { OllamaSettingsSection } from './OllamaSettingsSection.jsx';

export default definePlugin({
  id: 'ollama_cplug',
  name: 'Ollama',
  type: 'service',
  required: false,
  defaultEnabled: true,
  version: '0.1.0',
  description: 'Local LLM inference via Ollama — models, chat, and API access.',
  icon: Bot,
  category: 'Services',
  tags: ['service', 'ai', 'llm'],
  requires: ['user_cplug', 'auth_cplug'],

  routes: [
    { path: '/services/ollama', component: OllamaPage, label: 'Ollama', permission: 'admin.config' },
  ],

  menuItems: [
    { id: 'ollama', to: '/services/ollama', icon: Bot, label: 'Ollama', section: 'services', order: 35, permission: 'admin.config' },
  ],

  hooks: {
    hook_init({ registerService }) {
      registerService('ollama', {
        _baseUrl: 'http://ollama.sovereign-system.svc:11434',
        configure(url) { this._baseUrl = url; },
        getModels() { return fetch(`${this._baseUrl}/api/tags`).then(r => r.json()).catch(() => ({ models: [] })); },
        chat(model, messages) {
          return fetch(`${this._baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages, stream: false }),
          }).then(r => r.json()).catch(() => null);
        },
      });
    },

    hook_permission() {
      return [
        { id: 'ollama.admin',          label: 'Administer Ollama',          module: 'ollama' },
        { id: 'ollama.settings.view',  label: 'View Ollama settings',       module: 'ollama' },
        { id: 'ollama.settings.edit',  label: 'Edit Ollama settings',       module: 'ollama' },
        { id: 'ollama.chat',           label: 'Use Ollama chat',            module: 'ollama' },
        { id: 'ollama.generate',       label: 'Use text generation API',    module: 'ollama' },
        { id: 'ollama.models',         label: 'Manage Ollama models',       module: 'ollama' },
        { id: 'ollama.models.pull',    label: 'Pull / download models',     module: 'ollama' },
        { id: 'ollama.models.delete',  label: 'Delete models',              module: 'ollama' },
        { id: 'ollama.embeddings',     label: 'Use embedding API',          module: 'ollama' },
      ];
    },

    hook_settings() {
      return {
        id: 'ollama',
        label: 'Ollama (AI)',
        icon: Bot,
        weight: 68,
        category: 'Services',
        pluginId: 'ollama_cplug',
        component: OllamaSettingsSection,
      };
    },

    hook_admin() {
      return {
        id: 'ollama',
        label: 'Ollama',
        icon: Bot,
        weight: 68,
        pluginId: 'ollama_cplug',
        component: OllamaSettingsSection,
      };
    },
  },
});
