
import Tilt from 'react-parallax-tilt'
import Image from 'next/image'

import styles from './painting.module.scss'

export default function Painting(props) {
    const {
        preview = false,
        i=0,
        title,
        description,
        materials,
        price,
        mainPhoto,
        extraPhotos = []
    } = props

    return (
        <div className={`${styles.entry} ${i % 2 == 0 ? '' : 'rev'}`}>
            <Tilt perspective={5000} glareEnable transitionSpeed={10000} style={{ borderRadius: 'var(--corners)', overflow: 'hidden' }}>
                <Image
                    // priority={i < 2}
                    alt={description}
                    src={mainPhoto || '/img/placeholder.png'}
                    width={1000} height={1000}
                    className={`rounded ${styles.photo}`}
                />
            </Tilt>

            <div className={styles.info} style={{ maxWidth: 300 }}>
                <h2 className='bold mb-xs text-center'>{title}</h2>
                <p className='text-center faded'>{materials}</p>
            </div>

        </div>
    )
}