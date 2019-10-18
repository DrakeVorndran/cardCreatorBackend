const shuffle = (deck) => {
  let marker1 = deck.length
  let marker2 = NaN
  while( marker1 > 0 ) {
    marker1 -= 1
    marker2 = Math.floor(Math.random() * marker1)
    const hold = deck[marker1]
    deck[marker1] = deck[marker2]
    deck[marker2] = hold
  }
  return deck
}

module.exports = shuffle