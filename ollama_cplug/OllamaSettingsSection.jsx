// ---------------------------------------------------------------------------
// Ollama Settings Section — local AI model configuration.
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import { useKernel } from '../../cms/kernel/providers.jsx';
import { Toggle, Field, Section, SettingsShell } from '../../cms/components/index.js';
import { Bot, Link, Cpu, Sliders } from 'lucide-react';

export function OllamaSettingsSection() {
  const { getService } = useKernel();
  const storage = getService('storage');
  const saved = storage?.get('svc:ollama', {}) || {};

  const [enabled, setEnabled] = useState(saved.enabled ?? false);
  const [url, setUrl] = useState(saved.url || 'http://localhost:11434');
  const [model, setModel] = useState(saved.model || 'llama3');
  const [maxTokens, setMaxTokens] = useState(saved.maxTokens || 2048);
  const [temperature, setTemperature] = useState(saved.temperature || 0.7);
  const [streamResponses, setStreamResponses] = useState(saved.streamResponses ?? true);
  const [done, setDone] = useState(false);

  function save() {
    storage?.set('svc:ollama', { enabled, url, model, maxTokens, temperature, streamResponses });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <SettingsShell
      pluginId="ollama"
      serviceId="ollama"
      title="Ollama (AI)"
      icon={Bot}
      iconColor="text-purple-400"
      badge={{ label: enabled ? 'Enabled' : 'Disabled', color: enabled ? 'emerald' : 'slate' }}
      onSave={save}
      saved={done}
      routingDefaults={{ defaultSubdomain: 'ai', defaultPort: 11434 }}
    >
      <div className="space-y-5">
        <Toggle label="Enable Ollama Integration" desc="Run local AI models for chat, summarization, and code assistance." value={enabled} onChange={setEnabled} card />

        {enabled && (
          <>
            <Section icon={Link} iconColor="text-blue-400" title="Connection">
              <Field label="Ollama API URL" value={url} onChange={setUrl} placeholder="http://localhost:11434" type="url" />
            </Section>

            <Section icon={Cpu} iconColor="text-purple-400" title="Model">
              <div className="space-y-3">
                <Field label="Default Model" value={model} onChange={setModel} placeholder="llama3" help="Model name as shown in `ollama list`" />
                <Field label="Max Tokens" value={maxTokens} onChange={(v) => setMaxTokens(Number(v))} type="number" help="Maximum tokens per response" />
              </div>
            </Section>

            <Section icon={Sliders} iconColor="text-amber-400" title="Generation">
              <div className="space-y-3">
                <Field label="Temperature" value={temperature} onChange={(v) => setTemperature(Number(v))} type="number" help="0.0 (deterministic) to 2.0 (creative)" />
                <Toggle label="Stream Responses" desc="Stream tokens as they are generated." value={streamResponses} onChange={setStreamResponses} card />
              </div>
            </Section>
          </>
        )}
      </div>
    </SettingsShell>
  );
}
