
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrowserRouter as Router } from 'react-router-dom';
import { expect, test } from 'vitest';
import Navbar from "../Navbar";

test('it renders', async () => {
    render(<Router><Navbar /></Router>);
    const titles = await screen.findByTestId('navbar');
    expect(titles).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = render(<Router><Navbar /></Router>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
