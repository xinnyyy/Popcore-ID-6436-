// src/components/__tests__/Write.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Write from '../Write';
import '@testing-library/jest-dom/extend-expect';

describe('Write Component', () => {
  test('submits a comment', () => {
    const mockOnSubmit = jest.fn();

    render(<Write onSubmit={mockOnSubmit} placeholder="Write a comment" />);

    fireEvent.change(screen.getByPlaceholderText('Write a comment'), {
      target: { value: 'Test Comment' },
    });

    fireEvent.click(screen.getByText('Submit'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Comment');
    expect(screen.getByPlaceholderText('Write a comment')).toHaveValue('');
  });
});
