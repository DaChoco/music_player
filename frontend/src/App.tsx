
import './styles/App.css'
import { Route, Routes } from 'react-router-dom'

import { LibraryPage, SearchPage, LandingPage, ProfilePage, UpdateProfile } from './pages'
import { Sidenav } from './components'
import { CreateAudioContext } from './contexts/audioContext'
import { CreateLoginContext } from './contexts/loggedinContext'
function App() {

  return (
    <CreateAudioContext>
      <CreateLoginContext>


        <Routes>
          <Route path='/' element={<LandingPage></LandingPage>}></Route>
          <Route path='/search' element={<SearchPage></SearchPage>}></Route>

          <Route path='/library' element={<LibraryPage></LibraryPage>}></Route>
          <Route path='/favorites'></Route>

          <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
          <Route path='/profile/update' element={<UpdateProfile></UpdateProfile>}></Route>

          <Route path='/library/songs'></Route>
          <Route path='/library/songs/:songID/page'></Route> {/* This is the page for the song player */}

          <Route path='/library/albums'></Route>
          <Route path='/library/playlists'></Route>


        </Routes>
      </CreateLoginContext>

    </CreateAudioContext>
  )
}

export default App
