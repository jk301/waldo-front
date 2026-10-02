import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import '../style/view.css'
import { useParams } from 'react-router-dom'

function View () {
	console.log('view page rendered/refreshed')
	const navigate = useNavigate()
	const { slug } = useParams()
	const [start, setStart] = useState(false)

	const imgRef = useRef(null)
	const [imgSize, setImgSize] = useState({ w: 0, h: 0 })

	const [scene, setScene] = useState(undefined)
	const [loading, setLoading] = useState(true)
	const [checking, setChecking] = useState(false)
	const [miss, setMiss] = useState('false')
	const [marker, setMarker] = useState([])
	const [showWin, setShowWin] = useState(false)

	const [found, setFound] = useState([])

	// Timer
	const [startTime, setStartTime] = useState(null)
	const [elapsed, setElapsed] = useState(null)
	const [, setTick] = useState(0)

	const allFound =  scene?.characters.every(c => found.includes(c.name)) ?? false

	// Timer
	useEffect(() => {
		if (!scene || !start) return

		setStartTime(Date.now())
		const id = setInterval(() => setTick(n => n + 1), 50)
		return () => clearInterval(id)
	},[scene, start])

	useEffect(() => {
		if (!allFound || startTime === null || elapsed !== null) return
		setElapsed(Date.now() - startTime)
	}, [allFound, startTime, elapsed])

	useEffect(() => {
		setStartTime(null)
		setElapsed(null)
	},[slug])

	const ms = elapsed ?? (startTime !== null ? Date.now() - startTime : null)

	function formatTime(ms) {
		const total = Math.floor(ms / 1000)
		const m = Math.floor(total / 60)
		const s = total % 60
		const cs = Math.floor((ms % 1000) / 10) // centiseconds
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
	}

	// Delays/Clears 
	useEffect(() => {
		if (allFound) {
			const id = setTimeout(() => setShowWin(true), 1000)
			return () => clearTimeout(id)
		} else return
	}, [allFound])

	// scene fetch
	useEffect(() => {(
		async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/scene/${slug}`)
				if (res.ok) {
					const data = await res.json()
					setScene(data.scene)
				}
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		})()
	},[slug])

	useEffect(() => {
		if (miss) {
			const id = setTimeout(() => setMiss(false), 1000)
			return () => clearTimeout(id)
		} else return
	}, [miss])

	// handle double click
	async function handleCoords(e) {
		if (allFound || checking) return 

		setChecking(true)
		const img = imgRef.current
		const rec = img.getBoundingClientRect()

		const x = Math.floor(((e.clientX - rec.left) / rec.width) * img.naturalWidth)
		const y = Math.floor(((e.clientY - rec.top) / rec.height) * img.naturalHeight)

		console.log({x, y})

		// WIP
		try {
			const url = `${import.meta.env.VITE_API_URL}/scene/${slug}/check?x=${x}&y=${y}`
			console.log(url)
			const res = await fetch(url)
			if (res.ok) {
				const data = await res.json()
				// check if hit ? if yes then who ?
				if (data.hit) {
					// set name to found state (if not in found already)
					setFound((prev) => prev.includes(data.name) ? prev : [...prev, data.name])
					setMarker((prev) =>  [...prev, {id: crypto.randomUUID(), status: 'hit', x, y, name: data.name}])
				} else {
					setMiss(true)
					console.log('miss hit')
				}
			}
		} catch (error) {
			console.log(error)
		} finally {
			setChecking(false)
		}
	}

	// get source
	function getSrc(entity, who) {
        if (entity === 'scene') {
            return `/scenes/${who}.jpg`
        } else if (entity === 'char') {
            return `/characters/${who}.jpg`
        } else return 
    }

	if (loading) return <div className="status-msg"><p>Fetching scenes please wait...</p></div>
    if (!loading && scene === undefined) { 
        return <div className="status-msg"><p>Scene unavailable.</p></div>
    }

	return (
		<div>
			{ start 
				? <div className='view-cont'>
					<div className='main-cont' onDoubleClickCapture={handleCoords}>
						<TransformWrapper
							initialScale={1}
							minScale={1}
							maxScale={10} 
							centerOnInit 
							wheel={{ step: 0.002 }} 
							doubleClick={{ disabled: true }} 
						>
							<TransformComponent
							wrapperStyle={{ width: "100%", height: "100%" }} 
							contentStyle={{ width: "100%", height: "100%" }}
							>
							<img 
								ref={imgRef} 
								src={getSrc('scene', scene.slug)}
								alt="waldo in the beach"
								className='img-cont' 
								onLoad={(e) => {
									setImgSize({
									w: e.currentTarget.naturalWidth,
									h: e.currentTarget.naturalHeight,
									})
								}}
							/>
							{/* // marker here  */}
							{imgSize.w > 0 &&
								marker.map((m) => (
									<div
										key={m.id}
										className={`marker`}
										style={{
											left: `${(m.x / imgSize.w) * 100}%`,
											top: `${(m.y / imgSize.h) * 100}%`,
										}}
										>
										{m.status === 'hit' && m.name && (
											<span className="marker-label">{m.name}</span>
										)}
									</div>
							))}
							</TransformComponent>
						</TransformWrapper>
						<p className='img-div-status'>
							{checking && "checking" }
							{miss && "miss!"}
						</p>
					</div>

					<div className='view-detail'>
						<div className='char-check-cont'>
							{scene.characters.map( char => (
								<div key={char.id} className='char-cont'>
									<h2>{char.name}</h2>
									<img src={getSrc('char', char.name)} alt={char.name} />
				
									<div className={found.includes(char.name) ? 'check-green' : 'check-red'} ></div>
								</div>
							))}
						</div>

						<div className='view-timer'>
							{ms === null ? '--:--' : formatTime(ms)}
						</div>

						<div className='view-tips'>
							<p>-- Double right click for checking if its a character.</p>
							<p>-- use scroll for zooming in & out</p>
							<p>-- Use click & drag to move the scene around.</p>
						</div>

						<div>
							{showWin && (
								<div className="winner-overlay">
									<div className="winner-card">
										<h1>You found them all!</h1>
										<p>Time: {formatTime(ms)}</p>
										<form action="" className='winner-form'>
											<input type="text" required placeholder='your name'/>
											<button>Submit to leaderboard</button>
										</form>
										<button onClick={() => navigate('/')}>Back to Home</button>
									</div>
								</div>
							)}
						</div>

					</div>

				</div> 

				: <div className='start-page'>
					<h2>You have to find</h2>
					<div className='start-find-char'>
						{scene.characters.map( char => (
							<div key={char.id} className='start-char-cont'>
								<h2>{char.name}</h2>
								<img src={getSrc('char', char.name)} alt={char.name} />
							</div>
						))}
					</div>
					<p>The timer would start when you press the button</p>
					<button onClick={() => setStart(true)}>Start</button>
				</div>
			}
		</div>
	)
}

export default View