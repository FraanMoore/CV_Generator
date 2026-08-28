
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, test } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from '../Home';
import type { RootLayoutContext } from '../../utils/RootLayout';

const Layout = () => {
    const context: RootLayoutContext = {
        applications: [],
        refreshApplications: async () => {},
    };
    return <Outlet context={context} />;
};

const renderHome = () => {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: <Layout />,
                children: [{ index: true, element: <Home /> }],
            },
        ],
        { initialEntries: ['/'] }
    );
    return render(<RouterProvider router={router} />);
};

test('it renders', async () => {
    renderHome();
    const titles = await screen.findByTestId(/home-page/i);
    expect(titles).toBeInTheDocument();
});

test('it is accessible', async () => {
    const { container } = renderHome();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
