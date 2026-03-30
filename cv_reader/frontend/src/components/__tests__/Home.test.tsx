
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import Home from '../Home';

test('it renders', async () => {
    render(<Home />);
    const titles = await screen.findByTestId(/home-page/i);
    expect(titles).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
