import PropTypes from 'prop-types';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="container mt-4">{children}</div>
        </>
    );
};

MainLayout.propTypes = {
    children: PropTypes.any.isRequired
}


export default MainLayout;
