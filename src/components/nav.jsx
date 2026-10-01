import { Link } from 'react-router-dom'

import '../style/nav.css'

function Nav () {

    return (
        <nav>
            <h1>Where might waldo be ?</h1>
            <div className='links'>
                <Link to={'/'}><h2>Home</h2></Link>
                <Link to={'/leaderboards'}><h2>Leaderboards</h2></Link>
                <Link to={'/about'}><h2>About Waldo</h2></Link>
            </div>
        </nav>
    )
}

export default Nav