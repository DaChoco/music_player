#FASTAPI
import select
from fastapi import FastAPI, Query, middleware, Depends, Request, Response, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
import uvicorn


from sqldb import create_db, LocalSession
from models import tblAlbums, tblArtists, tblSongs, tblUser
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update, delete, or_


import os
from dotenv import load_dotenv
load_dotenv(override=True)

personal_ip = os.getenv("PERSONAL_IP")
ipad_ip = os.getenv("iPad_IP")
from pathlib import Path
import datetime

from pytubefix import YouTube

#SQL
import sqlite3 as sql
from mutagen.mp3 import MP3
from mutagen.mp4 import MP4

from aws import uploadImage, deleteImage

def createConn():
    #Create a connection to the database
    conn = sql.connect('music.db')
    return conn

def extractSongLength(file_path: str):
    #Extract the length of the song using mutagen
    print(file_path)

    file_path = file_path.replace('"', '').replace("'", '')
    file_path = file_path.replace(r"|", "")
    file_path = file_path.replace(r":", "").replace("{", "").replace("}", "").replace("%", "")
    print(file_path)
    clean_path = Path(file_path.replace(r'\\\\', '\\').strip('"')).resolve()
 
    print(clean_path)
    audio = MP4(clean_path)
    seconds = int(audio.info.length)
    return str(datetime.timedelta(seconds=seconds))

#SETUP
app = FastAPI()
ORIGINS = ['http://127.0.0.1:5173', 'http://localhost:5173', f'http://{personal_ip}:5173', f'http://{ipad_ip}:0']
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
create_db()

#END SETUP

async def returnDB():
    DB = LocalSession()
    try:
        yield DB
    finally:
        DB.close()

# Add a new user




@app.get("/")
def indexroute():
    return {"message": "Welcome to the mp3 player api!"}

@app.get("/getMe")
def get_current_user(db: Session = Depends(returnDB)):
    result = db.execute(select(tblUser.userIconLocal, tblUser.userName)).mappings().first()
    print(result)
    return result

@app.put("/updateMe/uploadIcon/Local")
async def update_user(db: Session = Depends(returnDB), file: UploadFile = File(...)):
    if file.size > 10000000:
        return {"message": "We are sorry, but we don't accept files larger than 10MB"}
    
    the_user = db.query(tblUser).first()

    os.makedirs("SongStorage", exist_ok=True)
    folder = Path("SongStorage")

    file_names = [f.name for f in folder.iterdir() if f.is_file()]
    
    if file.filename in file_names:
        return {"message": "We are sorry, but you already have a file with this name. So we will not download it"}

    if not the_user:
        return {"message": "We are sorry, but we don't have a user to update, try signing in"}
    
    the_user.userIconLocal = await file.file.read()
    db.commit()
    db.refresh(the_user)

    return FileResponse(the_user.userIconLocal, media_type="image/png", filename="userIcon.png")

@app.put("/updateMe/uploadIcon/Cloud")
async def update_user_cloud(db: Session = Depends(returnDB), file: UploadFile = File(...)):
    if file.size > 10000000:
        return {"message": "We are sorry, but we don't accept files larger than 10MB"}
    
    the_user = db.query(tblUser).first()
    #Check if the user exists
    if not the_user:
        return {"message": "We are sorry, but we don't have a user to update, try signing in"}
    
    #Delete the old image from S3
    if await deleteImage(the_user.userIconCloudurl, "simplemusicplayer-01") == False:
        return {"message": "We are sorry, but we couldn't delete the old image from S3"}
    
    #Upload the new image to S3
    url = await uploadImage(file.file, file.filename, "simplemusicplayer-01", "userIcons")
    
    the_user.userIconCloudurl = url
    db.commit()
    db.refresh(the_user)

    return {"message": "User icon updated successfully", "url": url}

@app.get("/getSongs")
def extractSongs(db: Session = Depends(returnDB)):
    #these songs will be mapped to components in the gui of the mp3 player - Album cover is fallover

    query = select(tblSongs.song_name, 
                   tblSongs.release_date, 
                   tblSongs.song_mp3_audio_path, 
                   tblSongs.song_len, 
                   tblArtists.artist_name, tblAlbums.album_cover, tblSongs.song_img_url).join(tblArtists, tblSongs.Songs_to_Artists).outerjoin(tblAlbums, tblSongs.Songs_to_Albums).order_by(tblSongs.release_date.desc()).limit(10)
    output = db.execute(query).mappings().all()
    
    return output

@app.get("/search/items")
def get_music_info (songName: str | None = Query(None), artistName: str | None = Query(None), albumName: str | None = Query(None), db: Session = Depends(returnDB) ):
    if not songName and not artistName and not albumName:
        return {"reply": False, "msg": "You have not typed in anything, so nothing was outputted"}

    query = select(tblSongs.songID, 
                   tblSongs.song_name, 
                   tblSongs.song_mp3_url,

                   tblArtists.artistID, 
                   tblArtists.artist_name,

                   tblAlbums.albumID, 
                   tblAlbums.album_name, 
                   tblAlbums.album_cover).join(tblSongs.Songs_to_Artists).outerjoin(tblSongs.Songs_to_Albums).filter(
                    
                    or_(tblArtists.artist_name.like(f"%{artistName}%"), 
                        tblSongs.song_name.like(f"%{songName}%"), 
                        tblAlbums.album_name.like(f"%{albumName}%"))
                   )

    result = db.execute(query).mappings().all()

    if not result:
        return {"reply": False, "msg": "It appears your search criteria may be too specific?"}
    
    return {"reply": True, "result": result}


