import '../style/about.css'

function About () {

    return (
        <div className="about">
            <img src={'/waldo-infographic.jpg'} alt="About waldo" />
            <a 
                href="https://vuss.io/high-resolution-wheres-waldo-images/"
                target="_blank" 
                rel="noopener noreferrer"
            >
                <h2>The source</h2>
            </a>
        </div>
    )
}

export default About