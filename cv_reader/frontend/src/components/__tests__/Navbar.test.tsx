
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import Navbar from "../Navbar";

test('it renders', () => {
    render(<Navbar />);
    const titles = screen.getAllByText(/cv generator/i);
    expect(titles).toHaveLength(2);
});

test('it is accessible', async () => {
    const { container } = render(<Navbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
