import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../src/context/AuthContext';
import NavBar from '../../src/components/NavBar';

// Mock useLogout hook
jest.mock('../../src/hooks/useLogout', () => ({
  useLogout: () => ({
    logout: jest.fn(),
  }),
}));

const renderNavBar = (user = null) => {
  return render(
    <AuthContext.Provider value={{ user }}>
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('NavBar', () => {
  it('renders login and signup links when not logged in', () => {
    renderNavBar(null);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  it('renders user email and logout when logged in', () => {
    renderNavBar({ email: 'test@example.com' });
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('renders app title', () => {
    renderNavBar();
    expect(screen.getByText('The Diary App')).toBeInTheDocument();
  });
});
