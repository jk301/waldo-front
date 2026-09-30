	import { useRef, useState } from 'react' 
	import beach  from './../pics/waldo-beach.jpg'
	import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
	import '../style/view.css'

	function cal (x, y, charX, charY, rSqred) {
		const subX = x - charX
		const subY = y - charY
		const addedSub = Math.pow(subX, 2) + Math.pow(subY, 2)
		return (addedSub <= rSqred) 
	}

	function View () {
		const [waldo, setWaldo] = useState(false)
		const [welda, setWelda] = useState(false)
		const [odlaw, setOdlaw] = useState(false)
		const [wizard, setWizard] = useState(false)
		const imgRef = useRef(null)

		const allFound =  ( waldo && welda && odlaw && wizard)

		function handleCoords(e) {
			if (allFound) return console.log('already found em all')
	
			const img = imgRef.current
			const rec = img.getBoundingClientRect()

			const x = Math.floor(((e.clientX - rec.left) / rec.width) * img.naturalWidth)
			const y = Math.floor(((e.clientY - rec.top) / rec.height) * img.naturalHeight)

			if (!waldo) {
				// x = 1585, y = 636
				if (cal(x, y, 1585, 636, 2500)) setWaldo(true)
			}

			if (!welda) {
				// x = 1989, y = 684
				if (cal(x, y, 1989, 684, 2500)) setWelda(true)
			}
			

			if (!odlaw) {
				// x = 272, y = 604
				if (cal(x, y, 272, 604, 2500)) setOdlaw(true)
			}
			
			if (!wizard) {
				// x = 694, y = 606 (to be saved)
				if (cal(x, y, 694, 606, 2500)) setWizard(true)
			}

			console.log({x, y})
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
					src={beach}
					alt="waldo in the beach"
					className='img-cont' 
				/>
				</TransformComponent>
			</TransformWrapper>
			</div>

			<div className='char-check-cont'>
				<p>Found waldo? {waldo ? 'yes' : 'no'}</p>
				<p>Found welda? {welda ? 'yes' : 'no'}</p>
				<p>Found odlaw? {odlaw ? 'yes' : 'no'}</p>
				<p>Found wizard? {wizard ? 'yes' : 'no'}</p>

				{allFound && <p>You found them all!</p>}
			</div>

		</div>
		);
	}

	export default View