	import { useRef, useState } from 'react' 
	import beach  from './../pics/waldo-beach.jpg'
	import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
	import '../style/view.css'

	function View () {
		const [waldo, setWaldo] = useState(false)
		const [welda, setWelda] = useState(false)
		const [odlaw, setOdlaw] = useState(false)
		const [wizard, setWizard] = useState(false)

		const imgRef = useRef(null)

		function handleCoords(e) {
			const img = imgRef.current
			const rec = img.getBoundingClientRect()

			const x = Math.floor(((e.clientX - rec.left) / rec.width) * img.naturalWidth)
			const y = Math.floor(((e.clientY - rec.top) / rec.height) * img.naturalHeight)

			// repetition
			if (!waldo) {
				// check waldo
				// x = 1585, y = 636
				if (x && y) {
					const subX = x - 1585
					const subY = y - 636
					const addedSub = Math.pow(subX, 2) + Math.pow(subY, 2)
					// waldo's r is 50 , 50 ^ 2 = 2500
					const r = 2500
					if (addedSub <= r) {
						setWaldo(true)
						console.log('Found waldo')
					}
				}
			}

			if (!welda) {
				// check welda
				// x = 1989, y = 684
				if (x && y) {
					const subX = x - 1989
					const subY = y - 684
					const addedSub = Math.pow(subX, 2) + Math.pow(subY, 2)
					// waldo's r is 30 , 30 ^ 2 = 900
					const r = 900
					if (addedSub <= r) {
						setWelda(true)
						console.log('Found welda')
					}
				}
			}
			

			if (!odlaw) {
				// check oldaw
				// x = 272, y = 604
				if (x && y) {
					const subX = x - 272
					const subY = y - 604
					const addedSub = Math.pow(subX, 2) + Math.pow(subY, 2)
					// waldo's r is 50 , 50 ^ 2 = 2500
					const r = 2500
					if (addedSub <= r) {
						setOdlaw(true)
						console.log('Found odlaw')
					}
				}
			}
			
			if (!wizard) {
				// check wizard
				// x = 694, y = 606 (to be saved)
				if (x && y) {
					const subX = x - 694
					const subY = y - 606
					const addedSub = Math.pow(subX, 2) + Math.pow(subY, 2)
					// wizard's r is 50 , 50 ^ 2 = 2500
					const r = 2500
					if (addedSub <= r) {
						setWizard(true)
						console.log('Found wizard')
					}
				}
			}

			if ( waldo && welda && odlaw && wizard) console.log('Found em all')

			console.log({x, y})

			return
		}

		return (
		<>
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


		</>
		);
	}

	export default View