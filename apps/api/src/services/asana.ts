/**
 * Asana integration — project spin-up from template on engagement accept.
 *
 * MOCK_MODE (default until real credentials are configured):
 *   - Returns a fake project gid shaped like a real Asana project gid
 *   - Logs to console
 *   - No external network calls
 *
 * LIVE_MODE (when env vars below are set):
 *   - ASANA_BASE_URL           default https://app.asana.com/api/1.0
 *   - ASANA_ACCESS_TOKEN       Personal Access Token or OAuth bearer
 *   - ASANA_WORKSPACE_GID      Asana workspace GID
 *   - ASANA_TEMPLATE_GID_MAP   JSON map of serviceSlug -> Asana project template gid
 *                              e.g. {"brand-development":"123456","seta-learnerships":"789012"}
 *
 *   When live mode is on, this calls Asana's instantiate-project-template endpoint:
 *     POST /project_templates/{template_gid}/instantiateProject
 *   then returns the new project gid.
 *
 * Returns { projectId, projectUrl, status, notes } regardless of mode.
 */

export interface CreateProjectInput {
  engagementId: string;
  serviceName: string;
  serviceSlug: string;
  clientName: string;
  clientCompany?: string | null;
}

export interface CreateProjectResult {
  projectId: string;          // Asana project gid
  projectUrl?: string;        // https://app.asana.com/0/{projectId}
  status: 'created' | 'mock' | 'failed' | 'no_template';
  notes?: string;
}

function isLiveMode(): boolean {
  return !!(process.env.ASANA_ACCESS_TOKEN && process.env.ASANA_WORKSPACE_GID);
}

function templateMap(): Record<string, string> {
  try { return JSON.parse(process.env.ASANA_TEMPLATE_GID_MAP ?? '{}'); }
  catch { return {}; }
}

/**
 * Mock Asana gid — 16 digits like the real thing.
 */
function mockProjectGid(): string {
  const gid = Math.floor(Math.random() * 9e15) + 1e15;
  return gid.toString();
}

export async function createEngagementProject(input: CreateProjectInput): Promise<CreateProjectResult> {
  const projectName = input.clientCompany
    ? `${input.clientCompany} — ${input.serviceName}`
    : `${input.clientName} — ${input.serviceName}`;

  if (!isLiveMode()) {
    const gid = mockProjectGid();
    console.log(`[asana/MOCK] would create project "${projectName}" → ${gid}`);
    return {
      projectId: gid,
      projectUrl: `https://app.asana.com/0/${gid} (mock — not a real URL)`,
      status: 'mock',
      notes: 'MOCK_MODE — set ASANA_* env vars to enable real project creation',
    };
  }

  // LIVE MODE
  const templates = templateMap();
  const templateGid = templates[input.serviceSlug];
  if (!templateGid) {
    console.warn(`[asana] No template gid mapped for service slug "${input.serviceSlug}". Configure ASANA_TEMPLATE_GID_MAP.`);
    return {
      projectId: '',
      status: 'no_template',
      notes: `No Asana project template configured for service "${input.serviceSlug}". Add to ASANA_TEMPLATE_GID_MAP env var.`,
    };
  }

  // Placeholder. Real implementation would use the @asana/asana SDK or fetch:
  //   POST {base}/project_templates/{templateGid}/instantiateProject
  //   body: { workspace, name, public: false }
  // and poll the returned job until complete to get the project gid.
  console.warn('[asana] LIVE mode flagged but no real implementation yet. Returning failure.');
  return {
    projectId: '',
    status: 'failed',
    notes: 'LIVE_MODE not yet implemented. Use @asana/asana SDK and call instantiateProject endpoint here.',
  };
}
