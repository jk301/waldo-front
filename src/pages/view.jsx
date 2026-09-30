import { useRef } from 'react' 
import beach  from './../pics/waldo-beach.jpg'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import '../style/view.css'

function View () {
    const imgRef = useRef(null)

    function handleCoords(e) {
        console.log('double click fired')
        const img = imgRef.current
        const rec = img.getBoundingClientRect()

        const x = Math.floor(((e.clientX - rec.left) / rec.width) * img.naturalWidth)
        const y = Math.floor(((e.clientY - rec.top) / rec.height) * img.naturalHeight)

        console.log({x, y})
    }

    return (
    <div className='main-cont' onDoubleClickCapture={handleCoords}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={10} 
        centerOnInit 
        wheel={{ step: 0.001 }} 
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
  );
}

export default View