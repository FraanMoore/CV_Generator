import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import EditDialog, { type EditDialogProps } from '../EditDialog';


const TestComponent = (props: Partial<EditDialogProps>) => {
    return (
        <EditDialog
            application={{
                id: 1,
                company: 'Default Company',
                role: 'Default Role',
                job_url: 'http://example.com',
                status: 'applied',
                notes: 'Some notes',
                timestamp: new Date().toISOString(),
            }}
            open
            onClose={() => { }}
            onEdit={() => { }}
            {...props}
        />
    );
};


test('it renders', async () => {
    render(<TestComponent />);
    const titles = await screen.findByText('Edit postulation');
    expect(titles).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});