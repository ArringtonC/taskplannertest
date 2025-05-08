import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders main app container', () => {
  render(<App />);
  expect(screen.getByTestId('app-container')).toBeInTheDocument();
});
