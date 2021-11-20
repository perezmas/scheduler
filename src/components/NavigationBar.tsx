import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import MainPageWalkthrough from "./MainPageWalkthrough";

const NavigationBar = (): JSX.Element => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Fancy Scheduler
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" data-testid="open-bar">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={MainPageWalkthrough}>
                            Tutorial
                        </Nav.Link>
                        <Nav.Link as={Link} className="home-page-reqs"to="/Requirements">
                            Requirements
                        </Nav.Link>
                        <NavDropdown title="Resources" className="home-page-resources" id="basic-nav-dropdown">
                            <NavDropdown.Item href="https://catalog.udel.edu/">
                                Course Catalog
                            </NavDropdown.Item>
                            <NavDropdown.Item href="https://my.udel.edu/task/all/udsisstudent">
                                UDSIS
                            </NavDropdown.Item>
                            <NavDropdown.Item href="https://www.cis.udel.edu/">
                                CISC Department Page
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="https://www.reddit.com/r/catpictures/">
                                Cat Pictures
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
