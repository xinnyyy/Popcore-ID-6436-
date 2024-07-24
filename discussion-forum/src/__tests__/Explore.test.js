// /Users/xinyiho/Documents/orbital/discussion-forum/src/components/__tests__/Explore.test.js

import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Explore from '../../pages/Explore'; // Corrected relative path

const discussionTopics = [
  "Netflix Hits",
  "What to Watch Next",
  "Behind the Scenes",
  "Fan Theories",
  "Character Analysis",
  "Show Reviews",
  "Show Comparisons",
  "Underrated Gems",
  "Romance",
  "Comedy",
  "Thriller / Mystery",
  "Action / Adventure",
  "Fantasy / SciFi",
  "Kdrama",
  "HBO Shows",
  "Netflix Originals",
  "Sitcoms",
  "Cdramas",
  "Jdramas",
  "Reality TV",
  "Reviews",
  "Movies",
];

const mockPosts = [
  {
    _id: '1',
    question: 'What is your favorite Netflix show?',
    description: 'I love Stranger Things. What about you?',
    upvote: [1, 2, 3],
    author: { profileImage: '', name: 'User1' },
    createdAt: '2023-01-01T00:00:00.000Z',
    replies: [
      {
        _id: '101',
        reply: 'I love Stranger Things too!',
        author: { profileImage: '', name: 'User2' },
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    ],
  },
];

// Mock axios
jest.mock('axios');

// Mock environment variable
process.env.REACT_APP_BACKEND_URL = 'http://localhost:5000';

// Mock console.error
console.error = jest.fn();

// Mock localStorage
const mockUser = {
  _id: '1234',
  name: 'Test User',
  email: 'test@example.com',
  profileImage: 'https://example.com/profile.jpg',
};
localStorage.setItem('user', JSON.stringify(mockUser));

describe('Explore Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders topic buttons', () => {
    render(<Explore />);
    discussionTopics.forEach((topic) => {
      expect(screen.getByText(topic)).toBeInTheDocument();
    });
  });

  test('fetches and displays posts on topic click', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPosts });

    render(<Explore />);

    await act(async () => {
      fireEvent.click(screen.getByText('Netflix Hits'));
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/find/Netflix%20Hits`
      );
    });

    expect(screen.getByText('What is your favorite Netflix show?')).toBeInTheDocument();
    expect(screen.getByText('I love Stranger Things. What about you?')).toBeInTheDocument();
    expect(screen.getByText('I love Stranger Things too!')).toBeInTheDocument();
  });

  test('displays message when no posts are available', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Explore />);

    await act(async () => {
      fireEvent.click(screen.getByText('Netflix Hits'));
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/find/Netflix%20Hits`
      );
    });

    expect(screen.getByText('No posts available for this topic.')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    const error = new Error('API Error');
    axios.get.mockRejectedValueOnce(error);

    render(<Explore />);

    await act(async () => {
      fireEvent.click(screen.getByText('Netflix Hits'));
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/find/Netflix%20Hits`
      );
    });

    expect(console.error).toHaveBeenCalledWith('Error fetching posts:', error);
  });
});
