function SongTable(data: {
    song_name: string,
    artist_name: string,
    songID: number,
    song_icon: string,
    album_icon: string,
    is_downloaded: boolean,
    song_len: string 
}) {

    return(
        <div className="song-table-container">
            <table className="song-table">
                <tbody>
                    <tr>
                        <div className="song-info">
                            <img src={data["song_icon"]} alt="Song Icon" className="song-icon" />
                            <div className="song-details">
                                <h3>{data["song_name"]}</h3>
                                <p>{data["artist_name"]}</p>
                            </div>
                        </div>

                        <div className="song-options">
                            <i className="download-btn"></i>
                            <p className="song-duration">{data["song_len"]}</p>
                            <i className="mini-menu-btn"></i>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}

export default SongTable