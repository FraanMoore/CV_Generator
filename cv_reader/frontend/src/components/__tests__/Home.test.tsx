
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import Home from '../Home';

test('it renders', () => {
    render(<Home />);
    const titles = screen.getAllByText(/cv generator/i);
    expect(titles).toHaveLength(2);
});

test('it is accessible', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
