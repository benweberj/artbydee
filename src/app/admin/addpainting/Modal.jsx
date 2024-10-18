import React, { useEffect } from 'react'

import styles from './modal.module.scss'

export default function Modal(props) {
    const { open, onClose, children, center=false, customClose } = props

    return (
        <div className={`${center ? 'center' : ''} ${styles.modal} ${open ? '' : styles.hidden}`}>
            {customClose ?
                React.cloneElement(customClose, { onClick: (e) => { e.preventDefault(); onClose(e) } })
            :
                <button className={styles.close} onClick={onClose}>close</button>
            }

            {children}
        </div>
    )
}