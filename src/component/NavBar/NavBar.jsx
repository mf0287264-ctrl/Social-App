import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { contToken } from "../../Context/ContextToken";
export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavBar({ userImage }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = ["register", "login", "Log Out"];
  let { token, setToken } = useContext(contToken);
  const nav = useNavigate();
  function logoutHndeler() {
    localStorage.removeItem("token");
    setToken(null);
    nav("login");
  }
  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex justify-between gap-4"
        justify="center"
      >
        <NavbarBrand className="me-10">
          <AcmeLogo />
          <p className="font-bold text-inherit">Social Media App</p>
        </NavbarBrand>
        {token && (
          <>
            <NavbarItem>
              <Link color="foreground" to="/profile">
                profile
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" to="/home">
                home
              </Link>
            </NavbarItem>
          </>
        )}

        {/* <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>  */}
      </NavbarContent>

      {token ? (
        //  {/*profile  */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={
                userImage
                  ? userImage
                  : "https://i.pravatar.cc/150?u=a042581f4e29026704"
              }
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="logOut">
              <Link to="profile">profile</Link>
            </DropdownItem>
            <DropdownItem onClick={logoutHndeler} key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        //  {/* login rigester */}
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <NavLink to="login" className="cursor-pointer">
              Login
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <Button as={NavLink} to="register" variant="flat">
              register
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
