import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useLayout } from '../hooks/useLayout';



interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const drawerWidth = '100%';
const navItems = ['Home', 'Postulations', 'New Entry'];

const Navbar = (props: Props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { isMobile } = useLayout();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
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
                            <StyledButton key={item}>
                                {item}
                            </StyledButton>
                        ))}
                    </ButtonBox>
                </Toolbar>
            </StyledAppBar>
            <nav>
                <StyledDrawer
                    container={container}
                    variant="temporary"
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
    color: var(--color-font);
    text-align: center;
`;

const DrawerTitle = styled(Typography)`
    variant: h6;
    margin: 16px;
`;

const DrawerListItemButton = styled(ListItemButton)`
    text-align: center;
`;

const Container = styled(Box)`
    display: flex;
`;

const StyledAppBar = styled(AppBar)`
    background-color: var(--color-primary-light);
`;

const StyledIconButton = styled(IconButton) <{ $isMobile: boolean }>`
    margin-right: 2px;
    display: ${props => (props.$isMobile ? 'block' : 'none')};
`;

const ButtonBox = styled(Box) <{ $isMobile: boolean }>`
    display: ${props => (props.$isMobile ? 'none' : 'block')};
`;

const Title = styled(Typography) <{ $isMobile: boolean }>`
    flex-grow: 1;
    display: ${props => (props.$isMobile ? 'none' : 'block')};
    variant: h6;
`;

const StyledButton = styled(Button)`
    color: var(--color-font);
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