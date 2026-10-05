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

            <div className="score-table-cont">

                <table className="leaderboard">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Time [min:sec:mil]</th>
                        </tr>
                    </thead>

                    {scores.length > 0 
                        ?  <tbody>
                            {scores.map((s, i) => (
                            <tr key={s.id}>
                                <td>{i + 1}</td>
                                <td>{s.playerName}</td>
                                <td>[{formatTime(s.timeMs)}]</td>
                            </tr>
                            ))}
                        </tbody>
                        : <tbody>
                            <tr>
                                <td colSpan={3} className="lb-empty">No scores yet</td>
                            </tr>
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}


export default SceneLb