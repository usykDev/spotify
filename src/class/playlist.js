const { Track } = require('./track')

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = this.generateRandomImage()
  }

  generateRandomImage() {
    if (Track.getList().length === 0) {
      return null
    }
    const randomTrack =
      Track.getList()[
        Math.floor(Math.random() * Track.getList().length)
      ]
    return randomTrack.image
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    randomTracks = randomTracks.map((track) => ({
      ...track,
    }))

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValye(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

module.exports = {
  Playlist,
}
