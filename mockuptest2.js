import { fireEvent, screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import UserProfileManagement from './user-profile-management';

describe('UserProfileManagement', () => {
  let userProfileManagement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="profile-info"></div>
      <div id="live-announcer" aria-live="polite"></div>
    `;
    userProfileManagement = new UserProfileManagement();
  });

  test('renders initial user profile information', () => {
    expect(screen.getByText('Name: Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: jane.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Phone: +9876543210')).toBeInTheDocument();
    expect(screen.getByText('Subscription: Premium')).toBeInTheDocument();
  });

  test('toggles edit mode when edit button is clicked', () => {
    const editButton = screen.getByLabelText('Edit Profile');
    fireEvent.click(editButton);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
  });

  test('validates form fields on submit', async () => {
    const editButton = screen.getByLabelText('Edit Profile');
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  test('successfully updates user profile', async () => {
    const editButton = screen.getByLabelText('Edit Profile');
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Phone');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });

    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Phone: +1234567890')).toBeInTheDocument();
    });

    const announcer = screen.getByText('Profile successfully updated');
    expect(announcer).toBeInTheDocument();
  });

  test('cancels edit mode without saving changes', () => {
    const editButton = screen.getByLabelText('Edit Profile');
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Name: Jane Doe')).toBeInTheDocument();
  });

  test('handles form submission errors', async () => {
    // Mock failed API call
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    const editButton = screen.getByLabelText('Edit Profile');
    fireEvent.click(editButton);

    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update profile. Please try again.')).toBeInTheDocument();
    });
  });

  test('maintains focus management', () => {
    const editButton = screen.getByLabelText('Edit Profile');
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText('Name');
    expect(document.activeElement).toBe(nameInput);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(document.activeElement).toBe(editButton);
  });
});