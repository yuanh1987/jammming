## Synopsis

Jammming works in conjunction with Spotify platform. The app is designed to retrieve a list a tracks and allow users to upload a customized playlist back to their Spotify user account. 

## Code Example

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

## Motivation

Capstone project for Codecademy "Build Front-end Web Application from Scratch" course

## Installation

This project can be tested with node by enter 'npm start' from the project directory

## API Reference

Relevant Spotify API can be found under this link:
https://developer.spotify.com/documentation/web-api/reference/