@app.get("/search/artists/{artistid}")
def get_artist(artistid: int,db: Session = Depends(returnDB)):
    artist = db.query(tblArtists).filter(tblArtists.artistID == artistid).first()
    if not artist:
        return {"reply": False, "message": "You are searching an artist who does not exist"}
    return {"reply": True, "message": "This user has artists, display them for them", "output": artist}

@app.post("/artists/signup")
def RegisterArtist(db: Session = Depends(returnDB), name: str = Query(...), dob: str = Query(...), coo = Query(...), dateformed = Query(...)):
    new_artist = tblArtists(artist_name=name, artist_dob=dob, date_formed=dateformed, country_of_origin=coo)
    db.add(new_artist)
    db.commit()
    db.refresh(new_artist)
    return {"Success": True, "ArtistID": new_artist.artistID, "Name": new_artist.artist_name}

@app.get("/songs/downloads")
def download_song(yt_url: str = Query(...), db: Session = Depends(returnDB)):
    if yt_url is None:
        return {"message": "Apologies, but you haven't added a song"}

    yt = YouTube(yt_url)

    yt_stream = yt.streams.filter(only_audio=True).first()

    os.makedirs("SongStorage", exist_ok=True)
    folder = Path("SongStorage")
    filename = f"{yt.title}.mp4"

    file_names = [f.name for f in folder.iterdir() if f.is_file()]

    if filename in file_names:
        query = select(tblSongs.song_name, tblSongs.release_date, tblSongs.song_mp3_audio_path)
        output = db.execute(query).mappings().all()
        return {"message": "User already downloaded this song.", "file": output, "reply": "failure"}

    path_str = os.path.join("SongStorage", filename)
    yt_stream.download(output_path="SongStorage", filename=filename)

    cleaned_duration = extractSongLength(path_str)
    print(cleaned_duration)

    # Check if artist exists
    artist_id = db.execute(select(tblArtists.artistID).where(tblArtists.artist_name == yt.author)).scalars().first()

    if artist_id:
        new_song = tblSongs(
            song_name=yt.title,
            release_date=yt.publish_date,
            song_mp3_url=yt_url,
            song_mp3_audio_path=path_str,
            song_len=cleaned_duration,
            artistID=artist_id,
            song_img_url=yt.thumbnail_url
        )
    else:
        new_artist = tblArtists(artist_name=yt.author)
        db.add(new_artist)
        db.commit()
        db.flush()
        db.refresh(new_artist)

        new_song = tblSongs(
            song_name=yt.title,
            release_date=yt.publish_date,
            song_mp3_url=yt_url,
            song_mp3_audio_path=path_str,
            song_len=cleaned_duration,
            artistID=new_artist.artistID,
            song_img_url=yt.thumbnail_url
        )

    db.add(new_song)
    db.commit()
    db.flush()
    db.refresh(new_song)

    query = select(tblSongs.song_name, 
                   tblSongs.release_date, 
                   tblSongs.artistID, 
                   tblSongs.song_mp3_audio_path, 
                   tblSongs.song_img_url)
    output = db.execute(query).mappings().all()

    return output

@app.get("/songs/downloads/streams")
def stream_song_download(songName: str = Query(...), start: int = 0, db: Session = Depends(returnDB), request: Request = None):
    #This is meant to play songs that have been downloaded
    #It will be a stream endpoint that will stream the song to the client

    query = select(tblSongs.song_mp3_audio_path).where(tblSongs.song_name.like(f"%{songName}%"))
    output = db.execute(query).scalars().first()
    output = output.replace(r"|", "").replace(r":", "").replace("{", "").replace("}", "").replace("%", "").replace(r"'", "").replace(r'"', "")

    try:
        file_size = os.path.getsize(output)
    except FileNotFoundError:
        return {"message": "File not found"}
    except Exception as e:
        return {"message": f"An error occurred: {str(e)}"}
    range_header = request.headers.get('Range', None)

    def iterateFile(begin: int = 0):
        with open(output, mode="rb") as file_audio:
            file_audio.seek(begin)
            while True:
                data = file_audio.read(2048)
                if not data:
                    break
                yield data

    if range_header:
        bytes_range = range_header.split('=')[-1]
        start, end = bytes_range.split('-')
        start = int(start)
        end = int(end) if end else file_size - 1
        content_length = end - start + 1    

        song_headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(content_length),
        "Content-Type": "audio/mpeg",
        }

        return StreamingResponse(iterateFile(start), media_type="audio/mpeg", headers=song_headers, status_code=206)
    #No range header, so we send the whole file
    else:
        song_headers = {
            "Content-Length": str(file_size),
            "Content-Type": "audio/mpeg",
        }
        return StreamingResponse(iterateFile(0), media_type="audio/mpeg", headers=song_headers, status_code=200)

@app.get("/songs/cloud/streams")
def streamSongs():
    #This is meant to play songs that are in the cloud - Hosted on S3
    #It will be a stream endpoint that will stream the song to the client

    return {"message": "This is the stream endpoint"}

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=False)








