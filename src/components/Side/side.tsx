import React from "react";
import { Link } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useUserStore } from "../../stores/UserStore"; // Importando useUserStore do Zustand
import UserStorage from "../../util/UserStorage";

const UserMenuHeader = () => {
    // Placeholder user image URL
    const userImageUrl = 'https://via.placeholder.com/150';

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Avatar alt="User" src={userImageUrl} sx={{ width: 150, height: 150, margin: 'auto' }} />
        </div>
    );
}

const Navbar = () => {
    const [state, setState] = React.useState({
        left: false,
    });


    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) => {
        if (event && 'key' in event && (event as React.KeyboardEvent<Element>).key === 'Tab' || (event as React.KeyboardEvent<Element>).key === 'Shift') {
            return;
        }
        setState({ left: open });
    };

    const list = (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <UserMenuHeader />
            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/home">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/perfil">
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Perfil"} />
                    </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/projetos">
                        <ListItemIcon>
                            <PermContactCalendarIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Projetos"} />
                    </ListItemButton>
                </ListItem>
            </List>
          
        </div>
    );


const {isAuthenticated} = useUserStore();
const token = UserStorage.getToken();

const verdade = isAuthenticated || !!token;

    if (!verdade) {

        return null;
    }

    return (
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <Button onClick={toggleDrawer(true)}>
                <MenuIcon />
            </Button>
            <Drawer
                anchor="left"
                open={state.left}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                    },
                }}
            >
                {list}
            </Drawer>
        </div>
    );
}

export default Navbar;
