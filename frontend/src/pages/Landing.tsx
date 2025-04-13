

function LandingPage(){

    return (
        <div className="landing-container">

            <h1 className="intro-text">Welcome to the Music Player</h1>

            <form className="input-section">
                <label htmlFor="YT-MP4">Please type in a valid URL</label>
                <input type="text" className="url-to-music" id="YT-MP4" placeholder="Type a url" />
                <button type="submit" className="submit-url">Submit</button>
            </form>



        </div>
    )

}

export default LandingPage