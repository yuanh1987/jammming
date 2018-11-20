const clientId = '81c620bf4538472fbd08ae49c584ca99';
//const redirectUri = 'http://localhost:3000/';
const redirectUri = 'https://jho.surge.sh';

let accessToken;
let expiresIn;

const Spotify = {
  //this methods gets access token to connect to Spotify API
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if(hasAccessToken && hasExpiresIn) {
            accessToken = hasAccessToken[1];
            expiresIn = Number(hasExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const uri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = uri;
        }
    },

    //this methods uses access token to search under Spotify platform
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&artist&album&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'}}).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log('Request Failed!');
          }}).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
            }));
        });
    },

    //this method saves customized playlist to user's Spotify account
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'};
        let userId;
        //GET current user's ID
        return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
          if(response.ok) {
            return response.json();
          }
          }).then(jsonResponse => {
            userId = jsonResponse.id;
        //POST a new playlist with the input name to the current user's Spotify account. Receive the playlist ID back from the request.
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {headers: headers, method: 'POST', body: JSON.stringify({name: playlistName})}).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log('Request Failed!');
          }}).then(jsonResponse => {
            const playlistId = jsonResponse.id;
        //POST the track URIs to the newly-created playlist, referencing the current user's account (ID) and the new playlist (ID)
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {headers: headers, method: 'POST', body: JSON.stringify({uris: trackURIs})
                });
            });
        });
    }
}

export default Spotify;
