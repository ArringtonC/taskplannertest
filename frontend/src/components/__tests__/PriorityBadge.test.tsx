import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { PriorityBadge } from '../PriorityBadge';

describe('PriorityBadge', () => {
  it('applies correct color class for high priority', () => {
    const { container } = render(<PriorityBadge priority="high" />);
    expect(container.firstChild).toHaveClass('bg-red-100');
    expect(container.firstChild).toHaveClass('text-red-800');
  });

  it('applies correct color class for medium priority', () => {
    const { container } = render(<PriorityBadge priority="medium" />);
    expect(container.firstChild).toHaveClass('bg-yellow-100');
    expect(container.firstChild).toHaveClass('text-yellow-800');
  });

  it('applies correct color class for low priority', () => {
    const { container } = render(<PriorityBadge priority="low" />);
    expect(container.firstChild).toHaveClass('bg-green-100');
    expect(container.firstChild).toHaveClass('text-green-800');
  });

  it('logs the class list for high priority', () => {
    const { container } = render(<PriorityBadge priority="high" />);
    // @ts-ignore
    console.log('High priority classList:', container.firstChild && container.firstChild.className);
  });
}); 