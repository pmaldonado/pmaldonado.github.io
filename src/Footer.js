import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Footer() {
    return (
        <footer className="wide">
            <div className="icon-bar">
                <a href="https://github.com/pmaldonado" className="icon" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={['fab', 'github']} />
                </a>
                <a href="https://twitter.com/pmaldonado__" className="icon" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={['fab', 'twitter']} />
                </a>
                <a href="https://www.linkedin.com/in/peterhmaldonado/" className="icon" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={['fab', 'linkedin']} />
                </a>
            </div>
            {/* <p>Made with <FontAwesomeIcon icon={['fas', 'heart']} id="Footer-heart" /> in California</p> */}
        </footer>
    );
}

export default Footer;
