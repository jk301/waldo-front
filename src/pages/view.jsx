import { useRef, useState } from 'react' 
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import '../style/view.css'
// import { useParams } from 'react-router-dom'

// All of this must be fetched from back
import beach  from './../pics/waldo-beach.jpg'
import waldoPic from '../pics/Character-Waldo.jpg'
import wendaPic from '../pics/Character-Wenda.jpg'
import wizardPic from '../pics/Character-Wizard.jpg'
import odlawPic from '../pics/Character-Odlaw.jpg'

function cal (x, y, charX, charY, rSqred) {
	const subX = x - charX
	const subY = y - charY
	const addedSub = Math.pow(subX, 2) + Math.pow(subY, 2)
	return (addedSub <= rSqred) 
}

function View () {
	// const {imgId} = useParams()
	const imgRef = useRef(null)

	const [waldo, setWaldo] = useState(false)
	const [wenda, setWenda] = useState(false)
	const [odlaw, setOdlaw] = useState(false)
	const [wizard, setWizard] = useState(false)

	const allFound =  ( waldo && wenda && odlaw && wizard)

	// function fetchImg () {
	// 	// fetch img according to imgId (backend)
	// 	// img should contain (img, all char coords)
	// }

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

		if (!wenda) {
			// x = 1989, y = 684
			if (cal(x, y, 1989, 684, 2500)) setWenda(true)
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

		<div className='view-detail'>
			<div className='char-check-cont'>
				<div className='char-cont'>
					<h2>Waldo</h2>
					<img src={waldoPic} alt="Waldo" />
					<div className={waldo ? 'check-green' : 'check-red'} ></div>
				</div>
				<div className='char-cont'>
					<h2>Wenda</h2>
					<img src={wendaPic} alt="Wenda" />
					<div className={wenda ? 'check-green' : 'check-red'} ></div>
				</div>
				<div className='char-cont'>
					<h2>Wizard</h2>
					<img src={wizardPic} alt="Wizard" />
					<div className={wizard ? 'check-green' : 'check-red'} ></div>
				</div>
				<div className='char-cont'>
					<h2>Odlaw</h2>
					<img src={odlawPic} alt="Odlaw" />
					<div className={odlaw ? 'check-green' : 'check-red'} ></div>
				</div>
			</div>

			<div className='view-timer'>

			</div>

			<div>
				{allFound && <h2>You found them all!</h2>}
			</div>

		</div>

	</div>
	);
}

export default View