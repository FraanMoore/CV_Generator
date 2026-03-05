const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export type Application = {
  id: number;
  timestamp: string;
  company: string;
  role: string;
  job_url: string;
  status?: string;
  notes?: string;
  output_dir?: string;
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

export type UploadJobPayload = {
  company: string;
  role: string;
  lang?: 'es' | 'en' | 'both';
  job_url?: string;
  ai?: boolean;
  ai_model?: string;
  job_text?: string;
};

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
