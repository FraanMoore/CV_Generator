
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import DownloadDialog from '../DownloadDialog';


test('it renders', async () => {
    render(<DownloadDialog id={1} open onClose={() => { }} />);
    const titles = await screen.findByText(/Files to Download/i);
    expect(titles).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = render(<DownloadDialog id={1} open onClose={() => { }} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
