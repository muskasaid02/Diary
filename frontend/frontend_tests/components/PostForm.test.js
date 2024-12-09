import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostsContext } from '../../src/context/PostsContext';
import { AuthContext } from '../../src/context/AuthContext';
import PostForm from '../../src/components/PostForm';

const mockDispatch = jest.fn();
const mockUser = {
  token: 'test-token'
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
    global.fetch = jest.fn();
    mockDispatch.mockClear();
  });

  it('renders form fields', () => {
    renderPostForm();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ _id: '123', title: 'Test Post' })
    });

    renderPostForm();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Post' }
    });
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-12-08' }
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Test content' }
    });

    fireEvent.click(screen.getByText(/post/i));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CREATE_POST',
        payload: expect.any(Object)
      });
    });
  });

  it('shows validation errors for empty fields', async () => {
    renderPostForm();
    fireEvent.click(screen.getByText(/post/i));
    
    await waitFor(() => {
      expect(screen.getByText(/required field/i)).toBeInTheDocument();
    });
  });
});
