#FASTAPI
import select
from fastapi import FastAPI, Query, middleware, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pytubefix.contrib
import pytubefix.contrib.channel
import uvicorn

from sqldb import create_db, LocalSession
from models import tblAlbums, tblArtists, tblSongs
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update, delete


import os
from pathlib import Path
from io import BytesIO
from pytubefix import YouTube
import pytubefix
import requests

#SQL
import sqlite3 as sql
from mutagen.mp3 import MP3


def createConn():
    #Create a connection to the database
    conn = sql.connect('music.db')
    return conn

def extractSongLength(file_path):
    #Extract the length of the song using mutagen
    audio = MP3(file_path)
    seconds = int(audio.info.length)

    minutes = seconds // 60
    seconds = seconds % 60
    return f"{minutes}:{seconds:02d}"


#SETUP
app = FastAPI()
ORIGINS = ['http://127.0.0.1:5173', 'http://152.110.15.239:0']
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

@app.get("/getSongs")
def extractSongs(db: Session = Depends(returnDB)):
    #these songs will be mapped to components in the gui of the mp3 player - Album cover is fallover

    query = select(tblSongs.song_name, 
                   tblSongs.release_date, 
                   tblSongs.song_mp3_audio_path, 
                   tblSongs.song_len, 
                   tblArtists.artist_name, tblAlbums.album_cover).join(tblArtists, tblSongs.artistID == tblArtists.artistID)
    output = db.execute(query).mappings().all()
    return output

@app.get("/search/items")
def get_music_info(songName: str = Query(...), artistName: str = Query(...), albumName: str = Query(...), 
                   db: Session = Depends(returnDB)):
    results = db.query(tblArtists, tblAlbums, tblSongs)

    return {"reply": True}


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
        return {"message": "User already downloaded this song.", "file": output}

    path_str = os.path.join("SongStorage", filename)
    yt_stream.download(output_path="SongStorage", filename=filename)

    cleaned_duration = extractSongLength(path_str)

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
def stream_song_download(songName: str = Query(...), start: int = Query(..., default=0), db: Session = Depends(returnDB), request: Request = None):
    #This is meant to play songs that have been downloaded
    #It will be a stream endpoint that will stream the song to the client

    query = select(tblSongs.song_mp3_audio_path).where(tblSongs.song_name.like(f"%{songName}%"))
    output = db.execute(query).scalars().first()

    file_size = os.path.getsize(output)
    range_header = request.headers.get('Range', None)

    def iterateFile(begin: int = 0):
        with open(output, mode="rb") as file_audio:
            file_audio.seek(begin)
            while True:
                data = file_audio.read(1024)
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








