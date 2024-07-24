import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserInfo from '../UserInfo';
import moment from 'moment';

jest.mock('moment', () => {
  return () => ({ fromNow: jest.fn(() => 'a few seconds ago') });
});


jest.mock('../../icons/Comment', () => () => <svg data-testid="comment-icon" />);

describe('UserInfo Component', () => {
  const currentUser = { name: 'Current User' };
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders correctly with question prop', () => {
    const question = {
      author: { name: 'Author Name', profileImage: 'author-profile.png' },
      createdAt: '2023-07-11T06:05:03.538Z',
      replies: [],
    };

    render(
      <UserInfo
        openId={[]}
        index={0}
        setOpenId={jest.fn()}
        question={question}
        answer={null}
        isFavourite={false}
        onClick={jest.fn()}
      />
    );

    expect(screen.getByText('posted by')).toBeInTheDocument();
    expect(screen.getByText('Author Name')).toBeInTheDocument();
    expect(screen.getByText('a few seconds ago')).toBeInTheDocument();
    expect(screen.getByAltText('profile')).toHaveAttribute('src', 'author-profile.png');
  });

  test('renders correctly with answer prop', () => {
    const answer = {
      author: { name: 'Answer Author', profileImage: 'answer-profile.png' },
      createdAt: '2023-07-11T06:05:03.538Z',
      replies: [],
    };

    render(
      <UserInfo
        openId={[]}
        index={0}
        setOpenId={jest.fn()}
        question={null}
        answer={answer}
        isFavourite={false}
        onClick={jest.fn()}
      />
    );

    expect(screen.getByText('answered by')).toBeInTheDocument();
    expect(screen.getByText('Answer Author')).toBeInTheDocument();
    expect(screen.getByText('a few seconds ago')).toBeInTheDocument();
    expect(screen.getByAltText('profile')).toHaveAttribute('src', 'answer-profile.png');
  });

  test('toggles comments on click', () => {
    const question = {
      author: { name: 'Author Name', profileImage: 'author-profile.png' },
      createdAt: '2023-07-11T06:05:03.538Z',
      replies: [],
    };
    const setOpenId = jest.fn();
    const openId = [];

    render(
      <UserInfo
        openId={openId}
        index={0}
        setOpenId={setOpenId}
        question={question}
        answer={null}
        isFavourite={false}
        onClick={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('comment-icon'));
    expect(setOpenId).toHaveBeenCalledWith([0]);
  });
});
