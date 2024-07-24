import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Chat from '../../pages/Chat'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { socket } from '../../App';
import React from 'react';

jest.mock('../../App', () => ({
  socket: {
    on: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    auth: {},
  },
}));

const mockStore = configureStore([]);

describe('Chat Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      online: { onlineUsers: [] },
    });
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({
      _id: '123',
      name: 'Test User',
      profileImage: 'https://example.com/profile.jpg'
    }));
  });

  test('renders Chat component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Chat />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText('Write a comment')).toBeInTheDocument();
    expect(screen.getByText('Online Users')).toBeInTheDocument();
  });

  test('changes room and triggers socket event', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Chat />
        </BrowserRouter>
      </Provider>
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'Fan Theories' } });

    expect(screen.getByRole('option', { name: 'Fan Theories' }).selected).toBe(true);
    expect(socket.emit).toHaveBeenCalledWith('join-room', { room: 'Fan Theories', user: JSON.parse(localStorage.getItem('user')) });
  });
  
//happy path
  test('sends message and triggers socket event', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Chat />
        </BrowserRouter>
      </Provider>
    );

    const messageInput = screen.getByPlaceholderText('Write a comment');
    const sendButton = screen.getByLabelText('send message');

    fireEvent.change(messageInput, { target: { value: 'Hello World' } });
    fireEvent.click(sendButton);

    expect(socket.emit).toHaveBeenCalledWith('send-message', {
      message: 'Hello World',
      room: 'Netflix Hits',
      user: JSON.parse(localStorage.getItem('user')),
    });
    expect(messageInput.value).toBe('');
  });
});
