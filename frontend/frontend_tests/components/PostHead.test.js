import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PostsContext } from '../../src/context/PostsContext';
import { AuthContext } from '../../src/context/AuthContext';
import PostHead from '../../src/components/PostHead';

const mockPost = {
  _id: '123',
  title: 'Test Post',
  content: 'Test content',
  date: '2024-12-08'
};

const mockDispatch = jest.fn();
const mockUser = { token: 'test-token' };

const renderPostHead = () => {
  return render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <PostsContext.Provider value={{ dispatch: mockDispatch }}>
        <BrowserRouter>
          <PostHead post={mockPost} />
        </BrowserRouter>
      </PostsContext.Provider>
    </AuthContext.Provider>
  );
};

describe('PostHead', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockDispatch.mockClear();
  });

  it('renders post details', () => {
    renderPostHead();
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(/December 8, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Test content/)).toBeInTheDocument();
  });

  it('handles delete click', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Deleted' })
    });

    renderPostHead();
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/posts/123'),
      expect.any(Object)
    );
  });

  it('navigates to post detail on title click', () => {
    renderPostHead();
    const titleLink = screen.getByText(mockPost.title);
    expect(titleLink.closest('a')).toHaveAttribute(
      'href',
      `/api/posts/${mockPost._id}`
    );
  });
});