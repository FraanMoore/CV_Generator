import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import MoreDetailsDialog, { type MoreDetailsDialogProps } from '../MoreDetailsDialog';


const TestComponent = (props: Partial<MoreDetailsDialogProps>) => {
    return (
        <MoreDetailsDialog
            open={true}
            onClose={() => { }}
            jobDescription="Default job description"
            must_Words="must, words"
            nice_Words="nice, words"
            notes="Some notes"
            {...props}
        />
    );
};


test('it renders', async () => {
    render(<TestComponent />);
    const titles = await screen.findByText('Job Details');
    expect(titles).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});