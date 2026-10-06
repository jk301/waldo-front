import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import '../style/home.css'

function Leaderboard () {
    const [scenes, setScenes] = useState([])
    const [loading, setLoading] = useState(true)

    function getSrc(entity, who) {
        if (entity === 'scene') {
            return `/scenes/${who}.jpg`
        } else if (entity === 'char') {
            return `/characters/${who}.jpg`
        } else return ''
    }

    useEffect(() => {(
        async () => {
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
    )()
    },[])


    if (loading) return <div className="status-msg"><p>Fetching scenes...</p></div>
    if (!loading && scenes.length === 0) { 
        return <div className="status-msg"><p>No scenes available for now.</p></div>
    }

    return (
        <div className="leader"> 
            <h1>Leaderboard</h1>
            <div className="home">
                {scenes.map((scene) => (
                    <Link key={scene.id} to={`/leaderboard/${scene.slug}`}>
                        <div className="waldo-card" >
                            <h1>{scene.title}</h1>
                                <img 
                                    className="waldo-card-img" 
                                    src={getSrc('scene', scene.slug)} 
                                    alt={scene.title} 
                                />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Leaderboard