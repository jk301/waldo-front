import { useRef, useState, useEffect } from 'react' 
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import '../style/view.css'
import { useParams } from 'react-router-dom'

function View () {
	console.log('hitting comp')
	const { slug } = useParams()
	const imgRef = useRef(null)

	const [scene, setScene] = useState(undefined)
	const [loading, setLoading] = useState(true)

	const [waldo, setWaldo] = useState(false)
	const [wenda, setWenda] = useState(false)
	const [odlaw, setOdlaw] = useState(false)
	const [wizard, setWizard] = useState(false)

	const allFound =  ( waldo && wenda && odlaw && wizard)

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

	async function handleCoords(e) {
		if (allFound) return console.log('already found em all')

		const img = imgRef.current
		const rec = img.getBoundingClientRect()

		const x = Math.floor(((e.clientX - rec.left) / rec.width) * img.naturalWidth)
		const y = Math.floor(((e.clientY - rec.top) / rec.height) * img.naturalHeight)

		console.log({x, y})

		// WIP
		try {
			const res = await fetch(`
				${import.meta.env.VITE_API_URL}/scene/${slug}/check?x=${x}&y=${y}
			`)
			if (res.ok) {
				const data = await res.json()
				// check if hit ? if yes then who ?
				if (data.hit) {
					if (data.name === 'waldo') setWaldo(true)
					if (data.name === 'wenda') setWenda(true)
					if (data.name === 'wizard') setWizard(true)
					if (data.name === 'odlaw') setOdlaw(true)
				} else {
					console.log('miss hit')
				}
			}
		} catch (error) {
			console.log(error)
		}

	}

	function getSrc(entity, who) {
        if (entity === 'scene') {
            return `../../public/scenes/${who}.jpg`
        } else if (entity === 'char') {
            return `../../public/characters/${who}.jpg`
        } else return 
    }

	if (loading) return <div className="status-msg"><p>Fetching scenes...</p></div>
    if (!loading && scene === undefined) { 
        return <div className="status-msg"><p>Scene unavailable.</p></div>
    }

	return (
	<div className='view-cont'>
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
			/>
			</TransformComponent>
		</TransformWrapper>
		</div>

		<div className='view-detail'>
			<div className='char-check-cont'>
				{scene.characters.forEach( char => (
					<div key={char.id} className='char-cont'>
						<h2>{char.name}</h2>
						<img src={getSrc('char', char.name)} alt={char.name} />
						{/* problem */}
						<div className={waldo ? 'check-green' : 'check-red'} ></div>
					</div>
				))}
			</div>

			<div className='view-timer'>
				Timer(wip)
			</div>

			<div>
				{allFound && <h2>Got em all!</h2>}
			</div>

		</div>

	</div>
	);
}

export default View