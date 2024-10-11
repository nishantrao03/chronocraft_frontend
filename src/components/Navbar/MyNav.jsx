import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

function MyNav() {
  return (
    <Navbar 
      expand="lg" 
      style={{ 
        backgroundColor: '#002366', 
        height: '80px', 
        padding: '0 20px', 
        position: 'relative' // Maintain position of elements
      }}
    >
      {/* Brand with subtle padding to the left */}
      <Navbar.Brand href="#home" style={{ color: '#FFFFFF', fontWeight: 'bold', paddingLeft: '10px' }}>
        ChronoCraft
      </Navbar.Brand>
      
      {/* Toggler for mobile view */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      {/* Navigation options */}
      <Navbar.Collapse id="basic-navbar-nav">
        {/* Navigation for Laptop View */}
        <Nav className="ms-auto d-none d-lg-flex" style={{ alignItems: 'center' }}>
          <Nav.Link as={Link} to="/" style={{ color: '#FFFFFF', padding: '0 15px' }}>Home</Nav.Link>
          <Nav.Link as={Link} to="/MyTasks" style={{ color: '#FFFFFF', padding: '0 15px' }}>My Tasks</Nav.Link>
          <NavDropdown title="More" id="basic-nav-dropdown" menuVariant="dark" align="end">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something Else</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated Link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        
        {/* Navigation for Mobile View */}
        <Nav className="d-lg-none w-100" style={{ padding: '0' }}>
          <Nav.Link as={Link} to="/" style={{ color: '#FFFFFF', padding: '10px 15px', textAlign: 'right' }}>Home</Nav.Link>
          <Nav.Link as={Link} to="/MyTasks" style={{ color: '#FFFFFF', padding: '10px 15px', textAlign: 'right' }}>My Tasks</Nav.Link>
          <NavDropdown 
            title="More" 
            id="basic-nav-dropdown" 
            menuVariant="dark" 
            align="end" 
            style={{ textAlign: 'right' }} // Align dropdown to the right
          >
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something Else</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated Link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MyNav;
