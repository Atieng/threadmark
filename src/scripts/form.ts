// Early-access form logic.
// Swap out submitForm() to wire in a real backend.

interface FormData {
  email: string;
  company: string;
  teamSize: string;
  interests: string[];
}

function validate(data: FormData): string | null {
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Please enter a valid work email address.';
  }
  if (!data.company.trim()) {
    return 'Please enter your company name.';
  }
  if (!data.teamSize) {
    return 'Please select your team size.';
  }
  return null;
}

// Replace this function body to send data to a real backend.
async function submitForm(_data: FormData): Promise<{ ok: boolean }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ok: true };
}

export function initForm(formSelector = '[data-early-access-form]'): void {
  const form = document.querySelector<HTMLFormElement>(formSelector);
  if (!form) return;

  const successEl = document.querySelector<HTMLElement>('[data-form-success]');
  const errorEl = document.querySelector<HTMLElement>('[data-form-error]');
  const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (errorEl) errorEl.hidden = true;

    const data: FormData = {
      email: (form.querySelector<HTMLInputElement>('[name="email"]')?.value ?? '').trim(),
      company: (form.querySelector<HTMLInputElement>('[name="company"]')?.value ?? '').trim(),
      teamSize: form.querySelector<HTMLSelectElement>('[name="team_size"]')?.value ?? '',
      interests: Array.from(form.querySelectorAll<HTMLInputElement>('[name="interest"]:checked')).map(
        (cb) => cb.value
      ),
    };

    const error = validate(data);
    if (error) {
      if (errorEl) {
        errorEl.textContent = error;
        errorEl.hidden = false;
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const result = await submitForm(data);
      if (result.ok) {
        form.hidden = true;
        if (successEl) successEl.hidden = false;
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      if (errorEl) {
        errorEl.textContent = 'Something went wrong. Please try again.';
        errorEl.hidden = false;
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join early access';
      }
    }
  });
}
