
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import PostulationCard, { type PostulationCardProps } from '../PostulationCard';

const TestComponent = (props: Partial<PostulationCardProps>) => {
    return (
        <PostulationCard
            company="Default Company"
            role="Default Role"
            jobURL="https://example.com"
            status="applied"
            notes="No notes available"
            {...props}
        />
    );
};

test('it renders', () => {
    render(<TestComponent />);
    const company = screen.getByText(/default company/i);
    expect(company).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
