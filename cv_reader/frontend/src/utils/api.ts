export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export type Application = {
  id: number;
  timestamp: string;
  company: string;
  role: string;
  job_url: string;
  status?: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft';
  notes?: string;
  must_keywords?: string;
  nice_keywords?: string;
  output_dir?: string;
  job_description?: string;
};

export type UploadJobPayload = {
  company: string;
  role: string;
  lang?: 'es' | 'en' | 'both';
  job_url?: string;
  ai?: boolean;
  ai_model?: string;
  job_text?: string;
  status?: Application['status'];
  notes?: string;
};

export type ApplicationFile = {
  name: string;
  path: string;
  size: number;
};

export async function fetchApplications(): Promise<Application[]> {
  const res = await fetch(`${BASE_URL}/applications`);
  if (!res.ok) {
    throw new Error('Error fetching applications');
  }
  return res.json();
}

export async function fetchApplication(id: number): Promise<Application> {
  const res = await fetch(`${BASE_URL}/applications/${id}`);
  if (!res.ok) {
    throw new Error('Error fetching application');
  }
  return res.json();
}

export async function uploadJobText(payload: UploadJobPayload) {
  const formData = new FormData();
  formData.append('company', payload.company);
  formData.append('role', payload.role);
  formData.append('lang', payload.lang ?? 'both');
  formData.append('job_url', payload.job_url ?? '');
  formData.append('ai', String(payload.ai ?? true));
  formData.append('ai_model', payload.ai_model ?? 'gpt-4.1-mini');
  if (payload.job_text) {
    formData.append('job_text', payload.job_text);
  }
  if (payload.status) {
    formData.append('status', payload.status);
  }
  if (payload.notes) {
    formData.append('notes', payload.notes);
  }

  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error generating application');
  }

  return res.json();
}

export async function fetchApplicationDescription(id: number): Promise<string> {
  const res = await fetch(`${BASE_URL}/applications/${id}/description`);
  if (!res.ok) {
    throw new Error('Error fetching job description');
  }
  const data = await res.json();
  return data.job_description;
}

export async function updateApplication(
  id: number,
  data: Partial<Pick<Application, 'company' | 'role' | 'job_url' | 'status' | 'notes'>>
): Promise<Application> {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Error updating application');
  }
  return res.json();
}

export async function deleteApplication(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error deleting application');
  }
}

export async function createApplication(
  data: Omit<Application, 'id' | 'timestamp'>
): Promise<Application> {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error creating application');
  }
  return res.json();
}

export async function fetchApplicationFiles(appId: number): Promise<ApplicationFile[]> {
  const res = await fetch(`${BASE_URL}/applications/${appId}/files`);
  if (!res.ok) {
    throw new Error('Error fetching application files');
  }
  const data = await res.json();
  return data.files ?? [];
}