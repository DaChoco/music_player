import "./albumbox.css" // Importing the CSS file for styling
export type Albumboxtype = {
    album_cover: string,
    album_name: string,
    artist_name: string,
    song_cover: string,
    song_name: string,
    song_img_url: string}
function Albumbox(props: {data: Albumboxtype[], num: number}){ 
    const {data, num} = props // Destructuring the props to get the data and num properties
    // This function takes in a data object with properties cover, name, and artist. Reusable for individual songs or playlists

    return (
        <div className="album-box-container">
            <div className="album-box">
            {data[num]["album_cover"] !== null ? (<img src={data[num]["album_cover"]} alt="Album Cover" className="album-cover" />):(<img alt="song_cover" src={data[num]["song_img_url"]} className="album-cover"></img>) }    
                
                <div className="album-info">
                    <h3>{data[num]["album_name"]}</h3>
                    <p>{data[num]["artist_name"]}</p>
                </div>
            </div>
        </div>
    )


}

export default Albumbox