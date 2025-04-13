

function Albumbox(data: {album_cover: string, album_name: string, artist: string}) {
    // This function takes in a data object with properties cover, name, and artist. Reusable for individual songs or playlists

    return (
        <div className="album-box-container">
            <div className="album-box">
                <img src={data["album_cover"]} alt="Album Cover" className="album-cover" />
                
                <div className="album-info">
                    <h3>{data["album_name"]}</h3>
                    <p>{data["artist"]}</p>
                </div>
            </div>
        </div>
    )


}

export default Albumbox