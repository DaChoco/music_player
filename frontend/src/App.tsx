
import './styles/App.css'
import { Route, Routes } from 'react-router-dom'

import { LibraryPage, SearchPage, LandingPage } from './pages'
function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage></LandingPage>}></Route>
      <Route path='/search' element={<SearchPage></SearchPage>}></Route>

      <Route path='/library' element={<LibraryPage></LibraryPage>}></Route>
      <Route path='/library/artists'></Route>

      <Route path='/library/songs'></Route>
      <Route path='/library/songs/:songID/page'></Route> {/* This is the page for the song player */}

      <Route path='/library/albums'></Route>
      <Route path='/library/playlists'></Route>


    </Routes>
  )
}

export default App
