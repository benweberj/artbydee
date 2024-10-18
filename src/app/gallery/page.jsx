'use client'

import { useEffect, useState } from 'react'

import Animated from '@/components/Animated'
import Painting from '@/components/Painting'

export default function Gallery() {
  const [art, setArt] = useState([])

  async function fetchPaintings() {
    const paintings = await fetch('/api/paintings').then(res => res.json())
    setArt(paintings)
  }

  useEffect(() => {
    fetchPaintings()
  }, [])


  return (
    
    art.length < 1 ?
      <div className='fs center'>
        <img className='bw' width={100} src='/img/brush.gif' />
      </div>
    :
      <div className='p-xl pt-xxl'>
        {art.map((piece, i) => (
          <Animated threshold='half-in' mode={i % 2 == 0 ? 'fromleft' : 'fromright'} key={`artwork-${i}`}>
            <Painting preview {...piece} />
          </Animated>
        ))}
      </div>

  )
}
