import { Link } from "react-router-dom"

function Home () {
    return (
        <div>
            <Link to={'/view'}>
                Image view
            </Link>
        </div>
    )
}

export default Home