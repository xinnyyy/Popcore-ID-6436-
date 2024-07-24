import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { Toaster } from 'react-hot-toast';

// Mock axios and localStorage
jest.mock('axios');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

process.env.REACT_APP_BACKEND_URL = 'http://localhost:5000';

// Mock the image import
jest.mock('../../assets/popcorn.jpeg', () => 'test-file-stub');

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock localStorage.setItem
    jest.spyOn(Storage.prototype, 'setItem');
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\? Register/i)).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { _id: '1234', name: 'Test User' },
    });

    render(
      <BrowserRouter>
        <Login />
        <Toaster />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ _id: '1234', name: 'Test User' })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
      const successMessages = screen.getAllByText(/Logged in successfully/i);
      successMessages.forEach(message => {
        expect(message).toBeInTheDocument();
      });
    });
  });

  test('handles login failure due to incorrect credentials', async () => {
    axios.post.mockResolvedValueOnce({
      status: 401,
      data: { message: 'User does not exist' },
    });

    render(
      <BrowserRouter>
        <Login />
        <Toaster />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email: 'wrong@example.com',
          password: 'wrongpassword',
        }
      );
    });

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/User does not exist/i);
      expect(errorMessages).toHaveLength(2);
      expect(errorMessages[0]).toBeInTheDocument();
    });
  });

  test('handles login failure due to server error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <BrowserRouter>
        <Login />
        <Toaster />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Something went wrong, please try again!/i);
      expect(errorMessages).toHaveLength(2);
      expect(errorMessages[0]).toBeInTheDocument();
    });
  });
});
