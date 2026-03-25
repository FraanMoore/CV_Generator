import MenuIcon from '@mui/icons-material/Menu';
import { Button, styled } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { default as List, default as ListItem } from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../hooks/useLayout';
import AppLanguage from '../utils/AppLanguage';
import BaseTypography from '../utils/BaseTypography';
import NewEntryDialog, { type NewEntryData } from './NewEntryDialog';
import { useTranslation } from '../i18n';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    onCreateEntry?: (data: NewEntryData) => void;
}

const drawerWidth = '100%';

const navItems = [
    { label: 'New Entry', type: 'new-entry' as const },
    { label: 'Edit CV', type: 'edit-cv' as const },
    { label: 'Language', type: 'language' as const },
];

const Navbar = (props: Props) => {
    const { t } = useTranslation();
    const { window, onCreateEntry } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [newEntryOpen, setNewEntryOpen] = useState(false);
    const { isMobile } = useLayout();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleOpenNewEntry = () => setNewEntryOpen(true);
    const handleCloseNewEntry = () => setNewEntryOpen(false);

    const handleEditCV = () => {
        navigate('/edit-cv');
    };

    const handleCreateNewEntry = (data: NewEntryData) => {
        onCreateEntry?.(data);
        setNewEntryOpen(false);
    };

    const drawer = (
        <DrawerContainer onClick={handleDrawerToggle}>
            <DrawerTitle>
                {t('CV Generator')}
            </DrawerTitle>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.type} disablePadding>
                        <DrawerListItemButton
                            onClick={
                                item.type === 'new-entry'
                                    ? handleOpenNewEntry
                                    : item.type === 'edit-cv'
                                        ? handleEditCV
                                        : undefined
                            }
                        >
                            {item.type === 'language' ? (
                                <AppLanguage />
                            ) : (
                                <ListItemText primary={item.label} />
                            )}
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
                        aria-label={t("open drawer")}
                        edge="start"
                        onClick={handleDrawerToggle}
                        $isMobile={isMobile}
                    >
                        <MenuIcon />
                    </StyledIconButton>
                    <Title
                        $isMobile={isMobile}
                    >
                        {t('CV Generator')}
                    </Title>
                    <ButtonBox $isMobile={isMobile}>
                        {navItems.map((item) => (
                            item.type === 'language' ? (
                                <AppLanguage key={item.type} />
                            ) : (
                                <Button
                                    key={item.type}
                                    onClick={item.type === 'new-entry' ? handleOpenNewEntry : handleEditCV}
                                >
                                    {item.label}
                                </Button>
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
    .MuiButtonBase-root{
    margin: 8px;}
`;

const Title = styled(BaseTypography) <{ $isMobile: boolean }>`
    flex-grow: 1;
    display: ${props => (props.$isMobile ? 'none' : 'block')};
    font-size: var(--font-size-h6);
`;

const StyledDrawer = styled(Drawer) <{ $isMobile: boolean }>`
    display: ${props => (props.$isMobile ? 'block' : 'none')};
    & .MuiDrawer-paper {
        box-sizing: 'border-box';
        width: ${drawerWidth};
    }
`;