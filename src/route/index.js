const express = require('express')
const router = express.Router()

const { Track } = require('../class/track')
const { Playlist } = require('../class/playlist')

Track.create('Bambola', 'Betta Lemme', '/img/bambola.png')
Track.create(
  'City of Roses',
  '2Scratch & TAOG',
  '/img/city-of-roses.png',
)
Track.create(
  'Nice to meet ya',
  'Wes Nelson & Yxng Bane',
  '/img/nice-to-meet-ya.png',
)
Track.create('Weekend', 'Liam Payne', '/img/weekend.png')
Track.create(
  'La La Land',
  'Bryce Vine',
  '/img/la-la-land.png',
)
Track.create('Timber', 'Pitbull', '/img/timber.png')
Track.create('Lil Bebe', 'DaniLeigh', '/img/lil-bebe.png')

Track.create('Flowers', 'Miley Cyrus', '/img/flowers.png')

console.log(Track.getList())

Playlist.makeMix(Playlist.create('Favorites'))
Playlist.makeMix(Playlist.create('Work list'))
Playlist.makeMix(Playlist.create('Dance'))

// ================================================================

router.get('/', function (req, res) {
  const list = Playlist.getList()

  res.render('spotify-library', {
    name: 'spotify-library',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})

// ================================================================
router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    name: 'spotify-choose',

    data: {},
  })
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    name: 'spotify-create',

    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      name: 'alert',
      data: {
        message: 'Error',
        info: 'Enter a name for the playlist',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const repeatedName = Playlist.findListByValye(name)

  if (repeatedName.length > 0) {
    return res.render('alert', {
      name: 'alert',
      data: {
        message: 'Error',
        info: 'Playlist with this name already exists',
        link: '/',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    name: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.playlistId)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      name: 'alert',
      data: {
        message: 'Error',
        info: 'No playlist found',
        link: '/',
      },
    })
  }

  res.render('spotify-playlist', {
    name: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      name: 'alert',
      data: {
        message: 'Error',
        info: 'No playlist found',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    name: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValye(value)

  res.render('spotify-search', {
    name: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValye(value)

  console.log(value)

  res.render('spotify-search', {
    name: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// ================================================================
router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)
  const tracks = Track.getList()

  res.render('spotify-track-add', {
    name: 'spotify-track-add',

    data: {
      playlistId: playlist.id,
      tracks: tracks,
      //   link: `/spotify-track-add?playlistId={{playlistId}}&trackId=={{id}}`,
    },
  })
})

router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      name: 'alert',
      data: {
        message: 'Error',
        info: 'No playlist found',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )

  if (!trackToAdd) {
    return res.render('alert', {
      name: 'alert',
      data: {
        message: 'Error',
        info: 'No playlist found',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  if (
    playlist.tracks.some(
      (addedTrack) => addedTrack.id === trackId,
    )
  ) {
    return res.render('alert', {
      name: 'alert',
      data: {
        message: 'Error',
        info: 'Track already added to the playlist',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  playlist.tracks.push(trackToAdd)

  res.render('spotify-playlist', {
    name: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

module.exports = router
