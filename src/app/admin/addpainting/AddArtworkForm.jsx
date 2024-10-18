'use client'

import { useState, useEffect } from 'react'
import styles from './addartworkform.module.scss'
import Modal from './Modal'

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/db/firebase'
import { validatePainting, requiredFields } from '@/db/utils'
import { truncateDeep } from '@/utils/main'

import Painting from '@/components/Painting'

// {
//     title
//     description
//     materials
//     dimensions {}
//     dateCreated
//     price
//     mainPhoto
//     extraPhotos []
// }


export default function AddArtworkForm() {
    const [staged, setStaged] = useState({})
    const [errors, setErrors] = useState({})
    const [valid, setValid] = useState(false)
    const [verified, setVerified] = useState(false)
    const [previewing, setPreviewing] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // shortened display version of staged (mainly so img links dont crowd)
    const [abbr, setAbbr] = useState({})

    // TODO: reset verified whenever a field changed

    // photo files
    // const [mainPhoto, setMainPhoto] = useState(null)
    // const [extraPhotos, setExtraPhotos] = useState([])


    useEffect(() => {
        validate()
        setAbbr(truncateDeep(staged, 15))
    }, [staged])

    function validate() {
        console.log('validating')
        const [isValid, errors] = validatePainting(staged)
        setValid(isValid)
    }

    function updateField(key, e) {
        if (['title', 'description', 'materials', 'price'].includes(key)) {
            setStaged(prev => ({ ...prev, [key]: e.target.value }))
        }
        if (key == 'mainPhoto') handleMainPhotoUpload(e)
        if (key == 'extraPhotos') handleExtraPhotosUpload(e)
    }

    function handleMainPhotoUpload(e) {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            // setMainPhoto(file)
            reader.onload = event => {
                setStaged(prev => ({ ...prev, mainPhoto: event.target.result }))
            }
            reader.readAsDataURL(file)
        } else {
            console.log('Main photo upload failed')
        }
    }

    function handleExtraPhotosUpload(e) {
        const files = e.target.files
        if (files.length < 1) return
        try {
            for (let file of files) {
                // setExtraPhotos(prev => [ ...prev, file ])
                const reader = new FileReader()
                reader.onload = event => {
                    setStaged(prev => ({
                        ...prev,
                        extraPhotos: (prev.extraPhotos || []).concat(event.target.result)
                    }))
                }
                reader.readAsDataURL(file)
            }
        } catch (err) {
            console.log('Extra photos upload failed')
        }
    }

    function deleteExtraPhoto(idx) {
        setStaged(prev => ({
            ...prev,
            extraPhotos: [...prev.extraPhotos.slice(0, idx), ...prev.extraPhotos.slice(idx + 1)]
        }))
    }

    function handlePreview(e) {
        e.preventDefault()
        
        // let valid = validate()
        if (valid) {
            setPreviewing(true)
        } else {
            console.log('fix your mistakes')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)

        // upload the photos to storage
        const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staged)
        })
        const { mainPhotoUrl, extraPhotoUrls, id } = await uploadResponse.json()
        console.log('main', mainPhotoUrl)
        console.log('extra', extraPhotoUrls)
        console.log('id', id)


        // the final version of the painting, as it will be stored in databse
        const painting = { ...staged, id, mainPhoto: mainPhotoUrl, extraPhotos: extraPhotoUrls }
        console.log('final painting: ', painting)

        // post the painting to firestore
        const postResponse = await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(painting)
        })
        const res = await postResponse.json()
        console.log('post response: ', res)

        setSubmitting(false)
    }




    

    // function validate() {
    //     const preview = getPreviewObject()
    //     // const isValid = validatePainting(finalPainting)
    //     const [ isValid, errors ] = validatePainting(preview)
    //     // handle any errors and apply them to state here

    //     console.log(isValid, errors)
    //     setValid(isValid)
    //     setErrors(errors)
    //     return isValid
    // }

    // function resetField(key) {

    // }

    // function validateField(key, value) {

    // }


    // TODO: onSubmit --> upload all images and link their URLs to painting obj
    // before that -- add option to preview image entry
    // exactly how it would show in /gallery/artId
    // i.e make artworkDisplay() component

    return (
        <>
            <form className={styles.form} style={{ opacity: submitting ? 0.3 : 1, transition: 'opacity var(--trans)' }}>

                <h3>Title</h3>
                <input
                    placeholder='Salad Finger Meadows'
                    onChange={e => updateField('title', e)}
                    value={staged.title || ''}
                    className={errors.title && styles.errorInput}
                />

                <h3>Description</h3>
                <textarea
                    placeholder="A serene landscape capturing nature's gentle whispers"
                    onChange={e => updateField('description', e)}
                    value={staged.description || ''}
                    className={errors.description && styles.errorInput}
                />

                <h3>Materials</h3>
                <input
                    placeholder='Oil on Pan'
                    onChange={e => updateField('materials', e)}
                    value={staged.materials || ''}
                    className={errors.materials && styles.errorInput}
                />

                <h3>Main Image</h3>
                <input
                    type='file'
                    id='imageUpload'
                    onChange={e => updateField('mainPhoto', e)}
                    accept='image/*'
                    style={{ display: 'none' }}
                />

                <div className={`${staged.mainPhoto ? styles.hideButton : ''} ${styles.imageContainer}`}>
                    <img className={styles.imagePreview} src={staged.mainPhoto} />
                    <button
                        onClick={e => {e.preventDefault(); document.getElementById('imageUpload').click()} }
                        className={`${styles.imageButton} ${errors.mainPhoto && styles.errorInput}`}
                    >
                        {staged.mainPhoto ? 'Change' : 'Upload'}
                    </button>
                </div>
                
                <h3>Extra Images <span className='faded'>(optional)</span></h3>
                <input
                    multiple
                    type='file'
                    id='multipleImageUpload'
                    onChange={e => updateField('extraPhotos', e)}
                    accept='image/*'
                    style={{ display: 'none' }}
                />
                
                <div className='flex wrap'>
                    {/* Images uploaded */}
                    {(staged.extraPhotos || []).map((src, i) => (
                        <div className={`${styles.hideButton} ${styles.imageContainer} ${styles.sm}`}>
                            <img className={styles.imagePreview} src={src} />
                            <button
                                onClick={e => { e.preventDefault(); deleteExtraPhoto(i) } }
                                className={`${styles.imageButton} ${errors.extraPhotos && styles.errorInput}`}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {/* Add images button */}
                    <div className={styles.imageContainer + ' ' + styles.sm}>
                        <div className={styles.imagePreview} />
                        <button
                            className={`${styles.imageButton} ${errors.extraPhotos && styles.errorInput}`}
                            onClick={e => {e.preventDefault(); document.getElementById('multipleImageUpload').click()} }
                        >
                            {staged.extraPhotos && staged.extraPhotos.length > 0
                                ? <span style={{ fontSize: '3rem' }}>+</span>
                                : 'Upload'
                            }
                        </button>
                    </div>
                </div>

                <h3>Price</h3>
                <input
                    type='number'
                    placeholder='Priceless'
                    onChange={e => updateField('price', e)}
                    value={staged.price || null}
                    className={errors.price && styles.errorInput}
                />

                <div className='flex sep-sm mt-xl'>
                    <button
                        onClick={handlePreview}
                        className={`secondary beacon ${(valid && !verified) ? 'pulse' : ''}`}
                        disabled={!valid}
                    >
                        Preview your Masterpiece
                    </button>

                    <button
                        onClick={handleSubmit}
                        className={`primary beacon ${(valid && verified) ? 'pulse' : ''}`}
                        disabled={!verified || !valid}
                    >
                        Post it
                    </button>
                </div>

                <h3>Painting data <span className='faded'>(for Ben)</span></h3>
                <pre className='card' style={{  overflowX: 'scroll' }}>
                    <code>
                        {JSON.stringify(abbr, null, 4)}
                    </code>
                </pre>
            </form>

            <Modal
                center
                open={previewing}
                customClose={
                    <button
                        className='primary'
                        style={{
                            position: 'absolute',
                            bottom: 'var(--space-md)',
                            right: 'var(--space-md)',
                        }}
                    >
                        Looks good
                    </button>
                }
                onClose={() => {
                    setPreviewing(false)
                    setVerified(true)
                }}
            >
                { valid && <Painting {...staged} /> }
            </Modal>
        </>
    )
}