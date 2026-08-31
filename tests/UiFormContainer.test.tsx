// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiFormContainer, FormField } from '../dedicated/UiFormContainer';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiFormContainer', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders form title, subtitle, and submit button with defaults', async () => {
    const root = createRoot(container);
    root.render(
      <UiFormContainer
        title="Test Form"
        subTitle="Please fill out this form"
        submitLabel="Send Form"
      />
    );
    await waitForUpdate();

    const titleEl = container.querySelector('h2');
    expect(titleEl).not.toBeNull();
    expect(titleEl?.textContent).toBe('Test Form');

    const subTitleEl = container.querySelector('p');
    expect(subTitleEl).not.toBeNull();
    expect(subTitleEl?.textContent).toBe('Please fill out this form');

    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn).not.toBeNull();
    expect(submitBtn?.textContent).toBe('Send Form');
  });

  it('renders default submit button label when submitLabel is not provided', async () => {
    const root = createRoot(container);
    root.render(<UiFormContainer />);
    await waitForUpdate();

    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn?.textContent).toBe('Submit');
  });

  it('renders form with actionUrl and method', async () => {
    const root = createRoot(container);
    root.render(<UiFormContainer actionUrl="/api/v1/submit" method="POST" />);
    await waitForUpdate();

    const formEl = container.querySelector('form');
    expect(formEl).not.toBeNull();
    expect(formEl?.getAttribute('action')).toBe('/api/v1/submit');
    expect(formEl?.getAttribute('method')).toBe('POST');
  });

  it('renders hidden inputs properly', async () => {
    const hiddenInputs = {
      csrf_token: 'abc123token',
      target_id: '42',
    };

    const root = createRoot(container);
    root.render(<UiFormContainer hiddenInputs={hiddenInputs} />);
    await waitForUpdate();

    const hidden1 = container.querySelector('input[type="hidden"][name="csrf_token"]') as HTMLInputElement;
    const hidden2 = container.querySelector('input[type="hidden"][name="target_id"]') as HTMLInputElement;

    expect(hidden1).not.toBeNull();
    expect(hidden1?.value).toBe('abc123token');
    expect(hidden2).not.toBeNull();
    expect(hidden2?.value).toBe('42');
  });

  it('renders text, email, number, and password fields correctly with required indicator', async () => {
    const fields: FormField[] = [
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter username', defaultValue: 'john_doe', required: true },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: false },
      { id: 'age', label: 'Age', type: 'number', defaultValue: '25' },
      { id: 'password', label: 'Password', type: 'password' },
    ];

    const root = createRoot(container);
    root.render(<UiFormContainer fields={fields} />);
    await waitForUpdate();

    // Username input
    const usernameInput = container.querySelector('input#username') as HTMLInputElement;
    expect(usernameInput).not.toBeNull();
    expect(usernameInput?.type).toBe('text');
    expect(usernameInput?.placeholder).toBe('Enter username');
    expect(usernameInput?.value).toBe('john_doe');
    expect(usernameInput?.required).toBe(true);

    const usernameLabel = container.querySelector('label[for="username"]');
    expect(usernameLabel?.textContent).toContain('Username');
    expect(usernameLabel?.querySelector('span')?.textContent).toBe('*');

    // Email input
    const emailInput = container.querySelector('input#email') as HTMLInputElement;
    expect(emailInput?.type).toBe('email');
    expect(emailInput?.placeholder).toBe('name@example.com');
    expect(emailInput?.required).toBe(false);

    // Number input
    const ageInput = container.querySelector('input#age') as HTMLInputElement;
    expect(ageInput?.type).toBe('number');
    expect(ageInput?.value).toBe('25');

    // Password input
    const passwordInput = container.querySelector('input#password') as HTMLInputElement;
    expect(passwordInput?.type).toBe('password');
  });

  it('renders textarea, select, and checkbox fields correctly', async () => {
    const fields: FormField[] = [
      {
        id: 'bio',
        label: 'Biography',
        type: 'textarea',
        placeholder: 'Write about yourself...',
        defaultValue: 'Initial bio text',
        required: true,
      },
      {
        id: 'role',
        label: 'Role',
        type: 'select',
        defaultValue: 'editor',
        options: [
          { label: 'Viewer', value: 'viewer' },
          { label: 'Editor', value: 'editor' },
          { label: 'Admin', value: 'admin' },
        ],
      },
      {
        id: 'agreeTerms',
        label: 'I accept terms and conditions',
        type: 'checkbox',
        defaultValue: true,
      },
    ];

    const root = createRoot(container);
    root.render(<UiFormContainer fields={fields} />);
    await waitForUpdate();

    // Textarea
    const textarea = container.querySelector('textarea#bio') as HTMLTextAreaElement;
    expect(textarea).not.toBeNull();
    expect(textarea?.name).toBe('bio');
    expect(textarea?.placeholder).toBe('Write about yourself...');
    expect(textarea?.value).toBe('Initial bio text');
    expect(textarea?.required).toBe(true);

    // Select
    const select = container.querySelector('select#role') as HTMLSelectElement;
    expect(select).not.toBeNull();
    expect(select?.name).toBe('role');
    expect(select?.value).toBe('editor');
    const options = select.querySelectorAll('option');
    expect(options.length).toBe(3);
    expect(options[0].value).toBe('viewer');
    expect(options[0].textContent).toBe('Viewer');
    expect(options[1].value).toBe('editor');
    expect(options[1].textContent).toBe('Editor');
    expect(options[2].value).toBe('admin');
    expect(options[2].textContent).toBe('Admin');

    // Checkbox
    const checkbox = container.querySelector('input#agreeTerms') as HTMLInputElement;
    expect(checkbox).not.toBeNull();
    expect(checkbox?.type).toBe('checkbox');
    expect(checkbox?.name).toBe('agreeTerms');
    expect(checkbox?.checked).toBe(true);

    // Checkbox label wraps input
    const checkboxLabel = checkbox.closest('label');
    expect(checkboxLabel?.textContent).toContain('I accept terms and conditions');
  });

  it('renders children elements inside form', async () => {
    const root = createRoot(container);
    root.render(
      <UiFormContainer>
        <div id="custom-child">Custom Content</div>
      </UiFormContainer>
    );
    await waitForUpdate();

    const customChild = container.querySelector('#custom-child');
    expect(customChild).not.toBeNull();
    expect(customChild?.textContent).toBe('Custom Content');
  });

  it('applies custom className and style props to container', async () => {
    const root = createRoot(container);
    root.render(
      <UiFormContainer
        className="custom-form-class"
        style={{ maxWidth: '800px', opacity: 0.9 }}
      />
    );
    await waitForUpdate();

    const formContainer = container.querySelector('.spm-form-container') as HTMLDivElement;
    expect(formContainer).not.toBeNull();
    expect(formContainer.classList.contains('custom-form-class')).toBe(true);
    expect(formContainer.style.maxWidth).toBe('800px');
    expect(formContainer.style.opacity).toBe('0.9');
  });

  it('renders multi-tab form switcher and dynamically updates active form tab state', async () => {
    const tabs = [
      {
        id: 'login',
        label: 'Login',
        title: 'Login to Account',
        subTitle: 'Welcome back!',
        submitLabel: 'Log In',
        actionUrl: '/login',
      },
      {
        id: 'register',
        label: 'Create Account',
        title: 'Join Us',
        subTitle: 'Create new account',
        submitLabel: 'Create Account',
        actionUrl: '/register',
      },
    ];

    const root = createRoot(container);
    root.render(<UiFormContainer tabs={tabs} activeTabId="login" />);
    await waitForUpdate();

    // Verify initial tab (Login)
    const titleEl = container.querySelector('h2');
    expect(titleEl?.textContent).toBe('Login to Account');

    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn?.textContent).toBe('Log In');

    const formEl = container.querySelector('form');
    expect(formEl?.getAttribute('action')).toBe('/login');

    // Click tab 2 (Create Account)
    const tabButtons = container.querySelectorAll('.spm-form-tabs button');
    expect(tabButtons.length).toBe(2);
    expect(tabButtons[1].textContent).toBe('Create Account');

    (tabButtons[1] as HTMLButtonElement).click();
    await waitForUpdate();

    // Verify active tab updated to Create Account
    expect(container.querySelector('h2')?.textContent).toBe('Join Us');
    expect(container.querySelector('button[type="submit"]')?.textContent).toBe('Create Account');
    expect(container.querySelector('form')?.getAttribute('action')).toBe('/register');
  });
});
