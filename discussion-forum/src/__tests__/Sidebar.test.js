// discussion-forum/src/components/__tests__/Sidebar.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Sidebar';
import { toggle } from '../../context/sidebarSlice';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../context/sidebarSlice', () => ({
  toggle: jest.fn(),
}));

describe('Sidebar Component', () => {
  const navigate = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigate);
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation(callback => callback({ sidebar: { open: true } }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when open', () => {
    const { getByText, queryByText } = render(<Sidebar />);

    expect(getByText('HOME')).toBeInTheDocument();
    expect(getByText('EXPLORE TOPICS')).toBeInTheDocument();
    expect(getByText('CHAT')).toBeInTheDocument();
    expect(getByText('MY QNA')).toBeInTheDocument();
  });

  test('navigates correctly when menu items are clicked', () => {
    const { getByText } = render(<Sidebar />);

    fireEvent.click(getByText('HOME'));
    expect(navigate).toHaveBeenCalledWith('/');

    fireEvent.click(getByText('EXPLORE TOPICS'));
    expect(navigate).toHaveBeenCalledWith('/explore');

    fireEvent.click(getByText('CHAT'));
    expect(navigate).toHaveBeenCalledWith('/chat');

    fireEvent.click(getByText('MY QNA'));
    expect(navigate).toHaveBeenCalledWith('/myqna');
  });

  test('dispatches toggle action and navigates to ask page when "Ask a Question" is clicked', () => {
    useSelector.mockImplementation(callback => callback({ sidebar: { open: true } }));
    const { getByText } = render(<Sidebar />);

    const askButton = getByText('Ask a Question');
    fireEvent.click(askButton);

    expect(navigate).toHaveBeenCalledWith('/ask');
    expect(dispatch).toHaveBeenCalledWith(toggle());
  });
});
