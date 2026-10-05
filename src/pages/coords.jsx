import { useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import '../style/view.css'
import { useParams } from 'react-router-dom'

function Coords () {
    const { slug } = useParams()
	const imgRef = useRef(null)

	// handle double click
	async function handleCoords(e) {
		const img = imgRef.current
		const rec = img.getBoundingClientRect()

		const x = Math.floor(((e.clientX - rec.left) / rec.width) * img.naturalWidth)
		const y = Math.floor(((e.clientY - rec.top) / rec.height) * img.naturalHeight)

		console.log({x, y})

	}

	// get source
	function getSrc(entity, who) {
        if (entity === 'scene') {
            return `/scenes/${who}.jpg`
        } else if (entity === 'char') {
            return `/characters/${who}.jpg`
        } else return 
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
                        src={getSrc('scene', slug)}
                        alt='tests'
                        className='img-cont' 
                    />
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div> 
	)
}

export default Coords