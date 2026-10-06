import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import '../style/view.css'
import { useParams } from 'react-router-dom'

function View () {
	// page flow info
	const navigate = useNavigate()
	const { slug } = useParams()
	const [start, setStart] = useState(false)
	const [session, setSession] = useState(null)
	const [finish, setFinish] = useState(null)

	// image
	const imgRef = useRef(null)
	const [imgSize, setImgSize] = useState({ w: 0, h: 0 })

	// scene dependant
	const [scene, setScene] = useState(undefined)
	const [loading, setLoading] = useState(true)
	const [checking, setChecking] = useState(false)
	const [miss, setMiss] = useState(false)
	const [marker, setMarker] = useState([])
	const [showWin, setShowWin] = useState(false)

	const [found, setFound] = useState([])

	// Timer
	const [startTime, setStartTime] = useState(null)
	const [elapsed, setElapsed] = useState(null)
	const [, setTick] = useState(0)

	// Leaderboard
	const [lbName, setLbName] = useState('')

	const allFound =  scene?.characters.every(c => found.includes(c.name)) ?? false

	// Timer
	useEffect(() => {
		if (!start) return
		let ignore = false;

		(async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/scene/${slug}/start`, {
					method: 'POST' 
				})
				if (!res.ok || ignore) return
				const data = await res.json()
				if (ignore) return
				setSession(data.id)
				setStartTime(Date.now())
			} catch (error) {
				console.log(error)
			}
		})()

		return () => { ignore = true }
	}, [scene, start, slug])

	useEffect(() => {
		if (!scene || !start) return

		const id = setInterval(() => setTick(n => n + 1), 50)
		return () => clearInterval(id)
	}, [start, scene])

	useEffect(() => {
		if (!allFound || startTime === null || elapsed !== null) return
		
		// fetch stop
		try {
			(async () => {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/scene/${slug}/${session}/stop`, { 
					method: 'POST'
				})

				if (res.ok) {
					const data = await res.json()
					setFinish(data.timeMs)
				}
			})()
		} catch (error) {
			console.log(error)
		}

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setElapsed(Date.now() - startTime)
	}, [allFound, startTime, elapsed, slug, finish, session])

	// reset on slug change
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setStartTime(null)
		setElapsed(null)
		setSession(null)
		setStart(false)
		setImgSize ({ w: 0, h: 0 })
		setScene(undefined)
		setMarker([])
		setShowWin(false)
		setFound([])
		setLoading(true)
	},[slug])
	
	// eslint-disable-next-line react-hooks/purity
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

		// console.log({x, y})

		// WIP
		try {
			const url = `${import.meta.env.VITE_API_URL}/scene/${slug}/check?x=${x}&y=${y}`
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
				}
			}
		} catch (error) {
			console.log(error)
		} finally {
			setChecking(false)
		}
	}

	async function handleLBSubmit(e) {
		// lbName, timeMS, sceneId
		e.preventDefault()

		try {
			const url = `${import.meta.env.VITE_API_URL}/scene/${slug}/leaderboard`
			const res = await fetch(url, {
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json'
				}, 
				body: JSON.stringify({ playerName: lbName, sessId: session })
			})
			if (res.ok) {
				navigate(`/leaderboard/${slug}`)
			}
		} catch (error) {
			console.log(error)
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

	if (loading) return <div className="status-msg"><p>Fetching scene details please wait...</p></div>
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
								alt={scene.title} 
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
							{checking && <p className='img-div-status'>Checking..</p> }
							{miss && <p className='img-div-status'>Miss!</p>}
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
							{ms === null ? '--:--' : finish ? formatTime(finish) : formatTime(ms)}
						</div>

						<div className='view-tips'>
							<p>-- Double 'left' click for checking if its a character.</p>
							<p>-- use scroll for zooming in & out</p>
							<p>-- Use click & drag to move the scene around.</p>
							<p>-- Timer & submission could have a delay (sorry)</p>
						</div>

						<div>
							{showWin && (
								<div className="winner-overlay">
									<div className="winner-card">
										<h1>You found them all!</h1>
										<p>Time: {formatTime(finish)}</p>
										<form onSubmit={handleLBSubmit} className='winner-form'>
											<input 
												type="text" 
												minLength={3} 
												maxLength={15}
												required 
												placeholder='your name' 
												value={lbName}
												onChange={(e) => setLbName(e.target.value)}
											/>
											<button type='submit'>Submit to leaderboard</button>
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