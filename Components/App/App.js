import React, { Component } from 'react';
import './App.css';

import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
  super(props);

  this.state = {searchResults:[],
                playlistName: 'New Playlist',
                playlistTracks:[]}

  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  this.search = this.search.bind(this);
  }

//this method checks if a selected song pre-exists in the playlist. If not, add to the end of the list and update state
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
    tracks.push(track);
    this.setState({tracks});
    }
  }

//this method removes a selected song by its track id and update state
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({playlistTracks:tracks});
  }

//this method allows users to update playlist name
  updatePlaylistName(name) {
    this.setState({playlistName:name});
  }

//this method saves playlist name to user's spotify account
  savePlaylist() {
    const tracks = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, tracks).then(() => {
    this.setState({playlistName:'New Playlist', playlistTracks:[]});
    console.log(this.state.playlistName); //debug purpose
    });
  }

//this method updates search result from spotify API
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
    console.log(term); //debug purpose
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
