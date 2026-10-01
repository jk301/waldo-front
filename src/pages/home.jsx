import { Link } from "react-router-dom"

import '../style/home.css'

// must be fetched later (back)
import waldo_beach from '../pics/waldo-beach.jpg'

import waldo_char from '../pics/Character-Waldo.jpg'
import wenda_char from '../pics/Character-Wenda.jpg'
import wizard_char from '../pics/Character-Wizard.jpg'
import odlaw_char from '../pics/Character-Odlaw.jpg'

function Home () {
    return (
        <div className="home">
            <Link to={'/view'}>
                <div className="waldo-card">
                    <h1>Where’s Waldo Beach</h1>
                        <img className="waldo-card-img" src={waldo_beach} alt="waldo beach picture" />
                        <div className="waldo-card-info" >
                            <h3>Find</h3>
                            <div className="card-char">
                                <img src={waldo_char} alt="Waldo" />
                                <img src={wenda_char} alt="Waldo" />
                                <img src={wizard_char} alt="Waldo" />
                                <img src={odlaw_char} alt="Waldo" />
                            </div>
                        </div>
                </div>
            </Link>
        </div>
    )
}

export default Home