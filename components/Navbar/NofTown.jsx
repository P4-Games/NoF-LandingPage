import React from 'react'
import Link from 'next/link'

function NofTown () {
    return (
        <Link
            href='https://app.gather.town/app/YzUVkrf98XW8wz4a/Number%20One%20Fan'
            // spy='true'
            target='_blank'
            rel='noreferrer'
        >
            <button className='navbar__ul__li__nosotros'>
                NoF Town
            </button>
        </Link>
    )
}

export default NofTown