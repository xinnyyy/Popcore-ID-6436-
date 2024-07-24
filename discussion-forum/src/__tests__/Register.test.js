import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';
import { Toaster } from 'react-hot-toast';

// Mock axios and localStorage
jest.mock('axios');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock process.env.REACT_APP_BACKEND_URL
process.env.REACT_APP_BACKEND_URL = 'http://localhost:5000';

// Mock the image import
jest.mock('../../assets/popcorn.jpeg', () => 'test-file-stub');

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('handles successful user registration', async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { message: 'User created successfully' },
    });
  
    render(
      <BrowserRouter>
        <Register />
        <Toaster />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText(/Confirm Password/i)[0], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/signup`,
        {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          profileImage: 'https://t4.ftcdn.net/jpg/00/84/67/19/360_F_84671939_jxymoYZO8Oeacc3JRBDE8bSXBWj0ZfA9.jpg',
        }
      );
    });
  });
  
  test('handles password mismatch', async () => {
    render(
      <BrowserRouter>
        <Register />
        <Toaster />
      </BrowserRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText(/Confirm Password/i)[0], { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
        const errorMessages = screen.getAllByText(/Password and Confirm Password do not match/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });

    expect(axios.post).not.toHaveBeenCalled();
  });

  test('handles network error during registration', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <BrowserRouter>
        <Register />
        <Toaster />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText(/Confirm Password/i)[0], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/signup`,
        {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          profileImage: 'https://t4.ftcdn.net/jpg/00/84/67/19/360_F_84671939_jxymoYZO8Oeacc3JRBDE8bSXBWj0ZfA9.jpg',
        }
      );
    });

    await waitFor(() => {
        const errorMessages = screen.getAllByText(/Something went wrong/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });

  });
});
