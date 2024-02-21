class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

module.exports = {
  Track,
}
