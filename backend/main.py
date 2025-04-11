#FASTAPI
import select
from fastapi import FastAPI, Query, middleware, Depends
from fastapi.middleware.cors import CORSMiddleware
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

def createConn():
    #Create a connection to the database
    conn = sql.connect('music.db')
    return conn

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
    #these songs will be mapped to components in the gui of the mp3 player
    query = select(tblSongs.song_name, 
                   tblSongs.release_date, 
                   tblSongs.song_mp3_audio_path, 
                   tblSongs.song_len, 
                   tblArtists.artist_name).join(tblArtists, tblSongs.artistID == tblArtists.artistID)
    output = db.execute(query).mappings().all()
    return output

@app.get("/search/{artistid}")
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
    if yt_url == None:
        return {"message": "Apologies, but you haven't added a song"}
    
    yt = YouTube(yt_url)

    song_length = yt.length
    song_cover = yt.thumbnail_url
    song_title = yt.title
    song_release = yt.publish_date

    song_artist = yt.author
    song_artist_yt_id = yt.channel_id

    yt_stream = yt.streams.filter(only_audio=True).first()
    
    os.makedirs("SongStorage", exist_ok=True)
    folder = Path("SongStorage")
    filename = f"{song_title}.mp4"
    
    file_names = [f.name for f in folder.iterdir() if f.is_file()]
    if filename in file_names:
        query = select(tblSongs.song_name, tblSongs.release_date, tblSongs.song_mp3_audio_path)
        output = db.execute(query).mappings().all()
        return {"message": "User already downloaded this song.", "file": output }

    path_str = os.path.join("SongStorage", filename)
    yt_stream.download(output_path="SongStorage", filename=filename)

    find_if_artist_exist = db.execute(select(tblArtists.artistID).where(tblArtists.artist_name == song_artist)).scalars().first()
    print(find_if_artist_exist)
    if find_if_artist_exist:
        #the point of this is so that artists can be easily added via a download alone, if they already exist, we skip them
        print("The artist already exists, so don't create them")
        new_song = tblSongs(song_name=song_title, release_date=song_release, song_mp3_url=yt_url, song_mp3_audio_path=path_str, song_len=song_length, artistID=find_if_artist_exist)
    else:
        new_artist = tblArtists(artist_name=song_artist)
        db.add(new_artist)
        db.commit()
        db.flush()
        db.refresh(new_artist)
        
        new_song = tblSongs(song_name=song_title, release_date=song_release, song_mp3_url=yt_url, song_mp3_audio_path=path_str, song_len=song_length, artistID=new_artist.artistID)
    
    db.add(new_song)
    db.commit()
    db.flush()
    db.refresh(new_song)

    
    query = select(tblSongs.song_name, tblSongs.release_date, tblSongs.artistID)
    output = db.execute(query).mappings().all()
    
    return {"Length": yt.length, "artistName": song_artist, "output": output}

@app.get("/songs/downloads/streams")
def playSongs():
    #This is meant to play songs that have been downloaded
    #It will be a stream endpoint that will stream the song to the client

    return {"message": "This is the stream endpoint"}

@app.get("/songs/cloud/streams")
def streamSongs():
    #This is meant to play songs that are in the cloud - Hosted on S3
    #It will be a stream endpoint that will stream the song to the client

    return {"message": "This is the stream endpoint"}


#testing the db with normal sqlite3
myconn = createConn()
cursor = myconn.cursor()

cursor.execute("SELECT * FROM tblArtists")
Artistrows = cursor.fetchall()
for row in Artistrows:
    print(row)

cursor.execute("SELECT * FROM tblSongs")

Songrows = cursor.fetchall()
for row in Songrows:
    print(row)

cursor.close()
myconn.close()





