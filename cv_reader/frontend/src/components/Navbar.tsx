import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { default as List, default as ListItem } from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { useLayout } from '../hooks/useLayout';
import BaseTypography from '../utils/BaseTypography';
import NewEntryDialog, { NewEntryButton, type NewEntryData } from './NewEntryDialog';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    onCreateEntry?: (data: NewEntryData) => void;
}

const drawerWidth = '100%';
const navItems = ['Home', 'Postulations', 'New Entry'];

const Navbar = (props: Props) => {
    const { window, onCreateEntry } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [newEntryOpen, setNewEntryOpen] = useState(false);
    const { isMobile } = useLayout();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleOpenNewEntry = () => setNewEntryOpen(true);
    const handleCloseNewEntry = () => setNewEntryOpen(false);

    const handleCreateNewEntry = (data: NewEntryData) => {
        onCreateEntry?.(data);
        setNewEntryOpen(false);
    };

    const drawer = (
        <DrawerContainer onClick={handleDrawerToggle}>
            <DrawerTitle>
                CV Generator
            </DrawerTitle>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <DrawerListItemButton>
                            <ListItemText primary={item} />
                        </DrawerListItemButton>
                    </ListItem>
                ))}
            </List>
        </DrawerContainer>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Container >
            <CssBaseline />
            <StyledAppBar>
                <Toolbar>
                    <StyledIconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        $isMobile={isMobile}
                    >
                        <MenuIcon />
                    </StyledIconButton>
                    <Title
                        $isMobile={isMobile}
                    >
                        CV Generator
                    </Title>
                    <ButtonBox $isMobile={isMobile}>
                        {navItems.map((item) => (
                            item === 'New Entry' ? (
                                <NewEntryButton key={item} onClick={handleOpenNewEntry}>
                                    {item}
                                </NewEntryButton>
                            ) : (
                                <StyledButton key={item}>
                                    {item}
                                </StyledButton>
                            )
                        ))}
                    </ButtonBox>
                </Toolbar>
            </StyledAppBar>
            <NewEntryDialog open={newEntryOpen} onClose={handleCloseNewEntry} onCreate={handleCreateNewEntry} />
            <nav>
                <StyledDrawer
                    container={container}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    $isMobile={isMobile}
                >
                    {drawer}
                </StyledDrawer>
            </nav>
        </Container>
    );
}

export default Navbar;

const DrawerContainer = styled(Box)`
    background-color: var(--color-primary-light);
    color: var(--color-font-primary);
    text-align: center;
`;

const DrawerTitle = styled(BaseTypography)`
    font-size: var(--font-size-h6);
    margin: 16px;
`;

const DrawerListItemButton = styled(ListItemButton)`
    text-align: center;
`;

const Container = styled(Box)`
    display: flex;
`;

const StyledAppBar = styled(AppBar)`
    position: sticky;
    background-color: var(--color-primary-light);
`;

const StyledIconButton = styled(IconButton) <{ $isMobile: boolean }>`
    margin-right: 2px;
    display: ${props => (props.$isMobile ? 'block' : 'none')};
`;

const ButtonBox = styled(Box) <{ $isMobile: boolean }>`
    display: ${props => (props.$isMobile ? 'none' : 'block')};
`;

const Title = styled(BaseTypography) <{ $isMobile: boolean }>`
    flex-grow: 1;
    display: ${props => (props.$isMobile ? 'none' : 'block')};
    font-size: var(--font-size-h6);
`;

const StyledButton = styled(Button)`
    color: var(--color-font-primary);
    &:hover {
        border: 1px solid var(--color-primary-dark);
    }
`;

const StyledDrawer = styled(Drawer) <{ $isMobile: boolean }>`
    display: ${props => (props.$isMobile ? 'block' : 'none')};
    & .MuiDrawer-paper {
        box-sizing: 'border-box';
        width: ${drawerWidth};
    }
`;