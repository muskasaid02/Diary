import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostsContext } from '../../src/context/PostsContext';
import { AuthContext } from '../../src/context/AuthContext';
import PostForm from '../../src/components/PostForm';

const mockDispatch = jest.fn();
const mockUser = {
  token: 'test-token',
};

const renderPostForm = () => {
  return render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <PostsContext.Provider value={{ dispatch: mockDispatch }}>
        <PostForm />
      </PostsContext.Provider>
    </AuthContext.Provider>
  );
};

describe('PostForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // Mock the fetch API
    mockDispatch.mockClear(); // Reset the dispatch mock
  });

  it('renders form fields', () => {
    renderPostForm();
    // Check that all form fields are rendered
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderPostForm();

    // Click the submit button without filling in the form
    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    // Wait for validation messages to appear
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/content is required/i)).toBeInTheDocument();
    });
  });
});
