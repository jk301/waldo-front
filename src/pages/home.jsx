import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import '../style/home.css'

function Home () {
    const [scenes, setScenes] = useState([])
    const [loading, setLoading] = useState(true)

    async function getScenes () {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/scene/all`)
            if (res.ok) {
                const data = await res.json()
                setScenes(data.allScenes)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    function getSrc(entity, who) {
        if (entity === 'scene') {
            return `../../public/scenes/${who}.jpg`
        } else if (entity === 'char') {
            return `../../public/characters/${who}.jpg`
        } else return 
    }

    useEffect(() => {
        getScenes()
    },[scenes])


    if (loading) return <div className="status-msg"><p>Fetching scenes...</p></div>
    if (!loading && scenes.length === 0) { 
        return <div className="status-msg"><p>No scenes available for now.</p></div>
    }

    return (
        <div className="home">
            {scenes.forEach((scene) => (
                <Link to={`/view/${scene.slug}`}>
                    <div className="waldo-card">
                        <h1>{scene.title}</h1>
                            <img 
                                className="waldo-card-img" 
                                src={() => getSrc(scene.slug)} 
                                alt={scene.title} 
                            />
                            <div className="waldo-card-info" >
                                <h3>Find</h3>
                                <div className="card-char">
                                    {scene.characters.forEach( char => (
                                        <img 
                                            src={getSrc('char', char.name)} 
                                            alt={char.name} 
                                        />
                                    ))}
                                </div>
                            </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Home


{/* <div className="home">
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
</div> */}