import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <h2>ERROR 404 - PAGINA NO ENCONTRADA</h2>
            <Link to="/">Volver</Link>
        </div>
    );
};

export default NotFound;