import {default as playMusic} from '../apicalls/playMusic';  
import { useAudioContext } from '../contexts/audioContext'; 

type songtype = {
    song_name: string,
    artist_name: string,
    songID: number,
    song_img_url: string,
    album_cover: string,
    album_name: string,
    is_downloaded: boolean,
    song_len: string
}

function SongTable( {songs} : {songs: songtype[]}) {

    const {audio, setAudio, isPlaying, setIsPlaying} = useAudioContext()
    

    return (
        <div className="song-table-container">
            <table className="song-table">
                <thead>
                <tr>
                    <th>Song</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Time</th>
                </tr>
                </thead>

                <tbody>
                    {songs.map((song, index) => (
                        <tr key={index}>

                            <td>
                                <div className="song-info">
                                    {song.song_img_url !== null ? (<img src={song.song_img_url} onClick={()=> playMusic(song.song_name, setAudio, setIsPlaying)} alt="Song Icon" className="song-icon" />) : (<img src={song.album_cover} onClick={()=> playMusic(song.song_name, setAudio, setIsPlaying)} alt="Song Icon" className="song-icon" />)}
                                    <h3>{song.song_name}</h3>
                                </div>
                            </td>

                            <td className='other-columns'><p>{song.artist_name}</p></td>

                            {song.album_name ? (<td className='other-columns'>{song.album_name}</td>): (<td className='other-columns'><p>None</p></td>)}

                            <td className='other-columns'>
                                <div className="song-options">
                                    <i className="download-btn"></i>
                                    <p className="song-duration">{song.song_len}</p>
                                    <i className="mini-menu-btn"></i>
                                </div>
                            </td>
                        </tr>


                    ))}
                </tbody>
            </table>
        </div>
    )

}

export default SongTable