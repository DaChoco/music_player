#ORM
from pickle import TRUE
from re import S
from sqlalchemy import INTEGER, Column, ForeignKey, Integer, String, create_engine, LargeBinary, DATETIME, UUID, TEXT, text
from sqlalchemy.orm import sessionmaker, relationship, declarative_base

Base = declarative_base()

#One Artist -> Many Songs
class tblArtists(Base):
    __tablename__ = 'tblArtists'

    artistID = Column(Integer, primary_key=True, autoincrement=True)
    artist_name = Column(String, unique=True)
    artist_dob = Column(TEXT)
    date_formed = Column(TEXT)
    country_of_origin = Column(String)

    Songs_to_Artists = relationship("tblSongs", back_populates="Songs_to_Artists", cascade="all, delete-orphan")
    Artists_to_Albums = relationship("tblAlbums", back_populates="Artists_to_Albums", cascade="all, delete-orphan")

#One Album -> Many Songs

class tblAlbums(Base):
    __tablename__ = "tblAlbums"

    albumID = Column(Integer, primary_key=True, autoincrement=True)
    album_cover= Column(TEXT, nullable=False)
    album_name = Column(String)
    release_date = Column(TEXT)
    copyright_owner = Column(String)
    artistID = Column(Integer, ForeignKey("tblArtists.artistID"))

    Songs_to_Albums = relationship("tblSongs", back_populates="Songs_to_Albums", cascade="all, delete-orphan")
    Artists_to_Albums = relationship("tblArtists", back_populates="Songs_to_Artists")

class tblSongs(Base):
    __tablename__ = "tblSongs"

    songID = Column(Integer, primary_key=True, autoincrement=True)
    song_name = Column(String)
    release_date = Column(TEXT)
    song_mp3_url = Column(TEXT, nullable=False)
    song_mp3_audio_path = Column(TEXT, nullable=True) #For downloads
    song_len = Column(String) #In 00:00
    song_img_url = Column(TEXT) #Fine if its null as then its likely part of an album and when its null we fall back on the album cover
    artistID = Column(Integer, ForeignKey("tblArtists.artistID"))
    albumID = Column(Integer, ForeignKey("tblAlbums.albumID"), nullable=True)

    Songs_to_Artists = relationship("tblArtists", back_populates="Songs_to_Artists")
    Songs_to_Albums = relationship("tblAlbums", back_populates="Songs_to_Albums")