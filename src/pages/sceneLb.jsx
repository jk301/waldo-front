import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import '../style/sceneLb.css'

function SceneLb () {
    const { slug } = useParams()
    const [scores, setScores] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const url = `${import.meta.env.VITE_API_URL}/scene/${slug}/leaderboard`
                const res = await fetch(url)
                if (res.ok) {
                    const data = await res.json()
                    setScores(data.scores)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [slug])

    function formatTime(ms) {
		const total = Math.floor(ms / 1000)
		const m = Math.floor(total / 60)
		const s = total % 60
		const cs = Math.floor((ms % 1000) / 10) // centiseconds
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
	}

    console.log(`scores: ${scores}`)
    return (
        <div className="scene-lb">
            <div className="scene-detail">
                <h1>Scene: {slug}</h1>
            </div>

            <div className="score-row-cont">
                {scores.length > 0 
                    ? scores.map( score => (
                        <div key={score.id} className="score-row">
                            <h3>{score.playerName}</h3>
                            <p>{formatTime(score.timeMs)}</p>
                            <p>{score.createdAt}</p>
                        </div>
                      ))
                    : <div>
                        <h2>No scores yet</h2>
                    </div>
                }
            </div>
        </div>
    )
}


export default SceneLb