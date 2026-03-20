import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import NewEntryDialog from "../NewEntryDialog";

test('it renders', async () => {
    render(<NewEntryDialog open onClose={() => { }} onCreate={() => { }} />);
    const titles = await screen.findByText('New Entry');
    expect(titles).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = render(<NewEntryDialog open onClose={() => { }} onCreate={() => { }} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});