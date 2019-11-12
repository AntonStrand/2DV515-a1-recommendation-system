'use strict'

/** pearson :: [Rating] -> [Rating] -> Number */
const pearson = as => bs => {
  let sumA, sumB, sumAsq, sumBsq, pSum, n
  sumA = sumB = sumAsq = sumBsq = pSum = n = 0

  as.forEach(a => {
    bs.forEach(b => {
      if (a.movie_id === b.movie_id) {
        sumA += a.rating
        sumB += b.rating
        sumAsq += a.rating ** 2
        sumBsq += b.rating ** 2
        pSum += a.rating * b.rating
        n++
      }
    })
  })

  if (n == 0) return 0

  const num = pSum - (sumA * sumB) / n
  const den = Math.sqrt((sumAsq - sumA ** 2 / n) * (sumBsq - sumB ** 2 / n))
  return num / den
}

module.exports = pearson
