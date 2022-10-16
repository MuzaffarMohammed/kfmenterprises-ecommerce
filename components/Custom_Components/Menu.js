import Dropdown from 'react-bootstrap/Dropdown';

function Menu({ title, menuItems }) {
    return (
        <Dropdown className='menu-btn'>
            <Dropdown.Toggle >{title}</Dropdown.Toggle>
            <Dropdown.Menu>
                {menuItems}
            </Dropdown.Menu>
        </Dropdown>
    );
}
export default Menu;