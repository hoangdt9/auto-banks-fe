import { useContext, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Container,
  useTheme,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { ColorModeContext, tokens } from "../../../../theme";
import Logo from "../../../../assets/ic_city_sport.png";
import { SETTINGS } from "../../../../constants/CommonConstant";
import { createStorage } from "../../../../utils/LocalStorage";
import { useQuery } from "react-query";
import userApi from "../../../../api/userApi";
import "./styles.scss";

const settings = SETTINGS;

interface IProps {
  tabs: Map<string, string>;
  active: any;
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const Topbar = (props: IProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode: any = useContext(ColorModeContext);

  const { tabs, active, setActive } = props;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const { data: user } = useQuery("user", userApi.getUser);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e: any) => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (e: any) => {
    setAnchorElUser(null);
    if (isLogout(e.target.id)) handleLogout();
  };

  const handleOpenUserProfile = (e: any) => {
    setAnchorElUser(null);
    navigate("/user-profile");
  };

  const isLogout = (id: string) => id === "logout";

  const handleLogout = async () => {
    const storage = createStorage("citysports");
    try {
      const { tokens } = await storage.get(user.username);

      const token = { refresh: tokens.refresh };
      await userApi.logout(token);

      storage.delete();
      navigate("/auth/sign-in", { replace: true });
    } catch (error) {
      storage.delete();
      navigate("/auth/sign-in", { replace: true });
    }
  };

  const handleClickNavItem = (e: any, key: string) => {
    e.preventDefault();
    setActive({ [key]: "active" });
    navigate(`/${key}`, { replace: true });
    handleCloseNavMenu(e);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 40 }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            <img alt="logo" src={Logo} className="logo" />
          </Typography>

          {tabs && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-nav"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {Array.from(tabs).map(([key, value]) => (
                  <MenuItem
                    id={key}
                    key={key}
                    className="nav-item"
                    onClick={(e) => handleClickNavItem(e, key)}
                  >
                    <Link to={`/${key}`} className="nav-link nav-menu-item">
                      <Typography variant="h6" noWrap color={colors.black[100]}>
                        {value}
                      </Typography>
                      <div className="nav-item_line" />
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img alt="logo" src={Logo} className="logo" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, my: 2 }}>
            {tabs &&
              Array.from(tabs)?.map(([key, value]) => (
                <Button
                  id={key}
                  key={key}
                  variant="text"
                  className={`nav-item ${active[key] ?? ""}`}
                  onClick={(e) => handleClickNavItem(e, key)}
                >
                  <Link to={`/${key}`} className="nav-link nav-button">
                    {value}
                    <div className="nav-item_line" />
                  </Link>
                </Button>
              ))}
          </Box>

          <Box sx={{ display: "flex" }}>
            <IconButton
              onClick={colorMode?.toggleColorMode}
              className="icon"
              size="large"
            >
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>

            <Tooltip title="Hồ sơ của bạn">
              <IconButton
                onClick={handleOpenUserMenu}
                className="icon"
                size="large"
              >
                <PersonOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {Array.from(settings).map(([key, value]) => (
                <MenuItem
                  id={key}
                  key={`setting${key}`}
                  onClick = {(key==="profile") ? handleOpenUserProfile :handleCloseUserMenu}
                >
                  <Typography textAlign="center" id={key}>
                    {value}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Outlet />
    </AppBar>
  );
};

export default Topbar;
