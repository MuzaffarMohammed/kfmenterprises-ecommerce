import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

function Menu({ title, menuItems, handleMenuClick }) {
    return (
        <Dropdown className='menu-btn' onClick={() => { handleMenuClick() }}>
            <Dropdown.Toggle >{title}</Dropdown.Toggle>
            <Dropdown.Menu>
                {menuItems}
            </Dropdown.Menu>
        </Dropdown>
    );
}
export default Menu;