import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

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